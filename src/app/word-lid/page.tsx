import type { Metadata } from "next";
import WordLidClient from "./Client";
import { VRAGEN } from "./inhoud";

export const metadata: Metadata = {
  title: "Lid worden bij KWS Linkhout in Lummen",
  description:
    "Aansluiten bij KWS Linkhout: eerst een proeftraining, dan het inschrijvingsformulier. " +
    "Het lidgeld per leeftijd, wat erin zit en bij wie je terecht komt.",
  alternates: { canonical: "/word-lid" },
  openGraph: {
    title: "Kom voetballen bij KWS Linkhout",
    description:
      "Van de Voetbaltuin tot de veteranen. Een training meepikken kan altijd en verplicht tot niets.",
    url: "https://www.kwslinkhout.be/word-lid",
  },
};

/**
 * De vragen en antwoorden ook machineleesbaar meegeven.
 *
 * Google toont deze bij het zoekresultaat, en dat is precies de plek waar een
 * ouder zijn vraag stelt. Voorwaarde is wel dat elke vraag hier ook zichtbaar
 * op de pagina staat; daarom komen ze uit dezelfde lijst als de pagina zelf.
 */
function VragenOpmaak() {
  const opmaak = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: VRAGEN.map((v) => ({
      "@type": "Question",
      name: v.vraag,
      acceptedAnswer: { "@type": "Answer", text: v.antwoord },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(opmaak) }}
    />
  );
}

export default function Pagina() {
  return (
    <>
      <VragenOpmaak />
      <WordLidClient />
    </>
  );
}
