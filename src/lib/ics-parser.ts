import type { WedstrijdEvent } from "@/types";

/**
 * Parst een ICS-kalenderbestand en geeft een lijst van wedstrijden terug.
 */
export function parseICS(icsData: string): WedstrijdEvent[] {
  const events: WedstrijdEvent[] = [];

  const lines = icsData.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  let currentEvent: Partial<WedstrijdEvent> | null = null;

  for (let i = 0; i < lines.length; i++) {
    // Unfold RFC 5545 "folded" lines (vervolg begint met spatie)
    let fullLine = lines[i];
    while (i + 1 < lines.length && lines[i + 1].startsWith(" ")) {
      fullLine += lines[i + 1].substring(1);
      i++;
    }

    if (fullLine === "BEGIN:VEVENT") {
      currentEvent = { summary: "", start: new Date(), location: "", description: "" };
    } else if (fullLine === "END:VEVENT" && currentEvent) {
      events.push(currentEvent as WedstrijdEvent);
      currentEvent = null;
    } else if (currentEvent) {
      if (fullLine.startsWith("SUMMARY:")) {
        currentEvent.summary = fullLine.substring(8);
      } else if (fullLine.startsWith("DTSTART")) {
        // Ondersteun DTSTART:20250216T150000 en DTSTART;TZID=...:20250216T150000
        const colonIndex = fullLine.indexOf(":");
        if (colonIndex !== -1) {
          const dt = fullLine.substring(colonIndex + 1);
          const cleanDt = dt.replace("Z", "");
          if (cleanDt.length >= 15) {
            const year = parseInt(cleanDt.substring(0, 4));
            const month = parseInt(cleanDt.substring(4, 6)) - 1;
            const day = parseInt(cleanDt.substring(6, 8));
            const hour = parseInt(cleanDt.substring(9, 11));
            const minute = parseInt(cleanDt.substring(11, 13));
            currentEvent.start = dt.endsWith("Z")
              ? new Date(Date.UTC(year, month, day, hour, minute))
              : new Date(year, month, day, hour, minute);
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

/**
 * Filtert toekomstige wedstrijden en sorteert ze chronologisch.
 */
export function getToekomstigeWedstrijden(events: WedstrijdEvent[]): WedstrijdEvent[] {
  const now = new Date();
  return events
    .filter((w) => w.start > now)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}
