"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Een haarlijn boven aan het scherm die volloopt met de pagina.
 *
 * Klein detail, maar het beantwoordt de vraag die elke lange pagina oproept:
 * hoeveel komt er nog. Twee pixels, in clubrood, boven op de navigatiebalk.
 *
 * De schaal loopt vanaf links, want de balk begint leeg. `transform-origin`
 * op links en niet op het midden, anders groeit hij vanuit het midden naar
 * twee kanten en dat leest niet als voortgang.
 *
 * De veer eronder is er niet voor de schoonheid: `scrollYProgress` verspringt
 * bij elke muiswielklik in stappen, en zonder demping ziet de balk eruit alsof
 * hij hapert.
 */
export function Voortgang() {
  const { scrollYProgress } = useScroll();

  const breedte = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    // Rest bij een duizendste: zonder deze grens blijft de veer eindeloos
    // narekenen op waarden die niemand nog ziet.
    restDelta: 0.001,
  });

  // Onzichtbaar zolang er nauwelijks gescrold is. Een balk die al bij de
  // eerste pixel oplicht, trekt de aandacht weg van de hero.
  const dekking = useTransform(scrollYProgress, [0, 0.02, 0.04], [0, 0, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-primary"
      style={{ scaleX: breedte, opacity: dekking }}
    />
  );
}
