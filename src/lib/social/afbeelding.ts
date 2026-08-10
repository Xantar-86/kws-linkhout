import { tekenParams } from "./handtekening";
import { formatteerKort, type Matchday } from "./matchday";
import { afficheDoelpunten, type Uitslag } from "./uitslag";

/**
 * Bouwt de ondertekende, publiek bereikbare URL van de matchday-affiche.
 * Instagram vereist zo'n URL: het platform haalt de afbeelding zelf op bij het
 * publiceren, dus een lokaal bestand of een beveiligde route werkt niet.
 */

const VELD_NAAM = "Linkwood Park";
const VELD_ADRES = "Kapelstraat 72, 3560 Linkhout";

/** "14|PEREMANS PIETER;38|GEYBELS MIKE" */
function schrijfDoelpunten(lijst: { minuut: string; naam: string }[]): string {
  return lijst
    .map((d) => `${d.minuut.replace("'", "")}|${d.naam}`)
    .join(";");
}

/** Affiche voor de aankondiging van de volgende wedstrijd. */
export function bouwAfbeeldingUrl(matchday: Matchday, origin: string): string {
  const kort = formatteerKort(matchday.aftrap);
  const params = new URLSearchParams({
    soort: "wedstrijd",
    thuisploeg: matchday.thuisploeg,
    uitploeg: matchday.uitploeg,
    thuisLogo: matchday.thuisLogo ?? "",
    uitLogo: matchday.uitLogo ?? "",
    weekdag: kort.weekdagKort,
    dag: kort.dagNummer,
    maand: kort.maandKort,
    tijd: kort.tijd,
    label: matchday.ploeg.label,
    veldNaam: matchday.isThuis ? VELD_NAAM : "",
    // Bij een uitwedstrijd kennen we het adres van de tegenstander niet, dus
    // laten we die regel weg in plaats van ons eigen adres te tonen.
    veldAdres: matchday.isThuis ? VELD_ADRES : "",
  });
  return `${origin}/api/social/matchday-image?${tekenParams(params).toString()}`;
}

/** Affiche voor de uitslag, met de doelpuntenmakers per kant. */
export function bouwUitslagAfbeeldingUrl(uitslag: Uitslag, origin: string): string {
  const params = new URLSearchParams({
    soort: "uitslag",
    thuisploeg: uitslag.thuisploeg,
    uitploeg: uitslag.uitploeg,
    thuisLogo: uitslag.thuisLogo ?? "",
    uitLogo: uitslag.uitLogo ?? "",
    thuisScore: String(uitslag.thuisScore),
    uitScore: String(uitslag.uitScore),
    scorersThuis: schrijfDoelpunten(afficheDoelpunten(uitslag, true)),
    scorersUit: schrijfDoelpunten(afficheDoelpunten(uitslag, false)),
    label: uitslag.ploeg.label,
    veldNaam: uitslag.isThuis ? VELD_NAAM : "",
    veldAdres: uitslag.isThuis ? VELD_ADRES : "",
  });
  return `${origin}/api/social/matchday-image?${tekenParams(params).toString()}`;
}

/**
 * Terugvalafbeelding als de generator faalt. Instagram weigert een post zonder
 * afbeelding, dus we posten liever het clublogo dan niets.
 */
export function fallbackAfbeeldingUrl(origin: string): string {
  return `${origin}/images/logo-kws.png`;
}
