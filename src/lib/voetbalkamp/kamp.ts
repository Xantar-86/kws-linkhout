import { EVENEMENT as MOSSELFEEST } from "@/lib/mosselfeest/kaart";

/**
 * Het Allerheiligen-voetbalkamp: wat, wanneer, hoeveel, en de regels voor een
 * inschrijving.
 *
 * Dit bestand draait ook in de browser (het formulier en het overzicht rekenen
 * ermee), dus hier komt niets van de server in: geen opslag, geen mail.
 *
 * Een volgend kamp (Pasen, zomer) is een kwestie van KAMP aanpassen. Het id
 * bepaalt de map in de opslag, dus verander het voor een nieuw kamp en laat
 * het staan zolang er inschrijvingen zijn.
 */

export const KAMP = {
  id: "allerheiligen-2026",
  naam: "Allerheiligen Voetbalkamp",
  jaar: 2026,
  dagen: ["2026-11-04", "2026-11-05", "2026-11-06"],
  datumTekst: "woensdag 4, donderdag 5 en vrijdag 6 november 2026",
  plaats: "KWS Linkhout, Kapelstraat 72, 3560 Linkhout",
  /**
   * De prijs per speler in euro. Zolang dit null is, staat er op het formulier
   * en in de mail dat het bedrag nog volgt, en toont het formulier een
   * waarschuwing dat het nog niet doorgegeven mag worden.
   */
  prijs: 110 as number | null,
  /** Tot wanneer het formulier openstaat (de dag zelf inbegrepen). */
  inschrijvenTot: "2026-11-02",
  /** Dezelfde rekening als het mosselfeest. */
  rekening: MOSSELFEEST.rekening,
  rekeningNaam: MOSSELFEEST.rekeningNaam,
  contact: "info@kwslinkhout.be",
  /** Wat er bij de prijs inbegrepen is; staat op het formulier en in de mail. */
  inbegrepen: [
    { teken: "🍲", tekst: "Elke middag warme soep" },
    { teken: "🍔", tekst: "Op de laatste dag friet met een hamburger" },
  ],
};

/** Zolang de prijs ontbreekt, is het formulier nog niet klaar om te delen. */
export const VOORLOPIG = KAMP.prijs === null;

export interface KampInvoer {
  voornaam: string;
  naam: string;
  /** JJJJ-MM-DD, zoals een datumveld het geeft. */
  geboortedatum: string;
  /** De leeftijdscategorie (U6 tot U17), ook voor wie nog geen lid is. */
  categorie: string;
  /** Speelt de speler al bij KWS Linkhout? */
  lid: boolean;
  ouderNaam: string;
  email: string;
  telefoon: string;
  /** Allergieën, medicatie, iets wat de trainers moeten weten. */
  opmerking?: string;
}

export interface KampInschrijving extends KampInvoer {
  /** Interne sleutel, tevens de bestandsnaam in de opslag. */
  kenmerk: string;
  /** Het inschrijfnummer dat in de mededeling van de overschrijving staat. */
  nummer?: number;
  /** Wanneer de inschrijving binnenkwam (ISO). */
  aangemeld: string;
  /** De prijs op het moment van inschrijven, of null als die nog niet vastlag. */
  bedrag: number | null;
  betaald: boolean;
  betaaldOp?: string;
  /** Wie de inschrijving op het overzicht toevoegde, als ze niet online kwam. */
  ingevoerdDoor?: string;
}

export function volledigeNaam(wie: { voornaam: string; naam: string }): string {
  return `${wie.voornaam} ${wie.naam}`.trim();
}

/**
 * De mededeling voor de overschrijving: het inschrijfnummer en de naam van de
 * speler, zoals gevraagd. Zo ziet de penningmeester op het uittreksel meteen
 * voor wie er betaald is, ook als iemand het nummer vergeet.
 */
export function mededeling(wie: { nummer?: number; voornaam: string; naam: string }): string {
  return `Kamp ${wie.nummer ?? ""} ${volledigeNaam(wie)}`.replace(/\s+/g, " ").trim();
}

export function euro(bedrag: number): string {
  return bedrag.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function nogOpen(op = new Date()): boolean {
  const grens = new Date(`${KAMP.inschrijvenTot}T23:59:59+01:00`);
  return op <= grens;
}

/**
 * De leeftijdscategorieën waaruit je kiest, zoals de jeugdploegen van de club.
 * Op het kamp worden de groepen hiermee gemaakt.
 */
export const CATEGORIEEN = ["U6", "U7", "U8", "U9", "U10", "U11", "U12", "U13", "U15", "U17"] as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Wat er ontbreekt of niet klopt, in gewone zinnen. Leeg is goed. */
export function controleer(invoer: Partial<KampInvoer>): string[] {
  const klachten: string[] = [];
  if (!invoer.voornaam?.trim()) klachten.push("Vul de voornaam van de speler in.");
  if (!invoer.naam?.trim()) klachten.push("Vul de familienaam van de speler in.");
  if (!invoer.geboortedatum || !/^\d{4}-\d{2}-\d{2}$/.test(invoer.geboortedatum)) {
    klachten.push("Vul de geboortedatum van de speler in.");
  } else {
    const jaar = Number(invoer.geboortedatum.slice(0, 4));
    if (jaar < KAMP.jaar - 20 || jaar > KAMP.jaar - 3) {
      klachten.push("Kijk de geboortedatum na; die lijkt niet te kloppen.");
    }
  }
  if (!invoer.categorie || !(CATEGORIEEN as readonly string[]).includes(invoer.categorie)) {
    klachten.push("Kies de leeftijdscategorie van de speler.");
  }
  if (typeof invoer.lid !== "boolean") klachten.push("Duid aan of de speler al lid is van KWS Linkhout.");
  if (!invoer.ouderNaam?.trim()) klachten.push("Vul de naam van een ouder in.");
  if (!invoer.email?.trim() || !EMAIL.test(invoer.email.trim())) {
    klachten.push("Vul een geldig e-mailadres in; daar komt de bevestiging naartoe.");
  }
  if (!invoer.telefoon?.trim() || invoer.telefoon.replace(/\D/g, "").length < 9) {
    klachten.push("Vul een gsm-nummer in waarop we je tijdens het kamp kunnen bereiken.");
  }
  if ((invoer.opmerking ?? "").length > 1000) klachten.push("De opmerking is te lang.");
  return klachten;
}

export interface KampTotalen {
  inschrijvingen: number;
  betaald: number;
  /** Ontvangen en nog te ontvangen, voor zover er een bedrag vastligt. */
  bedragBetaald: number;
  bedragOpen: number;
  perCategorie: Record<string, number>;
  /** Hoeveel er nog geen lid zijn. */
  nietLeden: number;
}

export function telOp(lijst: KampInschrijving[]): KampTotalen {
  const totalen: KampTotalen = {
    inschrijvingen: lijst.length,
    betaald: 0,
    bedragBetaald: 0,
    bedragOpen: 0,
    perCategorie: {},
    nietLeden: 0,
  };
  for (const i of lijst) {
    const bedrag = i.bedrag ?? KAMP.prijs ?? 0;
    if (i.betaald) {
      totalen.betaald += 1;
      totalen.bedragBetaald += bedrag;
    } else {
      totalen.bedragOpen += bedrag;
    }
    totalen.perCategorie[i.categorie] = (totalen.perCategorie[i.categorie] ?? 0) + 1;
    if (!i.lid) totalen.nietLeden += 1;
  }
  return totalen;
}

/** Het volgende inschrijfnummer: het hoogste plus een, nooit een hergebruikt. */
export function volgendNummer(lijst: KampInschrijving[]): number {
  return lijst.reduce((max, i) => Math.max(max, i.nummer ?? 0), 0) + 1;
}
