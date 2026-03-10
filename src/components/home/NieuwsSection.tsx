"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CreditCard, Shield, Calendar, CalendarDays } from "lucide-react";

const events = [
  {
    title: "Pasta Take-A-Way",
    date: "13-14 Maart",
    description: "Heerlijke pasta om mee te nemen",
    color: "from-red-500 to-red-700",
  },
  {
    title: "Voetbalkamp Meisjes",
    date: "8-9-10 April",
    description: "Drie dagen voetbalplezier voor onze meisjes",
    color: "from-pink-500 to-pink-700",
  },
  {
    title: "Paasvoetbalkamp",
    date: "15-16-17 April",
    description: "Traditioneel paasvoetbalkamp voor alle jeugd",
    color: "from-green-500 to-green-700",
  },
];

export function NieuwsSection() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-8 text-gray-900"
        >
          Laatste <span className="text-primary">nieuws</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          <Link href="/digitaal-betalen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-7 h-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Digitaal Betalen</h3>
                  <p className="text-gray-600 text-sm">
                    Betaal voortaan ook digitaal @ KWS Linkhout
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          </Link>

          <Link href="/documenten-mutualiteit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Documenten Mutualiteit
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Download hier je formulier voor de mutualiteiten
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Aankomende <span className="text-primary">evenementen</span>
          </h2>
          <p className="text-gray-600">Noteer deze data alvast in je agenda</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event, index) => (
            <Link key={event.title} href="/nieuws/events" className="group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
              >
                <div className={`bg-gradient-to-r ${event.color} p-4`}>
                  <div className="flex items-center justify-between">
                    <CalendarDays className="w-5 h-5 text-white/80" />
                    <span className="text-white font-semibold text-sm">{event.date}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{event.description}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/nieuws/events"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Bekijk alle evenementen
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
