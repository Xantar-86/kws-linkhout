"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { VolgendeWedstrijd } from "@/components/home/VolgendeWedstrijd";
import { AboutSection } from "@/components/home/AboutSection";
import { StatsSection } from "@/components/home/StatsSection";
import { NieuwsSection } from "@/components/home/NieuwsSection";
import { MediaSection } from "@/components/home/MediaSection";
import { QuickLinksSection } from "@/components/home/QuickLinksSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";

export default function Home() {
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
      <NieuwsSection />
      <MediaSection />
      <QuickLinksSection />
      <SponsorsSection />
    </div>
  );
}
