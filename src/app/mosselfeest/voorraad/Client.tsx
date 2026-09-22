"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, Loader2, LockKeyhole, RefreshCw } from "lucide-react";
import { GROEPEN, gerechtenVan } from "@/lib/mosselfeest/kaart";

/**
 * Voorzien tegenover besteld, per dag.
 *
 * Dit is het blad "LeftOvers" uit het Excel-bestand van het bestuur, maar dan
 * met de bestelde aantallen er al naast. Je vult in hoeveel er gekocht of
 * klaargemaakt is, en je ziet meteen hoeveel er die avond nog aan de deur
 * verkocht kan worden. Staat er een negatief getal, dan is er meer besteld dan
 * voorzien en moet er bijgekocht worden.
 */

const BEWAARSLEUTEL = "kws-mosselfeest-wachtwoord";
const DAGEN = [
  { id: "vrijdag", label: "Vrijdag 23 oktober" },
  { id: "zaterdag", label: "Zaterdag 24 oktober" },
] as const;

type PerDag = Record<string, Record<string, number>>;

export default function VoorraadClient() {
  const [wachtwoord, setWachtwoord] = useState("");
  const [ingevoerd, setIngevoerd] = useState<string | null>(null);
  const [voorzien, setVoorzien] = useState<PerDag>({ vrijdag: {}, zaterdag: {} });
  const [besteld, setBesteld] = useState<PerDag>({ vrijdag: {}, zaterdag: {} });
  const [door, setDoor] = useState("");
  const [bezig, setBezig] = useState(false);
  const [bewaren, setBewaren] = useState(false);
  const [fout, setFout] = useState("");
  const [gelukt, setGelukt] = useState("");

  const haal = useCallback(async (geheim: string) => {
    setBezig(true);
    setFout("");
    try {
      const antwoord = await fetch("/api/mosselfeest/voorraad", {
        headers: { authorization: `Bearer ${geheim}` },
        cache: "no-store",
      });
      if (antwoord.status === 401) {
        setFout("Dat wachtwoord klopt niet.");
        setIngevoerd(null);
        return;
      }
      if (!antwoord.ok) {
        setFout("De voorraad kon niet opgehaald worden.");
        return;
      }
      const gegevens = (await antwoord.json()) as {
        voorraad: { voorzien: PerDag };
        besteld: PerDag;
      };
      setVoorzien({
        vrijdag: gegevens.voorraad?.voorzien?.vrijdag ?? {},
        zaterdag: gegevens.voorraad?.voorzien?.zaterdag ?? {},
      });
      setBesteld(gegevens.besteld ?? { vrijdag: {}, zaterdag: {} });
      setIngevoerd(geheim);
      try {
        sessionStorage.setItem(BEWAARSLEUTEL, geheim);
      } catch {
        // Geen opslag beschikbaar, niet erg.
      }
    } catch {
      setFout("De voorraad kon niet opgehaald worden.");
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

  async function bewaar() {
    if (!ingevoerd) return;
    setBewaren(true);
    setFout("");
    setGelukt("");
    try {
      const antwoord = await fetch("/api/mosselfeest/voorraad", {
        method: "POST",
        headers: { authorization: `Bearer ${ingevoerd}`, "content-type": "application/json" },
        body: JSON.stringify({ voorzien, door: door || undefined }),
      });
      if (!antwoord.ok) {
        setFout("Bewaren is niet gelukt.");
        return;
      }
      setGelukt("Bewaard.");
    } catch {
      setFout("Bewaren is niet gelukt.");
    } finally {
      setBewaren(false);
    }
  }

  function zet(dag: string, gerechtId: string, waarde: number) {
    setGelukt("");
    setVoorzien((vorig) => {
      const dagWaarden = { ...(vorig[dag] ?? {}) };
      if (waarde > 0) dagWaarden[gerechtId] = waarde;
      else delete dagWaarden[gerechtId];
      return { ...vorig, [dag]: dagWaarden };
    });
  }

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
            Voorraad mosselfeest
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
    <main className="min-h-screen bg-zand-50">
      <header className="bg-inkt-900 text-white">
        <div className="container-custom flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="font-display text-base font-bold leading-tight">Voorraad per dag</p>
            <p className="text-xs text-white/70">Voorzien tegenover besteld</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/mosselfeest/kassa"
              className="rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10"
            >
              Avondscherm
            </a>
            <a
              href="/mosselfeest/overzicht"
              className="rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10"
            >
              Overzicht
            </a>
            <button
              type="button"
              onClick={() => haal(ingevoerd)}
              disabled={bezig}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10"
            >
              {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Verversen
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom max-w-5xl space-y-5 py-6">
        <p className="text-sm text-slate-600">
          Vul in hoeveel er van elk gerecht voorzien is. Wat er besteld is komt uit de
          inschrijvingen, dus dat hoef je niet bij te houden. Het verschil is wat er die dag nog
          aan de deur verkocht kan worden.
        </p>

        {DAGEN.map((dag) => (
          <section
            key={dag.id}
            className="rounded-2xl border border-zand-200/70 bg-white p-5 shadow-blad sm:p-7"
          >
            <h2 className="mb-4 font-display text-lg font-bold text-inkt-900">{dag.label}</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-112 border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zand-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2">Gerecht</th>
                    <th className="w-28 py-2 text-right">Voorzien</th>
                    <th className="w-24 py-2 text-right">Besteld</th>
                    <th className="w-28 py-2 text-right">Nog vrij</th>
                  </tr>
                </thead>
                <tbody>
                  {GROEPEN.map((groep) => {
                    const gerechten = gerechtenVan(groep.id);
                    if (gerechten.length === 0) return null;
                    return (
                      <tr key={groep.id} className="align-top">
                        <td colSpan={4} className="pt-3">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {groep.titel}
                          </p>
                          <table className="w-full border-collapse">
                            <tbody>
                              {gerechten.map((g) => {
                                const isVoorzien = voorzien[dag.id]?.[g.id] ?? 0;
                                const isBesteld = besteld[dag.id]?.[g.id] ?? 0;
                                const rest = isVoorzien - isBesteld;
                                return (
                                  <tr key={g.id} className="border-b border-zand-100">
                                    <td className="py-1.5 text-slate-700">{g.naam}</td>
                                    <td className="w-28 py-1.5 text-right">
                                      <input
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        value={isVoorzien === 0 ? "" : isVoorzien}
                                        placeholder="0"
                                        onChange={(e) => {
                                          const getal = Number.parseInt(e.target.value, 10);
                                          zet(dag.id, g.id, Number.isFinite(getal) ? Math.max(0, getal) : 0);
                                        }}
                                        aria-label={`Voorzien ${g.naam} op ${dag.label}`}
                                        className="h-9 w-20 rounded-lg border border-zand-300 text-center outline-none focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                                      />
                                    </td>
                                    <td className="w-24 py-1.5 text-right font-medium text-slate-700">
                                      {isBesteld}
                                    </td>
                                    <td
                                      className={
                                        "w-28 py-1.5 text-right font-bold " +
                                        (isVoorzien === 0
                                          ? "text-slate-300"
                                          : rest < 0
                                            ? "text-primary"
                                            : "text-inkt-900")
                                      }
                                    >
                                      {isVoorzien === 0 ? "-" : rest}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {fout && (
          <p className="flex items-center gap-2 rounded-xl bg-primary-50 p-3 text-sm text-primary-900">
            <AlertCircle className="h-4 w-4" />
            {fout}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pb-10">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Ingevuld door
            <input
              value={door}
              onChange={(e) => setDoor(e.target.value)}
              placeholder="je naam"
              className="rounded-xl border border-zand-300 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <div className="flex items-center gap-3">
            {gelukt && (
              <span className="flex items-center gap-1 text-sm text-green-700">
                <Check className="h-4 w-4" />
                {gelukt}
              </span>
            )}
            <button
              type="button"
              onClick={bewaar}
              disabled={bewaren}
              className="btn-primary justify-center disabled:opacity-60"
            >
              {bewaren ? <Loader2 className="h-4 w-4 animate-spin" /> : "Bewaren"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
