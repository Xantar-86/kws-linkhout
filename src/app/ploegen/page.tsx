"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { teams, getTeamsByCategory } from "@/lib/teams";
import { Trophy, Clock, User, ChevronRight } from "lucide-react";

// Interfaces
interface TeamCardProps {
  team: typeof teams[0];
  index: number;
}



// TeamCard Component
function TeamCard({ team, index }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay: (index % 6) * 0.05 }}
    >
      <Link href={`/ploegen/team?slug=${team.slug}`} className="group block h-full">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
          <div className="relative h-48 overflow-hidden bg-gray-200">
            <Image
              src={team.image}
              alt={team.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                team.category === "senioren" ? "bg-blue-600" :
                team.category === "dames" ? "bg-pink-600" :
                "bg-green-600"
              }`}>
                {team.category === "senioren" ? "Senioren" :
                 team.category === "dames" ? "Dames" : "Jeugd"}
              </span>
            </div>
          </div>

          <div className="p-5 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
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
              
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2 text-primary" />
                <span>{team.coach}</span>
              </div>
            </div>

            <div className="flex items-center text-primary font-medium text-sm mt-auto pt-4 border-t border-gray-100">
              Bekijk details
              <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
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
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="w-2 h-8 bg-primary rounded-full mr-4" />
          {title}
          <span className="ml-4 text-lg font-normal text-gray-500">
            ({teamsList.length} ploegen)
          </span>
        </h2>
      </motion.div>

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
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              23 Ploegen • 250+ Leden
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Onze Ploegen
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Van U6 tot senioren, bij KWS Linkhout is er voor ieder wat wils.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-3 gap-4 mb-12"
          >
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-primary mb-1">{senioren.length}</div>
              <div className="text-gray-600 text-sm">Senioren</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-pink-600 mb-1">{dames.length}</div>
              <div className="text-gray-600 text-sm">Dames/Meisjes</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-1">{jeugd.length}</div>
              <div className="text-gray-600 text-sm">Jeugd</div>
            </div>
          </motion.div>

          <TeamSection id="senioren" title="Senioren" teamsList={senioren} startIndex={0} />
          <TeamSection id="dames" title="Dames & Meisjes" teamsList={dames} startIndex={senioren.length} />
          <TeamSection id="jeugd" title="Jeugd" teamsList={jeugd} startIndex={senioren.length + dames.length} />
        </div>
      </section>
    </div>
  );
}