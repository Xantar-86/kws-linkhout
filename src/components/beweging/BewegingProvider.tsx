"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * De bewegingsinstelling voor de hele site.
 *
 * `reducedMotion="user"` is het belangrijkste vinkje van dit hele systeem.
 * Het laat framer-motion de systeeminstelling van de bezoeker volgen: staat
 * daar dat er minder beweging gewenst is, dan slaat framer alle verplaatsing
 * en schaling over en houdt het alleen het op- en afdoezelen over.
 *
 * Dat is precies de juiste maat. Niet alle animatie uitzetten, want dan
 * verspringen dingen zonder waarschuwing in beeld en verlies je de samenhang
 * die de animatie nu net aanbrengt. Wel alles weglaten wat beweegt, want daar
 * gaat de voorkeur over: verplaatsing is wat duizeligheid en misselijkheid
 * uitlokt bij wie daar gevoelig voor is.
 *
 * Omdat dit centraal geregeld is, hoeft geen enkel component zelf nog aan
 * `useReducedMotion` te denken voor gewone verplaatsingen. Alleen wat framer
 * niet kent, vraagt er nog om: vervaging, parallax en de cursorring. Die
 * controleren het zelf.
 */
export function BewegingProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
