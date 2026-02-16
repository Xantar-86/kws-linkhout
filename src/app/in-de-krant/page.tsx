"use client";

import { motion } from "framer-motion";
import { Newspaper, FileText, Calendar, Download, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { pressArticles } from "@/lib/press";
import { useState } from "react";

export default function PressPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-BE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  
  // Pagination
  const totalPages = Math.ceil(pressArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = pressArticles.slice(startIndex, startIndex + articlesPerPage);
  
  // Group by year for display
  const groupByYear = (articles: typeof pressArticles) => {
    const grouped: { [key: string]: typeof pressArticles } = {};
    articles.forEach(article => {
      const year = new Date(article.date).getFullYear().toString();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(article);
    });
    return grouped;
  };
  
  const groupedArticles = groupByYear(currentArticles);
  const sortedYears = Object.keys(groupedArticles).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Newspaper className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              In de Krant
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              KWS Linkhout in de media. Bekijk hier alle krantenartikelen over onze club.
            </p>
            <p className="text-white/70 mt-4">
              {pressArticles.length} artikelen beschikbaar
            </p>
          </motion.div>
        </div>
      </section>

      {/* Press Articles */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Year filter/info */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="text-gray-600">Archief vanaf:</span>
            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              2014
            </span>
            <span className="text-gray-400">tot</span>
            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              2019
            </span>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* PDF Preview Area */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
                        backgroundSize: '10px 10px'
                      }} />
                    </div>
                    
                    {/* PDF Icon */}
                    <div className="relative">
                      <div className="w-20 h-24 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center border border-gray-200 transform group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-10 h-10 text-red-500 mb-1" />
                        <span className="text-xs text-gray-400 font-medium">PDF</span>
                      </div>
                      {/* Glow effect */}
                      <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Year badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 shadow-sm">
                        {new Date(article.date).getFullYear()}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Source & Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span className="font-medium text-primary">{article.source}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(article.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-1">
                      {article.title}
                    </h3>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open PDF
                      </a>
                      <a
                        href={article.url}
                        download
                        className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Perscontact
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Ben je journalist en wil je meer informatie over KWS Linkhout? 
              Neem contact op met onze persverantwoordelijke.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
            >
              Contact opnemen
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
