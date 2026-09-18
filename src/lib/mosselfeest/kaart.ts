/**
 * De kaart van het mosselfeest.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ LET OP: dit is nog NIET de gedrukte kaart.                               │
 * │                                                                          │
 * │ De gerechten, de prijzen, de datum en de zittingen hieronder zijn een    │
 * │ voorlopige opzet, zodat het formulier en het logboek gebouwd en getest   │
 * │ konden worden. Zet VOORLOPIG op false zodra alles overeenkomt met de     │
 * │ kaart die al gedrukt is; tot dan staat er een waarschuwing op het        │
 * │ formulier, zodat niemand zich op verkeerde prijzen inschrijft.           │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Alles wat met de kaart te maken heeft, staat in dit ene bestand. Het
 * formulier, de berekening van het bedrag, de overzichtspagina en het
 * Excel-logboek leiden zich hieruit af, dus een wijziging hier werkt overal
 * door en er hoeft nergens anders iets aangepast te worden.
 */

export const VOORLOPIG = true;

export interface Gerecht {
  /** Korte sleutel. Komt in de opslag te staan, dus laat ze ongewijzigd. */
  id: string;
  /** Zoals het op de kaart staat. */
  naam: string;
  /** Extra uitleg onder de naam, bijvoorbeeld wat erbij hoort. */
  uitleg?: string;
  /** Prijs per portie in euro. */
  prijs: number;
  /** Waar het gerecht in het formulier en in het logboek komt te staan. */
  groep: GroepId;
}

export type GroepId = "hoofd" | "kind" | "extra" | "dessert";

export const GROEPEN: { id: GroepId; titel: string; uitleg?: string }[] = [
  { id: "hoofd", titel: "Hoofdgerechten" },
  { id: "kind", titel: "Voor de kinderen" },
  { id: "extra", titel: "Extra", uitleg: "Een extra portie of iets erbij." },
  { id: "dessert", titel: "Dessert" },
];

export const GERECHTEN: Gerecht[] = [
  {
    id: "mosselen-natuur",
    naam: "Mosselen natuur",
    uitleg: "Met brood of friet",
    prijs: 28,
    groep: "hoofd",
  },
  {
    id: "mosselen-wijn",
    naam: "Mosselen in wijnsaus",
    uitleg: "Met brood of friet",
    prijs: 30,
    groep: "hoofd",
  },
  {
    id: "vol-au-vent",
    naam: "Vol-au-vent met friet",
    prijs: 20,
    groep: "hoofd",
  },
  {
    id: "koude-schotel",
    naam: "Koude schotel",
    uitleg: "Met brood of friet",
    prijs: 22,
    groep: "hoofd",
  },
  {
    id: "kipfilet-kind",
    naam: "Kipfilet met friet en appelmoes",
    prijs: 12,
    groep: "kind",
  },
  {
    id: "frikandel-kind",
    naam: "Frikandel met friet en appelmoes",
    prijs: 10,
    groep: "kind",
  },
  {
    id: "extra-mosselen",
    naam: "Extra portie mosselen",
    prijs: 12,
    groep: "extra",
  },
  { id: "extra-friet", naam: "Portie friet", prijs: 4, groep: "extra" },
  { id: "extra-brood", naam: "Brood met boter", prijs: 2, groep: "extra" },
  { id: "dessert-ijs", naam: "Dame blanche", prijs: 6, groep: "dessert" },
];

/** Eén zitting: wanneer er gegeten wordt. */
export interface Zitting {
  id: string;
  label: string;
}

export const EVENEMENT = {
  naam: "Mosselfeest KWS Linkhout",
  /** Wordt op het formulier en in het logboek gebruikt. */
  jaar: 2026,
  datumTekst: "zaterdag 14 en zondag 15 november 2026",
  plaats: "Kantine KWS Linkhout, Kapelstraat 72, Linkhout",
  /** Tot wanneer er ingeschreven kan worden (ISO-datum). */
  inschrijvenTot: "2026-11-09",
  zittingen: [
    { id: "za-18", label: "Zaterdag 14 november, 18.00 uur" },
    { id: "zo-1130", label: "Zondag 15 november, 11.30 uur" },
    { id: "zo-1730", label: "Zondag 15 november, 17.30 uur" },
  ] as Zitting[],
  /** Waar het geld naartoe gaat. Komt op het formulier en in de mail. */
  rekening: "BE00 0000 0000 0000",
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
