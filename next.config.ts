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
      // De ploegen hadden een adres met een vraagteken (/ploegen/team?slug=u9-a).
      // Nu heeft elke ploeg een eigen pad; wie de oude link nog heeft, komt
      // blijvend op het nieuwe uit. Zonder slug: naar het overzicht.
      {
        source: '/ploegen/team',
        has: [{ type: 'query', key: 'slug', value: '(?<slug>[a-z0-9-]+)' }],
        destination: '/ploegen/:slug',
        permanent: true,
      },
      { source: '/ploegen/team', destination: '/ploegen', permanent: true },
      // Zelfde verhaal voor de clubinfo-secties.
      {
        source: '/clubinfo/sectie',
        has: [{ type: 'query', key: 'slug', value: '(?<slug>[a-z0-9-]+)' }],
        destination: '/clubinfo/:slug',
        permanent: true,
      },
      { source: '/clubinfo/sectie', destination: '/clubinfo', permanent: true },
      // En voor de nieuwsartikels.
      {
        source: '/nieuws/artikel',
        has: [{ type: 'query', key: 'slug', value: '(?<slug>[a-z0-9-]+)' }],
        destination: '/nieuws/:slug',
        permanent: true,
      },
      { source: '/nieuws/artikel', destination: '/nieuws', permanent: true },
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
