import { getCmsArticles } from "./news-server";

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
  attachment?: string;
}

// BELANGRIJK: Dit artikel moet blijven staan (gefixeerd)
const fixedArticle: NewsArticle = {
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
};

// CMS artikelen + vast artikel
export async function getAllArticles(): Promise<NewsArticle[]> {
  const cmsArticles = await getCmsArticles();
  // Combineer: vast artikel eerst, dan CMS artikelen
  return [fixedArticle, ...cmsArticles];
}

// Client-side compatible
export const newsArticles: NewsArticle[] = [fixedArticle];

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

// Server-side exports
export { getCmsArticles } from "./news-server";
