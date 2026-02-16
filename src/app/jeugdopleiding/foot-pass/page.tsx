"use client";

import { motion } from "framer-motion";
import { Globe, ArrowLeft, Trophy, Award, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FootPassPage() {
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
            <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 p-2">
              <Image
                src="/images/foot_pass.png"
                alt="Foot Pass"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Foot Pass</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Scoor met Foot PASS!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-teal-50 rounded-2xl p-8 border border-teal-100 mb-8"
          >
            <p className="text-teal-800 text-lg leading-relaxed">
              Als club scoor je altijd met Foot PASS! Je zet niet alleen jouw club op de kaart, 
              maar werkt ook verder aan de kwalitatieve uitbouw van jouw jeugdopleiding. 
              <span className="font-bold"> Toekomst verzekerd!</span>
            </p>
          </motion.div>

          {/* Sectie 1: Subsidies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
          >
            <div className="bg-primary text-white px-6 py-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6" />
                <h2 className="text-xl font-bold">1. Geniet mee van subsidies uit het 'jeugdfonds' van de VFV!</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                De Voetbalfederatie Vlaanderen (VFV) heeft een nieuw project opgestart om de kwaliteit 
                van de jeugdwerking in haar clubs te verbeteren. Hiervoor wordt officieel samengewerkt 
                met Foot PASS voor de uitvoering van een objectieve audit in de clubs.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Deze audit leidt echter niet alleen tot concreet advies, maar zal ook de mogelijkheid 
                bieden om aanspraak te maken op werkingssubsidies uit een nieuw jeugdsportfonds. 
                Let op, ook voor het laten uitvoeren van de audit worden subsidies voorzien!
              </p>
              <p className="text-gray-700 leading-relaxed font-medium">
                Een unieke kans dus om de kwaliteit van jouw jeugdopleiding te laten meten 
                en hiervoor ook nog eens financieel ondersteund te worden.
              </p>
              <a 
                href="https://www.voetbalvlaanderen.be/jeugdsportfonds" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-primary font-medium hover:underline"
              >
                Meer informatie over de FO Jeugdsport van de VFV
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Sectie 2: Kwaliteitslabel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
          >
            <div className="bg-amber-500 text-white px-6 py-4">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6" />
                <h2 className="text-xl font-bold">2. Onderscheid je met een kwaliteitslabel</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Vandaag wordt veel belang gehecht aan kwaliteit. Niet alleen de ouders, maar ook 
                de trainers, de sponsors en de overheid verlangen steeds meer van de club.
              </p>
              <p className="text-gray-700 leading-relaxed font-medium">
                Laat hen weten dat jullie voor kwaliteit staan! Met het Foot PASS kwaliteitslabel 
                kan je hen overtuigen.
              </p>
            </div>
          </motion.div>

          {/* Foot Pass Logo groot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center mb-8"
          >
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <Image
                src="/images/foot_pass.png"
                alt="Foot Pass - Quality in Sports"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Quality in Sports</p>
          </motion.div>

          {/* Voordelen (behouden) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Voordelen van Foot Pass</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Kwaliteitsaudit</h3>
                <p className="text-gray-600 text-sm">Objectieve meting van je jeugdopleiding</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Subsidies</h3>
                <p className="text-gray-600 text-sm">Financiële ondersteuning voor jeugdwerking</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Kwaliteitslabel</h3>
                <p className="text-gray-600 text-sm">Toon aan dat je voor kwaliteit staat</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
