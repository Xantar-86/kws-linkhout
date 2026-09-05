"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { teams, getTeamsByCategory } from "@/lib/teams";
import { Trophy, Clock, User, ChevronRight, Users } from "lucide-react";
import { PaginaKop } from "@/components/PaginaKop";
import { SectieKop } from "@/components/SectieKop";
import { Onthul } from "@/components/beweging/Onthul";
import { trap } from "@/lib/beweging";

// Interfaces
interface TeamCardProps {
  team: typeof teams[0];
  index: number;
}



// TeamCard Component
function TeamCard({ team, index }: TeamCardProps) {
  return (
    <Onthul vertraging={(index % 6) * trap.kaart} className="h-full">
      <Link href={`/ploegen/team?slug=${team.slug}`} className="group block h-full">
        <div className="kaart kaart-tilt flex h-full flex-col overflow-hidden">
          <div className="relative h-48 overflow-hidden bg-zand-100">
            <Image
              src={team.image}
              alt={team.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute left-3 top-3">
              <span className="rounded-full bg-inkt-950/70 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                {team.category === "senioren" ? "Senioren" :
                 team.category === "dames" ? "Dames" : "Jeugd"}
              </span>
            </div>
          </div>

          <div className="flex flex-grow flex-col p-6">
            <h3 className="heading-3 mb-3 transition-colors group-hover:text-primary">
              {team.name}
            </h3>
            
            <div className="space-y-2 mb-4 flex-grow">
              <div className="flex items-center text-sm text-gray-600">
                <Trophy className="w-4 h-4 mr-2 text-primary" />
                <span>{team.division}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                <span>{team.trainingDays.join(", ")}</span>
              </div>
              
              {/* Zijn er twee gelijkwaardige trainers, dan horen ze hier
                  allebei te staan en niet alleen de eerste. */}
              <div className="flex items-start text-sm text-gray-600">
                <User className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-primary" />
                <span>
                  {[team.coach, team.assistantCoach].filter(Boolean).join(" en ")}
                </span>
              </div>
            </div>

            <div className="mt-auto flex items-center border-t border-zand-200/70 pt-4 text-sm font-semibold text-primary">
              Bekijk de ploeg
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </Onthul>
  );
}

// Section Component
interface TeamSectionProps {
  title: string;
  teamsList: typeof teams;
  startIndex: number;
  id?: string;
}

function TeamSection({ title, teamsList, startIndex, id }: TeamSectionProps) {
  if (teamsList.length === 0) return null;

  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <SectieKop
        uitlijning="links"
        opschrift={`${teamsList.length} ploegen`}
        titel={title}
        className="mb-10"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamsList.map((team, idx) => (
          <TeamCard key={team.id} team={team} index={startIndex + idx} />
        ))}
      </div>
    </section>
  );
}

// Main Page
export default function TeamsPage() {
  const senioren = getTeamsByCategory("senioren");
  const dames = getTeamsByCategory("dames");
  const jeugd = getTeamsByCategory("jeugd");

  useEffect(() => {
    // Reset scroll naar top onmiddellijk
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const hash = window.location.hash;
    if (hash) {
      // Verwijder de hash uit de URL
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      
      // Wacht tot alles geladen is, dan scroll naar sectie
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PaginaKop
        opschrift="25 ploegen, ruim 300 leden"
        icoon={Users}
        titel="Onze ploegen"
        accent="ploegen"
        onder="Van de voetbaltuin tot de veteranen, en van de eerste ploeg tot de dames. Kies je ploeg en je ziet meteen wie er traint, wanneer en waar."
      />

      <section className="section-padding">
        <div className="container-custom">
          {/* Drie snelkoppelingen naar de rubrieken eronder. Ze tellen niet
              alleen, ze brengen je er ook meteen naartoe. */}
          <Onthul className="mb-14">
            <div className="grid grid-cols-3 gap-4">
              {[
                { naar: "#senioren", aantal: senioren.length, label: "Senioren" },
                { naar: "#dames", aantal: dames.length, label: "Dames en meisjes" },
                { naar: "#jeugd", aantal: jeugd.length, label: "Jeugd" },
              ].map((r) => (
                <a
                  key={r.label}
                  href={r.naar}
                  className="kaart kaart-tilt block px-4 py-6 text-center"
                >
                  <div className="font-display text-4xl font-extrabold leading-none text-gray-900">
                    {r.aantal}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">{r.label}</div>
                </a>
              ))}
            </div>
          </Onthul>

          <TeamSection id="senioren" title="Senioren" teamsList={senioren} startIndex={0} />
          <TeamSection id="dames" title="Dames & Meisjes" teamsList={dames} startIndex={senioren.length} />
          <TeamSection id="jeugd" title="Jeugd" teamsList={jeugd} startIndex={senioren.length + dames.length} />
        </div>
      </section>
    </div>
  );
}