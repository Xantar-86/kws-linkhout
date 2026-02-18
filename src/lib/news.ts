export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "clubnieuws" | "ploegnieuws" | "evenementen";
  image: string;
  date: string;
  author: string;
  readTime: number;
  featured?: boolean;
}

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "nieuwsbrief-seizoenseinde",
    title: "Nieuwsbrief: Einde seizoen & vooruitblik nieuw seizoen",
    excerpt: "Het einde van het voetbalseizoen nadert. Lees alles over inschrijvingen, pasdagen en seizoensafsluiting.",
    content: `Beste,

Het is jammer genoeg zover... het einde van het voetbalseizoen nadert. De laatste wedstrijden werden gespeeld, de tornooien worden afgewerkt en seizoensafsluitende activiteiten worden georganiseerd.

Maar niet getreurd, onze club kijkt alvast vooruit en werkt volop aan het nieuwe seizoen! Gesprekken met trainers vinden plaats, planningen worden opgemaakt en de structuur wordt uitgezet.

**Lidgeld en inschrijvingen**

Zoals u weet, opteren wij als club voor een transparant beleid. Daarom willen we u inzage geven hoe het lidgeld opgebouwd wordt. De huidige kost van een lid voor de club bedraagt gemiddeld tussen €575 en €650, afhankelijk van de leeftijd.

Een kost die we voor de helft dekken met het lidgeld en waarvan we het tweede deel trachten te bekostigen met de inkomsten vanuit de verschillende activiteiten van de club.

**Deze kost bestaat uit volgende items:**
• Gebruik van infrastructuur en accommodatie
• Een kledijpakket (of aankoop-bedrag vrij te spenderen)
• Materiaalkosten (bal & trainingsmateriaal)
• Opleiding door gemotiveerde trainers
• Arbitrage
• Bondskosten en verplichte bondsverzekering via Voetbal Federatie Vlaanderen (VFV)

**Inschrijven voor het nieuwe seizoen zal vanaf 19 mei mogelijk zijn.** Alle reeds aangesloten spelers krijgen een e-mail toegestuurd ter verificatie van hun gegevens! In deze email zit ook een betalingsreferentie om het lidgeld te storten. Nieuwe leden zullen de optie hebben om via een online formulier in te schrijven.

**Pasdagen Errea**

Om het nieuwe seizoen al meteen te kunnen starten met een mooie outfit zal het team van Errea ons een bezoekje brengen. Op dinsdag 3 juni is iedereen welkom om tussen 17u30 en 20u30 even naar de kantine te komen voor onze pasdagen!

Zo krijgen alle spelers de mogelijkheid om de verschillende maten te passen en bent u, bij bestelling, ook zeker dat de kledij voor de aanvang van het seizoen geleverd wordt.

Opgelet! Kledij zal enkel uitgeleverd worden indien de speler effectief aangesloten is bij de club en de betaling van het lidgeld is voldaan.

[Bekijk de volledige nieuwsbrief (PDF)](/Docs/nieuws/nieuwsbrief.pdf)`,
    category: "clubnieuws",
    image: "/images/news/kws-info.jpg",
    date: "2025-05-01",
    author: "Bestuur KWS Linkhout",
    readTime: 5,
    featured: true
  },
  {
    id: "2",
    slug: "oudervoetbal-tornooi",
    title: "Oudervoetbal Tornooi - Mama's & Papa's tegen de kids!",
    excerpt: "Kom op zaterdag 17 mei strijden tegen je eigen kinderen tijdens ons traditioneel oudervoetbal tornooi.",
    content: `De laatste trainingen van dit seizoen worden deze week afgewerkt. Om het seizoen officieel samen af te sluiten houden wij traditiegetrouw een gezellig en sfeervol oudervoetbal-tornooi.

Mama's en papa's krijgen hier de unieke kans om enkele wedstrijdjes te spelen tegen hun eigen kinderen! Deze spannende wedstrijden zullen dit jaar doorgaan op **zaterdag 17 mei**, begeleid door iedereen die het seizoen mee heeft gevolgd.

Een perfecte afsluiter van het seizoen en een leuke manier om de band tussen ouders en kinderen te versterken. Of de ouders het dit jaar gaan halen van de kids? Dat valt nog te bezien!

Naast het oudervoetbal tornooi organiseren we ook een nachttornooi in de avond. Alle info vind je in de nieuwsbrief.

**Praktisch:**
• Datum: Zaterdag 17 mei
• Locatie: Terreinen KWS Linkhout
• Iedereen welkom om te komen supporteren!`,
    category: "evenementen",
    image: "/images/news/oudervoetbal.jpg",
    date: "2025-05-10",
    author: "Activiteitencommissie",
    readTime: 2
  },
  {
    id: "3",
    slug: "duckrace-2025",
    title: "Duckrace op de Demer - Maandag 9 juni",
    excerpt: "Vergeet niet om je eendjes dit weekend binnen te brengen! Op maandag 9 juni varen ze de race op de Demer.",
    content: `Een van onze leukste jaarlijkse activiteiten staat voor de deur: de Duckrace! 

**Let op:** Vergeet zeker niet om de eendjes dit weekend binnen te brengen!

Alle verkochte eendjes zullen op **maandag 9 juni** een race afleggen op de Demer. Kom jouw eendjes aanmoedigen en wie weet kan je een mooie prijs mee naar huis nemen.

Het is altijd een gezellige bedoening langs de oevers van de Demer, dus nodig zeker familie en vrienden uit om te komen kijken!

**Praktisch:**
• Datum: Maandag 9 juni
• Locatie: Demer (meer info volgt)
• Alle eendjes moeten vooraf ingeleverd worden`,
    category: "evenementen",
    image: "/images/news/duckrace.jpg",
    date: "2025-06-02",
    author: "Activiteitencommissie",
    readTime: 2
  },
  {
    id: "4",
    slug: "nachttornooi-2025",
    title: "Nachttornooi Weekend - 16 & 17 mei",
    excerpt: "Drie dagen voetbalplezier: 8-a-side 35+ tornooi, oudervoetbal en nachttornooi. Schrijf je team nu in!",
    content: `Vergeet ook zeker het nachttornooi weekend niet! Een heel weekend vol voetbalplezier:

**Vrijdag 16 mei**
8-a-side 35+ tornooi

**Zaterdag 17 mei**
Oudervoetbal tornooi (mama's & papa's tegen de kids)

**Zaterdagavond 17 mei**
Het grote nachttornooi

Wij zijn nog steeds op zoek naar leuke teams die willen deelnemen. Inschrijven kan via het formulier op onze website.

**Wil je meedoen?**
Schrijf je team in via het Inschrijvingsformulier op kwslinkhout.be. Hoe meer teams, hoe groter het feest!`,
    category: "evenementen",
    image: "/images/news/nachttornooi.jpg",
    date: "2025-05-05",
    author: "Tornooicommissie",
    readTime: 2
  },
  {
    id: "5",
    slug: "ledenbevraging-2025",
    title: "Jouw mening telt! - Ledenbevraging",
    excerpt: "Help onze club groeien en vul de bevraging in. Samen maken we KWS nog beter!",
    content: `Zoals u hierboven al kon lezen zal onze club een thuis zijn voor heel wat ploegen. Dit wil zeggen dat de KWS-familie alleen maar groter zal worden.

Het blijft voor onze club belangrijk om ook in tijden van groei zo dicht mogelijk bij alle leden en ouders te staan. Daarom luisteren wij graag naar uw mening!

Met een bevraging onder de ouders en leden kunnen wij waardevolle inzichten krijgen over wat goed gaat en waar er ruimte is voor verbetering. Samen kunnen wij ervoor zorgen dat KWS een plek blijft waar iedereen zich thuis voelt en optimaal kan genieten van het mooie spel genaamd voetbal.

**Graag vragen wij enkele minuten van uw tijd om onze bevraging in te vullen.**

Met een bevraging onder de ouders en leden kunnen wij waardevolle inzichten krijgen over wat goed gaat en waar er ruimte is voor verbetering. Samen kunnen wij ervoor zorgen dat KWS een plek blijft waar iedereen zich thuis voelt en optimaal kan genieten van het mooie spel genaamd voetbal.

Uw feedback is van onschatbare waarde voor de toekomst van onze club!

Alvast bedankt voor uw medewerking.`,
    category: "clubnieuws",
    image: "/images/news/ledenbevraging-rood.jpg",
    date: "2025-04-25",
    author: "Bestuur KWS Linkhout",
    readTime: 3
  },
  {
    id: "6",
    slug: "jaarlijks-tornooi-2025",
    title: "Jaarlijks Tornooi KWS Linkhout - 29-31 augustus",
    excerpt: "Sla de datum alvast in je agenda! Ons jaarlijks tornooi vindt plaats op 29, 30 en 31 augustus 2025.",
    content: `De eerste belangrijke datum voor het nieuwe seizoen is die van ons jaarlijks tornooi! 

Dit zal plaatsvinden op:
• Vrijdag 29 augustus 2025
• Zaterdag 30 augustus 2025  
• Zondag 31 augustus 2025

Een fantastisch weekend vol voetbal, gezelligheid en sfeer. Meer info over de teams die deelnemen en het exacte programma volgt later.

Sla de datum alvast in je agenda en kom onze club supporten tijdens dit mooie evenement!

**Hulp nodig?**
Als laatste punt houden wij eraan om u te bedanken. KWS kan alleen bestaan door uw liefde voor onze club, uw aanwezigheid op onze verschillende evenementen en uw deelname aan onze acties.

**DANK U daarvoor!**

Sportieve groeten van het voltallige bestuur en alle vrijwilligers!

Tot in de kantine of naast het veld..

Heeft u nog vragen? Aarzel niet om ons te contacteren via info@kwslinkhout.be`,
    category: "evenementen",
    image: "/images/news/jaarlijks tornooi.JPG",
    date: "2025-04-20",
    author: "Tornooicommissie",
    readTime: 3
  }
];

export const getArticleBySlug = (slug: string): NewsArticle | undefined => {
  return newsArticles.find(article => article.slug === slug);
};

export const getArticlesByCategory = (category: NewsArticle["category"]): NewsArticle[] => {
  return newsArticles.filter(article => article.category === category);
};

export const getFeaturedArticle = (): NewsArticle | undefined => {
  return newsArticles.find(article => article.featured);
};

export const getRecentArticles = (limit: number = 6): NewsArticle[] => {
  return [...newsArticles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};
