import { del, list, put } from "@vercel/blob";
import { ontsleutelJson, sleutelUit, versleutelJson } from "@/lib/kluis";

/**
 * De bestellingen van een wedstrijdbal.
 *
 * Elke bestelling is één versleuteld blokje in Vercel Blob, onder
 * wedstrijdbal/<kenmerk>/. Er wordt nooit iets overschreven: een overschreven
 * blokje kan door het cachenetwerk van de opslag nog een tijd de oude inhoud
 * teruggeven (zie lib/mosselfeest/opslag.ts). Dus:
 *
 *  - bestelling.bin wordt één keer geschreven, met het nummer van de betaling;
 *  - of er betaald is, vragen we telkens aan Mollie, dat is de waarheid;
 *  - dat de mails vertrokken zijn, is een apart blokje "gemeld". Of dat
 *    bestaat zien we met list(), dat niet langs de cache gaat.
 */

// WEDSTRIJDBAL_MAP laat een lokale proef in een eigen map werken.
const MAP = process.env.WEDSTRIJDBAL_MAP || "wedstrijdbal";

export interface Bestelling {
  kenmerk: string;
  betaling: string;
  aangemaakt: string;
  bedrag: string;
  /** Een testbetaling, via de testlink en de testsleutel. */
  test: boolean;
  gegevens: Record<string, string>;
}

function sleutel(): Buffer | null {
  const geheim = process.env.WEDSTRIJDBAL_SLEUTEL;
  return geheim ? sleutelUit(geheim, "kws-wedstrijdbal") : null;
}

export function opslagBeschikbaar(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN) && Boolean(sleutel());
}

/** Een kenmerk is een uuid; al de rest weigeren we, het komt uit een adres. */
export function geldigKenmerk(kenmerk: string | null): kenmerk is string {
  return Boolean(kenmerk && /^[0-9a-f-]{36}$/.test(kenmerk));
}

export async function bewaarBestelling(bestelling: Bestelling): Promise<void> {
  const key = sleutel();
  if (!key) throw new Error("WEDSTRIJDBAL_SLEUTEL ontbreekt.");
  await put(`${MAP}/${bestelling.kenmerk}/bestelling.bin`, versleutelJson(bestelling, key), {
    access: "public",
    contentType: "application/octet-stream",
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
  });
}

export async function haalBestelling(kenmerk: string): Promise<{ bestelling: Bestelling; gemeld: boolean } | null> {
  const key = sleutel();
  if (!key) return null;
  const { blobs } = await list({ prefix: `${MAP}/${kenmerk}/` });
  const blok = blobs.find((b) => b.pathname.endsWith("/bestelling.bin"));
  if (!blok) return null;
  const antwoord = await fetch(blok.url, { cache: "no-store" });
  if (!antwoord.ok) return null;
  const bestelling = ontsleutelJson<Bestelling>(Buffer.from(await antwoord.arrayBuffer()), key);
  if (!bestelling) return null;
  return { bestelling, gemeld: blobs.some((b) => b.pathname.endsWith("/gemeld")) };
}

/**
 * Het recht om te mailen opeisen. De bedankpagina en Mollie melden zich vaak
 * tegelijk; wie het blokje als eerste schrijft, mailt. De opslag weigert een
 * bestaand blokje te overschrijven, en dat maakt dit een slot.
 */
export async function eisMeldingOp(kenmerk: string): Promise<boolean> {
  try {
    await put(`${MAP}/${kenmerk}/gemeld`, new Date().toISOString(), {
      access: "public",
      contentType: "text/plain",
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: 0,
    });
    return true;
  } catch (fout) {
    // Bestaat het al, dan was iemand ons voor. Anders liep er iets anders mis,
    // en dan moet de oproeper het later opnieuw proberen.
    const { blobs } = await list({ prefix: `${MAP}/${kenmerk}/gemeld` });
    if (blobs.length > 0) return false;
    throw fout;
  }
}

/** Mislukte het mailen, dan het slot weer vrijgeven voor een volgende poging. */
export async function geefMeldingVrij(kenmerk: string): Promise<void> {
  const { blobs } = await list({ prefix: `${MAP}/${kenmerk}/gemeld` });
  if (blobs.length > 0) await del(blobs.map((b) => b.url));
}
