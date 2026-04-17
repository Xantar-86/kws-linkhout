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
function parseDutchDate(s: string): number {
  if (!s) return 0;
  const lower = s.toLowerCase();
  const dayMatch = lower.match(/(\d+)/);
  const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;
  let monthIdx: number | undefined;
  for (const name of Object.keys(DUTCH_MONTHS)) {
    if (lower.includes(name)) {
      monthIdx = DUTCH_MONTHS[name];
      break;
    }
  }
  if (monthIdx === undefined) return 0;
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
