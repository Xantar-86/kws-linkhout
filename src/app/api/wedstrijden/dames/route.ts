import { NextResponse } from "next/server";

// Simpele ICS parser
function parseICS(icsData: string) {
  const events: Array<{
    summary: string;
    start: Date;
    location: string;
    description: string;
  }> = [];
  
  const lines = icsData.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  let currentEvent: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Unfold continued lines
    let fullLine = line;
    while (i + 1 < lines.length && lines[i + 1].startsWith(" ")) {
      fullLine += lines[i + 1].substring(1);
      i++;
    }
    
    if (fullLine === "BEGIN:VEVENT") {
      currentEvent = { summary: "", start: new Date(), location: "", description: "" };
    } else if (fullLine === "END:VEVENT" && currentEvent) {
      events.push(currentEvent);
      currentEvent = null;
    } else if (currentEvent) {
      if (fullLine.startsWith("SUMMARY:")) {
        currentEvent.summary = fullLine.substring(8);
      } else if (fullLine.startsWith("DTSTART")) {
        // Ondersteun zowel DTSTART:20250216T150000 als DTSTART;TZID=...:20250216T150000
        const colonIndex = fullLine.indexOf(":");
        if (colonIndex !== -1) {
          const dt = fullLine.substring(colonIndex + 1);
          // Format: 20250216T150000 of 20250216T150000Z
          const cleanDt = dt.replace("Z", "");
          if (cleanDt.length >= 15) {
            const year = parseInt(cleanDt.substring(0, 4));
            const month = parseInt(cleanDt.substring(4, 6)) - 1;
            const day = parseInt(cleanDt.substring(6, 8));
            const hour = parseInt(cleanDt.substring(9, 11));
            const minute = parseInt(cleanDt.substring(11, 13));
            // Gebruik UTC als er Z was, anders lokale tijd
            if (dt.endsWith("Z")) {
              currentEvent.start = new Date(Date.UTC(year, month, day, hour, minute));
            } else {
              currentEvent.start = new Date(year, month, day, hour, minute);
            }
          }
        }
      } else if (fullLine.startsWith("LOCATION:")) {
        currentEvent.location = fullLine.substring(9);
      } else if (fullLine.startsWith("DESCRIPTION:")) {
        currentEvent.description = fullLine.substring(12).replace(/\\n/g, "\n");
      }
    }
  }
  
  return events;
}

export async function GET() {
  try {
    const response = await fetch(
      "https://www.foot24.be/nl/ical/ws-linkhout/1-vrouwen-596.ics?key=B1WjXx2",
      { next: { revalidate: 300 } } // Cache voor 5 minuten
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch ICS");
    }
    
    const icsData = await response.text();
    const events = parseICS(icsData);
    
    const now = new Date();
    const toekomstigeWedstrijden = events
      .filter(w => w.start > now)
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    
    return NextResponse.json({ 
      wedstrijden: toekomstigeWedstrijden,
      volgende: toekomstigeWedstrijden[0] || null
    });
  } catch (error) {
    console.error("Error fetching dames wedstrijden:", error);
    return NextResponse.json({ 
      wedstrijden: [],
      volgende: null,
      error: String(error)
    }, { status: 500 });
  }
}
