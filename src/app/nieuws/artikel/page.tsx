"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User, Share2, FileText, X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import type { NewsArticle } from "@/lib/news";
import { newsArticles } from "@/lib/news";
import React from "react";
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

function ArticleContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      if (!slug) {
        setLoading(false);
        return;
      }

      // Eerst zoeken in hardcoded artikelen
      const hardcoded = newsArticles.find(a => a.slug === slug);
      if (hardcoded) {
        setArticle(hardcoded);
        setLoading(false);
        return;
      }

      // Anders zoeken in CMS artikelen via API
      try {
        const response = await fetch('/api/cms-articles');
        if (response.ok) {
          const cmsArticles: NewsArticle[] = await response.json();
          const cmsArticle = cmsArticles.find(a => a.slug === slug);
          if (cmsArticle) {
            setArticle(cmsArticle);
          }
        }
      } catch (error) {
        console.error("Error loading CMS article:", error);
      }
      setLoading(false);
    }

    loadArticle();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-BE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-3 mb-4">
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
