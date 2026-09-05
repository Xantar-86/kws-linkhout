"use client";

import { motion } from "framer-motion";
import { Wine, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { PaginaKop } from "@/components/PaginaKop";

export default function AlcoholPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <PaginaKop
        terug={{ naar: "/medisch", label: "Terug naar medisch" }}
        opschrift="Beleid"
        icoon={Wine}
        titel="Alcoholbeleid"
        onder="KWS Linkhout promoot een gezonde leefstijl. Ons alcoholbeleid beschermt jongeren en stimuleert verantwoord alcoholgebruik bij volwassenen."
      />

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 28 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-primary/5 rounded-2xl p-8 border border-zand-200/70"
            >
              <div className="space-y-6 text-primary">
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
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-primary/5 rounded-2xl p-8 border border-zand-200/70"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-primary">Meer Informatie</h2>
              </div>
              <p className="text-primary mb-4">
                Voor meer informatie over alcohol- en drugsbeleid kunt u terecht bij:
              </p>
              <a 
                href="https://www.integra-limburg.be/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary underline transition-colors font-medium"
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
