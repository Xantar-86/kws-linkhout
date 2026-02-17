"use client";

import { motion } from "framer-motion";
import { UserPlus, Mail, MessageCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export function RegistrationForm() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-primary to-primary-700 rounded-3xl p-8 md:p-12 text-white"
    >
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Word lid van KWS Linkhout!
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            Wil jouw zoon of dochter bij ons komen voetballen? Vul het Inschrijvingsformulier in 
            en wij nemen zo snel mogelijk contact op.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Voor alle leeftijden (U6 tot senioren)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Inclusief verzekering & clubkledij</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Snelle opvolging</span>
            </div>
          </div>

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdSw7GBB_yFZ3DDGCkTLJPwLjKzmTFX_8FlL0aOnxmqc43v9g/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Inschrijvingsformulier invullen
          </a>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Contact per categorie</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Jeugd</h4>
                <p className="text-sm text-white/80">tvjo@kwslinkhout.be</p>
                <p className="text-sm text-white/80">0494 84 36 93</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Dames</h4>
                <p className="text-sm text-white/80">info@kwslinkhout.be</p>
                <p className="text-sm text-white/80">0479 07 35 55</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Senioren</h4>
                <p className="text-sm text-white/80">info@kwslinkhout.be</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm text-white/80">
              Lidgeld vanaf €150/jaar (inclusief verzekering & kledij)
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
