import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { WEDSTRIJDBAL } from "@/app/sponsoring/inhoud";
import { maakBetaling, mollieSleutel, testcodeKlopt } from "@/lib/wedstrijdbal/mollie";
import { bewaarBestelling, geldigKenmerk, opslagBeschikbaar } from "@/lib/wedstrijdbal/opslag";
import { verwerk } from "@/lib/wedstrijdbal/verwerk";

/**
 * Een wedstrijdbal bestellen en meteen betalen via Mollie.
 *
 *  GET  ?test=<code>    staat online betalen aan (bepaalt de knop)
 *  POST                 bestelling aanmaken, antwoordt met de betaalpagina
 *  POST ?b=<kenmerk>    de bedankpagina: hoe staat de betaling ervoor
 *
 * Zonder live-sleutel antwoordt de POST met { uit: true }, en verstuurt het
 * formulier de bestelling zoals vroeger, enkel als mail. Met de code uit de
 * testlink wordt het een testbetaling (zie lib/wedstrijdbal/mollie.ts).
 *
 * De mails vertrekken vanaf de server, zodra er betaald is: via de
 * bedankpagina of via de webhook van Mollie, wie eerst is.
 */

const VELDEN = ["name", "company", "street", "zip", "city", "vat", "email", "phone", "match"] as const;
const VERPLICHT = ["name", "street", "zip", "city", "email", "phone"];

function gegevensUit(bron: Record<string, unknown>): Record<string, string> | null {
  const gegevens: Record<string, string> = {};
  for (const veld of VELDEN) {
    gegevens[veld] = typeof bron[veld] === "string" ? (bron[veld] as string).trim().slice(0, 300) : "";
  }
  if (VERPLICHT.some((v) => !gegevens[v])) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(gegevens.email)) return null;
  return gegevens;
}

function kanBetalen(test: boolean): boolean {
  return Boolean(mollieSleutel(test)) && opslagBeschikbaar();
}

export async function GET(request: NextRequest) {
  const test = testcodeKlopt(request.nextUrl.searchParams.get("test"));
  return NextResponse.json({ betalen: kanBetalen(test), test: test && kanBetalen(true) });
}

export async function POST(request: NextRequest) {
  const kenmerk = request.nextUrl.searchParams.get("b");
  if (kenmerk !== null) return bedankpagina(kenmerk);

  const invoer = await request.json().catch(() => null);
  if (!invoer || typeof invoer !== "object") return NextResponse.json({ fout: "Ongeldige bestelling." }, { status: 400 });
  const test = testcodeKlopt((invoer as Record<string, unknown>).testcode);
  const sleutel = mollieSleutel(test);
  if (!sleutel || !opslagBeschikbaar()) return NextResponse.json({ uit: true });

  const gegevens = gegevensUit(invoer as Record<string, unknown>);
  if (!gegevens) return NextResponse.json({ fout: "Niet alle verplichte velden zijn ingevuld." }, { status: 400 });

  const nieuw = randomUUID();
  const origin = request.nextUrl.origin;
  try {
    const betaling = await maakBetaling(sleutel, {
      bedrag: WEDSTRIJDBAL.bedrag,
      omschrijving: `Wedstrijdbal KWS Linkhout, ${gegevens.company || gegevens.name}`.slice(0, 255),
      terugUrl: `${origin}/sponsoring/betaald?b=${nieuw}`,
      // Op localhost kan Mollie de site niet bereiken; daar doet de
      // bedankpagina het alleen.
      webhookUrl: origin.startsWith("https://") ? `${origin}/api/wedstrijdbal/webhook?b=${nieuw}` : undefined,
      kenmerk: nieuw,
    });
    const checkout = betaling._links.checkout?.href;
    if (!checkout) throw new Error("Mollie gaf geen betaalpagina terug.");
    await bewaarBestelling({
      kenmerk: nieuw,
      betaling: betaling.id,
      aangemaakt: new Date().toISOString(),
      bedrag: WEDSTRIJDBAL.bedrag,
      test,
      gegevens,
    });
    return NextResponse.json({ checkout });
  } catch (fout) {
    console.error("[wedstrijdbal] betaling aanmaken mislukt:", fout);
    return NextResponse.json({ fout: "De betaling kon niet gestart worden." }, { status: 502 });
  }
}

async function bedankpagina(kenmerk: string) {
  if (!geldigKenmerk(kenmerk)) return NextResponse.json({ fout: "Onbekende bestelling." }, { status: 404 });
  try {
    const stand = await verwerk(kenmerk);
    if (!stand) return NextResponse.json({ fout: "Onbekende bestelling." }, { status: 404 });
    return NextResponse.json(stand, { headers: { "Cache-Control": "no-store" } });
  } catch (fout) {
    // Is er betaald maar liep het mailen mis, dan probeert de webhook opnieuw.
    console.error("[wedstrijdbal] verwerken mislukt:", fout);
    return NextResponse.json({ fout: "De betaling kon niet opgevraagd worden." }, { status: 502 });
  }
}
