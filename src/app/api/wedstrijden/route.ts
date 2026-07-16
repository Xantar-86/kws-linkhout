import { NextResponse } from "next/server";
import { getRbfaWedstrijden } from "@/lib/rbfa";
import { getToekomstigeWedstrijden } from "@/lib/ics-parser";

// 1ste Ploeg P2 (Eerste Elftal A) - RBFA-ploeg-ID seizoen 2026-2027
const HEREN_TEAM_ID = "365216";

export async function GET() {
  try {
    const events = await getRbfaWedstrijden(HEREN_TEAM_ID);
    const toekomstigeWedstrijden = getToekomstigeWedstrijden(events);

    return NextResponse.json({
      wedstrijden: toekomstigeWedstrijden,
      volgende: toekomstigeWedstrijden[0] || null,
      bron: "rbfa",
    });
  } catch (error) {
    console.error("Error fetching wedstrijden:", error);
    return NextResponse.json(
      { wedstrijden: [], volgende: null, error: String(error) },
      { status: 500 }
    );
  }
}
