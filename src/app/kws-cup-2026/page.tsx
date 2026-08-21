// app/kws-cup-2026/page.tsx
//
// Publieke pagina van het jeugdtornooi. Staat bewust niet in de navigatie:
// hij is alleen bereikbaar via de link die we zelf doorgeven.

import type { Metadata } from "next";
import TornooiClient from "./TornooiClient";
import { leesSchema, schemaAdres } from "./schema";

export const dynamic = "force-dynamic";   // altijd het actuele schema tonen

export const metadata: Metadata = {
  title: "KWS Cup 2026 | K.W.S. Linkhout",
  description:
    "Wedstrijdschema en poule-indeling van het jeugdtornooi van K.W.S. Linkhout, " +
    "28, 29 en 30 augustus 2026.",
  robots: { index: false, follow: false },   // niet in Google, wel bereikbaar
};

export default async function Pagina() {
  const uitkomst = await leesSchema();

  if (uitkomst.staat !== "ok") {
    // Een storing in de opslag is iets anders dan een tornooi waarvan het
    // schema nog moet komen. De bezoeker leest hetzelfde, maar de reden
    // staat in de logboeken van de server, zodat we niet weer in het duister
    // tasten als er iets misloopt.
    if (uitkomst.staat === "fout") {
      console.error("[kws-cup] schema onbereikbaar:", uitkomst.reden);
    }
    return (
      <main className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">KWS Cup 2026</h1>
        <p className="mt-3 text-gray-600">
          {uitkomst.staat === "leeg"
            ? "Het wedstrijdschema is nog niet beschikbaar. Kom later terug."
            : "Het wedstrijdschema is even niet op te halen. Probeer het straks opnieuw."}
        </p>
      </main>
    );
  }

  // De browser haalt het schema straks zelf op bij het verversen. Rechtstreeks
  // van de opslag, want langs onze eigen API zou elke bezoeker elke minuut een
  // serverfunctie wakker maken.
  return <TornooiClient tornooi={uitkomst.tornooi} adres={schemaAdres()} />;
}
