import { NextResponse } from "next/server";
import { parseICS, getToekomstigeWedstrijden } from "@/lib/ics-parser";

export async function GET() {
  try {
    const response = await fetch(
      "https://ical.voetbalinbelgie.be/competities/2025-2026/limburg/mannen/2a/?c=linkhout-kws",
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
    });
  } catch (error) {
    console.error("Error fetching wedstrijden:", error);
    return NextResponse.json(
      { wedstrijden: [], volgende: null, error: String(error) },
      { status: 500 }
    );
  }
}
