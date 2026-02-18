"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

// Events data gebaseerd op de PDF kws-events.pdf - Alleen komende evenementen
const events = [
  {
    id: 5,
    title: "Pasta Take-A-Way",
    date: "13-14 Maart",
    dateFull: "13-14 maart 2026",
    description: "Heerlijke pasta om mee te nemen, bestellen is mogelijk.",
    category: "verkoop",
    color: "from-red-500 to-red-700"
  },
  {
    id: 6,
    title: "Voetbalkamp Meisjes",
    date: "8-9-10 April",
    dateFull: "8-9-10 april 2026",
    description: "Drie dagen voetbalplezier speciaal voor onze meisjesploegen.",
    category: "kamp",
    color: "from-pink-500 to-pink-700"
  },
  {
    id: 7,
    title: "Paasvoetbalkamp",
    date: "15-16-17 April",
    dateFull: "15-16-17 april 2026",
    description: "Het traditionele paasvoetbalkamp voor alle jeugdspelers.",
    category: "kamp",
    color: "from-green-500 to-green-700"
  },
  {
    id: 8,
    title: "Oudervoetbal",
    date: "Mei",
    dateFull: "Mei 2026",
    description: "Het jaarlijkse ouder voetbal toernooi.",
    category: "sport",
    color: "from-primary-500 to-primary-700"
  },
  {
    id: 9,
    title: "Nachttornooi",
    date: "Mei",
    dateFull: "Mei 2026",
    description: "Het spectaculaire nachttornooi op onze velden.",
    category: "sport",
    color: "from-indigo-500 to-indigo-700"
  },
  {
    id: 10,
    title: "Duckrace",
    date: "25 Mei",
    dateFull: "25 mei 2026",
    description: "De jaarlijkse duckrace met mooie prijzen.",
    category: "actie",
    color: "from-yellow-500 to-yellow-700"
  }
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/nieuws" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar nieuws
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              Save the Date
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Evenementen 2025-2026
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Noteer deze data alvast in je agenda! Een overzicht van alle activiteiten bij KWS Linkhout.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding">
        <div className="container-custom max-w-6xl">
          {/* Download PDF CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Evenementenkalender downloaden
                </h3>
                <p className="text-gray-600">
                  Download de volledige evenementenkalender als PDF.
                </p>
              </div>
              <a
                href="/Docs/events/kws-events.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </a>
            </div>
          </motion.div>

          {/* Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Header met gradient */}
                <div className={`bg-gradient-to-r ${event.color} p-4`}>
                  <div className="flex items-center justify-end">
                    <Calendar className="w-5 h-5 text-white/80" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Datum badge */}
                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="bg-gray-100 rounded-xl p-3">
                        <span className="block text-lg font-bold text-primary leading-tight">
                          {event.date.split(" ")[0]}
                        </span>
                        <span className="block text-xs text-gray-600 uppercase mt-1">
                          {event.date.split(" ").slice(1).join(" ")}
                        </span>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>KWS Linkhout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-primary to-primary-700 rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              Vragen over een evenement?
            </h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Neem contact met ons op voor meer informatie over onze evenementen.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Contacteer ons
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
