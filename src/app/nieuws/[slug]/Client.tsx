"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, Share2, FileText, X, ZoomIn } from "lucide-react";
import { useState } from "react";
import type { NewsArticle } from "@/lib/news";
import { PaginaKop } from "@/components/PaginaKop";

// Simple markdown to HTML parser
const parseContent = (content: string) => {
  let html = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/##\s+(.*?)(?=\n|$)/g, '<h2 class="heading-3 mt-8 mb-4">$1</h2>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">$1</a>');
  html = html.replace(/^-\s+(.*?)(?=\n|$)/gm, '<li class="flex items-start gap-2"><span class="text-primary mt-1.5">•</span><span>$1</span></li>');
  html = html.replace(/(<li.*?>.*?<\/li>\n?)+/g, '<ul class="space-y-2 my-4">$&</ul>');
  html = html.split('\n').map(line => {
    if (line.trim().startsWith('<') && !line.includes('</li>')) return line;
    return line + '<br />';
  }).join('\n');
  return html;
};

const categoryColors: Record<string, string> = {
  clubnieuws: "bg-primary",
  ploegnieuws: "bg-primary", 
  evenementen: "bg-primary"
};

const categoryLabels: Record<string, string> = {
  clubnieuws: "Clubnieuws",
  ploegnieuws: "Ploegnieuws",
  evenementen: "Evenementen"
};

/**
 * Een nieuwsartikel. Het adres is /nieuws/<slug>; de server (page.tsx) zoekt
 * het artikel op en geeft het door, en zorgt voor titel, beschrijving en
 * canonical. Vroeger laadde deze pagina het artikel zelf via de API achter
 * ?slug=, en dan zag Google alleen een draaiend wieltje.
 */
export default function ArticleClient({ article }: { article: NewsArticle }) {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-BE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <PaginaKop
        terug={{ naar: "/nieuws", label: "Terug naar het nieuws" }}
        opschrift={`${categoryLabels[article.category] || article.category} · ${formatDate(article.date)} · ${article.readTime} min leestijd`}
        titel={article.title}
        onder={article.excerpt}
      />

      {/* Featured Image - Klikbaar */}
      {article.image && (
        <section className="bg-white pb-12">
          <div className="container-custom">
            <div 
              className="relative h-[300px] md:h-[500px] rounded-3xl overflow-hidden cursor-pointer group"
              onClick={() => setImageModalOpen(true)}
            >
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              {/* Zoom indicator */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
                  <ZoomIn className="w-6 h-6 text-gray-800" />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              Klik op de foto om volledig te bekijken
            </p>
          </div>
        </section>
      )}

      {/* Image Modal / Lightbox */}
      {imageModalOpen && article.image && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
            onClick={() => setImageModalOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          <div 
            className="relative w-full h-full max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <article className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
              {article.excerpt}
            </p>
            <div 
              className="lopende-tekst"
              dangerouslySetInnerHTML={{ __html: parseContent(article.content) }}
            />
          </article>

          {/* Attachment */}
          {article.attachment && (
            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Bijlage</h3>
                  <p className="text-sm text-gray-500">
                    Download het bijbehorende document
                  </p>
                </div>
                <a
                  href={article.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
