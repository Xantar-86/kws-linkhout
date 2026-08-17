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
    description: "Ons vlaggenschip in de 2de Provinciale. Een mix van ervaring en jong talent.",
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
      "Een gedreven ploeg in de 4de Provinciale waar jonge talenten en ervaren spelers samen bouwen aan de toekomst van K.W.S. Linkhout.",
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
    description: "De toekomstige talenten en ervaren krachten van de club.",
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
    description: "Gezellig voetballen voor heren van alle niveaus."
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
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/1ste-ploeg-dames-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Onze eerste damesploeg strijdt elke week voor de punten in de 1ste Provinciale.",
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
    description: "Gezellig voetballen voor dames van alle niveaus.",
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
    image: "/images/under-construction.png",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Onze tweede damesploeg in de 2de Provinciale.",
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
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/women-U20-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "De brug tussen jeugd en senioren voor onze meisjestalenten.",
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
    description: "Talentvolle meisjes die elke week met plezier trainen en spelen.",
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
    description: "Onze jongste meisjes maken hun eerste stappen op het voetbalveld.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385200/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385200/overzicht"
  },

  // ========== JEUGD (15) ==========

  {
    id: "j-2",
    name: "U17",
    slug: "u17",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "17:55 - 19:20",
    trainingLocation: "Zelem",
    coach: "Steven Bosmans",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U17-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Talentvolle jongens in de belangrijke ontwikkelingsfase.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385191/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/385191/overzicht"
  },
  {
    id: "j-16",
    name: "U16",
    slug: "u16",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "17:55 - 19:20",
    trainingLocation: "Zelem",
    coach: "Kevin Thoelen",
    image: "/images/under-construction.png",
    description: "Onze U16 in de belangrijke ontwikkelingsfase.",
    // Deze ploeg speelt dit seizoen mee als U17 B, omdat er te weinig ploegen
    // waren voor een U16-reeks. In de club heet ze wel gewoon U16, dus de naam
    // hierboven blijft. De kalender komt van U17 B (386057); de ploeg die bij
    // de RBFA U16 heet (385192) staat leeg en is dus niet de juiste.
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
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U15-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Techniek en tactiek staan centraal in deze leeftijdsgroep.",
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
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U13-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "De overgang van 8 naar 11 tegen 11 voetbal.",
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
    trainingTime: "17:55 - 19:20",
    trainingLocation: "KWS",
    coach: "Franky Forier",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U12-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Spelenderwijs leren en plezier maken staat voorop.",
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
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U11-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "De basis van techniek en teamspel wordt hier gelegd.",
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
    trainingTime: "17:00 - 18:15",
    trainingLocation: "Zelem",
    coach: "Kevin Thoelen",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U10-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Veel spelvormen en plezier op het veld.",
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
    assistantCoach: "Staf Vaes",
    trainersTitel: "Trainer",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U9-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Ontdekken, leren en groeien als voetballer.",
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
    assistantCoach: "Staf Vaes",
    trainersTitel: "Trainer",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U9-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Het tweede U9 team met veel potentieel.",
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
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U8-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "De eerste stappen in het competitieve voetbal.",
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
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U8-2025.jpg
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Het tweede U8 team met veel plezier op het veld.",
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
    coach: "Lennert Mellebeek",
    assistantCoach: "Simon Biesmans",
    trainersTitel: "Trainer",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U7-2025.jpg
    calendarUrl: "#",
    description: "Spelenderwijs kennismaken met voetbal.",
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
    coach: "Lennert Mellebeek",
    assistantCoach: "Simon Biesmans",
    trainersTitel: "Trainer",
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U7-2025.jpg
    calendarUrl: "#",
    description: "Het tweede U7 team met veel enthousiasme.",
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
    image: "/images/under-construction.png", // TODO nieuwe foto: /images/teams/U6-2025.jpg
    description: "Onze allerkleinsten! Plezier en bewegen staat centraal.",
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
    description: "Onze allerjongsten maken spelenderwijs kennis met voetbal in de voetbaltuin."
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
