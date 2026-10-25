import type { Metadata } from "next";
import TvClient from "./Client";

/**
 * Het scherm voor de tv in de kantine: om beurten de laatste uitslagen en het
 * klassement van een ploeg, met tussendoor de sponsors. Staat niet in het menu
 * en hoort niet in zoekmachines.
 */
export const metadata: Metadata = {
  title: "Uitslagen en sponsors",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return <TvClient />;
}
