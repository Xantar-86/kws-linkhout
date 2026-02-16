"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import type { NewsArticle } from "@/lib/news";

interface FeaturedArticleProps {
  article: NewsArticle;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const categoryColors = {
    clubnieuws: "bg-blue-600",
    ploegnieuws: "bg-green-600", 
    evenementen: "bg-orange-600"
  };

  const categoryLabels = {
    clubnieuws: "Clubnieuws",
    ploegnieuws: "Ploegnieuws",
    evenementen: "Evenementen"
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-BE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-12"
    >
      <Link 
        href={`/nieuws/artikel?slug=${article.slug}`}
        className="group block bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-[400px] overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute top-6 left-6">
              <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                Uitgelicht
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className={`${categoryColors[article.category]} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                {categoryLabels[article.category]}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime} min
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
              {article.title}
            </h2>

            <p className="text-gray-600 text-lg mb-6 line-clamp-3">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                {article.author}
              </div>
            </div>

            <div className="flex items-center text-primary font-semibold">
              Lees het volledige artikel
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.section>
  );
}
