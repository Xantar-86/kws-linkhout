/**
 * Het wachtwoord van het kampoverzicht onthouden in deze browser.
 *
 * Een kopie van mosselfeest/toegang.ts met een eigen sleutel: het kamp heeft
 * een eigen wachtwoord, dus het mag dat van het mosselfeest niet overschrijven.
 * "Afmelden" op het overzicht wist het weer.
 */

const SLEUTEL = "kws-voetbalkamp-wachtwoord";

export function leesWachtwoord(): string | null {
  try {
    const blijvend = localStorage.getItem(SLEUTEL);
    if (blijvend) return blijvend;
    // Nog van de vorige manier van bewaren: overnemen en voortaan blijvend.
    const uitSessie = sessionStorage.getItem(SLEUTEL);
    if (uitSessie) {
      localStorage.setItem(SLEUTEL, uitSessie);
      return uitSessie;
    }
  } catch {
    // Een browser die opslag blokkeert: dan vraagt het scherm het gewoon.
  }
  return null;
}

export function bewaarWachtwoord(wachtwoord: string): void {
  try {
    localStorage.setItem(SLEUTEL, wachtwoord);
  } catch {
    // Niet kunnen bewaren is lastig, maar geen reden om te stoppen.
  }
}

export function vergeetWachtwoord(): void {
  try {
    localStorage.removeItem(SLEUTEL);
    sessionStorage.removeItem(SLEUTEL);
  } catch {
    // Niets te vergeten.
  }
}
