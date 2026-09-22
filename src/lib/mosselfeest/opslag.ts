import { del, list, put } from "@vercel/blob";
import { ontsleutelJson, sleutelUit, versleutelJson } from "@/lib/kluis";
import { EVENEMENT } from "./kaart";
import {
  telOp,
  volgendKaartnummer,
  type Bron,
  type Inschrijving,
  type Totalen,
} from "./totalen";

export { telOp, volgendKaartnummer };
export type { Bron, Inschrijving, Totalen };

/**
 * De inschrijvingen van het mosselfeest.
 *
 * Elke inschrijving is één versleuteld blokje in Vercel Blob, onder
 * mosselfeest/<jaar>/. Ze blijven staan tot na het feest: dit is geen wachtrij
 * zoals bij de toestemmingen, maar de ledenlijst van de avond.
 *
 * Het vinkje "betaald" verandert ná de inschrijving, dus dat wordt hier
 * bijgewerkt en het blokje wordt overschreven. Dat is ook de reden dat het
 * Excel-logboek elke keer volledig opnieuw gemaakt wordt uit deze gegevens:
 * dan is er één plek waar de waarheid staat en kan er niets uit elkaar lopen.
 */

const MAP = `mosselfeest/${EVENEMENT.jaar}`;

function sleutel(): Buffer | null {
  const geheim = process.env.MOSSELFEEST_SLEUTEL;
  return geheim ? sleutelUit(geheim, "kws-mosselfeest") : null;
}

export function opslagBeschikbaar(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN) && Boolean(sleutel());
}

/**
 * Waar een inschrijving vandaan komt.
 *
 * "online" is het formulier. "kaart" is een gedrukte kaart die iemand heeft
 * afgegeven en die een organisator heeft ingetypt. "verzamelpost" is een
 * stapel kaarten die als een geheel geboekt is, zonder namen: alleen de
 * aantallen, met een toelichting erbij.
 */
export interface BewaarResultaat {
  ok: boolean;
  fout?: string;
}

function pad(kenmerk: string): string {
  return `${MAP}/${kenmerk}.bin`;
}

/**
 * Een adres dat gegarandeerd langs de cache gaat.
 *
 * Een blokje houdt bij een wijziging zijn adres (we overschrijven het), en het
 * netwerk van de opslag mag dat adres cachen. In productie gaf een uitlezing
 * daardoor tot acht seconden lang nog de oude inhoud terug: je vinkte betaald
 * aan, de lijst werd ververst en het stond er nog steeds als openstaand. Met
 * een unieke parameter erachter is elk verzoek een nieuw adres voor die cache,
 * en krijgen we altijd wat er net geschreven is.
 */
function vers(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}vers=${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function zetWeg(inschrijving: Inschrijving): Promise<BewaarResultaat> {
  const key = sleutel();
  if (!key) return { ok: false, fout: "MOSSELFEEST_SLEUTEL ontbreekt." };
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, fout: "BLOB_READ_WRITE_TOKEN ontbreekt." };
  }
  try {
    await put(pad(inschrijving.kenmerk), versleutelJson(inschrijving, key), {
      access: "public",
      contentType: "application/octet-stream",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return { ok: true };
  } catch (fout) {
    return { ok: false, fout: fout instanceof Error ? fout.message : "Onbekende fout" };
  }
}

export async function bewaarInschrijving(inschrijving: Inschrijving): Promise<BewaarResultaat> {
  return zetWeg(inschrijving);
}

/**
 * Alle inschrijvingen, oudste eerst.
 *
 * De blokjes worden per handvol tegelijk opgehaald: alles in één keer opvragen
 * legt bij honderden inschrijvingen te veel verbindingen open, en één per één
 * duurt te lang.
 */
export async function alleInschrijvingen(): Promise<Inschrijving[]> {
  const key = sleutel();
  if (!key || !process.env.BLOB_READ_WRITE_TOKEN) return [];

  const { blobs } = await list({ prefix: `${MAP}/` });
  const adressen = blobs.filter((b) => b.pathname.endsWith(".bin")).map((b) => b.url);

  const gevonden: Inschrijving[] = [];
  const TEGELIJK = 12;
  for (let i = 0; i < adressen.length; i += TEGELIJK) {
    const groep = adressen.slice(i, i + TEGELIJK);
    const stukken = await Promise.all(
      groep.map(async (adres) => {
        try {
          const antwoord = await fetch(vers(adres), { cache: "no-store" });
          if (!antwoord.ok) return null;
          const blok = Buffer.from(await antwoord.arrayBuffer());
          return ontsleutelJson<Inschrijving>(blok, key);
        } catch {
          return null;
        }
      }),
    );
    for (const stuk of stukken) {
      // Enkel wat er echt als inschrijving uitziet. Staat er ooit een ander
      // bestand in deze map, dan mag dat de hele lijst niet onderuithalen.
      if (stuk && typeof stuk.kenmerk === "string" && typeof stuk.aangemeld === "string") {
        gevonden.push(stuk);
      }
    }
  }

  return gevonden.sort((a, b) => a.aangemeld.localeCompare(b.aangemeld));
}

export async function haalInschrijving(kenmerk: string): Promise<Inschrijving | null> {
  const key = sleutel();
  if (!key || !process.env.BLOB_READ_WRITE_TOKEN) return null;
  const { blobs } = await list({ prefix: pad(kenmerk) });
  const blob = blobs.find((b) => b.pathname === pad(kenmerk));
  if (!blob) return null;
  const antwoord = await fetch(vers(blob.url), { cache: "no-store" });
  if (!antwoord.ok) return null;
  return ontsleutelJson<Inschrijving>(Buffer.from(await antwoord.arrayBuffer()), key);
}

/** Het vinkje "betaald" zetten of weghalen. */
export async function zetBetaald(
  kenmerk: string,
  betaald: boolean,
): Promise<{ ok: boolean; inschrijving?: Inschrijving; fout?: string }> {
  const bestaande = await haalInschrijving(kenmerk);
  if (!bestaande) return { ok: false, fout: "Inschrijving niet gevonden." };

  const bijgewerkt: Inschrijving = {
    ...bestaande,
    betaald,
    betaaldOp: betaald ? new Date().toISOString() : undefined,
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
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  const { blobs } = await list({ prefix: pad(kenmerk) });
  const blob = blobs.find((b) => b.pathname === pad(kenmerk));
  if (!blob) return false;
  await del(blob.url);
  return true;
}

/**
 * De voorraad per dag: hoeveel er van elk gerecht voorzien is.
 *
 * Dat is wat het bestuur vroeger op het blad "LeftOvers" bijhield. Samen met
 * wat er besteld is, weet de keuken hoeveel er die avond nog aan de deur
 * verkocht kan worden.
 *
 * Eén blokje voor het hele feest, versleuteld zoals de inschrijvingen.
 */
export interface Voorraad {
  /** Per dag en per gerecht-id het aantal dat voorzien is. */
  voorzien: Record<string, Record<string, number>>;
  bijgewerkt?: string;
  bijgewerktDoor?: string;
}

// Bewust buiten MAP: alles onder die map wordt als inschrijving gelezen.
const VOORRAADPAD = `mosselfeest/voorraad-${EVENEMENT.jaar}.bin`;

export async function haalVoorraad(): Promise<Voorraad> {
  const leeg: Voorraad = { voorzien: { vrijdag: {}, zaterdag: {} } };
  const key = sleutel();
  if (!key || !process.env.BLOB_READ_WRITE_TOKEN) return leeg;
  try {
    const { blobs } = await list({ prefix: VOORRAADPAD });
    const blob = blobs.find((b) => b.pathname === VOORRAADPAD);
    if (!blob) return leeg;
    const antwoord = await fetch(vers(blob.url), { cache: "no-store" });
    if (!antwoord.ok) return leeg;
    const gelezen = ontsleutelJson<Voorraad>(Buffer.from(await antwoord.arrayBuffer()), key);
    return gelezen ?? leeg;
  } catch (fout) {
    console.error("[mosselfeest] voorraad lezen mislukt:", fout);
    return leeg;
  }
}

export async function bewaarVoorraad(voorraad: Voorraad): Promise<BewaarResultaat> {
  const key = sleutel();
  if (!key) return { ok: false, fout: "MOSSELFEEST_SLEUTEL ontbreekt." };
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, fout: "BLOB_READ_WRITE_TOKEN ontbreekt." };
  }
  try {
    await put(VOORRAADPAD, versleutelJson(voorraad, key), {
      access: "public",
      contentType: "application/octet-stream",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return { ok: true };
  } catch (fout) {
    return { ok: false, fout: fout instanceof Error ? fout.message : "Onbekende fout" };
  }
}
