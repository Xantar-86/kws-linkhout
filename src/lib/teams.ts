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
    calendarIframe: "https://foot24.be/nl/iframe/ws-linkhout/reserven-2151?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/1-b-1828?per_page=999",
    calendarIcal: "https://www.foot24.be/nl/ical/ws-linkhout/1-b-1828.ics?key=8XJ0zG5",
    standingsIframe: "https://embed.voetbalinbelgie.be/competities/2025-2026/limburg/mannen/4a/?bU=false&iDO=1&sTFC=%23ffffff&sTBC=%23df2626&bBT=true&sBC=%23ffffff&bAT=true&sAC=%23f3f3f3"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/1-vrouwen-596?per_page=999",
    calendarIcal: "https://www.foot24.be/nl/ical/ws-linkhout/1-vrouwen-596.ics?key=B1WjXx2",
    standingsIframe: "https://embed.voetbalinbelgie.be/competities/2025-2026/limburg/vrouwen/2a/?bU=false&iDO=1&sTFC=%23ffffff&sTBC=%23df2626&bBT=true&sBC=%23ffffff&bAT=true&sAC=%23f3f3f3"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u20-vrouwen-54?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u16-vrouwen-a-24?per_page=999"
  },
  {
    id: "dam-4",
    name: "Women U16 B",
    slug: "women-u16-b",
    category: "dames",
    subCategory: "meisjes",
    division: "2-Meisjes U16 reeks P",
    trainingDays: ["maandag", "woensdag"],
    trainingTime: "19:35 - 21:00",
    coach: "Frank Schroyen",
    image: "/images/teams/placeholder-dames.jpg",
    calendarUrl: "#",
    standingsUrl: "#",
    description: "Het tweede U16 team met evenveel enthousiasme en inzet.",
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u16-vrouwen-b-30?per_page=999"
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
    coach: "Frank Schroyen",
    image: "/images/teams/placeholder-dames.jpg",
    description: "Onze jongste meisjes maken hun eerste stappen op het voetbalveld.",
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u8-m-18?per_page=999"
  },
  {
    id: "dam-6",
    name: "Recrea Vrouwen",
    slug: "recrea-vrouwen",
    category: "dames",
    division: "Vriendschappelijk",
    trainingDays: ["?"],
    trainingTime: "?",
    coach: "Staf Vaes",
    image: "/images/teams/recrea-vrouwen.jpg",
    description: "Gezellig voetballen voor dames van alle niveaus.",
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/recrea-vrouwen-123?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u17-1892?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u15-7400?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u13-1776?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u12-1647?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u11-1755?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u10-1760?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u10-b-1622?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u9-1432?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u9-b-2208?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u8-a-1483?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u8-b-1665?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u7-2042?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u7-b-1155?per_page=999"
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
    calendarIframe: "https://www.foot24.be/nl/iframe/ws-linkhout/u6-5389?per_page=999"
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