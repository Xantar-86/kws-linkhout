"use client";

import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Clock, 
  FileText, 
  Shield, 
  Heart, 
  Award, 
  Globe, 
  Download,
  Target,
  Users,
  BookOpen,
  Lightbulb
} from "lucide-react";
import Link from "next/link";

const jeugdModules = [
  {
    id: "trainingsschema-25-26",
    title: "Trainingsschema 2025-26",
    description: "Bekijk alle trainingstijden per leeftijdsgroep",
    icon: Clock,
    color: "bg-blue-500"
  },
  {
    id: "opleidingsvisie-vfv",
    title: "VFV Opleidingsvisie",
    description: "Onze visie op jeugdopleiding volgens VFV richtlijnen",
    icon: GraduationCap,
    color: "bg-green-500"
  },
  {
    id: "opleidingsplan",
    title: "Opleidingsplan",
    description: "Het volledige opleidingsplan van KWS Linkhout",
    icon: FileText,
    color: "bg-purple-500"
  },
  {
    id: "panathloncharter",
    title: "Panathlon Charter",
    description: "De principes van Panathlon voor eerlijke sport",
    icon: Award,
    color: "bg-orange-500"
  },
  {
    id: "fair-play",
    title: "Fair Play Regels",
    description: "Gedragsregels voor spelers, ouders en trainers",
    icon: Heart,
    color: "bg-red-500"
  },
  {
    id: "charter-anti-racisme",
    title: "Anti-Racisme Charter",
    description: "Ons engagement tegen discriminatie en racisme",
    icon: Shield,
    color: "bg-indigo-500"
  },
  {
    id: "foot-pass",
    title: "Foot Pass",
    description: "Informatie over het Foot Pass systeem",
    icon: Globe,
    color: "bg-teal-500"
  }
];

const downloadFiles = [
  {
    title: "Pedagogische Principes KBVB",
    description: "De 8 pedagogische principes van de KBVB voor jeugdvoetbal",
    filename: "Pedagogische-principes-KBVB.pdf",
    icon: BookOpen
  },
  {
    title: "Ontwikkeling van het kind als jeugdvoetballer",
    description: "Uitgebreide handleiding over de ontwikkeling per leeftijdscategorie (U6-U21)",
    filename: "Ontwikkeling-van-het-kind-als-jeugdvoetballer.pdf",
    icon: Users
  },
  {
    title: "Opleidingsplan WS Linkhout",
    description: "Het complete opleidingsplan voor alle jeugdcategorieën U6-U21",
    filename: "Opleidingsplan-WS-Linkhout.pdf",
    icon: Target
  }
];

export default function JeugdopleidingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GraduationCap className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Jeugdopleiding
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Ontdek onze jeugdwerking, trainingen en opleidingsvisie. 
              Bij KWS Linkhout investeren we in de toekomst.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Missie & Visie Sectie */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Missie & Visie
            </h2>
          </motion.div>

          {/* VISIE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Visie</h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Het aanbieden van voetbal(plezier) aan al zijn spelers waardoor elke speler 
                zijn/haar persoonlijke droom kan waarmaken en zijn/haar favoriete sport kan 
                beoefenen op zijn/haar eigen niveau.
              </p>
              <p>
                Het aanbieden van de beste jeugdopleiding in de regio, die zo veel mogelijk 
                leidt naar eigen opgeleide spelers in de 1ste ploeg.
              </p>
              <p>
                Het aanbieden van een algemene opvoeding die garandeert dat jeugdspelers 
                kunnen functioneren in de hedendaagse maatschappij met zijn geldende normen en waarden.
              </p>
              <p>
                Het samenstellen van een opleidingsteam dat de voorgaande doelstellingen in 
                een (h)echt teamverband kan dragen en uitdragen. Teamwork is een onmisbare factor 
                in een succesvolle opleiding.
              </p>
              <p>
                De individuele ontwikkeling van de speler staat centraal en beoogt een ontwikkeling 
                om te kunnen functioneren als individu in een teamsport. Elke speler moet de kans 
                krijgen zichzelf te ontwikkelen. Hierdoor zal hij reeds heel vroeg een lifestyle 
                moeten aanmeten waarin zelfverantwoordelijkheid een sleutelrol speelt.
              </p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Absolute prioriteit voor studie geven</li>
                <li>Elke speler moet kunnen spelen en trainen in een team waarin hij ingegeven door zijn kwaliteiten thuishoort</li>
                <li>Iedere speler, ook hij die de A-kern niet haalt, moet een warm en positief gevoel overhouden aan zijn verblijf in onze rangen</li>
                <li>Winnen als basisattitude hanteren, maar het leerproces, plezier en kameraadschap moet primeren</li>
                <li>Een succesvolle opleiding aanbieden via continuïteit en teamwork</li>
              </ul>
            </div>
          </motion.div>

          {/* MISSIE - SPORTIEF */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Missie - Sportief</h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <ul className="space-y-3 ml-6 list-disc">
                <li>
                  Kinderen uit de regio een gezond en plezant alternatief aanbieden voor hun 
                  vrijetijdsbesteding, waarin bovendien de sociale vaardigheden optimaal worden ontwikkeld.
                </li>
                <li>
                  Kinderen opleiden tot volwassen voetballers m.a.w. hen geduldig klaarstomen 
                  (op technisch, tactisch, fysiek en mentaal vlak) voor het volwassen voetbal.
                </li>
                <li>
                  De talentrijke spelers laten doorstromen naar ons eigen 1ste elftal of naar 
                  het hoogst mogelijke nationale niveau.
                </li>
                <li>
                  Werken volgens een duidelijk omschreven visie, waarin verzorgd, opbouwend en 
                  aanvallend voetbal wordt nagestreefd.
                </li>
                <li>
                  Uitgroeien tot een club met een kwalitatief sterke jeugdopleiding, met gediplomeerde 
                  jeugdopleiders, die in ideale omstandigheden kunnen werken.
                </li>
                <li>
                  De ouders ondersteunen in de opvoeding van hun kinderen door deze op een sociaal 
                  en pedagogisch verantwoorde manier te begeleiden.
                </li>
                <li>
                  Waarden als "fair play", gelijkheid, doorzettingsvermogen, …
                </li>
              </ul>
            </div>
          </motion.div>

          {/* MISSIE - ZAKELIJK */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Missie - Zakelijk</h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <ul className="space-y-3 ml-6 list-disc">
                <li>Financieel gezond zijn en blijven.</li>
                <li>
                  Een sterke organisatiestructuur, gebaseerd op verantwoordelijkheid, vrijwilligheid, 
                  transparantie in taken, … naar voorbeeld van professionele clubs.
                </li>
                <li>
                  Een reputatie ontwikkelen van "familiale club" door het aantrekken van mensen 
                  en spelers uit de regio.
                </li>
                <li>
                  Uitbouwen van een accommodatie, die aan alle betrokkenen een optimale leef-, 
                  werk- en leeromgeving biedt.
                </li>
                <li>Een eerste elftal creëren met eigen jeugdspelers.</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Downloadbare Documenten */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Documenten
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Download hier belangrijke documenten over onze jeugdopleiding.
            </p>
          </motion.div>

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
                    target="_blank"
                    rel="noopener noreferrer"
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
        </div>
      </section>

      {/* Modules Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Alle informatie over onze jeugd
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Klik op een onderwerp voor meer details over onze jeugdopleiding.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jeugdModules.map((module, index) => {
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
                    href={`/jeugdopleiding/${module.id}`}
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
    </div>
  );
}
