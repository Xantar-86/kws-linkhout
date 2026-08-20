// app/kws-cup-2026/page.tsx
//
// Publieke pagina van het jeugdtornooi. Staat bewust niet in de navigatie:
// hij is alleen bereikbaar via de link die we zelf doorgeven.

import type { Metadata } from "next";
import TornooiClient, { type Tornooi } from "./TornooiClient";

export const dynamic = "force-dynamic";   // altijd het actuele schema tonen

export const metadata: Metadata = {
  title: "KWS Cup 2026 | K.W.S. Linkhout",
  description:
    "Wedstrijdschema en poule-indeling van het jeugdtornooi van K.W.S. Linkhout, " +
    "28, 29 en 30 augustus 2026.",
  robots: { index: false, follow: false },   // niet in Google, wel bereikbaar
};

async function haalSchema(): Promise<Tornooi | null> {
  const basis =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  try {
    const antwoord = await fetch(`${basis}/api/kws-cup`, { cache: "no-store" });
    if (!antwoord.ok) return null;
    return (await antwoord.json()) as Tornooi;
  } catch {
    return null;
  }
}

export default async function Pagina() {
  const tornooi = await haalSchema();

  if (!tornooi) {
    return (
      <main className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">KWS Cup 2026</h1>
        <p className="mt-3 text-gray-600">
          Het wedstrijdschema is nog niet beschikbaar. Kom later terug.
        </p>
      </main>
    );
  }

  return <TornooiClient tornooi={tornooi} />;
}
