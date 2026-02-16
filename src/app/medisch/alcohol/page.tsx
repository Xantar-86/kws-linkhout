"use client";

import { motion } from "framer-motion";
import { Wine, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function AlcoholPage() {
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
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                <Wine className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Beleid</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Alcoholbeleid</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              KWS Linkhout promoot een gezonde leefstijl. Ons alcoholbeleid beschermt 
              jongeren en stimuleert verantwoord alcoholgebruik bij volwassenen.
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
            className="space-y-8"
          >
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-purple-50 rounded-2xl p-8 border border-purple-100"
            >
              <div className="space-y-6 text-purple-800">
                <p>
                  Gezondheid is een begrip dat door ons hoog in het vaandel wordt gedragen. 
                  Vandaar dat we jullie via deze weg willen laten weten dat we rond het thema 
                  "alcohol" actief meewerken aan een constructief beleid binnen onze club.
                </p>
                
                <p>
                  Het is immers geweten dat alcohol en andere psycho-affectieve middelen zoals 
                  nicotine, cannabis,… een negatieve invloed hebben op sportprestaties en de 
                  gezondheid in het algemeen. Om een constructief beleid te kunnen voeren, 
                  hebben we besloten om samen te werken met het <strong>VAD</strong> (vereniging 
                  voor alcohol-en drugsproblemen) en het <strong>ZorGGroep Zin - CGG</strong>. 
                  We zijn ervan overtuigd dat hun expertise en kennis hierbij zeker zullen helpen. 
                  Zo zullen onze trainers en afgevaardigden op regelmatige basis uitleg krijgen 
                  rond dit thema. Ook onze barmedewerkers zullen een opleiding krijgen door 
                  medewerkers van het ZorGGroep Zin - CGG.
                </p>
                
                <p>
                  Ook de <strong>BOB-campagne</strong> willen we nog even beklemtonen. 
                  Het moest maar eens jouw kind zijn dat het slachtoffer wordt van rijden onder invloed…
                </p>
                
                <p>
                  Graag willen we in de toekomst ook professionele gastsprekers uitnodigen 
                  om hun kennis met ons te delen.
                </p>
                
                <p>
                  Op deze manier hopen we te kunnen bouwen aan een sportieve, gezellige en 
                  warme club waar iedereen zich goed voelt en zo voor de volle 100% zijn 
                  hobby kan uitoefenen.
                </p>
              </div>
            </motion.div>

            {/* Link Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-blue-50 rounded-2xl p-8 border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Meer Informatie</h2>
              </div>
              <p className="text-blue-800 mb-4">
                Voor meer informatie over alcohol- en drugsbeleid kunt u terecht bij:
              </p>
              <a 
                href="https://www.integra-limburg.be/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 underline transition-colors font-medium"
              >
                integra-limburg.be
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
