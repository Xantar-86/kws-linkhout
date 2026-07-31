import { NextResponse } from "next/server";
import { getRbfaWedstrijden } from "@/lib/rbfa";
import { getToekomstigeWedstrijden } from "@/lib/ics-parser";

// 1ste Ploeg P4 (Eerste Elftal B) - RBFA-ploeg-ID seizoen 2026-2027
const P4_TEAM_ID = "365215";

export async function GET() {
  try {
    const events = await getRbfaWedstrijden(P4_TEAM_ID);
    const toekomstigeWedstrijden = getToekomstigeWedstrijden(events);

    return NextResponse.json({
      wedstrijden: toekomstigeWedstrijden,
      volgende: toekomstigeWedstrijden[0] || null,
      bron: "rbfa",
    });
  } catch (error) {
    console.error("Error fetching P4 wedstrijden:", error);
    return NextResponse.json(
      { wedstrijden: [], volgende: null, error: String(error) },
      { status: 500 }
    );
  }
}
