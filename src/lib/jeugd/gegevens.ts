import { db } from "@/lib/supabase";
import { spelers as siteFotos } from "@/lib/spelers";
import { KERNEN, type Kernspeler } from "@/lib/kernen";
import { seizoensbegin } from "./spond";
import { magPloeg, type Gebruiker } from "./toegang";

/** Alles wat de pagina's van het spelersdossier uit de database lezen. */

export type Ploeg = { id: string; naam: string; kort: string; volgorde: number };
export type Ouder = { naam: string; email: string | null; gsm: string | null };
export type Speler = {
  id: string;
  voornaam: string;
  achternaam: string;
  geboortedatum: string | null;
  ploegen: string[];
  email: string | null;
  gsm: string | null;
  ouders: Ouder[];
  extra: Record<string, unknown>;
  actief: boolean;
};
export type Telling = { komt: number; komt_niet: number; geen_antwoord: number };
export type Aanwezigheid = Record<"training" | "wedstrijd" | "activiteit", Telling>;

function fout(error: { message: string } | null, wat: string) {
  if (error) throw new Error(`${wat}: ${error.message}`);
}

export async function ploegen(): Promise<Ploeg[]> {
  const { data, error } = await db()
    .from("jeugd_ploegen")
    .select("id, naam, kort, volgorde")
    .eq("actief", true)
    .order("volgorde")
    .order("kort");
  fout(error, "Ploegen");
  return (data ?? []) as Ploeg[];
}

export async function zichtbarePloegen(g: Gebruiker): Promise<Ploeg[]> {
  return (await ploegen()).filter((p) => magPloeg(g, p.id));
}

const SPELER_VELDEN = "id, voornaam, achternaam, geboortedatum, ploegen, email, gsm, ouders, extra, actief";

export async function spelersVanPloeg(ploegId: string): Promise<Speler[]> {
  const { data, error } = await db()
    .from("jeugd_spelers")
    .select(SPELER_VELDEN)
    .contains("ploegen", [ploegId])
    .eq("actief", true)
    .order("voornaam")
    .order("achternaam");
  fout(error, "Spelers");
  return (data ?? []) as Speler[];
}

export async function speler(id: string): Promise<Speler | null> {
  const { data, error } = await db().from("jeugd_spelers").select(SPELER_VELDEN).eq("id", id).maybeSingle();
  fout(error, "Speler");
  return data as Speler | null;
}

export async function aantalSpelersPerPloeg(): Promise<Map<string, number>> {
  const { data, error } = await db().from("jeugd_spelers").select("ploegen").eq("actief", true).range(0, 4999);
  fout(error, "Aantallen");
  const m = new Map<string, number>();
  for (const r of data ?? []) for (const p of r.ploegen as string[]) m.set(p, (m.get(p) ?? 0) + 1);
  return m;
}

export async function stafVanPloeg(ploegId: string): Promise<{ naam: string; rollen: string[] }[]> {
  const { data, error } = await db().from("jeugd_staf").select("naam, rollen").contains("ploegen", [ploegId]).order("naam");
  fout(error, "Staf");
  return (data ?? []) as { naam: string; rollen: string[] }[];
}

// ---------------------------------------------------------------------------
// Periodes en aanwezigheid

export type Periode = { sleutel: string; naam: string; van: Date; tot: Date };

/** Het lopende seizoen en zijn twee helften (juli tot december, januari tot juni). */
export function periodes(nu = new Date()): Periode[] {
  const begin = seizoensbegin(nu);
  const jaar = begin.getUTCFullYear();
  const midden = new Date(Date.UTC(jaar + 1, 0, 1));
  const einde = new Date(Date.UTC(jaar + 1, 6, 1));
  const seizoen = `${jaar}-${String(jaar + 1).slice(2)}`;
  return [
    { sleutel: "seizoen", naam: `Seizoen ${seizoen}`, van: begin, tot: einde },
    { sleutel: "h1", naam: `Juli tot december ${jaar}`, van: begin, tot: midden },
    { sleutel: "h2", naam: `Januari tot juni ${jaar + 1}`, van: midden, tot: einde },
  ];
}

function leeg(): Aanwezigheid {
  return {
    training: { komt: 0, komt_niet: 0, geen_antwoord: 0 },
    wedstrijd: { komt: 0, komt_niet: 0, geen_antwoord: 0 },
    activiteit: { komt: 0, komt_niet: 0, geen_antwoord: 0 },
  };
}

/** Aanwezigheid per speler in een periode. */
export async function aanwezigheid(van: Date, tot: Date, spelerIds?: string[]): Promise<Map<string, Aanwezigheid>> {
  const { data, error } = await db().rpc("jeugd_aanwezigheid", {
    van: van.toISOString(),
    tot: tot.toISOString(),
    spelers: spelerIds ?? null,
  });
  fout(error, "Aanwezigheid");
  const m = new Map<string, Aanwezigheid>();
  for (const r of (data ?? []) as { speler_id: string; soort: keyof Aanwezigheid; komt: number; komt_niet: number; geen_antwoord: number }[]) {
    const a = m.get(r.speler_id) ?? leeg();
    a[r.soort] = { komt: Number(r.komt), komt_niet: Number(r.komt_niet), geen_antwoord: Number(r.geen_antwoord) };
    m.set(r.speler_id, a);
  }
  return m;
}

export function totaal(t: Telling): number {
  return t.komt + t.komt_niet + t.geen_antwoord;
}

/** Percentage aanwezig, of null als er nog niets was. */
export function procent(t: Telling | undefined): number | null {
  if (!t || !totaal(t)) return null;
  return Math.round((t.komt / totaal(t)) * 100);
}

export type RecenteActiviteit = {
  id: string;
  soort: string;
  titel: string;
  start: string;
  tegenstander: string | null;
  status: "komt" | "komt_niet" | "geen_antwoord";
};

export async function recenteActiviteiten(spelerId: string, aantal = 15): Promise<RecenteActiviteit[]> {
  const { data, error } = await db()
    .from("jeugd_activiteiten")
    .select("id, soort, titel, start, tegenstander, jeugd_aanwezigheden!inner(status)")
    .eq("jeugd_aanwezigheden.speler_id", spelerId)
    .eq("geannuleerd", false)
    .lt("start", new Date().toISOString())
    .order("start", { ascending: false })
    .limit(aantal);
  fout(error, "Recente activiteiten");
  type Rij = Omit<RecenteActiviteit, "status"> & { jeugd_aanwezigheden: { status: RecenteActiviteit["status"] }[] };
  return ((data ?? []) as unknown as Rij[]).map(({ jeugd_aanwezigheden, ...a }) => ({
    ...a,
    status: jeugd_aanwezigheden[0]?.status ?? "geen_antwoord",
  }));
}

export async function laatsteSync(): Promise<{ start: string; einde: string | null; ok: boolean | null; bericht: string | null; aantallen: Record<string, unknown> | null } | null> {
  const { data } = await db()
    .from("jeugd_sync_log")
    .select("start, einde, ok, bericht, aantallen")
    .order("start", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

// ---------------------------------------------------------------------------
// Foto's en kerngegevens van de website, op naam gekoppeld

function sleutel(naam: string): string {
  return naam
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, " ")
    .trim();
}

const fotoOpNaam = new Map(siteFotos.map((s) => [sleutel(s.naam), s]));
const kernOpNaam = new Map<string, Kernspeler & { kern: string }>();
for (const [kern, lijst] of Object.entries(KERNEN)) {
  for (const k of lijst) if (!kernOpNaam.has(sleutel(k.naam))) kernOpNaam.set(sleutel(k.naam), { ...k, kern });
}

export function siteFoto(s: Pick<Speler, "voornaam" | "achternaam">): { klein: string; groot: string } | null {
  const f = fotoOpNaam.get(sleutel(`${s.voornaam} ${s.achternaam}`));
  return f ? { klein: f.klein, groot: f.groot } : null;
}

export function siteKern(s: Pick<Speler, "voornaam" | "achternaam">): (Kernspeler & { kern: string }) | null {
  return kernOpNaam.get(sleutel(`${s.voornaam} ${s.achternaam}`)) ?? null;
}

export function leeftijd(geboortedatum: string | null, op = new Date()): number | null {
  if (!geboortedatum) return null;
  const d = new Date(geboortedatum);
  let l = op.getFullYear() - d.getFullYear();
  if (op.getMonth() < d.getMonth() || (op.getMonth() === d.getMonth() && op.getDate() < d.getDate())) l--;
  return l;
}

// ---------------------------------------------------------------------------
// Aandachtspunten: allergieen, medisch en waar we rekening mee houden.
// Staat in een eigen tabel, zodat de Spond-synchronisatie er nooit aan raakt.

export type Aandacht = {
  allergie: string | null;
  medisch: string | null;
  rekening: string | null;
  gewijzigd_door: string | null;
  gewijzigd: string;
};

export async function aandacht(spelerId: string): Promise<Aandacht | null> {
  const { data } = await db()
    .from("jeugd_aandacht")
    .select("allergie, medisch, rekening, gewijzigd_door, gewijzigd")
    .eq("speler_id", spelerId)
    .maybeSingle();
  return (data as Aandacht | null) ?? null;
}

/** Welke spelers iets ingevuld hebben, en of het om allergie of medisch gaat. */
export async function aandachtVoorSpelers(ids: string[]): Promise<Map<string, { gezondheid: boolean; rekening: boolean }>> {
  const kaart = new Map<string, { gezondheid: boolean; rekening: boolean }>();
  if (ids.length === 0) return kaart;
  const { data } = await db().from("jeugd_aandacht").select("speler_id, allergie, medisch, rekening").in("speler_id", ids);
  for (const r of (data ?? []) as { speler_id: string; allergie: string | null; medisch: string | null; rekening: string | null }[]) {
    const gezondheid = Boolean(r.allergie?.trim() || r.medisch?.trim());
    const rekening = Boolean(r.rekening?.trim());
    if (gezondheid || rekening) kaart.set(r.speler_id, { gezondheid, rekening });
  }
  return kaart;
}

// ---------------------------------------------------------------------------
// Notities, blessures en ploeggeschiedenis

export type Notitie = {
  id: string;
  soort: "notitie" | "blessure";
  tekst: string;
  van: string | null;
  tot: string | null;
  door: string | null;
  aangemaakt: string;
};

export async function notities(spelerId: string): Promise<Notitie[]> {
  const { data, error } = await db()
    .from("jeugd_notities")
    .select("id, soort, tekst, van, tot, door, aangemaakt")
    .eq("speler_id", spelerId)
    .order("aangemaakt", { ascending: false });
  fout(error, "Notities");
  return (data ?? []) as Notitie[];
}

export async function ploeghistoriek(spelerId: string): Promise<{ seizoen: string; ploegen: string[] }[]> {
  const { data, error } = await db()
    .from("jeugd_ploeghistoriek")
    .select("seizoen, ploegen")
    .eq("speler_id", spelerId)
    .order("seizoen", { ascending: false });
  fout(error, "Ploeggeschiedenis");
  return (data ?? []) as { seizoen: string; ploegen: string[] }[];
}

/** Namen van alle ploegen, ook die van vroegere seizoenen. */
export async function ploegNamen(): Promise<Map<string, string>> {
  const { data } = await db().from("jeugd_ploegen").select("id, kort");
  return new Map((data ?? []).map((p) => [p.id as string, p.kort as string]));
}

/** Positie voor op de fiche: wat de trainer koos, anders wat op de site staat. */
export function positieVan(s: Pick<Speler, "voornaam" | "achternaam" | "extra">): string | undefined {
  const code = s.extra.positiecode as string | undefined;
  if (code && POSITIE_NAAM[code]) return POSITIE_NAAM[code];
  if (typeof s.extra.positie === "string") return s.extra.positie;
  const kern = siteKern(s);
  return kern?.positie ? POSITIE_NAAM[kern.positie] : undefined;
}

export function rugnummerVan(s: Pick<Speler, "voornaam" | "achternaam" | "extra">): number | undefined {
  return (s.extra.rugnummer as number | undefined) ?? siteKern(s)?.nummer;
}

const POSITIE_NAAM: Record<string, string> = { K: "Keeper", V: "Verdediger", M: "Middenvelder", A: "Aanvaller" };
