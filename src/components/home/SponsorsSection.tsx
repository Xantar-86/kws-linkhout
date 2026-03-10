"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const sponsors = [
  { name: "Roof Projects", image: "/images/sponsors/roof-projects.png" },
  { name: "Salesforce", image: "/images/sponsors/Salesforce.png" },
  { name: "De Backer", image: "/images/sponsors/de-backer.jpeg" },
  { name: "Lumen", image: "/images/sponsors/lumen.png" },
  { name: "PD Bouw", image: "/images/sponsors/pd-bouw.png" },
  { name: "AA Drink", image: "/images/sponsors/aa-drink.png" },
  { name: "Spar", image: "/images/sponsors/spar.jpg" },
];

export function SponsorsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Onze <span className="text-primary">Sponsors</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            KWS Linkhout dankt zijn succes aan de steun van onze gewaardeerde sponsors.
            Samen maken we het verschil!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-gray-50 rounded-2xl p-6 h-32 flex items-center justify-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-primary/20">
                <img
                  src={sponsor.image}
                  alt={sponsor.name}
                  className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm mb-4">Ook sponsor worden? Neem contact met ons op!</p>
          <Link
            href="/contact"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Contacteer ons
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
