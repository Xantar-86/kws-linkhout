import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { aantalPlaatsen, bedragVan, zitting as zittingVan } from "@/lib/mosselfeest/kaart";
import { stuurBevestiging } from "@/lib/mosselfeest/mail";
import {
  alleInschrijvingen,
  bewaarInschrijving,
  telOp,
  volgendKaartnummer,
  type Inschrijving,
} from "@/lib/mosselfeest/opslag";
import { controleer, schoonAantallen, type InschrijvingInvoer } from "@/lib/mosselfeest/nakijken";

/**
 * Een inschrijving voor het mosselfeest aannemen.
 *
 * De inschrijving wordt versleuteld bewaard en daarna bevestigd per mail.
 * Bewaren komt eerst: een mail die niet vertrekt is lastig, een inschrijving
 * die nergens staat is erger. Mislukt het bewaren, dan zeggen we dat ook en
 * doen we alsof er niets gebeurd is, zodat niemand denkt dat hij ingeschreven
 * is.
 *
 * Naar de club gaat hier niets. Die krijgt één samenvatting per dag, zie
 * /api/mosselfeest/samenvatting. Dat spaart mailtegoed en de overzichtspagina
 * is toch altijd actueel.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const laatste = new Map<string, number>();
const REM_MS = 10_000;

function teSnel(ip: string): boolean {
  const nu = Date.now();
  const vorige = laatste.get(ip);
  laatste.set(ip, nu);
  if (laatste.size > 500) {
    for (const [sleutel, tijd] of laatste) {
      if (nu - tijd > REM_MS * 20) laatste.delete(sleutel);
    }
  }
  return typeof vorige === "number" && nu - vorige < REM_MS;
}

export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "onbekend";

  let body: (Partial<InschrijvingInvoer> & { website?: string }) | null = null;
  try {
    body = (await request.json()) as Partial<InschrijvingInvoer> & { website?: string };
  } catch {
    return NextResponse.json({ ok: false, klachten: ["Onleesbare aanvraag."] }, { status: 400 });
  }

  // Het verborgen veld uit het formulier; een mens vult dat nooit in.
  if (body.website) return NextResponse.json({ ok: true, genegeerd: true });

  if (teSnel(ip)) {
    return NextResponse.json(
      { ok: false, klachten: ["Even wachten voor je opnieuw verstuurt."] },
      { status: 429 },
    );
  }

  const aantallen = schoonAantallen((body.aantallen ?? {}) as Record<string, unknown>);
  const invoer: InschrijvingInvoer = {
    naam: (body.naam ?? "").trim(),
    voornaam: (body.voornaam ?? "").trim(),
    email: (body.email ?? "").trim(),
    telefoon: (body.telefoon ?? "").trim() || undefined,
    zitting: (body.zitting ?? "").trim(),
    aantallen,
    opmerking: (body.opmerking ?? "").trim() || undefined,
  };

  const klachten = controleer(invoer);
  if (klachten.length > 0) {
    return NextResponse.json({ ok: false, klachten }, { status: 400 });
  }

  // Past dit nog in de gekozen zitting? De kaart zet er een maximum op, dus
  // kijken we hier nog eens na. Het formulier toont de vrije plaatsen al, maar
  // tussen het openen en het versturen kan er iemand anders geweest zijn.
  let bestaande: Inschrijving[] | null = null;
  try {
    bestaande = await alleInschrijvingen();
  } catch (fout) {
    console.error("[mosselfeest] inschrijvingen ophalen mislukt:", fout);
  }

  const gekozen = zittingVan(invoer.zitting);
  if (gekozen?.max && bestaande) {
    const nodig = aantalPlaatsen(aantallen);
    {
      const totalen = telOp(bestaande);
      const vrij = totalen.perZitting[gekozen.id]?.vrij ?? gekozen.max;
      if (vrij <= 0) {
        return NextResponse.json(
          {
            ok: false,
            klachten: [`${gekozen.label} is volzet. Kies een andere zitting of kom afhalen.`],
          },
          { status: 409 },
        );
      }
      if (nodig > vrij) {
        return NextResponse.json(
          {
            ok: false,
            klachten: [
              `Er ${vrij === 1 ? "is" : "zijn"} nog ${vrij} plaats${vrij === 1 ? "" : "en"} vrij op ${gekozen.label}, en je bestelling heeft er ${nodig} nodig. Splits de inschrijving of kies een andere zitting.`,
            ],
          },
          { status: 409 },
        );
      }
    }
  }

  const inschrijving: Inschrijving = {
    kenmerk: randomUUID().slice(0, 6).toUpperCase(),
    // Konden we de lijst niet ophalen, dan geven we liever geen nummer dan een
    // nummer dat al bestaat; het overzicht toont dat dan als ontbrekend.
    kaartnummer: bestaande ? volgendKaartnummer(bestaande) : undefined,
    aangemeld: new Date().toISOString(),
    ...invoer,
    bedrag: bedragVan(aantallen),
    betaald: false,
    betaaldBedrag: 0,
  };

  const bewaard = await bewaarInschrijving(inschrijving);
  if (!bewaard.ok) {
    console.error("[mosselfeest] bewaren mislukt:", bewaard.fout);
    return NextResponse.json(
      {
        ok: false,
        klachten: [
          "De inschrijving kon niet bewaard worden. Probeer het later opnieuw of mail naar info@kwslinkhout.be.",
        ],
      },
      { status: 500 },
    );
  }

  const mail = await stuurBevestiging(inschrijving);
  if (!mail.ok) console.error("[mosselfeest] bevestiging mislukt:", mail.fout);

  return NextResponse.json({
    ok: true,
    kenmerk: inschrijving.kenmerk,
    kaartnummer: inschrijving.kaartnummer,
    bedrag: inschrijving.bedrag,
    bevestigingVerstuurd: mail.verstuurd,
  });
}
