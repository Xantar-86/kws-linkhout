"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { varianten } from "@/lib/beweging";
import { haalRbfaWedstrijdenInBrowser } from "@/lib/rbfa";
import type { WedstrijdEvent } from "@/types";

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
  /** RBFA-nummer van de ploeg, voor als de server de bond niet bereikt. */
  teamId: string;
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
  teamId,
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
          return;
        }
        // De server kreeg niets van de bond. Dan vraagt deze browser het zelf:
        // een echte browser wordt wel doorgelaten.
        if (antwoord.ok && !data.error) return;
        const nu = new Date();
        const volgende = (await haalRbfaWedstrijdenInBrowser(teamId))
          .filter((w) => w.start > nu)
          .sort((a, b) => a.start.getTime() - b.start.getTime())[0];
        if (!afgebroken && volgende) setWedstrijd(volgende);
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
  }, [apiUrl, teamId]);

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

  const zone = "Europe/Brussels";
  const datum = wedstrijd.start.toLocaleDateString("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: zone,
  });
  const aftrap = wedstrijd.start.toLocaleTimeString("nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: zone,
  });
  const wanneer = relatief(wedstrijd.start);

  const [thuis, uit] = ploegen(wedstrijd);
  const eigenThuis = isEigen(thuis.naam);
  const routeUrl = wedstrijd.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedstrijd.location)}`
    : null;

  return (
    <Kaart>
      <div className="flex items-center justify-between gap-3">
        {kop}
        <span
          className={
            "rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide " +
            (eigenThuis ? "bg-emerald-600 text-white" : "bg-gray-900 text-white")
          }
        >
          {eigenThuis ? "Thuis" : "Uit"}
        </span>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        {/* Wanneer: voluit, zodat niemand "za 3 okt" hoeft te ontcijferen,
            met het uur ernaast en hoelang het nog duurt. */}
        <div className="rounded-xl bg-zand-50 px-4 py-3">
          <p className="text-base font-bold capitalize leading-tight text-gray-900">{datum}</p>
          <p className="mt-1 flex items-center justify-between gap-2 text-sm text-gray-600">
            <span>
              Aftrap <span className="font-bold tabular-nums text-gray-900">{aftrap}</span>
            </span>
            {wanneer && <span className={`font-semibold ${accent}`}>{wanneer}</span>}
          </p>
        </div>

        {/* Wie: de twee ploegen onder elkaar met hun logo, de thuisploeg
            bovenaan zoals op elk wedstrijdblad. Onze ploeg in het vet. */}
        <ul className="mt-4 space-y-2">
          {[thuis, uit].map((p) => {
            const eigen = isEigen(p.naam);
            return (
              <li key={p.naam} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zand-200 bg-white">
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt="" loading="lazy" className="h-7 w-7 object-contain" />
                  ) : null}
                </span>
                <span
                  className={
                    "min-w-0 truncate text-base " +
                    (eigen ? "font-bold text-gray-900" : "font-medium text-gray-700")
                  }
                >
                  {eigen ? "KWS Linkhout" : p.naam}
                </span>
              </li>
            );
          })}
        </ul>

        {wedstrijd.location && (
          <p className="mt-4 flex items-start gap-1.5 text-sm text-gray-500">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-2">{wedstrijd.location}</span>
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 text-sm font-semibold">
          {routeUrl && !eigenThuis && (
            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-gray-900 hover:underline"
            >
              Route
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
          <a
            href={kalenderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-1.5 ${accent}`}
          >
            Volledige kalender
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </Kaart>
  );
}

/** De eigen ploeg heet bij de bond telkens anders ("WS Linkhout A", "W.S. LINKHOUT A"). */
function isEigen(naam: string): boolean {
  return /linkhout/i.test(naam);
}

/**
 * Thuis- en uitploeg. De bond levert ze apart, met logo; bij een andere bron
 * halen we ze uit de titel "Thuis - Uit".
 */
function ploegen(w: WedstrijdEvent): [{ naam: string; logo?: string }, { naam: string; logo?: string }] {
  if (w.thuisNaam && w.uitNaam) {
    return [
      { naam: w.thuisNaam, logo: w.thuisLogo },
      { naam: w.uitNaam, logo: w.uitLogo },
    ];
  }
  const [a, b] = w.summary.split(/\s+-\s+/);
  return [{ naam: a ?? w.summary }, { naam: b ?? "" }];
}

/** "Vandaag", "Morgen" of "Over 5 dagen", in kalenderdagen in België. */
function relatief(start: Date): string | null {
  const dagVan = (d: Date) => {
    const [j, m, dd] = d
      .toLocaleDateString("en-CA", { timeZone: "Europe/Brussels" })
      .split("-")
      .map(Number);
    return Date.UTC(j, m - 1, dd) / 86_400_000;
  };
  const verschil = dagVan(start) - dagVan(new Date());
  if (verschil < 0) return null;
  if (verschil === 0) return "Vandaag";
  if (verschil === 1) return "Morgen";
  return `Over ${verschil} dagen`;
}
