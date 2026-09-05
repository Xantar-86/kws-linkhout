"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectieKop } from "@/components/SectieKop";
import { Onthul } from "@/components/beweging/Onthul";
import { VolgendeWedstrijd } from "./VolgendeWedstrijd";
import { kijk, varianten } from "@/lib/beweging";

/**
 * De eerstvolgende wedstrijden van de drie eerste ploegen, naast elkaar.
 *
 * Waarom deze sectie meteen na de hero komt: dit is waarvoor de meeste mensen
 * de site openen. Wanneer spelen ze, en waar. Alles wat de club over zichzelf
 * te vertellen heeft, kan daarna komen; wie hier vindt wat hij zocht, is
 * geholpen in vijf seconden, en dat is de beste reclame die een clubsite kan
 * maken.
 *
 * De drie kaarten komen kort na elkaar op in plaats van tegelijk. Dat leest
 * van links naar rechts, dezelfde kant op als de tekst, en het maakt van drie
 * losse blokken één beweging.
 */

const PLOEGEN = [
  {
    apiUrl: "/api/wedstrijden",
    kalenderUrl: "https://www.rbfa.be/nl/club/1595/ploeg/365216/kalender",
    titel: "Heren P2",
    kleur: "primary" as const,
  },
  {
    apiUrl: "/api/wedstrijden/p4",
    kalenderUrl: "https://www.rbfa.be/nl/club/1595/ploeg/365215/kalender",
    titel: "Heren P4",
    kleur: "primary" as const,
  },
  {
    apiUrl: "/api/wedstrijden/dames",
    kalenderUrl: "https://www.rbfa.be/nl/club/1595/ploeg/365217/kalender",
    titel: "Dames",
    kleur: "pink" as const,
  },
];

export function WedstrijdenSection() {
  return (
    <section className="section-padding relative bg-zand-50">
      <div className="container-custom">
        <SectieKop
          opschrift="Deze week"
          titel="De volgende wedstrijden"
          accent="wedstrijden"
          onder="Aftrap, tegenstander en terrein voor onze drie eerste ploegen, rechtstreeks uit de kalender van de KBVB."
        />

        <motion.div
          initial="verborgen"
          whileInView="zichtbaar"
          viewport={kijk}
          variants={varianten.groep(0.1)}
          className="mt-14 grid gap-5 md:grid-cols-3"
        >
          {PLOEGEN.map((ploeg) => (
            <VolgendeWedstrijd key={ploeg.apiUrl} {...ploeg} />
          ))}
        </motion.div>

        <Onthul vertraging={0.1} className="mt-10 text-center">
          <Link
            href="/ploegen"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition-colors hover:text-primary"
          >
            Alle ploegen en hun kalender
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Onthul>
      </div>
    </section>
  );
}
