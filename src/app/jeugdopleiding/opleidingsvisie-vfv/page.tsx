"use client";

import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, Download, BookOpen, Target, Users, Lightbulb, Trophy } from "lucide-react";
import Link from "next/link";

const visiePunten = [
  {
    icon: Target,
    title: "Spelersgericht",
    description: "Elke speler staat centraal. We werken aan individuele ontwikkeling binnen een teamcontext."
  },
  {
    icon: Users,
    title: "Leeftijdsfases",
    description: "Trainingen afgestemd op de fysieke, technische en mentale ontwikkeling per leeftijdsgroep."
  },
  {
    icon: Lightbulb,
    title: "Speelvreugde",
    description: "Plezier in het spel staat voorop. Gemotiveerde spelers leren en presteren beter."
  },
  {
    icon: Trophy,
    title: "Prestatie & Ontspanning",
    description: "Een gezonde balans tussen ambitie en plezier, zonder overdreven druk."
  }
];

export default function OpleidingsvisiePage() {
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
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Opleidingsvisie VFV</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Onze jeugdopleiding volgt de richtlijnen van de Vlaamse Voetbalfederatie (VFV)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            {/* FTS Visie */}
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100 mb-8">
              <h2 className="text-2xl font-bold text-green-900 mb-4">Federale Trainersschool (FTS)</h2>
              <p className="text-green-800 mb-4">
                De opleidingsvisie van de Federale Trainersschool (FTS) is het vertrekpunt:
              </p>
              <ul className="space-y-2 text-green-800 ml-6 list-disc mb-4">
                <li>al sinds 2000 ontwikkeld, gedoceerd, geëvalueerd en bijgestuurd.</li>
                <li>getest in de praktijk tijdens de trainingen in de topsportschool en met de nationale jeugdploegen.</li>
              </ul>
              <p className="text-green-800">
                Deze visie werd naar alle KBVB-projecten uitgebreid en wordt in de meeste Belgische clubs toegepast. 
                Het eindproduct heeft een breed draagvlak aangezien er overleg en feedback van de clubs, 
                de jeugdopleiders, de lesgevers, enz… was.
              </p>
            </div>

            {/* Download PDF */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <a
                href="/docs/jeugdopleiding/Opleidingsvisie-VFV-2015-2016.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-primary text-white rounded-xl p-6 hover:bg-primary-700 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Lees hier de volledige Opleidingsvisie van het VFV 2015-2016</h3>
                  <p className="text-white/80 text-sm">Download de complete PDF met alle details</p>
                </div>
                <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
              </a>
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Onze Visie</h2>
            
            <p className="text-gray-700 mb-4">
              Bij KWS Linkhout geloven we dat elke jeugdspeler het recht heeft op een kwalitatieve 
              voetbalopleiding in een veilige en stimulerende omgeving. Onze aanpak is gebaseerd 
              op de nieuwste inzichten in jeugdvoetbal en volgt de richtlijnen van de VFV.
            </p>
            <p className="text-gray-700 mb-8">
              We richten ons op de totale ontwikkeling van de speler: technisch, tactisch, 
              fysiek én mentaal. Dit doen we door trainingen te geven die aansluiten bij de 
              ontwikkelingsfase van elke leeftijdsgroep.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kernpunten van onze visie</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {visiePunten.map((punt, index) => {
                const Icon = punt.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{punt.title}</h3>
                    <p className="text-gray-600 text-sm">{punt.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Ontwikkelingsfasen</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-primary min-w-[80px]">U6-U8:</span>
                  <span>Spelenderwijs leren, veel balcontact, basisbewegingen</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-primary min-w-[80px]">U9-U11:</span>
                  <span>Techniek ontwikkelen, 1v1 situaties, samenspel</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-primary min-w-[80px]">U12-U14:</span>
                  <span>Tactisch inzicht, positiespel, fysieke voorbereiding</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-primary min-w-[80px]">U15+:</span>
                  <span>Prestatiegericht trainen, wedstrijdanalyse, teamsamenwerking</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
