import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { getToekomstigeWedstrijden } from "@/lib/ics-parser";
import { getRbfaWedstrijden } from "@/lib/rbfa";
import type { HandmatigeWedstrijd, HandmatigeData, WedstrijdEvent } from "@/types";

// Dames 1ste Ploeg P2 (Eerste Elftal Vrouwen A) - RBFA-ploeg-ID seizoen 2026-2027
const DAMES_TEAM_ID = "365217";

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
    // Eerst: handmatige wedstrijden (override; alleen als er nog toekomstige in staan)
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

    // Standaardbron: RBFA-kalender van de ploeg
    const events = await getRbfaWedstrijden(DAMES_TEAM_ID);
    const toekomstigeWedstrijden = getToekomstigeWedstrijden(events);

    return NextResponse.json({
      wedstrijden: toekomstigeWedstrijden,
      volgende: toekomstigeWedstrijden[0] || null,
      bron: "rbfa",
    });
  } catch (error) {
    console.error("Error fetching dames wedstrijden:", error);
    return NextResponse.json(
      { wedstrijden: [], volgende: null, error: String(error) },
      { status: 500 }
    );
  }
}
