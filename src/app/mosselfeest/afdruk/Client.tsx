"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, LockKeyhole, Printer } from "lucide-react";
import {
  EVENEMENT,
  GERECHTEN,
  GROEPEN,
  euro,
  gerechtenVan,
  isAfhalen,
} from "@/lib/mosselfeest/kaart";
import { telOp, type Inschrijving } from "@/lib/mosselfeest/totalen";
import { volledigeNaam } from "@/lib/mosselfeest/nakijken";

/**
 * Afdrukken voor de keuken.
 *
 * Twee soorten, want ze dienen iets anders:
 *
 *  - Bonnetjes: één kadertje per inschrijving, zoals ze de online
 *    inschrijvingen vroeger afdrukten om mee naar de keuken te geven. Vier per
 *    blad, met een kader om uit te knippen.
 *  - Keukenlijst: per zitting de totalen per gerecht, met daaronder de namen.
 *    Dat is het blad dat aan de muur hangt.
 *
 * De keuzes bovenaan verdwijnen bij het afdrukken; enkel het blad zelf komt op
 * papier. Daarvoor staat overal de print-variant van Tailwind.
 */

const BEWAARSLEUTEL = "kws-mosselfeest-wachtwoord";

type Soort = "bonnen" | "keuken";

export default function AfdrukClient() {
  const [wachtwoord, setWachtwoord] = useState("");
  const [ingevoerd, setIngevoerd] = useState<string | null>(null);
  const [inschrijvingen, setInschrijvingen] = useState<Inschrijving[] | null>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  const [soort, setSoort] = useState<Soort>("bonnen");
  const [welkeZitting, setWelkeZitting] = useState("alle");
  const [enkelOnbetaald, setEnkelOnbetaald] = useState(false);

  const haal = useCallback(async (geheim: string) => {
    setBezig(true);
    setFout("");
    try {
      const antwoord = await fetch("/api/mosselfeest/beheer", {
        headers: { authorization: `Bearer ${geheim}` },
        cache: "no-store",
      });
      if (antwoord.status === 401) {
        setFout("Dat wachtwoord klopt niet.");
        setIngevoerd(null);
        return;
      }
      if (!antwoord.ok) {
        setFout("De lijst kon niet opgehaald worden.");
        return;
      }
      const gegevens = (await antwoord.json()) as { inschrijvingen: Inschrijving[] };
      setInschrijvingen(gegevens.inschrijvingen ?? []);
      setIngevoerd(geheim);
      try {
        sessionStorage.setItem(BEWAARSLEUTEL, geheim);
      } catch {
        // Geen opslag: dan vraagt de pagina het de volgende keer opnieuw.
      }
    } catch {
      setFout("De lijst kon niet opgehaald worden.");
    } finally {
      setBezig(false);
    }
  }, []);

  useEffect(() => {
    let bewaard: string | null = null;
    try {
      bewaard = sessionStorage.getItem(BEWAARSLEUTEL);
    } catch {
      bewaard = null;
    }
    if (bewaard) haal(bewaard);
  }, [haal]);

  const gekozen = useMemo(() => {
    const alles = inschrijvingen ?? [];
    return alles
      .filter((i) => (welkeZitting === "alle" ? true : (i.zitting || "zonder") === welkeZitting))
      .filter((i) => (enkelOnbetaald ? !i.betaald : true))
      .sort((a, b) => (a.kaartnummer ?? Number.MAX_SAFE_INTEGER) - (b.kaartnummer ?? Number.MAX_SAFE_INTEGER));
  }, [inschrijvingen, welkeZitting, enkelOnbetaald]);

  if (!ingevoerd) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zand-50 px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            haal(wachtwoord);
          }}
          className="w-full max-w-sm rounded-2xl border border-zand-200/70 bg-white p-7 shadow-blad"
        >
          <LockKeyhole className="mx-auto h-9 w-9 text-slate-400" />
          <h1 className="mt-4 text-center font-display text-xl font-bold text-inkt-900">
            Afdrukken mosselfeest
          </h1>
          <input
            type="password"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            placeholder="Wachtwoord"
            autoFocus
            className="mt-5 w-full rounded-xl border border-zand-300 px-3.5 py-2.5 text-base outline-none focus:border-primary"
          />
          {fout && <p className="mt-2 text-sm text-primary">{fout}</p>}
          <button type="submit" disabled={bezig} className="btn-primary mt-4 w-full justify-center">
            {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : "Openen"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zand-50 print:bg-white">
      {/* De keuzebalk, enkel op het scherm. */}
      <div className="border-b border-zand-200 bg-white print:hidden">
        <div className="container-custom flex flex-wrap items-end gap-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Wat</p>
            <div className="mt-1 flex gap-2">
              {(
                [
                  { id: "bonnen" as const, label: "Bonnetjes per inschrijving" },
                  { id: "keuken" as const, label: "Keukenlijst per zitting" },
                ]
              ).map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setSoort(k.id)}
                  className={
                    "rounded-xl border px-3 py-2 text-sm transition " +
                    (soort === k.id
                      ? "border-primary bg-primary text-white"
                      : "border-zand-300 bg-white text-slate-700 hover:border-slate-400")
                  }
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-wide text-slate-500">Zitting</span>
            <select
              value={welkeZitting}
              onChange={(e) => setWelkeZitting(e.target.value)}
              className="mt-1 block rounded-xl border border-zand-300 px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="alle">Alle zittingen</option>
              {EVENEMENT.zittingen.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.label}
                </option>
              ))}
              <option value="zonder">Zonder zitting</option>
            </select>
          </label>

          <label className="flex items-center gap-2 pb-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={enkelOnbetaald}
              onChange={(e) => setEnkelOnbetaald(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Enkel onbetaalde
          </label>

          <div className="ml-auto flex items-center gap-3 pb-1">
            <span className="text-sm text-slate-500">{gekozen.length} inschrijvingen</span>
            <button type="button" onClick={() => window.print()} className="btn-primary">
              <Printer className="mr-2 h-4 w-4" />
              Afdrukken
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-6 print:px-0 print:py-0">
        {soort === "bonnen" ? (
          <Bonnen lijst={gekozen} />
        ) : (
          <Keukenlijst lijst={gekozen} welkeZitting={welkeZitting} />
        )}
      </div>
    </main>
  );
}

/** Eén kadertje per inschrijving, vier per blad. */
function Bonnen({ lijst }: { lijst: Inschrijving[] }) {
  if (lijst.length === 0) {
    return <p className="text-sm text-slate-500">Geen inschrijvingen die hieraan voldoen.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 print:gap-2">
      {lijst.map((i) => {
        const zitting = EVENEMENT.zittingen.find((z) => z.id === i.zitting);
        return (
          <div
            key={i.kenmerk}
            className="break-inside-avoid rounded-xl border-2 border-dashed border-slate-400 bg-white p-4 print:rounded-none"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-2">
              <div>
                <p className="font-display text-2xl font-bold leading-none text-inkt-900">
                  {i.kaartnummer ?? "-"}
                </p>
                <p className="mt-1 text-sm font-semibold text-inkt-900">{volledigeNaam(i)}</p>
              </div>
              <div className="text-right text-xs text-slate-600">
                <p className="font-semibold">{zitting?.kort ?? "zonder zitting"}</p>
                {zitting && isAfhalen(zitting.id) && (
                  <p className="font-bold uppercase text-slate-900">Afhalen</p>
                )}
                <p className={i.betaald ? "text-green-700" : "font-bold text-primary"}>
                  {i.betaald ? "betaald" : "nog te betalen"}
                </p>
              </div>
            </div>

            <table className="mt-2 w-full text-sm">
              <tbody>
                {GERECHTEN.filter((g) => (i.aantallen[g.id] ?? 0) > 0).map((g) => (
                  <tr key={g.id}>
                    <td className="w-8 py-0.5 font-bold text-inkt-900">{i.aantallen[g.id]}</td>
                    <td className="py-0.5 text-slate-700">{g.naam}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {i.opmerking && (
              <p className="mt-2 border-t border-slate-200 pt-1 text-xs italic text-slate-600">
                {i.opmerking}
              </p>
            )}
            <p className="mt-2 text-right text-sm font-bold text-inkt-900">
              {euro(i.bedrag)} euro
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** Per zitting de totalen per gerecht, met de namen eronder. */
function Keukenlijst({ lijst, welkeZitting }: { lijst: Inschrijving[]; welkeZitting: string }) {
  const zittingen =
    welkeZitting === "alle"
      ? [...EVENEMENT.zittingen.map((z) => z.id), "zonder"]
      : [welkeZitting];

  return (
    <div className="space-y-8">
      {zittingen.map((zittingId) => {
        const vanZitting = lijst.filter((i) => (i.zitting || "zonder") === zittingId);
        if (vanZitting.length === 0) return null;
        const totalen = telOp(vanZitting);
        const zitting = EVENEMENT.zittingen.find((z) => z.id === zittingId);

        return (
          <section key={zittingId} className="break-inside-avoid">
            <div className="flex items-baseline justify-between border-b-2 border-inkt-900 pb-1">
              <h2 className="font-display text-xl font-bold text-inkt-900">
                {zitting?.label ?? "Zonder zitting"}
              </h2>
              <p className="text-sm text-slate-600">
                {vanZitting.length} inschrijvingen, {totalen.plaatsen} plaatsen
              </p>
            </div>

            <div className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-3">
              {GROEPEN.map((groep) => {
                const gerechten = gerechtenVan(groep.id).filter(
                  (g) => (totalen.perGerecht[g.id] ?? 0) > 0,
                );
                if (gerechten.length === 0) return null;
                return (
                  <div key={groep.id}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {groep.titel}
                    </p>
                    {gerechten.map((g) => (
                      <p key={g.id} className="flex justify-between text-sm">
                        <span className="text-slate-700">{g.naam}</span>
                        <span className="font-bold text-inkt-900">{totalen.perGerecht[g.id]}</span>
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>

            <table className="mt-4 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-300 text-left text-xs uppercase text-slate-500">
                  <th className="w-16 py-1">Nr.</th>
                  <th className="py-1">Naam</th>
                  <th className="py-1">Bestelling</th>
                  <th className="w-20 py-1 text-right">Bedrag</th>
                  <th className="w-20 py-1">Betaald</th>
                </tr>
              </thead>
              <tbody>
                {vanZitting.map((i) => (
                  <tr key={i.kenmerk} className="border-b border-slate-100 align-top">
                    <td className="py-1 font-bold">{i.kaartnummer ?? "-"}</td>
                    <td className="py-1">{volledigeNaam(i)}</td>
                    <td className="py-1 text-slate-700">
                      {GERECHTEN.filter((g) => (i.aantallen[g.id] ?? 0) > 0)
                        .map((g) => `${i.aantallen[g.id]} ${g.kort ?? g.naam}`)
                        .join(", ")}
                    </td>
                    <td className="py-1 text-right">{euro(i.bedrag)}</td>
                    <td className={"py-1 " + (i.betaald ? "text-green-700" : "font-bold text-primary")}>
                      {i.betaald ? "ja" : "nee"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
    </div>
  );
}
