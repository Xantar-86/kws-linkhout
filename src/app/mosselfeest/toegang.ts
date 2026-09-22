/**
 * Het wachtwoord van de organisatoren onthouden.
 *
 * De vier schermen (overzicht, avondscherm, afdrukken en voorraad) vragen
 * hetzelfde wachtwoord. Dat stond eerst in sessionStorage, en dat is per
 * tabblad: wie vanaf het overzicht een bonnetje opende in een nieuw tabblad,
 * moest het opnieuw intypen. Aan de kassa, met een rij wachtende mensen, is dat
 * onwerkbaar.
 *
 * Nu gaat het naar localStorage, dus het blijft staan over tabbladen heen en
 * ook nadat de browser dicht is geweest. Dat is een bewuste afweging: dit
 * draait op de laptop van de club, en het gemak weegt daar op tegen het risico.
 * Wie die laptop deelt of uitleent, gebruikt de knop "Afmelden", en dan is het
 * weg.
 *
 * Een oude waarde uit sessionStorage wordt bij het eerste gebruik overgenomen,
 * zodat niemand opnieuw moet beginnen.
 */

const SLEUTEL = "kws-mosselfeest-wachtwoord";

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
