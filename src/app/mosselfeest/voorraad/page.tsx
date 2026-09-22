import type { Metadata } from "next";
import VoorraadClient from "./Client";

/**
 * Voorzien tegenover besteld per dag, het vroegere blad "LeftOvers" van het
 * bestuur. Achter hetzelfde wachtwoord als het overzicht.
 */
export const metadata: Metadata = {
  title: "Voorraad mosselfeest",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return <VoorraadClient />;
}
