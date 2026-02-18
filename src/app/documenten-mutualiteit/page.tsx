"use client";

import { motion } from "framer-motion";
import { FileText, ArrowLeft, Download, Shield } from "lucide-react";
import Link from "next/link";

const mutualiteitDocumenten = [
  {
    naam: "CM",
    beschrijving: "Download het formulier voor CM (Christelijke Mutualiteit)",
    bestandsnaam: "CM.pdf"
  },
  {
    naam: "Helan",
    beschrijving: "Download het formulier voor Helan",
    bestandsnaam: "Helan.pdf"
  },
  {
    naam: "Liberale Mutualiteit",
    beschrijving: "Download het formulier voor Liberale Mutualiteit",
    bestandsnaam: "Liberale Mutualiteit.pdf"
  },
  {
    naam: "Solidaris",
    beschrijving: "Download het formulier voor Solidaris",
    bestandsnaam: "Solidaris.pdf"
  },
  {
    naam: "Vlaams & Neutraal ziekenfonds",
    beschrijving: "Download het formulier voor Vlaams & Neutraal ziekenfonds",
    bestandsnaam: "Vlaams & Neutraal ziekenfonds.pdf"
  }
];

export default function DocumentenMutualiteitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: '#8c1d1c' }}>
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500">Seizoen 2025-2026</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Documenten Mutualiteit
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Download hier de formulieren voor je mutualiteit. 
              Deze formulieren heb je nodig voor terugbetaling van voetbalgerelateerde kosten.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Documenten */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {mutualiteitDocumenten.map((doc, index) => (
              <motion.div
                key={doc.bestandsnaam}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#8c1d1c20' }}>
                      <FileText className="w-8 h-8" style={{ color: '#8c1d1c' }} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {doc.naam}
                      </h2>
                      <p className="text-gray-600">
                        {doc.beschrijving}
                      </p>
                    </div>
                    <a
                      href={`/Docs/documenten-mutualiteit/${encodeURIComponent(doc.bestandsnaam)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-colors whitespace-nowrap"
                      style={{ backgroundColor: '#8c1d1c' }}
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Info box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="rounded-2xl p-6 border mt-8"
              style={{ backgroundColor: '#8c1d1c10', borderColor: '#8c1d1c30' }}
            >
              <h3 className="font-bold mb-2" style={{ color: '#8c1d1c' }}>Belangrijke informatie</h3>
              <ul className="space-y-2" style={{ color: '#8c1d1c' }}>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Kies het formulier van jouw mutualiteit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Vul het formulier volledig in voordat je het indient bij je mutualiteit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Bewaar altijd een kopie van je ingevulde formulier.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Voor vragen over terugbetalingen, contacteer je eigen mutualiteit direct.</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
