"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PaginaOvergang } from "@/components/beweging/PaginaOvergang";

/**
 * De vaste omlijsting van de site: de navigatiebalk boven en de voettekst
 * onder de inhoud.
 *
 * Een enkele pagina is geen gewone websitepagina maar een toepassing op zich,
 * met een eigen kop, eigen tabbladen en een eigen voettekst. Daar zou de
 * omlijsting van de site er alleen maar bovenop staan, dus die laten we weg.
 * Zo'n pagina zorgt zelf voor zijn `main`.
 *
 * We kijken naar de route die echt getoond wordt, niet naar het adres in de
 * browser. Op sponsoring.kwslinkhout.be is het adres gewoon "/" (een rewrite
 * in next.config.ts), maar de route is wel die van /sponsoring.
 */
const ZONDER_OMLIJSTING = [
  "kws-cup-2026",
  // Staat ook als losse site op sponsoring.kwslinkhout.be.
  "sponsoring",
];

export function SiteOmlijsting({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const kaal = segment !== null && ZONDER_OMLIJSTING.includes(segment);

  if (kaal) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="grow">
        <PaginaOvergang>{children}</PaginaOvergang>
      </main>
      <Footer />
    </>
  );
}
