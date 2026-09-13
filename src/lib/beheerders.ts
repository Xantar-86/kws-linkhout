import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Wie mag inloggen op het beheer.
 *
 * De lijst staat in de omgevingsvariabele BEHEERDERS bij Vercel, als
 * "e-mail:zout:sleutel" per persoon, gescheiden door komma's of nieuwe regels:
 *
 *   BEHEERDERS=jan@club.be:a1b2...:c3d4...,mie@club.be:e5f6...:0789...
 *
 * Het wachtwoord zelf staat er nergens in. We bewaren enkel het resultaat van
 * scrypt over wachtwoord en zout; daaruit valt het wachtwoord niet terug te
 * rekenen, ook niet als de instellingen ooit uitlekken.
 *
 * Een beheerder bijzetten of een wachtwoord wijzigen:
 *   node scripts/beheerder.mjs "naam@club.be" "het wachtwoord"
 * Dat drukt de regel af die je in de instelling plakt.
 *
 * Voorheen liep dit via Supabase. Dat project is in september 2026 verdwenen
 * en daarmee lag het hele beheer plat. Deze opzet hangt van niets af behalve
 * van Vercel zelf.
 */

/** scrypt met de standaardkosten van Node en een sleutel van 64 bytes. */
const SLEUTELLENGTE = 64;

export type Beheerder = { email: string; zout: string; sleutel: string };

/** Leest de lijst uit de omgeving. Ongeldige regels worden overgeslagen. */
export function leesBeheerders(ruw: string | undefined): Beheerder[] {
  if (!ruw) return [];
  return ruw
    .split(/[,\n]/)
    .map((regel) => regel.trim())
    .filter(Boolean)
    .map((regel) => {
      const [email, zout, sleutel] = regel.split(":");
      if (!email || !zout || !sleutel) return null;
      return { email: email.trim().toLowerCase(), zout: zout.trim(), sleutel: sleutel.trim() };
    })
    .filter((b): b is Beheerder => b !== null);
}

/** Het versleutelde wachtwoord, als hex. */
export function versleutel(wachtwoord: string, zout: string): string {
  return scryptSync(wachtwoord.normalize("NFKC"), zout, SLEUTELLENGTE).toString("hex");
}

/** Een nieuw zout voor wie erbij komt. */
export function nieuwZout(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Klopt dit wachtwoord bij dit e-mailadres?
 *
 * Bij een onbekend adres rekenen we toch een keer door met een verzonnen zout.
 * Anders is een bestaand adres te herkennen aan het snellere antwoord.
 */
export function magBinnen(beheerders: Beheerder[], email: string, wachtwoord: string): boolean {
  const gezocht = email.trim().toLowerCase();
  const gevonden = beheerders.find((b) => b.email === gezocht);
  const zout = gevonden?.zout ?? "0".repeat(32);
  const berekend = Buffer.from(versleutel(wachtwoord, zout), "hex");
  if (!gevonden) return false;

  const bewaard = Buffer.from(gevonden.sleutel, "hex");
  // Even lang, anders klaagt timingSafeEqual en verraadt de fout iets.
  if (bewaard.length !== berekend.length) return false;
  return timingSafeEqual(bewaard, berekend);
}
