"use client";

import { useCallback, useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";

/**
 * Het organigram van de club, over de volle breedte van het scherm.
 *
 * Een organigram is breed en vol tekst, dus binnen de smalle tekstkolom valt
 * er niets van te lezen. Daarom staat het buiten die kolom, over de volle
 * breedte van de pagina. Tik erop en het opent schermvullend, passend op het
 * scherm; wie echt wil inzoomen opent het beeld in een eigen tabblad, want
 * het volledige schema is ruim tienduizend pixels breed.
 */

export interface OrganigramBeeld {
  bron: string;
  titel: string;
  onderschrift: string;
}

export function Organigram({ beelden }: { beelden: OrganigramBeeld[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const sluit = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (open === null) return;
    const opToets = (e: KeyboardEvent) => {
      if (e.key === "Escape") sluit();
    };
    window.addEventListener("keydown", opToets);
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", opToets);
      document.body.style.overflow = vorige;
    };
  }, [open, sluit]);

  return (
    <>
      <div className="space-y-8">
        {beelden.map((beeld, i) => (
          <figure key={beeld.bron} className="mx-auto">
            <h3 className="mb-3 text-center text-xl font-bold text-gray-900">
              {beeld.titel}
            </h3>

            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
              aria-label={`${beeld.titel} groter bekijken`}
            >
              <img
                src={beeld.bron}
                alt={beeld.titel}
                className="h-auto w-full object-contain"
              />
              <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
                <Maximize2 className="h-3.5 w-3.5" />
                Vergroten
              </span>
            </button>

            <figcaption className="mt-3 text-center text-sm text-gray-500">
              {beeld.onderschrift}
            </figcaption>
          </figure>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-2"
          onClick={sluit}
          role="dialog"
          aria-modal="true"
          aria-label={beelden[open].titel}
        >
          <button
            type="button"
            onClick={sluit}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Sluiten"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="flex h-full w-full flex-col items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={beelden[open].bron}
              alt={beelden[open].titel}
              className="max-h-[80vh] max-w-full object-contain"
            />

            {/* Het volledige schema is meer dan tienduizend pixels breed. Op
                een telefoon valt dat binnen een venster niet te lezen; in een
                eigen tabblad kan je wel knijpen en schuiven zoals gewoonlijk. */}
            <a
              href={beelden[open].bron}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
            >
              <Maximize2 className="h-4 w-4" />
              Openen om in te zoomen
            </a>
          </div>
        </div>
      )}
    </>
  );
}
