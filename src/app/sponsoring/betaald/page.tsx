import type { Metadata } from "next";
import { Suspense } from "react";
import BetaaldClient from "./Client";

/**
 * Hier komt een sponsor terug na het betalen van een wedstrijdbal bij Mollie.
 * Hoort niet in zoekmachines: zonder kenmerk in het adres is er niets te zien.
 */
export const metadata: Metadata = {
  title: "Wedstrijdbal betaald",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return (
    <Suspense>
      <BetaaldClient />
    </Suspense>
  );
}
