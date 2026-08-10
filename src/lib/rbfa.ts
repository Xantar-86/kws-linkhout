import type { WedstrijdEvent } from "@/types";

const RBFA_GRAPHQL = "https://datalake-prod2018.rbfa.be/graphql";
const LINKHOUT_CLUB_ID = "1595";

const TEAM_CALENDAR_QUERY = `query GetTeamCalendar($teamId: ID!, $language: Language!, $sortByDate: SortDirection) {
  teamCalendar(teamId: $teamId, language: $language, sortByDate: $sortByDate) {
    startTime
    homeTeam { name clubId logo }
    awayTeam { name clubId logo }
    series { name }
    location { name address city postalCode }
  }
}`;

interface RbfaTeam {
  name: string;
  clubId: string;
  /** URL van het clublogo op de RBFA-CDN. Kan ontbreken bij kleine clubs. */
  logo: string | null;
}

/**
 * Het terrein waar gespeeld wordt, zoals de RBFA het kent.
 *
 * Dit is niet altijd het vaste veld van de thuisploeg: bij een tornooi of een
 * verplaatst duel wijkt het af. Daarom lezen we het per wedstrijd uit en gaan
 * we niet af op wie thuis staat.
 */
interface RbfaLocation {
  name: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
}

interface RbfaMatch {
  startTime: string | null;
  homeTeam: RbfaTeam | null;
  awayTeam: RbfaTeam | null;
  series: { name: string } | null;
  location: RbfaLocation | null;
}

/** Het speelveld in de vorm waarin de rest van de site het gebruikt. */
export interface Speelveld {
  naam: string;
  straat: string;
  gemeente: string;
}

/**
 * De RBFA schrijft ons eigen terrein als "Ws Linkhout" en zet Lummen als
 * gemeente. Op de affiches hoort de naam die de club zelf gebruikt.
 */
const EIGEN_VELD_NAAM = "Linkwood Park";

function naarSpeelveld(loc: RbfaLocation | null): Speelveld | undefined {
  if (!loc?.name) return undefined;
  const eigen = /^w\.?\s*s\.?\s*linkhout$/i.test(loc.name.trim());
  return {
    naam: eigen ? EIGEN_VELD_NAAM : loc.name.trim(),
    straat: loc.address?.trim() ?? "",
    gemeente: [loc.postalCode, loc.city].filter(Boolean).join(" ").trim(),
  };
}

/**
 * Query voor gespeelde wedstrijden. Levert naast de basisgegevens ook de
 * wedstrijdgebeurtenissen: doelpunten, kaarten en wissels, per minuut
 * gegroepeerd en gesplitst in thuis- en uitploeg.
 */
const TEAM_RESULTS_QUERY = `query GetTeamResults($teamId: ID!, $language: Language!, $sortByDate: SortDirection) {
  teamCalendar(teamId: $teamId, language: $language, sortByDate: $sortByDate) {
    startTime
    state
    showScore
    homeTeam { name clubId logo }
    awayTeam { name clubId logo }
    series { name }
    location { name address city postalCode }
    events {
      minute
      home { firstName lastName kind }
      away { firstName lastName kind }
    }
  }
}`;

/** Soorten gebeurtenissen die de RBFA-feed teruggeeft. */
export type RbfaEventKind =
  | "goal"
  | "penalty"
  | "own_goal"
  | "yellow"
  | "red"
  | "in"
  | "out"
  | string;

interface RbfaEventSpeler {
  firstName: string | null;
  lastName: string | null;
  kind: RbfaEventKind;
}

interface RbfaGroupedEvent {
  minute: number | null;
  home: RbfaEventSpeler[] | null;
  away: RbfaEventSpeler[] | null;
}

interface RbfaResultMatch extends RbfaMatch {
  state: string | null;
  showScore: boolean | null;
  events: RbfaGroupedEvent[] | null;
}

export interface Doelpunt {
  minuut: number;
  speler: string;
  /** True als het doelpunt door de thuisploeg gemaakt is. */
  thuis: boolean;
  /** Strafschop of eigen doelpunt, voor de vermelding in de post. */
  soort: "goal" | "penalty" | "own_goal";
}

export interface RbfaUitslag {
  start: Date;
  thuisNaam: string;
  uitNaam: string;
  thuisLogo?: string;
  uitLogo?: string;
  reeks?: string;
  thuisScore: number;
  uitScore: number;
  doelpunten: Doelpunt[];
  /** True als de club thuis speelde. */
  eigenThuis: boolean;
  /** Waar gespeeld is; ontbreekt zelden, maar kan. */
  veld?: Speelveld;
}

/** Kinds die als doelpunt tellen voor de ploeg die het event kreeg. */
const DOELPUNT_KINDS = new Set(["goal", "penalty"]);

function spelerNaam(speler: RbfaEventSpeler): string {
  return [speler.firstName, speler.lastName].filter(Boolean).join(" ").trim();
}

/**
 * Haalt de gespeelde wedstrijden van een ploeg op met de doelpuntenmakers.
 *
 * De RBFA-feed geeft geen kant-en-klare eindstand terug, dus die leiden we af
 * uit de doelpunt-events. Een eigen doelpunt telt voor de tegenpartij.
 */
export async function getRbfaUitslagen(teamId: string): Promise<RbfaUitslag[]> {
  const response = await fetch(RBFA_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: TEAM_RESULTS_QUERY,
      variables: { teamId, language: "nl", sortByDate: "asc" },
    }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`RBFA-API gaf status ${response.status}`);
  }

  const json = await response.json();
  const matches: RbfaResultMatch[] = json?.data?.teamCalendar ?? [];

  return matches
    .filter((m) => m.startTime && m.state === "finished" && m.homeTeam && m.awayTeam)
    .map((m) => {
      const doelpunten: Doelpunt[] = [];
      let thuisScore = 0;
      let uitScore = 0;

      for (const groep of m.events ?? []) {
        const minuut = groep.minute ?? 0;

        for (const [kant, spelers] of [
          ["thuis", groep.home ?? []],
          ["uit", groep.away ?? []],
        ] as const) {
          for (const speler of spelers) {
            const isEigenDoelpunt = speler.kind === "own_goal";
            if (!DOELPUNT_KINDS.has(speler.kind) && !isEigenDoelpunt) continue;

            // Een eigen doelpunt levert een punt op voor de andere ploeg.
            const puntVoorThuis = isEigenDoelpunt ? kant === "uit" : kant === "thuis";
            if (puntVoorThuis) thuisScore++;
            else uitScore++;

            doelpunten.push({
              minuut,
              speler: spelerNaam(speler),
              thuis: kant === "thuis",
              soort: isEigenDoelpunt ? "own_goal" : (speler.kind as "goal" | "penalty"),
            });
          }
        }
      }

      doelpunten.sort((a, b) => a.minuut - b.minuut);

      return {
        start: brusselsNaarDate(m.startTime!),
        thuisNaam: m.homeTeam!.name,
        uitNaam: m.awayTeam!.name,
        thuisLogo: m.homeTeam!.logo ?? undefined,
        uitLogo: m.awayTeam!.logo ?? undefined,
        reeks: m.series?.name ?? undefined,
        thuisScore,
        uitScore,
        doelpunten,
        eigenThuis: m.homeTeam!.clubId === LINKHOUT_CLUB_ID,
        veld: naarSpeelveld(m.location),
      };
    })
    .sort((a, b) => b.start.getTime() - a.start.getTime());
}

/**
 * RBFA levert aftraptijden als Brusselse wandkloktijd zonder tijdzone
 * (bv. "2026-07-22T20:00:00"). Zet dat om naar het juiste absolute instant,
 * onafhankelijk van de tijdzone waarin de server draait (Vercel = UTC).
 */
function brusselsNaarDate(startTime: string): Date {
  const alsUtc = new Date(`${startTime}Z`);
  const utcWand = new Date(alsUtc.toLocaleString("en-US", { timeZone: "UTC" }));
  const bruWand = new Date(alsUtc.toLocaleString("en-US", { timeZone: "Europe/Brussels" }));
  const offsetMin = (bruWand.getTime() - utcWand.getTime()) / 60000; // +120 zomer, +60 winter
  return new Date(alsUtc.getTime() - offsetMin * 60000);
}

/**
 * Haalt de volledige seizoenskalender van een ploeg op via de RBFA-API
 * en mapt die naar WedstrijdEvent[]. Gooit bij een niet-OK antwoord.
 */
export async function getRbfaWedstrijden(teamId: string): Promise<WedstrijdEvent[]> {
  const response = await fetch(RBFA_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: TEAM_CALENDAR_QUERY,
      variables: { teamId, language: "nl", sortByDate: "asc" },
    }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`RBFA-API gaf status ${response.status}`);
  }

  const json = await response.json();
  const matches: RbfaMatch[] = json?.data?.teamCalendar ?? [];

  return matches
    .filter((m) => m.startTime && m.homeTeam?.name && m.awayTeam?.name)
    .map((m) => {
      const thuis = m.homeTeam!.clubId === LINKHOUT_CLUB_ID;
      const veld = naarSpeelveld(m.location);
      return {
        summary: `${m.homeTeam!.name} - ${m.awayTeam!.name}`,
        start: brusselsNaarDate(m.startTime!),
        location: veld ? [veld.naam, veld.straat, veld.gemeente].filter(Boolean).join(", ") : "",
        veld,
        description: thuis ? "Thuiswedstrijd" : "Uitwedstrijd",
        thuisNaam: m.homeTeam!.name,
        uitNaam: m.awayTeam!.name,
        thuisLogo: m.homeTeam!.logo ?? undefined,
        uitLogo: m.awayTeam!.logo ?? undefined,
        reeks: m.series?.name ?? undefined,
      };
    });
}
