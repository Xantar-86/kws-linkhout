"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * De vaste omlijsting van de site: de navigatiebalk boven en de voettekst
 * onder de inhoud.
 *
 * Een enkele pagina is geen gewone websitepagina maar een toepassing op zich,
 * met een eigen kop, eigen tabbladen en een eigen voettekst. Daar zou de
 * omlijsting van de site er alleen maar bovenop staan, dus die laten we weg.
 * Zo'n pagina zorgt zelf voor zijn `main`.
 */
const ZONDER_OMLIJSTING = ["/kws-cup-2026"];

export function SiteOmlijsting({ children }: { children: React.ReactNode }) {
  const pad = usePathname();
  const kaal = ZONDER_OMLIJSTING.some(
    (begin) => pad === begin || pad.startsWith(`${begin}/`)
  );

  if (kaal) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
