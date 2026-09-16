// app/sponsoring/inhoud.ts
//
// De sponsorformules, los van de weergave.
//
// Overgenomen van sponsoring.kwslinkhout.be, september 2026. Alle bedragen
// zijn exclusief btw. Pas ze hier aan en de pagina volgt vanzelf; het staat
// bewust niet in Client.tsx, zodat ook de server de bedragen kan lezen.

export const SPONSOR_CONTACT = {
  naam: "Gert Peremans",
  rol: "Voorzitter en aanspreekpunt sponsoring",
  mail: "peremans.gert@gmail.com",
};

/** Wat een sponsor terugkrijgt, los van de formule die hij kiest. */
export const WAAROM = [
  {
    titel: "Blijvende zichtbaarheid",
    tekst:
      "Uw naam of logo op een sponsorbord, affiche of shirt, jarenlang zichtbaar voor spelers, " +
      "ouders en supporters op en naast het veld.",
  },
  {
    titel: "Lokale impact",
    tekst:
      "U investeert rechtstreeks in een club die jongeren, families en supporters uit de streek " +
      "samenbrengt.",
  },
  {
    titel: "Langdurige samenwerking",
    tekst:
      "Meerjarige formules zonder jaarlijkse rompslomp. Uw merk verbonden aan een positief, " +
      "sportief verhaal.",
  },
];

export type Formule = {
  id: string;
  naam: string;
  kern: string;
  inbegrepen: string[];
  /** Twee regels met een bedrag. Bij Platinum gaat het in overleg. */
  prijzen: { label: string; bedrag: string }[];
  voetnoot: string;
};

export const FORMULES: Formule[] = [
  {
    id: "silver",
    naam: "Silver",
    kern: "Een bord langs het veld, met het volledige clubgevoel erbij.",
    inbegrepen: [
      "Reclamepaneel van 2 m² langs het veld, looptijd 3 jaar",
      "1 abonnement KWS Linkhout",
      "1 keer gratis de kantine huren",
      "Vermelding op de website",
      "Toegang voor 2 personen tot ons jaarlijks VIP-sponsorevent",
    ],
    prijzen: [
      { label: "Jaar 1", bedrag: "€ 1.000" },
      { label: "Jaar 2 en 3", bedrag: "€ 800 per jaar" },
    ],
    voetnoot: "Jaar 1 is inclusief het ontwerp en het plaatsen van het bord.",
  },
  {
    id: "gold",
    naam: "Gold",
    kern: "Het volledige pakket, voor wie voorop wil lopen.",
    inbegrepen: [
      "Reclamepaneel van 4 m², of 2 keer 2 m² in Linkhout en Zelem, looptijd 3 jaar",
      "2 abonnementen KWS Linkhout",
      "2 keer gratis de kantine huren",
      "Vermelding op de website",
      "4 gratis menu's op ons jaarlijks mosselfeest",
      "Toegang voor 4 personen tot ons jaarlijks VIP-sponsorevent",
    ],
    prijzen: [
      { label: "Jaar 1", bedrag: "€ 1.800" },
      { label: "Jaar 2 en 3", bedrag: "€ 1.200 per jaar" },
    ],
    voetnoot: "Jaar 1 is inclusief het ontwerp en het plaatsen van het bord.",
  },
  {
    id: "platinum",
    naam: "Platinum",
    kern: "Uw logo op het shirt, met het volledige clubgevoel erbij.",
    inbegrepen: [
      "Uw logo op het shirt van de jeugd-, senioren- of meisjes- en dameswerking, 3 seizoenen",
      "1 abonnement KWS Linkhout",
      "2 keer gratis de kantine huren",
      "Vermelding op de website",
      "4 gratis menu's op ons jaarlijks mosselfeest",
      "Toegang voor 4 personen tot ons jaarlijks VIP-sponsorevent",
    ],
    prijzen: [
      { label: "Facturatie", bedrag: "Jaarlijks" },
      { label: "Bedrag", bedrag: "In overleg" },
    ],
    voetnoot: "De prijs hangt af van de ploeg en het shirtonderdeel. We bekijken graag samen wat past.",
  },
];

export const LINKWOOD_PARK = {
  titel: "Project Linkwood Park",
  actie: "Actie 8 × € 5.000 voor twee nieuwe kleedkamers en een tribune",
  inbegrepen: [
    "Reclamepaneel van 2 m² langs het veld, looptijd 3 jaar",
    "1 abonnement KWS Linkhout",
    "1 keer gratis de kantine huren",
    "Vermelding op de website",
    "Toegang voor 2 personen tot ons jaarlijks VIP-sponsorevent",
  ],
  bijdrage: "€ 5.000",
  zichtbaarheid: "8 jaar",
  uitleg:
    "Uw naam of logo acht jaar lang op een sponsorbord in de kantine, of op een andere " +
    "opvallende plaats in overleg.",
};

export const WEDSTRIJDBAL = {
  prijs: "€ 150",
  uitleg:
    "De laagdrempelige instapper: uw naam op de affiche in de kantine, een vol jaar lang " +
    "zichtbaar voor alle leden en bezoekers.",
};

/** De volledige tekst over de samenwerking, zoals de club hem schreef. */
export const ZELEM = [
  "De samenwerking tussen KWS Linkhout en KFCE Zelem vormt een belangrijke pijler binnen de " +
    "sportieve toekomstvisie van beide clubs. Door de krachten te bundelen op het vlak van " +
    "jeugdopleiding creëren we een sterke en kwalitatieve opleidingsomgeving voor zowel jongens " +
    "als meisjes. Jong talent krijgt hierdoor de kans om zich op zijn of haar eigen tempo te " +
    "ontwikkelen, begeleid door geëngageerde trainers en binnen een duidelijke sportieve structuur.",
  "Dankzij een nauwe afstemming tussen beide verenigingen ontstaat een sterke doorstroming van de " +
    "jeugdwerking naar de eerste ploegen. Spelers en speelsters krijgen een realistisch en " +
    "aantrekkelijk ontwikkelingspad aangeboden, waarbij ambitie, opleiding en clubverbondenheid " +
    "centraal staan. Op die manier bouwen KWS Linkhout en KFCE Zelem samen aan een duurzame " +
    "toekomst, waarin lokale talenten alle kansen krijgen om door te groeien en de kleuren van hun " +
    "club met trots te verdedigen.",
  "Of het nu gaat om jongens- of meisjesvoetbal, de gezamenlijke aanpak zorgt voor meer " +
    "mogelijkheden, meer kwaliteit en een bredere sportieve basis. Zo versterken beide clubs niet " +
    "alleen elkaar, maar ook het voetbal in de regio.",
];

export const ONDERWERPEN = [
  "Pakket Silver",
  "Pakket Gold",
  "Pakket Platinum",
  "Project Linkwood Park",
  "Iets anders",
];
