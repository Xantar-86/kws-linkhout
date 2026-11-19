// app/kws-cup-2026/schema.ts
//
// Eén plek waar het gepubliceerde schema gelezen en geschreven wordt. Zowel de
// pagina (server component) als de API-route gebruiken dit, zodat de pagina
// geen omweg via zijn eigen API hoeft te maken. Die omweg werkte niet op
// Vercel: de eigen deployment-URL is daar niet zomaar bereikbaar vanuit een
// server component.
//
// Het schema staat als openbaar bestand in de bucket "kws-cup" van Supabase
// (zie lib/supabase.ts). Tot november 2026 stond het in Vercel Blob.

import { databaseBeschikbaar, db } from "@/lib/supabase";
import type { Tornooi } from "./TornooiClient";

const BUCKET = "kws-cup";
const BESTAND = "schema.json";

/**
 * Het vaste webadres van het gepubliceerde schema.
 *
 * De browsers van de bezoekers halen het daar elke minuut rechtstreeks op,
 * zonder langs een serverfunctie van de site te gaan.
 */
export function schemaAdres(): string | null {
  const url = process.env.SUPABASE_URL;
  if (!url) return null;
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${BESTAND}`;
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

export async function leesSchema(): Promise<Uitkomst> {
  if (!databaseBeschikbaar()) {
    return { staat: "fout", reden: "SUPABASE_URL of SUPABASE_SECRET_KEY ontbreekt." };
  }
  // Via de server-sleutel, niet via het openbare adres: dat kan tot een
  // minuut een oudere versie uit de cache geven.
  const { data, error } = await db().storage.from(BUCKET).download(BESTAND);
  if (error) {
    const status = (error as { status?: number; statusCode?: string }).status;
    if (status === 400 || status === 404 || /not.?found/i.test(error.message)) return { staat: "leeg" };
    return { staat: "fout", reden: error.message };
  }
  try {
    return { staat: "ok", tornooi: JSON.parse(await data.text()) as Tornooi };
  } catch (e) {
    return { staat: "fout", reden: e instanceof Error ? e.message : String(e) };
  }
}

/** Het schema publiceren; een vorige versie wordt vervangen. */
export async function schrijfSchema(tornooi: unknown): Promise<void> {
  const { error } = await db()
    .storage.from(BUCKET)
    .upload(BESTAND, JSON.stringify(tornooi), {
      contentType: "application/json",
      upsert: true,
      // Een minuut, niet langer: een wijziging tijdens de tornooidag moet
      // snel doorkomen bij wie het schema open heeft.
      cacheControl: "60",
    });
  if (error) throw new Error(error.message);
}
