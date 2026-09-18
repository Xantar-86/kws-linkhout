import type { Metadata } from "next";
import ToestemmingClient from "./Client";

/**
 * Het toestemmingsformulier voor beeldmateriaal van de jeugd.
 *
 * Dit is geen gewone websitepagina. Ze staat niet in het menu, niet in de
 * sitemap en niet in de zoekresultaten: het adres gaat via de afgevaardigden
 * naar de ouders van één ploeg. Wie het adres niet heeft, hoeft hier ook niet
 * te zijn. Daarom `robots: noindex` hier, een regel in robots.ts en een
 * X-Robots-Tag in next.config.ts, zodat het ook geldt als iemand er toch naar
 * linkt.
 *
 * De omlijsting van de site (menu en voettekst) valt weg, net als bij
 * sponsoring: dit is een formulier om af te werken, geen pagina om van weg te
 * klikken. Zie components/layout/SiteOmlijsting.tsx.
 *
 * Het ingevulde formulier wordt het echte clubdocument uit
 * public/Docs/gdpr/, ingevuld en afgevlakt door /api/toestemming.
 */
export const metadata: Metadata = {
  title: "Toestemming beeldmateriaal jeugd",
  description:
    "Geef per kanaal aan welke foto’s en filmpjes KWS Linkhout van je kind mag gebruiken.",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return <ToestemmingClient />;
}
