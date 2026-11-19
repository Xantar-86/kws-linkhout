// app/api/kws-cup/route.ts
//
// Bewaart en levert het tornooischema. De Tornooiplanner (de lokale app van de
// club) stuurt hier het schema naartoe met een POST; de publieke pagina haalt
// het op met een GET. Zo is een wijziging meteen zichtbaar, zonder deploy.
//
// Nodig in Vercel:
//   - SUPABASE_URL en SUPABASE_SECRET_KEY (zie lib/supabase.ts)
//   - omgevingsvariabele KWS_CUP_TOKEN met een lang, willekeurig wachtwoord
//     (datzelfde token vul je in bij de Tornooiplanner)

import { NextResponse } from "next/server";
import { leesSchema, schrijfSchema } from "../../kws-cup-2026/schema";

export const dynamic = "force-dynamic";   // nooit cachen: het schema kan wijzigen
export const runtime = "nodejs";

export async function GET() {
  const uitkomst = await leesSchema();

  if (uitkomst.staat === "leeg") {
    return NextResponse.json(
      { fout: "Er is nog geen schema gepubliceerd." },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Een opslag die weigert is geen leeg tornooi. Dat verschil hoort in het
  // antwoord te staan, anders zoekt de volgende die dit uitzoekt te lang.
  if (uitkomst.staat === "fout") {
    console.error("[kws-cup] schema onbereikbaar:", uitkomst.reden);
    return NextResponse.json(
      { fout: "Kon het schema niet ophalen.", reden: uitkomst.reden },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(uitkomst.tornooi, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const token = request.headers.get("x-kws-token");
  if (!process.env.KWS_CUP_TOKEN || token !== process.env.KWS_CUP_TOKEN) {
    return NextResponse.json({ fout: "Geen toegang." }, { status: 401 });
  }

  let gegevens: unknown;
  try {
    gegevens = await request.json();
  } catch {
    return NextResponse.json({ fout: "Ongeldige invoer." }, { status: 400 });
  }

  // minimale controle, zodat een verkeerd bestand de pagina niet leegmaakt
  const g = gegevens as { wedstrijden?: unknown[]; reeksen?: unknown[] };
  if (!Array.isArray(g.wedstrijden) || !Array.isArray(g.reeksen)) {
    return NextResponse.json(
      { fout: "Verwacht een export met 'reeksen' en 'wedstrijden'." },
      { status: 400 },
    );
  }

  try {
    await schrijfSchema(gegevens);
  } catch (fout) {
    console.error("[kws-cup] schema bewaren mislukt:", fout);
    return NextResponse.json({ fout: "Het schema kon niet bewaard worden." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    wedstrijden: g.wedstrijden.length,
    reeksen: g.reeksen.length,
    tijd: new Date().toISOString(),
  });
}
