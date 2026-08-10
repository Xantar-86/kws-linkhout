"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Speler } from "@/lib/spelers";

/** Het eerste woord van de naam. */
function voornaam(naam: string): string {
  return naam.split(" ")[0];
}

/** Alles na het eerste woord; "Jacob Van Genechten" blijft dus samen. */
function achternaam(naam: string): string {
  return naam.split(" ").slice(1).join(" ");
}

/**
 * Het vergrote portret met de naam eronder.
 *
 * Zowel het spelersraster als de trainer gebruiken dit, zodat een foto overal
 * op dezelfde manier opengaat.
 */
function Vergroting({
  personen,
  index,
  onSluit,
  onWissel,
}: {
  personen: Speler[];
  index: number;
  onSluit: () => void;
  onWissel: (nieuw: number) => void;
}) {
  const vorige = useCallback(
    () => onWissel((index - 1 + personen.length) % personen.length),
    [index, personen.length, onWissel]
  );
  const volgende = useCallback(
    () => onWissel((index + 1) % personen.length),
    [index, personen.length, onWissel]
  );

  useEffect(() => {
    const opToets = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSluit();
      else if (e.key === "ArrowLeft") vorige();
      else if (e.key === "ArrowRight") volgende();
    };
    window.addEventListener("keydown", opToets);
    // Achtergrond niet laten meescrollen zolang het beeld openstaat.
    const vorigeOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", opToets);
      document.body.style.overflow = vorigeOverflow;
    };
  }, [onSluit, vorige, volgende]);

  const persoon = personen[index];

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4"
      onClick={onSluit}
      role="dialog"
      aria-modal="true"
      aria-label={persoon.naam}
    >
      <button
        type="button"
        onClick={onSluit}
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        aria-label="Sluiten"
      >
        <X className="h-6 w-6" />
      </button>

      {personen.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              vorige();
            }}
            className="absolute left-1 sm:left-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Vorige"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              volgende();
            }}
            className="absolute right-1 sm:right-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Volgende"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </>
      )}

      {/* Op een smal scherm blijft er ruimte vrij voor de pijlen naast het
          beeld, anders staan die er bovenop. */}
      <figure
        className="max-h-full max-w-3xl px-10 sm:px-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={persoon.groot}
          alt={persoon.naam}
          width={1400}
          height={1400}
          sizes="(max-width: 768px) 80vw, 700px"
          className="max-h-[70vh] w-auto rounded-lg object-contain sm:max-h-[78vh]"
          priority
        />
        <figcaption className="mt-3 text-center text-base font-medium text-white sm:text-lg">
          {persoon.naam}
        </figcaption>
      </figure>
    </div>
  );
}

/**
 * De spelers van een ploeg als raster van portretten.
 *
 * Wijs een speler aan en de foto springt fors naar voren, over de buren heen;
 * klik erop en je krijgt hem groot te zien, met de pijltjestoetsen om door de
 * ploeg te bladeren.
 */
export function SpelersGalerij({ spelers }: { spelers: Speler[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (spelers.length === 0) return null;

  return (
    <>
      {/* De uitvergroting bij het aanwijzen mag buiten het raster komen, dus
          hier geen overflow afkappen. */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-visible">
        {spelers.map((speler, i) => (
          <button
            key={speler.klein}
            type="button"
            onClick={() => setOpen(i)}
            // Tailwind past hover alleen toe op toestellen die het kennen, dus
            // op een telefoon blijft de tegel gewoon staan. Daar geeft de
            // indruk bij het aantikken de terugkoppeling.
            className="group relative origin-center text-left transition-transform duration-200 ease-out active:scale-95 hover:z-20 hover:scale-[1.9] hover:active:scale-[1.9] focus-visible:z-20 focus-visible:scale-[1.9] focus:outline-none"
            aria-label={`Foto van ${speler.naam} groter bekijken`}
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm ring-0 transition-shadow duration-200 group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-primary/40">
              {/* Ruim genomen, want bij het aanwijzen wordt de tegel bijna
                  dubbel zo groot en moet hij scherp blijven. */}
              <Image
                src={speler.klein}
                alt={speler.naam}
                fill
                sizes="(max-width: 640px) 60vw, 440px"
                className="object-cover"
              />
            </div>
            {/* Altijd twee regels, ook als de achternaam kort is. Anders
                worden de tegels ongelijk hoog en loopt het raster scheef.
                Bij het aanwijzen verdwijnt de naam, want die zou onder de
                uitvergrote foto toch niet meer leesbaar staan. */}
            <p className="mt-1.5 h-7 text-[11px] leading-3.5 text-gray-700 transition-opacity duration-150 group-hover:opacity-0 sm:h-8 sm:text-xs sm:leading-4">
              <span className="block truncate">{voornaam(speler.naam)}</span>
              <span className="block truncate">{achternaam(speler.naam)}</span>
            </p>
          </button>
        ))}
      </div>

      {open !== null && (
        <Vergroting
          personen={spelers}
          index={open}
          onSluit={() => setOpen(null)}
          onWissel={setOpen}
        />
      )}
    </>
  );
}

/**
 * Het ronde portret van een trainer naast zijn naam.
 *
 * Doet hetzelfde als een speler in het raster: groter worden bij aanwijzen en
 * opengaan bij klikken.
 */
export function TrainerAvatar({ trainer }: { trainer: Speler }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative mr-3 h-10 w-10 shrink-0 origin-center overflow-hidden rounded-full bg-gray-100 shadow-sm transition-transform duration-200 ease-out active:scale-95 hover:z-20 hover:scale-[2.4] hover:shadow-2xl hover:active:scale-[2.4] focus-visible:z-20 focus-visible:scale-[2.4] focus:outline-none"
        aria-label={`Foto van ${trainer.naam} groter bekijken`}
      >
        {/* De foto staat op veertig pixels maar groeit bij het aanwijzen tot
            ruim het dubbele. Zonder een ruimere hint haalt Next een minuscule
            versie op en wordt het uitvergrote beeld wazig. */}
        <Image
          src={trainer.klein}
          alt={trainer.naam}
          fill
          sizes="256px"
          className="object-cover"
        />
      </button>

      {open && (
        <Vergroting
          personen={[trainer]}
          index={0}
          onSluit={() => setOpen(false)}
          onWissel={() => {}}
        />
      )}
    </>
  );
}
