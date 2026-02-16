"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Target, 
  FileText, 
  Shield, 
  Users, 
  UserPlus, 
  Lock,
  ArrowRight 
} from "lucide-react";
import type { ClubInfoSection } from "@/lib/clubinfo";

interface ClubInfoCardProps {
  section: ClubInfoSection;
  index?: number;
}

export function ClubInfoCard({ section, index = 0 }: ClubInfoCardProps) {
  const iconMap: { [key: string]: React.ElementType } = {
    target: Target,
    "file-text": FileText,
    shield: Shield,
    users: Users,
    "user-plus": UserPlus,
    lock: Lock
  };

  const Icon = iconMap[section.icon] || Target;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/clubinfo/sectie?slug=${section.slug}`}
        className="group block bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full border border-gray-100"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
            <Icon className="w-7 h-7" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {section.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {section.description}
            </p>

            {section.highlights && (
              <ul className="space-y-1 mb-4">
                {section.highlights.slice(0, 2).map((highlight, i) => (
                  <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center text-primary font-medium text-sm">
              Lees meer
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
