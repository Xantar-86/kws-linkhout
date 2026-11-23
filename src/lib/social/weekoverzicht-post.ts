import { createHmac, timingSafeEqual } from "node:crypto";
import { databaseBeschikbaar, db } from "@/lib/supabase";
import type { Platform } from "./meta";

/**
 * Het weekoverzicht automatisch op Facebook en Instagram.
 *
 * Het beeld wordt in de browser gemaakt (de RBFA weigert onze server), dus de
 * pagina stuurt het beeld en de tekst hierheen. Dat gebeurt op twee manieren:
 *  - elke maandag om 18:00 vanzelf, door een geplande taak op de thuis-pc die
 *    de pagina opent met ?auto=1;
 *  - met de knop op de pagina, als terugval.
 *
 * Beide melden zich aan met een sleutel per week: een HMAC van de maandag met
 * WEEKOVERZICHT_GEHEIM. Wie die sleutel heeft, kan enkel het weekoverzicht van
 * die ene week plaatsen, niets anders.
 */

const LOGBOEK = "social_markeringen";
const SOORT = "weekoverzicht";

/** "2026-11-23": de maandag van een week, zoals hij in de sleutel en de logboeken staat. */
export function geldigeWeek(week: string | null | undefined): week is string {
  if (!week || !/^\d{4}-\d{2}-\d{2}$/.test(week)) return false;
  const d = new Date(`${week}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.getUTCDay() === 1;
}

/** De maandag van deze week, in Belgische tijd. */
export function dezeMaandag(nu = new Date()): string {
  const be = new Date(nu.toLocaleString("en-US", { timeZone: "Europe/Brussels" }));
  be.setDate(be.getDate() - ((be.getDay() + 6) % 7));
  return `${be.getFullYear()}-${String(be.getMonth() + 1).padStart(2, "0")}-${String(be.getDate()).padStart(2, "0")}`;
}

function geheim(): string | null {
  return process.env.WEEKOVERZICHT_GEHEIM || null;
}

export function weekSleutel(week: string): string | null {
  const g = geheim();
  if (!g) return null;
  return createHmac("sha256", g).update(`weekoverzicht|${week}`).digest("base64url").slice(0, 32);
}

export function sleutelKlopt(week: string, sleutel: string | null | undefined): boolean {
  const verwacht = weekSleutel(week);
  if (!verwacht || !sleutel) return false;
  const a = Buffer.from(verwacht);
  const b = Buffer.from(sleutel);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** De link uit de mails: opent de pagina met de knop. */
export function weekLink(site: string, week: string): string {
  const s = weekSleutel(week);
  return s ? `${site}/matchday/weekoverzicht?t=${s}&week=${week}` : `${site}/matchday/weekoverzicht`;
}

function rijSleutel(week: string, platform: Platform): string {
  return `${week}-${platform}`;
}

/**
 * Het recht opeisen om deze week op dit platform te posten. De tabel heeft
 * (soort, sleutel) als sleutel, dus van twee gelijktijdige pogingen (pc en
 * knop) slaagt er maar één.
 */
export async function eisOp(week: string, platform: Platform): Promise<boolean> {
  const { error } = await db()
    .from(LOGBOEK)
    .insert({ soort: SOORT, sleutel: rijSleutel(week, platform), inhoud: "bezig", aangemaakt: new Date().toISOString() });
  if (!error) return true;
  if (error.code === "23505") return false;
  throw new Error(error.message);
}

/** Na een geslaagde post: vastleggen wat er geplaatst is. */
export async function legVast(week: string, platform: Platform, inhoud: string): Promise<void> {
  const { error } = await db()
    .from(LOGBOEK)
    .update({ inhoud })
    .eq("soort", SOORT)
    .eq("sleutel", rijSleutel(week, platform));
  if (error) console.error("[weekoverzicht] vastleggen mislukt:", error.message);
}

/** Mislukt of op proef: het slot weer vrijgeven, zodat een volgende poging kan. */
export async function geefVrij(week: string, platform: Platform): Promise<void> {
  const { error } = await db().from(LOGBOEK).delete().eq("soort", SOORT).eq("sleutel", rijSleutel(week, platform));
  if (error) console.error("[weekoverzicht] vrijgeven mislukt:", error.message);
}

/** Wat er voor deze week al geplaatst is (of nu bezig is). */
export async function staat(week: string): Promise<Record<Platform, string | null>> {
  const leeg: Record<Platform, string | null> = { facebook: null, instagram: null };
  if (!databaseBeschikbaar()) return leeg;
  const { data, error } = await db()
    .from(LOGBOEK)
    .select("sleutel, inhoud")
    .eq("soort", SOORT)
    .in("sleutel", [rijSleutel(week, "facebook"), rijSleutel(week, "instagram")]);
  if (error) throw new Error(error.message);
  for (const r of data ?? []) {
    const platform = r.sleutel.endsWith("-facebook") ? "facebook" : "instagram";
    leeg[platform] = r.inhoud;
  }
  return leeg;
}

/** De pc heeft gemeld waarom hij niets plaatste; dan hoeft de controle niet nog eens te mailen. */
export async function noteerOvergeslagen(week: string, reden: string): Promise<void> {
  const { error } = await db()
    .from(LOGBOEK)
    .upsert({ soort: SOORT, sleutel: `${week}-overgeslagen`, inhoud: reden, aangemaakt: new Date().toISOString() });
  if (error) console.error("[weekoverzicht] overslaan noteren mislukt:", error.message);
}

export async function wasOvergeslagen(week: string): Promise<boolean> {
  const { data, error } = await db()
    .from(LOGBOEK)
    .select("sleutel")
    .eq("soort", SOORT)
    .eq("sleutel", `${week}-overgeslagen`)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data);
}
