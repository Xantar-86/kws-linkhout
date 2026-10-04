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
  // U17A, zoals de club de lijst doorgaf.
  U17A: [
    { naam: "Aliano Baeten" },
    { naam: "Berre Hombroek" },
    { naam: "Braien Suha" },
    { naam: "Daan Moermans" },
    { naam: "Daan Tombeur" },
    { naam: "Felix Fabre" },
    { naam: "Ignas Van Genechten" },
    { naam: "Jure Neven" },
    { naam: "Juul Vanheukelom" },
    { naam: "Juul Verpoorten" },
    { naam: "Matisse Peeters" },
    { naam: "Mats-Alexander Tutenel" },
    { naam: "Mon Hoebrekx" },
    { naam: "Rik Adriaens" },
    { naam: "Sam Das" },
    { naam: "Stan Verpoorten" },
    { naam: "Tygo de Grave" },
  ],

  // U17B, zoals de club de lijst doorgaf.
  U17B: [
    { naam: "Axl Reynders" },
    { naam: "Daan Tombeur" },
    { naam: "Elliot Avoux" },
    { naam: "Gerard Vanleuven" },
    { naam: "Jorne Ghijs" },
    { naam: "Levi Lopez Hernandez" },
    { naam: "Mathias Vandebroek" },
    { naam: "Maxime Mathieu" },
    { naam: "Rune Vanbrabant" },
    { naam: "Sander Van Mieghem" },
    { naam: "Senn Jacobs" },
    { naam: "Sietse Darcis" },
    { naam: "Stan Tielens" },
    { naam: "Tygo de Grave" },
    { naam: "Warre Reynders" },
    { naam: "Wout Buekenberghs" },
    { naam: "Wout Forier" },
  ],

  // U15, zoals de club de lijst doorgaf.
  U15: [
    { naam: "Alexander Thomas", nummer: 52 },
    { naam: "Arthur Fabré", nummer: 48 },
    { naam: "Axel Coomans", nummer: 46 },
    { naam: "Charly Politic", nummer: 22 },
    { naam: "Emile Huls", nummer: 1 },
    { naam: "Ferre Luts", nummer: 51 },
    { naam: "Fynn Deferme", nummer: 36 },
    { naam: "Lander Rymen", nummer: 31 },
    { naam: "Lars Dirckx" },
    { naam: "Mauro Deprez", nummer: 28 },
    { naam: "Niccolò Liaci", nummer: 49 },
    { naam: "Nio Thoelen", nummer: 24 },
    { naam: "Robbe Reynders", nummer: 38 },
    { naam: "Seppe Breugelmans", nummer: 25 },
    { naam: "Simon De Bruycker", nummer: 12 },
    { naam: "Thomas Buyck", nummer: 30 },
    { naam: "Vic Janssen", nummer: 43 },
  ],

  // U13, zoals de club de lijst doorgaf.
  U13: [
    { naam: "Alexander Manshoven" },
    { naam: "Dante Pleune" },
    { naam: "Franck Kuebia" },
    { naam: "Karel De Spiegeleer" },
    { naam: "Loekas Reynders" },
    { naam: "Mugwagwa Shaine" },
    { naam: "Oliver Michiels" },
    { naam: "Quin Luts" },
    { naam: "Staff Cypers" },
    { naam: "Tiebe Vlaeyen" },
    { naam: "Toon Dupont" },
    { naam: "Vince Goris" },
  ],

  // U12, zoals de club de lijst doorgaf.
  U12: [
    { naam: "Cas Jacobs" },
    { naam: "Eben Gillaer" },
    { naam: "Georges Thomas" },
    { naam: "Jaan Jennekens" },
    { naam: "Jad Bou Ziab" },
    { naam: "Liyan Coemans" },
    { naam: "Louis Verbeemen" },
    { naam: "Mathieu Bammens" },
    { naam: "Mats Corten" },
    { naam: "Matteo Dekerf" },
    { naam: "Prabhjot Singh" },
    { naam: "Vince Cleeren" },
  ],

  // U10, zoals de club de lijst doorgaf.
  U10: [
    { naam: "Alexander Delattre" },
    { naam: "Cyriel Verbeemen" },
    { naam: "Matteo Willems" },
    { naam: "Sem Hoeyberghs" },
    { naam: "Simmi Dassen Singh" },
    { naam: "Vinz Vanwetswinkel" },
  ],

  // U8, zoals de club de lijst doorgaf.
  U8: [
    { naam: "Aaron Sumbul" },
    { naam: "Ewoud Marteau" },
    { naam: "Gus Vanluydt" },
    { naam: "Jules Van De Vijver" },
    { naam: "Louis Wynants" },
    { naam: "Milan Geebelen Canitez" },
    { naam: "Nand Fabré" },
    { naam: "Oliver Vanderstappen" },
    { naam: "Tristan Gaethofs" },
    { naam: "Tristan Van Meerbeeck" },
  ],

  // 2de provinciale, 17 spelers. De posities komen uit de kernlijst van de
  // club; de rugnummers zijn nog niet vastgelegd.
  P2: [
    { naam: "Maxim Vaes", nummer: 22, positie: "K" },
    { naam: "Tibo Rousset", positie: "K" },
    { naam: "Klevin Sagang", nummer: 17, positie: "V" },
    { naam: "Tiebe Vandevelde", nummer: 2, positie: "V" },
    { naam: "Nick Tuteleers", nummer: 6, positie: "V" },
    { naam: "Jelle Asnong", nummer: 3, positie: "V" },
    { naam: "Lucas Volders", nummer: 12, positie: "V" },
    { naam: "Jordy Berings", nummer: 5, positie: "V" },
    { naam: "Simon Reykers", nummer: 20, positie: "M" },
    { naam: "Brent Gilissen", nummer: 24, positie: "M" },
    { naam: "Xander Budé", nummer: 19, positie: "M" },
    { naam: "Simon Volders", nummer: 7, positie: "M" },
    { naam: "Jorne Bynens", nummer: 25, positie: "A" },
    { naam: "Kevin Van Dooren", positie: "A" },
    { naam: "Mike Geybels", nummer: 9, positie: "A" },
    { naam: "Joost Beutels", nummer: 10, positie: "A" },
    { naam: "Kahraman Can", nummer: 23, positie: "A" },
  ],

  // 4de provinciale, 20 spelers.
  P4: [
    { naam: "Wanne Vanbael", nummer: 1, positie: "K" },
    { naam: "Jacob Van Genechten", nummer: 5, positie: "V" },
    { naam: "Mauro Ferong", positie: "V" },
    { naam: "Alexander Cypers", nummer: 2, positie: "V" },
    { naam: "Jelle Pieraerts", nummer: 4, positie: "V" },
    { naam: "Noah Vandenhoudt", nummer: 6, positie: "V" },
    { naam: "Bram Mariën", positie: "V" },
    { naam: "Lorenzo Silvente Fernandez", nummer: 19, positie: "M" },
    { naam: "Milan Vanluyten", nummer: 8, positie: "M" },
    { naam: "Jonas Vaes", nummer: 13, positie: "M" },
    { naam: "Jarich Darcis", nummer: 18, positie: "M" },
    { naam: "Yoran Moortgat", nummer: 14, positie: "A" },
    { naam: "Noah Gielkens", nummer: 7, positie: "A" },
    { naam: "Thomas Kellens", nummer: 12, positie: "A" },
    { naam: "Lennert Mellebeek", nummer: 9, positie: "A" },
    { naam: "Pieter Peremans", nummer: 11, positie: "A" },
    { naam: "Kenneth Cupers", positie: "V" },
    { naam: "Brecht Ceuppens", positie: "V" },
    { naam: "Maxim Leduc", positie: "M" },
    { naam: "Laurens Decoster", nummer: 10, positie: "M" },
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
    { naam: "Lilly Luyck" },
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

  // U11, de spelers waarvan er een portret gemaakt is. Posities en rugnummers
  // zijn nog niet doorgegeven; die mogen er per speler bij zodra ze bekend
  // zijn.
  U11: [
    { naam: "Cas Rogiers" },
    { naam: "Castor Ulenaers" },
    { naam: "Elliot Michiels" },
    { naam: "Emiel Cypers" },
    { naam: "Emiel Neyens" },
    { naam: "Ibe Thoelen" },
    { naam: "Loïc Thomas" },
    { naam: "Mathieu Huls" },
    { naam: "Mats Van Der Leun" },
    { naam: "Otis Kitenge" },
    { naam: "Senn Deferme" },
    { naam: "Ties Van de Vijver" },
    { naam: "Viktor Vanden Berghe" },
    { naam: "Vin Dullers" },
  ],

  // U9, de spelers waarvan er een portret gemaakt is. A en B delen deze
  // lijst zolang de verdeling niet vastligt. Posities en rugnummers zijn nog
  // niet doorgegeven; die mogen er per speler bij zodra ze bekend zijn.
  //
  // Fin Rogiers is nog niet aangesloten en staat daarom nog niet in de lijst.
  // U6, de spelers zoals de club ze doorgaf. Er zijn nog geen portretten;
  // die krijgen een leeg kader tot er een foto is.
  U6: [
    { naam: "Aariz Singh" },
    { naam: "Ferre Swinnen" },
    { naam: "Freijo Verboven" },
    { naam: "Jules Vandevenne" },
    { naam: "Lex Pira" },
    { naam: "Marlie Bossens" },
    { naam: "Mason Cans" },
    { naam: "Max-Emile Tutenel" },
    { naam: "Symon Nuyts" },
    { naam: "Tars Verboven" },
    { naam: "Tuur Neyens" },
  ],

  // U7, de veertien spelers zoals de club ze doorgaf. A en B delen deze lijst
  // zolang we niet weten wie bij welke ploeg hoort. Nog geen portretten.
  U7: [
    { naam: "Arlo Guillaume" },
    { naam: "Bas Van de Schoot" },
    { naam: "Ferre Bosman" },
    { naam: "Ilan Smet" },
    { naam: "Jules Lekens" },
    { naam: "Kobe Driessens" },
    { naam: "Lewis Goris" },
    { naam: "Lou Van Stee" },
    { naam: "Louwïc Vanhoudt" },
    { naam: "Luhan Chang" },
    { naam: "Lyano Ballet" },
    { naam: "Margot Vanden berghe" },
    { naam: "Nilo Stockmans" },
    { naam: "Tuur Wijns" },
  ],

  U9: [
    { naam: "Arthur Hoogstijns" },
    { naam: "Cas Horions" },
    { naam: "Cisse Simons" },
    { naam: "Jake Michiels" },
    { naam: "Leon Vanneroem" },
    { naam: "Louis Vanschoonbeek" },
    { naam: "Mathilde Ramaekers" },
    { naam: "Maxim Coemans" },
    { naam: "Noah Stockmans" },
    { naam: "Oscar Cleeren" },
    { naam: "Stan Clemens" },
    { naam: "Victor Darville" },
    { naam: "Vik Tielens" },
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
