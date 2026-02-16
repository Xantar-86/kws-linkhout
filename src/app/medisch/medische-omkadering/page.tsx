"use client";

import { motion } from "framer-motion";
import { Shield, ArrowLeft, Award, Package, CheckCircle, FileText, Stethoscope } from "lucide-react";
import Link from "next/link";

const certificeringen = [
  "EHBO-verantwoordelijken beschikken over geldig BHV/EHBO certificaat",
  "Jaarlijkse hercertificering EHBO-team",
  "Meerdere trainers beschikken over voetbalmedisch attest (KBVB)",
  "Club werkt samen met lokale huisartsen en ziekenhuizen",
  "AED-gecertificeerde vrijwilligers aanwezig bij alle activiteiten"
];

const uitrusting = [
  {
    categorie: "EHBO-materiaal",
    items: ["Verbandtrommels", "Ispacks", "Spalken", "Wondverzorging", "Hemostatische verbanden"]
  },
  {
    categorie: "Reanimatie",
    items: ["AED-toestel (kantine)", "Zuurstofmaskers", "Beademingsmaskers", "Reanimatiepop"]
  },
  {
    categorie: "Overige",
    items: ["Rugplanken", "Brancards", "Krukken", "Koeltassen", "Fysiotape"]
  }
];

export default function MedischeOmkaderingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/medisch" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar medisch
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 py-16">
        <div className="container-custom text-center text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Medische Omkadering</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              KWS Linkhout zet in op een veilige sportomgeving met gekwalificeerde EHBO'ers 
              en goede medische voorzieningen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Medische Omkadering - Nieuwe tekst */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-blue-50 rounded-2xl p-8 border border-blue-100 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-blue-900">Medische omkadering</h2>
              </div>
              <div className="space-y-4 text-blue-800">
                <p className="leading-relaxed">
                  Zodra een kind langer dan 2 weken afwezig is owv een medische reden, dient aan de trainer 
                  een attest van de arts voorgelegd te worden dat sporthervatting mogelijk is, eventueel met 
                  mogelijke beperkingen betreffende de trainingsinvulling/wedstrijd.
                </p>
                <p className="leading-relaxed">
                  Dit om te voorkomen dat het kind te vroeg zijn training/wedstrijd hervat waardoor er 
                  ernstigere letsels zouden kunnen ontstaan.
                </p>
                <p className="leading-relaxed">
                  Bij het aanhouden van klachten ten gevolge van een sportblessure, bestaat er de mogelijkheid 
                  om één van de sportartsen verbonden aan de club te consulteren.
                </p>
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-green-50 rounded-2xl p-8 border border-green-100 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <Award className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-green-900">Certificeringen</h2>
              </div>
              <ul className="space-y-3">
                {certificeringen.map((cert, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-green-800">{cert}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Equipment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Package className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Medische Uitrusting</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {uitrusting.map((cat, index) => (
                  <div key={index} className="bg-white rounded-xl p-4">
                    <h3 className="font-bold text-gray-900 mb-3">{cat.categorie}</h3>
                    <ul className="space-y-1">
                      {cat.items.map((item, i) => (
                        <li key={i} className="text-gray-600 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* EHBO Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-blue-50 rounded-2xl p-8 border border-blue-100 mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-blue-900">EHBO & Medische Ondersteuning</h2>
              </div>
              <div className="space-y-4 text-blue-800">
                <p>
                  <strong className="text-blue-900">EHBO aanwezigheid:</strong> Bij alle trainingen en wedstrijden is er minstens 
                  één persoon met geldig EHBO certificaat aanwezig.
                </p>
                <p>
                  <strong className="text-blue-900">Eerste hulp:</strong> Directe eerste hulp bij ongevallen, 
                  begeleiding naar ziekenhuis of huisarts indien nodig.
                </p>
                <p>
                  <strong className="text-blue-900">Blessurepreventie:</strong> Aandacht voor warming-up, cooling-down 
                  en veilige trainingsmethodes.
                </p>
              </div>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center bg-gray-50 rounded-xl p-8 border border-gray-200"
            >
              <blockquote className="text-xl italic text-gray-700 mb-4">
                "Veiligheid staat voorop. Goede EHBO-voorzieningen maken het verschil."
              </blockquote>
              <cite className="text-gray-500">— KWS Linkhout</cite>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
