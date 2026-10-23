"use client";

import { useState } from "react";
import { Loader2, Split, X } from "lucide-react";
import { EVENEMENT, GERECHTEN, bedragVan, euro } from "@/lib/mosselfeest/kaart";
import { nummerTekst, type Inschrijving } from "@/lib/mosselfeest/totalen";
import { volledigeNaam } from "@/lib/mosselfeest/nakijken";

/**
 * Een kaart splitsen: wie van een kaart later of op een andere dag komt,
 * krijgt een eigen kaart met hetzelfde nummer en een letter erachter (409B).
 * Je kiest hier welke gerechten meegaan en naar welke zitting.
 */
export function Splitsen({
  inschrijving,
  volgendeLetter,
  onBevestig,
  onSluiten,
  fout,
}: {
  inschrijving: Inschrijving;
  volgendeLetter: string;
  onBevestig: (aantallen: Record<string, number>, zitting: string) => Promise<void>;
  onSluiten: () => void;
  fout: string;
}) {
  const [mee, setMee] = useState<Record<string, number>>({});
  const [zitting, setZitting] = useState(inschrijving.zitting);
  const [bezig, setBezig] = useState(false);

  const opKaart = GERECHTEN.filter((g) => (inschrijving.aantallen[g.id] ?? 0) > 0);
  const nieuwNummer = `${inschrijving.kaartnummer}${volgendeLetter}`;
  const iets = Object.values(mee).some((a) => a > 0);

  function zet(id: string, aantal: number) {
    const max = inschrijving.aantallen[id] ?? 0;
    setMee((vorig) => ({ ...vorig, [id]: Math.max(0, Math.min(max, aantal)) }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onSluiten}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-blad"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-inkt-900">
              Kaart {nummerTekst(inschrijving)} splitsen
            </h2>
            <p className="text-sm text-slate-500">{volledigeNaam(inschrijving)}</p>
          </div>
          <button type="button" onClick={onSluiten} aria-label="Sluiten">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Kies wat er naar de nieuwe kaart <strong>{nieuwNummer}</strong> gaat. Dat gaat van kaart{" "}
          {nummerTekst(inschrijving)} af.
        </p>

        <table className="mt-3 w-full text-base">
          <tbody>
            {opKaart.map((g) => {
              const max = inschrijving.aantallen[g.id] ?? 0;
              const aantal = mee[g.id] ?? 0;
              return (
                <tr key={g.id} className="border-b border-zand-100">
                  <td className="py-2 text-slate-700">
                    {g.naam}
                    <span className="block text-xs text-slate-400">{max} op de kaart</span>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => zet(g.id, aantal - 1)}
                        className="h-10 w-10 rounded-lg border-2 border-zand-300 text-lg font-bold text-slate-700"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-display text-lg font-bold">{aantal}</span>
                      <button
                        type="button"
                        onClick={() => zet(g.id, aantal + 1)}
                        className="h-10 w-10 rounded-lg border-2 border-zand-300 text-lg font-bold text-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Zitting van kaart {nieuwNummer}
          <select
            value={zitting}
            onChange={(e) => setZitting(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zand-300 px-3 py-2.5 text-base outline-none focus:border-primary"
          >
            {EVENEMENT.zittingen.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </label>

        {iets && (
          <p className="mt-3 text-sm text-slate-600">
            Kaart {nieuwNummer}: {euro(bedragVan(mee))} euro. Wat er al betaald is, blijft eerst
            bij kaart {nummerTekst(inschrijving)}; wat daar te veel is, gaat mee naar {nieuwNummer}.
          </p>
        )}
        {fout && <p className="mt-3 rounded-xl bg-primary-50 p-3 text-sm text-primary-900">{fout}</p>}

        <button
          type="button"
          disabled={!iets || bezig}
          onClick={async () => {
            setBezig(true);
            await onBevestig(mee, zitting);
            setBezig(false);
          }}
          className="btn-primary mt-5 w-full justify-center gap-2 disabled:opacity-50"
        >
          {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : <Split className="h-4 w-4" />}
          Maak kaart {nieuwNummer}
        </button>
      </div>
    </div>
  );
}
