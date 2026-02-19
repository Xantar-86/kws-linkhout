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
  coach: string;
  assistantCoach?: string;
  image: string;
  calendarUrl?: string;
  standingsUrl?: string;
  description?: string;
  calendarIframe?: string;
  standingsIframe?: string;
  calendarIcal?: string;
}

// REGEL 21-180: Alle ploegen data
export const teams: Team[] = [
  // ========== SENIOREN (3) ==========
  {
    id: "sen-1",
    name: "1ste Ploeg P2",
    slug: "eerste-ploeg",
    category: "senioren",
    division: "2de Provinciale Limb A",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "19:30 - 21:00",
    coach: "Patrick Beutels",
    image: "/images/teams/1ste-ploeg.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Ons vlaggenschip in de 2de Provinciale. Een mix van ervaring en jong talent.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/337162/kalender",
    calendarIcal: "https://ical.voetbalinbelgie.be/competities/2025-2026/limburg/mannen/2a/?c=linkhout-kws",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/337162/overzicht"
  },
  {
    id: "sen-2",
    name: "Beloften P2",
    slug: "reserven",
    category: "senioren",
    division: "Reserven Voetb Vl AU",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "19:30 - 21:00",
    coach: "Steven V",
    image: "/images/teams/placeholder-senioren.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "De toekomstige talenten en ervaren krachten van de club.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/337161/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/337161/overzicht"
  },
  {
    id: "sen-3",
    name: "1ste Ploeg P4",
    slug: "recrea-mannen",
    category: "senioren",
    division: "4 Provinciale Limb A",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "19:30 - 21:00",
    coach: "Ramon",
    image: "/images/teams/placeholder-senioren.jpg",
    description: "Voor de liefhebbers die voetbal combineren met gezelligheid.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/337159/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/337159/overzicht"
  },

  // ========== DAMES/MEISJES (6) ==========
  {
    id: "dam-1",
    name: "Dames 1ste Ploeg P2",
    slug: "eerste-ploeg-dames",
    category: "dames",
    division: "2de Provinciale Dames",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "19:35 - 21:00",
    coach: "Frank Schroyen",
    image: "/images/teams/1ste-ploeg-dames.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Onze damesploeg strijdt elke week voor de punten in de 2de Provinciale.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/337160/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/337160/overzicht"
  },
  {
    id: "dam-2",
    name: "Women U20",
    slug: "women-u20",
    category: "dames",
    subCategory: "meisjes",
    division: "2-Meisjes U20 reeks E",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "19:35 - 21:00",
    coach: "Steven B",
    image: "/images/teams/women-U20.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "De brug tussen jeugd en senioren voor onze meisjestalenten.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351080/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351080/overzicht"
  },
  {
    id: "dam-3",
    name: "Women U16",
    slug: "women-u16",
    category: "dames",
    subCategory: "meisjes",
    division: "2-Meisjes U16 reeks Q",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "19:35 - 21:00",
    coach: "Frank Schroyen",
    image: "/images/teams/women-U16.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Talentvolle meisjes die elke week met plezier trainen en spelen.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351079/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351079/overzicht"
  },

  {
    id: "dam-5",
    name: "Women U8",
    slug: "women-u8",
    category: "dames",
    subCategory: "meisjes",
    division: "U8 Meisjes",
    trainingDays: ["?"],
    trainingTime: "?",
    coach: "Kevin Kenis",
    image: "/images/teams/placeholder-dames.jpg",
    description: "Onze jongste meisjes maken hun eerste stappen op het voetbalveld.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/359734/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/359734/overzicht"
  },
  {
    id: "dam-6",
    name: "Recrea Vrouwen",
    slug: "recrea-vrouwen",
    category: "dames",
    division: "Vriendschappelijk",
    trainingDays: ["Woensdag"],
    trainingTime: "20:00 - 21:30",
    coach: "Staf Vaes",
    image: "/images/teams/recrea-vrouwen.jpg",
    description: "Gezellig voetballen voor dames van alle niveaus.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/359957/kalender"
  },

  // ========== JEUGD (17) ==========

  {
    id: "j-2",
    name: "U17",
    slug: "u17",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "18:00 - 19:25",
    coach: "Steven B",
    image: "/images/teams/U17.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Talentvolle jongens in de belangrijke ontwikkelingsfase.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351067/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351067/overzicht"
  },
  {
    id: "j-3",
    name: "U15",
    slug: "u15",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:25",
    coach: "Jasper Peremans",
    image: "/images/teams/U15.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Techniek en tactiek staan centraal in deze leeftijdsgroep.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351068/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351068/overzicht"
  },
  {
    id: "j-4",
    name: "U13",
    slug: "u13",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:25",
    coach: "Pieter Peremans",
    image: "/images/teams/U13.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "De overgang van 8 naar 11 tegen 11 voetbal.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351069/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351069/overzicht"
  },
  {
    id: "j-5",
    name: "U12",
    slug: "u12",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:30",
    coach: "Stijn Vlaeyen",
    image: "/images/teams/U12.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Spelenderwijs leren en plezier maken staat voorop.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351070/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351070/overzicht"
  },
  {
    id: "j-6",
    name: "U11",
    slug: "u11",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:30",
    coach: "Maarten Cleeren",
    image: "/images/teams/U11.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "De basis van techniek en teamspel wordt hier gelegd.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351071/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351071/overzicht"
  },
  {
    id: "j-7",
    name: "U10 A",
    slug: "u10-a",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:30",
    coach: "Franky Forrier & Staf Vaes",
    image: "/images/teams/U10.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Veel spelvormen en plezier op het veld.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351072/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351072/overzicht"
  },
  {
    id: "j-7b",
    name: "U10 B",
    slug: "u10-b",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Maandag", "Woensdag"],
    trainingTime: "18:00 - 19:30",
    coach: "Franky Forrier & Staf Vaes",
    image: "/images/teams/U10.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Het tweede U10 team met evenveel enthousiasme.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/357042/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/357042/overzicht"
  },
  {
    id: "j-8",
    name: "U9 A",
    slug: "u9-a",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "18:00 - 19:30",
    coach: "Staf Vaes",
    image: "/images/teams/U9.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Ontdekken, leren en groeien als voetballer.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351073/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351073/overzicht"
  },
  {
    id: "j-8b",
    name: "U9 B",
    slug: "u9-b",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "18:00 - 19:30",
    coach: "Staf Vaes",
    image: "/images/teams/U9.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Het tweede U9 team met veel potentieel.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/359368/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/359368/overzicht"
  },
  {
    id: "j-9",
    name: "U8 A",
    slug: "u8-a",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "18:00 - 19:30",
    coach: "Kevin Kenis & Gunther Vanneroem",
    image: "/images/teams/U8.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "De eerste stappen in het competitieve voetbal.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351075/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351075/overzicht"
  },
  {
    id: "j-9b",
    name: "U8 B",
    slug: "u8-b",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "18:00 - 19:30",
    coach: "Kevin Kenis & Gunther Vanneroem",
    image: "/images/teams/U8.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Het tweede U8 team met veel plezier op het veld.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351074/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351074/overzicht"
  },
  {
    id: "j-10",
    name: "U7 A",
    slug: "u7-a",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "18:00 - 19:15",
    coach: "Wesly Thomas & Abdullah Sümbül",
    image: "/images/teams/U7.jpg",
    calendarUrl: "#",
    description: "Spelenderwijs kennismaken met voetbal.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351076/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351076/overzicht"
  },
  {
    id: "j-10b",
    name: "U7 B",
    slug: "u7-b",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Dinsdag", "Donderdag"],
    trainingTime: "18:00 - 19:15",
    coach: "Wesly Thomas & Abdullah Sümbül",
    image: "/images/teams/U7.jpg",
    calendarUrl: "#",
    description: "Het tweede U7 team met veel enthousiasme.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/356637/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/356637/overzicht"
  },
  {
    id: "j-11",
    name: "U6",
    slug: "u6",
    category: "jeugd",
    division: "2-Gewestelijk",
    trainingDays: ["Woensdag"],
    trainingTime: "18:00 - 19:00",
    coach: "Simon Biesmans & Lennert Neuteleers",
    image: "/images/teams/U6.jpg",
    description: "Onze allerkleinsten! Plezier en bewegen staat centraal.",
    calendarIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351077/kalender",
    standingsIframe: "https://www.rbfa.be/nl/club/1595/ploeg/351077/overzicht"
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