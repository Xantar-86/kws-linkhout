import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Bericht {
  slug: string;
  title: string;
  date: string;
  intro: string;
  cover: string;
  body: string;
  fotos: string[];
}

function extractFotos(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "image" in item) {
        const val = (item as { image?: unknown }).image;
        return typeof val === "string" ? val : "";
      }
      return "";
    })
    .filter((s): s is string => !!s);
}

async function loadBerichten(): Promise<Bericht[]> {
  try {
    const dir = path.join(process.cwd(), "content", "berichten");
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

    return files.map((file) => {
      const filePath = path.join(dir, file);
      const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
      const fotos = extractFotos(data.fotos);

      return {
        slug: data.slug || file.replace(/\.md$/, ""),
        title: data.title || "Zonder titel",
        date: data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "",
        intro: data.intro || "",
        cover: data.cover || fotos[0] || "",
        body: content.trim(),
        fotos,
      };
    });
  } catch (error) {
    console.error("Fout bij lezen berichten:", error);
    return [];
  }
}

// Nieuwste eerst.
export async function getAllBerichten(): Promise<Bericht[]> {
  const berichten = await loadBerichten();
  return berichten.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getRecenteBerichten(limit = 2): Promise<Bericht[]> {
  const berichten = await getAllBerichten();
  return berichten.slice(0, limit);
}

export async function getBerichtBySlug(slug: string): Promise<Bericht | null> {
  const berichten = await loadBerichten();
  return berichten.find((b) => b.slug === slug) || null;
}
