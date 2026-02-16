"use client";

import { motion } from "framer-motion";
import { Heart, ArrowLeft, User, Users, UserCog } from "lucide-react";
import Link from "next/link";

const spelersRegels = [
  "Respecteer de tegenstander en de scheidsrechter",
  "Accepteer beslissingen zonder te protesteren",
  "Geef elkaar de hand voor en na de wedstrijd",
  "Moedig je ploeggenoten aan, ook na een fout",
  "Speel eerlijk - valsspelen is nooit oké",
  "Beheers je emoties en je taalgebruik",
  "Zorg voor propere kledij en materialen"
];

const oudersRegels = [
  "Moedig aan zonder overdreven druk",
  "Respecteer trainers, scheidsrechters en andere ouders",
  "Laat de trainer zijn werk doen",
  "Kom tijdig en haal tijdig op",
  "Geef het goede voorbeeld op de tribune",
  "Los problemen op via de juiste kanalen",
  "Ondersteun de club en vrijwilligers"
];

const trainersRegels = [
  "Zorg voor een veilige trainingsomgeving",
  "Respecteer alle spelers als individu",
  "Bevorder fair play en sportiviteit",
  "Geef constructieve feedback",
  "Werk samen met ouders en club",
  "Blijf jezelf ontwikkelen als trainer",
  "Zet de speler centraal, niet de uitslag"
];

export default function FairPlayPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/jeugdopleiding" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar jeugdopleiding
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Gedragsregels</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Fair Play Regels</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Fair play is de basis van onze clubcultuur. Deze regels gelden voor spelers, 
              ouders en trainers. Samen zorgen we voor een positieve sportomgeving.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Spelers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-red-50 rounded-2xl p-8 border border-red-100 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-red-900">Voor Spelers</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {spelersRegels.map((regel, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-red-800">{regel}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Ouders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-blue-50 rounded-2xl p-8 border border-blue-100 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-blue-900">Voor Ouders</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {oudersRegels.map((regel, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-blue-800">{regel}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Trainers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-green-50 rounded-2xl p-8 border border-green-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <UserCog className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-green-900">Voor Trainers</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {trainersRegels.map((regel, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-green-800">{regel}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 text-center bg-gray-50 rounded-xl p-8 border border-gray-200"
            >
              <blockquote className="text-xl italic text-gray-700 mb-4">
                "Het gaat niet om winnen of verliezen, maar om hoe je het spel speelt."
              </blockquote>
              <cite className="text-gray-500">— Pierre de Coubertin</cite>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
