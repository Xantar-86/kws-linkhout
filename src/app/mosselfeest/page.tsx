import type { Metadata } from "next";
import MosselfeestClient from "./Client";

/**
 * Inschrijven voor het mosselfeest.
 *
 * Zoals het toestemmingsformulier staat deze pagina los van de site: niet in
 * het menu, niet in de sitemap, op noindex. Het adres gaat via de kanalen van
 * de club naar wie een kaart in handen heeft.
 *
 * Het overzicht met de totalen staat op /mosselfeest/overzicht en vraagt het
 * wachtwoord van de organisatoren.
 */
export const metadata: Metadata = {
  title: "Inschrijven mosselfeest",
  description: "Schrijf je in voor het mosselfeest van KWS Linkhout.",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return <MosselfeestClient />;
}
