"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Images, Newspaper } from "lucide-react";
import type { Bericht } from "@/lib/berichten";

function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BerichtenSection({ berichten }: { berichten: Bericht[] }) {
  if (berichten.length === 0) return null;

  return (
    <section id="berichten" className="py-16 bg-white scroll-mt-24">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Newspaper className="w-4 h-4" />
            Van de club
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Recente <span className="text-primary">berichten</span>
          </h2>
        </motion.div>

        <div
          className={
            berichten.length === 1
              ? "flex justify-center"
              : "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          }
        >
          {berichten.map((bericht, index) => (
            <Link
              key={bericht.slug}
              href={`/berichten/${bericht.slug}`}
              className="group w-full max-w-xl"
            >
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
              >
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {bericht.title}
                  </h3>
                  {bericht.intro && (
                    <p className="text-gray-600 text-sm line-clamp-3 whitespace-pre-line">
                      {bericht.intro}
                    </p>
                  )}
                  <div className="mt-4 inline-flex items-center gap-1 text-primary font-medium text-sm">
                    Lees meer
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
