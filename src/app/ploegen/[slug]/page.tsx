import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { teams, getTeamBySlug } from "@/lib/teams";
import TeamClient from "./Client";

/**
 * Elke ploeg heeft een eigen adres: /ploegen/u9-a in plaats van
 * /ploegen/team?slug=u9-a.
 *
 * Voor Google telden de 25 ploegen vroeger als een pagina met een parameter;
 * nu is elke ploeg een pagina met eigen titel, beschrijving en canonical, en
 * staan ze allemaal in de sitemap. De oude adressen worden blijvend
 * doorverwezen in next.config.ts.
 */

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return teams.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return {};

  const soort =
    team.category === "senioren" ? "seniorenploeg" : team.category === "dames" ? "dames- en meisjesploeg" : "jeugdploeg";
  const training =
    team.trainingDays.length > 0
      ? ` Training op ${team.trainingDays.join(" en ").toLowerCase()} van ${team.trainingTime}${team.trainingLocation ? ` in ${team.trainingLocation}` : ""}.`
      : "";

  return {
    // De naam van de club komt er via de titelsjabloon in layout.tsx al achter.
    title: `${team.name}, ${soort} in Lummen`,
    description: `${team.description ?? `De ${team.name} van KWS Linkhout in Lummen.`} Trainer: ${team.coach}.${training}`,
    alternates: { canonical: `/ploegen/${team.slug}` },
    openGraph: {
      title: `${team.name} | KWS Linkhout`,
      description: team.description,
      url: `https://www.kwslinkhout.be/ploegen/${team.slug}`,
      ...(team.image && !team.image.includes("under-construction") ? { images: [team.image] } : {}),
    },
  };
}

export default async function Pagina({ params }: Props) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) notFound();

  // De ploeg ook machineleesbaar, gekoppeld aan de club uit layout.tsx.
  const opmaak = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "@id": `https://www.kwslinkhout.be/ploegen/${team.slug}#ploeg`,
    name: `KWS Linkhout ${team.name}`,
    sport: "Voetbal",
    url: `https://www.kwslinkhout.be/ploegen/${team.slug}`,
    memberOf: { "@id": "https://www.kwslinkhout.be/#club" },
    coach: { "@type": "Person", name: team.coach },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(opmaak) }} />
      <TeamClient slug={slug} />
    </>
  );
}
