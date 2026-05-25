import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Images, Newspaper } from "lucide-react";
import { getAllBerichten } from "@/lib/berichten";

export const metadata: Metadata = {
  title: "Berichten - KWS Linkhout",
  description: "Alle nieuwsberichten en sfeerverslagen van KWS Linkhout.",
};

function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BerichtenPage() {
  const berichten = await getAllBerichten();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 md:py-20">
        <div className="container-custom text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
            <Newspaper className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Berichten</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Sfeerverslagen en nieuws van achter de schermen bij KWS Linkhout.
          </p>
        </div>
      </section>

      {/* Lijst */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          {berichten.length > 0 ? (
            <div
              className={
                berichten.length === 1
                  ? "flex justify-center"
                  : "grid grid-cols-1 md:grid-cols-2 gap-8"
              }
            >
              {berichten.map((bericht) => (
                <Link
                  key={bericht.slug}
                  href={`/berichten/${bericht.slug}`}
                  className="group w-full max-w-xl"
                >
                  <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    {bericht.cover && (
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image
                          src={bericht.cover}
                          alt={bericht.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {bericht.fotos.length > 0 && (
                          <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 bg-black/50 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                            <Images className="w-3.5 h-3.5" />
                            {bericht.fotos.length}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {bericht.date && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(bericht.date)}
                        </div>
                      )}
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {bericht.title}
                      </h2>
                      {bericht.intro && (
                        <p className="text-gray-600 text-sm line-clamp-3 whitespace-pre-line">
                          {bericht.intro}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-600 text-lg">Nog geen berichten beschikbaar.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
