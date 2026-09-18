/**
 * De kaart van het mosselfeest, overgenomen van de gedrukte kaart.
 *
 * De namen en de prijzen staan hier zoals ze op het blad staan, en in dezelfde
 * volgorde. Het formulier, de berekening van het bedrag, de overzichtspagina en
 * het Excel-logboek leiden zich hieruit af, dus een wijziging hier werkt overal
 * door en er hoeft nergens anders iets aangepast te worden.
 *
 * Laat het `id` van een gerecht ongewijzigd zodra er inschrijvingen zijn: die
 * id's staan in de bewaarde inschrijvingen. Een naam of een prijs aanpassen mag
 * wel.
 */

/** Staat op false zodra alles overeenkomt met de gedrukte kaart. */
export const VOORLOPIG = false;

export interface Gerecht {
  /** Korte sleutel. Komt in de opslag te staan, dus laat ze ongewijzigd. */
  id: string;
  /** Zoals het op de kaart staat. */
  naam: string;
  /** Kortere naam voor de kolomkop in Excel, waar de ruimte smal is. */
  kort?: string;
  /** Prijs per portie in euro. */
  prijs: number;
  groep: GroepId;
  /**
   * Telt dit gerecht als een plaats aan tafel?
   *
   * De kaart zet een maximum op elke zitting: 200 of 175 plaatsen. Een dessert
   * is geen extra stoel, een hoofdgerecht of een kindergerecht wel. Zo weten we
   * hoeveel volk er per zitting verwacht wordt.
   */
  teltAlsPlaats: boolean;
}

export type GroepId = "hoofd" | "kind" | "dessert";

export const GROEPEN: { id: GroepId; titel: string; uitleg?: string }[] = [
  { id: "hoofd", titel: "Hoofdgerechten" },
  { id: "kind", titel: "Kindergerechten" },
  { id: "dessert", titel: "Desserts" },
];

export const GERECHTEN: Gerecht[] = [
  { id: "mosselen-friet", naam: "Mosselen Friet", prijs: 24, groep: "hoofd", teltAlsPlaats: true },
  { id: "mosselen-brood", naam: "Mosselen Brood", prijs: 23, groep: "hoofd", teltAlsPlaats: true },
  { id: "vide-friet", naam: "Vidé Friet", prijs: 16, groep: "hoofd", teltAlsPlaats: true },
  {
    id: "stoofvlees-friet",
    naam: "Stoofvlees Friet",
    prijs: 16,
    groep: "hoofd",
    teltAlsPlaats: true,
  },
  { id: "halve-haan-friet", naam: "½ haan Friet", prijs: 16, groep: "hoofd", teltAlsPlaats: true },
  {
    id: "balletjes",
    naam: "Balletjes (tomatensaus)",
    kort: "Balletjes",
    prijs: 16,
    groep: "hoofd",
    teltAlsPlaats: true,
  },
  { id: "scampis", naam: "Scampi’s", prijs: 16, groep: "hoofd", teltAlsPlaats: true },

  {
    id: "hamburger",
    naam: "Hamburger (2 stuks)",
    kort: "Hamburger",
    prijs: 10,
    groep: "kind",
    teltAlsPlaats: true,
  },
  { id: "kinder-vide", naam: "Kinder Vidé", prijs: 10, groep: "kind", teltAlsPlaats: true },
  {
    id: "balletjes-kind",
    naam: "Balletjes (tomatensaus)",
    kort: "Balletjes kind",
    prijs: 10,
    groep: "kind",
    teltAlsPlaats: true,
  },

  { id: "chocomousse", naam: "Chocomousse", prijs: 4, groep: "dessert", teltAlsPlaats: false },
  { id: "rijstpap", naam: "Rijstpap", prijs: 4, groep: "dessert", teltAlsPlaats: false },
];

/**
 * Eén zitting, of afhalen.
 *
 * De maxima komen van de kaart. Ze gaan over plaatsen aan tafel, dus we tellen
 * enkel de gerechten met teltAlsPlaats. Afhalen heeft geen maximum: daar is
 * geen zaal voor nodig.
 */
export interface Zitting {
  id: string;
  label: string;
  /** Het aantal plaatsen, of undefined als er geen grens is. */
  max?: number;
  afhalen?: boolean;
}

export const EVENEMENT = {
  naam: "Mosselfeest KWS Linkhout",
  jaar: 2026,
  datumTekst: "vrijdag 23 en zaterdag 24 oktober 2026",
  plaats: "Kantine KWS Linkhout, Kapelstraat 72, Linkhout",
  /**
   * Tot wanneer er ingeschreven kan worden (ISO-datum).
   *
   * Staat niet op de kaart; dit is de zondag voor het feest. Aanpassen als de
   * club een andere datum afspreekt.
   */
  inschrijvenTot: "2026-10-18",
  zittingen: [
    { id: "vr-23-18", label: "Vrijdag 23 oktober, 18.00 tot 20.30 uur", max: 200 },
    { id: "za-24-12", label: "Zaterdag 24 oktober, 12.00 tot 14.00 uur", max: 200 },
    { id: "za-24-1630", label: "Zaterdag 24 oktober, 16.30 tot 18.15 uur", max: 175 },
    { id: "za-24-1830", label: "Zaterdag 24 oktober, 18.30 tot 20.30 uur", max: 175 },
    { id: "afhalen-23", label: "Afhalen op vrijdag 23 oktober", afhalen: true },
    { id: "afhalen-24", label: "Afhalen op zaterdag 24 oktober", afhalen: true },
  ] as Zitting[],
  /**
   * Rekeningnummer voor een overschrijving.
   *
   * Op de kaart staat er geen: wie een kaart afgeeft, betaalt ter plaatse.
   * Blijft dit leeg, dan vraagt het formulier geen overschrijving en zegt het
   * dat er bij aankomst of bij het afhalen betaald wordt.
   */
  rekening: "",
  rekeningNaam: "KWS vzw",
  contact: "info@kwslinkhout.be",
} as const;

export function gerecht(id: string): Gerecht | undefined {
  return GERECHTEN.find((g) => g.id === id);
}

/** De gerechten van één groep, in de volgorde van de kaart. */
export function gerechtenVan(groep: GroepId): Gerecht[] {
  return GERECHTEN.filter((g) => g.groep === groep);
}

export function zitting(id: string): Zitting | undefined {
  return EVENEMENT.zittingen.find((z) => z.id === id);
}

/** Wordt er ter plaatse gegeten, of afgehaald? */
export function isAfhalen(zittingId: string): boolean {
  return Boolean(zitting(zittingId)?.afhalen);
}

/** Wordt er met een overschrijving betaald, of ter plaatse? */
export function metOverschrijving(): boolean {
  return EVENEMENT.rekening.trim().length > 0;
}

/** Het bedrag van een inschrijving, in euro. */
export function bedragVan(aantallen: Record<string, number>): number {
  let totaal = 0;
  for (const [id, aantal] of Object.entries(aantallen)) {
    const g = gerecht(id);
    if (!g || !Number.isFinite(aantal) || aantal <= 0) continue;
    totaal += g.prijs * aantal;
  }
  return Math.round(totaal * 100) / 100;
}

/** Het aantal porties in een inschrijving, over alle gerechten samen. */
export function aantalPorties(aantallen: Record<string, number>): number {
  return Object.entries(aantallen).reduce(
    (som, [id, aantal]) => (gerecht(id) && aantal > 0 ? som + aantal : som),
    0,
  );
}

/**
 * Het aantal plaatsen dat een inschrijving inneemt: de hoofd- en
 * kindergerechten. Desserts tellen niet mee, want daar zit niemand extra voor
 * aan tafel.
 */
export function aantalPlaatsen(aantallen: Record<string, number>): number {
  return Object.entries(aantallen).reduce((som, [id, aantal]) => {
    const g = gerecht(id);
    return g?.teltAlsPlaats && aantal > 0 ? som + aantal : som;
  }, 0);
}

/** "14,50" in plaats van "14.5", zoals we het hier schrijven. */
export function euro(bedrag: number): string {
  return new Intl.NumberFormat("nl-BE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(bedrag);
}

/**
 * De mededeling voor de overschrijving. Kort en herkenbaar, zodat een
 * rekeninguittreksel te koppelen is aan een inschrijving.
 */
export function mededeling(kenmerk: string, naam: string): string {
  const net = naam.replace(/\s+/g, " ").trim().slice(0, 30);
  return `Mosselfeest ${EVENEMENT.jaar} ${kenmerk} ${net}`.trim();
}
