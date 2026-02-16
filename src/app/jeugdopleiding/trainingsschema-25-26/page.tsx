"use client";

import { motion } from "framer-motion";
import { Clock, ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";

// Trainingsschema data gebaseerd op het officiële schema van de club
const campusLinkhout = [
  {
    groep: "Voetbaltuin (C-veld)",
    ma: "",
    di: "",
    wo: "18u00-19u00",
    do: "",
    vr: "",
    trainer: "Simon B & Lennert N",
    veld: "C-veld"
  },
  {
    groep: "U6 (C-veld)",
    ma: "18u00-19u00",
    di: "",
    wo: "18u00-19u00",
    do: "",
    vr: "",
    trainer: "Simon B & Lennert N",
    veld: "C-veld"
  },
  {
    groep: "U7 (C-veld)",
    ma: "",
    di: "18u00-19u15",
    wo: "",
    do: "18u00-19u15",
    vr: "",
    trainer: "Wesly T & Abdullah S",
    veld: "C-veld"
  },
  {
    groep: "U8 (B-veld rechts)",
    ma: "",
    di: "18u00-19u30",
    wo: "",
    do: "18u00-19u30",
    vr: "",
    trainer: "Kevin K",
    veld: "B-veld rechts"
  },
  {
    groep: "U9 (B-veld rechts)",
    ma: "",
    di: "18u00-19u30",
    wo: "",
    do: "18u00-19u30",
    vr: "",
    trainer: "Staf V",
    veld: "B-veld rechts"
  },
  {
    groep: "U10 (B-veld links)",
    ma: "18u00-19u30",
    di: "",
    wo: "18u00-19u30",
    do: "",
    vr: "",
    trainer: "Frankie F",
    veld: "B-veld links"
  },
  {
    groep: "U11 (B-veld links)",
    ma: "18u00-19u30",
    di: "",
    wo: "18u00-19u30",
    do: "",
    vr: "",
    trainer: "Maarten C",
    veld: "B-veld links"
  },
  {
    groep: "U12 (B-veld rechts)",
    ma: "18u00-19u30",
    di: "",
    wo: "18u00-19u30",
    do: "",
    vr: "",
    trainer: "Stijn V",
    veld: "B-veld rechts"
  },
];

const campusZelem = [
  {
    groep: "U13 (Zelem)",
    ma: "18u00-19u25",
    di: "",
    wo: "18u00-19u25",
    do: "",
    vr: "",
    trainer: "Pieter P",
    veld: "Zelem"
  },
  {
    groep: "U15 (Zelem)",
    ma: "18u00-19u25",
    di: "",
    wo: "16u30-18u00",
    do: "",
    vr: "",
    trainer: "Jasper P",
    veld: "Zelem"
  },
  {
    groep: "U17 (Zelem)",
    ma: "",
    di: "18u00-19u25",
    wo: "",
    do: "18u00-19u25",
    vr: "",
    trainer: "Steven B",
    veld: "Zelem"
  },
  {
    groep: "Senioren (Zelem)",
    ma: "",
    di: "19u30-21u00",
    wo: "",
    do: "19u30-21u00",
    vr: "",
    trainer: "Patrick / Ramon / Steven V / Steven B",
    veld: "Zelem"
  },
  {
    groep: "WU16 (Zelem)",
    ma: "19u35-21u00",
    di: "",
    wo: "19u35-21u00",
    do: "",
    vr: "",
    trainer: "Thomas K & Danny G",
    veld: "Zelem"
  },
  {
    groep: "WU20 (Zelem)",
    ma: "19u35-21u00",
    di: "",
    wo: "19u35-21u00",
    do: "",
    vr: "",
    trainer: "Steven B",
    veld: "Zelem"
  },
  {
    groep: "P2 Dames (Zelem)",
    ma: "19u35-21u00",
    di: "",
    wo: "19u35-21u00",
    do: "",
    vr: "",
    trainer: "Frank S",
    veld: "Zelem"
  },
];

interface TrainingRowProps {
  training: typeof campusLinkhout[0];
  index: number;
}

function TrainingRow({ training, index }: TrainingRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-gray-100 hover:bg-red-50/50 transition-colors"
    >
      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
        {training.groep}
      </td>
      <td className={`px-4 py-3 text-center ${training.ma ? "text-gray-900 font-medium" : "text-gray-300"}`}>
        {training.ma || "-"}
      </td>
      <td className={`px-4 py-3 text-center ${training.di ? "text-gray-900 font-medium" : "text-gray-300"}`}>
        {training.di || "-"}
      </td>
      <td className={`px-4 py-3 text-center ${training.wo ? "text-gray-900 font-medium" : "text-gray-300"}`}>
        {training.wo || "-"}
      </td>
      <td className={`px-4 py-3 text-center ${training.do ? "text-gray-900 font-medium" : "text-gray-300"}`}>
        {training.do || "-"}
      </td>
      <td className={`px-4 py-3 text-center ${training.vr ? "text-gray-900 font-medium" : "text-gray-300"}`}>
        {training.vr || "-"}
      </td>
      <td className="px-4 py-3 text-gray-600 text-sm">
        {training.trainer}
      </td>
    </motion.tr>
  );
}

export default function TrainingsschemaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/jeugdopleiding" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar jeugdopleiding
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>
              <span className="text-sm font-medium text-white/80">Seizoen 2025-2026</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Schema Trainingen</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Bekijk hieronder alle trainingstijden voor het seizoen 2025-2026. Kom steeds op tijd!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Campus Linkhout */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">Campus Linkhout</h2>
            </div>
            <p className="text-gray-600 ml-9">Kapelstraat 72, 3560 Linkhout</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto flex justify-center">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="text-left px-4 py-4 font-semibold">Groep</th>
                    <th className="text-center px-4 py-4 font-semibold">Ma</th>
                    <th className="text-center px-4 py-4 font-semibold">Di</th>
                    <th className="text-center px-4 py-4 font-semibold">Wo</th>
                    <th className="text-center px-4 py-4 font-semibold">Do</th>
                    <th className="text-center px-4 py-4 font-semibold">Vr</th>
                    <th className="text-left px-4 py-4 font-semibold">
                      <Users className="w-4 h-4 inline mr-1" />
                      Trainer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campusLinkhout.map((training, index) => (
                    <TrainingRow key={training.groep} training={training} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Campus Zelem */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">Campus Zelem</h2>
            </div>
            <p className="text-gray-600 ml-9">Zelem</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto flex justify-center">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="text-left px-4 py-4 font-semibold">Groep</th>
                    <th className="text-center px-4 py-4 font-semibold">Ma</th>
                    <th className="text-center px-4 py-4 font-semibold">Di</th>
                    <th className="text-center px-4 py-4 font-semibold">Wo</th>
                    <th className="text-center px-4 py-4 font-semibold">Do</th>
                    <th className="text-center px-4 py-4 font-semibold">Vr</th>
                    <th className="text-left px-4 py-4 font-semibold">
                      <Users className="w-4 h-4 inline mr-1" />
                      Trainer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campusZelem.map((training, index) => (
                    <TrainingRow key={training.groep} training={training} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Op tijd komen</h3>
              <p className="text-gray-600 text-sm">Wees 10 minuten voor aanvang aanwezig zodat je rustig kan opwarmen.</p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Trainingkledij</h3>
              <p className="text-gray-600 text-sm">Koud weer: Draag laagjes (thermokleding), een lange (trainings)broek, een shirt met lange mouwen en een trainingsjack.</p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Locaties</h3>
              <p className="text-gray-600 text-sm">Controleer steeds op welk veld je moet zijn. Linkhout of Zelem.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
