// REGEL 1-20: Interfaces
export interface Team {
  id: string;
  name: string;
  slug: string;
  category: "senioren" | "dames" | "jeugd";
  subCategory?: string;
  division: string;
  trainingDays: string[];
  trainingTime: string;
  /** Trainingslocatie, bv. "KWS" (Linkhout) of "Zelem". Optioneel. */
  trainingLocation?: string;
  coach: string;
  assistantCoach?: string;
  /**
   * De aanspreking voor beide namen hierboven, bijvoorbeeld "Trainster".
   * Zet dit wanneer er geen rangorde is; anders staat er standaard
   * "Hoofdtrainer" en "Assistent".
   */
  trainersTitel?: string;
  image: string;
  /**
   * Welke kern uit `lib/kernen.ts` bij deze ploeg hoort, bijvoorbeeld "P2".
   * Staat die er niet, dan toont de pagina geen spelers.
   */
  spelersGroep?: string;
  calendarUrl?: string;
  standingsUrl?: string;
  description?: string;
  calendarIframe?: string;
  standingsIframe?: string;
}

/**
 * Het adres van het agendabestand van een ploeg.
 *
 * We maken dat zelf uit de KBVB-gegevens, dus elke ploeg met een kalender
 * heeft er een. Zie /api/kalender.
 */
export function icalUrl(team: Team): string | null {
  return team.calendarIframe ? `/api/kalender?ploeg=${team.slug}` : null;
}

// REGEL 21-180: Alle ploegen data
export const teams: Team[] = [
  // ========== SENIOREN (6) ==========
  {
    id: "sen-1",
    name: "1ste Ploeg P2",
    slug: "eerste-ploeg",
    category: "senioren",
    division: "2de Provinciale Limb A",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "19:30 - 21:00",
    trainingLocation: "Zelem",
    coach: "Jelle Aerts",
    // P2 en P4 staan samen op één ploegfoto.
    image: "/images/teams/P2-P4.jpeg",
    spelersGroep: "P2",
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De eerste ploeg speelt in 2de Provinciale A en telt zeventien spelers. Trainen gebeurt op " +
      "dinsdag en donderdag in Zelem, met Jelle Aerts als trainer. De thuiswedstrijden worden " +
      "gespeeld op Linkwood Park aan de Kapelstraat.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/365216/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/365216/overzicht"
  },
  {
    id: "sen-3",
    name: "2de Ploeg P4",
    slug: "recrea-mannen",
    category: "senioren",
    division: "4 Provinciale Limb A",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "19:30 - 21:00",
    trainingLocation: "Zelem",
    coach: "Ramon Fernandez",
    // Dezelfde foto als P2.
    image: "/images/teams/P2-P4.jpeg",
    spelersGroep: "P4",
    description:
      "De tweede ploeg speelt in 4de Provinciale A en telt twintig spelers, met Ramon Fernandez als " +
      "trainer. Er wordt getraind op dinsdag en donderdag in Zelem. Samen met de eerste ploeg en de " +
      "beloften vormt ze de seniorenwerking.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/365215/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/365215/overzicht"
  },
  {
    id: "sen-2",
    name: "Beloften",
    slug: "reserven",
    category: "senioren",
    division: "Reserven Voetb Vl AU",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "19:30 - 21:00",
    trainingLocation: "Zelem",
    coach: "Steven Vangeel",
    // Dezelfde ploegfoto als P2 en P4.
    image: "/images/teams/P2-P4.jpeg",
    spelersGroep: "Beloften",
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De beloften spelen in de reservencompetitie van Voetbal Vlaanderen en tellen negentien " +
      "spelers, met Steven Vangeel als trainer. De ploeg is de brug tussen de jeugd en de eerste " +
      "ploeg: jonge spelers krijgen hier hun eerste minuten op seniorenniveau.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/372246/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/372246/overzicht"
  },
  {
    id: "sen-4",
    name: "Recrea Heren",
    slug: "recrea-heren",
    category: "senioren",
    division: "Recreatief",
    trainingDays: [],
    trainingTime: "",
    coach: "",
    image: "/images/under-construction.png",
    description:
      "Recreatief voetbal zonder competitie en zonder klassement: spelen om te spelen. Interesse om " +
      "mee te doen? Neem contact op via info@kwslinkhout.be.",
  },
  {
    id: "dam-1",
    name: "Dames 1ste Ploeg P1",
    slug: "eerste-ploeg-dames",
    category: "senioren",
    division: "1ste Provinciale Dames",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "19:30 - 21:00",
    trainingLocation: "Zelem",
    coach: "Frank Schroyen",
    image: "/images/teams/dames-P1-2026.jpg",
    spelersGroep: "DamesP1",
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De eerste damesploeg speelt in 1ste Provinciale, het hoogste provinciale niveau, en telt " +
      "twaalf speelsters. Bij ons loopt de meisjeslijn door van de U8 tot hier, dus je kan in eigen " +
      "club doorgroeien. Een training meepikken kan altijd.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/365217/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/365217/overzicht"
  },
  {
    id: "dam-6",
    name: "Recrea Vrouwen",
    slug: "recrea-vrouwen",
    category: "senioren",
    division: "Vriendschappelijk",
    trainingDays: ["Woensdag"],
    trainingTime: "20:00 - 21:30",
    coach: "Luc Brants",
    image: "/images/teams/Recrea Dames.jpeg",
    description:
      "De recreaploeg voor vrouwen traint op woensdag van 20 tot 21.30 uur in Linkhout, met Luc " +
      "Brants als begeleider. Er wordt vriendschappelijk gespeeld, zonder competitie. Nieuwe " +
      "speelsters zijn welkom, ervaring is niet nodig.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/359957/kalender"
  },

  // ========== DAMES/MEISJES (4) ==========
  {
    id: "dam-4",
    name: "Dames 2de Ploeg P2",
    slug: "tweede-ploeg-dames",
    category: "dames",
    division: "2de Provinciale Dames",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "19:30 - 21:00",
    trainingLocation: "Zelem",
    coach: "Steven Bottu",
    image: "/images/teams/dames-P2-2026.jpg",
    spelersGroep: "DamesP2",
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De tweede damesploeg speelt in 2de Provinciale en telt vijftien speelsters, met Steven Bottu " +
      "als trainer. Trainen gebeurt op maandag en woensdag in Zelem. Van hieruit kunnen speelsters " +
      "doorgroeien naar de eerste ploeg.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/372245/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/372245/overzicht"
  },
  {
    id: "dam-2",
    name: "Women U20",
    slug: "women-u20",
    category: "dames",
    subCategory: "meisjes",
    division: "2-Meisjes U20 reeks E",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "19:30 - 21:00",
    trainingLocation: "Zelem",
    coach: "Danny Gaethofs",
    image: "/images/teams/women-U20-2026.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De Women U20 speelt in de reeks 2-Meisjes U20 en traint op maandag en woensdag in Zelem, met " +
      "Danny Gaethofs als trainer. De ploeg is de brug tussen de meisjesjeugd en de damesploegen.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385205/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385205/overzicht"
  },
  {
    id: "dam-3",
    name: "Women U10",
    slug: "women-u10",
    category: "dames",
    subCategory: "meisjes",
    division: "Meisjes U10",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:15 - 19:30",
    trainingLocation: "Zelem",
    coach: "Sharleen Vanderheyden",
    assistantCoach: "Lotte Claeys",
    trainersTitel: "Trainster",
    image: "/images/under-construction.png",
    description:
      "De Women U10 traint op maandag en woensdag van 18.15 tot 19.30 uur in Zelem, met Sharleen " +
      "Vanderheyden en Lotte Claeys. Op deze leeftijd ligt de nadruk op passen, controle en het " +
      "eerste samenspel.",
    // Bij de RBFA heet deze ploeg U10 B.
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385197/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385197/overzicht"
  },

  {
    id: "dam-5",
    name: "Women U8",
    slug: "women-u8",
    category: "dames",
    subCategory: "meisjes",
    division: "U8 Meisjes",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:15 - 19:30",
    trainingLocation: "Zelem",
    coach: "Ylana De Vos",
    assistantCoach: "Siena Bottu",
    trainersTitel: "Trainster",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/placeholder-dames-2025.jpg
    description:
      "De Women U8 is onze jongste meisjesploeg en traint op maandag en woensdag van 18.15 tot " +
      "19.30 uur in Zelem, met Ylana De Vos en Siena Bottu. Alles draait om balgevoel, kleine " +
      "spelvormen en plezier.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385200/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385200/overzicht"
  },

  // ========== JEUGD (15) ==========

  {
    id: "j-2",
    name: "U17 A",
    slug: "u17-a",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "17:55 - 19:20",
    trainingLocation: "Zelem",
    coach: "Steven Bosmans",
    spelersGroep: "U17A",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U17-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De U17 A speelt elf tegen elf in 2-Gewestelijk en telt zeventien spelers, met Steven Bosmans " +
      "als trainer. Op deze leeftijd ligt de nadruk op de lange pass, de doelpoging na een hoge " +
      "voorzet en het spel in over- en ondertal.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385191/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385191/overzicht"
  },
  {
    id: "j-16",
    name: "U17 B",
    slug: "u17-b",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "17:55 - 19:20",
    trainingLocation: "Zelem",
    coach: "Kevin Thoelen",
    spelersGroep: "U17B",
    image: "/images/under-construction.png",
    description:
      "De U17 B is onze tweede ploeg op deze leeftijd, speelt elf tegen elf in 2-Gewestelijk en " +
      "telt zeventien spelers, met Kevin Thoelen als trainer. Er wordt getraind in Zelem, op " +
      "dezelfde dagen en uren als de U17 A.",
    // Vroeger de U16. Er waren te weinig ploegen voor een U16-reeks, dus de
    // ploeg speelt als U17 B en heet sinds september 2026 ook zo in de club.
    // De kalender komt van U17 B (386057); de ploeg die bij de RBFA U16 heet
    // (385192) staat leeg en is dus niet de juiste.
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/386057/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/386057/overzicht"
  },
  {
    id: "j-3",
    name: "U15",
    slug: "u15",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "Maandag 17:55 - 19:20 · Woensdag 16:30 - 18:00",
    trainingLocation: "Zelem",
    coach: "Jasper Peremans",
    spelersGroep: "U15",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U15-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De U15 speelt elf tegen elf in 2-Gewestelijk en telt zeventien spelers, met Jasper Peremans " +
      "als trainer. Trainen gebeurt op maandag van 17.55 tot 19.20 uur en op woensdag van 16.30 tot " +
      "18 uur in Zelem. De lange pass, het koppen en het spel op het grote veld staan centraal.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385193/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385193/overzicht"
  },
  {
    id: "j-4",
    name: "U13",
    slug: "u13",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "17:55 - 19:20",
    trainingLocation: "Zelem",
    coach: "Stijn Vlaeyen",
    spelersGroep: "U13",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U13-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De U13 speelt 8 tegen 8 in 2-Gewestelijk, telt twaalf spelers en traint op maandag en " +
      "woensdag van 17.55 tot 19.20 uur in Zelem, met Stijn Vlaeyen als trainer. Dit is het jaar " +
      "waarin de stap naar elf tegen elf wordt voorbereid: balsnelheid, de lange pass en het koppen " +
      "komen erbij.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385194/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385194/overzicht"
  },
  {
    id: "j-5",
    name: "U12",
    slug: "u12",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:15",
    trainingLocation: "KWS",
    coach: "Franky Forier",
    spelersGroep: "U12",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U12-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De U12 speelt 8 tegen 8 in 2-Gewestelijk, telt twaalf spelers en traint op maandag en " +
      "woensdag van 18 tot 19.15 uur in Linkhout, met Franky Forier als trainer. Passen in de loop " +
      "van een medespeler, de kaats en het spel in over- en ondertal staan centraal.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385195/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385195/overzicht"
  },
  {
    id: "j-6",
    name: "U11",
    slug: "u11",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "17:55 - 19:20",
    trainingLocation: "Zelem",
    coach: "Jorne Bynens",
    spelersGroep: "U11",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U11-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De U11 speelt 8 tegen 8 in 2-Gewestelijk en telt veertien spelers. Op deze leeftijd " +
      "verschuift de nadruk van dribbelen naar samenspelen: passen, controle onder druk en de " +
      "eerste tactische keuzes. Komen proberen kan altijd, ervaring is niet nodig.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385196/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385196/overzicht"
  },
  {
    id: "j-7",
    name: "U10",
    slug: "u10",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "17:15 - 18:30",
    trainingLocation: "Zelem",
    coach: "Kevin Thoelen",
    spelersGroep: "U10",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U10-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De U10 speelt 8 tegen 8 in 2-Gewestelijk, telt zes spelers en traint op dinsdag en donderdag " +
      "van 17.15 tot 18.30 uur in Zelem, met Kevin Thoelen als trainer. De pass over twintig meter " +
      "en de een-twee komen er dit jaar bij.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385207/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385207/overzicht"
  },
  {
    id: "j-8",
    name: "U9 A",
    slug: "u9-a",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:30",
    trainingLocation: "KWS",
    coach: "Gunther Vanneroem",
    trainersTitel: "Trainer",
    // A en B delen voorlopig een kern; iedereen staat op allebei de pagina's.
    spelersGroep: "U9",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U9-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De U9 A speelt 5 tegen 5 en traint op maandag en woensdag van 18 tot 19.30 uur in Linkhout, " +
      "Vanneroem als trainer. Op deze leeftijd draait het om leiden en dribbelen op snelheid, de " +
      "pass met de binnenkant van de voet en de eerste gerichte controle.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385199/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385199/overzicht"
  },
  {
    id: "j-8b",
    name: "U9 B",
    slug: "u9-b",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:30",
    trainingLocation: "KWS",
    coach: "Gunther Vanneroem",
    trainersTitel: "Trainer",
    spelersGroep: "U9",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U9-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De U9 B is onze tweede ploeg op deze leeftijd, speelt 5 tegen 5 en traint op maandag en " +
      "woensdag van 18 tot 19.30 uur in Linkhout, met Gunther Vanneroem als trainer. Leiden, " +
      "dribbelen op snelheid en de pass met de binnenkant van de voet staan centraal.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385198/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385198/overzicht"
  },
  {
    id: "j-9",
    name: "U8 A",
    slug: "u8-a",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "17:55 - 19:20",
    trainingLocation: "Zelem",
    coach: "Simon Biesmans",
    spelersGroep: "U8",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U8-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De U8 A speelt 5 tegen 5 en traint op dinsdag en donderdag van 17.55 tot 19.20 uur in Zelem, " +
      "met Simon Biesmans als trainer. Samen met de U8 B telt de leeftijdsgroep tien spelers. In " +
      "kleine wedstrijdvormen leren ze de pass en de controle met de binnenkant van de voet.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385206/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385206/overzicht"
  },
  {
    id: "j-9b",
    name: "U8 B",
    slug: "u8-b",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "17:55 - 19:20",
    trainingLocation: "Zelem",
    coach: "Simon Biesmans",
    spelersGroep: "U8",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U8-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description:
      "De U8 B is onze tweede ploeg op deze leeftijd, speelt 5 tegen 5 en traint op dinsdag en " +
      "donderdag van 17.55 tot 19.20 uur in Zelem, met Simon Biesmans als trainer. Samen met de U8 " +
      "A telt de leeftijdsgroep tien spelers.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385201/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385201/overzicht"
  },
  {
    id: "j-10",
    name: "U7 A",
    slug: "u7-a",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:15",
    trainingLocation: "KWS",
    coach: "Lennert Neuteleers",
    spelersGroep: "U7",
    assistantCoach: "Simon Biesmans",
    trainersTitel: "Trainer",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U7-2025.jpg
    calendarUrl: "#",
    description:
      "De U7 A speelt 3 tegen 3 en traint op maandag en woensdag van 18 tot 19.15 uur in Linkhout, " +
      "met Lennert Neuteleers en Simon Biesmans. Samen met de U7 B telt de leeftijdsgroep veertien " +
      "spelers. Er wordt vooral gespeeld: leiden en dribbelen in spelvorm, met beide voeten.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385203/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385203/overzicht"
  },
  {
    id: "j-10b",
    name: "U7 B",
    slug: "u7-b",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:15",
    trainingLocation: "KWS",
    coach: "Lennert Neuteleers",
    spelersGroep: "U7",
    assistantCoach: "Simon Biesmans",
    trainersTitel: "Trainer",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U7-2025.jpg
    calendarUrl: "#",
    description:
      "De U7 B is onze tweede ploeg op deze leeftijd, speelt 3 tegen 3 en traint op maandag en " +
      "woensdag van 18 tot 19.15 uur in Linkhout, met Lennert Neuteleers en Simon Biesmans. Samen " +
      "met de U7 A telt de leeftijdsgroep veertien spelers.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385202/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385202/overzicht"
  },
  {
    id: "j-11",
    name: "U6",
    slug: "u6",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:00",
    trainingLocation: "KWS",
    coach: "Aliano Baeten",
    spelersGroep: "U6",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U6-2025.jpg
    description:
      "De U6 speelt 2 tegen 2, telt elf spelers en traint op maandag en woensdag van 18 tot 19 uur " +
      "in Linkhout, met Aliano Baeten als trainer. Plezier staat voorop: veel spelletjes, " +
      "dribbelen en doelpogingen op kleine doeltjes.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385204/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385204/overzicht"
  },
  {
    id: "j-u5",
    name: "U5 Voetbaltuin",
    slug: "u5",
    category: "jeugd",
    division: "Voetbaltuin",
    trainingDays: ["Woensdag"],
    trainingTime: "18:00 - 19:00",
    trainingLocation: "KWS",
    coach: "",
    image: "/images/under-construction.png",
    description:
      "De Voetbaltuin is onze jongste groep, voor kinderen vanaf vier jaar. Er worden nog geen " +
      "wedstrijden gespeeld en het aantal kinderen wisselt van week tot week; het is vooral een " +
      "voetbalspeeltuin. Elke woensdag van 18 tot 19 uur in Linkhout.",
  }
];

// REGEL 181-190: Helper functies
export const getTeamBySlug = (slug: string): Team | undefined => {
  return teams.find(team => team.slug === slug);
};

export const getTeamsByCategory = (category: Team["category"]): Team[] => {
  return teams.filter(team => team.category === category);
};

export const getAllSlugs = (): string[] => {
  return teams.map(team => team.slug);
};
