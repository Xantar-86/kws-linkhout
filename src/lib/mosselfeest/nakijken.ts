import {
  BRIEFJE_EERSTE_KAARTNUMMER,
  EVENEMENT,
  GERECHTEN,
  ONLINE_EERSTE_KAARTNUMMER,
  aantalPorties,
  gerecht,
} from "./kaart";

/**
 * Nakijken of een inschrijving bruikbaar is.
 *
 * Dit bestand mag geen serverdingen invoeren, want het formulier in de browser
 * gebruikt dezelfde regels. Zo ziet de bezoeker meteen wat er ontbreekt en
 * laat de server niets door wat het formulier zou tegenhouden.
 */

/** Wat het formulier naar de server stuurt. */
export interface InschrijvingInvoer {
  naam: string;
  voornaam: string;
  email: string;
  telefoon?: string;
  zitting: string;
  aantallen: Record<string, number>;
  opmerking?: string;
}

/** Hoogste aantal porties per gerecht in één inschrijving. */
export const MAX_PER_GERECHT = 40;

function naamDeugt(waarde: unknown): waarde is string {
  return typeof waarde === "string" && waarde.trim().length >= 2 && waarde.length <= 120;
}

/** Is de inschrijving nog open op de gegeven dag? */
export function nogOpen(op = new Date()): boolean {
  const grens = new Date(`${EVENEMENT.inschrijvenTot}T23:59:59+01:00`);
  return op.getTime() <= grens.getTime();
}

export function controleer(invoer: Partial<InschrijvingInvoer>): string[] {
  const klachten: string[] = [];

  if (!naamDeugt(invoer.naam)) klachten.push("Vul je familienaam in.");
  if (!naamDeugt(invoer.voornaam)) klachten.push("Vul je voornaam in.");
  if (!invoer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(invoer.email)) {
    klachten.push("Vul een geldig e-mailadres in; daar gaat je bevestiging naartoe.");
  }
  if (invoer.telefoon && invoer.telefoon.replace(/[^0-9]/g, "").length < 8) {
    klachten.push("Het telefoonnummer lijkt te kort.");
  }
  if (!invoer.zitting || !EVENEMENT.zittingen.some((z) => z.id === invoer.zitting)) {
    klachten.push("Kies wanneer je komt eten.");
  }

  const aantallen = invoer.aantallen ?? {};
  for (const [id, aantal] of Object.entries(aantallen)) {
    if (!gerecht(id)) {
      klachten.push("Er staat een gerecht in de inschrijving dat niet op de kaart staat.");
      break;
    }
    if (!Number.isInteger(aantal) || aantal < 0 || aantal > MAX_PER_GERECHT) {
      klachten.push(
        `Een aantal moet een heel getal zijn van 0 tot ${MAX_PER_GERECHT}. Voor een grote groep, mail naar ${EVENEMENT.contact}.`,
      );
      break;
    }
  }

  if (aantalPorties(aantallen) === 0) {
    klachten.push("Kies minstens één gerecht.");
  }

  if (invoer.opmerking && invoer.opmerking.length > 500) {
    klachten.push("De opmerking is te lang.");
  }

  if (!nogOpen()) {
    klachten.push(
      `De inschrijvingen zijn afgesloten. Probeer het toch nog via ${EVENEMENT.contact}.`,
    );
  }

  return klachten;
}

/** De aantallen opschonen: enkel gerechten van de kaart, enkel positieve getallen. */
export function schoonAantallen(aantallen: Record<string, unknown>): Record<string, number> {
  const netjes: Record<string, number> = {};
  for (const g of GERECHTEN) {
    const waarde = aantallen[g.id];
    const aantal = typeof waarde === "number" ? Math.floor(waarde) : 0;
    if (aantal > 0) netjes[g.id] = Math.min(aantal, MAX_PER_GERECHT);
  }
  return netjes;
}

/** Wat een organisator invult voor een afgegeven kaart of een stapel kaarten. */
export interface HandmatigeInvoer {
  /** "kaart" voor één afgegeven kaart, "verzamelpost" voor een stapel. */
  bron: "kaart" | "verzamelpost";
  /** Bij een kaart de naam, bij een verzamelpost een toelichting. */
  naam: string;
  /** Bij een verzamelpost mag dit leeg blijven als de zitting niet vaststaat. */
  zitting?: string;
  aantallen: Record<string, number>;
  betaald?: boolean;
  opmerking?: string;
  /** De voornaam op de kaart, voor een afgegeven kaart. */
  voornaam?: string;
  /** Wie het heeft ingetypt. */
  ingevoerdDoor?: string;
  /**
   * Het nummer dat op de afgegeven kaart staat. De gedrukte kaarten beginnen
   * bij 001, dus onder de 1001; die reeks is voor de online inschrijvingen.
   */
  kaartnummer?: number;
  /**
   * Geen nummer op het papier? Dan kent het systeem er zelf een toe vanaf
   * 2001. Dat nummer wordt op het briefje geschreven, zodat een gesorteerde
   * stapel terug te vinden is.
   */
  automatischNummer?: boolean;
}

/**
 * Nakijken van een handmatige invoer.
 *
 * Losser dan het formulier: geen e-mailadres, en bij een verzamelpost hoeft de
 * zitting niet vast te staan. De sluitingsdatum geldt hier ook niet, want een
 * kaart die op tijd is afgegeven mag daarna nog ingetypt worden.
 */
export function controleerHandmatig(invoer: Partial<HandmatigeInvoer>): string[] {
  const klachten: string[] = [];

  if (invoer.bron !== "kaart" && invoer.bron !== "verzamelpost") {
    klachten.push("Kies of het om één kaart of om een stapel gaat.");
  }
  if (!naamDeugt(invoer.naam)) {
    klachten.push(
      invoer.bron === "verzamelpost"
        ? "Geef de stapel een toelichting, bijvoorbeeld: kaarten kantine week 1."
        : "Vul de naam in die op de kaart staat.",
    );
  }
  // Het moment mag ontbreken. In het bestand van het bestuur stond het bij een
  // aantal inschrijvingen ook niet ingevuld, en dan is niets invullen beter dan
  // iets verzinnen. Zo'n inschrijving telt mee in het totaal en staat apart
  // vermeld als "zonder zitting".
  if (invoer.zitting && !EVENEMENT.zittingen.some((z) => z.id === invoer.zitting)) {
    klachten.push("Die zitting bestaat niet.");
  }

  const aantallen = invoer.aantallen ?? {};
  for (const [id, aantal] of Object.entries(aantallen)) {
    if (!gerecht(id)) {
      klachten.push("Er staat een gerecht in de invoer dat niet op de kaart staat.");
      break;
    }
    // Bij een stapel mag het aantal hoger liggen dan bij één kaart.
    const grens = invoer.bron === "verzamelpost" ? 2000 : MAX_PER_GERECHT;
    if (!Number.isInteger(aantal) || aantal < 0 || aantal > grens) {
      klachten.push(`Een aantal moet een heel getal zijn van 0 tot ${grens}.`);
      break;
    }
  }
  if (aantalPorties(aantallen) === 0) klachten.push("Vul minstens één aantal in.");

  if (invoer.opmerking && invoer.opmerking.length > 500) klachten.push("De opmerking is te lang.");

  if (invoer.kaartnummer !== undefined && !invoer.automatischNummer) {
    if (!Number.isInteger(invoer.kaartnummer) || invoer.kaartnummer < 1) {
      klachten.push("Het kaartnummer moet een heel getal zijn.");
    } else if (invoer.kaartnummer >= ONLINE_EERSTE_KAARTNUMMER) {
      klachten.push(
        `Nummers vanaf ${ONLINE_EERSTE_KAARTNUMMER} deelt het systeem zelf uit: ${ONLINE_EERSTE_KAARTNUMMER} en hoger voor online, ${BRIEFJE_EERSTE_KAARTNUMMER} en hoger voor briefjes zonder nummer. Neem hier het nummer over dat op de kaart gedrukt staat.`,
      );
    }
  }

  return klachten;
}

/** Zelfde opschoning als bij het formulier, maar met de ruimere grens. */
export function schoonAantallenRuim(aantallen: Record<string, unknown>): Record<string, number> {
  const netjes: Record<string, number> = {};
  for (const g of GERECHTEN) {
    const waarde = aantallen[g.id];
    const aantal = typeof waarde === "number" ? Math.floor(waarde) : 0;
    if (aantal > 0) netjes[g.id] = Math.min(aantal, 2000);
  }
  return netjes;
}

/**
 * Naam en voornaam samen, in de volgorde van de kaart.
 *
 * Voor een verzamelpost staat er geen voornaam en is `naam` de toelichting;
 * dan geven we die gewoon terug.
 */
export function volledigeNaam(wie: { naam: string; voornaam?: string }): string {
  return wie.voornaam ? `${wie.naam} ${wie.voornaam}`.trim() : wie.naam;
}
