/**
 * De kleine stukjes van de Mollie-API die de wedstrijdbal nodig heeft.
 *
 * Geen SDK: het zijn twee verzoeken (een betaling aanmaken en ze opvragen),
 * en zo blijft er niets bij te houden. Of het een test- of een echte betaling
 * is, hangt enkel af van de sleutel: test_... of live_...
 *
 * Twee sleutels, elk met zijn eigen variabele:
 *
 *  - MOLLIE_API_KEY is de echte (live_...). Pas als die er staat, betaalt
 *    iedereen online; zonder gaat de bestelling enkel als mail, zoals vroeger.
 *  - MOLLIE_TEST_API_KEY (test_...) werkt enkel met de testlink
 *    /sponsoring?test=<WEDSTRIJDBAL_TESTCODE>. Zo kan de club online alles
 *    uitproberen, met de echte mails, zonder dat een gewone bezoeker ooit
 *    een nepbetaling doet.
 *
 * Een sleutel met het verkeerde begin wordt genegeerd, zodat een testsleutel
 * nooit per ongeluk de echte wordt.
 *
 * Zie https://docs.mollie.com/reference/create-payment
 */

const API = "https://api.mollie.com/v2/payments";

export type MollieStatus = "open" | "pending" | "authorized" | "paid" | "canceled" | "expired" | "failed";

export interface MollieBetaling {
  id: string;
  status: MollieStatus;
  mode: "test" | "live";
  paidAt?: string;
  method?: string | null;
  _links: { checkout?: { href: string } };
}

export function mollieSleutel(test: boolean): string | null {
  const sleutel = (test ? process.env.MOLLIE_TEST_API_KEY : process.env.MOLLIE_API_KEY)?.trim();
  return sleutel?.startsWith(test ? "test_" : "live_") ? sleutel : null;
}

/** Klopt de code uit de testlink? */
export function testcodeKlopt(code: unknown): boolean {
  const echte = process.env.WEDSTRIJDBAL_TESTCODE?.trim();
  return Boolean(echte && typeof code === "string" && code === echte);
}

async function verzoek(url: string, sleutel: string, body?: unknown): Promise<MollieBetaling> {
  const antwoord = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${sleutel}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await antwoord.json().catch(() => ({}));
  if (!antwoord.ok) {
    throw new Error(`Mollie ${antwoord.status}: ${data.detail ?? data.title ?? "onbekende fout"}`);
  }
  return data as MollieBetaling;
}

export function maakBetaling(
  sleutel: string,
  opties: { bedrag: string; omschrijving: string; terugUrl: string; webhookUrl?: string; kenmerk: string }
): Promise<MollieBetaling> {
  return verzoek(API, sleutel, {
    amount: { currency: "EUR", value: opties.bedrag },
    description: opties.omschrijving,
    redirectUrl: opties.terugUrl,
    // Mollie weigert een webhook die het niet kan bereiken, zoals localhost.
    ...(opties.webhookUrl ? { webhookUrl: opties.webhookUrl } : {}),
    locale: "nl_BE",
    metadata: { kenmerk: opties.kenmerk },
  });
}

export function haalBetaling(sleutel: string, id: string): Promise<MollieBetaling> {
  return verzoek(`${API}/${encodeURIComponent(id)}`, sleutel);
}
