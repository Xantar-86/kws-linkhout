import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { GERECHTEN } from "@/lib/mosselfeest/kaart";
import {
  alleInschrijvingen,
  bewaarVoorraad,
  haalVoorraad,
  telOp,
  type Voorraad,
} from "@/lib/mosselfeest/opslag";

/**
 * Hoeveel er per dag van elk gerecht voorzien is, tegenover wat er besteld is.
 *
 * Dat is het blad "LeftOvers" uit het Excel-bestand van het bestuur: op de
 * avond zelf wil de keuken weten hoeveel er nog aan de deur verkocht kan
 * worden. Het verschil rekenen we hier uit, zodat het scherm enkel moet tonen.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 30;

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

  const [voorraad, inschrijvingen] = await Promise.all([haalVoorraad(), alleInschrijvingen()]);
  const totalen = telOp(inschrijvingen);

  return NextResponse.json({
    voorraad,
    besteld: totalen.perDagGerecht,
  });
}

export async function POST(request: NextRequest) {
  if (magNiet(request)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  let body: { voorzien?: Record<string, Record<string, unknown>>; door?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Onleesbare aanvraag" }, { status: 400 });
  }

  // Enkel dagen en gerechten van de kaart, en enkel hele getallen. Zo komt er
  // via deze weg niets in de opslag wat het scherm niet kan tonen.
  const voorzien: Voorraad["voorzien"] = { vrijdag: {}, zaterdag: {} };
  for (const dag of ["vrijdag", "zaterdag"] as const) {
    for (const g of GERECHTEN) {
      const waarde = body.voorzien?.[dag]?.[g.id];
      const aantal = typeof waarde === "number" ? Math.floor(waarde) : 0;
      if (aantal > 0) voorzien[dag][g.id] = Math.min(aantal, 100_000);
    }
  }

  const resultaat = await bewaarVoorraad({
    voorzien,
    bijgewerkt: new Date().toISOString(),
    bijgewerktDoor: (body.door ?? "").trim() || undefined,
  });
  if (!resultaat.ok) return NextResponse.json({ error: resultaat.fout }, { status: 500 });

  return NextResponse.json({ ok: true });
}
