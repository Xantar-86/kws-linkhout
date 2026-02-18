export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  category: "bestuur" | "jeugd" | "dames" | "senioren" | "administratie";
  image?: string;
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  description: string;
  features: string[];
  mapUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "lidmaatschap" | "trainingen" | "wedstrijden" | "praktisch";
}

export const contactPersons: ContactPerson[] = [
  {
    id: "1",
    name: "Gert Peremans",
    role: "Algemeen voorzitter KWS Linkhout",
    email: "info@kwslinkhout.be",
    category: "bestuur"
  },
  {
    id: "2",
    name: "Wesly Thomas",
    role: "Jeugdvoorzitter",
    email: "info@kwslinkhout.be",
    phone: "0468 12 10 21",
    category: "jeugd"
  },
  {
    id: "3",
    name: "TVJO",
    role: "(Technisch Verantwoordelijke JeugdOpleiding)",
    email: "info@kwslinkhout.be",
    phone: "",
    category: "jeugd"
  },
  {
    id: "4",
    name: "Lincy Mechelmans",
    role: "API (Aanspreekpunt Integriteit)",
    email: "api.kwslinkhout@gmail.com",
    phone: "0494 85 36 10",
    category: "jeugd"
  },
  {
    id: "5",
    name: "Frank Schroyen",
    role: "Hoofdtrainer Dames",
    email: "info@kwslinkhout.be",
    phone: "0476 23 57 29",
    category: "dames"
  },
  {
    id: "6",
    name: "Patrick Beutels",
    role: "Trainer 1ste Ploeg P2",
    email: "info@kwslinkhout.be",
    category: "senioren"
  },
  {
    id: "7",
    name: "Secretariaat",
    role: "Administratie & lidmaatschappen",
    email: "info@kwslinkhout.be",
    category: "administratie"
  }
];

export const facilities: Facility[] = [
  {
    id: "1",
    name: "KWS Linkhout Clubhuis",
    address: "Kapelstraat 72, 3560 Linkhout",
    description: "Ons clubhuis is de thuisbasis van KWS Linkhout. Hier vind je de kantine, kleedkamers en alle faciliteiten voor spelers en bezoekers.",
    features: [
      "Kantine met terras",
      "6 kleedkamers",
      "Scheidsrechterslokaal",
      "Verwarmde douches",
      "Gratis parking",
      "Toegankelijk voor rolstoelen"
    ],
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2511.1234567890123!2d5.123456789012345!3d51.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDA3JzI0LjQiTiA1wrAwNyczNi40IkU!5e0!3m2!1snl!2sbe!4v1234567890123!5m2!1snl!2sbe"
  }
];

export const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "Hoe schrijf ik mijn kind in bij KWS Linkhout?",
    answer: "Je kan eenvoudig online inschrijven via ons Inschrijvingsformulier op de pagina 'Nieuwe Aansluiting'. Vul je gegevens in en wij nemen asap contact op. Je kan ook mailen naar tvjo@kwslinkhout.be (jeugd) of info@kwslinkhout.be (dames/senioren).",
    category: "lidmaatschap"
  },
  {
    id: "2",
    question: "Wat kost het lidgeld?",
    answer: "Het lidgeld voor seizoen 2025-2026 is: U6-U8: €150, U9-U12: €175, U13-U17: €200, U21: €225, Senioren: €250, Dames: €225. Dit is inclusief verzekering, clubkledij (shirt, short, kousen) en deelname aan clubactiviteiten.",
    category: "lidmaatschap"
  },
  {
    id: "3",
    question: "Wanneer zijn de trainingen?",
    answer: "De trainingen vinden doorgaans plaats op weekdagen in de namiddag/avond en op zaterdagochtend. Exacte tijden verschillen per ploeg. Raadpleeg de ploegpagina voor specifieke trainingstijden of neem contact op met je trainer.",
    category: "trainingen"
  },
  {
    id: "4",
    question: "Wat moet mijn kind meenemen naar de training?",
    answer: "Verplichte uitrusting: voetbalschoenen (niet voor in de kantine!), sportkledij, scheenbeschermers, bidon met water, badslippers voor de douche, en een plastic zak voor natte kledij. Vanaf U8 moeten spelers zelf hun tas kunnen inpakken.",
    category: "trainingen"
  },
  {
    id: "5",
    question: "Hoe laat moeten we aanwezig zijn voor een wedstrijd?",
    answer: "Spelers dienen minstens 45 minuten voor aanvang van de wedstrijd aanwezig te zijn op de afgesproken locatie. De trainer communiceert dit altijd via Spond of Whatsapp of bij de training.",
    category: "wedstrijden"
  },
  {
    id: "6",
    question: "Is er een kantine aanwezig?",
    answer: "Ja, onze kantine is open tijdens trainingen en wedstrijden. Je kan er terecht voor drankjes, snacks en soep. Het is verboden om met voetbalschoenen de kantine te betreden.",
    category: "praktisch"
  },
  {
    id: "7",
    question: "Waar kan ik parkeren?",
    answer: "Er is een grote gratis parking aanwezig bij het clubhuis. Volg de borden 'KWS Linkhout'. Op drukke wedstrijddagen raden we aan om iets vroeger te komen voor de beste plekken.",
    category: "praktisch"
  },
  {
    id: "8",
    question: "Wat bij een blessure of ongeval?",
    answer: "Bij een blessure tijdens training of wedstrijd wordt er altijd een EHBO'er ingeschakeld. Voor verzekeringsaangifte moet je een 'Aangifte ongeval' formulier invullen (beschikbaar in de kantine of op de website). Dit moet zo snel mogelijk worden bezorgd aan het secretariaat.",
    category: "praktisch"
  }
];

export const getContactsByCategory = (category: ContactPerson["category"]): ContactPerson[] => {
  return contactPersons.filter(person => person.category === category);
};

export const getFAQByCategory = (category: FAQItem["category"]): FAQItem[] => {
  return faqItems.filter(item => item.category === category);
};
