import { getRbfaUitslagen, type Doelpunt } from "@/lib/rbfa";
import { getTemplate, renderRegels } from "./template";
import { formatteerDatum, formatteerKort, EIGEN_LOGO_PAD } from "./matchday";
import { EIGEN_CLUB_PATROON, type PloegConfig } from "./ploegen";

/**
 * De post na de wedstrijd: eindstand en doelpuntenmakers.
 *
 * Let op de timing. De RBFA publiceert deze gegevens pas nadat het digitale
 * wedstrijdblad ingediend en gevalideerd is. Dat gebeurt meestal binnen enkele
 * uren, maar soms pas de dag erna. Daarom controleren we altijd of de
 * gegevens er echt zijn voor we een voorstel maken.
 */

export interface Uitslag {
  ploeg: PloegConfig;
  aftrapIso: string;
  aftrap: Date;
  thuisploeg: string;
  uitploeg: string;
  thuisScore: number;
  uitScore: number;
  isThuis: boolean;
  /** Het terrein waar gespeeld is, los uitgesplitst voor op de affiche. */
  veld?: { naam: string; straat: string; gemeente: string };
  thuisLogo?: string;
  uitLogo?: string;
  reeks: string;
  doelpunten: Doelpunt[];
  resultaat: "winst" | "gelijk" | "verlies";
  caption: string;
}

/** Schrijft een spelersnaam zoals op de affiche: "GEYBELS MIKE". */
function affichNaam(speler: string): string {
  const delen = speler.trim().split(/\s+/);
  if (delen.length < 2) return speler.toUpperCase();
  const voornaam = delen[0];
  const achternaam = delen.slice(1).join(" ");
  return `${achternaam} ${voornaam}`.toUpperCase();
}

/** "14' Peremans Pieter, 38' Geybels Mike (pen.)" */
export function formatteerDoelpuntenmakers(
  doelpunten: Doelpunt[],
  eigenThuis: boolean
): string {
  return doelpunten
    .filter((d) => d.thuis === eigenThuis)
    .map((d) => {
      const extra =
        d.soort === "penalty" ? " (pen.)" : d.soort === "own_goal" ? " (eigen doel)" : "";
      return `${d.minuut}' ${d.speler}${extra}`;
    })
    .join(", ");
}

/**
 * Bouwt de uitslagpost voor de laatst gespeelde wedstrijd van een ploeg.
 *
 * Geeft null terug als er geen afgewerkte wedstrijd is binnen `binnenDagen`,
 * of als de RBFA nog geen enkel doelpunt-event doorgaf terwijl de stand niet
 * 0-0 kan zijn. Dat laatste voorkomt dat we een 0-0 posten terwijl het
 * wedstrijdblad simpelweg nog niet verwerkt is.
 */
export async function bouwUitslag(
  ploeg: PloegConfig,
  binnenDagen = 3
): Promise<Uitslag | null> {
  const uitslagen = await getRbfaUitslagen(ploeg.rbfaTeamId);
  const laatste = uitslagen[0];
  if (!laatste) return null;

  const dagenGeleden = (Date.now() - laatste.start.getTime()) / 86_400_000;
  if (dagenGeleden < 0 || dagenGeleden > binnenDagen) return null;

  const eigenIsThuis = EIGEN_CLUB_PATROON.test(laatste.thuisNaam);
  const eigenIsUit = EIGEN_CLUB_PATROON.test(laatste.uitNaam);

  const thuisploeg = eigenIsThuis ? ploeg.eigenNaam : laatste.thuisNaam;
  const uitploeg = eigenIsUit ? ploeg.eigenNaam : laatste.uitNaam;

  const eigenScore = laatste.eigenThuis ? laatste.thuisScore : laatste.uitScore;
  const tegenScore = laatste.eigenThuis ? laatste.uitScore : laatste.thuisScore;
  const resultaat =
    eigenScore > tegenScore ? "winst" : eigenScore === tegenScore ? "gelijk" : "verlies";

  const template = getTemplate();
  const kort = formatteerKort(laatste.start);
  const doelpuntenmakers = formatteerDoelpuntenmakers(
    laatste.doelpunten,
    laatste.eigenThuis
  );

  const caption = renderRegels(template.uitslag[resultaat], {
    ploeg: ploeg.naam,
    label: ploeg.label,
    reeks: laatste.reeks ?? ploeg.reeks,
    thuisploeg,
    uitploeg,
    thuisScore: String(laatste.thuisScore),
    uitScore: String(laatste.uitScore),
    uitslag: `${laatste.thuisScore} - ${laatste.uitScore}`,
    doelpuntenmakers,
    resultaat,
    datum: formatteerDatum(laatste.start),
    datumKort: kort.datum,
    tijd: kort.tijd,
    hashtags: ploeg.hashtags.join(" "),
  });

  return {
    ploeg,
    aftrapIso: laatste.start.toISOString(),
    aftrap: laatste.start,
    thuisploeg,
    uitploeg,
    thuisScore: laatste.thuisScore,
    uitScore: laatste.uitScore,
    isThuis: laatste.eigenThuis,
    veld: laatste.veld,
    thuisLogo: eigenIsThuis ? EIGEN_LOGO_PAD : laatste.thuisLogo,
    uitLogo: eigenIsUit ? EIGEN_LOGO_PAD : laatste.uitLogo,
    reeks: laatste.reeks ?? ploeg.reeks,
    doelpunten: laatste.doelpunten,
    resultaat,
    caption,
  };
}

/**
 * Doelpuntenmakers zoals ze op de afbeelding staan, per kant gescheiden.
 * Voorbeeld: [{ minuut: 14, naam: "PEREMANS PIETER" }]
 */
export function afficheDoelpunten(uitslag: Uitslag, thuis: boolean) {
  return uitslag.doelpunten
    .filter((d) => d.thuis === thuis)
    .map((d) => ({ minuut: `${d.minuut}'`, naam: affichNaam(d.speler) }));
}
