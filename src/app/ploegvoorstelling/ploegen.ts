import { teams } from "@/lib/teams";

/**
 * De ploegen van de ploegvoorstelling 2026-2027, in de volgorde van de pagina:
 * van de allerkleinsten naar de oudsten, de meisjesploegen erachter, en
 * helemaal onderaan de senioren.
 *
 * Eén foto kan voor twee ploegen staan (de U7 A en de U7 B staan samen op de
 * foto). Reeks en trainers komen uit lib/teams.ts, zodat ze hier niet apart
 * bijgehouden moeten worden.
 */

export const SEIZOEN = "2026-2027";
export const GROEPSFOTO = "/images/teams/alle-jeugd-2026-2027.jpg";

interface Opstelling {
  /** Sleutel en anker op de pagina; ook de knop in de springbalk. */
  code: string;
  naam: string;
  slugs: string[];
  /** De tekst op de knop in de springbalk, als die anders is dan de code. */
  kort?: string;
  /** De reuzenletters achter de foto, als die anders zijn dan de code. */
  letters?: string;
  /** Het opschrift boven de naam, bv. welke ploegen samen op de foto staan. */
  opschrift?: string;
  /** Een eigen foto; anders `<code>-<seizoen>.jpg`. */
  foto?: string;
  /** Breedte gedeeld door hoogte van die foto; anders 3/2. */
  verhouding?: number;
  senior?: boolean;
}

const OPSTELLING: Opstelling[] = [
  { code: "U6", naam: "De allerkleinsten", slugs: ["u6"] },
  { code: "U7", naam: "U7", slugs: ["u7-a", "u7-b"] },
  { code: "U8", naam: "U8", slugs: ["u8-a", "u8-b"] },
  { code: "U9", naam: "U9", slugs: ["u9-a", "u9-b"] },
  { code: "U10", naam: "U10", slugs: ["u10"] },
  { code: "U11", naam: "U11", slugs: ["u11"] },
  { code: "U12", naam: "U12", slugs: ["u12"] },
  { code: "U13", naam: "U13", slugs: ["u13"] },
  { code: "U15", naam: "U15", slugs: ["u15"] },
  { code: "U17", naam: "U17", slugs: ["u17-a", "u17-b"] },
  { code: "WU8", naam: "Meisjes U8", slugs: ["women-u8"] },
  { code: "WU10", naam: "Meisjes U10", slugs: ["women-u10"] },
  { code: "WU20", naam: "Meisjes U20", slugs: ["women-u20"] },

  // De senioren, onderaan. De P2, de P4 en de beloften staan samen op een
  // foto en krijgen dus samen een affiche. De seniorenfoto's hebben elk hun
  // eigen verhouding; die van de heren is twee keer zo breed als hoog.
  {
    code: "Heren",
    naam: "Heren",
    opschrift: "P2 · P4 · Beloften",
    slugs: ["eerste-ploeg", "recrea-mannen", "reserven"],
    foto: "/images/teams/P2-P4.jpeg",
    verhouding: 2048 / 1010,
    senior: true,
  },
  {
    code: "DamesP1",
    kort: "Dames P1",
    letters: "P1",
    naam: "Dames P1",
    opschrift: "Dames",
    slugs: ["eerste-ploeg-dames"],
    foto: "/images/teams/dames-P1-2026.jpg",
    verhouding: 3595 / 2610,
    senior: true,
  },
  {
    code: "DamesP2",
    kort: "Dames P2",
    letters: "P2",
    naam: "Dames P2",
    opschrift: "Dames",
    slugs: ["tweede-ploeg-dames"],
    foto: "/images/teams/dames-P2-2026.jpg",
    verhouding: 4177 / 2262,
    senior: true,
  },
  {
    code: "Recrea",
    naam: "Recrea Vrouwen",
    opschrift: "Dames",
    slugs: ["recrea-vrouwen"],
    foto: "/images/teams/Recrea Dames.jpeg",
    verhouding: 1600 / 1079,
    senior: true,
  },
];

export interface VoorstellingPloeg {
  code: string;
  kort: string;
  letters: string;
  opschrift: string;
  naam: string;
  foto: string;
  verhouding: number;
  senior: boolean;
  /** De reeksen waarin gespeeld wordt, zonder dubbels. */
  reeksen: string[];
  trainers: string[];
  /** De ploegpagina's die bij deze foto horen. */
  paginas: { slug: string; naam: string }[];
}

export const PLOEGEN: VoorstellingPloeg[] = OPSTELLING.map((p) => {
  const bij = p.slugs
    .map((s) => teams.find((t) => t.slug === s))
    .filter((t) => t !== undefined);
  const uniek = (lijst: (string | undefined)[]) => [
    ...new Set(lijst.map((x) => (x ?? "").trim()).filter(Boolean)),
  ];
  return {
    code: p.code,
    kort: p.kort ?? p.code,
    letters: p.letters ?? p.code,
    // Bij "U7" zou de code twee keer boven elkaar staan; dan zegt het
    // opschrift wat voor ploeg het is.
    opschrift: p.opschrift ?? (p.naam === p.code ? "Jeugdploeg" : p.code),
    naam: p.naam,
    foto: p.foto ?? `/images/teams/${p.code}-${SEIZOEN}.jpg`,
    verhouding: p.verhouding ?? 3 / 2,
    senior: p.senior === true,
    reeksen: uniek(bij.map((t) => t.division)),
    trainers: uniek(bij.flatMap((t) => [t.coach, t.assistantCoach])),
    paginas: bij.map((t) => ({ slug: t.slug, naam: t.name })),
  };
});

/** Hoeveel ploegen er in totaal op de foto's staan (de U7 A en B tellen voor twee). */
export const AANTAL_PLOEGEN = PLOEGEN.reduce(
  (som, p) => som + p.paginas.length,
  0,
);
