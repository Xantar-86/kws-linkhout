"use client";

import { motion } from "framer-motion";
import { Award, ArrowLeft, Download, BookOpen, Shield, Heart, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

const rechtenVanHetKind = [
  "Sport te beoefenen",
  "Zich te vermaken en te spelen",
  "In een gezonde omgeving te leven",
  "Waardig behandeld te worden",
  "Getraind en begeleid te worden door competente mensen",
  "Deel te nemen aan training die aangepast is aan hun leeftijd, individueel ritme en mogelijkheden",
  "Zich te meten met kinderen van hetzelfde niveau in een aangepaste competitie",
  "In veilige omstandigheden aan sport te doen",
  "Te rusten",
  "De kans te krijgen kampioen te worden, of het niet te worden"
];

const tienGeboden = [
  "Speel sportief",
  "Speel altijd om te winnen, maar wees waardig in het verlies",
  "Volg de regels van het spel",
  "Respecteer je tegenstanders, je ploegmaats, de scheidsrechters, de officials, de trainers, de afgevaardigden, de vrijwilligers en de supporters",
  "Eer de mensen die de goede naam van het voetbal verdedigen",
  "Promoot het voetbal",
  "Verwerp corruptie, doping, drugs, racisme, geweld en alle andere gevaren die de populariteit van onze sport kunnen schaden",
  "Help anderen om aan de negatieve verleidingen van gebod 7 te weerstaan",
  "Stel de mensen die onze sport in diskrediet brengen aan de kaak",
  "Verbeter de wereld dankzij het voetbal"
];

const gedragscodeOuders = {
  voorDeMatch: [
    "Ik toon belangstelling voor het voetbal van mijn kind en ga regelmatig kijken en supporteren.",
    "Ik vraag mijn kind om ervoor te gaan, altijd zijn best te doen, maar vooral plezier te maken.",
    "Ik fok mijn kind niet op, leg geen overdreven druk op zijn schouders maar stimuleer hem wel al zijn talenten te ontwikkelen.",
    "Ik stimuleer mijn kind om zich aan de regels van het spel en de fairplay te houden."
  ],
  tijdensDeMatch: [
    "Ik gebruik geen agressieve of schunnige taal langs de zijlijn.",
    "Ik applaudisseer voor knap spel van zowel het team van mijn kind als de tegenstrever.",
    "Ik moedig mijn kind aan en maak het niet af voor zijn fouten.",
    "Ik respecteer de beslissingen van de coach en de scheidsrechter.",
    "Tijdens de wedstrijd moedig ik aan, de instructies geeft de trainer."
  ],
  naDeMatch: [
    "Als ik niet akkoord ga met de coach, praat ik er met hem over.",
    "Na de wedstrijd bekijk ik samen met mijn kind wat goed liep, wat minder en wat we eruit leren.",
    "Ik leer mijn kind om respect op te brengen voor de prestatie van de tegenstrever.",
    "Ik kijk naar de inspanningen van mijn kind, niet enkel naar de score of eindstand."
  ]
};

const gedragscodeSupporters = [
  "Ik gebruik geen agressieve of schunnige taal langs de zijlijn.",
  "Ik applaudisseer voor knap spel van zowel mijn team als de tegenstrever.",
  "Ik moedig de spelers aan en maakt ze niet af voor hun fouten.",
  "Ik respecteer de beslissingen van de coach en de scheidsrechter.",
  "Tijdens de wedstrijd moedig ik aan, de instructies geeft de trainer.",
  "Ik stimuleer de spelers om zich aan de regels van het spel en de fairplay te houden."
];

const downloadFiles = [
  {
    title: "Panathlonverklaring - Ethiek in de jeugdsport",
    description: "De officiële Panathlonverklaring over ethiek in de jeugdsport",
    filename: "panathlonverklaring_over_ethiek_in_de_jeugdsport.pdf",
    icon: Shield
  },
  {
    title: "Pedagogische Principes KBVB",
    description: "De 8 pedagogische principes van de KBVB voor jeugdvoetbal",
    filename: "Pedagogische-principes-KBVB.pdf",
    icon: BookOpen
  }
];

export default function PanathloncharterPage() {
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
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="container-custom text-center text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Panathlon Charter</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Over de Rechten van het Kind in de Sport
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Rechten van het Kind */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-orange-50 rounded-2xl p-8 border border-orange-100 mb-8"
          >
            <h2 className="text-2xl font-bold text-orange-900 mb-6">
              Alle kinderen hebben het recht om:
            </h2>
            <ul className="space-y-3">
              {rechtenVanHetKind.map((recht, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-orange-900">{recht}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Namens KWS Linkhout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-white rounded-xl p-6 mb-8 text-center"
          >
            <p className="font-semibold text-lg">Namens KWS Linkhout</p>
            <p className="text-white/80 mt-2">
              Het hoofdbestuur, het jeugdbestuur, de jeugdtrainers
            </p>
          </motion.div>

          {/* De Tien Geboden van Fair Play */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
          >
            <div className="bg-green-600 text-white px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Heart className="w-6 h-6" />
                De tien geboden van de Fair Play
              </h2>
            </div>
            <div className="p-6">
              <ol className="space-y-3">
                {tienGeboden.map((gebod, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="w-7 h-7 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{gebod}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

          {/* Gedragscode Ouders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
          >
            <div className="bg-blue-600 text-white px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Users className="w-6 h-6" />
                Gedragscode voor Ouders
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Vóór de match</h3>
                <ul className="space-y-2 ml-4">
                  {gedragscodeOuders.voorDeMatch.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Tijdens de match</h3>
                <ul className="space-y-2 ml-4">
                  {gedragscodeOuders.tijdensDeMatch.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Na de match</h3>
                <ul className="space-y-2 ml-4">
                  {gedragscodeOuders.naDeMatch.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Gedragscode Supporters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
          >
            <div className="bg-purple-600 text-white px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Users className="w-6 h-6" />
                Gedragscode voor Supporters
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {gedragscodeSupporters.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-center font-semibold text-purple-700">
                Welke sportouder of supporter ben jij?
              </p>
            </div>
          </motion.div>

          {/* Downloadbare Documenten */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Documenten
            </h2>
            <div className="space-y-4">
              {downloadFiles.map((file, index) => {
                const Icon = file.icon;
                return (
                  <motion.div
                    key={file.filename}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      href={`/docs/jeugdopleiding/${file.filename}`}
                      download
                      className="group flex items-start gap-4 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/30"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                          {file.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {file.description}
                        </p>
                        <span className="inline-flex items-center gap-2 text-sm text-primary font-medium">
                          <Download className="w-4 h-4" />
                          Download PDF
                        </span>
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
