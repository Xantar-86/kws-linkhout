import type { Metadata } from "next";
import VoetbalkampClient from "./Client";

/**
 * Inschrijven voor het voetbalkamp.
 *
 * Zoals het mosselfeest: niet in het menu, niet in de sitemap, op noindex. Het
 * adres gaat via de kanalen van de club naar de ouders. Het overzicht staat
 * op /voetbalkamp/overzicht en vraagt het wachtwoord van de organisatoren.
 */
export const metadata: Metadata = {
  title: "Inschrijven voetbalkamp",
  description: "Schrijf je kind in voor het Allerheiligen Voetbalkamp van KWS Linkhout.",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return <VoetbalkampClient />;
}
