"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, User, X } from "lucide-react";
import { POSITIES, type Kernlid } from "@/lib/kernen";

/** Het eerste woord van de naam. */
function voornaam(naam: string): string {
  return naam.split(" ")[0];
}

/** Alles na het eerste woord; "Jacob Van Genechten" blijft dus samen. */
function achternaam(naam: string): string {
  return naam.split(" ").slice(1).join(" ") || naam;
}

/** Leeftijd uit het geboortejaar. Bij benadering, want de dag kennen we niet. */
function leeftijd(geboren?: number): number | null {
  if (!geboren) return null;
  return new Date().getFullYear() - geboren;
}

/** De vlag van een landcode, als emoji. Leeg betekent Belgisch. */
function vlag(land = "BE"): string {
  return land
    .toUpperCase()
    .replace(/[A-Z]/g, (c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65));
}

/**
 * Dezelfde clubwand als achter de spelers op hun kaart.
 *
 * Die staat al achter elke uitgeknipte speler; hier is hij er voor wie nog
 * geen portret heeft, zodat een leeg vakje niet uit de toon valt. De spatie
 * in de bestandsnaam moet in een stijlregel wel als %20 geschreven worden.
 */
const CLUBWAND = 'url("/images/achtergrond%20spelers.png")';

/**
 * Eén cel in het gegevensrooster over de foto.
 *
 * De cellen komen niet allemaal tegelijk op: elke volgende wacht een tel
 * langer, waardoor het rooster zich lijkt op te bouwen in plaats van te
 * verschijnen. Wie beweging liever kwijt is krijgt ze meteen te zien.
 */
function Gegeven({
  waarde,
  label,
  volgorde,
}: {
  waarde: string;
  label: string;
  volgorde: number;
}) {
  return (
    <div
      className="translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
      style={{ transitionDelay: `${120 + volgorde * 70}ms` }}
    >
      <p className="text-2xl font-bold leading-none text-white">{waarde}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">
        {label}
      </p>
    </div>
  );
}

/**
 * De speler groot in beeld, met zijn gegevens eronder.
 *
 * Bladeren gaat langs de spelers die een portret hebben; de lege vakjes slaan
 * we over, want daar valt niets te vergroten.
 */
function Vergroting({
  spelers,
  index,
  onSluit,
  onWissel,
}: {
  spelers: Kernlid[];
  index: number;
  onSluit: () => void;
  onWissel: (nieuw: number) => void;
}) {
  const vorige = useCallback(
    () => onWissel((index - 1 + spelers.length) % spelers.length),
    [index, spelers.length, onWissel]
  );
  const volgende = useCallback(
    () => onWissel((index + 1) % spelers.length),
    [index, spelers.length, onWissel]
  );

  useEffect(() => {
    const opToets = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSluit();
      else if (e.key === "ArrowLeft") vorige();
      else if (e.key === "ArrowRight") volgende();
    };
    window.addEventListener("keydown", opToets);
    const vorigeOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", opToets);
      document.body.style.overflow = vorigeOverflow;
    };
  }, [onSluit, vorige, volgende]);

  const speler = spelers[index];
  const jaren = leeftijd(speler.geboren);

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4"
      onClick={onSluit}
      role="dialog"
      aria-modal="true"
      aria-label={speler.naam}
    >
      <button
        type="button"
        onClick={onSluit}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        aria-label="Sluiten"
      >
        <X className="h-6 w-6" />
      </button>

      {spelers.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              vorige();
            }}
            className="absolute left-1 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-6"
            aria-label="Vorige speler"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              volgende();
            }}
            className="absolute right-1 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-6"
            aria-label="Volgende speler"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        </>
      )}

      <figure className="max-h-full px-10 sm:px-0" onClick={(e) => e.stopPropagation()}>
        <Image
          src={speler.groot!}
          alt={speler.naam}
          width={1050}
          height={1400}
          sizes="(max-width: 768px) 80vw, 520px"
          className="max-h-[72vh] w-auto rounded-xl object-contain sm:max-h-[80vh]"
          priority
        />
        <figcaption className="mt-3 text-center text-white">
          <span className="block text-lg font-bold uppercase">
            {speler.nummer !== undefined ? `${speler.nummer}. ` : ""}
            {speler.naam}
          </span>
          <span className="mt-1 block text-sm text-white/70">
            {[
              speler.positie ? POSITIES[speler.positie] : null,
              jaren !== null ? `${jaren} jaar` : null,
              speler.sinds ? `bij de club sinds ${speler.sinds}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

function Kaart({ speler, onOpen }: { speler: Kernlid; onOpen?: () => void }) {
  const jaren = leeftijd(speler.geboren);
  const gegevens = [
    jaren !== null && { waarde: String(jaren), label: "Jaar" },
    { waarde: vlag(speler.land), label: "Nationaliteit" },
    speler.positie && { waarde: speler.positie, label: "Positie" },
    speler.sinds && { waarde: String(speler.sinds), label: "Sinds" },
  ].filter(Boolean) as { waarde: string; label: string }[];

  return (
    <article
      className="group relative w-40 shrink-0 snap-start overflow-hidden rounded-xl bg-cover bg-center sm:w-48 lg:w-56"
      style={{ backgroundImage: CLUBWAND }}
    >
      {/* Over de hele kaart, zodat je hem overal kan aanklikken om de speler
          groot te zien. Ligt boven de foto maar onder niets anders. */}
      {onOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="absolute inset-0 z-10 cursor-zoom-in"
          aria-label={`${speler.naam} groter bekijken`}
        />
      )}

      <div className="relative aspect-3/4">
        {speler.groot ? (
          <>
            {/* De foto komt bij het aanwijzen naar voren en zakt tegelijk weg
                achter het rode vlak: scherpte en kleur eruit, de speler blijft
                als silhouet zichtbaar. */}
            <Image
              src={speler.groot}
              alt={speler.naam}
              fill
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
              className="object-cover object-top transition-[transform,filter] duration-500 ease-out group-hover:scale-110 group-hover:blur-[3px] group-hover:saturate-50 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:blur-none"
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <User className="h-10 w-10 text-white/40" />
          </div>
        )}

        {/* De gegevens schuiven pas over de foto wanneer je hem aanwijst. Op
            een telefoon bestaat aanwijzen niet, dus daar staan ze onder de
            naam; zie hieronder. */}
        {gegevens.length > 0 && (
          <div className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
            <div className="absolute inset-0 bg-primary-800/90" />
            {/* Schuine baan zoals op de kaarten van grote clubs; die veegt bij
                het aanwijzen over de kaart. */}
            <div className="absolute -inset-y-8 -left-1/3 w-2/3 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-700 ease-out group-hover:translate-x-[190%] motion-reduce:hidden" />
            {/* Het clubschild zakt vanaf de bovenrand mee naar binnen. */}
            <Image
              src="/images/logo-kws.png"
              alt=""
              width={120}
              height={92}
              aria-hidden
              className="absolute left-1/2 top-3 h-14 w-auto -translate-x-1/2 -translate-y-10 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none lg:h-16"
            />
            <div className="relative grid h-full grid-cols-2 content-center gap-x-3 gap-y-5 p-4 pt-20">
              {gegevens.map((g, i) => (
                <Gegeven key={g.label} waarde={g.waarde} label={g.label} volgorde={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Naam onder de foto, met het rugnummer groot ervoor. Bij het aanwijzen
          dooft die weg zodat de aandacht bij de gegevens ligt. */}
      <div className="flex items-baseline gap-2 bg-primary-900 px-3 py-2 transition-opacity duration-300 group-hover:opacity-40">
        {speler.nummer !== undefined && (
          <span className="text-2xl font-bold leading-none text-white">{speler.nummer}</span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-[11px] uppercase leading-tight text-white/70">
            {voornaam(speler.naam)}
          </span>
          <span className="block truncate text-sm font-bold uppercase leading-tight text-white">
            {achternaam(speler.naam)}
          </span>
        </span>
      </div>

      {/* Op smalle schermen onder de foto, want daar valt er niets aan te wijzen. */}
      {gegevens.length > 0 && (
        <p className="px-3 py-2 text-[11px] text-gray-600 sm:hidden">
          {[
            speler.positie ? POSITIES[speler.positie] : null,
            jaren !== null ? `${jaren} jaar` : null,
            speler.sinds ? `sinds ${speler.sinds}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
    </article>
  );
}

/**
 * De kern als een balk die je opzij schuift.
 *
 * De pijlen verschuiven met ongeveer een schermbreedte tegelijk en verdwijnen
 * aan het begin en het einde. Slepen en vegen werkt gewoon; de pijlen zijn er
 * voor wie met de muis werkt.
 */
export function SpelersCarrousel({ spelers }: { spelers: Kernlid[] }) {
  const baan = useRef<HTMLDivElement>(null);
  const [kanTerug, setKanTerug] = useState(false);
  const [kanVerder, setKanVerder] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  const meten = useCallback(() => {
    const el = baan.current;
    if (!el) return;
    setKanTerug(el.scrollLeft > 8);
    setKanVerder(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    meten();
    window.addEventListener("resize", meten);
    return () => window.removeEventListener("resize", meten);
  }, [meten, spelers.length]);

  const schuif = (richting: 1 | -1) => {
    const el = baan.current;
    if (!el) return;
    el.scrollBy({ left: richting * el.clientWidth * 0.85, behavior: "smooth" });
  };

  if (spelers.length === 0) return null;

  // Alleen wie een portret heeft valt te vergroten; de lege vakjes slaan we
  // over, ook bij het bladeren met de pijltjes.
  const metFoto = spelers.filter((s) => s.groot);

  return (
    <div className="relative">
      <div
        ref={baan}
        onScroll={meten}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {spelers.map((speler) => (
          <Kaart
            key={speler.naam}
            speler={speler}
            onOpen={speler.groot ? () => setOpen(metFoto.indexOf(speler)) : undefined}
          />
        ))}
      </div>

      {open !== null && (
        <Vergroting
          spelers={metFoto}
          index={open}
          onSluit={() => setOpen(null)}
          onWissel={setOpen}
        />
      )}

      {kanTerug && (
        <button
          type="button"
          onClick={() => schuif(-1)}
          className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2 text-primary shadow-lg ring-1 ring-black/5 hover:bg-gray-50 sm:block"
          aria-label="Vorige spelers"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {kanVerder && (
        <button
          type="button"
          onClick={() => schuif(1)}
          className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-2 text-primary shadow-lg ring-1 ring-black/5 hover:bg-gray-50 sm:block"
          aria-label="Volgende spelers"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
