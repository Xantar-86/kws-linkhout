"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { teams, getTeamBySlug } from "@/lib/teams";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Clock, 
  Calendar, 
  User, 
  Users, 
  ArrowLeft,
  ExternalLink,
  X
} from "lucide-react";

function TeamContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showStandingsModal, setShowStandingsModal] = useState(false);
  
  const team = slug ? getTeamBySlug(slug) : null;

  if (!team) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link 
            href="/ploegen" 
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar overzicht
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="container-custom text-white">
          <div>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
              team.category === "senioren" ? "bg-blue-500/30" :
              team.category === "dames" ? "bg-pink-500/30" :
              "bg-green-500/30"
            }`}>
              {team.category === "senioren" ? "Senioren" :
               team.category === "dames" ? "Dames" : "Jeugd"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{team.name}</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {team.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Team Photo & Calendar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Team Photo */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="relative h-64 md:h-96">
                  <Image
                    src={team.image}
                    alt={team.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Over deze ploeg
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {team.description || `${team.name} is een belangrijke ploeg binnen KWS Linkhout. 
                    Met enthousiaste spelers en een gedreven trainersstaf wordt er wekelijks 
                    hard getraind om de beste resultaten te behalen.`}
                  </p>
                </div>
              </div>

              {/* Calendar iFrame */}
              {team.calendarIframe && (
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-primary text-white px-6 py-4 flex items-center gap-3">
                    <Calendar className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Wedstrijdkalender</h2>
                  </div>
                  <div className="p-4">
                    <div className="relative w-full h-[1000px] md:h-[1200px] overflow-hidden rounded-lg">
                      <iframe
                        src={team.calendarIframe}
                        title={`Wedstrijdkalender ${team.name}`}
                        className="w-full h-full border-0"
                        allow="fullscreen"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info Cards */}
            <div className="space-y-6">
              {/* Competition Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-primary" />
                  Competitie
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reeks</span>
                    <span className="font-semibold text-gray-900">{team.division}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  {/* Kalender opties */}
                  {team.calendarIframe ? (
                    <button 
                      onClick={() => setShowCalendarModal(true)}
                      className="flex items-center justify-center w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Bekijk kalender
                    </button>
                  ) : null}
                  
                  {team.calendarIcal ? (
                    <a 
                      href={team.calendarIcal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-2 px-4 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Toevoegen aan mijn kalender
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  ) : null}
                  
                  {!team.calendarIframe && !team.calendarIcal ? (
                    <a 
                      href="https://www.rbfa.be/nl/club/1595/ploegen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Wedstrijdkalender
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  ) : null}
                  
                  {/* Klassement */}
                  {team.standingsIframe ? (
                    <button 
                      onClick={() => setShowStandingsModal(true)}
                      className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mt-2"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Klassement
                    </button>
                  ) : (
                    <a 
                      href="https://www.rbfa.be/nl/club/1595/ploegen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mt-2"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Klassement
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  )}
                </div>
              </div>

              {/* Training Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  Training
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Dagen</p>
                      <p className="text-gray-600">{team.trainingDays.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 mr-3 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Tijd</p>
                      <p className="text-gray-600">{team.trainingTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coaches */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Trainers
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{team.coach}</p>
                      <p className="text-sm text-gray-500">Hoofdtrainer</p>
                    </div>
                  </div>
                  {team.assistantCoach && (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{team.assistantCoach}</p>
                        <p className="text-sm text-gray-500">Assistent</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Modal */}
      <AnimatePresence>
        {showCalendarModal && team.calendarIframe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCalendarModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-full sm:max-w-[95vw] max-h-[90vh] overflow-hidden mx-2 sm:mx-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Wedstrijdkalender - {team.name}</h2>
                </div>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Content - iFrame */}
              <div className="relative w-full h-[50vh] sm:h-[70vh] bg-gray-50 p-2 sm:p-4">
                <div className="w-full h-full overflow-x-auto">
                  <iframe
                    src={team.calendarIframe}
                    title={`Wedstrijdkalender ${team.name}`}
                    className="w-full min-w-[600px] sm:min-w-full h-full border-0 rounded-lg shadow-sm bg-white"
                    allow="fullscreen"
                  />
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Data via <a href="https://www.foot24.be" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Foot24.be</a>
                </p>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Sluiten
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standings Modal */}
      <AnimatePresence>
        {showStandingsModal && team.standingsIframe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowStandingsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-full sm:max-w-[95vw] max-h-[90vh] overflow-hidden mx-2 sm:mx-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="text-white px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#8c1d1c' }}>
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Klassement - {team.name}</h2>
                </div>
                <button
                  onClick={() => setShowStandingsModal(false)}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Content - iFrame */}
              <div className="relative w-full h-[50vh] sm:h-[70vh] bg-gray-50 p-2 sm:p-4">
                <div className="w-full h-full overflow-x-auto">
                  <iframe
                    src={team.standingsIframe}
                    title={`Klassement ${team.name}`}
                    className="w-full min-w-[600px] sm:min-w-full h-full border-0 rounded-lg shadow-sm bg-white"
                    allow="fullscreen"
                  />
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Data via <a href="https://www.voetbalinbelgie.be" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: '#8c1d1c' }}>Voetbal in België</a>
                </p>
                <button
                  onClick={() => setShowStandingsModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Sluiten
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main component wrapped in Suspense for useSearchParams
export default function TeamPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <TeamContent />
    </React.Suspense>
  );
}