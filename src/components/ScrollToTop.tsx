"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Zet elke nieuwe pagina bovenaan.
 *
 * Let op het `behavior: "instant"`. Sinds er `scroll-behavior: smooth` op het
 * html-element staat, gaat elke scroll die de pagina zelf opdraagt vloeiend,
 * en dus ook deze. Dan zie je bij elke klik op een link de nieuwe pagina van
 * onder naar boven wegglijden voor hij stilstaat. Dat is geen sfeer maar
 * wachten, en het geeft bovendien de indruk dat je nog op de oude pagina zit.
 *
 * Het vloeiende scrollen is bedoeld voor sprongen naar een anker binnen een
 * pagina; het springen naar boven bij een paginawissel hoort meteen te
 * gebeuren.
 */
export function ScrollToTop() {
  const pad = usePathname();

  useEffect(() => {
    // De browser zijn eigen herstel van de scrollpositie uitschakelen: dat
    // vecht anders met wat we hieronder zelf doen.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pad]);

  return null;
}
