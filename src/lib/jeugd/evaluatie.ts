import { randomBytes } from "node:crypto";
import { db } from "@/lib/supabase";
import { groepVanPloeg, type Antwoorden, type EigenVraag, type EvalRol, type Groep, type Instellingen } from "./vragen";

/** Evaluatierondes en de ingevulde evaluaties per speler. */

export type Ronde = {
  id: string;
  naam: string;
  seizoen: string;
  open_van: string | null;
  open_tot: string;
  ploegen: string[];
  aangemaakt_door: string | null;
  aangemaakt: string;
  status: "concept" | "verstuurd";
  keuze: Partial<Record<EvalRol, string[]>> | null;
  eigen: EigenVraag[];
  verstuurd: string | null;
};

export function instellingen(r: Pick<Ronde, "keuze" | "eigen">): Instellingen {
  return { keuze: r.keuze, eigen: r.eigen ?? [] };
}

export type Evaluatie = {
  id: string;
  ronde_id: string;
  speler_id: string;
  rol: EvalRol;
  ploeg_id: string | null;
  groep: Groep;
  token: string | null;
  antwoorden: Antwoorden;
  ingevuld_door: string | null;
  ingediend: string | null;
  besproken_op: string | null;
  vrijgegeven: string | null;
  bijgewerkt: string;
};

const RONDE_VELDEN = "id, naam, seizoen, open_van, open_tot, ploegen, aangemaakt_door, aangemaakt, status, keuze, eigen, verstuurd";
const EVAL_VELDEN =
  "id, ronde_id, speler_id, rol, ploeg_id, groep, token, antwoorden, ingevuld_door, ingediend, besproken_op, vrijgegeven, bijgewerkt";

function fout(error: { message: string } | null, wat: string) {
  if (error) throw new Error(`${wat}: ${error.message}`);
}

/** Vandaag in Belgische tijd, als JJJJ-MM-DD. */
export function vandaag(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Brussels" });
}

/** Verstuurd en de einddatum nog niet voorbij: speler en ouders kunnen invullen. */
export function isOpen(r: Pick<Ronde, "status" | "open_van" | "open_tot">): boolean {
  const d = vandaag();
  return r.status === "verstuurd" && (r.open_van ?? d) <= d && d <= r.open_tot;
}

export async function rondes(): Promise<Ronde[]> {
  const { data, error } = await db().from("jeugd_rondes").select(RONDE_VELDEN).order("aangemaakt", { ascending: false });
  fout(error, "Rondes");
  return (data ?? []) as Ronde[];
}

export async function ronde(id: string): Promise<Ronde | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await db().from("jeugd_rondes").select(RONDE_VELDEN).eq("id", id).maybeSingle();
  fout(error, "Ronde");
  return data as Ronde | null;
}

/**
 * Zorgt dat elke actieve speler van de ronde (of van één ploeg ervan) zijn
 * drie evaluaties heeft, met een persoonlijke link voor speler en ouders.
 * Spelers die na het aanmaken in Spond bijkwamen, komen er zo vanzelf bij.
 */
export async function zorgVoorEvaluaties(r: Ronde, enkelPloeg?: string): Promise<void> {
  const ploegIds = enkelPloeg ? r.ploegen.filter((p) => p === enkelPloeg) : r.ploegen;
  if (!ploegIds.length) return;
  const [{ data: spelers, error: e1 }, { data: ploegen, error: e2 }, { data: bestaand, error: e3 }] = await Promise.all([
    db().from("jeugd_spelers").select("id, ploegen").overlaps("ploegen", ploegIds).eq("actief", true).range(0, 4999),
    db().from("jeugd_ploegen").select("id, kort").in("id", ploegIds),
    db().from("jeugd_evaluaties").select("speler_id, rol").eq("ronde_id", r.id).range(0, 9999),
  ]);
  fout(e1 ?? e2 ?? e3, "Evaluaties klaarzetten");
  const kort = new Map((ploegen ?? []).map((p) => [p.id as string, p.kort as string]));
  const heeft = new Set((bestaand ?? []).map((b) => `${b.speler_id}:${b.rol}`));
  const nieuw: Record<string, unknown>[] = [];
  for (const s of (spelers ?? []) as { id: string; ploegen: string[] }[]) {
    // Speelt iemand in twee ploegen van de ronde, dan telt de jongste (de eerste in volgorde).
    const ploeg = ploegIds.find((p) => s.ploegen.includes(p)) ?? s.ploegen[0];
    const groep = groepVanPloeg(kort.get(ploeg));
    for (const rol of ["trainer", "speler", "ouders"] as const) {
      if (heeft.has(`${s.id}:${rol}`)) continue;
      nieuw.push({
        ronde_id: r.id,
        speler_id: s.id,
        rol,
        ploeg_id: ploeg,
        groep,
        token: rol === "trainer" ? null : randomBytes(16).toString("base64url"),
      });
    }
  }
  for (let i = 0; i < nieuw.length; i += 500) {
    const { error } = await db().from("jeugd_evaluaties").upsert(nieuw.slice(i, i + 500), { onConflict: "ronde_id,speler_id,rol", ignoreDuplicates: true });
    fout(error, "Evaluaties aanmaken");
  }
}

export async function evaluatiesVanRonde(rondeId: string, ploegId?: string): Promise<Evaluatie[]> {
  let q = db().from("jeugd_evaluaties").select(EVAL_VELDEN).eq("ronde_id", rondeId);
  if (ploegId) q = q.eq("ploeg_id", ploegId);
  const { data, error } = await q.range(0, 9999);
  fout(error, "Evaluaties");
  return (data ?? []) as Evaluatie[];
}

export async function evaluatie(id: string): Promise<Evaluatie | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await db().from("jeugd_evaluaties").select(EVAL_VELDEN).eq("id", id).maybeSingle();
  fout(error, "Evaluatie");
  return data as Evaluatie | null;
}

export async function evaluatieVanSpeler(rondeId: string, spelerId: string, rol: EvalRol): Promise<Evaluatie | null> {
  const { data, error } = await db()
    .from("jeugd_evaluaties")
    .select(EVAL_VELDEN)
    .eq("ronde_id", rondeId)
    .eq("speler_id", spelerId)
    .eq("rol", rol)
    .maybeSingle();
  fout(error, "Evaluatie");
  return data as Evaluatie | null;
}

export async function evaluatieVanToken(token: string): Promise<Evaluatie | null> {
  if (!/^[A-Za-z0-9_-]{16,40}$/.test(token)) return null;
  const { data, error } = await db().from("jeugd_evaluaties").select(EVAL_VELDEN).eq("token", token).maybeSingle();
  fout(error, "Evaluatie");
  return data as Evaluatie | null;
}

/** Alle evaluaties van een speler, met hun ronde, oudste ronde eerst. */
export async function evaluatiesVanSpeler(spelerId: string): Promise<{ ronde: Ronde; trainer?: Evaluatie; speler?: Evaluatie; ouders?: Evaluatie }[]> {
  const { data, error } = await db().from("jeugd_evaluaties").select(EVAL_VELDEN).eq("speler_id", spelerId);
  fout(error, "Evaluaties speler");
  const lijst = (data ?? []) as Evaluatie[];
  if (!lijst.length) return [];
  const ids = [...new Set(lijst.map((e) => e.ronde_id))];
  const { data: r, error: e2 } = await db().from("jeugd_rondes").select(RONDE_VELDEN).in("id", ids);
  fout(e2, "Rondes speler");
  return ((r ?? []) as Ronde[])
    .sort((a, b) => (a.verstuurd ?? a.aangemaakt).localeCompare(b.verstuurd ?? b.aangemaakt))
    .map((ronde) => {
      const v = lijst.filter((e) => e.ronde_id === ronde.id);
      return { ronde, trainer: v.find((e) => e.rol === "trainer"), speler: v.find((e) => e.rol === "speler"), ouders: v.find((e) => e.rol === "ouders") };
    });
}

/** De werkpunten van de vorige evaluatie door de trainer, om nu op te volgen. */
export async function vorigeWerkpunten(spelerId: string, voor: Ronde): Promise<{ ronde: string; werkpunten: string[] } | null> {
  const alle = await evaluatiesVanSpeler(spelerId);
  const vorige = alle
    .filter((x) => x.ronde.id !== voor.id && (x.ronde.verstuurd ?? x.ronde.aangemaakt) < (voor.verstuurd ?? voor.aangemaakt) && x.trainer?.antwoorden.werkpunten?.length)
    .at(-1);
  return vorige ? { ronde: vorige.ronde.naam, werkpunten: vorige.trainer!.antwoorden.werkpunten! } : null;
}

export function heeftIets(e: Evaluatie | undefined): boolean {
  if (!e) return false;
  const a = e.antwoorden ?? {};
  return Boolean(a.scores && Object.keys(a.scores).length) || Boolean(a.teksten && Object.keys(a.teksten).length);
}

export type Status = "leeg" | "bezig" | "ingediend";
export function status(e: Evaluatie | undefined): Status {
  if (!e) return "leeg";
  if (e.ingediend) return "ingediend";
  return heeftIets(e) ? "bezig" : "leeg";
}
