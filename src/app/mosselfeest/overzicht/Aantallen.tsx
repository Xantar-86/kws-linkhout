"use client";

import { GROEPEN, euro, gerechtenVan } from "@/lib/mosselfeest/kaart";

/**
 * Het rooster met een vakje per gerecht.
 *
 * Wordt op drie plaatsen gebruikt: bij het intypen van een afgegeven kaart, bij
 * het wijzigen van een bestaande inschrijving, en op het avondscherm wanneer er
 * aan de kassa nog iets bij besteld wordt. Eén rooster dus, en niet drie keer
 * hetzelfde met kleine verschillen.
 */
export function Aantallen({
  aantallen,
  onChange,
  max = 40,
  compact = false,
}: {
  aantallen: Record<string, number>;
  onChange: (nieuw: Record<string, number>) => void;
  /** Hoogste aantal per gerecht. Bij een stapel kaarten ligt dat hoger. */
  max?: number;
  /** Kleinere vakjes, voor in een venster. */
  compact?: boolean;
}) {
  function zet(id: string, waarde: number) {
    const volgend = { ...aantallen };
    if (waarde > 0) volgend[id] = Math.min(waarde, max);
    else delete volgend[id];
    onChange(volgend);
  }

  return (
    <div className={"grid gap-x-8 " + (compact ? "gap-y-3 sm:grid-cols-2" : "gap-y-4 sm:grid-cols-2")}>
      {GROEPEN.map((groep) => {
        const gerechten = gerechtenVan(groep.id);
        if (gerechten.length === 0) return null;
        return (
          <div key={groep.id}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {groep.titel}
            </p>
            <div className="divide-y divide-zand-100">
              {gerechten.map((g) => (
                <div key={g.id} className="flex items-center justify-between gap-3 py-1.5">
                  <label htmlFor={`aantal-${g.id}`} className="text-sm text-slate-700">
                    {g.naam}
                    <span className="ml-1 text-xs text-slate-400">{euro(g.prijs)}</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Eén ${g.naam} minder`}
                      onClick={() => zet(g.id, (aantallen[g.id] ?? 0) - 1)}
                      disabled={(aantallen[g.id] ?? 0) <= 0}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zand-300 text-slate-500 transition hover:border-slate-400 disabled:opacity-30"
                    >
                      &minus;
                    </button>
                    <input
                      id={`aantal-${g.id}`}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={max}
                      value={aantallen[g.id] ?? ""}
                      placeholder="0"
                      onChange={(e) => {
                        const getal = Number.parseInt(e.target.value, 10);
                        zet(g.id, Number.isFinite(getal) ? Math.max(0, getal) : 0);
                      }}
                      className={
                        "h-9 w-14 rounded-lg border text-center text-sm outline-none transition " +
                        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none " +
                        ((aantallen[g.id] ?? 0) > 0
                          ? "border-primary/40 font-semibold text-inkt-900"
                          : "border-zand-300 text-slate-400")
                      }
                    />
                    <button
                      type="button"
                      aria-label={`Eén ${g.naam} meer`}
                      onClick={() => zet(g.id, (aantallen[g.id] ?? 0) + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zand-300 text-slate-500 transition hover:border-slate-400"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
