"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Users, History, Calendar, Heart } from "lucide-react";
import Link from "next/link";

export default function DamesOverOnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-24">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4 inline mr-2" />
              Damesvoetbal
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              KWS Linkhout: Pionier van het Damesvoetbal
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Geschiedenis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-lg mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <History className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Geschiedenis</h2>
            </div>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                Linkhout is een typisch Kempische gemeente in de Demervallei met de onverzettelijkheid die haar eigen is. 
                Ook in de voetbalsport kwam dit tot uiting. Volgens annalen is WS Linkhout gestart in 1938. 
                Op een zondagvoormiddag na de Hoogmis werden in café van Richard Pluymers de koppen bij mekaar gestoken. 
                Die van de Sparta – ze voetbalden reeds in de zandkuil van Luyten – kwamen met de vraag om eens 
                tegen het Dorp te voetballen. Dit eerste Linkhoutse treffen vond plaats in de wei aan Tist bij de Demer. 
                En de overwinning smaakte zoet, heel zoet. Het recht op revanche werd gelicht en van het één kwam het ander. 
                Uiteindelijk werd besloten om een eigen ploeg op te richten en de draad van de White-Star 
                – een kortstondige ploeg in de jaren dertig – werd terug opgenomen.
              </p>
              <p className="text-primary font-semibold italic">
                We tekenen 2011, na exact 73 jaar zal KWS Linkhout de eerste beginselen leggen aan de basis 
                van de drie Linkhoutse vrouwenploegen...
              </p>
            </div>
          </motion.div>

          {/* Heden */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-lg mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Heden</h2>
            </div>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                Na maar liefst drie Recrea Damesploegen in de rangen te hebben gehad, heeft KWS Linkhout 
                een sterke en toekomstgerichte meisjes- en dameswerking uitgebouwd.
              </p>
              <p>
                In het seizoen 22-23 zetten we een nieuwe stap met de opstart van een volwaardige U16 (8v8) damescompetitieploeg 
                en dat bleek meteen een schot in de roos.
              </p>
              <p>
                Dankzij de voortdurende groei én het succes van onze dameswerking telt de club vandaag vier volwaardige damesploegen: 
                WU8, WU16, WU20 en onze eerste damesploeg, die dit seizoen zelfs de promotie naar 1ste provinciale afdwingt. 
                Een prachtige bekroning van het harde werk van speelsters, trainers en vrijwilligers.
              </p>
              <p>
                Maar onze dames schitteren niet alleen op het veld. Ook naast het veld tonen ze hun engagement. 
                Ze organiseren tal van activiteiten voor de club en haar supporters en zorgen telkens opnieuw 
                voor een warme, enthousiaste en sportieve clubsfeer.
              </p>
              <p>
                Momenteel tellen we 4
              </p>
            </div>
          </motion.div>

          {/* Werking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-lg mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Werking</h2>
            </div>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                Door ervaring weten wij dat meisjes (indien gewenst) liefst zo lang mogelijk mee blijven 
                spelen bij gemengde jeugdploegen om duelkracht te onderhouden en te verbeteren.
              </p>
              <p>
                Ook bij KWS Linkhout is er de mogelijkheid om deze extra trainingen / wedstrijden mee te nemen.
              </p>
              <p>
                Onze club is een leuke omgeving met een recente accommodatie waar iedereen wordt gewaardeerd 
                en gerespecteerd – en al voetballend kan groeien en plezier maken.
              </p>
              <p className="font-semibold text-gray-900">
                Ben jij geïnteresseerd en ben je op zoek naar een (nieuwe) club, aarzel dan zeker niet om ons te contacteren.
              </p>
              <p>
                Dit kan via de onderstaande nummers of via{" "}
                <a href="mailto:info@kwslinkhout.be" className="text-primary hover:underline">
                  info@kwslinkhout.be
                </a>
              </p>
              <p>
                Voor volgend seizoen zijn we nog op zoek naar meisjes van 11 jaar tem 20 jaar.
              </p>
              <p>
                Ben je jonger dan 11? Geen probleem, voor jou hebben we ook zeker plaats binnen onze club. 
                Je kan dan steeds terecht bij onze gemengde jeugdploegen waar je verder kan groeien om 
                nadien mee in het project te stappen van de U16 Damesploeg.
              </p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-10"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Aarzel dus niet, KWS Linkhout verwelkomt je graag!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Kristof Mondelaers</h3>
                <p className="text-sm text-gray-500 mb-2">T1</p>
                <a 
                  href="tel:0476235729" 
                  className="flex items-center justify-center gap-2 text-primary hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  (0476) 23.57.29
                </a>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Ben Jouck</h3>
                <p className="text-sm text-gray-500 mb-2">Afgevaardigde</p>
                <a 
                  href="tel:0479073555" 
                  className="flex items-center justify-center gap-2 text-primary hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  (0479) 07.35.55
                </a>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Petra Mariën</h3>
                <p className="text-sm text-gray-500 mb-2">Ambassadrice</p>
                <a 
                  href="tel:0474503326" 
                  className="flex items-center justify-center gap-2 text-primary hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  (0474) 50.33.26
                </a>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a 
                href="mailto:info@kwslinkhout.be"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="w-5 h-5" />
                info@kwslinkhout.be
              </a>
            </div>
          </motion.div>

          {/* Back to teams */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link 
              href="/ploegen"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              ← Terug naar alle ploegen
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
