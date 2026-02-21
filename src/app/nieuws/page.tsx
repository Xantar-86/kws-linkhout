import { Metadata } from "next";
import { Newspaper, Mail, ExternalLink, FileText, Download, CreditCard, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/news";
import { pressArticles } from "@/lib/press";
import { PressCard } from "@/components/news/PressCard";

export const metadata: Metadata = {
  title: "Nieuws & Updates - KWS Linkhout",
  description: "Blijf op de hoogte van alles wat er gebeurt bij KWS Linkhout. Laatste nieuws, evenementen en updates.",
};

export default async function NewsPage() {
  // Server-side: Haal CMS + vast artikel op
  const allArticles = await getAllArticles();
  
  // Sorteer op datum (nieuwste eerst)
  const sortedArticles = allArticles.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Featured artikel = het vast artikel of het eerste artikel
  const featuredArticle = sortedArticles.find(a => a.featured) || sortedArticles[0];
  
  // Alle andere artikelen (inclusief CMS artikelen)
  const otherArticles = sortedArticles.filter(a => a.slug !== featuredArticle?.slug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20">
        <div className="container-custom text-center text-white">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
          >
            <Newspaper className="w-4 h-4" />
            Laatste updates
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nieuws & Updates
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Blijf op de hoogte van alles wat er gebeurt bij KWS Linkhout.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Featured Article */}
          {featuredArticle && (
            <div className="mb-12">
              <Link 
                href={`/nieuws/artikel?slug=${featuredArticle.slug}`}
                className="group block bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-[400px] overflow-hidden">
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                        {featuredArticle.featured ? "Uitgelicht" : "Nieuwste"}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
                        {featuredArticle.category}
                      </span>
                      <span>{featuredArticle.date}</span>
                      <span>{featuredArticle.readTime} min</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Door: {featuredArticle.author}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-primary font-semibold">
                      Lees het volledige artikel →
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid met ALLE andere artikelen (CMS + andere) */}
          {otherArticles.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Meer nieuws
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/nieuws/artikel?slug=${article.slug}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer block"
                  >
                    {/* Afbeelding */}
                    {article.image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-sm text-primary font-medium capitalize">
                        {article.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.date}</span>
                        <span>{article.readTime} min</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {allArticles.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm mb-16">
              <p className="text-gray-600 text-lg mb-4">
                Nog geen nieuwsberichten beschikbaar.
              </p>
              <p className="text-gray-500">
                Kom later terug voor updates!
              </p>
            </div>
          )}

          {/* Quick Links - Digitaal Betalen & Documenten Mutualiteit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/digitaal-betalen">
              <div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-7 h-7 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Digitaal Betalen
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Betaal voortaan ook digitaal @ KWS Linkhout
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>

            <Link href="/documenten-mutualiteit">
              <div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Documenten Mutualiteit
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Download hier je formulier voor de mutualiteiten
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          </div>

          {/* Volledige Nieuwsbrief PDF */}
          <div
            className="mb-16 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Volledige nieuwsbrief bekijken
                </h3>
                <p className="text-gray-600">
                  Download de volledige nieuwsbrief als PDF met alle informatie over het einde van het seizoen 
                  en de voorbereidingen op het nieuwe seizoen.
                </p>
              </div>
              <a
                href="/Docs/nieuws/nieuwsbrief.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </a>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div
            className="bg-gradient-to-r from-primary to-primary-700 rounded-3xl p-8 md:p-12 text-white text-center mb-16"
          >
            <Mail className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Blijf op de hoogte
            </h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Schrijf je in voor onze nieuwsbrief en ontvang wekelijks het laatste nieuws, 
              ploegupdates en informatie over evenementen.
            </p>
            <Link
              href="/nieuwsbrief"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Inschrijven
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* In de Krant Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              KWS Linkhout in de media
            </h2>
            <p className="text-gray-600">
              Onze club in het nieuws
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pressArticles.slice(0, 4).map((article, index) => (
              <PressCard key={article.id} article={article} index={index} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/in-de-krant"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Bekijk alle krantenartikelen
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
