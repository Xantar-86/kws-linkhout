"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { veer } from "@/lib/beweging";

/**
 * Een element dat licht naar de muis toe leunt.
 *
 * Dit is het detail dat een knop levend laat aanvoelen: hij wacht niet tot je
 * hem raakt, hij komt je een paar pixels tegemoet. Vier tot acht pixels is de
 * hele beweging. Meer en de knop loopt weg van waar de bezoeker klikt, en dan
 * werkt het effect tegen de knop in.
 *
 * Waarom dit alleen op een echte muis speelt: op een aanraakscherm bestaat er
 * geen zweven. De browser stuurt daar wel muisgebeurtenissen, maar pas bij het
 * tikken, en dan verspringt de knop onder de vinger op het moment van de klik.
 * Vandaar de controle op `(pointer: fine)`.
 *
 * De verplaatsing zit op een `div` eromheen en niet op de knop zelf, zodat het
 * klikvlak blijft waar het hoort en de knop zijn eigen zweefstijl houdt.
 */

interface MagnetischProps {
  children: ReactNode;
  /** Hoe ver het element maximaal meekomt, in pixels. */
  kracht?: number;
  className?: string;
}

export function Magnetisch({ children, kracht = 6, className }: MagnetischProps) {
  const anker = useRef<HTMLDivElement>(null);
  const minderBeweging = useReducedMotion();

  const ruweX = useMotionValue(0);
  const ruweY = useMotionValue(0);
  const x = useSpring(ruweX, veer.magneet);
  const y = useSpring(ruweY, veer.magneet);

  const fijneAanwijzer = () =>
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  function volg(e: React.MouseEvent<HTMLDivElement>) {
    if (minderBeweging || !fijneAanwijzer() || !anker.current) return;

    const vak = anker.current.getBoundingClientRect();
    // Waar de muis staat ten opzichte van het midden, uitgedrukt van -1 tot 1.
    const naarRechts = (e.clientX - vak.left) / vak.width - 0.5;
    const naarOnder = (e.clientY - vak.top) / vak.height - 0.5;

    ruweX.set(naarRechts * kracht * 2);
    ruweY.set(naarOnder * kracht * 2);
  }

  function los() {
    ruweX.set(0);
    ruweY.set(0);
  }

  return (
    <motion.div
      ref={anker}
      onMouseMove={volg}
      onMouseLeave={los}
      // Ook loslaten bij het wegvallen van de focus: wie met de tab-toets
      // langskomt en weer weggaat, mag geen scheve knop achterlaten.
      onBlur={los}
      style={minderBeweging ? undefined : { x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
