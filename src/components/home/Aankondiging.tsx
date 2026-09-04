"use client";

// components/home/Aankondiging.tsx
//
// Een affiche dat even over de startpagina komt te liggen, voor iets dat maar
// een paar weken speelt. Bewust met een einddatum in de code: zo verdwijnt het
// vanzelf en blijft er geen verlopen aankondiging staan omdat niemand eraan
// dacht ze weg te halen.
//
// Weghalen doe je door <Aankondiging /> uit app/page.tsx te schrappen.

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * Wat er te zien is, en tot wanneer.
 *
 * `tot` is het moment waarop het affiche voor het laatst getoond wordt. Wie de
 * pagina daarna opent, ziet niets meer.
 */
const AANKONDIGING = {
  beeld: "/images/social/pop-up referee.jpeg",
  tekst: "Ref in 1 Day: word scheidsrechter, zaterdag 3 oktober 2026 in Sint-Truiden",
  // Tot en met zaterdag 3 oktober 2026; vanaf de vierde blijft het weg.
  tot: new Date("2026-10-04T00:00:00+02:00"),
  /** Hoe lang de bezoeker de pagina eerst gewoon mag zien. */
  wachten: 2500,
  /** Onthoudt wie het al weggeklikt heeft, zodat het niet blijft terugkomen. */
  sleutel: "kws-aankondiging-ref-in-1-day",
};

export function Aankondiging() {
  const [open, setOpen] = useState(false);
  // Laadt het beeld niet, dan tonen we liever niets dan een leeg kader.
  const [stuk, setStuk] = useState(false);

  useEffect(() => {
    if (new Date() >= AANKONDIGING.tot) return;

    // sessionStorage en niet localStorage: wie het wegklikt heeft het gezien,
    // maar bij een volgend bezoek mag het gerust nog eens.
    try {
      if (sessionStorage.getItem(AANKONDIGING.sleutel)) return;
    } catch {
      /* een browser die opslag weigert krijgt het gewoon te zien */
    }

    const timer = setTimeout(() => setOpen(true), AANKONDIGING.wachten);
    return () => clearTimeout(timer);
  }, []);

  const sluit = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(AANKONDIGING.sleutel, "1");
    } catch {
      /* niets aan te doen, dan komt het dit bezoek nog eens terug */
    }
  }, []);

  // Zolang het affiche openstaat hoort de pagina eronder stil te liggen, en
  // moet Escape het kunnen wegdoen.
  useEffect(() => {
    // Ook stoppen als het beeld het niet doet: er staat dan niets meer op het
    // scherm, en dan mag de pagina eronder zeker niet vastgezet blijven.
    if (!open || stuk) return;
    const opToets = (e: KeyboardEvent) => e.key === "Escape" && sluit();
    window.addEventListener("keydown", opToets);
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", opToets);
      document.body.style.overflow = vorige;
    };
  }, [open, stuk, sluit]);

  if (!open || stuk) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={AANKONDIGING.tekst}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4
                 animate-fade-in"
      onClick={sluit}
    >
      <div
        className="relative max-h-full"
        // Een klik op het affiche zelf mag het niet sluiten; dat is verwarrend
        // als je het net wil bekijken of erop wil klikken.
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={sluit}
          aria-label="Sluiten"
          // Binnen het affiche en niet erbuiten: op een telefoon staat de rand
          // van het beeld tegen de rand van het scherm, en dan valt een knop
          // die erbuiten hangt half weg.
          className="absolute right-2 top-2 z-10 rounded-full bg-white/95 p-2 text-gray-800
                     shadow-lg hover:bg-white"
        >
          <X className="h-5 w-5" />
        </button>

        <Image
          src={AANKONDIGING.beeld}
          alt={AANKONDIGING.tekst}
          width={831}
          height={1209}
          priority
          onError={() => setStuk(true)}
          className="h-auto max-h-[88vh] w-auto rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}
