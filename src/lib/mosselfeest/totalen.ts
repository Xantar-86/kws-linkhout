import {
  EVENEMENT,
  GERECHTEN,
  ONLINE_EERSTE_KAARTNUMMER,
  aantalPlaatsen,
  aantalPorties,
  bedragVan,
} from "./kaart";

/**
 * De inschrijving zelf en de optelsom erover.
 *
 * Dit bestand staat los van de opslag, zodat ook het scherm in de browser
 * ermee kan rekenen. Dat is niet louter netjes: de overzichtspagina moet na
 * een wijziging meteen de juiste totalen kunnen tonen, zonder te wachten op
 * een antwoord van de opslag dat soms nog de oude toestand bevat.
 */

export type Bron = "online" | "kaart" | "verzamelpost";

export interface Inschrijving {
  /** Interne sleutel, tevens de bestandsnaam in de opslag. */
  kenmerk: string;
  /**
   * Het nummer van de kaart, zoals mensen het gebruiken.
   *
   * Online inschrijvingen krijgen er een vanaf 1001; bij een afgegeven kaart
   * typt de organisator het nummer over dat op het blad staat. Ontbreekt het,
   * dan gaat het om een inschrijving van voor deze nummering.
   */
  kaartnummer?: number;
  /** Wanneer de inschrijving binnenkwam (ISO). */
  aangemeld: string;
  /**
   * De familienaam, zoals op de kaart ("naam en voornaam"). Bij een
   * verzamelpost staat hier de toelichting, bv. "kaarten kantine week 1".
   */
  naam: string;
  /**
   * De voornaam, apart gevraagd.
   *
   * Nodig om iemand in de bevestigingsmail met zijn voornaam aan te spreken.
   * Uit één naamveld valt dat niet te halen: de een typt "Thoelen Jochen", de
   * ander "Jochen Thoelen", en dan wordt het "Dag Thoelen".
   */
  voornaam?: string;
  /** Alleen bij een inschrijving via het formulier. */
  email?: string;
  telefoon?: string;
  /** Ontbreekt bij oudere inschrijvingen; die zijn allemaal online gebeurd. */
  bron?: Bron;
  /** Wie de kaart heeft ingetypt, zodat een vraag achteraf te plaatsen is. */
  ingevoerdDoor?: string;
  /** Id van de zitting uit kaart.ts. */
  zitting: string;
  /** Per gerecht-id het aantal porties. */
  aantallen: Record<string, number>;
  opmerking?: string;
  /** Het bedrag op het moment van inschrijven, in euro. */
  bedrag: number;
  betaald: boolean;
  /** Wanneer er afgevinkt is dat het geld binnen is (ISO). */
  betaaldOp?: string;
}

/**
 * Het volgende vrije nummer in de online reeks.
 *
 * We tellen niet het aantal inschrijvingen, maar nemen het hoogste nummer plus
 * een: zo krijgt niemand het nummer van een geschrapte inschrijving opnieuw,
 * en blijft een nummer dus voor altijd van één kaart.
 */
export function volgendKaartnummer(inschrijvingen: Inschrijving[]): number {
  const hoogste = inschrijvingen.reduce((max, i) => {
    const n = i.kaartnummer ?? 0;
    return n >= ONLINE_EERSTE_KAARTNUMMER && n > max ? n : max;
  }, ONLINE_EERSTE_KAARTNUMMER - 1);
  return hoogste + 1;
}


export interface Totalen {
  inschrijvingen: number;
  /** Hoeveel daarvan online, via een ingetypte kaart of als verzamelpost. */
  perBron: Record<Bron, number>;
  porties: number;
  /** Plaatsen aan tafel: enkel de hoofd- en kindergerechten. */
  plaatsen: number;
  bedrag: number;
  bedragBetaald: number;
  bedragOpen: number;
  /** Per gerecht-id het totale aantal porties. */
  perGerecht: Record<string, number>;
  /**
   * Per zitting-id de aantallen. `plaatsen` is wat telt tegenover het maximum
   * op de kaart; `vrij` is wat er nog over is, of null bij afhalen.
   */
  perZitting: Record<
    string,
    { inschrijvingen: number; porties: number; plaatsen: number; max: number | null; vrij: number | null }
  >;
}

/** De optelsom waar het hele logboek om draait. */
export function telOp(inschrijvingen: Inschrijving[]): Totalen {
  const totalen: Totalen = {
    inschrijvingen: inschrijvingen.length,
    perBron: { online: 0, kaart: 0, verzamelpost: 0 },
    porties: 0,
    plaatsen: 0,
    bedrag: 0,
    bedragBetaald: 0,
    bedragOpen: 0,
    perGerecht: Object.fromEntries(GERECHTEN.map((g) => [g.id, 0])),
    perZitting: Object.fromEntries(
      EVENEMENT.zittingen.map((z) => [
        z.id,
        {
          inschrijvingen: 0,
          porties: 0,
          plaatsen: 0,
          max: z.max ?? null,
          vrij: z.max ?? null,
        },
      ]),
    ),
  };

  for (const inschrijving of inschrijvingen) {
    // Het bedrag opnieuw rekenen uit de aantallen: wijzigt er een prijs op de
    // kaart, dan klopt het totaal nog steeds met de kaart van vandaag. Het
    // bewaarde bedrag blijft wel staan als wat er gevraagd is.
    const bedrag = inschrijving.bedrag || bedragVan(inschrijving.aantallen);
    const porties = aantalPorties(inschrijving.aantallen);
    const plaatsen = aantalPlaatsen(inschrijving.aantallen);

    totalen.perBron[inschrijving.bron ?? "online"] += 1;
    totalen.porties += porties;
    totalen.plaatsen += plaatsen;
    totalen.bedrag += bedrag;
    if (inschrijving.betaald) totalen.bedragBetaald += bedrag;
    else totalen.bedragOpen += bedrag;

    for (const [id, aantal] of Object.entries(inschrijving.aantallen)) {
      if (!(id in totalen.perGerecht) || !(aantal > 0)) continue;
      totalen.perGerecht[id] += aantal;
    }

    const zitting = totalen.perZitting[inschrijving.zitting];
    if (zitting) {
      zitting.inschrijvingen += 1;
      zitting.porties += porties;
      zitting.plaatsen += plaatsen;
      if (zitting.max !== null) zitting.vrij = Math.max(0, zitting.max - zitting.plaatsen);
    }
  }

  totalen.bedrag = Math.round(totalen.bedrag * 100) / 100;
  totalen.bedragBetaald = Math.round(totalen.bedragBetaald * 100) / 100;
  totalen.bedragOpen = Math.round(totalen.bedragOpen * 100) / 100;
  return totalen;
}
