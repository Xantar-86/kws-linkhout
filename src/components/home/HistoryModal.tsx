"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, ArrowRight } from "lucide-react";

function HistoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
              <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Geschiedenis van de Club</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(85vh-100px)]">
                <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">De Beginjaren</h3>
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

                  <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                    <p className="text-primary font-semibold italic m-0">
                      We tekenen 2011, na exact 73 jaar zal KWS Linkhout de eerste beginselen leggen aan de basis
                      van de drie Linkhoutse vrouwenploegen...
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button onClick={onClose} className="btn-primary">
                    Sluiten
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function GeschiedenisButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="btn-primary">
        Ontdek onze geschiedenis
        <ArrowRight className="ml-2 w-4 h-4" />
      </button>
      <HistoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
