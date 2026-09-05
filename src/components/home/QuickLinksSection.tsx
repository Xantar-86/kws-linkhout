"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Clock,
  CreditCard,
  Shield,
} from "lucide-react";
import { SectieKop } from "@/components/SectieKop";
import { kijk, varianten } from "@/lib/beweging";

/**
 * De vijf dingen waarvoor mensen deze site openen.
 *
 * Er stonden er hier drie, en de twee andere zaten verstopt boven de
 * evenementen in de oude NieuwsSection. Dat was voor de bezoeker niet te
 * volgen: waarom staat het formulier voor de mutualiteit bij het nieuws en
 * het formulier voor een ongeval bij de snelkoppelingen? Nu staan ze samen.
 *
 * De volgorde is die van dringendheid, niet van belangrijkheid. Wie hier komt
 * voor een voetbalongeval, heeft haast; wie de foto's zoekt, niet.
 *
 * De hele tegel is klikbaar, niet alleen de titel. Dat is op een telefoon het
 * verschil tussen mikken en tikken.
 */

const SNELKOPPELINGEN = [
  {
    titel: "Trainingsschema",
    beschrijving: "Alle trainingsuren van dit seizoen",
    href: "/jeugdopleiding/trainingsschema-25-26",
    icoon: Clock,
  },
  {
    titel: "Voetbalongeval",
    beschrijving: "Meld een ongeval of blessure",
    href: "/medisch/voetbalongeval",
    icoon: AlertTriangle,
    dringend: true,
  },
  {
    titel: "Documenten mutualiteit",
    beschrijving: "Download je formulier",
    href: "/documenten-mutualiteit",
    icoon: Shield,
  },
  {
    titel: "Digitaal betalen",
    beschrijving: "Betaal voortaan ook digitaal",
    href: "/digitaal-betalen",
    icoon: CreditCard,
  },
  {
    titel: "Foto's",
    beschrijving: "Bekijk de fotogalerij",
    href: "/fotos",
    icoon: Camera,
  },
];

export function QuickLinksSection() {
  return (
    <section className="section-padding bg-zand-50">
      <div className="container-custom">
        <SectieKop
          opschrift="Snel geregeld"
          titel="Waarvoor kom je langs?"
          accent="langs?"
          onder="De vijf dingen die het vaakst gezocht worden, in één klik."
        />

        <motion.ul
          initial="verborgen"
          whileInView="zichtbaar"
          viewport={kijk}
          variants={varianten.groep(0.1, 0.07)}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SNELKOPPELINGEN.map((snelkoppeling) => (
            <motion.li
              key={snelkoppeling.href}
              variants={varianten.lid}
              className="h-full"
            >
              <Link
                href={snelkoppeling.href}
                className="group block h-full focus:outline-none"
              >
                <div className="kaart kaart-tilt flex h-full items-start gap-4 p-6">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                      snelkoppeling.dringend
                        ? "bg-primary/10 text-primary"
                        : "bg-zand-100 text-gray-700 group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    <snelkoppeling.icoon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 transition-colors duration-200 group-hover:text-primary">
                      {snelkoppeling.titel}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                      {snelkoppeling.beschrijving}
                    </p>
                  </div>

                  {/* De pijl staat er altijd, maar bijna onzichtbaar. Bij het
                      aanwijzen komt hij op en schuift hij mee. Zou hij pas bij
                      hover verschijnen, dan verspringt de indeling. */}
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                  />
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
