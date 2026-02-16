"use client";

import { motion } from "framer-motion";
import { Heart, ArrowLeft, MapPin, Activity, AlertCircle, Play } from "lucide-react";
import Link from "next/link";

const aedLocatie = {
  locatie: "Kantine - Hoofdingang (buiten)",
  beschrijving: "AED bevestigd aan de buitenmuur van de kantine bij de hoofdingang. Altijd toegankelijk, ook wanneer de kantine gesloten is.",
  beschikbaar: "24/7 toegankelijk"
};

const reanimatieStappen = [
  {
    nummer: "1",
    titel: "Check Bewustzijn",
    beschrijving: "Schud de persoon voorzichtig en vraag of alles oké is."
  },
  {
    nummer: "2",
    titel: "Bel 112",
    beschrijving: "Bel onmiddellijk 112 of laat iemand anders bellen."
  },
  {
    nummer: "3",
    titel: "Start Reanimatie",
    beschrijving: "Begin met 30 borstcompressies gevolgd door 2 beademingen."
  },
  {
    nummer: "4",
    titel: "Gebruik AED",
    beschrijving: "Laat iemand de AED halen en volg de gesproken instructies."
  }
];

export default function ReanimatieDefibrillatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/medisch" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar medisch
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Levensreddend</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Reanimatie & Defibrillator</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Onze club is uitgerust met een AED-toestel en getraind personeel. 
              Snel handelen bij een hartstilstand kan levens redden.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* AED Locatie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-pink-50 rounded-2xl p-8 border border-pink-100 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-pink-900">AED Locatie</h2>
              </div>
              <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{aedLocatie.locatie}</h3>
                  <p className="text-gray-600">{aedLocatie.beschrijving}</p>
                </div>
                <div className="text-sm text-pink-700 bg-pink-50 px-4 py-2 rounded-full">
                  {aedLocatie.beschikbaar}
                </div>
              </div>
            </motion.div>

            {/* Reanimation Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Reanimatie: De 4 Stappen</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {reanimatieStappen.map((stap, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 flex gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold flex-shrink-0">
                      {stap.nummer}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{stap.titel}</h3>
                      <p className="text-gray-600 text-sm">{stap.beschrijving}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Video: AED Gebruik */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-blue-50 rounded-2xl p-8 border border-blue-100 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                  <Play className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-blue-900">Instructievideo: AED Gebruik</h2>
              </div>
              <p className="text-blue-800 mb-4">
                Bekijk deze instructievideo om te leren hoe je een AED correct gebruikt bij een hartstilstand.
              </p>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src="https://www.youtube.com/embed/dCNOIwbzUb4"
                  title="AED gebruiken bij reanimatie - Instructievideo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <a 
                href="https://www.youtube.com/watch?v=dCNOIwbzUb4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-blue-700 hover:text-blue-900 font-medium"
              >
                <Play className="w-4 h-4" />
                Bekijk op YouTube
              </a>
            </motion.div>

            {/* Important Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-red-50 rounded-2xl p-8 border border-red-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-red-900">Belangrijke Informatie</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6 text-red-800">
                <div>
                  <h4 className="font-semibold mb-2">AED Gebruik</h4>
                  <p className="text-sm">
                    Het AED-toestel geeft gesproken instructies. Iedereen kan het gebruiken, 
                    ook zonder voorafgaande training. Het toestel analyseert het hartritme 
                    en geeft enkel een schok als dit nodig is.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Getraind Personeel</h4>
                  <p className="text-sm">
                    Meerdere clubmedewerkers en trainers zijn opgeleid in reanimatie en AED-gebruik. 
                    Bij elke wedstrijd en training is minstens één persoon met EHBO-kennis aanwezig.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
