import { databaseBeschikbaar, db } from "@/lib/supabase";
import { KAMP, type KampInschrijving } from "./kamp";

/**
 * De inschrijvingen voor het voetbalkamp, in de tabel
 * voetbalkamp_inschrijvingen van Supabase (zie lib/supabase.ts).
 *
 * Eén rij per inschrijving, met de inschrijving zelf als JSON in "gegevens".
 * Het overzicht en het Excel-bestand worden er telkens uit opgebouwd.
 */

const TABEL = "voetbalkamp_inschrijvingen";

export function opslagBeschikbaar(): boolean {
  return databaseBeschikbaar();
}

export async function bewaarInschrijving(
  inschrijving: KampInschrijving,
): Promise<{ ok: boolean; fout?: string }> {
  if (!databaseBeschikbaar()) return { ok: false, fout: "SUPABASE_URL of SUPABASE_SECRET_KEY ontbreekt." };
  const { error } = await db().from(TABEL).upsert({
    kenmerk: inschrijving.kenmerk,
    kamp: KAMP.id,
    aangemeld: inschrijving.aangemeld,
    gegevens: inschrijving,
    bijgewerkt: new Date().toISOString(),
  });
  return error ? { ok: false, fout: error.message } : { ok: true };
}

/** Alle inschrijvingen van dit kamp, oudste eerst. */
export async function alleInschrijvingen(): Promise<KampInschrijving[]> {
  if (!databaseBeschikbaar()) return [];
  const { data, error } = await db()
    .from(TABEL)
    .select("gegevens")
    .eq("kamp", KAMP.id)
    .order("aangemeld", { ascending: true });
  if (error) {
    console.error("[voetbalkamp] inschrijvingen lezen mislukt:", error.message);
    throw new Error(error.message);
  }
  return (data ?? []).map((r) => r.gegevens as KampInschrijving);
}

export async function haalInschrijving(kenmerk: string): Promise<KampInschrijving | null> {
  if (!databaseBeschikbaar()) return null;
  const { data } = await db().from(TABEL).select("gegevens").eq("kenmerk", kenmerk).maybeSingle();
  return (data?.gegevens as KampInschrijving | undefined) ?? null;
}

export async function schrapInschrijving(kenmerk: string): Promise<boolean> {
  if (!databaseBeschikbaar()) return false;
  const { data } = await db().from(TABEL).delete().eq("kenmerk", kenmerk).select("kenmerk");
  return (data ?? []).length > 0;
}
