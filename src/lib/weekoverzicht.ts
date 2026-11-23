/**
 * Het weekoverzicht voor sociale media: alle wedstrijden van alle ploegen in
 * één week, als afbeelding en als tekst.
 *
 * De gegevens komen van de RBFA, opgehaald in de browser (de bond laat sinds
 * oktober 2026 geen aanvragen van onze server meer toe). Dit bestand bevat
 * enkel het rekenwerk; het ophalen en tekenen gebeurt op de pagina
 * /matchday/weekoverzicht.
 */

import { teams } from "@/lib/teams";
import { rbfaTeamId, type SeizoenWedstrijd } from "@/lib/rbfa";

export const DAGEN = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
export const MAANDEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

/** Een ploeg die op het overzicht kan komen. */
export interface OverzichtPloeg {
  slug: string;
  /** Korte naam op de afbeelding, bv. "U12" of "1ste Ploeg P2". */
  label: string;
  rbfaId: string;
  /** Volgorde binnen hetzelfde aftrapuur: senioren eerst, dan jeugd. */
  volgorde: number;
}

/** Kortere namen voor op de afbeelding, waar de ploegkolom smal is. */
const KORTE_NAAM: Record<string, string> = {
  "1ste Ploeg P2": "Heren P2",
  "2de Ploeg P4": "Heren P4",
  "Dames 1ste Ploeg P1": "Dames P1",
  "Dames 2de Ploeg P2": "Dames P2",
};

/** Alle ploegen met een RBFA-kalender, in de volgorde van teams.ts. */
export function overzichtPloegen(): OverzichtPloeg[] {
  const lijst: OverzichtPloeg[] = [];
  teams.forEach((team, i) => {
    const id = rbfaTeamId([team.calendarIframe, team.standingsIframe]);
    if (!id) return;
    lijst.push({ slug: team.slug, label: KORTE_NAAM[team.name] ?? team.name, rbfaId: id, volgorde: i });
  });
  return lijst;
}

export interface OverzichtWedstrijd {
  id: string;
  start: Date;
  /** Eén of meer ploegen; twee als onze eigen ploegen tegen elkaar spelen. */
  ploeg: string;
  volgorde: number;
  thuis: string;
  uit: string;
  eigenThuis: boolean;
  uitgesteld: boolean;
  /** Naam van het terrein, enkel ingevuld als het niet Linkwood Park is. */
  anderVeld?: string;
}

/** Herkent onze eigen club in een RBFA-naam, met of zonder ploegletter. */
const EIGEN_CLUB = /^k?\.?\s*w\.?\s*s\.?\s*linkhout\b\s*(.*)$/i;

/** "W.S. Linkhout A" wordt "KWS Linkhout A". Andere clubs blijven zoals ze zijn. */
export function toonNaam(naam: string): string {
  // De bond hangt bij jeugdreeksen een volgnummer achter de ploeg ("Lummen 1",
  // "Tessenderlo E 2-1"). Dat leest als een uitslag, dus het gaat eraf.
  const schoon = naam.trim().replace(/\s+\d+(-\d+)?$/, "");
  const m = schoon.match(EIGEN_CLUB);
  if (!m) return schoon;
  return `KWS Linkhout${m[1] ? ` ${m[1].trim()}` : ""}`;
}

export function isEigenClub(naam: string): boolean {
  return EIGEN_CLUB.test(naam.trim());
}

/**
 * De week rond een datum: maandag 00:00 tot en met zondag 23:59, zodat ook
 * bekermatchen en inhaalwedstrijden in de week erin staan. Rekent in de
 * tijdzone van de browser, en die staat in België.
 */
export function weekVan(datum: Date): { van: Date; tot: Date } {
  const d = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
  const dag = d.getDay(); // 0 = zondag
  const naarMaandag = dag === 0 ? -6 : 1 - dag;
  const van = new Date(d);
  van.setDate(d.getDate() + naarMaandag);
  const tot = new Date(van);
  tot.setDate(van.getDate() + 7); // volgende maandag 00:00, exclusief
  return { van, tot };
}

/** Voegt de seizoenen van alle ploegen samen tot de wedstrijden van één week. */
export function wedstrijdenInWeek(
  perPloeg: { ploeg: OverzichtPloeg; seizoen: SeizoenWedstrijd[] }[],
  van: Date,
  tot: Date
): OverzichtWedstrijd[] {
  const opId = new Map<string, OverzichtWedstrijd>();

  for (const { ploeg, seizoen } of perPloeg) {
    for (const w of seizoen) {
      const start = new Date(w.start);
      if (start < van || start >= tot) continue;
      if (w.toestand === "anders") continue;

      const bestaand = opId.get(w.id);
      if (bestaand) {
        // Twee eigen ploegen tegen elkaar: één rij, beide ploegnamen.
        if (!bestaand.ploeg.split(" / ").includes(ploeg.label)) {
          bestaand.ploeg = `${bestaand.ploeg} / ${ploeg.label}`;
        }
        continue;
      }

      const veld = w.veld?.naam;
      opId.set(w.id, {
        id: w.id,
        start,
        ploeg: ploeg.label,
        volgorde: ploeg.volgorde,
        thuis: toonNaam(w.thuisNaam),
        uit: toonNaam(w.uitNaam),
        eigenThuis: w.eigenThuis,
        uitgesteld: w.toestand === "uitgesteld",
        anderVeld: w.eigenThuis && veld && veld !== "Linkwood Park" ? veld : undefined,
      });
    }
  }

  return [...opId.values()].sort(
    (a, b) => a.start.getTime() - b.start.getTime() || a.volgorde - b.volgorde
  );
}

export function uur(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** "zaterdag 14 november" */
export function dagTitel(d: Date): string {
  return `${DAGEN[d.getDay()]} ${d.getDate()} ${MAANDEN[d.getMonth()]}`;
}

/** Sleutel per kalenderdag, om te groeperen. */
export function dagSleutel(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Wedstrijden per dag, in volgorde. */
export function perDag(lijst: OverzichtWedstrijd[]): { dag: Date; wedstrijden: OverzichtWedstrijd[] }[] {
  const groepen: { dag: Date; wedstrijden: OverzichtWedstrijd[] }[] = [];
  for (const w of lijst) {
    const laatste = groepen[groepen.length - 1];
    if (laatste && dagSleutel(laatste.dag) === dagSleutel(w.start)) laatste.wedstrijden.push(w);
    else groepen.push({ dag: w.start, wedstrijden: [w] });
  }
  return groepen;
}

/** "16 tot 22 november" of "30 november tot 6 december" */
export function weekTitel(van: Date): string {
  const zon = new Date(van);
  zon.setDate(van.getDate() + 6);
  const begin = zon.getMonth() === van.getMonth() ? `${van.getDate()}` : `${van.getDate()} ${MAANDEN[van.getMonth()]}`;
  return `${begin} tot ${zon.getDate()} ${MAANDEN[zon.getMonth()]}`;
}

/**
 * De tekst bij de post, voor Facebook en Instagram. Kort: de wedstrijden zelf
 * staan al op het beeld (zo wou Jochen het, 23/11).
 */
export function bouwTekst(lijst: OverzichtWedstrijd[], van: Date): string {
  const aantal = lijst.filter((w) => !w.uitgesteld).length;
  return [
    "⚽ WEDSTRIJDEN DEZE WEEK 🔴⚪",
    "",
    `Van ${weekTitel(van)} spelen onze ploegen ${aantal === 1 ? "1 wedstrijd" : `${aantal} wedstrijden`}. ` +
      "Alle uren en tegenstanders staan op de affiche. Kom supporteren, thuis in Linkwood Park of op verplaatsing!",
    "",
    "📍 Linkwood Park, Kapelstraat 72, Linkhout",
    "",
    "#kwslinkhout #jeugdvoetbal #matchday #linkhout",
  ].join("\n");
}

/** Een opdracht om in ChatGPT te plakken, voor wie een sfeervollere affiche wil. */
export function bouwChatGptOpdracht(lijst: OverzichtWedstrijd[], van: Date): string {
  const rijen: string[] = [];
  for (const { dag, wedstrijden } of perDag(lijst)) {
    rijen.push(dagTitel(dag).toUpperCase());
    for (const w of wedstrijden) {
      const waar = w.uitgesteld ? "UITGESTELD" : w.eigenThuis ? "THUIS" : "UIT";
      rijen.push(`${uur(w.start)} | ${w.ploeg} | ${w.thuis} vs ${w.uit} | ${waar}`);
    }
  }

  return [
    "Maak een staande affiche voor Instagram en Facebook (1080 x 1350 pixels) voor voetbalclub KWS Linkhout.",
    "",
    `Titel: WEDSTRIJDEN DEZE WEEK. Ondertitel: VAN ${weekTitel(van).toUpperCase()}.`,
    "Stijl: sportief en krachtig, clubkleuren rood (#9e1b1b) en wit op een donkere achtergrond, stadionlichten op de achtergrond, het clublogo in de bijlage bovenaan.",
    "Daaronder per dag een balk met de dag, en per wedstrijd een rij met: aftrapuur, ploeg, thuisploeg vs uitploeg, en een label THUIS of UIT.",
    "Onderaan: kwslinkhout.be",
    "",
    "Neem de gegevens hieronder letterlijk over, met exact dezelfde uren en namen. Laat niets weg en verzin niets bij:",
    "",
    ...rijen,
  ].join("\n");
}
