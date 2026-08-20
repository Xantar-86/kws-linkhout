// app/kws-cup-2026/schema.ts
//
// Eén plek waar het gepubliceerde schema uit de Blob-opslag gelezen wordt.
// Zowel de pagina (server component) als de API-route gebruiken dit, zodat de
// pagina geen omweg via zijn eigen API hoeft te maken. Die omweg werkte niet
// op Vercel: de eigen deployment-URL is daar niet zomaar bereikbaar vanuit een
// server component.

import { list } from "@vercel/blob";
import type { Tornooi } from "./TornooiClient";

export const BESTAND = "kws-cup/schema.json";

export async function leesSchema(): Promise<Tornooi | null> {
  try {
    const { blobs } = await list({ prefix: BESTAND, limit: 1 });
    if (blobs.length === 0) return null;
    const antwoord = await fetch(blobs[0].url, { cache: "no-store" });
    if (!antwoord.ok) return null;
    return (await antwoord.json()) as Tornooi;
  } catch {
    return null;
  }
}
