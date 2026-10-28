import { NextRequest, NextResponse } from "next/server";
import { geldigKenmerk } from "@/lib/wedstrijdbal/opslag";
import { verwerk } from "@/lib/wedstrijdbal/verwerk";

/**
 * Mollie meldt hier dat een betaling veranderde, met enkel het nummer van de
 * betaling. Wat er echt gebeurde, vragen we zelf aan Mollie; zo kan niemand
 * een betaling vervalsen door dit adres aan te roepen.
 *
 * Het kenmerk van de bestelling staat in het adres, dat geven we zelf mee
 * bij het aanmaken van de betaling.
 *
 * Een foutcode laat Mollie het later opnieuw proberen. Dat willen we enkel
 * als er iets misliep dat vanzelf kan overgaan, zoals het mailen.
 */
export async function POST(request: NextRequest) {
  const kenmerk = request.nextUrl.searchParams.get("b");
  const id = (await request.formData().catch(() => null))?.get("id");
  if (!geldigKenmerk(kenmerk) || typeof id !== "string") return new NextResponse(null, { status: 200 });
  try {
    await verwerk(kenmerk, id);
    return new NextResponse(null, { status: 200 });
  } catch (fout) {
    console.error("[wedstrijdbal] webhook mislukt:", fout);
    return new NextResponse(null, { status: 500 });
  }
}
