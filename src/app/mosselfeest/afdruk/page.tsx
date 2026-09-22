import type { Metadata } from "next";
import AfdrukClient from "./Client";

/**
 * Afdrukbare lijsten voor de keuken: bonnetjes per inschrijving of een
 * verzamellijst per zitting. Achter hetzelfde wachtwoord als het overzicht.
 */
export const metadata: Metadata = {
  title: "Afdrukken mosselfeest",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return <AfdrukClient />;
}
