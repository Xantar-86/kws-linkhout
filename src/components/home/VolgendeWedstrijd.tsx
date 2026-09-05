"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { varianten } from "@/lib/beweging";
import type { WedstrijdEvent } from "@/types";

const DAGEN = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
const MAANDEN = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

/**
 * De eerstvolgende wedstrijd van één ploeg, als kaart.
 *
 * Dit was tot nu toe een sectie op zich, en er stonden er drie onder elkaar op
 * de startpagina. Dat kostte drie schermen aan hoogte voor drie regels
 * informatie, en het duwde alles wat erna kwam onder de vouw. Nu is het een
 * kaart, en zet WedstrijdenSection de drie ploegen naast elkaar.
 *
 * De kaart bestaat in drie toestanden, en alle drie zijn ze even hoog. Dat is
 * geen detail: haalt de ene ploeg zijn wedstrijd sneller op dan de andere,
 * dan zou het raster anders bij elke reactie verspringen, en dan staat de
 * bezoeker naar dansende kaarten te kijken.
 */

interface VolgendeWedstrijdProps {
  apiUrl: string;
  kalenderUrl: string;
  titel: string;
  kleur?: "primary" | "pink";
}

/** De omhulling die alle drie de toestanden delen. */
function Kaart({
  children,
  hoogte = true,
}: {
  children: React.ReactNode;
  hoogte?: boolean;
}) {
  return (
    <motion.div variants={varianten.lid} className="h-full">
      <div
        className={`kaart kaart-tilt flex flex-col p-6 ${hoogte ? "min-h-60" : ""} h-full`}
      >
        {children}
      </div>
    </motion.div>
  );
}

export function VolgendeWedstrijd({
  apiUrl,
  kalenderUrl,
  titel,
  kleur = "primary",
}: VolgendeWedstrijdProps) {
  const [wedstrijd, setWedstrijd] = useState<WedstrijdEvent | null>(null);
  const [laden, setLaden] = useState(true);

  const badge =
    kleur === "pink"
      ? "bg-pink-50 text-pink-700 ring-pink-100"
      : "bg-primary-50 text-primary-700 ring-primary-100";
  const accent = kleur === "pink" ? "text-pink-600" : "text-primary";

  useEffect(() => {
    let afgebroken = false;

    async function haalOp() {
      try {
        const antwoord = await fetch(apiUrl);
        const data = await antwoord.json();
        if (afgebroken) return;
        if (data.volgende) {
          setWedstrijd({ ...data.volgende, start: new Date(data.volgende.start) });
        }
      } catch (fout) {
        console.error("Fout bij ophalen wedstrijden:", fout);
      } finally {
        if (!afgebroken) setLaden(false);
      }
    }

    haalOp();
    // Wisselt de pagina van ploeg terwijl er nog een aanvraag loopt, dan mag
    // het late antwoord de nieuwe kaart niet meer overschrijven.
    return () => {
      afgebroken = true;
    };
  }, [apiUrl]);

  const kop = (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badge}`}
    >
      {titel}
    </span>
  );

  // Aan het laden: een skelet in de vorm van wat er komt. Geen draaiend
  // wieltje, want dat vertelt alleen dat er gewacht wordt; een skelet vertelt
  // waarop.
  if (laden) {
    return (
      <Kaart>
        {kop}
        <div className="mt-6 space-y-3" aria-hidden="true">
          <div className="h-10 w-28 animate-pulse rounded-lg bg-zand-100" />
          <div className="h-5 w-3/4 animate-pulse rounded bg-zand-100" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-zand-100" />
        </div>
        <span className="sr-only">De volgende wedstrijd wordt opgehaald</span>
      </Kaart>
    );
  }

  // Niets gepland, of de kalender was niet bereikbaar. Zeg dat gewoon, en
  // wijs naar waar het wel staat.
  if (!wedstrijd) {
    return (
      <Kaart>
        {kop}
        <div className="mt-6 flex flex-1 flex-col">
          <CalendarDays className="h-8 w-8 text-zand-300" />
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Er staat op dit moment geen wedstrijd ingepland. De volledige
            kalender blijft wel te bekijken bij de KBVB.
          </p>
          <a
            href={kalenderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`group mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold ${accent}`}
          >
            Kalender bekijken
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </Kaart>
    );
  }

  const dag = DAGEN[wedstrijd.start.getDay()];
  const dagNummer = wedstrijd.start.getDate();
  const maand = MAANDEN[wedstrijd.start.getMonth()];
  const uur = wedstrijd.start.getHours().toString().padStart(2, "0");
  const minuten = wedstrijd.start.getMinutes().toString().padStart(2, "0");

  return (
    <Kaart>
      {kop}

      <div className="mt-6 flex flex-1 flex-col">
        {/* De datum als blikvanger. Het dagnummer draagt het gewicht, de rest
            staat eromheen: zo lees je in één oogopslag wanneer. */}
        <div className="flex items-baseline gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
            {dag}
          </span>
          <span className="font-display text-5xl font-extrabold leading-none tracking-tight text-gray-900">
            {dagNummer}
          </span>
          <span className="text-sm font-semibold uppercase text-gray-500">{maand}</span>
          <span className="ml-auto text-sm font-semibold tabular-nums text-gray-900">
            {uur}:{minuten}
          </span>
        </div>

        <h3 className="mt-4 text-base font-bold leading-snug text-gray-900">
          {wedstrijd.summary}
        </h3>

        {wedstrijd.location && (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-gray-500">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-2">{wedstrijd.location}</span>
          </p>
        )}

        <a
          href={kalenderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`group mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold ${accent}`}
        >
          Volledige kalender
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </Kaart>
  );
}
