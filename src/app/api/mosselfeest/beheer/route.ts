import { randomUUID, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { bedragVan } from "@/lib/mosselfeest/kaart";
import {
  alleInschrijvingen,
  bewaarInschrijving,
  schrapInschrijving,
  telOp,
  zetBetaald,
  type Inschrijving,
} from "@/lib/mosselfeest/opslag";
import {
  controleerHandmatig,
  schoonAantallenRuim,
  type HandmatigeInvoer,
} from "@/lib/mosselfeest/nakijken";

/**
 * Het beheer van de inschrijvingen, voor de overzichtspagina.
 *
 * GET geeft de totalen en de lijst. POST zet het vinkje "betaald", schrapt een
 * inschrijving, of voegt er een toe die niet online gebeurd is: een kaart die
 * iemand heeft afgegeven, of een hele stapel als verzamelpost. Zo zit alles in
 * hetzelfde totaal en hoeft er nergens nog geteld te worden.
 *
 * Alles vraagt het wachtwoord uit MOSSELFEEST_WACHTWOORD, dat de organisatoren
 * onder elkaar houden.
 *
 * Er is geen sessie en geen koekje: de pagina houdt het wachtwoord bij in het
 * tabblad en stuurt het mee bij elke aanvraag. Dat is genoeg voor een
 * ledenlijst van een eetfestijn en er komt geen aanmeldsysteem bij kijken.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** Vergelijken zonder te verklappen hoeveel tekens er juist waren. */
function zelfdeGeheim(gegeven: string, verwacht: string): boolean {
  const a = Buffer.from(gegeven);
  const b = Buffer.from(verwacht);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function magNiet(request: NextRequest): boolean {
  const wachtwoord = process.env.MOSSELFEEST_WACHTWOORD;
  if (!wachtwoord) return true;
  const kop = request.headers.get("authorization") ?? "";
  if (!kop.startsWith("Bearer ")) return true;
  return !zelfdeGeheim(kop.slice(7), wachtwoord);
}

export async function GET(request: NextRequest) {
  if (magNiet(request)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const inschrijvingen = await alleInschrijvingen();
  return NextResponse.json({
    totalen: telOp(inschrijvingen),
    inschrijvingen,
  });
}

export async function POST(request: NextRequest) {
  if (magNiet(request)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  let body: {
    actie?: string;
    kenmerk?: string;
    betaald?: boolean;
  } & Partial<HandmatigeInvoer>;
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Onleesbare aanvraag" }, { status: 400 });
  }

  // Een kaart of een stapel toevoegen. Hier is geen kenmerk nodig, dus dit
  // komt voor de controle op het kenmerk.
  if (body.actie === "toevoegen") {
    const aantallen = schoonAantallenRuim((body.aantallen ?? {}) as Record<string, unknown>);
    const invoer: Partial<HandmatigeInvoer> = {
      bron: body.bron,
      naam: (body.naam ?? "").trim(),
      voornaam: (body.voornaam ?? "").trim() || undefined,
      zitting: (body.zitting ?? "").trim() || undefined,
      aantallen,
      betaald: body.betaald,
      opmerking: (body.opmerking ?? "").trim() || undefined,
      ingevoerdDoor: (body.ingevoerdDoor ?? "").trim() || undefined,
      kaartnummer:
        typeof body.kaartnummer === "number" && body.kaartnummer > 0
          ? Math.floor(body.kaartnummer)
          : undefined,
    };

    const klachten = controleerHandmatig(invoer);
    if (klachten.length > 0) {
      return NextResponse.json({ error: klachten.join(" "), klachten }, { status: 400 });
    }

    const inschrijving: Inschrijving = {
      kenmerk: randomUUID().slice(0, 6).toUpperCase(),
      aangemeld: new Date().toISOString(),
      naam: invoer.naam!,
      voornaam: invoer.voornaam,
      kaartnummer: invoer.kaartnummer,
      zitting: invoer.zitting ?? "",
      aantallen,
      bron: invoer.bron,
      ingevoerdDoor: invoer.ingevoerdDoor,
      opmerking: invoer.opmerking,
      bedrag: bedragVan(aantallen),
      // Een kaart wordt meestal contant afgerekend, dus standaard betaald.
      betaald: invoer.betaald !== false,
      betaaldOp: invoer.betaald !== false ? new Date().toISOString() : undefined,
    };

    // Geen mail: de organisator staat er zelf bij en er is geen adres.
    const bewaard = await bewaarInschrijving(inschrijving);
    if (!bewaard.ok) {
      return NextResponse.json({ error: bewaard.fout }, { status: 500 });
    }
    return NextResponse.json({ ok: true, inschrijving });
  }

  const kenmerk = (body.kenmerk ?? "").trim();
  if (!/^[A-Z0-9-]{4,40}$/i.test(kenmerk)) {
    return NextResponse.json({ error: "Ongeldig kenmerk" }, { status: 400 });
  }

  if (body.actie === "betaald") {
    const resultaat = await zetBetaald(kenmerk, body.betaald !== false);
    if (!resultaat.ok) return NextResponse.json({ error: resultaat.fout }, { status: 404 });
    return NextResponse.json({ ok: true, inschrijving: resultaat.inschrijving });
  }

  if (body.actie === "schrappen") {
    const weg = await schrapInschrijving(kenmerk);
    if (!weg) return NextResponse.json({ error: "Inschrijving niet gevonden" }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Onbekende actie" }, { status: 400 });
}
