import { del, list, put } from "@vercel/blob";
import { ontsleutelJson, sleutelUit, versleutelJson } from "@/lib/kluis";
import {
  EVENEMENT,
  GERECHTEN,
  ONLINE_EERSTE_KAARTNUMMER,
  aantalPlaatsen,
  aantalPorties,
  bedragVan,
} from "./kaart";

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
export type Bron = "online" | "kaart" | "verzamelpost";

export interface Inschrijving {
  /** Interne sleutel, tevens de bestandsnaam in de opslag. */
  kenmerk: string;
  /**
   * Het nummer van de kaart, zoals mensen het gebruiken.
   *
   * Online inschrijvingen krijgen er een vanaf 1001; bij een afgegeven kaart
   * typt de organisator het nummer over dat op het blad staat. Ontbreekt het,
   * dan gaat het om een inschrijving van voor deze nummering.
   */
  kaartnummer?: number;
  /** Wanneer de inschrijving binnenkwam (ISO). */
  aangemeld: string;
  /** Bij een verzamelpost is dit de toelichting, bv. "kaarten kantine week 1". */
  naam: string;
  /** Alleen bij een inschrijving via het formulier. */
  email?: string;
  telefoon?: string;
  /** Ontbreekt bij oudere inschrijvingen; die zijn allemaal online gebeurd. */
  bron?: Bron;
  /** Wie de kaart heeft ingetypt, zodat een vraag achteraf te plaatsen is. */
  ingevoerdDoor?: string;
  /** Id van de zitting uit kaart.ts. */
  zitting: string;
  /** Per gerecht-id het aantal porties. */
  aantallen: Record<string, number>;
  opmerking?: string;
  /** Het bedrag op het moment van inschrijven, in euro. */
  bedrag: number;
  betaald: boolean;
  /** Wanneer er afgevinkt is dat het geld binnen is (ISO). */
  betaaldOp?: string;
}

/**
 * Het volgende vrije nummer in de online reeks.
 *
 * We tellen niet het aantal inschrijvingen, maar nemen het hoogste nummer plus
 * een: zo krijgt niemand het nummer van een geschrapte inschrijving opnieuw,
 * en blijft een nummer dus voor altijd van één kaart.
 */
export function volgendKaartnummer(inschrijvingen: Inschrijving[]): number {
  const hoogste = inschrijvingen.reduce((max, i) => {
    const n = i.kaartnummer ?? 0;
    return n >= ONLINE_EERSTE_KAARTNUMMER && n > max ? n : max;
  }, ONLINE_EERSTE_KAARTNUMMER - 1);
  return hoogste + 1;
}

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
    for (const stuk of stukken) if (stuk) gevonden.push(stuk);
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

export interface Totalen {
  inschrijvingen: number;
  /** Hoeveel daarvan online, via een ingetypte kaart of als verzamelpost. */
  perBron: Record<Bron, number>;
  porties: number;
  /** Plaatsen aan tafel: enkel de hoofd- en kindergerechten. */
  plaatsen: number;
  bedrag: number;
  bedragBetaald: number;
  bedragOpen: number;
  /** Per gerecht-id het totale aantal porties. */
  perGerecht: Record<string, number>;
  /**
   * Per zitting-id de aantallen. `plaatsen` is wat telt tegenover het maximum
   * op de kaart; `vrij` is wat er nog over is, of null bij afhalen.
   */
  perZitting: Record<
    string,
    { inschrijvingen: number; porties: number; plaatsen: number; max: number | null; vrij: number | null }
  >;
}

/** De optelsom waar het hele logboek om draait. */
export function telOp(inschrijvingen: Inschrijving[]): Totalen {
  const totalen: Totalen = {
    inschrijvingen: inschrijvingen.length,
    perBron: { online: 0, kaart: 0, verzamelpost: 0 },
    porties: 0,
    plaatsen: 0,
    bedrag: 0,
    bedragBetaald: 0,
    bedragOpen: 0,
    perGerecht: Object.fromEntries(GERECHTEN.map((g) => [g.id, 0])),
    perZitting: Object.fromEntries(
      EVENEMENT.zittingen.map((z) => [
        z.id,
        {
          inschrijvingen: 0,
          porties: 0,
          plaatsen: 0,
          max: z.max ?? null,
          vrij: z.max ?? null,
        },
      ]),
    ),
  };

  for (const inschrijving of inschrijvingen) {
    // Het bedrag opnieuw rekenen uit de aantallen: wijzigt er een prijs op de
    // kaart, dan klopt het totaal nog steeds met de kaart van vandaag. Het
    // bewaarde bedrag blijft wel staan als wat er gevraagd is.
    const bedrag = inschrijving.bedrag || bedragVan(inschrijving.aantallen);
    const porties = aantalPorties(inschrijving.aantallen);
    const plaatsen = aantalPlaatsen(inschrijving.aantallen);

    totalen.perBron[inschrijving.bron ?? "online"] += 1;
    totalen.porties += porties;
    totalen.plaatsen += plaatsen;
    totalen.bedrag += bedrag;
    if (inschrijving.betaald) totalen.bedragBetaald += bedrag;
    else totalen.bedragOpen += bedrag;

    for (const [id, aantal] of Object.entries(inschrijving.aantallen)) {
      if (!(id in totalen.perGerecht) || !(aantal > 0)) continue;
      totalen.perGerecht[id] += aantal;
    }

    const zitting = totalen.perZitting[inschrijving.zitting];
    if (zitting) {
      zitting.inschrijvingen += 1;
      zitting.porties += porties;
      zitting.plaatsen += plaatsen;
      if (zitting.max !== null) zitting.vrij = Math.max(0, zitting.max - zitting.plaatsen);
    }
  }

  totalen.bedrag = Math.round(totalen.bedrag * 100) / 100;
  totalen.bedragBetaald = Math.round(totalen.bedragBetaald * 100) / 100;
  totalen.bedragOpen = Math.round(totalen.bedragOpen * 100) / 100;
  return totalen;
}
