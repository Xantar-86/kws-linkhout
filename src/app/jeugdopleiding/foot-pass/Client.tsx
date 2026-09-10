"use client";

import { motion } from "framer-motion";
import { Globe, ArrowLeft, Trophy, Award, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PaginaKop } from "@/components/PaginaKop";

export default function FootPassPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <PaginaKop
        terug={{ naar: "/jeugdopleiding", label: "Terug naar jeugdopleiding" }}
        titel="Foot Pass"
        accent="Pass"
        onder="Scoor met Foot PASS!"
      />

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="bg-primary/5 rounded-2xl p-8 border border-zand-200/70 mb-8"
          >
            <p className="text-primary text-lg leading-relaxed">
              Als club scoor je altijd met Foot PASS! Je zet niet alleen jouw club op de kaart, 
              maar werkt ook verder aan de kwalitatieve uitbouw van jouw jeugdopleiding. 
              <span className="font-bold"> Toekomst verzekerd!</span>
            </p>
          </motion.div>

          {/* Sectie 1: Subsidies */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="kaart border border-gray-100 overflow-hidden mb-8"
          >
            <div className="bg-primary text-white px-6 py-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6" />
                <h2 className="text-xl font-bold">1. Geniet mee van subsidies uit het &apos;jeugdfonds&apos; van de VFV!</h2>
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
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="kaart border border-gray-100 overflow-hidden mb-8"
          >
            <div className="border-b border-zand-200/70 px-6 py-5">
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
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="kaart border border-gray-100 p-8 text-center mb-8"
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
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          >
            <h2 className="heading-3 mb-6 text-center">Voordelen van Foot Pass</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="kaart p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Kwaliteitsaudit</h3>
                <p className="text-gray-600 text-sm">Objectieve meting van je jeugdopleiding</p>
              </div>
              <div className="kaart p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Subsidies</h3>
                <p className="text-gray-600 text-sm">Financiële ondersteuning voor jeugdwerking</p>
              </div>
              <div className="kaart p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
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
