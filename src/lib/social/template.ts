import { readFileSync } from "fs";
import { join } from "path";

/**
 * De matchday-template staat in content/social/matchday-template.json zodat de
 * bewoording aangepast kan worden zonder de code aan te raken. Dit bestand
 * leest die template in en vult de placeholders in.
 */

export interface AfbeeldingTemplate {
  kop: string;
  kopUitslag: string;
  labelThuis: string;
  labelUit: string;
  voettekst: string;
  achtergrond: string;
  accent: string;
  tekstkleur: string;
}

export interface MatchdayTemplate {
  caption: { thuis: string[]; uit: string[] };
  uitslag: { winst: string[]; gelijk: string[]; verlies: string[] };
  afbeelding: AfbeeldingTemplate;
}

const STANDAARD: MatchdayTemplate = {
  caption: {
    thuis: ["⚽ MATCHDAY", "", "{ploeg} | {reeks}", "{thuisploeg} - {uitploeg}", "", "📅 {datum} om {tijd}", "📍 {locatie}", "", "{hashtags}"],
    uit: ["⚽ MATCHDAY", "", "{ploeg} | {reeks}", "{thuisploeg} - {uitploeg}", "", "📅 {datum} om {tijd}", "", "{hashtags}"],
  },
  uitslag: {
    winst: ["UITSLAG | {label}", "", "{thuisploeg} {uitslag} {uitploeg}", "", "⚽ {doelpuntenmakers}", "", "{hashtags}"],
    gelijk: ["UITSLAG | {label}", "", "{thuisploeg} {uitslag} {uitploeg}", "", "⚽ {doelpuntenmakers}", "", "{hashtags}"],
    verlies: ["UITSLAG | {label}", "", "{thuisploeg} {uitslag} {uitploeg}", "", "⚽ {doelpuntenmakers}", "", "{hashtags}"],
  },
  afbeelding: {
    kop: "WEDSTRIJD",
    kopUitslag: "UITSLAG",
    labelThuis: "THUISWEDSTRIJD",
    labelUit: "UITWEDSTRIJD",
    voettekst: "kwslinkhout.be",
    achtergrond: "#7f1d1d",
    accent: "#dc2626",
    tekstkleur: "#ffffff",
  },
};

let cache: MatchdayTemplate | null = null;

export function getTemplate(): MatchdayTemplate {
  if (cache) return cache;
  try {
    const pad = join(process.cwd(), "content", "social", "matchday-template.json");
    const data = JSON.parse(readFileSync(pad, "utf-8"));
    cache = {
      caption: { ...STANDAARD.caption, ...data.caption },
      uitslag: { ...STANDAARD.uitslag, ...data.uitslag },
      afbeelding: { ...STANDAARD.afbeelding, ...data.afbeelding },
    };
  } catch (error) {
    console.error("[social] template niet leesbaar, standaard gebruikt:", error);
    cache = STANDAARD;
  }
  return cache;
}

export type Placeholders = Record<string, string>;

/**
 * Vult {placeholders} in. Regels waarvan een placeholder leeg blijft (bv. een
 * ontbrekende locatie) vallen weg, zodat er geen kale "📍" achterblijft.
 */
export function renderRegels(regels: string[], waarden: Placeholders): string {
  const ingevuld = regels
    .map((regel) => {
      const gebruikte = [...regel.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      if (gebruikte.length > 0 && gebruikte.every((k) => !waarden[k])) {
        return null;
      }
      return regel.replace(/\{(\w+)\}/g, (_, sleutel) => waarden[sleutel] ?? "");
    })
    .filter((regel): regel is string => regel !== null);

  // Meerdere lege regels na elkaar samenvouwen tot één.
  return ingevuld
    .filter((regel, i) => !(regel.trim() === "" && ingevuld[i - 1]?.trim() === ""))
    .join("\n")
    .trim();
}
