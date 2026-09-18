import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  alleInschrijvingen,
  schrapInschrijving,
  telOp,
  zetBetaald,
} from "@/lib/mosselfeest/opslag";

/**
 * Het beheer van de inschrijvingen, voor de overzichtspagina.
 *
 * GET geeft de totalen en de lijst. POST zet het vinkje "betaald" of schrapt
 * een inschrijving. Beide vragen het wachtwoord uit MOSSELFEEST_WACHTWOORD,
 * dat de organisatoren onder elkaar houden.
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

  let body: { actie?: string; kenmerk?: string; betaald?: boolean };
  try {
    body = (await request.json()) as { actie?: string; kenmerk?: string; betaald?: boolean };
  } catch {
    return NextResponse.json({ error: "Onleesbare aanvraag" }, { status: 400 });
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
