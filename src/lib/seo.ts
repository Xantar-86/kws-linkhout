/**
 * Open Graph voor een gewone pagina.
 *
 * Zet een pagina geen openGraph, dan neemt Next het hele blok van de layout
 * over, met de titel en de beschrijving van de startpagina erbij. Wie dan een
 * link naar /contact deelt, ziet "Voetbalclub in Lummen sinds 1938" staan.
 *
 * Met dit blok krijgt de pagina haar eigen titel en beschrijving mee (Next
 * vult die in uit de metadata van de pagina zelf), en blijft de ploegfoto van
 * de club als beeld staan.
 */
export const OG_BEELD = {
  url: "https://www.kwslinkhout.be/images/teams/1ste-ploeg-2025.jpg",
  width: 1200,
  height: 800,
  alt: "De eerste ploeg van KWS Linkhout",
};

export function ogVoor(pad: string, beeld?: string) {
  return {
    type: "website" as const,
    locale: "nl_BE",
    siteName: "KWS Linkhout",
    url: `https://www.kwslinkhout.be${pad}`,
    images: [beeld ? { url: `https://www.kwslinkhout.be${beeld}` } : OG_BEELD],
  };
}
