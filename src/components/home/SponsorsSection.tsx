"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectieKop } from "@/components/SectieKop";
import { Onthul } from "@/components/beweging/Onthul";
import { kijk, varianten } from "@/lib/beweging";

/**
 * De sponsors.
 *
 * Het probleem van elk sponsorraster: acht logo's in acht huisstijlen, acht
 * verschillende kleuren en acht verschillende vormen, en samen zien ze eruit
 * als een rommelmarkt. De oplossing hier is dezelfde die tijdschriften
 * gebruiken: alles naar grijs, en pas kleur bij het aanwijzen. Zo leest de rij
 * als één blok, en krijgt elke sponsor toch zijn moment.
 *
 * Op een aanraakscherm bestaat dat aanwijzen niet, en daar zou grijs betekenen
 * dat de sponsors nooit hun kleur krijgen. Vandaar dat het ontkleuren pas
 * vanaf de middelgrote schermen ingaat: op een telefoon staan ze gewoon in
 * kleur.
 *
 * De rij komt trapsgewijs op, maar met korte tussenpozen. Bij acht logo's van
 * elk een tiende seconde zit je aan bijna een seconde voor het laatste logo
 * er staat, en dan wacht de bezoeker op een raster.
 */

const SPONSORS = [
  { naam: "Roof Projects", beeld: "/images/sponsors/ROOF-PROJECTS-LOGO-RGB.jpg" },
  { naam: "Salesforce", beeld: "/images/sponsors/Salesforce.png" },
  { naam: "De Backer", beeld: "/images/sponsors/de-backer.jpeg" },
  { naam: "Lumen", beeld: "/images/sponsors/lumen.png" },
  { naam: "PD Bouw", beeld: "/images/sponsors/pd-bouw.png" },
  { naam: "AA Drink", beeld: "/images/sponsors/aa-drink.png" },
  { naam: "Spar", beeld: "/images/sponsors/spar.jpg" },
  { naam: "Mathys", beeld: "/images/sponsors/Mathys.png" },
];

export function SponsorsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectieKop
          opschrift="Zij maken het mogelijk"
          titel="Onze sponsors"
          accent="sponsors"
          onder="KWS Linkhout dankt zijn werking aan de steun van deze ondernemers. Samen maken we het verschil."
        />

        <motion.ul
          initial="verborgen"
          whileInView="zichtbaar"
          viewport={kijk}
          variants={varianten.groep(0.1, 0.05)}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {SPONSORS.map((sponsor) => (
            <motion.li key={sponsor.naam} variants={varianten.lid}>
              <div className="group flex h-32 items-center justify-center rounded-2xl border border-zand-200/70 bg-zand-50 p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-zand-300 hover:bg-white hover:shadow-blad">
                {/* Bewust een gewone img en geen next/image: het gaat om
                    logo's van uiteenlopende afmetingen die alleen maar in
                    hun kader moeten passen, en de winst van optimaliseren
                    weegt hier niet op tegen het risico dat een breed logo
                    verkeerd bijgesneden wordt. */}
                <img
                  src={sponsor.beeld}
                  alt={sponsor.naam}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain transition-all duration-500 md:opacity-60 md:grayscale md:group-hover:opacity-100 md:group-hover:grayscale-0"
                />
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <Onthul vertraging={0.1} className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Ook sponsor worden? We komen graag eens praten.
          </p>
          <Link
            href="/contact"
            className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Neem contact op
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Onthul>
      </div>
    </section>
  );
}
