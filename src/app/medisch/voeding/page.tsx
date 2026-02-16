"use client";

import { motion } from "framer-motion";
import { Apple, ArrowLeft, Clock, Droplets, Lightbulb } from "lucide-react";
import Link from "next/link";

const algemeneRichtlijnen = [
  "Eet gevarieerd en evenwichtig met voldoende groenten en fruit",
  "Kies voor volkoren granen in plaats van witte granen",
  "Drink voldoende water - minstens 1,5 liter per dag",
  "Beperk suikerrijke dranken en snacks",
  "Eet regelmatig: 3 hoofdmaaltijden en 2 gezonde tussendoortjes",
  "Vermijd zware maaltijden minder dan 2 uur voor de training"
];

const voorTraining = [
  "2-3 uur voor: Licht verteerbare maaltijd (pasta, rijst, brood)",
  "1 uur voor: Banaan of kleine portie gedroogd fruit",
  "30 min voor: Voldoende water drinken",
  "Vermijd: Vet voedsel, frisdrank en snoep"
];

const tijdensTraining = [
  "Drink water bij trainingen korter dan 1 uur",
  "Bij langere trainingen: sportdrank voor elektrolyten",
  "Neem kleine slokken, geen grote teugels",
  "Luister naar je lichaam - dorst is een teken van uitdroging"
];

const naTraining = [
  "Herstel vocht: drink 500ml water binnen 30 min",
  "Herstel glycogeenvoorraad: koolhydraten binnen 2 uur",
  "Spierherstel: eiwitrijke maaltijd (kip, vis, eieren, bonen)",
  "Vermijd alcohol volledig na de training"
];

const tips = [
  "Maak een weekmenu om gezonde keuzes makkelijker te maken",
  "Neem altijd een waterfles mee naar de training",
  "Bereid gezonde tussendoortjes voor (noten, fruit, yoghurt)",
  "Eet als team: gezonde gewoontes zijn aanstekelijk",
  "Vraag advies bij twijfel - onze trainers helpen graag"
];

export default function VoedingPage() {
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
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <Apple className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Gezonde Leefstijl</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Voeding</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Goede voeding is essentieel voor jonge sporters. Ontdek onze voedingsrichtlijnen 
              voor optimale prestaties en een gezonde ontwikkeling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Voedingsdriehoek Section */}
      <section className="section-padding bg-white border-b">
        <div className="container-custom max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100"
          >
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">Voedingsdriehoek</h2>
            
            <div className="space-y-6 text-emerald-800">
              <p>
                Een voeding evenwichtig samenstellen betekent de juiste balans vinden tussen de inname 
                van macronutriënten (vetten, koolhydraten, eiwitten en voedingsvezels), micronutriënten 
                (mineralen, spoorelementen en vitaminen) en water.
              </p>
              
              <p>
                De dagelijkse behoefte aan energie en aan de verschillende voedingsstoffen opgesteld 
                door de Hoge Gezondheidsraad vormen de basis van de theoretische voedingsaanbevelingen. 
                Zij worden weergegeven in de actieve voedingsdriehoek.
              </p>
              
              <p>
                De actieve voedingsdriehoek bevat 9 verschillende lagen. Acht groepen voedingsmiddelen 
                en één laag voor lichaamsbeweging. De indeling en keuze van de groepen is gebaseerd 
                op de aanbreng van voedingsstoffen. Hoe groter de groep, hoe meer van deze producten 
                nodig zijn voor een evenwichtige voeding. Het topje van de driehoek staat er los van 
                omdat het voedingsmiddelen bevat die niet echt nodig zijn in een doorsnee gezonde voeding.
              </p>
              
              <div>
                <p className="font-semibold mb-3">Gezond eten betekent:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Evenwicht:</strong> kiezen uit de verschillende groepen voedingsmiddelen en de verhouding respecteren.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Variatie:</strong> binnen elke groep variëren in de soorten, bijvoorbeeld niet elke dag dezelfde groenten eten.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Matigheid:</strong> de dagelijks aanbevolen hoeveelheden per groep respecteren</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-emerald-200">
                <p className="font-semibold mb-3">Meer informatie kan u altijd vinden via:</p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://www.health.belgium.be/nl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 underline transition-colors"
                  >
                    health.belgium.be
                  </a>
                  <a 
                    href="https://www.gezondleven.be/themas/voeding/voedingsdriehoek" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 underline transition-colors"
                  >
                    gezondleven.be - Voedingsdriehoek
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* General Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                  <Apple className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-900">Algemene Richtlijnen</h2>
              </div>
              <ul className="space-y-3">
                {algemeneRichtlijnen.map((regel, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-emerald-800">{regel}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Training Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid md:grid-cols-3 gap-4 mb-6"
            >
              {/* Voor Training */}
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-bold text-orange-900">Voor Training</h3>
                </div>
                <ul className="space-y-2">
                  {voorTraining.map((item, index) => (
                    <li key={index} className="text-orange-800 text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tijdens Training */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-blue-900">Tijdens Training</h3>
                </div>
                <ul className="space-y-2">
                  {tijdensTraining.map((item, index) => (
                    <li key={index} className="text-blue-800 text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Na Training */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-center gap-2 mb-4">
                  <Apple className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-bold text-green-900">Na Training</h3>
                </div>
                <ul className="space-y-2">
                  {naTraining.map((item, index) => (
                    <li key={index} className="text-green-800 text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-yellow-50 rounded-2xl p-8 border border-yellow-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-yellow-900">Praktische Tips</h2>
              </div>
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-yellow-800">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
