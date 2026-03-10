"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[500px] md:min-h-[400px] py-12 md:py-0 md:h-[48vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />

      <div className="container-custom relative z-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="relative w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
              <Image
                src="/images/kwslinkhout-logo.png"
                alt="KWS Linkhout"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          <div className="text-center md:text-left">
            <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
              Stamnummer 03531 • Est. 1938
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4 tracking-tight">
              KWS Linkhout
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto md:mx-0">
              Meer dan voetbal. Een familie. Een passie. Een traditie sinds 1938.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              <Link
                href="/ploegen"
                className="btn-primary bg-white text-primary hover:bg-gray-100 text-sm md:text-base"
              >
                Ontdek Onze 22 Ploegen
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/clubinfo/sectie?slug=nieuwe-aansluiting"
                className="btn-secondary border-white text-white hover:bg-white/10 text-sm md:text-base"
              >
                Word Lid
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
