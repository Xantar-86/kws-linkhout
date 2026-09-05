"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { veer } from "@/lib/beweging";

/**
 * Of er een echte muisaanwijzer is.
 *
 * Dit is bij uitstek toestand die buiten React leeft: de browser weet het, wij
 * mogen ernaar vragen en ons erop abonneren. Vandaar `useSyncExternalStore` en
 * geen effect dat de uitkomst in state giet. Dat scheelt een extra tekening
 * bij het laden, en het geeft meteen het juiste antwoord in plaats van eerst
 * het verkeerde.
 *
 * Op de server is er niets om aan te vragen, dus daar luidt het antwoord nee.
 * Dat is ook het veilige antwoord: liever geen ring tonen dan er een tonen die
 * er niet hoort te zijn.
 */
function useFijneAanwijzer() {
  return useSyncExternalStore(
    (opnieuwTekenen) => {
      const vraag = window.matchMedia("(pointer: fine)");
      vraag.addEventListener("change", opnieuwTekenen);
      return () => vraag.removeEventListener("change", opnieuwTekenen);
    },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
}

/**
 * Een ring die de muis met wat naloop volgt, en opzwelt boven alles wat
 * aanklikbaar is.
 *
 * Twee keuzes waar dit component van afwijkt van de gewoonte op sites die
 * hiermee uitpakken:
 *
 * 1. De systeemcursor blijft staan. Vrijwel elke site met een eigen cursor
 *    verbergt de echte, en dat is precies waar zo'n site onbruikbaar wordt:
 *    de vervanger loopt altijd een paar beeldjes achter, dus je klikt naast
 *    wat je aanwijst, en bij een haperende tab is de aanwijzer plots weg. Hier
 *    is de ring een aura rond de echte cursor. Ze mag achterlopen, want de
 *    punt waarmee je richt staat er nog gewoon.
 *
 * 2. Ze verschijnt alleen bij een fijne aanwijzer. Op een aanraakscherm is er
 *    geen cursor om te versieren, en op een tablet met stylus evenmin.
 *
 * De ring is puur decoratief: `aria-hidden` en zonder klikvlak, zodat hij nooit
 * tussen de bezoeker en een knop komt te staan.
 */

/** Alles waarboven de ring opzwelt. */
const AANKLIKBAAR = 'a, button, [role="button"], input, select, textarea, summary, label';

export function Cursor() {
  const minderBeweging = useReducedMotion();
  const fijneAanwijzer = useFijneAanwijzer();
  const [boven, setBoven] = useState(false);
  const [zichtbaar, setZichtbaar] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const zachteX = useSpring(x, veer.traag);
  const zachteY = useSpring(y, veer.traag);

  const actief = fijneAanwijzer && !minderBeweging;

  useEffect(() => {
    if (!actief) return;

    function beweeg(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      // Pas tonen bij de eerste beweging. Anders staat de ring bij het laden
      // in de linkerbovenhoek te wachten op een muis die er misschien nooit
      // komt.
      setZichtbaar(true);
    }

    // Via het doel van de gebeurtenis en niet via een lijst van elementen: zo
    // werkt het ook voor knoppen die er later bijkomen, en er hangt maar een
    // enkele luisteraar aan het document.
    function over(e: MouseEvent) {
      const doel = e.target as Element | null;
      setBoven(Boolean(doel?.closest?.(AANKLIKBAAR)));
    }

    function weg() {
      setZichtbaar(false);
    }

    window.addEventListener("mousemove", beweeg, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseleave", weg);

    return () => {
      window.removeEventListener("mousemove", beweeg);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", weg);
    };
  }, [actief, x, y]);

  if (!actief) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-90 hidden md:block"
      style={{ x: zachteX, y: zachteY }}
    >
      <motion.div
        // Het min-de-helft-van-de-maat trucje houdt de ring gecentreerd op de
        // muis terwijl hij van formaat verandert.
        className="rounded-full border border-primary/50"
        animate={{
          width: boven ? 44 : 24,
          height: boven ? 44 : 24,
          x: boven ? -22 : -12,
          y: boven ? -22 : -12,
          opacity: zichtbaar ? (boven ? 0.9 : 0.45) : 0,
          backgroundColor: boven ? "rgb(220 38 38 / 0.08)" : "rgb(220 38 38 / 0)",
        }}
        transition={veer.knap}
      />
    </motion.div>
  );
}
