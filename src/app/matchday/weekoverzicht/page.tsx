import type { Metadata } from "next";
import WeekoverzichtClient from "./Client";

/**
 * Het weekoverzicht voor sociale media: alle wedstrijden van het weekend op
 * één afbeelding (of een carrousel), met de tekst erbij.
 *
 * Geen sleutel nodig: er staan enkel openbare RBFA-gegevens op. De pagina
 * staat niet in het menu en niet in de zoekmachines (robots.ts weert
 * /matchday/). Elke donderdag komt de link per mail, zie
 * /api/social/weekoverzicht-herinnering.
 */

export const metadata: Metadata = {
  title: "Weekoverzicht | KWS Linkhout",
  robots: { index: false, follow: false },
};

export default function WeekoverzichtPagina() {
  return <WeekoverzichtClient />;
}
