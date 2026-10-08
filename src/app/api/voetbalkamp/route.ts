import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { KAMP, controleer, nogOpen, volgendNummer, type KampInschrijving, type KampInvoer } from "@/lib/voetbalkamp/kamp";
import { alleInschrijvingen, bewaarInschrijving } from "@/lib/voetbalkamp/opslag";
import { stuurBevestiging } from "@/lib/voetbalkamp/mail";

/**
 * Een inschrijving voor het voetbalkamp aannemen.
 *
 * Eerst bewaren, dan mailen: een mail die niet vertrekt is lastig, een
 * inschrijving die nergens staat is erger. Mislukt het bewaren, dan zeggen we
 * dat, zodat niemand denkt dat zijn kind ingeschreven is.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const laatste = new Map<string, number>();
const REM_MS = 5_000;

function teSnel(ip: string): boolean {
  const nu = Date.now();
  const vorige = laatste.get(ip);
  laatste.set(ip, nu);
  if (laatste.size > 500) {
    for (const [sleutel, tijd] of laatste) if (nu - tijd > REM_MS * 20) laatste.delete(sleutel);
  }
  return typeof vorige === "number" && nu - vorige < REM_MS;
}

export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "onbekend";

  let body: (Partial<KampInvoer> & { website?: string }) | null = null;
  try {
    body = (await request.json()) as Partial<KampInvoer> & { website?: string };
  } catch {
    return NextResponse.json({ ok: false, klachten: ["Onleesbare aanvraag."] }, { status: 400 });
  }

  // Het verborgen veld uit het formulier; een mens vult dat nooit in.
  if (body.website) return NextResponse.json({ ok: true, genegeerd: true });

  if (!nogOpen()) {
    return NextResponse.json(
      { ok: false, klachten: [`De inschrijvingen zijn afgesloten. Mail naar ${KAMP.contact}.`] },
      { status: 409 },
    );
  }
  if (teSnel(ip)) {
    return NextResponse.json(
      { ok: false, klachten: ["Even wachten voor je opnieuw verstuurt."] },
      { status: 429 },
    );
  }

  const invoer: KampInvoer = {
    voornaam: (body.voornaam ?? "").trim(),
    naam: (body.naam ?? "").trim(),
    geboortedatum: (body.geboortedatum ?? "").trim(),
    categorie: (body.categorie ?? "").trim(),
    lid: body.lid as boolean,
    ouderNaam: (body.ouderNaam ?? "").trim(),
    email: (body.email ?? "").trim(),
    telefoon: (body.telefoon ?? "").trim(),
    opmerking: (body.opmerking ?? "").trim() || undefined,
  };
  const klachten = controleer(invoer);
  if (klachten.length > 0) return NextResponse.json({ ok: false, klachten }, { status: 400 });

  let bestaande: KampInschrijving[] | null = null;
  try {
    bestaande = await alleInschrijvingen();
  } catch (fout) {
    console.error("[voetbalkamp] inschrijvingen ophalen mislukt:", fout);
  }

  const inschrijving: KampInschrijving = {
    ...invoer,
    kenmerk: randomUUID().slice(0, 6).toUpperCase(),
    // Konden we de lijst niet lezen, dan liever geen nummer dan een dubbel.
    nummer: bestaande ? volgendNummer(bestaande) : undefined,
    aangemeld: new Date().toISOString(),
    bedrag: KAMP.prijs,
    betaald: false,
  };

  const bewaard = await bewaarInschrijving(inschrijving);
  if (!bewaard.ok) {
    console.error("[voetbalkamp] bewaren mislukt:", bewaard.fout);
    return NextResponse.json(
      {
        ok: false,
        klachten: [`De inschrijving kon niet bewaard worden. Probeer het later opnieuw of mail naar ${KAMP.contact}.`],
      },
      { status: 500 },
    );
  }

  const mail = await stuurBevestiging(inschrijving);
  if (!mail.ok) console.error("[voetbalkamp] bevestiging mislukt:", mail.fout);

  return NextResponse.json({
    ok: true,
    nummer: inschrijving.nummer,
    bedrag: inschrijving.bedrag,
    bevestigingVerstuurd: mail.verstuurd,
  });
}
