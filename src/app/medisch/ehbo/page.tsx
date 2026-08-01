"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  ArrowLeft,
  Shield,
  Phone,
  ListChecks,
  Bandage,
  Droplet,
  Brain,
  Bone,
  Thermometer,
  Activity,
  Plus,
  Heart,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const goudenStappen = [
  {
    nummer: "1",
    titel: "Zorg voor veiligheid",
    beschrijving:
      "Breng jezelf, het slachtoffer en omstaanders niet in gevaar. Leg het spel stil en zorg voor een veilige omgeving.",
  },
  {
    nummer: "2",
    titel: "Beoordeel de toestand",
    beschrijving:
      "Is het slachtoffer bij bewustzijn? Ademt het? Waar is de pijn of het letsel? Spreek het slachtoffer aan en stel gerust.",
  },
  {
    nummer: "3",
    titel: "Alarmeer indien nodig",
    beschrijving:
      "Bel bij ernstige situaties onmiddellijk 112. Laat bij twijfel altijd bellen. Vermeld duidelijk waar je bent (adres van de accommodatie).",
  },
  {
    nummer: "4",
    titel: "Verleen eerste hulp",
    beschrijving:
      "Handel rustig binnen je kennis en mogelijkheden. Blijf bij het slachtoffer tot professionele hulp arriveert.",
  },
];

const blessures = [
  {
    icon: Bone,
    kleur: "bg-amber-500",
    lichtKleur: "bg-amber-50",
    tekstKleur: "text-amber-900",
    titel: "Verstuiking of kneuzing",
    intro: "Volg het RICE-principe:",
    punten: [
      "Rust: stop de activiteit onmiddellijk",
      "IJs: koel 15-20 min (nooit rechtstreeks op de huid)",
      "Compressie: leg een drukverband aan",
      "Elevatie: leg het lichaamsdeel hoog",
    ],
  },
  {
    icon: Bandage,
    kleur: "bg-red-500",
    lichtKleur: "bg-red-50",
    tekstKleur: "text-red-900",
    titel: "Wonden & schaafwonden",
    intro: "Reinigen en beschermen:",
    punten: [
      "Spoel de wonde met (leiding)water",
      "Ontsmet met een ontsmettingsmiddel",
      "Dek af met een steriel kompres of pleister",
      "Bij een diepe of gapende wonde: naar de arts",
    ],
  },
  {
    icon: Droplet,
    kleur: "bg-rose-500",
    lichtKleur: "bg-rose-50",
    tekstKleur: "text-rose-900",
    titel: "Bloedneus",
    intro: "Kalm blijven en:",
    punten: [
      "Laat het hoofd licht voorover buigen",
      "Knijp de neusvleugels 10 min dicht",
      "Niet snuiten en niet achterover leunen",
      "Blijft het bloeden na 20 min? Naar de arts",
    ],
  },
  {
    icon: Brain,
    kleur: "bg-purple-500",
    lichtKleur: "bg-purple-50",
    tekstKleur: "text-purple-900",
    titel: "Hoofdletsel / hersenschudding",
    intro: "Wees altijd voorzichtig:",
    punten: [
      "Bij duizeligheid, misselijkheid of verwardheid: stop",
      "Speler mag NIET verder spelen (rule: 'when in doubt, sit them out')",
      "Blijf observeren en waarschuw de ouders",
      "Bij bewustzijnsverlies of braken: bel 112",
    ],
  },
  {
    icon: Activity,
    kleur: "bg-orange-500",
    lichtKleur: "bg-orange-50",
    tekstKleur: "text-orange-900",
    titel: "Spierkramp",
    intro: "Ontspannen en hydrateren:",
    punten: [
      "Rek de spier voorzichtig en rustig uit",
      "Masseer de spier lichtjes",
      "Laat de speler drinken (water/sportdrank)",
      "Warmte kan helpen ontspannen",
    ],
  },
  {
    icon: Bone,
    kleur: "bg-slate-500",
    lichtKleur: "bg-slate-50",
    tekstKleur: "text-slate-900",
    titel: "Botbreuk of ontwrichting",
    intro: "Niet bewegen, wél stabiliseren:",
    punten: [
      "Beweeg het lichaamsdeel zo weinig mogelijk",
      "Immobiliseer in de gevonden houding",
      "Probeer niets 'recht te trekken'",
      "Bel 112 en houd het slachtoffer warm",
    ],
  },
  {
    icon: Thermometer,
    kleur: "bg-sky-500",
    lichtKleur: "bg-sky-50",
    tekstKleur: "text-sky-900",
    titel: "Oververhitting & uitdroging",
    intro: "Afkoelen en drinken:",
    punten: [
      "Breng de speler in de schaduw/koelte",
      "Laat rusten en in kleine slokjes drinken",
      "Koel nek, oksels en liezen",
      "Bij verwardheid of flauwvallen: bel 112",
    ],
  },
  {
    icon: Plus,
    kleur: "bg-teal-500",
    lichtKleur: "bg-teal-50",
    tekstKleur: "text-teal-900",
    titel: "Tandletsel",
    intro: "Snelheid is belangrijk:",
    punten: [
      "Raak een uitgeslagen tand enkel aan de kroon aan",
      "Bewaar de tand in melk (of speeksel)",
      "Ga zo snel mogelijk naar de (tand)arts",
      "Spoel de mond bij bloeding met koud water",
    ],
  },
];

const ehboKoffer = [
  "Steriele kompressen en snelverbanden",
  "Pleisters in verschillende maten",
  "Zwachtels en drukverband (elastisch)",
  "Ontsmettingsmiddel",
  "Coldpacks / ijszakjes",
  "Schaar en pincet",
  "Wegwerphandschoenen",
  "Reddingsdeken",
  "Driehoeksverband",
  "Beademingsmasker",
];

const noodnummers = [
  { nummer: "112", titel: "Europees noodnummer", omschrijving: "Ambulance, brandweer & politie" },
  { nummer: "070 245 245", titel: "Antigifcentrum", omschrijving: "Bij vergiftiging of inname" },
  { nummer: "1733", titel: "Huisarts van wacht", omschrijving: "Voor dringende, niet-levensbedreigende hulp" },
];

export default function EhboPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link
            href="/medisch"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar medisch
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 py-16">
        <div className="container-custom text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center">
                <HeartPulse className="w-9 h-9" />
              </div>
              <span className="text-sm font-medium text-white/80 uppercase tracking-wide">
                Eerste Hulp Bij Ongevallen
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">EHBO</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Snel en correct handelen bij een ongeval maakt vaak het verschil. Op deze pagina
              vind je een praktisch stappenplan, eerste hulp bij veelvoorkomende voetbalblessures
              en de inhoud van onze EHBO-koffer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl space-y-6">
          {/* Wat is EHBO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-teal-50 rounded-2xl p-8 border border-teal-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-teal-900">Wat is EHBO?</h2>
            </div>
            <p className="text-teal-800 leading-relaxed">
              EHBO staat voor <strong>Eerste Hulp Bij Ongevallen</strong>: de hulp die je onmiddellijk
              verleent aan een gewonde of onwel geworden persoon, vóór professionele hulpverleners ter
              plaatse zijn. Op en rond het voetbalveld gebeuren nu eenmaal ongevallen, van een
              schaafwonde tot een ernstige blessure. Wie kalm blijft, de juiste stappen volgt en tijdig
              hulp inschakelt, beperkt de schade en kan in het uiterste geval een leven redden.
            </p>
          </motion.div>

          {/* Gouden stappen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                <ListChecks className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">De 4 gouden stappen</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {goudenStappen.map((stap, index) => (
                <div key={index} className="bg-white rounded-xl p-5 flex gap-4 shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">
                    {stap.nummer}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{stap.titel}</h3>
                    <p className="text-gray-600 text-sm">{stap.beschrijving}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Blessures grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                <Bandage className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Eerste hulp bij veelvoorkomende blessures
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {blessures.map((b, index) => {
                const Icon = b.icon;
                return (
                  <div
                    key={index}
                    className={`${b.lichtKleur} rounded-2xl p-6 border border-black/5 h-full`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 ${b.kleur} rounded-xl flex items-center justify-center text-white flex-shrink-0`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className={`text-lg font-bold ${b.tekstKleur}`}>{b.titel}</h3>
                    </div>
                    <p className={`text-sm font-medium mb-3 ${b.tekstKleur}`}>{b.intro}</p>
                    <ul className="space-y-2">
                      {b.punten.map((punt, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{punt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* EHBO-koffer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                <Plus className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">De EHBO-koffer</h2>
            </div>
            <p className="text-gray-600 mb-6">
              In Linkhout vind je de EHBO-koffer in de kantine, in Zelem in het scheidsrechterslokaal.
              Trainers en afgevaardigden weten waar die zich bevindt. Controleer regelmatig of alles nog
              aanwezig en niet vervallen is. Een goed gevulde koffer bevat onder meer:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {ehboKoffer.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cross-link naar reanimatie/AED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/medisch/reanimatie-defibrillator"
              className="group block bg-pink-50 rounded-2xl p-8 border border-pink-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-pink-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                  <Heart className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-pink-900 mb-1">
                    Hartstilstand? Ontdek onze AED & reanimatie-info
                  </h3>
                  <p className="text-pink-800 text-sm">
                    Bij een hartstilstand telt elke seconde. Onze club beschikt over een AED-toestel.
                    Bekijk het stappenplan voor reanimatie en de locatie van de AED.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Noodnummers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-red-50 rounded-2xl p-8 border border-red-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                <Phone className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-red-900">Belangrijke noodnummers</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {noodnummers.map((n, index) => (
                <div key={index} className="bg-white rounded-xl p-5 text-center shadow-sm">
                  <p className="text-3xl font-bold text-red-600 mb-1">{n.nummer}</p>
                  <p className="font-semibold text-gray-900">{n.titel}</p>
                  <p className="text-gray-500 text-sm">{n.omschrijving}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* EHBO op de club */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-teal-600 text-white rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">EHBO op KWS Linkhout</h2>
            </div>
            <p className="text-white/90 leading-relaxed mb-4">
              Bij elke training en wedstrijd is er iemand met EHBO-kennis aanwezig. Meerdere trainers en
              afgevaardigden zijn opgeleid in eerste hulp en reanimatie. Twijfel je of het ernstig is?
              Handel dan altijd voorzichtig en schakel professionele hulp in. Bij twijfel bel je 112.
            </p>
            <a
              href="mailto:info@kwslinkhout.be"
              className="inline-flex items-center gap-2 text-white font-medium underline hover:text-white/80"
            >
              Vragen over ons medisch beleid? Mail info@kwslinkhout.be
            </a>
          </motion.div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-gray-400 max-w-2xl mx-auto pt-2">
            Deze informatie is een beknopte leidraad en vervangt geen erkende EHBO-opleiding of medisch
            advies. Volg bij twijfel steeds de instructies van de hulpdiensten (112).
          </p>
        </div>
      </section>
    </div>
  );
}
