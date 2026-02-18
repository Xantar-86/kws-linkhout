"use client";

import { motion } from "framer-motion";
import { Info, FileText, Download } from "lucide-react";
import { clubInfoSections } from "@/lib/clubinfo";
import { ClubInfoCard } from "@/components/clubinfo/ClubInfoCard";
import { RegistrationForm } from "@/components/clubinfo/RegistrationForm";
import Link from "next/link";

export default function ClubInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Info className="w-4 h-4" />
              Over onze club
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Clubinfo
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Alles wat je moet weten over KWS Linkhout: onze missie, reglementen, 
              structuur en hoe je lid kan worden.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Registration CTA - Bovenaan voor nieuwe leden */}
          <div className="mb-16">
            <RegistrationForm />
          </div>

          {/* Info Cards Grid */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Belangrijke informatie
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hieronder vind je alle belangrijke documenten en informatie over onze club.
                Klik op een kaartje voor meer details.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubInfoSections.map((section, index) => (
                <ClubInfoCard 
                  key={section.id} 
                  section={section} 
                  index={index} 
                />
              ))}
            </div>
          </div>

          {/* Documenten Download Sectie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Documenten downloaden
                </h2>
                <p className="text-gray-600 mt-1">
                  Download hier alle belangrijke documenten van de club
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Huishoudelijk Reglement */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-primary transition-colors">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Huishoudelijk Reglement
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Alle regels en afspraken voor onze jeugdspelers. 
                        Verplicht leesvoer voor alle leden.
                      </p>
                      <div className="flex gap-3">
                        <Link
                          href="/clubinfo/sectie?slug=huishoudelijk-reglement"
                          className="flex-1 text-center py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                          Bekijken
                        </Link>
                        <a
                          href="/Docs/Huishoudelijk-Reglement.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-2 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
              </div>

              {/* Privacyverklaring */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-primary transition-colors">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Privacyverklaring
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Hoe wij omgaan met jouw persoonsgegevens. 
                        GDPR compliant privacybeleid.
                      </p>
                      <div className="flex gap-3">
                        <Link
                          href="/clubinfo/sectie?slug=privacyverklaring"
                          className="flex-1 text-center py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                          Bekijken
                        </Link>
                        <a
                          href="/Docs/Privacyverklaring.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-2 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-800 text-center">
                <strong>Tip:</strong> Je kan deze documenten ook terugvinden op de specifieke pagina's 
                waar ze bij horen. Klik op "Bekijken" om het volledige document online te lezen.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
