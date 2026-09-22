import type { Metadata } from "next";
import KassaClient from "./Client";

/**
 * Het avondscherm voor aan de kassa: zoeken op kaartnummer of naam, betalen
 * afvinken en er nog iets bijzetten. Achter hetzelfde wachtwoord als het
 * overzicht.
 */
export const metadata: Metadata = {
  title: "Avondscherm mosselfeest",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return <KassaClient />;
}
