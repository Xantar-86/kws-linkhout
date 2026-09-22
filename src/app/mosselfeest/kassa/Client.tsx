"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Loader2,
  LockKeyhole,
  Pencil,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { EVENEMENT, GERECHTEN, euro, isAfhalen } from "@/lib/mosselfeest/kaart";
import { telOp, type Inschrijving } from "@/lib/mosselfeest/totalen";
import { volledigeNaam } from "@/lib/mosselfeest/nakijken";
import { Bewerken } from "../overzicht/Bewerken";

/**
 * Het avondscherm, voor aan de kassa.
 *
 * Gemaakt voor een laptop: zoeken links, de gekozen inschrijving groot rechts.
 * Je typt een kaartnummer of een naam, drukt op Enter, en ziet meteen wat die
 * mensen besteld hebben, wat het kost en of er al betaald is. Eén grote knop
 * om af te vinken, en een knop om er nog iets bij te zetten.
 *
 * Alles staat in twee kolommen die op een tablet onder elkaar schuiven, en de
 * knoppen zijn groot genoeg om staand aan een toog te bedienen.
 *
 * Net als op de overzichtspagina krijgt wat hier gewijzigd wordt voorrang op
 * wat de opslag terugmeldt: die loopt na een schrijfactie soms enkele seconden
 * achter, en op een drukke avond wil je geen regel zien terugspringen.
 */

const BEWAARSLEUTEL = "kws-mosselfeest-wachtwoord";
const VOORRANG_MS = 90_000;

interface Wijziging {
  betaald?: boolean;
  vervanging?: Inschrijving;
  tijd: number;
}

export default function KassaClient() {
  const [wachtwoord, setWachtwoord] = useState("");
  const [ingevoerd, setIngevoerd] = useState<string | null>(null);
  const [inschrijvingen, setInschrijvingen] = useState<Inschrijving[] | null>(null);
  const wijzigingen = useRef<Map<string, Wijziging>>(new Map());
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [zoek, setZoek] = useState("");
  const [gekozenKenmerk, setGekozenKenmerk] = useState<string | null>(null);
  const [bewerkt, setBewerkt] = useState<Inschrijving | null>(null);
  const zoekveld = useRef<HTMLInputElement | null>(null);

  const metEigenWijzigingen = useCallback((lijst: Inschrijving[]): Inschrijving[] => {
    const nu = Date.now();
    for (const [kenmerk, w] of wijzigingen.current) {
      if (nu - w.tijd > VOORRANG_MS) wijzigingen.current.delete(kenmerk);
    }
    return lijst.map((i) => {
      const w = wijzigingen.current.get(i.kenmerk);
      if (!w) return i;
      const basis = w.vervanging ?? i;
      if (w.betaald === undefined) return basis;
      return {
        ...basis,
        betaald: w.betaald,
        betaaldOp: w.betaald ? (basis.betaaldOp ?? new Date(w.tijd).toISOString()) : undefined,
      };
    });
  }, []);

  const haal = useCallback(
    async (geheim: string) => {
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
        setInschrijvingen(metEigenWijzigingen(gegevens.inschrijvingen ?? []));
        setIngevoerd(geheim);
        try {
          sessionStorage.setItem(BEWAARSLEUTEL, geheim);
        } catch {
          // Geen opslag beschikbaar, dan vraagt de pagina het straks opnieuw.
        }
      } catch {
        setFout("De lijst kon niet opgehaald worden.");
      } finally {
        setBezig(false);
      }
    },
    [metEigenWijzigingen],
  );

  useEffect(() => {
    let bewaard: string | null = null;
    try {
      bewaard = sessionStorage.getItem(BEWAARSLEUTEL);
    } catch {
      bewaard = null;
    }
    if (bewaard) haal(bewaard);
  }, [haal]);

  const totalen = useMemo(
    () => (inschrijvingen ? telOp(inschrijvingen) : undefined),
    [inschrijvingen],
  );

  const gevonden = useMemo(() => {
    const alles = inschrijvingen ?? [];
    const naald = zoek.trim().toLowerCase();
    if (!naald) {
      // Zonder zoekterm de laatst gewijzigde bovenaan: dat is meestal waar je
      // mee bezig bent.
      return [...alles]
        .sort((a, b) => (b.gewijzigdOp ?? b.aangemeld).localeCompare(a.gewijzigdOp ?? a.aangemeld))
        .slice(0, 12);
    }
    return alles
      .filter(
        (i) =>
          String(i.kaartnummer ?? "").includes(naald) ||
          volledigeNaam(i).toLowerCase().includes(naald),
      )
      .sort((a, b) => (a.kaartnummer ?? 0) - (b.kaartnummer ?? 0))
      .slice(0, 40);
  }, [inschrijvingen, zoek]);

  const gekozen = useMemo(
    () => (inschrijvingen ?? []).find((i) => i.kenmerk === gekozenKenmerk) ?? null,
    [inschrijvingen, gekozenKenmerk],
  );

  function onthoud(kenmerk: string, wijziging: Omit<Wijziging, "tijd">) {
    const vorige = wijzigingen.current.get(kenmerk);
    wijzigingen.current.set(kenmerk, { ...vorige, ...wijziging, tijd: Date.now() });
    setInschrijvingen((vorig) => (vorig ? metEigenWijzigingen(vorig) : vorig));
  }

  async function zetBetaald(inschrijving: Inschrijving, betaald: boolean) {
    if (!ingevoerd) return;
    setFout("");
    const antwoord = await fetch("/api/mosselfeest/beheer", {
      method: "POST",
      headers: { authorization: `Bearer ${ingevoerd}`, "content-type": "application/json" },
      body: JSON.stringify({ actie: "betaald", kenmerk: inschrijving.kenmerk, betaald }),
    });
    if (!antwoord.ok) {
      setFout("Dat afvinken is niet gelukt.");
      return;
    }
    onthoud(inschrijving.kenmerk, { betaald });
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
            Avondscherm mosselfeest
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
            <p className="font-display text-base font-bold leading-tight">Avondscherm</p>
            <p className="text-xs text-white/70">
              {totalen
                ? `${totalen.inschrijvingen} inschrijvingen, ${euro(totalen.bedragOpen)} euro nog te ontvangen`
                : "bezig met laden"}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/mosselfeest/voorraad"
              className="rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10"
            >
              Voorraad
            </a>
            <a
              href="/mosselfeest/afdruk"
              className="rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10"
            >
              Afdrukken
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
              {bezig ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Verversen
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom grid gap-5 py-5 lg:grid-cols-[minmax(0,22rem)_1fr]">
        {/* Zoeken en de lijst met treffers. */}
        <section>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              ref={zoekveld}
              value={zoek}
              onChange={(e) => setZoek(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && gevonden.length > 0) {
                  setGekozenKenmerk(gevonden[0].kenmerk);
                }
                if (e.key === "Escape") {
                  setZoek("");
                  setGekozenKenmerk(null);
                }
              }}
              autoFocus
              placeholder="Kaartnummer of naam"
              className="w-full rounded-2xl border-2 border-zand-300 bg-white py-4 pl-11 pr-4 text-lg outline-none transition focus:border-primary"
            />
            {zoek && (
              <button
                type="button"
                onClick={() => {
                  setZoek("");
                  zoekveld.current?.focus();
                }}
                aria-label="Zoekveld leegmaken"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {fout && <p className="mt-3 rounded-xl bg-primary-50 p-3 text-sm text-primary-900">{fout}</p>}

          <div className="mt-3 space-y-2">
            {gevonden.length === 0 && (
              <p className="rounded-xl bg-white p-4 text-sm text-slate-500">
                Niets gevonden met &ldquo;{zoek}&rdquo;.
              </p>
            )}
            {gevonden.map((i) => {
              const actief = i.kenmerk === gekozenKenmerk;
              return (
                <button
                  key={i.kenmerk}
                  type="button"
                  onClick={() => setGekozenKenmerk(i.kenmerk)}
                  className={
                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition " +
                    (actief
                      ? "border-primary bg-white shadow-blad"
                      : "border-zand-200 bg-white/70 hover:border-slate-300")
                  }
                >
                  <span className="w-12 shrink-0 font-display text-lg font-bold text-inkt-900">
                    {i.kaartnummer ?? "-"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-inkt-900">
                      {volledigeNaam(i)}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {EVENEMENT.zittingen.find((z) => z.id === i.zitting)?.kort ?? "zonder zitting"}
                      {" · "}
                      {euro(i.bedrag)} euro
                    </span>
                  </span>
                  <span
                    className={
                      "shrink-0 rounded-lg px-2 py-1 text-xs font-semibold " +
                      (i.betaald ? "bg-green-100 text-green-800" : "bg-primary-100 text-primary-800")
                    }
                  >
                    {i.betaald ? "betaald" : "open"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* De gekozen inschrijving, groot. */}
        <section>
          {!gekozen ? (
            <div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed border-zand-300 bg-white/60 p-10 text-center">
              <p className="max-w-sm text-slate-500">
                Typ een kaartnummer of een naam en druk op Enter. De bestelling en het bedrag komen
                hier te staan.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-zand-200/70 bg-white p-5 shadow-blad sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zand-200 pb-4">
                <div>
                  <p className="font-display text-5xl font-bold leading-none text-inkt-900">
                    {gekozen.kaartnummer ?? "-"}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-inkt-900">
                    {volledigeNaam(gekozen)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {EVENEMENT.zittingen.find((z) => z.id === gekozen.zitting)?.label ??
                      "zonder zitting"}
                    {gekozen.zitting && isAfhalen(gekozen.zitting) && " · afhalen"}
                    {gekozen.telefoon && ` · ${gekozen.telefoon}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Te betalen</p>
                  <p className="font-display text-4xl font-bold text-inkt-900">
                    {euro(gekozen.bedrag)}
                  </p>
                </div>
              </div>

              <table className="mt-4 w-full text-base">
                <tbody>
                  {GERECHTEN.filter((g) => (gekozen.aantallen[g.id] ?? 0) > 0).map((g) => (
                    <tr key={g.id} className="border-b border-zand-100">
                      <td className="w-12 py-2 font-display text-lg font-bold text-inkt-900">
                        {gekozen.aantallen[g.id]}
                      </td>
                      <td className="py-2 text-slate-700">{g.naam}</td>
                      <td className="py-2 text-right text-slate-500">
                        {euro(g.prijs * (gekozen.aantallen[g.id] ?? 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {gekozen.opmerking && (
                <p className="mt-3 rounded-xl bg-zand-50 p-3 text-sm italic text-slate-600">
                  {gekozen.opmerking}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => zetBetaald(gekozen, !gekozen.betaald)}
                  className={
                    "flex flex-1 items-center justify-center gap-3 rounded-2xl px-6 py-5 text-lg font-bold transition " +
                    (gekozen.betaald
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-primary text-white hover:bg-primary-700")
                  }
                >
                  {gekozen.betaald ? (
                    <>
                      <Check className="h-6 w-6" />
                      Betaald, klik om terug te zetten
                    </>
                  ) : (
                    <>
                      <Check className="h-6 w-6" />
                      Zet op betaald
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setBewerkt(gekozen)}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-zand-300 px-6 py-5 text-base font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  <Pencil className="h-5 w-5" />
                  Iets bijzetten of wijzigen
                </button>
              </div>

              {gekozen.gewijzigdOp && (
                <p className="mt-3 text-xs text-slate-400">
                  Laatst gewijzigd op{" "}
                  {new Date(gekozen.gewijzigdOp).toLocaleString("nl-BE", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {gekozen.gewijzigdDoor && ` door ${gekozen.gewijzigdDoor}`}
                </p>
              )}
            </div>
          )}
        </section>
      </div>

      {bewerkt && ingevoerd && (
        <Bewerken
          wachtwoord={ingevoerd}
          inschrijving={bewerkt}
          onKlaar={(bijgewerkt) => {
            onthoud(bijgewerkt.kenmerk, { vervanging: bijgewerkt });
            setBewerkt(null);
          }}
          onSluiten={() => setBewerkt(null)}
        />
      )}
    </main>
  );
}
