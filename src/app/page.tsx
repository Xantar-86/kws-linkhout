import { Aankondiging } from "@/components/home/Aankondiging";
import { HeroSection } from "@/components/home/HeroSection";
import { WedstrijdenSection } from "@/components/home/WedstrijdenSection";
import { AboutSection } from "@/components/home/AboutSection";
import { StatsSection } from "@/components/home/StatsSection";
import { EvenementenSection } from "@/components/home/EvenementenSection";
import { BerichtenSection } from "@/components/home/BerichtenSection";
import { MediaSection } from "@/components/home/MediaSection";
import { QuickLinksSection } from "@/components/home/QuickLinksSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { SlotCTA } from "@/components/home/SlotCTA";
import { getUpcomingEvents } from "@/lib/events";
import { getRecenteBerichten } from "@/lib/berichten";

/**
 * De startpagina.
 *
 * De volgorde is een verhaal, en elke sectie beantwoordt de vraag die de
 * vorige oproept:
 *
 *   1. Hero            Wie is dit?           Een club, sinds 1938.
 *   2. Wedstrijden     Wanneer spelen ze?    Dit weekend, deze uren.
 *   3. Over de club    Waarom zij?           Omdat het meer is dan voetbal.
 *   4. Cijfers         Is dat waar?          88 jaar, 25 ploegen, 300+ leden.
 *   5. Evenementen     Leeft het er?         Kijk maar naar de kalender.
 *   6. Berichten       Wat gebeurt er?       Dit, vorige week nog.
 *   7. Media           Hoe ziet dat eruit?   Zie het zelf.
 *   8. Snel naar       Ik moet iets regelen. Hier, in één klik.
 *   9. Sponsors        Wie staat erachter?   Deze ondernemers.
 *  10. Word lid        Wat nu?               Kom eens langs.
 *
 * Het licht wisselt daarbij om de sectie: donker, licht, wit, donker, en zo
 * verder tot het slot weer donker is. Die afwisseling is wat een lange pagina
 * in hoofdstukken deelt zonder dat er een streep tussen hoeft.
 *
 * De twee zwaarste secties, wedstrijden en evenementen, staan bewust vooraan.
 * De meeste bezoekers komen voor precies die twee, en die horen niet eerst
 * langs het clubverhaal te moeten scrollen.
 */
export default async function Home() {
  const [events, berichten] = await Promise.all([
    getUpcomingEvents(3),
    getRecenteBerichten(2),
  ]);

  return (
    <div className="min-h-screen">
      {/* Tijdelijk: verdwijnt vanzelf na zaterdag 3 oktober 2026. */}
      <Aankondiging />

      <HeroSection />
      <WedstrijdenSection />
      <AboutSection />
      <StatsSection />
      <EvenementenSection events={events} />
      <BerichtenSection berichten={berichten} />
      <MediaSection />
      <QuickLinksSection />
      <SponsorsSection />
      <SlotCTA />
    </div>
  );
}
