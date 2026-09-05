"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { curve } from "@/lib/beweging";

/**
 * De overgang tussen twee pagina's.
 *
 * Bewust klein gehouden: de nieuwe pagina komt in een derde van een seconde
 * op. Geen veeg, geen doek, geen logo dat opnieuw langskomt. Een bezoeker die
 * naar de trainingsuren zoekt, klikt zeven keer in een minuut, en alles wat
 * bij die zevende klik nog altijd een halve seconde kost, is dan geen sfeer
 * meer maar oponthoud.
 *
 * Alleen de doorzichtigheid beweegt, en dat is geen luiheid maar noodzaak.
 * Een verplaatsing zou hier een `transform` op de omhullende div zetten, en
 * een element met een transform wordt het referentiekader voor alles wat
 * eronder `position: fixed` staat. De aankondiging op de startpagina hangt
 * precies zo in het scherm; die zou dan niet meer aan het venster hangen maar
 * aan deze div, en halverwege de pagina belanden.
 *
 * De sleutel op het pad zorgt dat React de boom als nieuw beschouwt, zodat de
 * animatie ook echt opnieuw begint bij elke navigatie.
 */
export function PaginaOvergang({ children }: { children: ReactNode }) {
  const pad = usePathname();

  return (
    <motion.div
      key={pad}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: curve.onthul }}
    >
      {children}
    </motion.div>
  );
}
