import { randomUUID } from "node:crypto";
import { del, list, put } from "@vercel/blob";
import { ontsleutelJson, sleutelUit, versleutelJson } from "@/lib/kluis";
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

// MOSSELFEEST_TESTMAP laat een lokale testserver op een kopie werken, zodat
// proberen nooit aan de echte inschrijvingen komt. Live staat ze niet.
const MAP = process.env.MOSSELFEEST_TESTMAP || `mosselfeest/${EVENEMENT.jaar}`;

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
 * Verse kopieën, naast de gewone opslag.
 *
 * Een overschreven blokje houdt zijn adres, en het cachenetwerk van de opslag
 * gaf daarop na een wijziging tot meer dan twintig seconden de vorige inhoud
 * terug, ook met vers() erachter (gemeten op 23 oktober 2026). Dan zou een
 * betaling vlak na een andere die eerste overschrijven, of een gesplitste
 * kaart haar gerechten terugkrijgen.
 *
 * Daarom komt bij elke bewaring ook een kopie op een nieuw adres. Een adres
 * dat nog nooit gelezen is, kan niet in de cache zitten, dus die kopie is
 * altijd de echte stand. Alleen de nieuwste blijft staan. Bewust buiten MAP:
 * alles onder MAP wordt als inschrijving gelezen.
 */
function versMap(kenmerk: string): string {
  return `${MAP}-vers/${kenmerk}/`;
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
  inschrijving.versie = (inschrijving.versie ?? 0) + 1;
  const blok = versleutelJson(inschrijving, key);
  try {
    await put(pad(inschrijving.kenmerk), blok, {
      access: "public",
      contentType: "application/octet-stream",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
  } catch (fout) {
    return { ok: false, fout: fout instanceof Error ? fout.message : "Onbekende fout" };
  }
  await zetVerseKopie(inschrijving.kenmerk, blok);
  return { ok: true };
}

/**
 * De verse kopie bijwerken. Lukt dat niet, dan gaan alle kopieën van die kaart
 * weg, zodat er nooit een oudere kopie gelezen wordt dan wat er echt staat.
 */
async function zetVerseKopie(kenmerk: string, blok: Buffer): Promise<void> {
  const map = versMap(kenmerk);
  try {
    const nieuw = await put(`${map}${Date.now()}.bin`, blok, {
      access: "public",
      contentType: "application/octet-stream",
      addRandomSuffix: true,
      cacheControlMaxAge: 0,
    });
    const { blobs } = await list({ prefix: map });
    const oud = blobs.filter((b) => b.url !== nieuw.url).map((b) => b.url);
    if (oud.length > 0) await del(oud);
  } catch (fout) {
    console.error("[mosselfeest] verse kopie mislukt:", fout);
    try {
      const { blobs } = await list({ prefix: map });
      if (blobs.length > 0) await del(blobs.map((b) => b.url));
    } catch {
      // Dan valt haalInschrijving terug op de vergelijking van de tijdstippen.
    }
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

/**
 * Eén inschrijving, zoals ze nu echt in de opslag staat.
 *
 * Eerst de verse kopie (zie versMap); die is enkel bruikbaar als ze minstens
 * even nieuw is als het blokje zelf. Anders het blokje, en geeft de cache
 * daarvan een ander etag dan de lijst van de opslag, dan even opnieuw lezen.
 */
export async function haalInschrijving(kenmerk: string): Promise<Inschrijving | null> {
  const key = sleutel();
  if (!key || !process.env.BLOB_READ_WRITE_TOKEN) return null;
  const { blobs } = await list({ prefix: pad(kenmerk) });
  const blob = blobs.find((b) => b.pathname === pad(kenmerk));
  if (!blob) return null;

  try {
    const kopieen = (await list({ prefix: versMap(kenmerk) })).blobs;
    const nieuwste = kopieen.sort((x, y) => y.uploadedAt.getTime() - x.uploadedAt.getTime())[0];
    if (nieuwste && nieuwste.uploadedAt.getTime() >= blob.uploadedAt.getTime()) {
      const antwoord = await fetch(nieuwste.url, { cache: "no-store" });
      if (antwoord.ok) {
        const gelezen = ontsleutelJson<Inschrijving>(Buffer.from(await antwoord.arrayBuffer()), key);
        if (gelezen) return gelezen;
      }
    }
  } catch (fout) {
    console.error("[mosselfeest] verse kopie lezen mislukt:", fout);
  }

  for (let poging = 0; ; poging++) {
    const antwoord = await fetch(vers(blob.url), { cache: "no-store" });
    if (!antwoord.ok) return null;
    const etag = antwoord.headers.get("etag");
    if (!etag || !blob.etag || etag === blob.etag || poging >= 8) {
      return ontsleutelJson<Inschrijving>(Buffer.from(await antwoord.arrayBuffer()), key);
    }
    await new Promise((klaar) => setTimeout(klaar, 700));
  }
}

/**
 * De inschrijving om op verder te werken, voor de kassa.
 *
 * Het cachenetwerk van de opslag negeert de parameter van vers() en geeft na
 * een wijziging tot een twintigtal seconden de vorige inhoud terug (gemeten op
 * 23 oktober 2026). Zonder meer zou een tweede betaling vlak na de eerste die
 * eerste dan overschrijven. De kassa stuurt daarom mee wat zij van de kaart
 * weet; is dat een nieuwere versie dan wat hier gelezen wordt, dan werken we
 * daarmee verder.
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
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  const { blobs } = await list({ prefix: pad(kenmerk) });
  const blob = blobs.find((b) => b.pathname === pad(kenmerk));
  if (!blob) return false;
  await del(blob.url);
  try {
    const kopieen = (await list({ prefix: versMap(kenmerk) })).blobs;
    if (kopieen.length > 0) await del(kopieen.map((b) => b.url));
  } catch {
    // Een achtergebleven kopie zonder blokje wordt nooit gelezen.
  }
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
