import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { KAMP, controleer, volgendNummer, type KampInschrijving, type KampInvoer } from "@/lib/voetbalkamp/kamp";
import {
  alleInschrijvingen,
  bewaarInschrijving,
  haalInschrijving,
  schrapInschrijving,
} from "@/lib/voetbalkamp/opslag";
import { magBinnen } from "@/lib/voetbalkamp/toegang";

/**
 * Het beheer van de inschrijvingen voor het voetbalkamp.
 *
 * GET geeft de lijst. POST zet betaald aan of uit, schrapt een inschrijving,
 * of voegt er een toe die niet online kwam (een papiertje, een telefoontje).
 * Alles vraagt het wachtwoord, zie lib/voetbalkamp/toegang.ts.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  if (!magBinnen(request)) return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  return NextResponse.json({ inschrijvingen: await alleInschrijvingen() });
}

export async function POST(request: NextRequest) {
  if (!magBinnen(request)) return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });

  let body: { actie?: string; kenmerk?: string; betaald?: boolean; ingevoerdDoor?: string } & Partial<KampInvoer>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Onleesbare aanvraag" }, { status: 400 });
  }

  if (body.actie === "toevoegen") {
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
    if (klachten.length > 0) return NextResponse.json({ error: klachten.join(" "), klachten }, { status: 400 });

    const inschrijving: KampInschrijving = {
      ...invoer,
      kenmerk: randomUUID().slice(0, 6).toUpperCase(),
      nummer: volgendNummer(await alleInschrijvingen()),
      aangemeld: new Date().toISOString(),
      bedrag: KAMP.prijs,
      betaald: body.betaald === true,
      betaaldOp: body.betaald === true ? new Date().toISOString() : undefined,
      ingevoerdDoor: (body.ingevoerdDoor ?? "").trim() || undefined,
    };
    const bewaard = await bewaarInschrijving(inschrijving);
    if (!bewaard.ok) return NextResponse.json({ error: bewaard.fout }, { status: 500 });
    return NextResponse.json({ ok: true, inschrijving });
  }

  const kenmerk = (body.kenmerk ?? "").trim();
  if (!/^[A-Z0-9-]{4,40}$/i.test(kenmerk)) {
    return NextResponse.json({ error: "Ongeldig kenmerk" }, { status: 400 });
  }

  if (body.actie === "betaald") {
    const bestaande = await haalInschrijving(kenmerk);
    if (!bestaande) return NextResponse.json({ error: "Inschrijving niet gevonden" }, { status: 404 });
    const betaald = body.betaald !== false;
    const bijgewerkt: KampInschrijving = {
      ...bestaande,
      betaald,
      betaaldOp: betaald ? new Date().toISOString() : undefined,
    };
    const bewaard = await bewaarInschrijving(bijgewerkt);
    if (!bewaard.ok) return NextResponse.json({ error: bewaard.fout }, { status: 500 });
    return NextResponse.json({ ok: true, inschrijving: bijgewerkt });
  }

  if (body.actie === "schrappen") {
    const weg = await schrapInschrijving(kenmerk);
    if (!weg) return NextResponse.json({ error: "Inschrijving niet gevonden" }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Onbekende actie" }, { status: 400 });
}
