import { readFileSync } from "fs";
import { join } from "path";
import type { HandmatigeWedstrijd, HandmatigeData, WedstrijdEvent } from "@/types";

/**
 * Leest een handmatig onderhouden wedstrijdbestand uit content/.
 * Gebruikt als override op de RBFA-kalender wanneer die niet klopt.
 */
export function getHandmatigeWedstrijden(bestandsnaam: string): HandmatigeWedstrijd[] {
  try {
    const filePath = join(process.cwd(), "content", bestandsnaam);
    const fileContent = readFileSync(filePath, "utf-8");
    const data: HandmatigeData = JSON.parse(fileContent);
    return data.wedstrijden;
  } catch (error) {
    console.error("Fout bij lezen handmatige wedstrijden:", error);
    return [];
  }
}

/** Mapt handmatige wedstrijden naar het gedeelde WedstrijdEvent-formaat. */
export function handmatigeNaarEvents(wedstrijden: HandmatigeWedstrijd[]): WedstrijdEvent[] {
  return wedstrijden.map((w) => ({
    summary: `⚽ ${w.thuis} - ${w.uit}`,
    start: new Date(w.datum),
    location: w.locatie,
    description: w.isThuis ? "Thuiswedstrijd" : "Uitwedstrijd",
  }));
}
