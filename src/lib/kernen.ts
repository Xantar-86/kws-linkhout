import { spelers, type Speler } from "./spelers";

/**
 * De kernen van seizoen 2026-27, zoals de club ze heeft doorgegeven.
 *
 * De bestandsnaam van een foto zegt alleen bij welke fotosessie iemand stond,
 * niet in welke kern hij zit. Die indeling staat hier, met de hand bijgehouden.
 *
 * Schrijf de naam als "Voornaam Achternaam", zoals in `spelers.ts`. Wie bij
 * twee ploegen speelt zet je gewoon in beide lijsten. Namen zonder foto mogen
 * blijven staan: die krijgen een leeg portret tot er een is.
 *
 * Alles behalve de naam is optioneel. Wat je invult verschijnt op de kaart van
 * die speler; wat je weglaat blijft weg.
 */
export interface Kernspeler {
  naam: string;
  /** Rugnummer. */
  nummer?: number;
  /** K keeper, V verdediger, M middenvelder, A aanvaller. */
  positie?: "K" | "V" | "M" | "A";
  /** Geboortejaar, waarmee de leeftijd berekend wordt. */
  geboren?: number;
  /** Het jaar waarin hij bij de club kwam. */
  sinds?: number;
  /** Landcode van twee letters; leeg betekent Belgisch. */
  land?: string;
}

export const KERNEN: Record<string, Kernspeler[]> = {
  // 2de provinciale, 17 spelers. De posities komen uit de kernlijst van de
  // club; de rugnummers zijn nog niet vastgelegd.
  P2: [
    { naam: "Maxim Vaes", positie: "K" },
    { naam: "Tibo Rousset", positie: "K" },
    { naam: "Klevin Sagang", positie: "V" },
    { naam: "Tiebe Vandevelde", positie: "V" },
    { naam: "Nick Tuteleers", positie: "V" },
    { naam: "Jelle Asnong", positie: "V" },
    { naam: "Lucas Volders", positie: "V" },
    { naam: "Jordy Berings", positie: "V" },
    { naam: "Simon Reykers", positie: "M" },
    { naam: "Brent Gilissen", positie: "M" },
    { naam: "Xander Budé", positie: "M" },
    { naam: "Simon Volders", positie: "M" },
    { naam: "Jorne Bynens", positie: "A" },
    { naam: "Kevin Van Dooren", positie: "A" },
    { naam: "Mike Geybels", positie: "A" },
    { naam: "Joost Beutels", positie: "A" },
    { naam: "Kahraman Can", positie: "A" },
  ],

  // 4de provinciale, 20 spelers.
  P4: [
    { naam: "Wanne Vanbael", positie: "K" },
    { naam: "Jacob Van Genechten", positie: "V" },
    { naam: "Mauro Ferong", positie: "V" },
    { naam: "Alexander Cypers", positie: "V" },
    { naam: "Jelle Pieraerts", positie: "V" },
    { naam: "Noah Vandenhoudt", positie: "V" },
    { naam: "Bram Mariën", positie: "V" },
    { naam: "Lorenzo Silvente Fernandez", positie: "M" },
    { naam: "Milan Vanluyten", positie: "M" },
    { naam: "Jonas Vaes", positie: "M" },
    { naam: "Jarich Darcis", positie: "M" },
    { naam: "Yoran Moortgat", positie: "A" },
    { naam: "Noah Gielkens", positie: "A" },
    { naam: "Thomas Kellens", positie: "A" },
    { naam: "Lennert Mellebeek", positie: "A" },
    { naam: "Pieter Peremans", positie: "A" },
    { naam: "Kenneth Cupers", positie: "V" },
    { naam: "Brecht Ceuppens", positie: "V" },
    { naam: "Maxim Leduc", positie: "M" },
    { naam: "Laurens Decoster", positie: "M" },
  ],

  // De damesploegen, seizoen 2026-27.
  DamesP1: [
    { naam: "Aline Flossie" },
    { naam: "Briana Geerts" },
    { naam: "Emilie Konings" },
    { naam: "Hannelore Barro" },
    { naam: "Jacey Vanweddingen" },
    { naam: "Janne Vaes" },
    { naam: "Jolien Wouters" },
    { naam: "Kyra Sagovac" },
    { naam: "Lola Jouck" },
    { naam: "Marie Doggen" },
    { naam: "Meret Moldonado" },
    { naam: "Nena Convents" },
  ],
  DamesP2: [
    { naam: "Amélie Mondelaers" },
    { naam: "Destiny Banken" },
    { naam: "Emma Kellens" },
    { naam: "Emma Veekmans" },
    { naam: "Jade Beckers" },
    { naam: "Kaat Smeulders" },
    { naam: "Kara Peeters" },
    { naam: "Kyare Houben" },
    { naam: "Lilly Luyckx" },
    { naam: "Meyra Cesur" },
    { naam: "Oona Vansteenwegen Walterus" },
    { naam: "Raissa Ciavarro" },
    { naam: "Shantie Banken" },
    { naam: "Sharleen Vanderheyden" },
    { naam: "Yenthe Lodewyckx" },
  ],

  // Beloften, 19 spelers.
  Beloften: [
    { naam: "Matthias Corten", positie: "K" },
    { naam: "Ben Andries", positie: "M" },
    { naam: "Dries Huysmans", positie: "A" },
    { naam: "Kamiel Volders", positie: "A" },
    { naam: "Mika Cerulus", positie: "M" },
    { naam: "Elias Chaufoureau", positie: "V" },
    { naam: "Seppe Verdonck", positie: "V" },
    { naam: "Jenz Neven", positie: "M" },
    { naam: "Daan Debruyne", positie: "V" },
    { naam: "Milan Roosen", positie: "A" },
    { naam: "Jarne Peeters", positie: "V" },
    { naam: "Hannes Leus Bamps", positie: "V" },
    { naam: "Lars Andries", positie: "M" },
    { naam: "Jaydrick Fornerino", positie: "M" },
    { naam: "Vince Godfroid", positie: "V" },
    { naam: "Jelte Bynens", positie: "A" },
    { naam: "Xander Beutling", positie: "V" },
    { naam: "Lennert Sneyers", positie: "A" },
    { naam: "Niels Gabriels", positie: "A" },
  ],
};

/** Een speler zoals de pagina hem toont: gegevens plus, als die er is, een foto. */
export interface Kernlid extends Kernspeler {
  klein?: string;
  groot?: string;
}

export const POSITIES: Record<string, string> = {
  K: "Keeper",
  V: "Verdediger",
  M: "Middenvelder",
  A: "Aanvaller",
};

/**
 * De spelers van één kern, op naam gesorteerd.
 *
 * Iedereen uit de lijst komt erin, ook wie nog geen portret heeft. Die krijgt
 * een leeg vakje met zijn naam, zodat de kern volledig is en er later alleen
 * nog een foto bij hoeft.
 */
export function spelersVan(kern: string): Kernlid[] {
  const lijst = KERNEN[kern];
  if (!lijst) return [];

  return lijst
    .map((speler) => {
      const foto: Speler | undefined = spelers.find((s) => s.naam === speler.naam);
      return { ...speler, klein: foto?.klein, groot: foto?.groot };
    })
    .sort((a, b) => a.naam.localeCompare(b.naam, "nl"));
}

/**
 * Trainers waarvan de foto alleen klein getoond wordt.
 *
 * Hun portret is nog niet goed genoeg om te vergroten; het ronde vakje naast
 * hun naam volstaat. Haal de naam hier weg zodra er een betere foto is.
 */
export const GEEN_VERGROTING: string[] = [];
