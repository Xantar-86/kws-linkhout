"use client";

// components/home/Aankondiging.tsx
//
// Affiches die even over de startpagina komen te liggen, voor iets dat maar
// een paar weken speelt. Elk affiche draagt zijn eigen einddatum: zo verdwijnt
// het vanzelf en blijft er geen verlopen aankondiging staan omdat niemand
// eraan dacht ze weg te halen.
//
// Er kunnen er meerdere tegelijk hangen. Op een breed scherm staan ze naast
// elkaar, op een telefoon onder elkaar; is er nog maar een over, dan neemt die
// vanzelf de hele plaats in.
//
// Een affiche bijzetten is een regel in AFFICHES erbij. Alles weghalen doe je
// door <Aankondiging /> uit app/page.tsx te schrappen.

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

type Affiche = {
  /** Kort en uniek; belandt in de sleutel van sessionStorage. */
  id: string;
  beeld: string;
  /** Wat er op het affiche staat, voor wie het niet ziet. */
  tekst: string;
  breedte: number;
  hoogte: number;
  /** Het eerste moment waarop het affiche weg is. */
  tot: Date;
};

const AFFICHES: Affiche[] = [
  {
    id: "instaptraining",
    beeld: "/images/nieuws/instaptraining.jpeg",
    tekst:
      "Instaptrainingen voor nieuwe spelers geboren in 2020, 2021 of 2022: " +
      "woensdag 16, 23 en 30 september van 18.00 tot 19.15 uur bij KWS Linkhout. " +
      "Gratis, voor meisjes en jongens, geen ervaring nodig.",
    breedte: 1024,
    hoogte: 1536,
    // De laatste instaptraining is woensdag 30 september; op 1 oktober weg.
    tot: new Date("2026-10-01T00:00:00+02:00"),
  },
  {
    id: "ref-in-1-day",
    beeld: "/images/social/pop-up referee.jpeg",
    tekst: "Ref in 1 Day: word scheidsrechter, zaterdag 3 oktober 2026 in Sint-Truiden",
    breedte: 831,
    hoogte: 1209,
    // Tot en met zaterdag 3 oktober 2026; vanaf de vierde blijft het weg.
    tot: new Date("2026-10-04T00:00:00+02:00"),
  },
];

/** Hoe lang de bezoeker de pagina eerst gewoon mag zien. */
const WACHTEN = 2500;

export function Aankondiging() {
  // Wat er vandaag nog hangt. Leeg tot de effect-hook gedraaid heeft: de datum
  // van de server is niet die van de bezoeker, en dat mag de hydratie niet in
  // de war sturen.
  const [hangt, setHangt] = useState<Affiche[]>([]);
  const [open, setOpen] = useState(false);
  // Laadt een beeld niet, dan tonen we liever niets dan een leeg kader.
  const [stuk, setStuk] = useState<string[]>([]);

  useEffect(() => {
    const nu = new Date();
    const geldig = AFFICHES.filter((a) => nu < a.tot);
    if (geldig.length === 0) return;

    // De sleutel draagt de affiches in zich: hangt er morgen een nieuw affiche
    // bij, dan krijgt wie het vorige wegklikte het toch nog te zien.
    const sleutel = `kws-aankondiging-${geldig.map((a) => a.id).join("+")}`;

    // sessionStorage en niet localStorage: wie het wegklikt heeft het gezien,
    // maar bij een volgend bezoek mag het gerust nog eens.
    try {
      if (sessionStorage.getItem(sleutel)) return;
    } catch {
      /* een browser die opslag weigert krijgt het gewoon te zien */
    }

    // Pas zetten als het zover is: eerder de staat aanraken laat React nog een
    // keer renderen voor niets.
    const timer = setTimeout(() => {
      setHangt(geldig);
      setOpen(true);
    }, WACHTEN);
    return () => clearTimeout(timer);
  }, []);

  const zichtbaar = hangt.filter((a) => !stuk.includes(a.id));

  const sluit = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(`kws-aankondiging-${hangt.map((a) => a.id).join("+")}`, "1");
    } catch {
      /* niets aan te doen, dan komt het dit bezoek nog eens terug */
    }
  }, [hangt]);

  // Zolang er een affiche openstaat hoort de pagina eronder stil te liggen, en
  // moet Escape het kunnen wegdoen.
  useEffect(() => {
    // Ook stoppen als geen enkel beeld het doet: er staat dan niets meer op
    // het scherm, en dan mag de pagina eronder zeker niet vastgezet blijven.
    if (!open || zichtbaar.length === 0) return;
    const opToets = (e: KeyboardEvent) => e.key === "Escape" && sluit();
    window.addEventListener("keydown", opToets);
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", opToets);
      document.body.style.overflow = vorige;
    };
  }, [open, zichtbaar.length, sluit]);

  if (!open || zichtbaar.length === 0) return null;

  const meerdere = zichtbaar.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={zichtbaar.map((a) => a.tekst).join(" — ")}
      // De achtergrond scrolt zelf: op een telefoon staan de affiches onder
      // elkaar en moet je erbij kunnen. overscroll-contain houdt die beweging
      // hier, zodat de pagina eronder niet meemeegaat.
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-black/70 p-4 sm:p-6
                 animate-fade-in"
      onClick={sluit}
    >
      <button
        type="button"
        onClick={sluit}
        aria-label="Sluiten"
        // Vast in de hoek van het scherm en niet op het affiche: met twee
        // affiches onder elkaar moet de knop bereikbaar blijven waar je ook
        // staat te scrollen.
        className="fixed right-3 top-3 z-10 rounded-full bg-white/95 p-2 text-gray-800
                   shadow-lg hover:bg-white"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex min-h-full items-center justify-center">
        <div
          className={`grid place-items-center gap-4 lg:gap-6 ${meerdere ? "lg:grid-cols-2" : ""}`}
          // Een klik op een affiche mag het niet sluiten; dat is verwarrend als
          // je het net staat te lezen.
          onClick={(e) => e.stopPropagation()}
        >
          {zichtbaar.map((a) => (
            <Image
              key={a.id}
              src={a.beeld}
              alt={a.tekst}
              width={a.breedte}
              height={a.hoogte}
              priority
              onError={() => setStuk((v) => [...v, a.id])}
              // Hangen er twee, dan blijft het eerste affiche op een telefoon
              // net onder de schermrand: dat toont vanzelf dat er nog iets
              // volgt, zonder pijltje of bolletje erbij.
              className={`h-auto w-auto rounded-lg shadow-2xl ${
                meerdere ? "max-h-[78vh] lg:max-h-[86vh]" : "max-h-[88vh]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
