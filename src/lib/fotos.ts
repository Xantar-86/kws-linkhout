export interface FotoAlbum {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  googlePhotosUrl: string;
  fotoCount: number | null;
  category?: string;
  images: string[];
}

// Default thumbnail als fallback
export const DEFAULT_THUMBNAIL = "/images/news/kws-info.jpg";

// CMS foto albums ophalen
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function extractImages(raw: unknown): string[] {
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

export async function getCmsFotoAlbums(): Promise<FotoAlbum[]> {
  try {
    const contentDirectory = path.join(process.cwd(), "content", "fotos");

    if (!fs.existsSync(contentDirectory)) {
      return [];
    }

    const files = fs.readdirSync(contentDirectory);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    return mdFiles.map((file) => {
      const filePath = path.join(contentDirectory, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);
      const images = extractImages(data.images);

      return {
        id: data.id || file.replace(".md", ""),
        title: data.title || "Geen titel",
        description: data.description || "",
        date: data.date || "",
        thumbnail: data.thumbnail || DEFAULT_THUMBNAIL,
        googlePhotosUrl: data.googlePhotosUrl || "",
        fotoCount: data.fotoCount ?? (images.length > 0 ? images.length : null),
        category: data.category || "",
        images,
      };
    });
  } catch (error) {
    console.error("Fout bij lezen CMS foto albums:", error);
    return [];
  }
}

// Alle foto albums (uit CMS)
export async function getAllFotoAlbums(): Promise<FotoAlbum[]> {
  const albums = await getCmsFotoAlbums();
  // Sorteer op datum (nieuwste eerst, leeg datum = onderaan)
  return albums.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getFotoAlbumById(id: string): Promise<FotoAlbum | null> {
  const albums = await getCmsFotoAlbums();
  return albums.find((a) => a.id === id) || null;
}

// Client-side (leeg - alles uit CMS)
export const fotoAlbums: FotoAlbum[] = [];
