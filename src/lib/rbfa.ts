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

/* -------------------------------------------------------------------------
   Het seizoen en het klassement van een ploeg.

   Twee vragen die de RBFA-site zelf ook stelt: teamCalendar voor alle
   wedstrijden met hun uitslag, en teamSeriesAndRankings voor de stand.

   Een ploeg speelt vaak in meer dan een reeks tegelijk: de competitie, en
   daarnaast een beker (Beker van Limburg, Croky Cup) met een eigen kleine
   rangschikking. Voor "het klassement" nemen we de reeks waarin de ploeg de
   meeste wedstrijden speelt; dat is altijd de competitie. Een bekergroep
   wordt nooit als klassement getoond.

   De bond zet per reeks ook zelf een vlag of het klassement getoond mag
   worden. Voor de jongste jeugd (tot en met U13) staat die uit. Die vlag
   volgen we.
   ------------------------------------------------------------------------- */

const RBFA_SITE = "https://www.rbfa.be/nl";

/** Het RBFA-nummer van een ploeg, uit de kalender- of klassementlink. */
export function rbfaTeamId(links: (string | undefined)[]): string | null {
  for (const link of links) {
    const m = link?.match(/\/ploeg\/(\d+)\//);
    if (m) return m[1];
  }
  return null;
}

/** Een beker herken je aan de naam; die tonen we nooit als klassement. */
function isBeker(naam: string): boolean {
  return /\b(bvl|bek|beker|cup)\b/i.test(naam);
}

const SEIZOEN_QUERY = `query GetSeizoen($teamId: ID!, $language: Language!) {
  teamCalendar(teamId: $teamId, language: $language, sortByDate: asc) {
    id startTime state
    homeTeam { name clubId logo }
    awayTeam { name clubId logo }
    series { id name }
    location { name address city postalCode }
    outcome { status homeTeamGoals awayTeamGoals }
  }
}`;

export interface SeizoenWedstrijd {
  id: string;
  /** Als ISO-tekst, zodat het gewoon van de server naar de pagina kan. */
  start: string;
  thuisNaam: string;
  uitNaam: string;
  thuisLogo: string | null;
  uitLogo: string | null;
  /** Speelt onze ploeg thuis? */
  eigenThuis: boolean;
  reeks: string;
  reeksId: string;
  /** Hoort deze wedstrijd bij een beker? */
  beker: boolean;
  toestand: "gespeeld" | "gepland" | "uitgesteld" | "anders";
  thuisScore: number | null;
  uitScore: number | null;
  /** Vanuit onze ploeg bekeken: gewonnen, gelijk of verloren. */
  resultaat: "W" | "G" | "V" | null;
  veld: Speelveld | undefined;
}

/** Alle wedstrijden van een ploeg dit seizoen, met uitslag waar gespeeld. */
export async function getSeizoen(teamId: string): Promise<SeizoenWedstrijd[] | null> {
  try {
    const response = await fetch(RBFA_GRAPHQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: SEIZOEN_QUERY, variables: { teamId, language: "nl" } }),
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const json = await response.json();
    const lijst: {
      id: string;
      startTime: string | null;
      state: string;
      homeTeam: RbfaTeam | null;
      awayTeam: RbfaTeam | null;
      series: { id: string; name: string } | null;
      location: RbfaLocation | null;
      outcome: { status: string; homeTeamGoals: number | null; awayTeamGoals: number | null } | null;
    }[] = json?.data?.teamCalendar ?? [];

    return lijst
      .filter((m) => m.startTime && m.homeTeam?.name && m.awayTeam?.name)
      .map((m) => {
        const eigenThuis = m.homeTeam!.clubId === LINKHOUT_CLUB_ID;
        const gespeeld =
          m.state === "finished" && m.outcome?.homeTeamGoals != null && m.outcome?.awayTeamGoals != null;
        const thuisScore = gespeeld ? m.outcome!.homeTeamGoals : null;
        const uitScore = gespeeld ? m.outcome!.awayTeamGoals : null;
        let resultaat: SeizoenWedstrijd["resultaat"] = null;
        if (thuisScore != null && uitScore != null) {
          const wij = eigenThuis ? thuisScore : uitScore;
          const zij = eigenThuis ? uitScore : thuisScore;
          resultaat = wij > zij ? "W" : wij === zij ? "G" : "V";
        }
        const reeks = m.series?.name ?? "";
        const toestand: SeizoenWedstrijd["toestand"] = gespeeld
          ? "gespeeld"
          : m.state === "planned"
            ? "gepland"
            : m.state === "postponed"
              ? "uitgesteld"
              : "anders";
        return {
          id: m.id,
          start: brusselsNaarDate(m.startTime!).toISOString(),
          thuisNaam: m.homeTeam!.name,
          uitNaam: m.awayTeam!.name,
          thuisLogo: m.homeTeam!.logo,
          uitLogo: m.awayTeam!.logo,
          eigenThuis,
          reeks,
          reeksId: m.series?.id ?? "",
          beker: isBeker(reeks),
          toestand,
          thuisScore,
          uitScore,
          resultaat,
          veld: naarSpeelveld(m.location),
        };
      });
  } catch {
    return null;
  }
}

const KLASSEMENT_QUERY = `query GetKlassement($teamId: ID!, $language: Language!) {
  teamSeriesAndRankings(teamId: $teamId, language: $language) {
    rankings {
      id
      name
      visibility { showRanking }
      rankings {
        type
        teams {
          teamId name position clubId logo points
          matchesPlayed matchesWon matchesLost matchesDrawn
          goalsFor goalsAgainst goalDifference
        }
      }
    }
  }
}`;

export interface KlassementRij {
  teamId: string;
  naam: string;
  plaats: number;
  logo: string | null;
  punten: number;
  gespeeld: number;
  gewonnen: number;
  gelijk: number;
  verloren: number;
  doelsaldo: number;
  /** Is dit de ploeg van wiens pagina het klassement is? */
  wij: boolean;
}

export interface Klassement {
  reeks: string;
  /** Aantal ploegen in de reeks. */
  aantal: number;
  wij: KlassementRij;
  /** Deelt onze ploeg haar plaats met een of meer andere? */
  gedeeld: boolean;
  /** Vijf rijen rond onze ploeg: twee erboven en twee eronder, waar mogelijk. */
  venster: KlassementRij[];
  /** De rangschikking van deze reeks op de RBFA-site. */
  link: string;
}

type Rangschikking = {
  id: string;
  name: string;
  visibility: { showRanking: boolean } | null;
  rankings: {
    type: string;
    teams: {
      teamId: string;
      name: string;
      position: number;
      logo: string | null;
      points: number;
      matchesPlayed: number;
      matchesWon: number;
      matchesLost: number;
      matchesDrawn: number;
      goalDifference: number;
    }[];
  }[];
};

/**
 * Het klassement van de competitie van een ploeg, of null als er geen is of
 * het niet getoond mag worden. Faalt de RBFA, dan ook null: de pagina bouwt
 * dan gewoon zonder.
 *
 * Geef het seizoen mee als je het al hebt; dan wordt het niet twee keer
 * opgehaald.
 */
export async function getKlassement(
  teamId: string,
  seizoen?: SeizoenWedstrijd[] | null,
  venster = 5
): Promise<Klassement | null> {
  try {
    const [response, wedstrijden] = await Promise.all([
      fetch(RBFA_GRAPHQL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: KLASSEMENT_QUERY, variables: { teamId, language: "nl" } }),
        // Een stand verandert na een speeldag; een uur is ruim vers genoeg.
        next: { revalidate: 3600 },
      }),
      seizoen !== undefined ? Promise.resolve(seizoen) : getSeizoen(teamId),
    ]);
    if (!response.ok) return null;

    const json = await response.json();
    const rangschikkingen: Rangschikking[] = json?.data?.teamSeriesAndRankings?.rankings ?? [];

    // Hetzelfde klassement als de overzichtspagina van de ploeg op de
    // RBFA-site: de eerste reeks die de bond teruggeeft en mag tonen.
    void wedstrijden;
    const gekozen = rangschikkingen.find((r) => r.visibility?.showRanking);

    if (!gekozen?.visibility?.showRanking) return null;

    const algemeen = gekozen.rankings?.find((r) => r.type === "generalRanking");
    const ploegen = algemeen?.teams ?? [];
    if (ploegen.length === 0) return null;

    const rijen: KlassementRij[] = ploegen
      .map((p) => ({
        teamId: p.teamId,
        naam: p.name,
        plaats: p.position,
        logo: p.logo,
        punten: p.points,
        gespeeld: p.matchesPlayed,
        gewonnen: p.matchesWon,
        gelijk: p.matchesDrawn,
        verloren: p.matchesLost,
        doelsaldo: p.goalDifference,
        wij: p.teamId === teamId,
      }))
      .sort((a, b) => a.plaats - b.plaats);

    const i = rijen.findIndex((r) => r.wij);
    if (i < 0) return null;

    // Twee boven en twee onder; aan de rand van het klassement schuift het
    // venster mee, zodat er toch vijf rijen staan.
    const start = Math.max(0, Math.min(i - Math.floor(venster / 2), rijen.length - venster));

    return {
      reeks: gekozen.name.replace(/^Voetbal : Voetbal Vlaanderen - /, ""),
      aantal: rijen.length,
      wij: rijen[i],
      gedeeld: rijen.filter((r) => r.plaats === rijen[i].plaats).length > 1,
      venster: rijen.slice(start, start + venster),
      link: `${RBFA_SITE}/competitie/${gekozen.id}/rangschikking`,
    };
  } catch {
    return null;
  }
}
