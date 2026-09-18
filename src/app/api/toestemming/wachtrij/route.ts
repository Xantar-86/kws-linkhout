import { NextRequest, NextResponse } from "next/server";
import { haalBlok, lijstWachtrij, schrapUitWachtrij } from "@/lib/toestemming/opslag";

/**
 * De wachtrij voor de mappenwachter op de pc.
 *
 * GET zonder kenmerk geeft wat er klaarstaat. GET met ?kenmerk=... geeft het
 * versleutelde blok van die inzending; de wachter ontsleutelt dat zelf met
 * hetzelfde geheim en schrijft de pdf in de juiste ploegmap. POST met een
 * kenmerk haalt de inzending uit de wachtrij, en dat doet de wachter pas nadat
 * het bestand op schijf staat.
 *
 * De server stuurt de namen van spelers dus nooit leesbaar over deze lijn: de
 * lijst bevat enkel kenmerken, en de inhoud is versleuteld.
 */

export const dynamic = "force-dynamic";

function magNiet(request: NextRequest): boolean {
  const sleutel = process.env.TOESTEMMING_SLEUTEL;
  if (!sleutel) return true;
  return request.headers.get("authorization") !== `Bearer ${sleutel}`;
}

export async function GET(request: NextRequest) {
  if (magNiet(request)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const kenmerk = request.nextUrl.searchParams.get("kenmerk");
  if (!kenmerk) {
    const wachtrij = await lijstWachtrij();
    return NextResponse.json({ aantal: wachtrij.length, wachtrij });
  }

  if (!/^[a-z0-9-]{4,40}$/i.test(kenmerk)) {
    return NextResponse.json({ error: "Ongeldig kenmerk" }, { status: 400 });
  }

  const blok = await haalBlok(kenmerk);
  if (!blok) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(blok), {
    headers: {
      "content-type": "application/octet-stream",
      "cache-control": "no-store",
    },
  });
}

export async function POST(request: NextRequest) {
  if (magNiet(request)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  let kenmerk: string | undefined;
  try {
    ({ kenmerk } = (await request.json()) as { kenmerk?: string });
  } catch {
    return NextResponse.json({ error: "Onleesbare aanvraag" }, { status: 400 });
  }

  if (!kenmerk || !/^[a-z0-9-]{4,40}$/i.test(kenmerk)) {
    return NextResponse.json({ error: "Ongeldig kenmerk" }, { status: 400 });
  }

  const weg = await schrapUitWachtrij(kenmerk);
  return NextResponse.json({ ok: weg });
}
