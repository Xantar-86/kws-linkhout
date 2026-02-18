"use client";

import { motion } from "framer-motion";
import { Newspaper, Mail, ExternalLink, FileText, Download, CreditCard, Shield } from "lucide-react";
import Link from "next/link";
import { getFeaturedArticle } from "@/lib/news";
import { pressArticles } from "@/lib/press";
import { FeaturedArticle } from "@/components/news/FeaturedArticle";
import { PressCard } from "@/components/news/PressCard";

export default function NewsPage() {
  const featuredArticle = getFeaturedArticle();

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
              <Newspaper className="w-4 h-4" />
              Laatste updates
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nieuws & Updates
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Blijf op de hoogte van alles wat er gebeurt bij KWS Linkhout.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Featured Article */}
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}

          {/* Quick Links - Digitaal Betalen & Documenten Mutualiteit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Digitaal Betalen
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Betaal voortaan ook digitaal @ KWS Linkhout
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
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
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Volledige Nieuwsbrief PDF */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Volledige nieuwsbrief bekijken
                </h3>
                <p className="text-gray-600">
                  Download de volledige nieuwsbrief als PDF met alle informatie over het einde van het seizoen 
                  en de voorbereidingen op het nieuwe seizoen.
                </p>
              </div>
              <a
                href="/Docs/nieuws/nieuwsbrief.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </a>
            </div>
          </motion.div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-primary-700 rounded-3xl p-8 md:p-12 text-white text-center mb-16"
          >
            <Mail className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Blijf op de hoogte
            </h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Schrijf je in voor onze nieuwsbrief en ontvang wekelijks het laatste nieuws, 
              ploegupdates en informatie over evenementen.
            </p>
            <Link
              href="/nieuwsbrief"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Inschrijven
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* In de Krant Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              KWS Linkhout in de media
            </h2>
            <p className="text-gray-600">
              Onze club in het nieuws
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pressArticles.slice(0, 4).map((article, index) => (
              <PressCard key={article.id} article={article} index={index} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/in-de-krant"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Bekijk alle krantenartikelen
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
