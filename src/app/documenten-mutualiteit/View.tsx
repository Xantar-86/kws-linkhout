"use client";

import { motion } from "framer-motion";
import { FileText, ArrowLeft, Download, Shield } from "lucide-react";
import Link from "next/link";
import type { MutualiteitSectie } from "@/lib/mutualiteit";
import { PaginaKop } from "@/components/PaginaKop";

function bestandHref(bestand: string): string {
  if (!bestand) return "#";
  if (/^https?:\/\//i.test(bestand)) return bestand;
  const prefix = bestand.startsWith("/") ? "" : "/";
  return (
    prefix +
    bestand
      .split("/")
      .map((segment, i) =>
        i === 0 && segment === "" ? segment : encodeURIComponent(segment)
      )
      .join("/")
  );
}

export function DocumentenMutualiteitView({ secties }: { secties: MutualiteitSectie[] }) {
  return (
    <div className="min-h-screen bg-gray-50">

      <PaginaKop
        terug={{ naar: "/", label: "Terug naar de startpagina" }}
        opschrift="Seizoen 2026-2027"
        icoon={Shield}
        titel="Documenten voor je mutualiteit"
        accent="mutualiteit"
        onder="De formulieren die je nodig hebt om je lidgeld en je medische kosten terugbetaald te krijgen."
      />

      {/* Documenten */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-10"
          >
            {secties.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Nog geen documenten beschikbaar.
              </div>
            ) : (
              secties.map((sectie, sectieIndex) => (
                <div key={sectie.titel}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2" style={{ borderColor: '#8c1d1c' }}>
                    {sectie.titel}
                  </h2>
                  <div className="space-y-4">
                    {sectie.documenten.map((doc, index) => (
                      <motion.div
                        key={`${sectie.titel}-${doc.naam}-${doc.bestand}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + sectieIndex * 0.3 + index * 0.1 }}
                        className="kaart border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="p-6 md:p-8">
                          <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#8c1d1c20' }}>
                              <FileText className="w-8 h-8" style={{ color: '#8c1d1c' }} />
                            </div>
                            <div className="flex-1">
                              <h3 className="heading-3 mb-2">
                                {doc.naam}
                              </h3>
                              <p className="text-gray-600">
                                {doc.beschrijving}
                              </p>
                            </div>
                            <a
                              href={bestandHref(doc.bestand)}
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
                  </div>
                </div>
              ))
            )}

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
