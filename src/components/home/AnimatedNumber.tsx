"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Een getal dat oploopt zodra het in beeld komt.
 *
 * Drie dingen die hier bewust anders zijn dan in de gebruikelijke versie van
 * dit trucje:
 *
 * 1. Een schermlezer krijgt het eindgetal, niet de telling. Zonder dat leest
 *    hij bij elke tussenwaarde de hele regel opnieuw voor, en dan hoor je
 *    honderd keer "actieve leden". De tellende versie staat daarom op
 *    `aria-hidden` en er staat een onzichtbare regel naast met het antwoord.
 *
 * 2. Wie minder beweging vraagt, ziet het eindgetal meteen staan. Cijfers die
 *    tellen zijn beweging zonder informatie.
 *
 * 3. De telling kan bij een ander getal dan nul beginnen. Een jaartal dat van
 *    nul naar 1938 loopt, raast door twintig eeuwen die niets betekenen; van
 *    1900 naar 1938 leest als een teller die inloopt op het juiste jaar.
 *
 * De afremming loopt via een curve die vroeg snel is en lang uitloopt. Dat
 * geeft het gevoel dat het getal ergens naartoe werkt in plaats van dat het
 * gewoon stopt.
 */

interface AnimatedNumberProps {
  value: number;
  /** Waar de telling begint. Standaard nul. */
  vanaf?: number;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  vanaf = 0,
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const anker = useRef<HTMLSpanElement>(null);
  const inBeeld = useInView(anker, { once: true, margin: "-80px" });
  const minderBeweging = useReducedMotion();
  const [getoond, setGetoond] = useState(vanaf);

  // Wie minder beweging vraagt, krijgt het eindgetal zonder telling. Dat
  // wordt hier tijdens het tekenen bepaald en niet in een effect: een effect
  // dat meteen weer state zet, laat React twee keer tekenen voor er iets op
  // het scherm staat.
  const teTonen = minderBeweging ? value : getoond;

  useEffect(() => {
    if (!inBeeld || minderBeweging) return;

    const teller = animate(vanaf, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (huidig) => setGetoond(Math.round(huidig)),
    });

    return () => teller.stop();
  }, [inBeeld, value, vanaf, minderBeweging]);

  return (
    <span ref={anker} className={className}>
      {/* De telling: alleen om naar te kijken. */}
      <span aria-hidden="true" className="tabular-nums">
        {teTonen}
        {suffix}
      </span>
      {/* Het antwoord: alleen om voor te lezen. */}
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
