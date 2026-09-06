import type { MetadataRoute } from "next";

/**
 * robots.txt, gemaakt bij de build.
 *
 * Stond er tot nu toe niet: /robots.txt gaf een 404. Zonder dit bestand vindt
 * een zoekmachine wel de weg, maar krijgt ze geen enkele aanwijzing over wat
 * er niet in de index hoort, en vindt ze de sitemap alleen als iemand die met
 * de hand indient.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Het CMS en het aanmeldscherm erachter.
          "/admin",
          // De interne schermen voor de matchday-berichten.
          "/matchday/",
          // Een oude proefopstelling die nooit is opgeruimd.
          "/nieuws-test/",
          // Antwoorden van de server, geen pagina's.
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.kwslinkhout.be/sitemap.xml",
    host: "https://www.kwslinkhout.be",
  };
}
