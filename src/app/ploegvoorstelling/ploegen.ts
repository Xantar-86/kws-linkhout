import { teams } from "@/lib/teams";

/**
 * De ploegen van de ploegvoorstelling 2026-2027, in de volgorde van de pagina:
 * van de allerkleinsten naar de oudsten, de meisjesploegen erachter.
 *
 * Eén foto kan voor twee ploegen staan (de U7 A en de U7 B staan samen op de
 * foto). Reeks en trainers komen uit lib/teams.ts, zodat ze hier niet apart
 * bijgehouden moeten worden.
 */

export const SEIZOEN = "2026-2027";
export const GROEPSFOTO = "/images/teams/alle-jeugd-2026-2027.jpg";

const OPSTELLING: { code: string; naam: string; slugs: string[] }[] = [
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
];

export interface VoorstellingPloeg {
  code: string;
  naam: string;
  foto: string;
  /** De reeksen waarin gespeeld wordt, zonder dubbels. */
  reeksen: string[];
  trainers: string[];
  /** De ploegpagina's die bij deze foto horen. */
  paginas: { slug: string; naam: string }[];
}

export const PLOEGEN: VoorstellingPloeg[] = OPSTELLING.map((p) => {
  const bij = p.slugs.map((s) => teams.find((t) => t.slug === s)).filter((t) => t !== undefined);
  const uniek = (lijst: (string | undefined)[]) =>
    [...new Set(lijst.map((x) => (x ?? "").trim()).filter(Boolean))];
  return {
    code: p.code,
    naam: p.naam,
    foto: `/images/teams/${p.code}-${SEIZOEN}.jpg`,
    reeksen: uniek(bij.map((t) => t.division)),
    trainers: uniek(bij.flatMap((t) => [t.coach, t.assistantCoach])),
    paginas: bij.map((t) => ({ slug: t.slug, naam: t.name })),
  };
});
