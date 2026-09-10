import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/lib/news";
import ArticleClient from "./Client";

/**
 * Elk nieuwsartikel een eigen adres: /nieuws/<slug> in plaats van
 * /nieuws/artikel?slug=<slug>. De artikels komen uit content/nieuws (Decap)
 * plus het vaste artikel in lib/news.ts; bij elke wijziging in het CMS bouwt
 * Vercel opnieuw, dus ze kunnen gewoon statisch. De oude adressen worden
 * blijvend doorverwezen in next.config.ts.
 */

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const artikels = await getAllArticles();
  return artikels.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

async function zoek(slug: string) {
  return (await getAllArticles()).find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artikel = await zoek(slug);
  if (!artikel) return {};
  return {
    title: artikel.title,
    description: artikel.excerpt,
    alternates: { canonical: `/nieuws/${artikel.slug}` },
    openGraph: {
      type: "article",
      title: artikel.title,
      description: artikel.excerpt,
      url: `https://www.kwslinkhout.be/nieuws/${artikel.slug}`,
      publishedTime: artikel.date,
      ...(artikel.image ? { images: [artikel.image] } : {}),
    },
  };
}

export default async function Pagina({ params }: Props) {
  const { slug } = await params;
  const artikel = await zoek(slug);
  if (!artikel) notFound();

  const opmaak = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: artikel.title,
    description: artikel.excerpt,
    datePublished: artikel.date,
    ...(artikel.image ? { image: [`https://www.kwslinkhout.be${artikel.image}`] } : {}),
    author: { "@type": "Organization", name: artikel.author || "KWS Linkhout" },
    publisher: { "@id": "https://www.kwslinkhout.be/#club" },
    mainEntityOfPage: `https://www.kwslinkhout.be/nieuws/${artikel.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(opmaak) }} />
      <ArticleClient article={artikel} />
    </>
  );
}
