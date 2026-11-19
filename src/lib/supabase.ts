import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * De database van de clubsite, in Supabase (organisatie KWS Linkhout, project
 * kws-linkhout).
 *
 * Tot november 2026 stond alles in Vercel Blob. Op het gratis plan van Vercel
 * liep de limiet op het aantal opvragingen vol, en toen blokkeerde Vercel de
 * hele opslag voor een maand. Supabase rekent geen opvragingen aan, en een
 * database geeft na het schrijven meteen de nieuwe stand terug, zonder de
 * trucs tegen een cache die Blob nodig had.
 *
 * Enkel de server komt hier binnen, met de geheime sleutel. De tabellen staan
 * op slot (RLS zonder regels, geen rechten voor anon), dus de publieke sleutel
 * kan niets lezen of schrijven. Deze module nooit in een client component
 * gebruiken.
 */

let client: SupabaseClient | null = null;

export function databaseBeschikbaar(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}

export function db(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const sleutel = process.env.SUPABASE_SECRET_KEY;
    if (!url || !sleutel) throw new Error("SUPABASE_URL of SUPABASE_SECRET_KEY ontbreekt.");
    client = createClient(url, sleutel, {
      auth: { persistSession: false, autoRefreshToken: false },
      // Next.js bewaart fetch-antwoorden standaard; een database moet altijd
      // de echte stand geven.
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    });
  }
  return client;
}
