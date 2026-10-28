import { stuurMails } from "./mail";
import { haalBetaling, mollieSleutel, type MollieStatus } from "./mollie";
import { eisMeldingOp, geefMeldingVrij, haalBestelling } from "./opslag";

export interface Stand {
  status: MollieStatus;
  test: boolean;
}

/**
 * Hoe staat een bestelling ervoor, en zijn de mails al vertrokken?
 *
 * Twee wegen komen hier uit: de bedankpagina, als de sponsor terugkomt van
 * Mollie, en de webhook, waarmee Mollie zelf laat weten dat er iets veranderde.
 * Wie van beide eerst is, mailt; de andere ziet dat het al gebeurd is.
 *
 * Geeft null als de bestelling niet bestaat. Gooit een fout als Mollie of het
 * mailen niet lukt, zodat de webhook een foutcode geeft en Mollie het later
 * opnieuw probeert.
 */
export async function verwerk(kenmerk: string, betalingId?: string): Promise<Stand | null> {
  const gevonden = await haalBestelling(kenmerk);
  if (!gevonden) return null;
  const { bestelling } = gevonden;
  // De webhook noemt een betaling: die moet bij deze bestelling horen.
  if (betalingId && betalingId !== bestelling.betaling) return null;

  const sleutel = mollieSleutel(bestelling.test);
  if (!sleutel) throw new Error(`Geen ${bestelling.test ? "test" : "live"}sleutel van Mollie.`);
  const betaling = await haalBetaling(sleutel, bestelling.betaling);
  const stand = { status: betaling.status, test: bestelling.test };

  if (betaling.status !== "paid" || gevonden.gemeld) return stand;
  if (!(await eisMeldingOp(kenmerk))) return stand;
  try {
    await stuurMails(bestelling, { id: betaling.id, methode: betaling.method ?? null, betaaldOp: betaling.paidAt ?? null });
  } catch (fout) {
    await geefMeldingVrij(kenmerk).catch(() => {});
    throw fout;
  }
  return stand;
}
