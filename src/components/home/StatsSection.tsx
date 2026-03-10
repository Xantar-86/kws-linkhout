"use client";

import { motion } from "framer-motion";
import { Trophy, Users, Calendar, Users2 } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";

const stats = [
  { icon: Trophy, label: "Opgericht", value: 1938, suffix: "" },
  { icon: Users, label: "Actieve Leden", value: 250, suffix: "+" },
  { icon: Calendar, label: "Ploegen", value: 22, suffix: "" },
  { icon: Users2, label: "Damesploegen", value: 5, suffix: "" },
];

export function StatsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
