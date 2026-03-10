import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { parseICS, getToekomstigeWedstrijden } from "@/lib/ics-parser";
import type { HandmatigeWedstrijd, HandmatigeData, WedstrijdEvent } from "@/types";

function getHandmatigeWedstrijden(): HandmatigeWedstrijd[] {
  try {
    const filePath = join(process.cwd(), "content", "wedstrijden-dames-2025-2026.json");
    const fileContent = readFileSync(filePath, "utf-8");
    const data: HandmatigeData = JSON.parse(fileContent);
    return data.wedstrijden;
  } catch (error) {
    console.error("Fout bij lezen handmatige wedstrijden:", error);
    return [];
  }
}

function handmatigeNaarEvents(wedstrijden: HandmatigeWedstrijd[]): WedstrijdEvent[] {
  return wedstrijden.map((w) => ({
    summary: `⚽ ${w.thuis} - ${w.uit}`,
    start: new Date(w.datum),
    location: w.locatie,
    description: w.isThuis ? "Thuiswedstrijd" : "Uitwedstrijd",
  }));
}

export async function GET() {
  try {
    // Eerst: handmatige wedstrijden (betrouwbaarder dan ICS feeds)
    const handmatigeWedstrijden = getHandmatigeWedstrijden();

    if (handmatigeWedstrijden.length > 0) {
      const events = handmatigeNaarEvents(handmatigeWedstrijden);
      const toekomstigeWedstrijden = getToekomstigeWedstrijden(events);

      if (toekomstigeWedstrijden.length > 0) {
        return NextResponse.json({
          wedstrijden: toekomstigeWedstrijden,
          volgende: toekomstigeWedstrijden[0] || null,
          bron: "handmatig",
        });
      }
    }

    // Fallback: VoetbalinBelgie.be ICS feed
    const response = await fetch(
      "https://ical.voetbalinbelgie.be/competities/2025-2026/limburg/vrouwen/2/?c=linkhout-kws",
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ICS");
    }

    const icsData = await response.text();
    const events = parseICS(icsData);
    const toekomstigeWedstrijden = getToekomstigeWedstrijden(events);

    return NextResponse.json({
      wedstrijden: toekomstigeWedstrijden,
      volgende: toekomstigeWedstrijden[0] || null,
      bron: "ics",
    });
  } catch (error) {
    console.error("Error fetching dames wedstrijden:", error);
    return NextResponse.json(
      { wedstrijden: [], volgende: null, error: String(error) },
      { status: 500 }
    );
  }
}
