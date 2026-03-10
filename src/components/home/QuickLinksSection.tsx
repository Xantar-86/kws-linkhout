"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, AlertTriangle, Camera, ArrowRight } from "lucide-react";

const quickLinks = [
  {
    title: "Trainingsschema",
    icon: Clock,
    href: "/jeugdopleiding/trainingsschema-25-26",
    description: "Bekijk alle trainingstijden",
    color: "from-primary-600 to-primary-800",
  },
  {
    title: "Voetbalongeval",
    icon: AlertTriangle,
    href: "/medisch/voetbalongeval",
    description: "Meld een ongeval of blessure",
    color: "from-red-600 to-red-800",
  },
  {
    title: "Foto's",
    icon: Camera,
    href: "/fotos",
    description: "Bekijk onze fotogalerij",
    color: "from-primary-600 to-primary-800",
  },
];

export function QuickLinksSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-8 text-gray-900"
        >
          Snel naar <span className="text-primary">...</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <Link href={link.href} className="group block h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  <div className={`bg-gradient-to-r ${link.color} p-4 text-center`}>
                    <h3 className="text-white font-semibold text-sm">{link.title}</h3>
                  </div>
                  <div className="p-6 flex flex-col items-center flex-1">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                      <link.icon className="w-10 h-10 text-gray-800 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-gray-600 text-sm text-center">{link.description}</p>
                    <div className="mt-auto pt-3 flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Ga naar <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
