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
      "https://ical.voetbalinbelgie.be/competities/2025-2026/limburg/mannen/2a/?c=linkhout-kws",
      { next: { revalidate: 300 } } // Cache voor 5 minuten tijdens debugging
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch ICS");
    }
    
    const icsData = await response.text();
    const events = parseICS(icsData);
    
    // Debug: log alle events
    console.log("Geparste events:", events.length);
    
    const now = new Date();
    console.log("Huidige tijd:", now.toISOString());
    
    const toekomstigeWedstrijden = events
      .filter(w => {
        const isFuture = w.start > now;
        console.log(`Wedstrijd: ${w.summary}, Datum: ${w.start.toISOString()}, Toekomst: ${isFuture}`);
        return isFuture;
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    
    console.log("Toekomstige wedstrijden:", toekomstigeWedstrijden.length);
    
    return NextResponse.json({ 
      wedstrijden: toekomstigeWedstrijden,
      volgende: toekomstigeWedstrijden[0] || null,
      debug: {
        totalEvents: events.length,
        futureEvents: toekomstigeWedstrijden.length,
        now: now.toISOString()
      }
    });
  } catch (error) {
    console.error("Error fetching wedstrijden:", error);
    return NextResponse.json({ 
      wedstrijden: [],
      volgende: null,
      error: String(error)
    }, { status: 500 });
  }
}
