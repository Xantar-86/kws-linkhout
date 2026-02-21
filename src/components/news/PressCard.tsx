"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Calendar } from "lucide-react";
import type { PressArticle } from "@/lib/press";

interface PressCardProps {
  article: PressArticle;
  index?: number;
}

export function PressCard({ article, index = 0 }: PressCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-BE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link 
        href={article.pdf}
        target="_blank"
        rel="noopener noreferrer"
        className="group block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
      >
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
            <Image
              src={article.sourceLogo}
              alt={article.source}
              fill
              className="object-contain p-2"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="font-medium text-gray-700">{article.source}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(article.date)}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>

            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {article.summary}
            </p>

            <div className="flex items-center text-primary text-sm font-medium">
              Lees artikel
              <ExternalLink className="ml-1 w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
