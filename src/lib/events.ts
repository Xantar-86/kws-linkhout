export interface Event {
  id: string;
  title: string;
  date: string;
  dateFull: string;
  description: string;
  color: string;
  location?: string;
  image?: string;
  addedAt?: number;
  sortDate?: number;
  /** Laatste dag van het evenement; bij één dag gelijk aan sortDate. */
  eindDate?: number;
}

// Kleuren mapping
export const colorOptions: Record<string, string> = {
  red: "from-red-500 to-red-700",
  pink: "from-pink-500 to-pink-700",
  green: "from-green-500 to-green-700",
  primary: "from-primary-500 to-primary-700",
  indigo: "from-indigo-500 to-indigo-700",
  yellow: "from-yellow-500 to-yellow-700",
  purple: "from-purple-500 to-purple-700",
  orange: "from-orange-500 to-orange-700",
  blue: "from-blue-500 to-blue-700",
  gray: "from-gray-500 to-gray-700"
};

// CMS events ophalen
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { execSync } from "child_process";

const DUTCH_MONTHS: Record<string, number> = {
  januari: 0, februari: 1, maart: 2, april: 3, mei: 4, juni: 5,
  juli: 6, augustus: 7, september: 8, oktober: 9, november: 10, december: 11,
};

// Parse Nederlandse datum als "25 mei 2026" of "13-14 maart 2026".
// Pakt de eerste dag, eerste gevonden maand, en het jaar (4-cijferig).
// Fallback jaar = huidig jaar. Retourneert unix seconds, of 0 bij falen.
//
// Met `laatsteDag` krijg je het einde van een meerdaags evenement in plaats
// van het begin. Zonder dat zou een mosselfeest van 23 en 24 oktober al op
// de 24ste uit de aankondigingen verdwijnen, terwijl het dan nog bezig is.
function parseDutchDate(s: string, laatsteDag = false): number {
  if (!s) return 0;
  const lower = s.toLowerCase();

  let monthIdx: number | undefined;
  let monthNaam = "";
  for (const name of Object.keys(DUTCH_MONTHS)) {
    if (lower.includes(name)) {
      monthIdx = DUTCH_MONTHS[name];
      monthNaam = name;
      break;
    }
  }
  if (monthIdx === undefined) return 0;

  // Alleen de cijfers vóór de maandnaam zijn dagen; het jaar staat erachter.
  const dagenDeel = lower.slice(0, lower.indexOf(monthNaam));
  const dagen = dagenDeel.match(/\d+/g)?.map((d) => parseInt(d, 10)) ?? [];
  const day = dagen.length === 0 ? 1 : laatsteDag ? dagen[dagen.length - 1] : dagen[0];

  const yearMatch = lower.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
  return Math.floor(new Date(year, monthIdx, day).getTime() / 1000);
}

function getLastCommitTime(filePath: string): number {
  try {
    const out = execSync(`git log -1 --format=%ct -- "${filePath}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out ? parseInt(out, 10) : 0;
  } catch {
    return 0;
  }
}

async function loadEvents(): Promise<Event[]> {
  try {
    const contentDirectory = path.join(process.cwd(), "content", "events");
    if (!fs.existsSync(contentDirectory)) return [];

    const files = fs.readdirSync(contentDirectory);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    return mdFiles.map((file, index) => {
      const filePath = path.join(contentDirectory, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);

      return {
        id: `event-${index}`,
        title: data.title || "Geen titel",
        date: data.date || "",
        dateFull: data.dateFull || data.date || "",
        description: data.description || "",
        color: colorOptions[data.color] || colorOptions.primary,
        location: data.location || "KWS Linkhout",
        image: data.image || undefined,
        addedAt: getLastCommitTime(filePath),
        sortDate: parseDutchDate(data.dateFull || data.date || ""),
        eindDate: parseDutchDate(data.dateFull || data.date || "", true),
      };
    });
  } catch (error) {
    console.error("Fout bij lezen CMS events:", error);
    return [];
  }
}

// Chronologisch op event-datum: eerstvolgende event bovenaan.
// Events zonder parseerbare datum komen helemaal onderaan.
export async function getAllEvents(): Promise<Event[]> {
  const events = await loadEvents();
  return events.sort((a, b) => {
    const aDate = a.sortDate || Number.MAX_SAFE_INTEGER;
    const bDate = b.sortDate || Number.MAX_SAFE_INTEGER;
    return aDate - bDate;
  });
}

// Aankomende events (vanaf vandaag), gesorteerd op datum.
//
// Voorbije evenementen komen hier niet meer bij. Ze aanvullen zodat de sectie
// nooit leeg oogt leverde het omgekeerde op: dan staat er in augustus nog een
// paasvoetbalkamp onder "aankomende evenementen".
export async function getUpcomingEvents(limit = 3): Promise<Event[]> {
  const events = await loadEvents();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartSec = Math.floor(todayStart.getTime() / 1000);

  return events
    .filter((e) => e.sortDate && e.sortDate > 0)
    // Een meerdaags evenement blijft staan tot en met de laatste dag.
    .filter((e) => (e.eindDate || e.sortDate)! >= todayStartSec)
    .sort((a, b) => (a.sortDate as number) - (b.sortDate as number))
    .slice(0, limit);
}

// Laatst toegevoegd/bewerkt eerst (op basis van git commit tijd).
export async function getRecentlyAddedEvents(limit = 3): Promise<Event[]> {
  const events = await loadEvents();
  return events
    .slice()
    .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0))
    .slice(0, limit);
}

// Behoud voor backwards-compat
export const getCmsEvents = getAllEvents;

// Client-side (leeg - alles komt uit CMS)
export const events: Event[] = [];
