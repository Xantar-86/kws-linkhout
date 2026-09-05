"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Diepte: een laag die trager meeschuift dan de pagina eromheen.
 *
 * De hele kunst zit in de maat. Parallax die je opmerkt is te sterk. Twintig
 * tot zestig pixels over een volle schermhoogte is genoeg om het oog te laten
 * geloven dat er ruimte achter het scherm zit; honderd pixels leest als een
 * beeld dat losgeslagen is van zijn kader.
 *
 * Twee dingen die dit component bewust doet:
 *
 * - De beweging loopt door een veer. Zonder demping kleeft de laag exact aan
 *   de scrollpositie en zie je elke schok van een muiswiel terug. Met veer
 *   loopt ze een fractie achter en dat is precies wat het zwaar en filmisch
 *   maakt.
 * - Wie minder beweging vraagt, krijgt geen parallax. Dit is beweging zonder
 *   informatie, dus ze mag als eerste sneuvelen.
 *
 * Let op bij het gebruik: geef het beeld binnen de laag wat overmaat
 * (`scale-110` of extra hoogte), anders schuift de onderrand in beeld.
 */

interface ParallaxProps {
  children: ReactNode;
  /**
   * Hoeveel pixels de laag afwijkt aan elk uiteinde. Positief laat de laag
   * achterblijven (het klassieke effect), negatief laat ze vooruitlopen.
   */
  kracht?: number;
  className?: string;
}

export function Parallax({ children, kracht = 40, className }: ParallaxProps) {
  const anker = useRef<HTMLDivElement>(null);
  const minderBeweging = useReducedMotion();

  // Van het moment dat de bovenkant van het element de onderkant van het
  // scherm raakt tot het onderaan weer verdwijnt: precies de periode waarin
  // de bezoeker het kan zien.
  const { scrollYProgress } = useScroll({
    target: anker,
    offset: ["start end", "end start"],
  });

  const ruw = useTransform(scrollYProgress, [0, 1], [kracht, -kracht]);
  const y = useSpring(ruw, { stiffness: 80, damping: 26, mass: 0.3 });

  return (
    <div ref={anker} className={className}>
      <motion.div style={minderBeweging ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/**
 * Dezelfde diepte, maar op de schaal in plaats van de positie.
 *
 * Voor een beeld dat langzaam inzoomt terwijl het voorbijkomt. Subtieler dan
 * verschuiven en het kan niet uit zijn kader lopen, dus geen overmaat nodig.
 */
export function ParallaxZoom({
  children,
  van = 1.12,
  naar = 1,
  className,
}: {
  children: ReactNode;
  van?: number;
  naar?: number;
  className?: string;
}) {
  const anker = useRef<HTMLDivElement>(null);
  const minderBeweging = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: anker,
    offset: ["start end", "end start"],
  });

  const ruw = useTransform(scrollYProgress, [0, 1], [van, naar]);
  const scale = useSpring(ruw, { stiffness: 80, damping: 26, mass: 0.3 });

  return (
    <div ref={anker} className={className}>
      <motion.div
        style={minderBeweging ? undefined : { scale }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
