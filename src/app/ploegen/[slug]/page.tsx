import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { teams, getTeamBySlug } from "@/lib/teams";
import { getKlassement, getSeizoen, rbfaTeamId } from "@/lib/rbfa";
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

// Het klassement verandert na een speeldag. Elk uur opnieuw opbouwen houdt het
// vers zonder de bond bij elke bezoeker lastig te vallen.
export const revalidate = 3600;

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
    // Bewust opgebouwd uit feiten en niet uit team.description: dat is de
    // lopende tekst op de pagina zelf, en die is te lang voor een
    // zoekresultaat. Google knipt af rond 160 tekens.
    description: `De ${team.name} van KWS Linkhout in Lummen, ${team.division}. Trainer: ${team.coach}.${training}`,
    alternates: { canonical: `/ploegen/${team.slug}` },
    openGraph: {
      title: `${team.name} | KWS Linkhout`,
      description: `De ${team.name} van KWS Linkhout, ${team.division}.`,
      url: `https://www.kwslinkhout.be/ploegen/${team.slug}`,
      ...(team.image && !team.image.includes("under-construction") ? { images: [team.image] } : {}),
    },
  };
}

export default async function Pagina({ params }: Props) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) notFound();

  const rbfaId = rbfaTeamId([team.standingsIframe, team.calendarIframe]);
  // Het seizoen een keer ophalen: het klassement heeft het nodig om de
  // competitie te herkennen, en de kalender wordt er zelf mee opgebouwd.
  const seizoen = rbfaId ? await getSeizoen(rbfaId) : null;
  const klassement = rbfaId ? await getKlassement(rbfaId, seizoen) : null;
  // Zonder wedstrijden (of als de bond niet antwoordt) blijft de RBFA-site in
  // een venster staan. De links naar de bond zijn die uit teams.ts.
  const kalender =
    seizoen?.length && team.calendarIframe ? { seizoen, link: team.calendarIframe } : null;
  const klassementMetLink =
    klassement && team.standingsIframe ? { ...klassement, link: team.standingsIframe } : klassement;

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
      <TeamClient slug={slug} klassement={klassementMetLink} kalender={kalender} />
    </>
  );
}
