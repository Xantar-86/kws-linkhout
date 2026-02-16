"use client";

import { motion } from "framer-motion";
import { Shield, ArrowLeft, XCircle, HandHeart, Users, Megaphone, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

const verbodenGedragingen = [
  "Racistische opmerkingen of beledigingen",
  "Discriminatie op basis van huidskleur of afkomst",
  "Intimidatie of uitsluiting van spelers",
  "Het gebruik van stereotypen of vooroordelen",
  "Geweld of dreigingen met racistisch karakter"
];

const engagementen = [
  {
    icon: HandHeart,
    title: "Inclusie",
    description: "Iedereen is welkom bij KWS Linkhout, ongeacht afkomst of achtergrond."
  },
  {
    icon: Users,
    title: "Diversiteit",
    description: "We omarmen de diversiteit in onze club als een verrijking."
  },
  {
    icon: Megaphone,
    title: "Spreken",
    description: "We spreken elkaar aan bij discriminerend gedrag."
  }
];

const actiepunten = [
  "Door via al hun acties en communicatiekanalen een boodschap van tolerantie, respect en waardigheid te verspreiden;",
  "Door de gelijkheid van kansen voor allen daadwerkelijk toe te passen;",
  "Door op te treden als een opvoedende kracht die de samenwerking tussen de gezinnen, het schoolmilieu en het lokale verenigingsleven bevordert;",
  "Door opname in hun reglement van inwendige orde van een expliciet verbod van elke vorm van racisme en van elke andere vorm van discriminerende houding, zoals antisemitisme, homofobie, seksisme, islamfobie… en van de ermee gepaard gaande symbolen;",
  "Door het geven van instructies aan hun leden en verantwoordelijken om de toegang tot de sportactiviteiten te weigeren aan elke persoon die racistisch of discriminerend gedrag vertoont en/of provocerende symbolen of kleren draagt;",
  "Door zich te engageren tot het verwijderen van alle provocerende symbolen en teksten in en rond hun voetbalvelden en op de internetsites;",
  "Door waakzaam te blijven en preventief op te treden tegen elk teken van beginnend racisme of discriminatie;",
  "Door het overmaken van alle informatie over racistische of discriminerende ontsporingen aan de lokale overheden en aan de bondsinstanties;",
  "Door de slachtoffers van racisme en discriminatie te steunen, eventueel met bijstand van bevoegde instellingen, zoals het Centrum voor gelijkheid van kansen en voor racismebestrijding, of van gespecialiseerde verenigingen, zoals het MRAX en de Liga voor de Mensenrechten;",
  "Door de naleving van de wetgeving en de richtlijnen inzake toegankelijkheid voor personen met een handicap en door de realisatie, daar waar mogelijk, van de passende voorzieningen om hen de toegang tot de voetbalvelden te vergemakkelijken;",
  "Door de regelmatige evaluatie van de principes vervat in dit charter. Daartoe kunnen de clubs ondersteuning vragen aan de gespecialiseerde instellingen, aan de bondsinstanties en aan de Minister bevoegd voor Sport;"
];

export default function CharterAntiRacismePage() {
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
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Charter Anti-Racisme</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Rode kaart tegen racisme en discriminatie
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Inleiding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-red-50 rounded-2xl p-8 border border-red-100 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-8 h-8 text-red-600" />
              <h2 className="text-2xl font-bold text-red-900">Rode kaart tegen racisme en discriminatie</h2>
            </div>
            <p className="text-red-800 leading-relaxed">
              De voetbalclubs erkennen de belangrijke rol die de sport vervult in het samenbrengen 
              van mensen van verschillende culturen en afkomsten. De voetbalclubs kunnen veel doen 
              voor het bevorderen van participatie.
            </p>
            <p className="text-red-800 leading-relaxed mt-4 font-medium">
              Daarom zullen ze, in het raam van hun opvoedende opdracht, promotie voeren voor meer 
              fair-play en zullen ze de rode kaart tonen aan alle vormen van racisme en discriminatie.
            </p>
          </motion.div>

          {/* Actiepunten */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
          >
            <div className="bg-primary text-white px-6 py-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                De clubs engageren zich
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {actiepunten.map((punt, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{punt}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Bekendmaking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 rounded-2xl p-8 border border-blue-100 mb-8"
          >
            <h2 className="text-xl font-bold text-blue-900 mb-4">Bekendmaking</h2>
            <p className="text-blue-800 mb-4">
              De clubs zorgen voor de bekendmaking van dit charter bij alle personen die deelnemen aan het voetbalgebeuren.
            </p>
            <p className="text-blue-800 font-medium">
              De clubs verbinden zich tot zichtbare en leesbare plaatsing en/of aanplakking van dit charter 
              aan de toegangen tot de terreinen, in de kleedkamers, kantines en tribunes.
            </p>
          </motion.div>

          {/* Melden bij KWS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-amber-50 rounded-2xl p-8 border border-amber-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-amber-900">Bij KWS Linkhout</h2>
            </div>
            <p className="text-amber-800 font-medium">
              Alle vormen van racisme en discriminatie moeten onmiddellijk gemeld worden aan TVJO, trainer of afgevaardigde.
            </p>
          </motion.div>

          {/* Ons Statement (behouden) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-indigo-50 rounded-2xl p-8 border border-indigo-100"
          >
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">Ons Statement</h2>
            <p className="text-indigo-800 mb-4">
              Bij KWS Linkhout geloven we dat voetbal een verbindende kracht is. 
              Onze club is een plek waar iedereen zich welkom en gewaardeerd moet voelen, 
              ongeacht huidskleur, afkomst, nationaliteit of religie.
            </p>
            <p className="text-indigo-800 font-medium">
              Racisme, discriminatie en intolerantie zijn strikt verboden binnen onze club. 
              Dit charter is onze publieke belofte om actief tegen deze verschijnselen te strijden.
            </p>
          </motion.div>

          {/* Engagementen (behouden) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Onze Engagementen</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {engagementen.map((engagement, index) => {
                const Icon = engagement.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center"
                  >
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{engagement.title}</h3>
                    <p className="text-gray-600 text-sm">{engagement.description}</p>
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
