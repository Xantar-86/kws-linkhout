"use client";

// components/ploeg/KlassementBlok.tsx
//
// Waar een ploeg in haar reeks staat, als donker blok op de ploegpagina.
//
// Links het cijfer dat telt: de plaats, groot. Rechts een uitsnede uit het
// klassement met de ploegen er net boven en net onder, zodat je in één oogopslag
// ziet hoe dicht de buren zitten. Het volledige klassement blijft een klik
// verder.
//
// Het blok volgt de cijferband van de startpagina: inkt, een warme rode gloed
// onderaan, en het rood alleen waar het iets betekent, hier de eigen rij.

import { ArrowUpRight, Trophy } from "lucide-react";
import type { Klassement } from "@/lib/rbfa";

/** "1ste", "2de", "8ste": zoals een Vlaamse supporter het zegt. */
function rangwoord(n: number): string {
  return n === 1 || n === 8 || n >= 20 ? `${n}ste` : `${n}de`;
}

export function KlassementBlok({ klassement }: { klassement: Klassement }) {
  const { wij, venster, reeks, aantal, gedeeld } = klassement;

  return (
    <div className="korrel relative overflow-hidden rounded-2xl bg-inkt-950 text-white shadow-lg">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_100%,rgba(220,38,38,0.28),transparent_65%)]"
      />

      <div className="relative grid h-full grid-cols-1 gap-8 p-5 md:grid-cols-[0.9fr_1.1fr] md:items-center md:p-8">
        {/* De plaats. min-w-0: anders krimpt een rasterkind niet onder zijn
            inhoud en duwt een lange ploegnaam het blok over de schermrand. */}
        <div className="min-w-0">
          <p className="opschrift text-primary-400">
            <Trophy className="h-4 w-4" />
            Klassement
          </p>
          <p className="mt-2 text-sm text-white/55">{reeks}</p>

          <div className="mt-5 flex items-end gap-3">
            <span className="font-display text-7xl font-extrabold leading-none tracking-tight md:text-8xl">
              {wij.plaats}
            </span>
            <span className="mb-2 text-lg font-semibold leading-tight text-white/80">
              {rangwoord(wij.plaats).replace(String(wij.plaats), "")}
              <span className="block text-sm font-normal text-white/50">
                {gedeeld ? "gedeelde plaats" : "plaats"} van {aantal}
              </span>
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
            {[
              { label: "Punten", waarde: wij.punten },
              { label: "Gespeeld", waarde: wij.gespeeld },
              {
                label: "Doelsaldo",
                waarde: wij.doelsaldo > 0 ? `+${wij.doelsaldo}` : wij.doelsaldo,
              },
            ].map((c) => (
              <div key={c.label}>
                <dd className="font-display text-2xl font-bold tabular-nums">{c.waarde}</dd>
                <dt className="mt-0.5 text-[0.6875rem] uppercase tracking-wider text-white/45">{c.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* De buren in het klassement */}
        <div className="min-w-0">
          <ol className="overflow-hidden rounded-xl border border-white/10">
            {venster.map((r) => (
              <li
                key={r.teamId}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm ${
                  r.wij
                    ? "bg-primary text-white"
                    : "border-t border-white/5 bg-white/[0.03] text-white/70 first:border-t-0"
                }`}
              >
                <span className={`w-6 shrink-0 text-center font-bold tabular-nums ${r.wij ? "" : "text-white/45"}`}>
                  {r.plaats}
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                  {r.logo ? (
                    // Logo's van de bond, van uiteenlopende afmetingen; een gewone
                    // img houdt ze gewoon binnen hun rondje.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.logo} alt="" loading="lazy" className="h-6 w-6 object-contain" />
                  ) : null}
                </span>
                <span className={`min-w-0 flex-1 truncate ${r.wij ? "font-semibold" : ""}`}>{r.naam}</span>
                <span className={`shrink-0 text-xs tabular-nums ${r.wij ? "text-white/85" : "text-white/40"}`}>
                  {r.gespeeld} g
                </span>
                <span className="w-9 shrink-0 text-right font-bold tabular-nums">{r.punten}</span>
              </li>
            ))}
          </ol>

          <div className="mt-3 flex items-center justify-between text-xs text-white/40">
            <span>Bron: Voetbal Vlaanderen</span>
            <a
              href={klassement.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 font-semibold text-white/75 transition-colors hover:text-white"
            >
              Volledig klassement op RBFA
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
