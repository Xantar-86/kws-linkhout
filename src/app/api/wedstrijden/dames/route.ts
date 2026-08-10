import { NextResponse } from "next/server";
import { getToekomstigeWedstrijden } from "@/lib/ics-parser";
import { getRbfaWedstrijden } from "@/lib/rbfa";
import { getHandmatigeWedstrijden, handmatigeNaarEvents } from "@/lib/wedstrijden-handmatig";

// Dames 1ste Ploeg P2 (Eerste Elftal Vrouwen A) - RBFA-ploeg-ID seizoen 2026-2027
const DAMES_TEAM_ID = "365217";

export async function GET() {
  try {
    // Eerst: handmatige wedstrijden (override; alleen als er nog toekomstige in staan)
    const handmatigeWedstrijden = getHandmatigeWedstrijden("wedstrijden-dames-2025-2026.json");

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
