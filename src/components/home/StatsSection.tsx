"use client";

import { motion } from "framer-motion";
import { SectieKop } from "@/components/SectieKop";
import { AnimatedNumber } from "./AnimatedNumber";
import { kijk, varianten } from "@/lib/beweging";

/**
 * De club in vier cijfers, op een donkere band.
 *
 * Dit is het scharnierpunt van de pagina. Tot hier is alles licht geweest;
 * hier valt het donker, en daarna wordt het weer licht. Zo'n omslag halverwege
 * doet twee dingen tegelijk: het geeft de bezoeker een rustpunt, en het deelt
 * de pagina in een eerste en een tweede helft. Een startpagina die van boven
 * tot onder wit blijft, leest als een lange lijst, hoe goed de secties ook
 * zijn.
 *
 * De cijfers staan bewust groot en zonder kader. Ze hebben geen kaart nodig:
 * op een donkere achtergrond is het cijfer zelf de vorm.
 */

const CIJFERS = [
  {
    waarde: 1938,
    // Een jaartal telt niet vanaf nul. Zie AnimatedNumber.
    vanaf: 1900,
    achtervoegsel: "",
    label: "Opgericht",
    onder: "Stamnummer 03531",
  },
  {
    waarde: 300,
    vanaf: 0,
    achtervoegsel: "+",
    label: "Actieve leden",
    onder: "Spelers, trainers en vrijwilligers",
  },
  {
    waarde: 25,
    vanaf: 0,
    achtervoegsel: "",
    label: "Ploegen",
    onder: "Van de U6 tot de veteranen",
  },
  {
    waarde: 6,
    vanaf: 0,
    achtervoegsel: "",
    label: "Dames- en meisjesploegen",
    onder: "En dat worden er meer",
  },
];

export function StatsSection() {
  return (
    <section className="korrel lichtrand section-padding relative overflow-hidden bg-inkt-950">
      {/* Een warme gloed onderin, zodat het zwart niet als een gat in de
          pagina leest maar als een verlichte ruimte. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_100%,rgba(220,38,38,0.22),transparent_65%)]"
      />

      <div className="container-custom relative">
        <SectieKop
          donker
          opschrift="In cijfers"
          titel="Bijna negentig jaar Linkhout"
          accent="negentig"
          onder="Een dorpsclub die groot genoeg werd om iedereen een ploeg te geven, en klein genoeg bleef om iedereen te kennen."
        />

        <motion.dl
          initial="verborgen"
          whileInView="zichtbaar"
          viewport={kijk}
          variants={varianten.groep(0.15, 0.1)}
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4"
        >
          {CIJFERS.map((cijfer) => (
            <motion.div
              key={cijfer.label}
              variants={varianten.lid}
              className="border-l border-white/10 pl-5"
            >
              <dd className="font-display text-5xl font-extrabold leading-none tracking-tight text-white md:text-6xl">
                <AnimatedNumber
                  value={cijfer.waarde}
                  vanaf={cijfer.vanaf}
                  suffix={cijfer.achtervoegsel}
                />
              </dd>
              <dt className="mt-4 text-sm font-semibold text-white/90">
                {cijfer.label}
              </dt>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                {cijfer.onder}
              </p>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
