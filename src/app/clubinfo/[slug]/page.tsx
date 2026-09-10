import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clubInfoSections, getClubInfoBySlug } from "@/lib/clubinfo";
import ClubInfoClient from "./Client";

/**
 * Elke clubinfo-sectie een eigen adres: /clubinfo/privacyverklaring in plaats
 * van /clubinfo/sectie?slug=privacyverklaring. Zelfde reden als bij de
 * ploegen: een parameter is voor Google geen pagina. De oude adressen worden
 * blijvend doorverwezen in next.config.ts.
 */

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return clubInfoSections.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sectie = getClubInfoBySlug(slug);
  if (!sectie) return {};
  return {
    title: `${sectie.title} van KWS Linkhout`,
    description: sectie.description,
    alternates: { canonical: `/clubinfo/${sectie.slug}` },
    openGraph: {
      title: `${sectie.title} | KWS Linkhout`,
      description: sectie.description,
      url: `https://www.kwslinkhout.be/clubinfo/${sectie.slug}`,
    },
  };
}

export default async function Pagina({ params }: Props) {
  const { slug } = await params;
  if (!getClubInfoBySlug(slug)) notFound();
  return <ClubInfoClient slug={slug} />;
}
