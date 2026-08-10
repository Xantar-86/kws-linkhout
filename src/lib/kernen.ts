import { spelers, type Speler } from "./spelers";

/**
 * De kernen van seizoen 2026-27, zoals de club ze heeft doorgegeven.
 *
 * De bestandsnaam van een foto zegt alleen bij welke fotosessie iemand stond,
 * niet in welke kern hij zit. Die indeling staat hier, met de hand bijgehouden.
 * Verhuist er iemand, dan verzet je zijn naam en verder verandert er niets.
 *
 * Schrijf de namen als "Voornaam Achternaam", zoals in `spelers.ts`. Wie bij
 * twee ploegen speelt zet je gewoon in beide lijsten; hij verschijnt dan op
 * beide pagina's. Namen zonder foto mogen blijven staan: die worden
 * overgeslagen tot er een portret van hen is.
 */
export const KERNEN: Record<string, string[]> = {
  // 2de provinciale, 22 spelers.
  P2: [
    "Maxim Vaes",
    "Tibo Rousset",
    "Klevin Sagan",
    "Tiebe Vandevelde",
    "Nick Tuteleers",
    "Jelle Asnong",
    "Lucas Volders",
    "Jordy Berings",
    "Simon Reykers",
    "Brent Gilissen",
    "Xander Budé",
    "Simon Volders",
    "Jorne Bynens",
    "Kevin Van Dooren",
    "Mike Geybels",
    "Joost Beutels",
    "Kahraman Can",
    "Pieter Peremans",
    "Lorenzo Silvente Fernandez",
    "Jelle Pieraerts",
    "Milan Vanluyten",
    "Yoran Moortgat",
  ],

  // 4de provinciale, 24 spelers. Matthias Corten staat niet op de doorgegeven
  // lijst maar is er apart bij gevraagd.
  P4: [
    "Wanne Vanbael",
    "Jacob Van Genechten",
    "Mauro Ferong",
    "Alexander Cypers",
    "Jelle Pieraerts",
    "Noah Vandenhoudt",
    "Bram Mariën",
    "Lorenzo Silvente Fernandez",
    "Milan Vanluyten",
    "Jonas Vaes",
    "Jarich Darcis",
    "Yoran Moortgat",
    "Noah Gielkens",
    "Thomas Kellens",
    "Lennert Mellebeek",
    "Pieter Peremans",
    "Kenneth Cupers",
    "Brecht Ceuppens",
    "Maxim Leduc",
    "Laurens Decoster",
    "Mika Cerulus",
    "Hannes Leus Bamps",
    "Lars Andries",
    "Jaydrick Fornerino",
    "Matthias Corten",
  ],

  // Beloften, 19 spelers.
  Beloften: [
    "Matthias Corten",
    "Ben Andries",
    "Dries Huysmans",
    "Kamiel Volders",
    "Mika Cerulus",
    "Elias Chaufoureau",
    "Seppe Verdonck",
    "Jenz Neven",
    "Daan Debruyne",
    "Milan Roosen",
    "Jarne Peeters",
    "Hannes Leus Bamps",
    "Lars Andries",
    "Jaydrick Fornerino",
    "Vince Godfroid",
    "Jelte Bynens",
    "Xander Beutling",
    "Lennert Sneyers",
    "Niels Gabriels",
  ],
};

/** Een speler in een kern. Zonder foto blijft er een leeg portret staan. */
export interface Kernlid {
  naam: string;
  klein?: string;
  groot?: string;
}

/**
 * De spelers van één kern, op naam gesorteerd.
 *
 * Iedereen uit de lijst komt in het raster, ook wie nog geen portret heeft.
 * Die krijgt een leeg vakje met zijn naam eronder, zodat de kern volledig is
 * en er later alleen nog een foto bij hoeft.
 */
export function spelersVan(kern: string): Kernlid[] {
  const namen = KERNEN[kern];
  if (!namen) return [];

  return namen
    .map((naam) => {
      const foto: Speler | undefined = spelers.find((s) => s.naam === naam);
      return { naam, klein: foto?.klein, groot: foto?.groot };
    })
    .sort((a, b) => a.naam.localeCompare(b.naam, "nl"));
}
