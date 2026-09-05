"use client";

// app/jeugdopleiding/lidgeld-ondersteuning/page.tsx
//
// Waar een gezin terecht kan als het lidgeld zwaar valt. Twee wegen: de
// gemeente Lummen en de club zelf. Bewust zonder bedragen of voorwaarden:
// die wijzigen bij de gemeente van jaar tot jaar, en een verouderd bedrag op
// deze pagina houdt net de mensen tegen die we willen bereiken.

import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  ExternalLink,
  HandCoins,
  Landmark,
  Lock,
  Mail,
  MessagesSquare,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { PaginaKop } from "@/components/PaginaKop";

const viaDeGemeente = [
  {
    titel: "UiTPAS met kansentarief",
    icoon: Ticket,
    tekst:
      "Heb je recht op het kansentarief, dan geeft de UiTPAS een stevige korting op het " +
      "lidgeld en op andere vrijetijdsactiviteiten in Lummen.",
    link: {
      naam: "UiTPAS bij de gemeente Lummen",
      adres: "https://www.lummen.be/sport-en-vrije-tijd/uit-lummen/uitpas",
    },
  },
  {
    titel: "Gemeentelijke tussenkomsten",
    icoon: HandCoins,
    tekst:
      "De gemeente voorziet steun voor kinderen en jongeren uit gezinnen met een beperkt " +
      "inkomen. Vraag bij de dienst Vrije Tijd na wat er op dit moment mogelijk is.",
    link: {
      naam: "Dienst Vrije Tijd Lummen",
      adres: "https://www.lummen.be/entiteiten/vrije-tijd",
    },
  },
  {
    titel: "Sociaal Huis en OCMW",
    icoon: Landmark,
    tekst:
      "Het Sociaal Huis kan in bepaalde situaties tussenkomen in de kosten van sport en " +
      "vrije tijd. Een gesprek daar is vertrouwelijk en verplicht je tot niets.",
    link: {
      naam: "Sociaal Huis en OCMW Lummen",
      adres: "https://www.lummen.be/organisaties/ocmw",
    },
  },
];

const viaDeClub = [
  {
    titel: "Het lidgeld in schijven betalen",
    icoon: CalendarClock,
    tekst:
      "Komt het bedrag in één keer niet uit, dan spreiden we het. Neem contact op met de " +
      "jeugdcoördinator of met het bestuur en we spreken een regeling af die past.",
  },
  {
    titel: "Een gesprek onder vier ogen",
    icoon: MessagesSquare,
    tekst:
      "Zit het financieel krap, spreek dan gerust een bestuurslid of de jeugdverantwoordelijke " +
      "aan. Samen zoeken we een oplossing, discreet en zonder dat iemand anders het hoeft te weten.",
  },
];

export default function LidgeldOndersteuningPagina() {
  return (
    <div className="min-h-screen bg-gray-50">

      <PaginaKop
        terug={{ naar: "/jeugdopleiding", label: "Terug naar jeugdopleiding" }}
        opschrift="Lidgeld en sportparticipatie"
        icoon={HandCoins}
        titel="Ondersteuning bij het lidgeld"
        accent="lidgeld"
        onder="Voetballen bij KWS Linkhout mag niet stranden op het lidgeld. Valt het bedrag zwaar, dan zijn er twee wegen: steun via de gemeente Lummen, en een regeling met de club zelf."
      />

      {/* Via de gemeente */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="mb-8"
          >
            <h2 className="heading-2 mb-3">Via de gemeente Lummen</h2>
            <p className="text-gray-600 max-w-3xl">
              De gemeente heeft hier eigen kanalen voor. Wat je precies krijgt hangt af van je
              situatie, dus vraag het na bij de dienst zelf.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {viaDeGemeente.map((punt, i) => {
              const Icoon = punt.icoon;
              return (
                <motion.article
                  key={punt.titel}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full flex-col rounded-2xl border border-blue-100 bg-blue-50 p-6"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white mb-4">
                    <Icoon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{punt.titel}</h3>
                  <p className="flex-1 text-blue-800">{punt.tekst}</p>
                  <a
                    href={punt.link.adres}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {punt.link.naam}
                  </a>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Via de club */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="mb-8"
          >
            <h2 className="heading-2 mb-3">Via KWS Linkhout</h2>
            <p className="text-gray-600 max-w-3xl">
              Ook zonder de gemeente valt er iets te regelen. We doen dat liever dan een speler te
              verliezen.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {viaDeClub.map((punt, i) => {
              const Icoon = punt.icoon;
              return (
                <motion.article
                  key={punt.titel}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-red-100 bg-red-50 p-6"
                >
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white mb-4">
                    <Icoon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-red-900 mb-2">{punt.titel}</h3>
                  <p className="text-red-800">{punt.tekst}</p>
                </motion.article>
              );
            })}
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="mt-8 rounded-2xl border border-gray-200 bg-white p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="heading-3">Hoe neem je contact op?</h3>
            </div>
            <p className="text-gray-700 mb-6 max-w-3xl">
              Een bericht volstaat. Wat je vertelt blijft bij de persoon die je aanspreekt en bij
              wie het strikt nodig heeft; op het veld merkt niemand er iets van.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:info@kwslinkhout.be"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-white font-semibold hover:bg-primary-800 transition-colors"
              >
                <Mail className="w-5 h-5" />
                info@kwslinkhout.be
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-5 py-3 font-semibold text-primary hover:bg-primary-50 transition-colors"
              >
                Alle contactgegevens
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
