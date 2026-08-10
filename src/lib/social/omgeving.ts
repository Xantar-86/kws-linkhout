import type { PloegConfig } from "./ploegen";

/**
 * Basis-URL van de site. Instagram haalt de afbeelding zelf op, dus dit moet
 * een publiek bereikbaar adres zijn, geen localhost of preview-omgeving.
 */
export function siteUrl(): string {
  return (
    process.env.SITE_URL ??
    // Vercel zet VERCEL_PROJECT_PRODUCTION_URL automatisch op het
    // productiedomein; VERCEL_URL wijst naar de huidige deployment.
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ??
    "https://www.kwslinkhout.be"
  ).replace(/\/$/, "");
}

export interface PloegDoelen {
  facebookPageId?: string;
  instagramAccountId?: string;
  pageToken?: string;
}

/**
 * Haalt de doelen voor een ploeg uit de omgeving. Elke ploeg kan een eigen
 * pagina en een eigen token hebben (de dames posten op een aparte pagina);
 * ontbreekt het ploegspecifieke token, dan valt hij terug op het algemene.
 */
export function doelenVoor(ploeg: PloegConfig): PloegDoelen {
  const tokenEnv = `FB_PAGE_TOKEN_${ploeg.slug.toUpperCase()}`;
  return {
    facebookPageId: process.env[ploeg.facebookPageEnv],
    instagramAccountId: process.env[ploeg.instagramAccountEnv],
    pageToken: process.env[tokenEnv] ?? process.env.FB_PAGE_TOKEN,
  };
}

/** Controleert het gedeelde geheim waarmee de cron zich aanmeldt. */
export function cronGeautoriseerd(headerWaarde: string | null): boolean {
  const verwacht = process.env.CRON_SECRET;
  if (!verwacht) return false;
  return headerWaarde === `Bearer ${verwacht}`;
}
