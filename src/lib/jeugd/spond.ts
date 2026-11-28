import { readFileSync } from "node:fs";
import { join } from "node:path";
import { db } from "@/lib/supabase";

/**
 * Haalt de jeugdploegen, de spelers en hun aanwezigheden uit Spond.
 *
 * Spond heeft geen officiële koppeling. We loggen in met het aparte account
 * "KWS Sync" (beheerder van de jeugdgroep) en lezen enkel: groepen, leden en
 * activiteiten met de antwoorden. Er wordt nooit iets in Spond gewijzigd.
 * De voorwaarden voor beheerders laten toe dat aanwezigheden buiten Spond
 * gebruikt worden, zolang de club daar een rechtsgrond voor heeft (de
 * opvolging van de eigen spelers).
 *
 * Bewust NIET overgenomen: de afmeldredenen. Daar staat soms iets over
 * blessures of ziekte in, en dat hoort niet in een dossier.
 */

const API = "https://api.spond.com/core/v1/";

/** Subgroepen die niet bij de jeugd horen. */
const GEEN_JEUGD = /vrullies|senior/i;

type Json = Record<string, unknown>;
type SpondLid = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  email?: string;
  phoneNumber?: string;
  subGroups?: string[];
  roles?: string[];
  guardians?: { firstName?: string; lastName?: string; email?: string; phoneNumber?: string }[];
};
type SpondActiviteit = {
  id: string;
  heading: string;
  startTimestamp: string;
  endTimestamp?: string;
  cancelled?: boolean;
  matchEvent?: boolean;
  type?: string;
  matchInfo?: { opponentName?: string };
  recipients?: { group?: { subGroups?: { id: string }[] } };
  responses?: { acceptedIds?: string[]; declinedIds?: string[]; unansweredIds?: string[]; unconfirmedIds?: string[]; waitinglistIds?: string[] };
};

export type Aanmelding = { email: string; wachtwoord: string };

/**
 * Het Spond-account. Op Vercel uit SPOND_EMAIL en SPOND_WACHTWOORD; op de
 * eigen pc mag het ook uit %USERPROFILE%\.kws\spond.txt komen (regel 1 het
 * adres, regel 2 het wachtwoord, een label als "login:" vooraan valt weg).
 */
const schoonAdres = (s: string) => s.replace(/^﻿/, "").trim().replace(/^(login|e-?mail|gebruiker|user(name)?)\s*:\s*/i, "").trim();
const schoonWachtwoord = (s: string) =>
  s.replace(/^﻿/, "").trim().replace(/^(wachtwoord|paswoord|password|pasw|pass|pw|ww)\s*:\s*/i, "").trim();

export function spondAanmelding(): Aanmelding | null {
  // Een spatie, nieuwe regel of label dat mee geplakt werd in Vercel, doet de login mislukken.
  if (process.env.SPOND_EMAIL && process.env.SPOND_WACHTWOORD) {
    return { email: schoonAdres(process.env.SPOND_EMAIL), wachtwoord: schoonWachtwoord(process.env.SPOND_WACHTWOORD) };
  }
  if (process.env.VERCEL) return null;
  try {
    const regels = readFileSync(join(process.env.USERPROFILE ?? process.env.HOME ?? "", ".kws", "spond.txt"), "utf8")
      .replace(/^﻿/, "")
      .split(/\r?\n/)
      .map((r) => r.trim())
      .filter(Boolean);
    if (regels.length < 2) return null;
    return { email: schoonAdres(regels[0]), wachtwoord: schoonWachtwoord(regels[1]) };
  } catch {
    return null;
  }
}

async function login({ email, wachtwoord }: Aanmelding): Promise<string> {
  const r = await fetch(API + "auth2/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password: wachtwoord }),
    cache: "no-store",
  });
  const j = (await r.json().catch(() => ({}))) as { accessToken?: { token?: string }; errorKey?: string };
  if (!j.accessToken?.token) throw new Error(`Aanmelden bij Spond mislukt (${r.status} ${j.errorKey ?? ""})`.trim());
  return j.accessToken.token;
}

async function lees<T>(token: string, pad: string, params: Record<string, string> = {}): Promise<T> {
  const u = new URL(API + pad);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const r = await fetch(u, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!r.ok) throw new Error(`Spond ${pad}: ${r.status}`);
  return (await r.json()) as T;
}

/** "U11 (º2016) KWS" wordt "U11"; "U16-U17 (º2011-º2012) KWS" wordt "U16-U17". */
export function korteNaam(naam: string): string {
  return naam.split("(")[0].replace(/\bKWS\b/i, "").trim() || naam;
}

function volgorde(kort: string): number {
  const m = kort.match(/U\s?(\d+)/i);
  return m ? Number(m[1]) : 99;
}

/** Een geldige datum, of null. In Spond staan soms onmogelijke datums zoals 2012-05-99. */
function datum(s?: string): string | null {
  const m = s?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const [j, mnd, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const echt = new Date(Date.UTC(j, mnd - 1, d));
  return echt.getUTCFullYear() === j && echt.getUTCMonth() === mnd - 1 && echt.getUTCDate() === d ? m[0] : null;
}

/** Begin van het seizoen waar deze datum in valt (1 juli). */
export function seizoensbegin(d = new Date()): Date {
  const jaar = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1;
  return new Date(Date.UTC(jaar, 6, 1));
}

/** Bv. "2026-2027" voor alles tussen 1 juli 2026 en 30 juni 2027. */
export function seizoenNaam(d = new Date()): string {
  const jaar = seizoensbegin(d).getUTCFullYear();
  return `${jaar}-${jaar + 1}`;
}

const iso = (d: Date) => d.toISOString().slice(0, 10) + "T00:00:00.000Z";

async function inStukken<T>(rijen: T[], grootte: number, doe: (stuk: T[]) => Promise<void>) {
  for (let i = 0; i < rijen.length; i += grootte) await doe(rijen.slice(i, i + grootte));
}

function check(error: { message: string } | null, wat: string) {
  if (error) throw new Error(`${wat}: ${error.message}`);
}

export type SyncResultaat = {
  ploegen: number;
  spelers: number;
  staf: number;
  activiteiten: number;
  aanwezigheden: number;
  nietMeerInSpond: number;
  van: string;
};

/**
 * Een volledige ronde. Standaard de laatste 45 dagen en de komende 3 weken;
 * met `volledig` het hele seizoen. Oudere activiteiten blijven gewoon staan.
 */
export async function synchroniseer(opts: { aanmelding: Aanmelding; volledig?: boolean; bron: string }): Promise<SyncResultaat> {
  const log = await db().from("jeugd_sync_log").insert({ bron: opts.bron }).select("id").single();
  const logId = log.data?.id as number | undefined;
  try {
    const resultaat = await ronde(opts.aanmelding, opts.volledig ?? false);
    if (logId) await db().from("jeugd_sync_log").update({ einde: new Date().toISOString(), ok: true, aantallen: resultaat }).eq("id", logId);
    return resultaat;
  } catch (e) {
    const bericht = e instanceof Error ? e.message : String(e);
    if (logId) await db().from("jeugd_sync_log").update({ einde: new Date().toISOString(), ok: false, bericht }).eq("id", logId);
    throw e;
  }
}

async function ronde(aanmelding: Aanmelding, volledig: boolean): Promise<SyncResultaat> {
  const start = new Date();
  const token = await login(aanmelding);
  const groepen = await lees<Json[]>(token, "groups/");
  const groep = groepen.find((g) => /jeugd/i.test(String(g.name))) as
    | { id: string; members: SpondLid[]; subGroups: { id: string; name: string }[]; roles?: { id: string; name: string }[] }
    | undefined;
  if (!groep) throw new Error("Geen jeugdgroep gevonden in Spond");

  // Ploegen
  const ploegen = groep.subGroups.filter((s) => !GEEN_JEUGD.test(s.name));
  const ploegIds = new Set(ploegen.map((p) => p.id));
  {
    const { error } = await db()
      .from("jeugd_ploegen")
      .upsert(
        ploegen.map((p) => {
          const kort = korteNaam(p.name);
          return { id: p.id, naam: p.name, kort, volgorde: volgorde(kort), actief: true, bijgewerkt: start.toISOString() };
        }),
      );
    check(error, "Ploegen bewaren");
    const weg = await db().from("jeugd_ploegen").update({ actief: false }).lt("bijgewerkt", start.toISOString());
    check(weg.error, "Oude ploegen");
  }

  // Leden: wie een rol heeft (trainer, afgevaardigde, ...) is staf, de rest speler.
  const rolNaam = new Map((groep.roles ?? []).map((r) => [r.id, r.name]));
  const jeugdLeden = groep.members.filter((m) => (m.subGroups ?? []).some((s) => ploegIds.has(s)));
  const staf = jeugdLeden.filter((m) => (m.roles ?? []).length);
  const spelers = jeugdLeden.filter((m) => !(m.roles ?? []).length);
  const spelerIds = new Set(spelers.map((s) => s.id));

  await inStukken(spelers, 200, async (stuk) => {
    const { error } = await db()
      .from("jeugd_spelers")
      .upsert(
        stuk.map((m) => ({
          id: m.id,
          voornaam: m.firstName?.trim() ?? "",
          achternaam: m.lastName?.trim() ?? "",
          geboortedatum: datum(m.dateOfBirth),
          ploegen: (m.subGroups ?? []).filter((s) => ploegIds.has(s)),
          email: m.email ?? null,
          gsm: m.phoneNumber ?? null,
          ouders: (m.guardians ?? []).map((o) => ({
            naam: [o.firstName, o.lastName].filter(Boolean).join(" "),
            email: o.email ?? null,
            gsm: o.phoneNumber ?? null,
          })),
          actief: true,
          laatst_in_spond: start.toISOString(),
          bijgewerkt: start.toISOString(),
        })),
      );
    check(error, "Spelers bewaren");
  });

  // Ploeggeschiedenis: in welke ploeg(en) de speler dit seizoen zit.
  const seizoen = seizoenNaam(start);
  await inStukken(spelers, 200, async (stuk) => {
    const { error } = await db()
      .from("jeugd_ploeghistoriek")
      .upsert(
        stuk.map((m) => ({
          speler_id: m.id,
          seizoen,
          ploegen: (m.subGroups ?? []).filter((s) => ploegIds.has(s)),
          bijgewerkt: start.toISOString(),
        })),
      );
    check(error, "Ploeggeschiedenis bewaren");
  });

  const nietMeer = await db()
    .from("jeugd_spelers")
    .update({ actief: false }, { count: "exact" })
    .eq("actief", true)
    .lt("laatst_in_spond", start.toISOString());
  check(nietMeer.error, "Vertrokken spelers");

  {
    const { error } = await db()
      .from("jeugd_staf")
      .upsert(
        staf.map((m) => ({
          id: m.id,
          naam: `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim(),
          email: m.email ?? null,
          rollen: (m.roles ?? []).map((r) => rolNaam.get(r) ?? r),
          ploegen: (m.subGroups ?? []).filter((s) => ploegIds.has(s)),
          bijgewerkt: start.toISOString(),
        })),
      );
    check(error, "Staf bewaren");
    const weg = await db().from("jeugd_staf").delete().lt("bijgewerkt", start.toISOString());
    check(weg.error, "Oude staf");
  }

  // Activiteiten, per maand opgehaald zodat het maximum van Spond nooit knelt.
  const van = volledig ? seizoensbegin(start) : new Date(Math.max(seizoensbegin(start).getTime(), start.getTime() - 45 * 864e5));
  const tot = new Date(start.getTime() + 21 * 864e5);
  const activiteiten: SpondActiviteit[] = [];
  for (let s = new Date(van); s < tot; s = new Date(s.getTime() + 30 * 864e5)) {
    const e = new Date(Math.min(s.getTime() + 30 * 864e5, tot.getTime()));
    const stuk = await lees<SpondActiviteit[]>(token, "sponds/", {
      groupId: groep.id,
      minStartTimestamp: iso(s),
      maxStartTimestamp: iso(e),
      max: "1000",
      scheduled: "true",
      includeHidden: "true",
    });
    if (stuk.length >= 1000) throw new Error("Meer dan 1000 activiteiten in een maand, het venster moet kleiner");
    activiteiten.push(...stuk);
  }
  const uniek = [...new Map(activiteiten.map((a) => [a.id, a])).values()];

  // Activiteiten van enkel de seniors of de Vrullies laten we weg.
  const jeugdRijen = uniek
    .filter((a) => {
      const subgroepen = (a.recipients?.group?.subGroups ?? []).map((s) => s.id);
      return subgroepen.length === 0 || subgroepen.some((s) => ploegIds.has(s));
    })
    .map((a) => ({
      id: a.id,
      ploegen: (a.recipients?.group?.subGroups ?? []).map((s) => s.id).filter((s) => ploegIds.has(s)),
      soort: a.matchEvent ? "wedstrijd" : /training/i.test(a.heading) || a.type === "RECURRING" ? "training" : "activiteit",
      titel: a.heading,
      start: a.startTimestamp,
      einde: a.endTimestamp ?? null,
      tegenstander: a.matchInfo?.opponentName ?? null,
      geannuleerd: Boolean(a.cancelled),
      bijgewerkt: start.toISOString(),
    }));
  await inStukken(jeugdRijen, 500, async (stuk) => {
    const { error } = await db().from("jeugd_activiteiten").upsert(stuk);
    check(error, "Activiteiten bewaren");
  });
  // Wat in dit venster niet meer in Spond staat, is daar verwijderd.
  {
    const nu = new Set(jeugdRijen.map((r) => r.id));
    // Supabase geeft hoogstens 1000 rijen per keer terug.
    const bestaand: string[] = [];
    for (let i = 0; ; i += 1000) {
      const { data, error } = await db()
        .from("jeugd_activiteiten")
        .select("id")
        .gte("start", van.toISOString())
        .lt("start", tot.toISOString())
        .order("id")
        .range(i, i + 999);
      check(error, "Bestaande activiteiten");
      bestaand.push(...(data ?? []).map((r) => r.id as string));
      if (!data || data.length < 1000) break;
    }
    const weg = bestaand.filter((id) => !nu.has(id));
    await inStukken(weg, 200, async (stuk) => {
      const { error } = await db().from("jeugd_activiteiten").delete().in("id", stuk);
      check(error, "Verwijderde activiteiten");
    });
  }

  const jeugdIds = new Set(jeugdRijen.map((r) => r.id));
  const aanwezig: { activiteit_id: string; speler_id: string; status: string }[] = [];
  for (const a of uniek) {
    if (!jeugdIds.has(a.id)) continue;
    const r = a.responses ?? {};
    const zet = (ids: string[] | undefined, status: string) => {
      for (const id of ids ?? []) if (spelerIds.has(id)) aanwezig.push({ activiteit_id: a.id, speler_id: id, status });
    };
    zet(r.unansweredIds, "geen_antwoord");
    zet(r.unconfirmedIds, "geen_antwoord");
    zet(r.waitinglistIds, "geen_antwoord");
    zet(r.declinedIds, "komt_niet");
    zet(r.acceptedIds, "komt");
  }
  const zonderDubbel = [...new Map(aanwezig.map((x) => [`${x.activiteit_id}|${x.speler_id}`, x])).values()];
  // Eerst de oude antwoorden van deze activiteiten weg, zodat wie niet meer
  // uitgenodigd is ook verdwijnt.
  await inStukken([...jeugdIds], 200, async (stuk) => {
    const { error } = await db().from("jeugd_aanwezigheden").delete().in("activiteit_id", stuk);
    check(error, "Oude antwoorden");
  });
  await inStukken(zonderDubbel, 1000, async (stuk) => {
    const { error } = await db().from("jeugd_aanwezigheden").insert(stuk);
    check(error, "Antwoorden bewaren");
  });

  return {
    ploegen: ploegen.length,
    spelers: spelers.length,
    staf: staf.length,
    activiteiten: jeugdRijen.length,
    aanwezigheden: zonderDubbel.length,
    nietMeerInSpond: nietMeer.count ?? 0,
    van: van.toISOString().slice(0, 10),
  };
}
