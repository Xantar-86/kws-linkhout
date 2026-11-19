import { databaseBeschikbaar, db } from "@/lib/supabase";

/**
 * De bestellingen van een wedstrijdbal, in de tabel wedstrijdbal_bestellingen
 * van Supabase (zie lib/supabase.ts).
 *
 *  - een bestelling wordt één keer geschreven, met het nummer van de betaling;
 *  - of er betaald is, vragen we telkens aan Mollie, dat is de waarheid;
 *  - gemeld_op zegt wanneer de mails vertrokken.
 */

// WEDSTRIJDBAL_MAP houdt een lokale proef apart van de echte bestellingen.
const MAP = process.env.WEDSTRIJDBAL_MAP || "wedstrijdbal";
const TABEL = "wedstrijdbal_bestellingen";

export interface Bestelling {
  kenmerk: string;
  betaling: string;
  aangemaakt: string;
  bedrag: string;
  /** Een testbetaling, via de testlink en de testsleutel. */
  test: boolean;
  gegevens: Record<string, string>;
}

export function opslagBeschikbaar(): boolean {
  return databaseBeschikbaar();
}

/** Een kenmerk is een uuid; al de rest weigeren we, het komt uit een adres. */
export function geldigKenmerk(kenmerk: string | null): kenmerk is string {
  return Boolean(kenmerk && /^[0-9a-f-]{36}$/.test(kenmerk));
}

export async function bewaarBestelling(bestelling: Bestelling): Promise<void> {
  const { error } = await db().from(TABEL).insert({
    kenmerk: bestelling.kenmerk,
    map: MAP,
    betaling: bestelling.betaling,
    test: bestelling.test,
    aangemaakt: bestelling.aangemaakt,
    gegevens: bestelling,
  });
  if (error) throw new Error(error.message);
}

export async function haalBestelling(kenmerk: string): Promise<{ bestelling: Bestelling; gemeld: boolean } | null> {
  if (!databaseBeschikbaar()) return null;
  const { data, error } = await db()
    .from(TABEL)
    .select("gegevens, gemeld_op")
    .eq("kenmerk", kenmerk)
    .eq("map", MAP)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return { bestelling: data.gegevens as Bestelling, gemeld: data.gemeld_op !== null };
}

/**
 * Het recht om te mailen opeisen. De bedankpagina en Mollie melden zich vaak
 * tegelijk; de database zet gemeld_op maar bij één van beiden, want de
 * voorwaarde "nog niet gemeld" en het invullen gebeuren in één stap.
 */
export async function eisMeldingOp(kenmerk: string): Promise<boolean> {
  const { data, error } = await db()
    .from(TABEL)
    .update({ gemeld_op: new Date().toISOString() })
    .eq("kenmerk", kenmerk)
    .is("gemeld_op", null)
    .select("kenmerk");
  if (error) throw new Error(error.message);
  return (data ?? []).length > 0;
}

/** Mislukte het mailen, dan het slot weer vrijgeven voor een volgende poging. */
export async function geefMeldingVrij(kenmerk: string): Promise<void> {
  const { error } = await db().from(TABEL).update({ gemeld_op: null }).eq("kenmerk", kenmerk);
  if (error) throw new Error(error.message);
}
