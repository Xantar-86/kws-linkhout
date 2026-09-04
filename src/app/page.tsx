import { Aankondiging } from "@/components/home/Aankondiging";
import { HeroSection } from "@/components/home/HeroSection";
import { VolgendeWedstrijd } from "@/components/home/VolgendeWedstrijd";
import { AboutSection } from "@/components/home/AboutSection";
import { StatsSection } from "@/components/home/StatsSection";
import { NieuwsSection } from "@/components/home/NieuwsSection";
import { BerichtenSection } from "@/components/home/BerichtenSection";
import { MediaSection } from "@/components/home/MediaSection";
import { QuickLinksSection } from "@/components/home/QuickLinksSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { getUpcomingEvents } from "@/lib/events";
import { getRecenteBerichten } from "@/lib/berichten";

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

      <AboutSection />

      <VolgendeWedstrijd
        apiUrl="/api/wedstrijden"
        kalenderUrl="https://www.rbfa.be/nl/club/1595/ploeg/365216/kalender"
        titel="Heren P2 - Volgende Wedstrijd"
        kleur="primary"
      />
      <VolgendeWedstrijd
        apiUrl="/api/wedstrijden/p4"
        kalenderUrl="https://www.rbfa.be/nl/club/1595/ploeg/365215/kalender"
        titel="Heren P4 - Volgende Wedstrijd"
        kleur="primary"
      />
      <VolgendeWedstrijd
        apiUrl="/api/wedstrijden/dames"
        kalenderUrl="https://www.rbfa.be/nl/club/1595/ploeg/365217/kalender"
        titel="Dames - Volgende Wedstrijd"
        kleur="pink"
      />
      <StatsSection />
      <NieuwsSection events={events} />
      <BerichtenSection berichten={berichten} />
      <MediaSection />
      <QuickLinksSection />
      <SponsorsSection />
    </div>
  );
}
