export interface PressArticle {
  id: string;
  title: string;
  source: string;
  sourceKey: string;
  sourceLogo: string;
  date: string;
  pdf: string;
  summary: string;
}

// Kranten bronnen mapping
export const newsSources: Record<string, { name: string; logo: string }> = {
  hbvl: {
    name: "Het Belang van Limburg",
    logo: "/images/press-thumbs/hbvl.jpg"
  },
  hln: {
    name: "Het Laatste Nieuws",
    logo: "/images/press-thumbs/hln.png"
  },
  nieuwsblad: {
    name: "Het Nieuwsblad",
    logo: "/images/press-thumbs/nieuwsblad.png"
  },
  andere: {
    name: "Andere krant",
    logo: "/images/press-thumbs/default.jpg"
  }
};

// CMS press artikelen ophalen
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function getCmsPressArticles(): Promise<PressArticle[]> {
  try {
    const contentDirectory = path.join(process.cwd(), "content", "press");

    if (!fs.existsSync(contentDirectory)) {
      return [];
    }

    const files = fs.readdirSync(contentDirectory);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    return mdFiles.map((file, index) => {
      const filePath = path.join(contentDirectory, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);

      // Bepaal de bron key en logo
      const sourceKey = data.sourceKey || "andere";
      const sourceInfo = newsSources[sourceKey] || newsSources.andere;

      return {
        id: `press-${index}`,
        title: data.title || "Geen titel",
        source: sourceInfo.name,
        sourceKey: sourceKey,
        sourceLogo: sourceInfo.logo,
        date: data.date || "",
        pdf: data.pdf || data.url || "",
        summary: data.summary || "",
      };
    });
  } catch (error) {
    console.error("Fout bij lezen CMS press artikelen:", error);
    return [];
  }
}

// Alle press artikelen (uit CMS)
export async function getAllPressArticles(): Promise<PressArticle[]> {
  const articles = await getCmsPressArticles();
  // Sorteer op datum (nieuwste eerst)
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getRecentPressArticles(limit: number = 5): Promise<PressArticle[]> {
  const articles = await getAllPressArticles();
  return articles.slice(0, limit);
}

// Client-side (leeg - alles uit CMS)
export const pressArticles: PressArticle[] = [];
