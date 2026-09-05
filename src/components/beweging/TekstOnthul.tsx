"use client";

import { motion, useReducedMotion } from "framer-motion";
import { curve, duur, kijk, trap } from "@/lib/beweging";

/**
 * Een kop die woord voor woord van onder een rand omhoog schuift.
 *
 * Dit is het duurste ogende gebaar op de hele site, en meteen het gevaarlijkste
 * om te overdrijven. Daarom: alleen op de kop van een sectie, nooit op een
 * alinea. Een lopende tekst die letter voor letter binnenkomt is niet filmisch,
 * die is traag.
 *
 * Over de toegankelijkheid: het opsplitsen in woorden hakt de zin ook voor een
 * schermlezer in stukken, en die leest dan "Een. Club. Met. Een. Hart." Daarom
 * draagt de buitenste span het `aria-label` met de volledige zin en staan de
 * losse woorden op `aria-hidden`. Voor de schermlezer is het weer een zin.
 *
 * Over de maskering: elk woord zit in een span met `overflow: hidden`, en het
 * woord zelf schuift daar van onderen in. De onderlengtes van een g of een j
 * zouden daarbij afgesneden worden, dus krijgt het masker wat extra ruimte
 * onderaan die met een negatieve marge weer weggerekend wordt.
 */

interface TekstOnthulProps {
  tekst: string;
  /** Dit woord krijgt de clubkleur. Handig om de nadruk te leggen zonder markup. */
  accent?: string;
  /** Wachttijd voor het eerste woord vertrekt. */
  vertraging?: number;
  /** Speel bij het laden in plaats van bij het scrollen. Voor de hero. */
  meteen?: boolean;
  className?: string;
  /** De klasse voor het accentwoord. */
  accentClassName?: string;
}

export function TekstOnthul({
  tekst,
  accent,
  vertraging = 0,
  meteen = false,
  className,
  accentClassName = "text-primary",
}: TekstOnthulProps) {
  const minderBeweging = useReducedMotion();
  const woorden = tekst.split(" ");

  // Wie minder beweging vraagt, krijgt gewoon de zin. Woord voor woord laten
  // opkomen is precies het soort beweging waar die voorkeur over gaat, en een
  // kop hoort altijd meteen leesbaar te zijn.
  if (minderBeweging) {
    return (
      <span className={className}>
        {woorden.map((woord, i) => (
          <span key={i} className={woord === accent ? accentClassName : undefined}>
            {woord}
            {i < woorden.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    );
  }

  const groep = {
    verborgen: {},
    zichtbaar: {
      transition: { delayChildren: vertraging, staggerChildren: trap.woord },
    },
  };

  const perWoord = {
    // Meer dan honderd procent, zodat het woord echt onder de rand vandaan
    // komt en niet half zichtbaar begint.
    verborgen: { y: "115%" },
    zichtbaar: {
      y: "0%",
      transition: { duration: duur.lang, ease: curve.onthul },
    },
  };

  const speelmoment = meteen
    ? { animate: "zichtbaar" as const }
    : { whileInView: "zichtbaar" as const, viewport: kijk };

  return (
    <motion.span
      aria-label={tekst}
      initial="verborgen"
      variants={groep}
      className={className}
      {...speelmoment}
    >
      {woorden.map((woord, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
          // Ruimte voor de staarten van g, j en p, en meteen weer weggerekend
          // zodat de regelafstand niet verspringt.
          style={{ paddingBottom: "0.18em", marginBottom: "-0.18em" }}
        >
          <motion.span
            variants={perWoord}
            className={`inline-block ${woord === accent ? accentClassName : ""}`}
          >
            {woord}
            {/* Een gewone spatie zou aan de rand van het masker wegvallen. */}
            {i < woorden.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
