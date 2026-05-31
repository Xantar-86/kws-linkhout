import { Metadata } from "next";
import Link from "next/link";
import { Mail, Calendar, ArrowRight, FileText } from "lucide-react";
import { getAllNieuwsbrieven } from "@/lib/nieuwsbrieven";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Nieuwsbrief - KWS Linkhout",
  description:
    "Lees onze laatste nieuwsbrieven en schrijf je in om op de hoogte te blijven van alles wat er gebeurt bij KWS Linkhout.",
};

function formatDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsletterPage() {
  const nieuwsbrieven = await getAllNieuwsbrieven();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-20">
        <div className="container-custom text-center text-white">
          <Mail className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nieuwsbrief</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Lees onze laatste nieuwsbrieven en blijf op de hoogte van alles wat er gebeurt bij
            KWS Linkhout.
          </p>
        </div>
      </section>

      {/* Lijst met nieuwsbrieven */}
      <section className="section-padding pb-0">
        <div className="container-custom max-w-4xl">
          <div className="flex items-center gap-2 mb-8">
            <FileText className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Eerdere nieuwsbrieven
            </h2>
          </div>

          {nieuwsbrieven.length > 0 ? (
            <div className="space-y-4">
              {nieuwsbrieven.map((n) => (
                <Link
                  key={n.slug}
                  href={`/nieuwsbrief/${n.slug}`}
                  className="group block bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  {n.date && (
                    <div className="inline-flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(n.date)}
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {n.title}
                  </h3>
                  {n.preview && (
                    <p className="text-gray-600 line-clamp-3 mb-4 whitespace-pre-line">
                      {n.preview}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-1 text-primary font-medium">
                    Lees de volledige nieuwsbrief
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-600">Nog geen nieuwsbrieven beschikbaar.</p>
            </div>
          )}
        </div>
      </section>

      {/* Inschrijven */}
      <section className="section-padding">
        <NewsletterForm />
      </section>
    </div>
  );
}
