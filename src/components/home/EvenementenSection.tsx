"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { SectieKop } from "@/components/SectieKop";
import { Onthul } from "@/components/beweging/Onthul";
import { kijk, varianten } from "@/lib/beweging";
import type { Event } from "@/lib/events";

/**
 * De eerstvolgende evenementen op de clubkalender.
 *
 * Dit heette vroeger NieuwsSection en deed twee dingen tegelijk: bovenaan een
 * paar snelkoppelingen naar formulieren, daaronder de evenementen. Twee koppen
 * in één sectie, en de bezoeker die naar het eetfestijn zocht, kreeg eerst de
 * mutualiteitspapieren. Die snelkoppelingen staan nu waar ze horen, bij de
 * andere snelkoppelingen in QuickLinksSection, en deze sectie gaat nog over
 * één ding.
 *
 * Elke kaart draagt de kleur die in het beheer aan het evenement is gegeven.
 * Die kleur zit in een band bovenaan en niet over de hele kaart: zo blijft de
 * rij rustig, ook als er een felgeel en een felpaars evenement naast elkaar
 * staan.
 */
export function EvenementenSection({ events }: { events: Event[] }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectieKop
          opschrift="Op de kalender"
          titel="Aankomende evenementen"
          accent="evenementen"
          onder="Eetfestijnen, tornooien en clubfeesten. Noteer ze alvast in je agenda."
        />

        {/* Staat er niets gepland, dan zeggen we dat gewoon. Een lege rij
            kaarten laat de bezoeker denken dat er iets stuk is. */}
        {events.length === 0 ? (
          <Onthul className="mt-14">
            <div className="kaart mx-auto max-w-lg px-8 py-12 text-center">
              <CalendarDays
                className="mx-auto h-9 w-9 text-zand-300"
                aria-hidden="true"
              />
              <p className="mt-5 text-gray-500">
                Er staan op dit moment geen evenementen gepland. Hou de kalender
                in het oog, er komt zeker weer iets aan.
              </p>
            </div>
          </Onthul>
        ) : (
          <motion.ul
            initial="verborgen"
            whileInView="zichtbaar"
            viewport={kijk}
            variants={varianten.groep(0.1)}
            className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {events.map((event) => (
              <motion.li key={event.id} variants={varianten.lid} className="h-full">
                <Link
                  href="/nieuws/events"
                  className="group block h-full focus:outline-none"
                >
                  <article className="kaart kaart-tilt flex h-full flex-col overflow-hidden">
                    <div className={`bg-linear-to-r ${event.color} px-5 py-3.5`}>
                      <div className="flex items-center justify-between gap-3">
                        <CalendarDays
                          className="h-4 w-4 text-white/70"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-semibold text-white">
                          {event.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-primary">
                        {event.title}
                      </h3>
                      <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                        {event.description}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
                        Meer weten
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}

        <Onthul vertraging={0.1} className="mt-12 text-center">
          <Link href="/nieuws/events" className="btn-secondary group">
            Bekijk alle evenementen
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Onthul>
      </div>
    </section>
  );
}
