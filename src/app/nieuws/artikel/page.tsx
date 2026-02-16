"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, Share2, MessageSquare, ExternalLink } from "lucide-react";
import { newsArticles, getArticleBySlug } from "@/lib/news";
import { NewsCard } from "@/components/news/NewsCard";
import React from "react";

// Simple markdown to HTML parser
const parseContent = (content: string) => {
  // Replace **bold** with <strong>bold</strong>
  let html = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace *italic* with <em>italic</em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Replace [text](url) with <a href="url">text</a>
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">$1</a>');
  
  // Replace • bullet points with styled list items
  html = html.replace(/•\s(.*?)(?=\n|$)/g, '<li class="flex items-start gap-2"><span class="text-primary mt-1.5">•</span><span>$1</span></li>');
  
  // Wrap consecutive list items in <ul>
  html = html.replace(/(<li.*?>.*?<\/li>\n?)+/g, '<ul class="space-y-2 my-4">$&</ul>');
  
  // Replace newlines with <br /> (but not inside lists)
  html = html.split('\n').map(line => {
    if (line.trim().startsWith('<') && !line.includes('</li>')) {
      return line;
    }
    return line + '<br />';
  }).join('\n');
  
  return html;
};

function ArticleContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const article = slug ? getArticleBySlug(slug) : null;

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

  // Related articles (same category, excluding current)
  const relatedArticles = article 
    ? newsArticles
        .filter(a => a.category === article.category && a.slug !== article.slug)
        .slice(0, 3)
    : [];

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Artikel niet gevonden
          </h1>
          <p className="text-gray-600 mb-6">
            Het artikel dat je zoekt bestaat niet.
          </p>
          <Link
            href="/nieuws"
            className="inline-flex items-center gap-2 text-primary font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar nieuws
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link
            href="/nieuws"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar overzicht
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <section className="bg-white">
        <div className="container-custom py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`${categoryColors[article.category]} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                {categoryLabels[article.category]}
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-4 h-4" />
                {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                {article.readTime} min leestijd
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-5 h-5" />
                <span className="font-medium">{article.author}</span>
              </div>
              <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
                Delen
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-white pb-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[300px] md:h-[500px] rounded-3xl overflow-hidden"
          >
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
              {article.excerpt}
            </p>
            <div 
              className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: parseContent(article.content) }}
            />
          </motion.article>
        </div>
      </section>

      {/* Survey CTA for Ledenbevraging */}
      {article.slug === "ledenbevraging-2025" && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-8 bg-gradient-to-br from-primary to-primary-700 rounded-2xl text-white text-center"
            >
              <MessageSquare className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                Deel jouw mening!
              </h3>
              <p className="text-white/90 mb-6">
                Help onze club groeien door de ledenbevraging in te vullen. 
                Samen maken we KWS Linkhout nog beter!
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdKHXqQAkwHdUixHQL-qRic31xmkDR8ruRbzFIAhdDNHOADjw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Bevraging invullen
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Gerelateerde artikelen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <NewsCard 
                  key={relatedArticle.id} 
                  article={relatedArticle} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Main component wrapped in Suspense for useSearchParams
export default function ArticlePage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <ArticleContent />
    </React.Suspense>
  );
}
