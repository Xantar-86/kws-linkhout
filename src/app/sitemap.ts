import type { MetadataRoute } from "next";
import { getAllBerichten } from "@/lib/berichten";
import { getAllNieuwsbrieven } from "@/lib/nieuwsbrieven";
import { getCmsFotoAlbums } from "@/lib/fotos";
import { teams } from "@/lib/teams";

/**
 * De sitemap, gemaakt bij de build.
 *
 * Stond er tot nu toe niet. Een sitemap vervangt geen goede interne links,
 * maar hij vertelt Google wel meteen welke pagina's er zijn en wanneer ze
 * laatst wijzigden. Voor een site waar berichten en albums via het CMS
 * bijkomen, scheelt dat weken.
 *
 * Wat hier bewust NIET in staat: de clubinfo-secties en de nieuwsartikels.
 * Die leven vandaag achter een vraagteken (/clubinfo/sectie?slug=...) en zijn
 * dus geen eigen adres. Zodra ze een echt pad hebben, horen ze hier bij. De
 * ploegen hebben dat sinds september 2026 wel (/ploegen/u9-a).
 */

const BASIS = "https://www.kwslinkhout.be";

const VASTE_PAGINAS: { pad: string; prioriteit: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { pad: "", prioriteit: 1.0, freq: "weekly" },
  // De belangrijkste pagina na de startpagina: hier sluit iemand aan.
  { pad: "/word-lid", prioriteit: 0.9, freq: "monthly" },
  { pad: "/ploegen", prioriteit: 0.9, freq: "weekly" },
  { pad: "/jeugdopleiding", prioriteit: 0.8, freq: "monthly" },
  { pad: "/jeugdopleiding/trainingsschema-25-26", prioriteit: 0.8, freq: "monthly" },
  { pad: "/jeugdopleiding/opleidingsplan", prioriteit: 0.5, freq: "yearly" },
  { pad: "/jeugdopleiding/opleidingsvisie-vfv", prioriteit: 0.4, freq: "yearly" },
  { pad: "/jeugdopleiding/fair-play", prioriteit: 0.4, freq: "yearly" },
  { pad: "/jeugdopleiding/panathloncharter", prioriteit: 0.4, freq: "yearly" },
  { pad: "/jeugdopleiding/charter-anti-racisme", prioriteit: 0.4, freq: "yearly" },
  { pad: "/jeugdopleiding/foot-pass", prioriteit: 0.4, freq: "yearly" },
  { pad: "/jeugdopleiding/lidgeld-ondersteuning", prioriteit: 0.7, freq: "yearly" },
  { pad: "/ploegen/dames-over-ons", prioriteit: 0.6, freq: "yearly" },
  { pad: "/nieuws", prioriteit: 0.8, freq: "weekly" },
  { pad: "/nieuws/events", prioriteit: 0.7, freq: "monthly" },
  { pad: "/berichten", prioriteit: 0.7, freq: "weekly" },
  { pad: "/nieuwsbrief", prioriteit: 0.4, freq: "monthly" },
  { pad: "/contact", prioriteit: 0.8, freq: "yearly" },
  { pad: "/clubinfo", prioriteit: 0.7, freq: "yearly" },
  { pad: "/medisch", prioriteit: 0.5, freq: "yearly" },
  { pad: "/medisch/voetbalongeval", prioriteit: 0.5, freq: "yearly" },
  { pad: "/medisch/ehbo", prioriteit: 0.5, freq: "yearly" },
  { pad: "/medisch/reanimatie-defibrillator", prioriteit: 0.5, freq: "yearly" },
  { pad: "/medisch/medische-omkadering", prioriteit: 0.3, freq: "yearly" },
  { pad: "/medisch/veilig-vervoer-kinderen", prioriteit: 0.3, freq: "yearly" },
  { pad: "/medisch/voeding", prioriteit: 0.3, freq: "yearly" },
  { pad: "/medisch/alcohol", prioriteit: 0.3, freq: "yearly" },
  { pad: "/medisch/voorstelling", prioriteit: 0.3, freq: "yearly" },
  { pad: "/fotos", prioriteit: 0.5, freq: "monthly" },
  { pad: "/in-de-krant", prioriteit: 0.3, freq: "monthly" },
  { pad: "/digitaal-betalen", prioriteit: 0.4, freq: "yearly" },
  { pad: "/documenten-mutualiteit", prioriteit: 0.5, freq: "yearly" },
];

/** Een datum uit de content, of vandaag als er geen bruikbare datum is. */
function datum(waarde?: string): Date {
  if (!waarde) return new Date();
  const d = new Date(waarde);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const nu = new Date();

  // Faalt een van deze drie, dan hoort de sitemap er nog te zijn met de rest
  // erin; een lege sitemap is erger dan een onvolledige.
  const [berichten, nieuwsbrieven, albums] = await Promise.all([
    getAllBerichten().catch(() => []),
    getAllNieuwsbrieven().catch(() => []),
    getCmsFotoAlbums().catch(() => []),
  ]);

  return [
    ...VASTE_PAGINAS.map((p) => ({
      url: `${BASIS}${p.pad}`,
      lastModified: nu,
      changeFrequency: p.freq,
      priority: p.prioriteit,
    })),
    ...teams.map((t) => ({
      url: `${BASIS}/ploegen/${t.slug}`,
      lastModified: nu,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...berichten.map((b) => ({
      url: `${BASIS}/berichten/${b.slug}`,
      lastModified: datum(b.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...nieuwsbrieven.map((n) => ({
      url: `${BASIS}/nieuwsbrief/${n.slug}`,
      lastModified: datum(n.date),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    ...albums.map((a) => ({
      url: `${BASIS}/fotos/${a.id}`,
      lastModified: datum(a.date),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
