"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { curve, duur, kijk, verzet } from "@/lib/beweging";

/**
 * Onthul: het werkpaard van de site.
 *
 * Zet dit rond alles wat bij het scrollen in beeld hoort te komen. Het speelt
 * eenmalig, het komt van onderen en het landt zacht. Wie een sectie voor de
 * tweede keer passeert, ziet niets meer bewegen.
 *
 *     <Onthul>
 *       <h2 className="heading-2">Onze ploegen</h2>
 *     </Onthul>
 *
 * De vervaging staat standaard uit. Ze staat er wel in, want een kop die uit
 * de onscherpte komt is precies het soort detail waar een dure site aan te
 * herkennen valt, maar `filter: blur()` laat de browser elk beeldje opnieuw
 * tekenen. Op een kop of een enkel beeld kan dat; over een heel raster van
 * kaarten kost het te veel.
 */

/** De elementen die Onthul kan zijn. Bewust een korte lijst: wie hier iets
 *  mist, mist waarschijnlijk eerder de juiste semantiek. */
const elementen = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  aside: motion.aside,
  li: motion.li,
  p: motion.p,
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

type Richting = "op" | "neer" | "links" | "rechts" | "geen";

interface OnthulProps {
  children: ReactNode;
  /** Waarvandaan het element komt aangeschoven. */
  richting?: Richting;
  /** Hoeveel pixels het aflegt. Standaard 28; boven de zestig wordt het een truc. */
  afstand?: number;
  /** Wachttijd in seconden voor het begint. */
  vertraging?: number;
  /** Duur in seconden. Groter element, tragere onthulling. */
  duurtijd?: number;
  /** Laat het element uit de onscherpte komen. Spaarzaam gebruiken. */
  vervaag?: boolean;
  als?: keyof typeof elementen;
  className?: string;
  /** Speel bij het laden in plaats van bij het scrollen. Voor wat al in beeld staat. */
  meteen?: boolean;
}

export function Onthul({
  children,
  richting = "op",
  afstand = verzet.basis,
  vertraging = 0,
  duurtijd = duur.basis,
  vervaag = false,
  als = "div",
  className,
  meteen = false,
}: OnthulProps) {
  const minderBeweging = useReducedMotion();
  const Element = elementen[als];

  // Waar het element vandaan komt. Bij minder beweging blijft alles op zijn
  // plaats en verschijnt het alleen; MotionConfig vangt de verplaatsing zelf
  // af, maar de vervaging niet, dus die zetten we hier uit.
  const verplaatsing = {
    op: { y: afstand },
    neer: { y: -afstand },
    links: { x: afstand },
    rechts: { x: -afstand },
    geen: {},
  }[richting];

  const verborgen = {
    opacity: 0,
    ...verplaatsing,
    ...(vervaag && !minderBeweging ? { filter: "blur(8px)" } : {}),
  };

  const zichtbaar = {
    opacity: 1,
    x: 0,
    y: 0,
    ...(vervaag && !minderBeweging ? { filter: "blur(0px)" } : {}),
  };

  const beweging = {
    duration: duurtijd,
    delay: vertraging,
    ease: curve.onthul,
  };

  // Bij `meteen` hangt het niet aan de scrollpositie: het speelt zodra het
  // component er is. Dat is wat je wil voor de hero, die bij het laden al in
  // beeld staat en dus nooit "in beeld zou komen".
  if (meteen) {
    return (
      <Element
        initial={verborgen}
        animate={zichtbaar}
        transition={beweging}
        className={className}
      >
        {children}
      </Element>
    );
  }

  return (
    <Element
      initial={verborgen}
      whileInView={zichtbaar}
      viewport={kijk}
      transition={beweging}
      className={className}
    >
      {children}
    </Element>
  );
}
