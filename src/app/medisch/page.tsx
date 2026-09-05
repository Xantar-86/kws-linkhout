"use client";

import { motion } from "framer-motion";
import { Stethoscope, AlertTriangle, Shield, Heart, Car, Apple, Wine, Target, Calendar, Users, Mail, HeartPulse } from "lucide-react";
import Link from "next/link";
import { PaginaKop } from "@/components/PaginaKop";

const medischModules = [
  {
    id: "medische-omkadering",
    title: "Medische Omkadering",
    description: "EHBO, certificeringen en medische voorzieningen",
    icon: Shield,
    color: "bg-blue-500"
  },
  {
    id: "ehbo",
    title: "EHBO",
    description: "Eerste hulp bij ongevallen: stappenplan, blessures en EHBO-koffer",
    icon: HeartPulse,
    color: "bg-teal-500"
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
      <PaginaKop
        opschrift="Medische cel"
        icoon={HeartPulse}
        titel="Medisch en veiligheid"
        accent="veiligheid"
        onder="Wat te doen bij een blessure of een ongeval, wie je daarvoor moet hebben, en hoe we op het terrein voorbereid zijn."
      />

      {/* Voorstelling Sectie */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="mb-14 border-l-2 border-primary/40 pl-6"
          >
            <p className="opschrift mb-3">
              <Target className="h-4 w-4" />
              Doelstelling
            </p>
            <p className="max-w-2xl text-xl leading-relaxed text-gray-800">
              Ervoor zorgen dat elk clublid zijn favoriete hobby kan uitoefenen in een gezonde
              omgeving.
            </p>
          </motion.div>

          {/* Acties */}
          <div className="space-y-8 mb-12">
            {/* Acties 2021-2023 */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              className="kaart border border-gray-100 overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-zand-200/70 px-6 py-5">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="heading-3">Acties 2021-2023</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {acties2021_2023.map((actie, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      <span className="text-gray-700">{actie}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Acties 2019-2020 */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              className="kaart border border-gray-100 overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-zand-200/70 px-6 py-5">
                  <Calendar className="h-5 w-5 text-primary" />
                <h2 className="heading-3">Acties 2019-2020</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {acties2019_2020.map((actie, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      <span className="text-gray-700">{actie}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Acties 2016-2017 */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              className="kaart border border-gray-100 overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-zand-200/70 px-6 py-5">
                  <Calendar className="h-5 w-5 text-primary" />
                <h2 className="heading-3">Acties 2016-2017</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {acties2016_2017.map((actie, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      <span className="text-gray-700">{actie}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Partners */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-gray-600" />
              <h2 className="heading-3">Partners</h2>
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
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="korrel lichtrand relative overflow-hidden rounded-2xl bg-inkt-950 p-8 text-center text-white"
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
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 mb-4">
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
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={`/medisch/${module.id}`}
                    className="group block kaart kaart-tilt p-6 hover:-translate-y-1 h-full border border-gray-100"
                  >
                    <div className={`w-14 h-14 ${module.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="heading-3 mb-2 group-hover:text-primary transition-colors">
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
      <section className="border-t border-zand-200/70 bg-zand-50 py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="kaart border-primary/20 p-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="heading-3">Noodgeval?</h3>
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
