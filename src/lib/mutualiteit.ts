import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface MutualiteitDocument {
  naam: string;
  beschrijving: string;
  bestand: string;
}

export interface MutualiteitSectie {
  titel: string;
  volgorde: number;
  documenten: MutualiteitDocument[];
}

export async function getMutualiteitSecties(): Promise<MutualiteitSectie[]> {
  try {
    const dir = path.join(process.cwd(), "content", "mutualiteit-secties");
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

    const secties: MutualiteitSectie[] = files.map((file) => {
      const filePath = path.join(dir, file);
      const { data } = matter(fs.readFileSync(filePath, "utf8"));

      const rawDocs = Array.isArray(data.documenten) ? data.documenten : [];
      const documenten: MutualiteitDocument[] = rawDocs.map(
        (d: { naam?: unknown; beschrijving?: unknown; bestand?: unknown }) => ({
          naam: typeof d.naam === "string" ? d.naam : "",
          beschrijving: typeof d.beschrijving === "string" ? d.beschrijving : "",
          bestand: typeof d.bestand === "string" ? d.bestand : "",
        })
      );

      return {
        titel: typeof data.titel === "string" ? data.titel : "Onbenoemd",
        volgorde: typeof data.volgorde === "number" ? data.volgorde : 0,
        documenten: documenten.filter((d) => d.naam && d.bestand),
      };
    });

    return secties.sort((a, b) => a.volgorde - b.volgorde);
  } catch (error) {
    console.error("Fout bij lezen mutualiteit-secties:", error);
    return [];
  }
}
