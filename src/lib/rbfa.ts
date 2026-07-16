import type { WedstrijdEvent } from "@/types";

const RBFA_GRAPHQL = "https://datalake-prod2018.rbfa.be/graphql";
const LINKHOUT_CLUB_ID = "1595";

const TEAM_CALENDAR_QUERY = `query GetTeamCalendar($teamId: ID!, $language: Language!, $sortByDate: SortDirection) {
  teamCalendar(teamId: $teamId, language: $language, sortByDate: $sortByDate) {
    startTime
    homeTeam { name clubId }
    awayTeam { name clubId }
    series { name }
  }
}`;

interface RbfaTeam {
  name: string;
  clubId: string;
}

interface RbfaMatch {
  startTime: string | null;
  homeTeam: RbfaTeam | null;
  awayTeam: RbfaTeam | null;
  series: { name: string } | null;
}

/**
 * RBFA levert aftraptijden als Brusselse wandkloktijd zonder tijdzone
 * (bv. "2026-07-22T20:00:00"). Zet dat om naar het juiste absolute instant,
 * onafhankelijk van de tijdzone waarin de server draait (Netlify = UTC).
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
      return {
        summary: `${m.homeTeam!.name} - ${m.awayTeam!.name}`,
        start: brusselsNaarDate(m.startTime!),
        location: "",
        description: thuis ? "Thuiswedstrijd" : "Uitwedstrijd",
      };
    });
}
