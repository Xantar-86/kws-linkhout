import { HeroSection } from "@/components/home/HeroSection";
import { VolgendeWedstrijd } from "@/components/home/VolgendeWedstrijd";
import { AboutSection } from "@/components/home/AboutSection";
import { StatsSection } from "@/components/home/StatsSection";
import { NieuwsSection } from "@/components/home/NieuwsSection";
import { MediaSection } from "@/components/home/MediaSection";
import { QuickLinksSection } from "@/components/home/QuickLinksSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { getUpcomingEvents } from "@/lib/events";

export default async function Home() {
  const events = await getUpcomingEvents(3);

  return (
    <div className="min-h-screen">
      <HeroSection />

      <VolgendeWedstrijd
        apiUrl="/api/wedstrijden"
        kalenderUrl="https://www.rbfa.be/nl/club/1595/ploeg/337162/kalender"
        titel="Heren - Volgende Wedstrijd"
        kleur="primary"
      />
      <VolgendeWedstrijd
        apiUrl="/api/wedstrijden/dames"
        kalenderUrl="https://www.rbfa.be/nl/club/1595/ploeg/337160/kalender"
        titel="Dames - Volgende Wedstrijd"
        kleur="pink"
      />

      <AboutSection />
      <StatsSection />
      <NieuwsSection events={events} />
      <MediaSection />
      <QuickLinksSection />
      <SponsorsSection />
    </div>
  );
}
