// app/api/kws-cup/route.ts
//
// Bewaart en levert het tornooischema. De Tornooiplanner (de lokale app van de
// club) stuurt hier het schema naartoe met een POST; de publieke pagina haalt
// het op met een GET. Zo is een wijziging meteen zichtbaar, zonder deploy.
//
// Nodig in Vercel:
//   - integratie "Blob" toevoegen (gratis tier volstaat ruimschoots)
//   - omgevingsvariabele KWS_CUP_TOKEN met een lang, willekeurig wachtwoord
//     (datzelfde token vul je in bij de Tornooiplanner)

import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";   // nooit cachen: het schema kan wijzigen
export const runtime = "nodejs";

const BESTAND = "kws-cup/schema.json";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: BESTAND, limit: 1 });
    if (blobs.length === 0) {
      return NextResponse.json(
        { fout: "Er is nog geen schema gepubliceerd." },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }
    const antwoord = await fetch(blobs[0].url, { cache: "no-store" });
    const gegevens = await antwoord.json();
    return NextResponse.json(gegevens, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return NextResponse.json(
      { fout: "Kon het schema niet ophalen." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
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

  await put(BESTAND, JSON.stringify(gegevens), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return NextResponse.json({
    ok: true,
    wedstrijden: g.wedstrijden.length,
    reeksen: g.reeksen.length,
    tijd: new Date().toISOString(),
  });
}
