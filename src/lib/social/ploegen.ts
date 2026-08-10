/**
 * Configuratie van de ploegen die een automatische matchday-post krijgen.
 *
 * Elke ploeg kan naar een eigen Facebook-pagina posten (de dames hebben een
 * aparte pagina). Ontbreekt de ploegspecifieke env-var, dan valt de post terug
 * op de hoofdpagina van de club.
 */

export type PloegSlug = "heren-p2" | "heren-p4" | "dames-p1" | "dames-p2";

export interface PloegConfig {
  slug: PloegSlug;
  /** Volledige naam zoals die in de mail en de goedkeuringspagina verschijnt. */
  naam: string;
  /** Korte aanduiding op de afbeelding, bv. "HEREN P2". */
  label: string;
  /** Reeks als terugval; normaal komt die per wedstrijd uit de RBFA-feed. */
  reeks: string;
  /** RBFA-ploeg-ID (seizoen 2026-2027). */
  rbfaTeamId: string;
  /** Leest eerst content/wedstrijden-*.json als override. */
  handmatigeBron?: string;
  /** Env-var met de Facebook-pagina-ID voor deze ploeg. */
  facebookPageEnv: string;
  /** Env-var met het Instagram-business-account-ID voor deze ploeg. */
  instagramAccountEnv: string;
  /**
   * Hoe onze eigen club in de post genoemd wordt. De RBFA-feed schrijft
   * "WS Linkhout A" of "WS Linkhout B"; zo willen we niet publiceren.
   */
  eigenNaam: string;
  hashtags: string[];
}

/** Herkent onze eigen club in een RBFA-teamnaam, met of zonder ploegletter. */
export const EIGEN_CLUB_PATROON = /^k?\.?\s*w\.?\s*s\.?\s*linkhout\b/i;

export const PLOEGEN: PloegConfig[] = [
  {
    slug: "heren-p2",
    naam: "Eerste ploeg heren",
    label: "HEREN P2",
    reeks: "2 Provinciaal Limburg B",
    rbfaTeamId: "365216",
    facebookPageEnv: "FB_PAGE_ID",
    instagramAccountEnv: "IG_ACCOUNT_ID",
    eigenNaam: "K.W.S. Linkhout",
    hashtags: ["#kwslinkhout", "#eersteploeg", "#provinciale2"],
  },
  {
    slug: "heren-p4",
    naam: "Tweede ploeg heren",
    label: "HEREN P4",
    reeks: "4 Provinciaal Limburg B",
    rbfaTeamId: "365215",
    facebookPageEnv: "FB_PAGE_ID",
    instagramAccountEnv: "IG_ACCOUNT_ID",
    eigenNaam: "K.W.S. Linkhout B",
    hashtags: ["#kwslinkhout", "#tweedeploeg", "#provinciale4"],
  },
  {
    slug: "dames-p1",
    naam: "Eerste ploeg dames",
    label: "DAMES P1",
    reeks: "Vrouwen 1 Provinciaal Limburg",
    rbfaTeamId: "365217",
    handmatigeBron: "wedstrijden-dames-2025-2026.json",
    facebookPageEnv: "FB_PAGE_ID_DAMES",
    instagramAccountEnv: "IG_ACCOUNT_ID_DAMES",
    eigenNaam: "K.W.S. Linkhout Ladies",
    hashtags: ["#kwslinkhout", "#kwsladies", "#damesvoetbal"],
  },
  {
    slug: "dames-p2",
    naam: "Tweede ploeg dames",
    label: "DAMES P2",
    reeks: "Vrouwen 2 Provinciaal Limburg",
    rbfaTeamId: "372245",
    facebookPageEnv: "FB_PAGE_ID_DAMES",
    instagramAccountEnv: "IG_ACCOUNT_ID_DAMES",
    eigenNaam: "K.W.S. Linkhout Ladies B",
    hashtags: ["#kwslinkhout", "#kwsladies", "#damesvoetbal"],
  },
];

export function getPloeg(slug: string): PloegConfig | undefined {
  return PLOEGEN.find((p) => p.slug === slug);
}

/**
 * Ploegen die effectief geconfigureerd zijn om te posten. Een ploeg zonder
 * pagina-ID in de omgeving wordt stil overgeslagen, zodat je gefaseerd kan
 * uitrollen (bv. eerst enkel de eerste ploeg).
 */
export function actievePloegen(): PloegConfig[] {
  return PLOEGEN.filter(
    (p) => process.env[p.facebookPageEnv] || process.env[p.instagramAccountEnv]
  );
}
