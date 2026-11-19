import { randomUUID } from "node:crypto";
import { databaseBeschikbaar, db } from "@/lib/supabase";
import { EVENEMENT, bedragVan, zitting as zittingVan } from "./kaart";
import {
  openstaand,
  reedsBetaald,
  telOp,
  volgendKaartnummer,
  volgendeLetter,
  type Betaalmanier,
  type Bron,
  type Inschrijving,
  type Totalen,
} from "./totalen";

export { openstaand, reedsBetaald, telOp, volgendKaartnummer };
export type { Betaalmanier, Bron, Inschrijving, Totalen };

/**
 * De inschrijvingen van het mosselfeest, in de tabel mosselfeest_inschrijvingen
 * van Supabase (zie lib/supabase.ts).
 *
 * Eén rij per inschrijving, met de inschrijving zelf als JSON in "gegevens".
 * Ze blijven staan tot na het feest: dit is geen wachtrij zoals bij de
 * toestemmingen, maar de ledenlijst van de avond.
 *
 * Het vinkje "betaald" verandert ná de inschrijving, dus dat wordt hier
 * bijgewerkt. Het Excel-logboek wordt elke keer volledig opnieuw gemaakt uit
 * deze gegevens: dan is er één plek waar de waarheid staat.
 *
 * Tot november 2026 stond dit in Vercel Blob, met verse kopieën en etags om
 * rond de cache van die opslag te werken. Een database geeft na het schrijven
 * meteen de nieuwe stand, dus dat is allemaal weg.
 */

// MOSSELFEEST_TESTMAP laat een lokale testserver op een kopie werken, zodat
// proberen nooit aan de echte inschrijvingen komt. Live staat ze niet.
const MAP = process.env.MOSSELFEEST_TESTMAP || `mosselfeest/${EVENEMENT.jaar}`;
const TABEL = "mosselfeest_inschrijvingen";

export function opslagBeschikbaar(): boolean {
  return databaseBeschikbaar();
}

export interface BewaarResultaat {
  ok: boolean;
  fout?: string;
}

async function zetWeg(inschrijving: Inschrijving): Promise<BewaarResultaat> {
  if (!databaseBeschikbaar()) return { ok: false, fout: "SUPABASE_URL of SUPABASE_SECRET_KEY ontbreekt." };
  inschrijving.versie = (inschrijving.versie ?? 0) + 1;
  const { error } = await db().from(TABEL).upsert({
    map: MAP,
    kenmerk: inschrijving.kenmerk,
    gegevens: inschrijving,
    bijgewerkt: new Date().toISOString(),
  });
  return error ? { ok: false, fout: error.message } : { ok: true };
}

export async function bewaarInschrijving(inschrijving: Inschrijving): Promise<BewaarResultaat> {
  return zetWeg(inschrijving);
}

/** Alle inschrijvingen, oudste eerst. */
export async function alleInschrijvingen(): Promise<Inschrijving[]> {
  if (!databaseBeschikbaar()) return [];
  const { data, error } = await db().from(TABEL).select("gegevens").eq("map", MAP);
  if (error) {
    console.error("[mosselfeest] inschrijvingen lezen mislukt:", error.message);
    throw new Error(error.message);
  }
  return (data ?? [])
    .map((r) => r.gegevens as Inschrijving)
    .filter((i) => typeof i?.kenmerk === "string" && typeof i?.aangemeld === "string")
    .sort((x, y) => x.aangemeld.localeCompare(y.aangemeld));
}

/** Eén inschrijving, zoals ze nu in de database staat. */
export async function haalInschrijving(kenmerk: string): Promise<Inschrijving | null> {
  if (!databaseBeschikbaar()) return null;
  const { data, error } = await db()
    .from(TABEL)
    .select("gegevens")
    .eq("map", MAP)
    .eq("kenmerk", kenmerk)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.gegevens as Inschrijving | undefined) ?? null;
}

/**
 * De inschrijving om op verder te werken, voor de kassa.
 *
 * De kassa stuurt mee wat zij van de kaart weet. Is dat ooit een nieuwere
 * versie dan wat hier gelezen wordt, dan werken we daarmee verder. Met Vercel
 * Blob gebeurde dat geregeld (de cache liep tot twintig seconden achter); met
 * de database is het een vangnet dat normaal niet meer nodig is.
 */
async function haalVoorKassa(kenmerk: string, bekend?: Inschrijving): Promise<Inschrijving | null> {
  const gelezen = await haalInschrijving(kenmerk);
  if (!gelezen) return null;
  if (bekend && bekend.kenmerk === kenmerk && (bekend.versie ?? 0) > (gelezen.versie ?? 0)) {
    return bekend;
  }
  return gelezen;
}

/** Het vinkje "betaald" zetten of weghalen. */
export async function zetBetaald(
  kenmerk: string,
  betaald: boolean,
  bekend?: Inschrijving,
): Promise<{ ok: boolean; inschrijving?: Inschrijving; fout?: string }> {
  const bestaande = await haalVoorKassa(kenmerk, bekend);
  if (!bestaande) return { ok: false, fout: "Inschrijving niet gevonden." };

  // Betaald zetten betekent: het volledige openstaande bedrag is ontvangen.
  // Terugzetten betekent: er is niets ontvangen.
  // Terugzetten wist ook de betalingen aan de kassa, anders tellen ze nog mee
  // in de afrekening per betaalmanier.
  const bijgewerkt: Inschrijving = {
    ...bestaande,
    betaald,
    betaaldBedrag: betaald ? bestaande.bedrag : 0,
    betaaldOp: betaald ? new Date().toISOString() : undefined,
    betalingen: betaald ? bestaande.betalingen : undefined,
  };
  const resultaat = await zetWeg(bijgewerkt);
  return resultaat.ok
    ? { ok: true, inschrijving: bijgewerkt }
    : { ok: false, fout: resultaat.fout };
}

/**
 * Geld ontvangen aan de kassa, cash of met Bancontact. Zonder bedrag is het
 * alles wat nog openstaat; met een bedrag is het een deel, bijvoorbeeld als
 * twee mensen elk hun deel betalen.
 */
export async function ontvang(
  kenmerk: string,
  manier: Betaalmanier,
  bedrag?: number,
  bekend?: Inschrijving,
): Promise<{ ok: boolean; inschrijving?: Inschrijving; fout?: string }> {
  const bestaande = await haalVoorKassa(kenmerk, bekend);
  if (!bestaande) return { ok: false, fout: "Inschrijving niet gevonden." };

  const open = openstaand(bestaande);
  const deel = bedrag === undefined ? open : Math.round(bedrag * 100) / 100;
  if (!(deel > 0)) return { ok: false, fout: "Er staat niets meer open op deze kaart." };
  if (deel > open) return { ok: false, fout: "Dat is meer dan wat er nog openstaat." };

  const nu = new Date().toISOString();
  const betaaldBedrag = Math.round((reedsBetaald(bestaande) + deel) * 100) / 100;
  const volledig = betaaldBedrag >= bestaande.bedrag;
  const bijgewerkt: Inschrijving = {
    ...bestaande,
    betalingen: [
      ...(bestaande.betalingen ?? []),
      { id: randomUUID().slice(0, 8), bedrag: deel, manier, op: nu },
    ],
    betaaldBedrag,
    betaald: volledig,
    betaaldOp: volledig ? nu : bestaande.betaaldOp,
  };
  const resultaat = await zetWeg(bijgewerkt);
  return resultaat.ok
    ? { ok: true, inschrijving: bijgewerkt }
    : { ok: false, fout: resultaat.fout };
}

/** Een betaling aan de kassa ongedaan maken, bij een vergissing. */
export async function wisBetaling(
  kenmerk: string,
  betalingId: string,
  bekend?: Inschrijving,
): Promise<{ ok: boolean; inschrijving?: Inschrijving; fout?: string }> {
  const bestaande = await haalVoorKassa(kenmerk, bekend);
  if (!bestaande) return { ok: false, fout: "Inschrijving niet gevonden." };
  const weg = (bestaande.betalingen ?? []).find((b) => b.id === betalingId);
  if (!weg) return { ok: false, fout: "Die betaling staat niet op deze kaart." };

  const betaaldBedrag = Math.max(0, Math.round((reedsBetaald(bestaande) - weg.bedrag) * 100) / 100);
  const rest = (bestaande.betalingen ?? []).filter((b) => b.id !== betalingId);
  const volledig = betaaldBedrag >= bestaande.bedrag;
  const bijgewerkt: Inschrijving = {
    ...bestaande,
    betalingen: rest.length > 0 ? rest : undefined,
    betaaldBedrag,
    betaald: volledig,
    betaaldOp: volledig ? bestaande.betaaldOp : undefined,
  };
  const resultaat = await zetWeg(bijgewerkt);
  return resultaat.ok
    ? { ok: true, inschrijving: bijgewerkt }
    : { ok: false, fout: resultaat.fout };
}

/**
 * Een deel van een kaart afsplitsen naar een nieuwe kaart met hetzelfde
 * nummer en een letter erachter (409B), voor wie later of op een andere dag
 * komt. De gerechten gaan van de oude kaart naar de nieuwe.
 *
 * Wat er al betaald was, blijft eerst bij de oude kaart; wat daar te veel is
 * na het afsplitsen, gaat mee naar de nieuwe. Wie vooraf alles overschreef,
 * heeft zo op beide kaarten niets meer te betalen.
 */
export async function splitsAf(
  kenmerk: string,
  aantallen: Record<string, number>,
  zitting: string,
  door?: string,
  bekend?: Inschrijving,
): Promise<{ ok: boolean; oud?: Inschrijving; nieuw?: Inschrijving; fout?: string }> {
  const bestaande = await haalVoorKassa(kenmerk, bekend);
  if (!bestaande) return { ok: false, fout: "Inschrijving niet gevonden." };
  if (!bestaande.kaartnummer) {
    return { ok: false, fout: "Een inschrijving zonder kaartnummer kan niet gesplitst worden." };
  }
  if (!zittingVan(zitting)) return { ok: false, fout: "Kies de zitting voor de nieuwe kaart." };

  const mee: Record<string, number> = {};
  const blijft: Record<string, number> = { ...bestaande.aantallen };
  for (const [id, aantal] of Object.entries(aantallen)) {
    if (!Number.isInteger(aantal) || aantal <= 0) continue;
    if (aantal > (bestaande.aantallen[id] ?? 0)) {
      return { ok: false, fout: "Je kan niet meer afsplitsen dan er op de kaart staat." };
    }
    mee[id] = aantal;
    blijft[id] = (blijft[id] ?? 0) - aantal;
    if (blijft[id] === 0) delete blijft[id];
  }
  if (Object.keys(mee).length === 0) {
    return { ok: false, fout: "Kies wat er naar de nieuwe kaart gaat." };
  }

  const nu = new Date().toISOString();
  const bedragOud = bedragVan(blijft);
  const bedragNieuw = bedragVan(mee);
  const betaald = reedsBetaald(bestaande);
  const betaaldOud = Math.min(betaald, bedragOud);
  const betaaldNieuw = Math.min(Math.round((betaald - betaaldOud) * 100) / 100, bedragNieuw);

  const nieuw: Inschrijving = {
    kenmerk: randomUUID().slice(0, 6).toUpperCase(),
    kaartnummer: bestaande.kaartnummer,
    kaartLetter: volgendeLetter(await alleInschrijvingen(), bestaande.kaartnummer),
    afgesplitstVan: bestaande.kenmerk,
    aangemeld: nu,
    naam: bestaande.naam,
    voornaam: bestaande.voornaam,
    telefoon: bestaande.telefoon,
    bron: bestaande.bron,
    ingevoerdDoor: door,
    zitting,
    aantallen: mee,
    opmerking: `Afgesplitst van kaart ${bestaande.kaartnummer}${bestaande.kaartLetter ?? ""}`,
    bedrag: bedragNieuw,
    betaaldBedrag: betaaldNieuw,
    betaald: betaaldNieuw >= bedragNieuw,
    betaaldOp: betaaldNieuw >= bedragNieuw && betaaldNieuw > 0 ? nu : undefined,
  };
  const oud: Inschrijving = {
    ...bestaande,
    aantallen: blijft,
    bedrag: bedragOud,
    betaaldBedrag: betaaldOud,
    betaald: betaaldOud >= bedragOud,
    gewijzigdOp: nu,
    gewijzigdDoor: door,
  };

  // Eerst de nieuwe kaart: mislukt de tweede stap, dan staat er hooguit een
  // kaart te veel, en gaan er geen gerechten verloren.
  const eerst = await zetWeg(nieuw);
  if (!eerst.ok) return { ok: false, fout: eerst.fout };
  const daarna = await zetWeg(oud);
  if (!daarna.ok) return { ok: false, fout: daarna.fout };
  return { ok: true, oud, nieuw };
}

/**
 * Het vinkje "behandeld" zetten of weghalen: de kaart is op de avond zelf
 * afgehandeld. Raakt niets aan de betaling.
 */
export async function zetBehandeld(
  kenmerk: string,
  behandeld: boolean,
  bekend?: Inschrijving,
): Promise<{ ok: boolean; inschrijving?: Inschrijving; fout?: string }> {
  const bestaande = await haalVoorKassa(kenmerk, bekend);
  if (!bestaande) return { ok: false, fout: "Inschrijving niet gevonden." };

  const bijgewerkt: Inschrijving = {
    ...bestaande,
    behandeld,
    behandeldOp: behandeld ? new Date().toISOString() : undefined,
  };
  const resultaat = await zetWeg(bijgewerkt);
  return resultaat.ok
    ? { ok: true, inschrijving: bijgewerkt }
    : { ok: false, fout: resultaat.fout };
}

/**
 * Een inschrijving schrappen. Gebeurt bij een afmelding of een dubbele
 * inzending; de aantallen moeten kloppen met wat er in de keuken nodig is.
 */
export async function schrapInschrijving(kenmerk: string): Promise<boolean> {
  if (!databaseBeschikbaar()) return false;
  const { data, error } = await db().from(TABEL).delete().eq("map", MAP).eq("kenmerk", kenmerk).select("kenmerk");
  if (error) throw new Error(error.message);
  return (data ?? []).length > 0;
}

/**
 * De voorraad per dag: hoeveel er van elk gerecht voorzien is.
 *
 * Dat is wat het bestuur vroeger op het blad "LeftOvers" bijhield. Samen met
 * wat er besteld is, weet de keuken hoeveel er die avond nog aan de deur
 * verkocht kan worden.
 *
 * Eén rij per feest in de tabel mosselfeest_voorraad.
 */
export interface Voorraad {
  /** Per dag en per gerecht-id het aantal dat voorzien is. */
  voorzien: Record<string, Record<string, number>>;
  bijgewerkt?: string;
  bijgewerktDoor?: string;
}

const VOORRAAD = "mosselfeest_voorraad";

export async function haalVoorraad(): Promise<Voorraad> {
  const leeg: Voorraad = { voorzien: { vrijdag: {}, zaterdag: {} } };
  if (!databaseBeschikbaar()) return leeg;
  const { data, error } = await db().from(VOORRAAD).select("gegevens").eq("map", MAP).maybeSingle();
  if (error) {
    console.error("[mosselfeest] voorraad lezen mislukt:", error.message);
    return leeg;
  }
  return (data?.gegevens as Voorraad | undefined) ?? leeg;
}

export async function bewaarVoorraad(voorraad: Voorraad): Promise<BewaarResultaat> {
  if (!databaseBeschikbaar()) return { ok: false, fout: "SUPABASE_URL of SUPABASE_SECRET_KEY ontbreekt." };
  const { error } = await db()
    .from(VOORRAAD)
    .upsert({ map: MAP, gegevens: voorraad, bijgewerkt: new Date().toISOString() });
  return error ? { ok: false, fout: error.message } : { ok: true };
}
