import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { maakFormulier } from "@/lib/toestemming/pdf";
import { stuurToestemmingMail } from "@/lib/toestemming/mail";
import { bewaarInWachtrij, ruimOudeOp } from "@/lib/toestemming/opslag";
import { controleer, mapnaam, type Inzending } from "@/lib/toestemming/velden";

/**
 * Een ingevuld toestemmingsformulier aannemen.
 *
 * Wat hier gebeurt, in deze volgorde:
 *  1. nakijken of de inzending volledig is;
 *  2. het clubdocument invullen en afvlakken (lib/toestemming/pdf.ts);
 *  3. de pdf naar de club mailen, en naar de ouder als die een adres gaf;
 *  4. de pdf versleuteld in de wachtrij zetten voor de mappenwachter op de pc.
 *
 * Stap 3 en 4 zijn allebei een aflevering. Lukt er één, dan is het formulier
 * niet verloren, en dat zeggen we ook zo terug.
 */

export const dynamic = "force-dynamic";
// Een pdf invullen en versturen duurt langer dan een gewone aanvraag.
export const maxDuration = 30;

/**
 * Heel eenvoudige rem per ip-adres. Serverloos draait elk exemplaar apart, dus
 * dit houdt geen vastberaden aanvaller tegen. Het houdt wel een script tegen
 * dat in een lus hetzelfde formulier blijft versturen.
 */
const laatsteInzending = new Map<string, number>();
const REM_MS = 20_000;

function teSnel(ip: string): boolean {
  const nu = Date.now();
  const vorige = laatsteInzending.get(ip);
  laatsteInzending.set(ip, nu);
  // Oude sporen opruimen, anders groeit de kaart aan.
  if (laatsteInzending.size > 500) {
    for (const [sleutel, tijd] of laatsteInzending) {
      if (nu - tijd > REM_MS * 10) laatsteInzending.delete(sleutel);
    }
  }
  return typeof vorige === "number" && nu - vorige < REM_MS;
}

export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "onbekend";

  let body: (Partial<Inzending> & { website?: string }) | null = null;
  try {
    body = (await request.json()) as Partial<Inzending> & { website?: string };
  } catch {
    return NextResponse.json({ ok: false, klachten: ["Onleesbare aanvraag."] }, { status: 400 });
  }

  // Het verborgen veld uit het formulier. Een mens vult dat nooit in.
  if (body.website) {
    return NextResponse.json({ ok: true, genegeerd: true });
  }

  if (teSnel(ip)) {
    return NextResponse.json(
      { ok: false, klachten: ["Even wachten voor je opnieuw verstuurt."] },
      { status: 429 },
    );
  }

  const klachten = controleer(body);
  if (klachten.length > 0) {
    return NextResponse.json({ ok: false, klachten }, { status: 400 });
  }

  const inzending = body as Inzending;
  const kenmerk = randomUUID().slice(0, 8);
  const op = new Date();

  let pdf;
  try {
    pdf = await maakFormulier(inzending, {
      adres: `${process.env.SITE_URL ?? request.nextUrl.origin}/toestemming`,
      ip: ip === "onbekend" ? undefined : ip,
      kenmerk,
      op,
    });
  } catch (fout) {
    console.error("[toestemming] pdf invullen mislukt:", fout);
    return NextResponse.json(
      {
        ok: false,
        klachten: [
          "Het formulier kon niet opgemaakt worden. Probeer het later opnieuw of mail naar info@kwslinkhout.be.",
        ],
      },
      { status: 500 },
    );
  }

  const [mail, wachtrij] = await Promise.all([
    stuurToestemmingMail({
      inzending,
      pdf: pdf.bytes,
      bestandsnaam: pdf.bestandsnaam,
      kenmerk,
      op,
    }),
    bewaarInWachtrij({
      kenmerk,
      bestandsnaam: pdf.bestandsnaam,
      ploeg: mapnaam(inzending.ploeg),
      speler: inzending.speler,
      aangemaakt: op.toISOString(),
      pdf: Buffer.from(pdf.bytes).toString("base64"),
    }),
  ]);

  if (!mail.ok) console.error("[toestemming] mailen mislukt:", mail.fout);
  if (!wachtrij.ok) console.error("[toestemming] wachtrij mislukt:", wachtrij.fout);

  if (!mail.ok && !wachtrij.ok) {
    return NextResponse.json(
      {
        ok: false,
        klachten: [
          "Het formulier is opgemaakt maar kon niet afgeleverd worden. Laat het ons weten via info@kwslinkhout.be.",
        ],
      },
      { status: 502 },
    );
  }

  // Achterstand opruimen mag mislukken; het is onderhoud, geen aflevering.
  ruimOudeOp(op).catch((fout) => console.error("[toestemming] opruimen mislukt:", fout));

  return NextResponse.json({
    ok: true,
    kenmerk,
    gemaild: mail.ok,
    kopieNaarOuder: Boolean(mail.naarOuder),
    inWachtrij: wachtrij.ok,
  });
}
