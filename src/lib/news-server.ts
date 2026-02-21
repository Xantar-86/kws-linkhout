"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { NewsArticle } from "./news";

// Server-only: Leest markdown bestanden uit content/nieuws
export async function getCmsArticles(): Promise<NewsArticle[]> {
  try {
    const contentDirectory = path.join(process.cwd(), "content", "nieuws");

    if (!fs.existsSync(contentDirectory)) {
      return [];
    }

    const files = fs.readdirSync(contentDirectory);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    return mdFiles.map((file, index) => {
      const filePath = path.join(contentDirectory, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      return {
        id: `cms-${index}`,
        slug: data.slug || file.replace(".md", ""),
        title: data.title || "Geen titel",
        excerpt: data.excerpt || "",
        content: content,
        category: data.category || "clubnieuws",
        image: data.image || "/images/news/kws-info.jpg",
        date: data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        author: data.author || "KWS Linkhout",
        readTime: data.readTime || 3,
        featured: data.featured || false,
        attachment: data.attachment || undefined,
      };
    });
  } catch (error) {
    console.error("Fout bij lezen CMS artikelen:", error);
    return [];
  }
}
