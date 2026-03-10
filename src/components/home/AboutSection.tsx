"use client";

import { motion } from "framer-motion";
import { TypeWriter } from "./TypeWriter";
import { GeschiedenisButton } from "./HistoryModal";

export function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="heading-2 mb-6 min-h-[3rem]">
              <TypeWriter text="Een club met een hart" delay={80} highlightWord="hart" />
            </h2>
            <p className="text-body mb-6">
              Bij KWS Linkhout draait het niet alleen om voetbal. Het gaat om vriendschap, respect
              en samen groeien. Van onze jongste U6-spelers tot onze veteranen - iedereen telt mee.
            </p>
            <p className="text-body mb-8">
              Met 22 ploegen, waaronder 5 meisjesploegen, is er voor ieder wat wils. Kom eens langs
              en ervaar de unieke sfeer zelf!
            </p>
            <GeschiedenisButton />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl transform rotate-3" />
            <div className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white p-4 rounded-2xl shadow-2xl">
                <img
                  src="/images/foto-homepage.jpg"
                  alt="KWS Linkhout teams"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-center text-sm text-gray-500 mt-3 font-medium">
                  Onze trots: 22 ploegen, 250+ leden
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
