import type { Metadata } from "next";
import LeftOversClient from "./Client";

/**
 * LeftOvers: wat er per dag nodig is tegenover wat er voorzien wordt. Genoemd
 * naar het blad dat het bestuur in hun Excel-bestand zo noemde. Achter
 * hetzelfde wachtwoord als het overzicht.
 */
export const metadata: Metadata = {
  title: "LeftOvers mosselfeest",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return <LeftOversClient />;
}
