"use client";

import { motion } from "framer-motion";
import { Shield, ArrowLeft, Heart, AlertTriangle, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

const beleidsPunten = [
  {
    titel: "EHBO-Voorzieningen",
    beschrijving: "Bij alle activiteiten is minstens één persoon met geldig EHBO-certificaat aanwezig. Onze EHBO-kits zijn altijd up-to-date.",
    icoon: Heart,
    kleur: "bg-red-500"
  },
  {
    titel: "Veiligheid Voorop",
    beschrijving: "We hanteren strikte veiligheidsprotocollen, van veilige vervoersregels tot blessurepreventie en correcte warming-up.",
    icoon: Shield,
    kleur: "bg-blue-500"
  },
  {
    titel: "Snelle Respons",
    beschrijving: "Bij incidenten weten onze vrijwilligers exact wat te doen: van eerste hulp tot contact met 112 en ouders.",
    icoon: AlertTriangle,
    kleur: "bg-orange-500"
  }
];

const verantwoordelijkheden = [
  "AED-toestel beschikbaar op de club",
  "Minstens 2 EHBO-gecertificeerde personen per activiteit",
  "Duidelijke noodprotocollen op elke ploeg",
  "Goed onderhouden EHBO-materiaal",
  "Samenwerking met lokale huisartsen en ziekenhuizen",
  "Jaarlijkse herhaling EHBO-trainingen"
];

export default function VoorstellingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/medisch" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar medisch
          </Link>
        </div>
      </div>

      <section className="bg-white py-12">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Ons beleid</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Voorstelling Medisch Beleid</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Bij KWS Linkhout staat de veiligheid en gezondheid van onze spelers centraal. 
              Ontdek hoe wij dit waarborgen.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Beleid Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {beleidsPunten.map((punt, index) => {
                const Icon = punt.icoon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                  >
                    <div className={`w-12 h-12 ${punt.kleur} rounded-xl flex items-center justify-center text-white mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{punt.titel}</h3>
                    <p className="text-gray-600">{punt.beschrijving}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Verantwoordelijkheden */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-green-50 rounded-2xl p-8 border border-green-100 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-green-900">Onze Verantwoordelijkheden</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {verantwoordelijkheden.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-green-800">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Samenwerking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-blue-50 rounded-2xl p-8 border border-blue-100"
            >
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Samenwerking</h2>
              <p className="text-blue-800 mb-4">
                Hoewel we geen vaste clubarts of fysiotherapeut in dienst hebben, werken we nauw samen 
                met lokale zorgverleners:
              </p>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Huisartsenpraktijken in de buurt voor snelle doorverwijzing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Ziekenhuis Ziekenhuis Netwerk Antwerpen (ZNA) voor spoedgevallen</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Erkende kinesitherapeuten voor blessurebegeleiding</span>
                </li>
              </ul>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 text-center bg-gray-50 rounded-xl p-8 border border-gray-200"
            >
              <blockquote className="text-xl italic text-gray-700 mb-4">
                "De veiligheid van onze spelers is onze hoogste prioriteit."
              </blockquote>
              <cite className="text-gray-500">— KWS Linkhout Bestuur</cite>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
