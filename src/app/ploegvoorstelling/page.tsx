import type { Metadata } from "next";
import PloegvoorstellingClient from "./Client";
import { GROEPSFOTO, SEIZOEN } from "./ploegen";

export const metadata: Metadata = {
  title: `Ploegvoorstelling ${SEIZOEN}`,
  description: `Alle ploegen van KWS Linkhout op de foto, seizoen ${SEIZOEN}: de jeugd van U6 tot U17, de meisjesploegen en de senioren.`,
  alternates: { canonical: "/ploegvoorstelling" },
  openGraph: {
    title: `Ploegvoorstelling ${SEIZOEN} | KWS Linkhout`,
    description:
      "Alle ploegen op de foto, van de allerkleinsten tot de senioren.",
    url: "https://www.kwslinkhout.be/ploegvoorstelling",
    images: [GROEPSFOTO],
  },
};

export default function Pagina() {
  return <PloegvoorstellingClient />;
}
