import type { WedstrijdEvent } from "@/types";
import { getRbfaWedstrijden } from "@/lib/rbfa";
import { getToekomstigeWedstrijden } from "@/lib/ics-parser";
import { getHandmatigeWedstrijden, handmatigeNaarEvents } from "@/lib/wedstrijden-handmatig";
import { getTemplate, renderRegels } from "./template";
import { EIGEN_CLUB_PATROON, type PloegConfig } from "./ploegen";

/** Thuisadres van de club, gebruikt als locatie bij thuiswedstrijden. */
const THUISADRES = "Kapelstraat 72, 3560 Linkhout";

export interface Matchday {
  ploeg: PloegConfig;
  /** ISO-string van de aftrap, dient ook als identificatie van de wedstrijd. */
  aftrapIso: string;
  aftrap: Date;
  thuisploeg: string;
  uitploeg: string;
  tegenstander: string;
  isThuis: boolean;
  locatie: string;
  /** Het terrein van deze wedstrijd, los uitgesplitst voor op de affiche. */
  veld?: { naam: string; straat: string; gemeente: string };
  /** Clublogo's zoals de RBFA ze aanlevert. Ontbreken kan. */
  thuisLogo?: string;
  uitLogo?: string;
  /** Reeks van deze specifieke wedstrijd; bij beker wijkt die af van de competitie. */
  reeks: string;
  /** Kant-en-klare tekst voor Facebook en Instagram. */
  caption: string;
}

/** Ons eigen clublogo. Het RBFA-logo is een lage-resolutie JPG met witte rand. */
export const EIGEN_LOGO_PAD = "/images/logo-kws.png";

const DAGEN = [
  "zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag",
];
const MAANDEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

/**
 * Formatteert een datum in Brusselse tijd. De server draait op Vercel in UTC,
 * dus we mogen niet op de lokale tijdzone van het proces vertrouwen.
 */
function brusselseDelen(datum: Date) {
  const fmt = new Intl.DateTimeFormat("nl-BE", {
    timeZone: "Europe/Brussels",
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const delen = Object.fromEntries(
    fmt.formatToParts(datum).map((p) => [p.type, p.value])
  );
  // Intl levert de weekdag al in het Nederlands, maar de schrijfwijze verschilt
  // per Node-versie (ICU). We normaliseren via onze eigen lijst.
  const weekdagIndex = DAGEN.findIndex(
    (d) => d === (delen.weekday ?? "").toLowerCase()
  );
  return {
    weekdag: weekdagIndex === -1 ? (delen.weekday ?? "") : DAGEN[weekdagIndex],
    dag: Number(delen.day),
    maand: MAANDEN[Number(delen.month) - 1],
    uur: delen.hour,
    minuut: delen.minute,
  };
}

/** "zaterdag 15 augustus" */
export function formatteerDatum(datum: Date): string {
  const { weekdag, dag, maand } = brusselseDelen(datum);
  return `${weekdag} ${dag} ${maand}`;
}

/** "20u00" */
export function formatteerTijd(datum: Date): string {
  const { uur, minuut } = brusselseDelen(datum);
  return `${uur}u${minuut}`;
}

/**
 * Losse onderdelen voor op de afbeelding. De template zet weekdag, dagnummer en
 * maand onder elkaar, dus die hebben we apart nodig.
 */
export function formatteerKort(datum: Date): {
  datum: string;
  tijd: string;
  weekdagKort: string;
  dagNummer: string;
  maandKort: string;
} {
  const { weekdag, dag, maand, uur, minuut } = brusselseDelen(datum);
  const weekdagKort = weekdag.slice(0, 2).toUpperCase();
  const maandKort = maand.slice(0, 3).toUpperCase();
  return {
    datum: `${weekdagKort} ${dag} ${maandKort}`,
    tijd: `${uur}:${minuut}`,
    weekdagKort,
    dagNummer: String(dag),
    maandKort,
  };
}

/**
 * Splitst "Thuisploeg - Uitploeg" en bepaalt wie de tegenstander is.
 * Teamnamen kunnen zelf een koppelteken bevatten, daarom splitsen we enkel
 * op " - " (spatie-streepje-spatie), zoals de RBFA-feed het aanlevert.
 */
function splitsPloegen(summary: string): { thuis: string; uit: string } {
  const schoon = summary.replace(/^[^\p{L}\d]+/u, "").trim();
  const index = schoon.indexOf(" - ");
  if (index === -1) {
    return { thuis: schoon, uit: "" };
  }
  return {
    thuis: schoon.slice(0, index).trim(),
    uit: schoon.slice(index + 3).trim(),
  };
}

/** Haalt de eerstvolgende wedstrijd van een ploeg op, of null als er geen is. */
export async function getVolgendeWedstrijd(
  ploeg: PloegConfig
): Promise<WedstrijdEvent | null> {
  // Handmatige override heeft voorrang zolang er nog toekomstige wedstrijden in staan.
  if (ploeg.handmatigeBron) {
    const handmatig = getHandmatigeWedstrijden(ploeg.handmatigeBron);
    if (handmatig.length > 0) {
      const toekomstig = getToekomstigeWedstrijden(handmatigeNaarEvents(handmatig));
      if (toekomstig.length > 0) return toekomstig[0];
    }
  }

  const events = await getRbfaWedstrijden(ploeg.rbfaTeamId);
  return getToekomstigeWedstrijden(events)[0] ?? null;
}

/**
 * Bouwt de volledige matchday-gegevens voor een ploeg, inclusief de captiontekst.
 * Geeft null terug als de ploeg geen komende wedstrijd heeft, of als die
 * wedstrijd verder weg ligt dan `binnenDagen` (standaard 8 dagen, zodat er in
 * een winterstop of tijdens een bye-week niets gepost wordt).
 */
export async function bouwMatchday(
  ploeg: PloegConfig,
  binnenDagen = 8
): Promise<Matchday | null> {
  const wedstrijd = await getVolgendeWedstrijd(ploeg);
  if (!wedstrijd) return null;

  const dagenTot = (wedstrijd.start.getTime() - Date.now()) / 86_400_000;
  if (dagenTot > binnenDagen) return null;

  // De RBFA-feed levert de ploegnamen apart; enkel de handmatige en ICS-bronnen
  // hebben nog de gecombineerde summary nodig.
  const gesplitst = splitsPloegen(wedstrijd.summary);
  const ruwThuis = wedstrijd.thuisNaam ?? gesplitst.thuis;
  const ruwUit = wedstrijd.uitNaam ?? gesplitst.uit;

  // De feed markeert thuis/uit in description; valt die weg, dan leiden we het
  // af uit de teamnaam.
  const isThuis = wedstrijd.description
    ? wedstrijd.description.toLowerCase().startsWith("thuis")
    : EIGEN_CLUB_PATROON.test(ruwThuis);

  // De RBFA schrijft ons als "WS Linkhout A". Zo willen we niet publiceren.
  const eigenIsThuis = EIGEN_CLUB_PATROON.test(ruwThuis);
  const eigenIsUit = EIGEN_CLUB_PATROON.test(ruwUit);
  const thuis = eigenIsThuis ? ploeg.eigenNaam : ruwThuis;
  const uit = eigenIsUit ? ploeg.eigenNaam : ruwUit;
  const tegenstander = isThuis ? uit : thuis;
  const locatie = wedstrijd.location || (isThuis ? THUISADRES : "");

  // Voor onze eigen club gebruiken we het scherpe logo uit public/, niet de
  // lage-resolutie JPG van de RBFA.
  const thuisLogo = eigenIsThuis ? EIGEN_LOGO_PAD : wedstrijd.thuisLogo;
  const uitLogo = eigenIsUit ? EIGEN_LOGO_PAD : wedstrijd.uitLogo;

  return {
    ploeg,
    aftrapIso: wedstrijd.start.toISOString(),
    aftrap: wedstrijd.start,
    thuisploeg: thuis,
    uitploeg: uit,
    tegenstander,
    isThuis,
    locatie,
    veld: wedstrijd.veld,
    thuisLogo,
    uitLogo,
    reeks: wedstrijd.reeks ?? ploeg.reeks,
    caption: bouwCaption({ ploeg, wedstrijd, thuis, uit, tegenstander, isThuis, locatie }),
  };
}

/** Bouwt de placeholder-waarden die de template kan invullen. */
export function placeholdersVoor(input: {
  ploeg: PloegConfig;
  start: Date;
  thuis: string;
  uit: string;
  tegenstander: string;
  locatie: string;
  reeks?: string;
}) {
  const kort = formatteerKort(input.start);
  return {
    ploeg: input.ploeg.naam,
    label: input.ploeg.label,
    reeks: input.reeks ?? input.ploeg.reeks,
    thuisploeg: input.thuis,
    uitploeg: input.uit,
    tegenstander: input.tegenstander,
    datum: formatteerDatum(input.start),
    tijd: formatteerTijd(input.start),
    datumKort: kort.datum,
    locatie: input.locatie,
    hashtags: input.ploeg.hashtags.join(" "),
  };
}

function bouwCaption(input: {
  ploeg: PloegConfig;
  wedstrijd: WedstrijdEvent;
  thuis: string;
  uit: string;
  tegenstander: string;
  isThuis: boolean;
  locatie: string;
}): string {
  const template = getTemplate();
  const regels = input.isThuis ? template.caption.thuis : template.caption.uit;
  return renderRegels(
    regels,
    placeholdersVoor({
      ...input,
      start: input.wedstrijd.start,
      reeks: input.wedstrijd.reeks,
    })
  );
}
