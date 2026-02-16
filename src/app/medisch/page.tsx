"use client";

import { motion } from "framer-motion";
import { Stethoscope, AlertTriangle, Shield, Heart, Car, Apple, Wine, Target, Calendar, Users, Mail } from "lucide-react";
import Link from "next/link";

const medischModules = [
  {
    id: "medische-omkadering",
    title: "Medische Omkadering",
    description: "EHBO, certificeringen en medische voorzieningen",
    icon: Shield,
    color: "bg-blue-500"
  },
  {
    id: "voetbalongeval",
    title: "Voetbalongeval",
    description: "Wat te doen bij ongevallen, verzekering en formulieren",
    icon: AlertTriangle,
    color: "bg-red-500"
  },
  {
    id: "reanimatie-defibrillator",
    title: "Reanimatie & Defibrillator",
    description: "Informatie over AED en reanimatie op de club",
    icon: Heart,
    color: "bg-pink-500"
  },
  {
    id: "veilig-vervoer-kinderen",
    title: "Veilig Vervoer Kinderen",
    description: "Regels voor veilige vervoer van jeugdspelers",
    icon: Car,
    color: "bg-orange-500"
  },
  {
    id: "voeding",
    title: "Voeding",
    description: "Voedingsadvies voor jonge sporters",
    icon: Apple,
    color: "bg-emerald-500"
  },
  {
    id: "alcohol",
    title: "Alcoholbeleid",
    description: "Zero tolerance voor jeugd en verantwoord gebruik",
    icon: Wine,
    color: "bg-purple-500"
  }
];

const acties2021_2023 = [
  "Organisatie EHBO cursus (data toevoegen)",
  "Opfrissing van tips voor gezonde voeding en beweging, en alcoholgebruik naar de trainers",
  "Sensibilisering naar alle ouders en spelers over ongevalsprocedure, alcoholgebruik, gezonde voeding en beweging",
  "Update van website",
  "Veilig vervoer spelers",
  "Ongevalsprocedure",
  "Gezonde voeding"
];

const acties2019_2020 = [
  "Organisatie EHBO cursus (16 + 23/10/2019)"
];

const acties2016_2017 = [
  "Op punt zetten van website (medisch luik)",
  "Op punt zetten begeleiding jeugdspelers",
  "Gezonde voeding: aanbieden van fruit en water tijdens wedstrijden",
  "Veilig vervoer van spelers: BOB, Klik ze vast",
  "Alcohol binnen sportclubs: sensibiliseren van spelers (en hun omgeving) + trainers en afgevaardigden"
];

const partners = [
  "Versland Lummen",
  "VAD (Vereniging voor alcohol-en drugsproblematiek)",
  "CAD (Centrum ter preventie van alcohol-en drugsproblemen)",
  "BIVV",
  "Rode Kruis"
];

export default function MedischPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-900 via-red-800 to-red-700 py-20">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Stethoscope className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Medisch
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              De gezondheid en veiligheid van onze spelers staat voorop. 
              Ontdek ons medisch beleid en voorzieningen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Voorstelling Sectie */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-red-50 rounded-2xl p-8 border border-red-100 mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-red-600" />
              <h2 className="text-2xl font-bold text-red-900">Doelstelling</h2>
            </div>
            <p className="text-red-800 text-lg leading-relaxed">
              Ervoor zorgen dat elk clublid zijn favoriete hobby kan uitoefenen in een "gezonde" omgeving.
            </p>
          </motion.div>

          {/* Acties */}
          <div className="space-y-8 mb-12">
            {/* Acties 2021-2023 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-primary text-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Acties 2021-2023</h2>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {acties2021_2023.map((actie, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{actie}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Acties 2019-2020 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-blue-600 text-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Acties 2019-2020</h2>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {acties2019_2020.map((actie, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{actie}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Acties 2016-2017 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-emerald-600 text-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Acties 2016-2017</h2>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {acties2016_2017.map((actie, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{actie}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Partners</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map((partner, index) => (
                <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <span className="text-gray-700 font-medium">{partner}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-white rounded-2xl p-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="w-6 h-6" />
              <h2 className="text-xl font-bold">Contact</h2>
            </div>
            <a 
              href="mailto:info@kwslinkhout.be" 
              className="text-white/90 hover:text-white underline transition-colors"
            >
              info@kwslinkhout.be
            </a>
          </motion.div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Alle medische informatie
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Klik op een onderwerp voor meer details over onze medische diensten en veiligheidsprocedures.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medischModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/medisch/${module.id}`}
                    className="group block bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full border border-gray-100"
                  >
                    <div className={`w-14 h-14 ${module.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-600">
                      {module.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="bg-red-50 py-12 border-t border-red-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-red-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Noodgeval?</h3>
                <p className="text-gray-600">Bij acute medische noodgevallen</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-xl p-4">
                <p className="font-semibold text-red-900">112</p>
                <p className="text-red-700 text-sm">Algemeen noodnummer</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="font-semibold text-red-900">EHBO Verantwoordelijke</p>
                <p className="text-red-700 text-sm">Aanwezig tijdens trainingen en wedstrijden</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
