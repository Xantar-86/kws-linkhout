import { Metadata } from "next";
import { Calendar, MapPin, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Evenementen - KWS Linkhout",
  description: "Alle evenementen en activiteiten bij KWS Linkhout. Noteer deze data in je agenda!",
};

export default async function EventsPage() {
  // Server-side: Haal alle events op (uit CMS)
  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link href="/nieuws" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Terug naar nieuws
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="container-custom text-center text-white">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
          >
            <Calendar className="w-4 h-4" />
            Save the Date
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Evenementen 2025-2026
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Noteer deze data alvast in je agenda! Een overzicht van alle activiteiten bij KWS Linkhout.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding">
        <div className="container-custom max-w-6xl">
          {/* Download PDF CTA */}
          <div
            className="mb-12 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Evenementenkalender downloaden
                </h3>
                <p className="text-gray-600">
                  Download de volledige evenementenkalender als PDF.
                </p>
              </div>
              <a
                href="/Docs/events/kws-events.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </a>
            </div>
          </div>

          {/* Events */}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Afbeelding of Kleur Header */}
                  {event.image ? (
                    <div className="relative h-40 w-full">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Calendar className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    </div>
                  ) : (
                    <div className={`bg-gradient-to-r ${event.color} p-4`}>
                      <div className="flex items-center justify-end">
                        <Calendar className="w-5 h-5 text-white/80" />
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Datum badge */}
                      <div className="flex-shrink-0 w-20 text-center">
                        <div className="bg-gray-100 rounded-xl p-3">
                          <span className="block text-lg font-bold text-primary leading-tight">
                            {event.date.split(" ")[0]}
                          </span>
                          <span className="block text-xs text-gray-600 uppercase mt-1">
                            {event.date.split(" ").slice(1).join(" ")}
                          </span>
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location || "KWS Linkhout"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-600 text-lg">
                Nog geen evenementen gepland. Kom later terug!
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <div
            className="mt-12 bg-gradient-to-r from-primary to-primary-700 rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              Vragen over een evenement?
            </h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Neem contact met ons op voor meer informatie over onze evenementen.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Contacteer ons
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
