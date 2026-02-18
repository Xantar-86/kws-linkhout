"use client";

import { motion } from "framer-motion";
import { Car, ArrowLeft, Users, AlertTriangle, CheckCircle, Download, FileText } from "lucide-react";
import Link from "next/link";

const basisRegels = [
  "Gebruik altijd een goedgekeurd kinderzitje of verhoger voor kinderen onder 1,35m",
  "Controleer of alle kinderen correct vastgemaakt zijn met de veiligheidsgordel",
  "Zorg voor een geldig rijbewijs en verzekering",
  "Vermoeid rijden is uit den boze - neem bij vermoeidheid een pauze",
  "Geen alcohol voor de bestuurder - zero tolerance"
];

const organisatieRegels = [
  "De club voorziet een vervoerslijst met contactgegevens van ouders",
  "Minstens één volwassene in de wagen moet 21 jaar of ouder zijn",
  "Bij grote afstanden wordt een pauze ingelast elke 2 uur",
  "Er is altijd een opvolgnummer beschikbaar van een verantwoordelijke",
  "Bij vertraging informeert de chauffeur de ouders onmiddellijk"
];

const verantwoordelijkheden = [
  {
    groep: "Chauffeur",
    taken: ["Controleer de veiligheidsgordels", "Rij voorzichtig en volg de verkeersregels", "Hou de pauzes in acht", "Hou het opvolgnummer bij de hand"]
  },
  {
    groep: "Club",
    taken: ["Screening van chauffeurs", "Verzekering vervoerspelers", "Vervoerslijsten beheren", "Voorzien van noodnummers"]
  },
  {
    groep: "Ouders",
    taken: ["Informeren bij ziekte of afwezigheid", "Zorgen voor juiste afhaaltijden", "Up-to-date contactgegevens", "Toestemming voor vervoer"]
  }
];

export default function VeiligVervoerKinderenPage() {
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
      <section className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 py-16">
        <div className="container-custom text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Car className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Veilig Vervoer Kinderen</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              De veiligheid van onze jeugdspelers staat centraal, ook tijdens het vervoer.
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
            {/* Introductie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-green-50 rounded-2xl p-8 border border-green-100 mb-8"
            >
              <p className="text-green-800 leading-relaxed mb-4">
                Het is soms handig om je kind met een andere ouder mee te geven naar een training of match.
              </p>
              <p className="text-green-800 leading-relaxed mb-4">
                Hieronder kan je tips vinden en de wet nalezen omtrent het vastmaken van kinderen in de auto.
              </p>
              <p className="text-green-800 font-semibold">
                KWS Linkhout wenst iedereen een veilige rit toe!
              </p>
            </motion.div>

            {/* Download PDF */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mb-8"
            >
              <a
                href="/Docs/medisch/veilig-vervoer.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-primary text-white rounded-xl p-6 hover:bg-primary-700 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Veilig Vervoer - Informatie & Wetgeving</h3>
                  <p className="text-white/80 text-sm">Download de complete handleiding over veilig vervoer van kinderen</p>
                </div>
                <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
              </a>
            </motion.div>

            {/* Basic Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-orange-50 rounded-2xl p-8 border border-orange-100 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-orange-900">Basisregels</h2>
              </div>
              <ul className="space-y-3">
                {basisRegels.map((regel, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-orange-800">{regel}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Organization Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-blue-50 rounded-2xl p-8 border border-blue-100 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-blue-900">Organisatie</h2>
              </div>
              <ul className="space-y-3">
                {organisatieRegels.map((regel, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-blue-800">{regel}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid md:grid-cols-3 gap-4"
            >
              {verantwoordelijkheden.map((resp, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{resp.groep}</h3>
                  <ul className="space-y-2">
                    {resp.taken.map((taak, i) => (
                      <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                        {taak}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>

            {/* Warning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 bg-red-50 rounded-2xl p-8 border border-red-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-red-900">Belangrijk</h3>
              </div>
              <p className="text-red-800">
                Bij twijfel over de veiligheid van een voertuig of de rijvaardigheid van een chauffeur, 
                neem dan contact op met de verantwoordelijke van de ploeg. De veiligheid van de kinderen 
                primeert altijd boven het vervoer.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
