import type { Metadata } from "next";
import PloegvoorstellingClient from "./Client";
import { GROEPSFOTO, SEIZOEN } from "./ploegen";

export const metadata: Metadata = {
  title: `Ploegvoorstelling ${SEIZOEN}`,
  description: `Alle jeugdploegen van KWS Linkhout op de foto, seizoen ${SEIZOEN}: van de U6 tot de U17 en de meisjesploegen.`,
  alternates: { canonical: "/ploegvoorstelling" },
  openGraph: {
    title: `Ploegvoorstelling ${SEIZOEN} | KWS Linkhout`,
    description: "Alle jeugdploegen op de foto, en iedereen samen op één beeld.",
    url: "https://www.kwslinkhout.be/ploegvoorstelling",
    images: [GROEPSFOTO],
  },
};

export default function Pagina() {
  return <PloegvoorstellingClient />;
}
