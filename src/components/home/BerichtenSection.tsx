"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Images } from "lucide-react";
import { SectieKop } from "@/components/SectieKop";
import { Onthul } from "@/components/beweging/Onthul";
import { kijk, varianten } from "@/lib/beweging";
import type { Bericht } from "@/lib/berichten";

function toonDatum(datum: string): string {
  if (!datum) return "";
  return new Date(datum).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * De laatste berichten van de club.
 *
 * Het beeld zoomt bij het aanwijzen traag in, en het duurt zeven tienden van
 * een seconde. Dat is lang voor een hover, en dat is de bedoeling: een beeld
 * dat in twee tienden inzoomt, schokt. Een beeld dat er zeven over doet,
 * ademt. De kaart zelf komt tegelijk een pixel of vier omhoog, zodat de
 * schaduw meegroeit en het geheel als één ding reageert in plaats van als een
 * foto in een doos.
 *
 * Het aantal foto's staat als een klein merkteken in de hoek van het beeld.
 * Dat is de enige aanwijzing dat er achter dit bericht een hele reeks zit, en
 * daarmee de reden om te klikken.
 */
export function BerichtenSection({ berichten }: { berichten: Bericht[] }) {
  if (berichten.length === 0) return null;

  const alleen = berichten.length === 1;

  return (
    <section id="berichten" className="section-padding scroll-mt-24 bg-zand-50">
      <div className="container-custom">
        <SectieKop
          opschrift="Van de club"
          titel="Recente berichten"
          accent="berichten"
          onder="Verslagen, verhalen en beelden van wat er op en naast het veld gebeurt."
        />

        <motion.div
          initial="verborgen"
          whileInView="zichtbaar"
          viewport={kijk}
          variants={varianten.groep(0.1)}
          className={
            alleen
              ? "mt-14 flex justify-center"
              : "mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2"
          }
        >
          {berichten.map((bericht) => (
            <motion.article
              key={bericht.slug}
              variants={varianten.lid}
              className="w-full max-w-xl"
            >
              <Link
                href={`/berichten/${bericht.slug}`}
                className="group block h-full focus:outline-none"
              >
                <div className="kaart kaart-tilt flex h-full flex-col overflow-hidden">
                  {bericht.cover && (
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={bericht.cover}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      />
                      {/* Een verloop onderaan het beeld: het scheidt de foto
                          van de witte tekst eronder, ook als de foto daar
                          toevallig licht is. */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/25 to-transparent"
                      />
                      {bericht.fotos.length > 0 && (
                        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          <Images className="h-3.5 w-3.5" aria-hidden="true" />
                          {bericht.fotos.length}
                          <span className="sr-only">foto&apos;s</span>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    {bericht.date && (
                      <p className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        {toonDatum(bericht.date)}
                      </p>
                    )}
                    <h3 className="mt-2.5 text-xl font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-primary">
                      {bericht.title}
                    </h3>
                    {bericht.intro && (
                      <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                        {bericht.intro}
                      </p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
                      Lees meer
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        <Onthul vertraging={0.1} className="mt-12 text-center">
          <Link
            href="/berichten"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-primary"
          >
            Alle berichten
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Onthul>
      </div>
    </section>
  );
}
