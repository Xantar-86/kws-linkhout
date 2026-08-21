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

/**
 * Het vaste webadres van het gepubliceerde schema.
 *
 * We schrijven met `addRandomSuffix: false`, dus het pad ligt vast en het
 * adres is te berekenen. Dat scheelt bij elke lezing een `list()`, en die
 * telt bij Vercel als "advanced operation". Met een verversing per minuut per
 * bezoeker liep dat in de duizenden en werd de opslag opgeschort.
 *
 * Het nummer van de opslag zit in het schrijftoken, dat de vorm
 * `vercel_blob_rw_<nummer>_<geheim>` heeft. Alleen dat nummer gebruiken we,
 * en dat staat sowieso in elk publiek blob-adres.
 */
export function schemaAdres(): string | null {
  const nummer = process.env.BLOB_READ_WRITE_TOKEN?.split("_")[3];
  if (!nummer) return null;
  return `https://${nummer.toLowerCase()}.public.blob.vercel-storage.com/${BESTAND}`;
}

/**
 * Wat er van een leespoging terugkomt.
 *
 * Hier stond eerst `Tornooi | null`, met een `catch` die alles opslokte.
 * Daardoor zag een geblokkeerde opslag er precies hetzelfde uit als een
 * tornooi waarvan het schema nog niet gepubliceerd was, en zochten we een
 * halve dag in de verkeerde hoek. Een storing zegt nu wat ze is.
 */
export type Uitkomst =
  | { staat: "ok"; tornooi: Tornooi }
  | { staat: "leeg" }
  | { staat: "fout"; reden: string };

/** Haalt het schema op van zijn vaste adres. */
async function haalVanAdres(adres: string): Promise<Uitkomst> {
  const antwoord = await fetch(adres, { cache: "no-store" });
  if (antwoord.status === 404) return { staat: "leeg" };
  if (!antwoord.ok) {
    // De opslag zelf antwoordt, maar weigert. Bij een overschreden limiet
    // staat hier bijvoorbeeld "Your store is blocked".
    const tekst = (await antwoord.text()).slice(0, 200).trim();
    return { staat: "fout", reden: `${antwoord.status} ${tekst}` };
  }
  return { staat: "ok", tornooi: (await antwoord.json()) as Tornooi };
}

export async function leesSchema(): Promise<Uitkomst> {
  const adres = schemaAdres();

  if (adres) {
    try {
      return await haalVanAdres(adres);
    } catch (e) {
      // Het berekende adres klopte niet, of de verbinding viel weg. Hieronder
      // proberen we het alsnog langs de trage weg.
      const reden = e instanceof Error ? e.message : String(e);
      const langs = await langsDeLijst();
      return langs ?? { staat: "fout", reden };
    }
  }

  return (
    (await langsDeLijst()) ?? {
      staat: "fout",
      reden: "Geen BLOB_READ_WRITE_TOKEN: is de Blob-opslag aan dit project gekoppeld?",
    }
  );
}

/**
 * De oude weg, met een zoekopdracht in de opslag.
 *
 * Alleen als vangnet, want dit kost een advanced operation. Levert niets op
 * als ook dit mislukt, zodat de aanroeper zijn eigen reden kan melden.
 */
async function langsDeLijst(): Promise<Uitkomst | null> {
  try {
    const { blobs } = await list({ prefix: BESTAND, limit: 1 });
    if (blobs.length === 0) return { staat: "leeg" };
    return await haalVanAdres(blobs[0].url);
  } catch {
    return null;
  }
}
