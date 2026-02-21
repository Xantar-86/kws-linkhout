import { Metadata } from "next";
import { Newspaper, Calendar, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllPressArticles, PressArticle } from "@/lib/press";

export const metadata: Metadata = {
  title: "In de Krant - KWS Linkhout",
  description: "KWS Linkhout in de media. Bekijk hier alle krantenartikelen over onze club.",
};

// Group articles by year
function groupByYear(articles: PressArticle[]) {
  const grouped: { [key: string]: PressArticle[] } = {};
  articles.forEach(article => {
    const year = new Date(article.date).getFullYear().toString();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(article);
  });
  return grouped;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export default async function PressPage() {
  // Server-side: Haal alle press artikelen op
  const pressArticles = await getAllPressArticles();
  const groupedArticles = groupByYear(pressArticles);
  const sortedYears = Object.keys(groupedArticles).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20">
        <div className="container-custom text-center text-white">
          <div>
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
          </div>
        </div>
      </section>

      {/* Press Articles */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Year filter/info */}
          {sortedYears.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="text-gray-600">Archief vanaf:</span>
              <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {sortedYears[sortedYears.length - 1]}
              </span>
              <span className="text-gray-400">tot</span>
              <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {sortedYears[0]}
              </span>
            </div>
          )}

          {/* Articles by Year */}
          {sortedYears.map(year => (
            <div key={year} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center text-lg">
                  {year}
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedArticles[year].map((article) => (
                  <article
                    key={article.id}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                      {/* Logo/Krant Preview Area */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0" style={{
                            backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
                            backgroundSize: '10px 10px'
                          }} />
                        </div>
                        
                        {/* Krant Logo */}
                        <div className="relative w-32 h-32">
                          <Image
                            src={article.sourceLogo}
                            alt={article.source}
                            fill
                            className="object-contain rounded-lg shadow-md bg-white p-2 transform group-hover:scale-105 transition-transform duration-300"
                          />
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
                            href={article.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open PDF
                          </a>
                          <a
                            href={article.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {pressArticles.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-600 text-lg">
                Nog geen krantenartikelen beschikbaar.
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-lg text-center">
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
          </div>
        </div>
      </section>
    </div>
  );
}
