import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Nieuwsbrief {
  slug: string;
  title: string;
  date: string;
  preview: string;
  body: string;
}

async function loadNieuwsbrieven(): Promise<Nieuwsbrief[]> {
  try {
    const dir = path.join(process.cwd(), "content", "nieuwsbrieven");
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

    return files.map((file) => {
      const filePath = path.join(dir, file);
      const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
      // Filename is "YYYY-MM-DD-naam.md" (Decap-conventie) — strip de datum-prefix
      // zodat de URL-slug schoon is, bv. "einde-seizoen-2026".
      const fallbackSlug = file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
      return {
        slug: data.slug || fallbackSlug,
        title: data.title || "Zonder titel",
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
        preview: data.preview || "",
        body: content.trim(),
      };
    });
  } catch (error) {
    console.error("Fout bij lezen nieuwsbrieven:", error);
    return [];
  }
}

// Nieuwste eerst.
export async function getAllNieuwsbrieven(): Promise<Nieuwsbrief[]> {
  const list = await loadNieuwsbrieven();
  return list.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getNieuwsbriefBySlug(slug: string): Promise<Nieuwsbrief | null> {
  const list = await loadNieuwsbrieven();
  return list.find((n) => n.slug === slug) || null;
}
