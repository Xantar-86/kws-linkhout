import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'kwslinkhout.be' }],
        destination: 'https://www.kwslinkhout.be/:path*',
        permanent: true,
      },
      // Een kortere verwijzing om door te geven of op een affiche te zetten.
      // Hoofdletters staan erbij omdat iemand die de link overtypt van een
      // blad niet met kleine letters bezig is; webadressen zijn hoofdletter-
      // gevoelig en zonder deze varianten kom je op een foutmelding uit.
      //
      // Tijdelijk en niet blijvend: een browser onthoudt een blijvende
      // doorverwijzing zo hardnekkig dat je ze later niet meer weg krijgt bij
      // wie ze een keer gevolgd heeft.
      {
        source:
          '/:kort(mutualiteit|Mutualiteit|kws-mutualiteit|KWS-Mutualiteit|Kws-Mutualiteit|KWS-mutualiteit)',
        destination: '/documenten-mutualiteit',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      // Het CMS en de interne matchday-schermen horen niet in een
      // zoekresultaat. robots.txt vraagt het al vriendelijk; deze kop is de
      // afspraak die ook geldt als iemand er toch naartoe linkt.
      {
        source: '/admin/:pad*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/matchday/:pad*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
