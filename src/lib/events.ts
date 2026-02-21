export interface Event {
  id: string;
  title: string;
  date: string;
  dateFull: string;
  description: string;
  color: string;
  location?: string;
  image?: string;
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

export async function getCmsEvents(): Promise<Event[]> {
  try {
    const contentDirectory = path.join(process.cwd(), "content", "events");

    if (!fs.existsSync(contentDirectory)) {
      return [];
    }

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
      };
    });
  } catch (error) {
    console.error("Fout bij lezen CMS events:", error);
    return [];
  }
}

// Alle events (uit CMS)
export async function getAllEvents(): Promise<Event[]> {
  return await getCmsEvents();
}

// Client-side (leeg - alles komt uit CMS)
export const events: Event[] = [];
