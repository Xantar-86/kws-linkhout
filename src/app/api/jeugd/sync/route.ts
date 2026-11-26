import { NextRequest, NextResponse } from "next/server";
import { databaseBeschikbaar } from "@/lib/supabase";
import { cronGeautoriseerd } from "@/lib/social/omgeving";
import { spondAanmelding, synchroniseer } from "@/lib/jeugd/spond";

/**
 * Nachtelijke synchronisatie van het spelersdossier met Spond (cron in
 * vercel.json). ?volledig=1 haalt het hele seizoen op in plaats van de
 * laatste 45 dagen.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (!cronGeautoriseerd(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 401 });
  }
  if (!databaseBeschikbaar()) return NextResponse.json({ error: "Database niet ingesteld" }, { status: 500 });
  const aanmelding = spondAanmelding();
  if (!aanmelding) return NextResponse.json({ error: "SPOND_EMAIL of SPOND_WACHTWOORD ontbreekt" }, { status: 500 });
  try {
    const resultaat = await synchroniseer({
      aanmelding,
      volledig: request.nextUrl.searchParams.get("volledig") === "1",
      bron: "cron",
    });
    return NextResponse.json({ ok: true, ...resultaat });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
