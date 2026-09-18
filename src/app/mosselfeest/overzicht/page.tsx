import type { Metadata } from "next";
import OverzichtClient from "./Client";

/**
 * Het overzicht van de inschrijvingen voor het mosselfeest.
 *
 * Achter een wachtwoord (MOSSELFEEST_WACHTWOORD) en uit de zoekresultaten.
 * Hier staan namen, e-mailadressen en bedragen, dus deze pagina hoort nergens
 * gelinkt of geïndexeerd te worden.
 */
export const metadata: Metadata = {
  title: "Overzicht mosselfeest",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return <OverzichtClient />;
}
