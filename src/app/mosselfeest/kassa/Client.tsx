"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  History,
  Loader2,
  LockKeyhole,
  Pencil,
  Printer,
  RefreshCw,
  Search,
  Split,
  Wallet,
  X,
} from "lucide-react";
import { EVENEMENT, GERECHTEN, euro, isAfhalen } from "@/lib/mosselfeest/kaart";
import {
  BETAALMANIEREN,
  kassaPerDag,
  nummerTekst,
  openstaand,
  reedsBetaald,
  telOp,
  volgendeLetter,
  type Betaalmanier,
  type Inschrijving,
} from "@/lib/mosselfeest/totalen";
import { volledigeNaam } from "@/lib/mosselfeest/nakijken";
import { Bewerken } from "../overzicht/Bewerken";
import { Splitsen } from "./Splitsen";
import { bewaarWachtwoord, leesWachtwoord } from "../toegang";

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
 * Bovenaan kies je de zitting die bezig is. Zonder zoekterm staat links dan
 * wie er van die zitting nog moet komen, en met "Behandeld" vink je een kaart
 * af zodra de mensen er zijn. Zo zie je naar het einde toe hoeveel er nog
 * moet komen. Zoeken gaat altijd over alle zittingen: wie op het verkeerde
 * uur komt, moet je ook kunnen vinden.
 *
 * Net als op de overzichtspagina krijgt wat hier gewijzigd wordt voorrang op
 * wat de opslag terugmeldt: die loopt na een schrijfactie soms enkele seconden
 * achter, en op een drukke avond wil je geen regel zien terugspringen.
 */

const VOORRANG_MS = 90_000;

interface Wijziging {
  betaald?: boolean;
  behandeld?: boolean;
  vervanging?: Inschrijving;
  /** Een kaart die hier net afgesplitst is en in de opslag nog kan ontbreken. */
  nieuw?: boolean;
  tijd: number;
}

/** De dag van vandaag in Belgische tijd, zoals kassaPerDag ze schrijft. */
function vandaag(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Brussels" });
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
  // De zitting die nu bezig is; leeg is alle zittingen.
  const [zitting, setZitting] = useState("");
  // De lijst "Laatst behandeld": alle behandelde kaarten, de laatste bovenaan.
  const [laatst, setLaatst] = useState(false);
  const [deelBedrag, setDeelBedrag] = useState("");
  const [kassaOpen, setKassaOpen] = useState(false);
  const [splitsen, setSplitsen] = useState<Inschrijving | null>(null);
  const zoekveld = useRef<HTMLInputElement | null>(null);

  const metEigenWijzigingen = useCallback((lijst: Inschrijving[]): Inschrijving[] => {
    const nu = Date.now();
    for (const [kenmerk, w] of wijzigingen.current) {
      if (nu - w.tijd > VOORRANG_MS) wijzigingen.current.delete(kenmerk);
    }
    // Een net afgesplitste kaart die de opslag nog niet teruggeeft, toch tonen.
    const bekend = new Set(lijst.map((i) => i.kenmerk));
    const erbij = [...wijzigingen.current.values()]
      .filter((w) => w.nieuw && w.vervanging && !bekend.has(w.vervanging.kenmerk))
      .map((w) => w.vervanging!);
    return [...lijst, ...erbij].map((i) => {
      const w = wijzigingen.current.get(i.kenmerk);
      if (!w) return i;
      let basis = w.vervanging ?? i;
      if (w.behandeld !== undefined) {
        basis = {
          ...basis,
          behandeld: w.behandeld,
          behandeldOp: w.behandeld
            ? (basis.behandeldOp ?? new Date(w.tijd).toISOString())
            : undefined,
        };
      }
      if (w.betaald === undefined) return basis;
      return {
        ...basis,
        betaald: w.betaald,
        // Zoals de server het doet: afvinken = het volledige bedrag ontvangen,
        // terugzetten = niets ontvangen. Zonder dit bleef "nog te betalen" op het
        // scherm staan tot iemand ververste.
        betaaldBedrag: w.betaald ? basis.bedrag : 0,
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
        bewaarWachtwoord(geheim);
      } catch {
        setFout("De lijst kon niet opgehaald worden.");
      } finally {
        setBezig(false);
      }
    },
    [metEigenWijzigingen],
  );

  useEffect(() => {
    const bewaard = leesWachtwoord();
    if (bewaard) haal(bewaard);
  }, [haal]);

  const totalen = useMemo(
    () => (inschrijvingen ? telOp(inschrijvingen) : undefined),
    [inschrijvingen],
  );

  const gevonden = useMemo(() => {
    const alles = inschrijvingen ?? [];
    const naald = zoek.trim().toLowerCase();
    if (!naald && laatst) {
      return alles
        .filter((i) => i.behandeld)
        .sort((a, b) => (b.behandeldOp ?? "").localeCompare(a.behandeldOp ?? ""));
    }
    if (!naald && zitting) {
      // Een zitting gekozen: iedereen van die zitting, wie nog moet komen
      // bovenaan, op kaartnummer.
      return alles
        .filter((i) => i.zitting === zitting)
        .sort(
          (a, b) =>
            Number(Boolean(a.behandeld)) - Number(Boolean(b.behandeld)) ||
            (a.kaartnummer ?? Number.MAX_SAFE_INTEGER) - (b.kaartnummer ?? Number.MAX_SAFE_INTEGER),
        );
    }
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
          nummerTekst(i).toLowerCase().includes(naald) ||
          volledigeNaam(i).toLowerCase().includes(naald),
      )
      .sort(
        (a, b) =>
          (a.kaartnummer ?? 0) - (b.kaartnummer ?? 0) ||
          (a.kaartLetter ?? "").localeCompare(b.kaartLetter ?? ""),
      )
      .slice(0, 40);
  }, [inschrijvingen, zoek, zitting, laatst]);

  const kassa = useMemo(() => kassaPerDag(inschrijvingen ?? []), [inschrijvingen]);

  // Wie al geweest is, staat in een aparte lijst onder wie nog moet komen.
  const nogTeKomen = useMemo(() => gevonden.filter((i) => !i.behandeld), [gevonden]);
  const geweest = useMemo(() => gevonden.filter((i) => i.behandeld), [gevonden]);

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
      body: JSON.stringify({
        actie: "betaald",
        kenmerk: inschrijving.kenmerk,
        betaald,
        bekend: inschrijving,
      }),
    });
    if (!antwoord.ok) {
      setFout("Dat afvinken is niet gelukt.");
      return;
    }
    // De bewaarde kaart onthouden, met haar nieuwe versienummer.
    const gegevens = (await antwoord.json().catch(() => ({}))) as { inschrijving?: Inschrijving };
    onthoud(inschrijving.kenmerk, { betaald, vervanging: gegevens.inschrijving });
  }

  async function zetBehandeld(inschrijving: Inschrijving, behandeld: boolean) {
    if (!ingevoerd) return;
    setFout("");
    const antwoord = await fetch("/api/mosselfeest/beheer", {
      method: "POST",
      headers: { authorization: `Bearer ${ingevoerd}`, "content-type": "application/json" },
      body: JSON.stringify({
        actie: "behandeld",
        kenmerk: inschrijving.kenmerk,
        behandeld,
        bekend: inschrijving,
      }),
    });
    if (!antwoord.ok) {
      setFout("Dat afvinken is niet gelukt.");
      return;
    }
    const gegevens = (await antwoord.json().catch(() => ({}))) as { inschrijving?: Inschrijving };
    onthoud(inschrijving.kenmerk, { behandeld, vervanging: gegevens.inschrijving });
  }

  /** Een actie die de bijgewerkte inschrijving terugstuurt, zoals ontvangen. */
  async function stuur(body: Record<string, unknown>): Promise<Record<string, unknown> | null> {
    if (!ingevoerd) return null;
    setFout("");
    try {
      const antwoord = await fetch("/api/mosselfeest/beheer", {
        method: "POST",
        headers: { authorization: `Bearer ${ingevoerd}`, "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const gegevens = (await antwoord.json().catch(() => ({}))) as Record<string, unknown>;
      if (!antwoord.ok) {
        setFout(typeof gegevens.error === "string" ? gegevens.error : "Dat is niet gelukt.");
        return null;
      }
      return gegevens;
    } catch {
      setFout("Dat is niet gelukt. Kijk de verbinding na.");
      return null;
    }
  }

  /** Geld ontvangen: zonder bedrag alles wat openstaat, anders een deel. */
  async function ontvang(inschrijving: Inschrijving, manier: Betaalmanier, bedrag?: number) {
    const gegevens = await stuur({
      actie: "ontvangen",
      kenmerk: inschrijving.kenmerk,
      manier,
      bedrag,
      bekend: inschrijving,
    });
    if (!gegevens?.inschrijving) return;
    setDeelBedrag("");
    onthoud(inschrijving.kenmerk, {
      vervanging: gegevens.inschrijving as Inschrijving,
      betaald: undefined,
    });
  }

  async function wisBetaling(inschrijving: Inschrijving, betalingId: string) {
    const gegevens = await stuur({
      actie: "betalingWissen",
      kenmerk: inschrijving.kenmerk,
      betalingId,
      bekend: inschrijving,
    });
    if (!gegevens?.inschrijving) return;
    onthoud(inschrijving.kenmerk, {
      vervanging: gegevens.inschrijving as Inschrijving,
      betaald: undefined,
    });
  }

  async function splitsAf(inschrijving: Inschrijving, aantallen: Record<string, number>, naarZitting: string) {
    const gegevens = await stuur({
      actie: "afsplitsen",
      kenmerk: inschrijving.kenmerk,
      aantallen,
      zitting: naarZitting,
      bekend: inschrijving,
    });
    if (!gegevens?.oud || !gegevens.nieuw) return false;
    const nieuw = gegevens.nieuw as Inschrijving;
    onthoud(inschrijving.kenmerk, { vervanging: gegevens.oud as Inschrijving, betaald: undefined });
    wijzigingen.current.set(nieuw.kenmerk, { vervanging: nieuw, nieuw: true, tijd: Date.now() });
    setInschrijvingen((vorig) => (vorig ? metEigenWijzigingen(vorig) : vorig));
    setGekozenKenmerk(nieuw.kenmerk);
    return true;
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

  /** Eén regel in de lijst links. */
  function regel(i: Inschrijving) {
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
            : i.behandeld
              ? "border-green-200 bg-green-50/70 hover:border-green-300"
              : "border-zand-200 bg-white/70 hover:border-slate-300")
        }
      >
        <span className="w-12 shrink-0 font-display text-lg font-bold text-inkt-900">
          {nummerTekst(i)}
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
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={
              "rounded-lg px-2 py-1 text-xs font-semibold " +
              (i.betaald ? "bg-green-100 text-green-800" : "bg-primary-100 text-primary-800")
            }
          >
            {i.betaald ? "betaald" : `${euro(Math.max(0, openstaand(i)))} open`}
          </span>
          {i.behandeld && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-2 py-0.5 text-[11px] font-semibold text-white">
              <CheckCheck className="h-3 w-3" />
              {isAfhalen(i.zitting) ? "afgehaald" : "behandeld"}
            </span>
          )}
        </span>
      </button>
    );
  }

  const zittingIsAfhalen = zitting !== "" && isAfhalen(zitting);

  return (
    <main className="min-h-screen bg-zand-50">
      <header className="bg-inkt-900 text-white">
        <div className="container-custom flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="font-display text-base font-bold leading-tight">Avondscherm</p>
            <p className="text-xs text-white/70">
              {totalen
                ? `${totalen.inschrijvingen} inschrijvingen, nog ${totalen.nogTeKomen} te komen, ${euro(totalen.bedragOpen)} euro nog te ontvangen`
                : "bezig met laden"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setKassaOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10"
            >
              <Wallet className="h-4 w-4" />
              Kassa vandaag: cash {euro(kassa[vandaag()]?.cash ?? 0)}, Bancontact{" "}
              {euro(kassa[vandaag()]?.bancontact ?? 0)}
            </button>
            <a
              href="/mosselfeest/leftovers"
              className="rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10"
            >
              LeftOvers
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

      {totalen && (
        <div className="border-b border-zand-200 bg-white">
          <div className="container-custom flex flex-wrap gap-2 py-3">
            <button
              type="button"
              onClick={() => {
                setLaatst(true);
                setZoek("");
              }}
              className={
                "inline-flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition " +
                (laatst
                  ? "border-green-700 bg-green-700 text-white"
                  : "border-green-600 text-green-800 hover:bg-green-50")
              }
            >
              <History className="h-4 w-4" />
              Laatst behandeld
            </button>
            <button
              type="button"
              onClick={() => {
                setZitting("");
                setLaatst(false);
              }}
              className={
                "rounded-xl border-2 px-3 py-2 text-sm font-semibold transition " +
                (zitting === "" && !laatst
                  ? "border-inkt-900 bg-inkt-900 text-white"
                  : "border-zand-300 text-slate-700 hover:border-slate-400")
              }
            >
              Alle zittingen
              <span className="ml-2 font-normal opacity-80">
                nog {totalen.nogTeKomen} te komen
              </span>
            </button>
            {EVENEMENT.zittingen.map((z) => {
              const cijfers = totalen.perZitting[z.id];
              const nog = cijfers ? cijfers.inschrijvingen - cijfers.behandeld : 0;
              const actief = zitting === z.id && !laatst;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => {
                    setZitting(z.id);
                    setLaatst(false);
                    setZoek("");
                  }}
                  className={
                    "rounded-xl border-2 px-3 py-2 text-sm font-semibold transition " +
                    (actief
                      ? "border-inkt-900 bg-inkt-900 text-white"
                      : "border-zand-300 text-slate-700 hover:border-slate-400")
                  }
                >
                  {z.kort ?? z.label}
                  <span
                    className={
                      "ml-2 font-normal " +
                      (actief ? "opacity-80" : nog === 0 ? "text-green-700" : "text-slate-500")
                    }
                  >
                    {(cijfers?.inschrijvingen ?? 0) === 0
                      ? "geen kaarten"
                      : nog === 0
                        ? z.afhalen
                          ? "alles afgehaald"
                          : "iedereen geweest"
                        : `nog ${nog} van ${cijfers?.inschrijvingen ?? 0} ${z.afhalen ? "af te halen" : "te komen"}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
                const eerste = nogTeKomen[0] ?? geweest[0];
                if (e.key === "Enter" && eerste) {
                  setGekozenKenmerk(eerste.kenmerk);
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
                {zoek
                  ? <>Niets gevonden met &ldquo;{zoek}&rdquo;.</>
                  : laatst
                    ? "Er is nog geen enkele kaart behandeld."
                    : "Geen inschrijvingen voor deze zitting."}
              </p>
            )}
            {laatst && !zoek && geweest.length > 0 && (
              <p className="px-1 pt-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                Laatst behandeld, de laatste bovenaan ({geweest.length})
              </p>
            )}
            {nogTeKomen.length > 0 && (geweest.length > 0 || zitting) && (
              <p className="px-1 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {zittingIsAfhalen ? "Nog af te halen" : "Nog te komen"} ({nogTeKomen.length})
              </p>
            )}
            {nogTeKomen.map(regel)}
            {geweest.length > 0 && !(laatst && !zoek) && (
              <p className="px-1 pt-4 text-xs font-semibold uppercase tracking-wide text-green-700">
                {zittingIsAfhalen ? "Afgehaald" : "Geweest"} ({geweest.length})
              </p>
            )}
            {geweest.map(regel)}
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
                    {nummerTekst(gekozen)}
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
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {openstaand(gekozen) > 0 ? "Nog te betalen" : "Te betalen"}
                  </p>
                  <p
                    className={
                      "font-display text-4xl font-bold " +
                      (openstaand(gekozen) > 0 ? "text-primary" : "text-inkt-900")
                    }
                  >
                    {euro(Math.max(0, openstaand(gekozen)))}
                  </p>
                  {reedsBetaald(gekozen) > 0 && openstaand(gekozen) > 0 && (
                    <p className="mt-1 text-sm text-slate-500">
                      {euro(reedsBetaald(gekozen))} van {euro(gekozen.bedrag)} al betaald
                    </p>
                  )}
                  {openstaand(gekozen) < 0 && (
                    <p className="mt-1 text-sm text-green-700">
                      {euro(-openstaand(gekozen))} te veel ontvangen
                    </p>
                  )}
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

              {(gekozen.betalingen ?? []).length > 0 && (
                <div className="mt-4 rounded-xl bg-zand-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Betaald aan de kassa
                  </p>
                  <ul className="mt-1 space-y-1">
                    {(gekozen.betalingen ?? []).map((b) => (
                      <li key={b.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-700">
                          {euro(b.bedrag)} euro{" "}
                          {BETAALMANIEREN.find((m) => m.id === b.manier)?.label.toLowerCase()}
                          <span className="text-slate-400">
                            {" om "}
                            {new Date(b.op).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Deze betaling van ${euro(b.bedrag)} euro wissen?`)) {
                              wisBetaling(gekozen, b.id);
                            }
                          }}
                          className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-white hover:text-primary"
                        >
                          wissen
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!gekozen.betaald && openstaand(gekozen) > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {BETAALMANIEREN.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => ontvang(gekozen, m.id)}
                        className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-5 text-lg font-bold text-white transition hover:bg-primary-700"
                      >
                        <Check className="h-6 w-6" />
                        {euro(openstaand(gekozen))} euro {m.id === "cash" ? "cash" : "met Bancontact"}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zand-200 p-3">
                    <span className="text-sm font-medium text-slate-700">Een deel betalen:</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={deelBedrag}
                      onChange={(e) => setDeelBedrag(e.target.value)}
                      placeholder="bedrag"
                      className="w-28 rounded-lg border border-zand-300 px-3 py-2 text-base outline-none focus:border-primary"
                    />
                    <span className="text-sm text-slate-500">euro</span>
                    {BETAALMANIEREN.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          const bedrag = Number.parseFloat(deelBedrag.replace(",", "."));
                          if (!(bedrag > 0)) {
                            setFout("Vul eerst het bedrag van dat deel in.");
                            return;
                          }
                          ontvang(gekozen, m.id, bedrag);
                        }}
                        className="rounded-lg border-2 border-primary px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary-50"
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col flex-wrap gap-3 sm:flex-row">
                {(gekozen.betaald || openstaand(gekozen) <= 0) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        (gekozen.betalingen ?? []).length === 0 ||
                        window.confirm("Alles terugzetten naar niet betaald? De betalingen hierboven worden gewist.")
                      ) {
                        zetBetaald(gekozen, false);
                      }
                    }}
                    className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-green-600 px-6 py-5 text-lg font-bold text-white transition hover:bg-green-700"
                  >
                    <Check className="h-6 w-6" />
                    Betaald, klik om terug te zetten
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => zetBehandeld(gekozen, !gekozen.behandeld)}
                  className={
                    "flex flex-1 items-center justify-center gap-3 rounded-2xl px-6 py-5 text-lg font-bold transition " +
                    (gekozen.behandeld
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "border-2 border-green-600 text-green-800 hover:bg-green-50")
                  }
                >
                  <CheckCheck className="h-6 w-6" />
                  {isAfhalen(gekozen.zitting)
                    ? gekozen.behandeld
                      ? "Afgehaald, klik om terug te zetten"
                      : "Zet op afgehaald"
                    : gekozen.behandeld
                      ? "Behandeld, klik om terug te zetten"
                      : "Zet op behandeld"}
                </button>
                <button
                  type="button"
                  onClick={() => setBewerkt(gekozen)}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-zand-300 px-6 py-5 text-base font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  <Pencil className="h-5 w-5" />
                  Iets bijzetten of wijzigen
                </button>
                {gekozen.kaartnummer && (
                  <button
                    type="button"
                    onClick={() => setSplitsen(gekozen)}
                    className="flex items-center justify-center gap-2 rounded-2xl border-2 border-zand-300 px-6 py-5 text-base font-semibold text-slate-700 transition hover:border-slate-400"
                  >
                    <Split className="h-5 w-5" />
                    Kaart splitsen
                  </button>
                )}
                {gekozen.kaartnummer && (
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `/mosselfeest/afdruk?kenmerk=${encodeURIComponent(gekozen.kenmerk)}&print=1`,
                        "_blank",
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-2xl border-2 border-zand-300 px-6 py-5 text-base font-semibold text-slate-700 transition hover:border-slate-400"
                  >
                    <Printer className="h-5 w-5" />
                    Bonnetje
                  </button>
                )}
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

      {splitsen && (
        <Splitsen
          inschrijving={splitsen}
          volgendeLetter={volgendeLetter(inschrijvingen ?? [], splitsen.kaartnummer ?? 0)}
          onBevestig={async (aantallen, naarZitting) => {
            if (await splitsAf(splitsen, aantallen, naarZitting)) setSplitsen(null);
          }}
          onSluiten={() => setSplitsen(null)}
          fout={fout}
        />
      )}

      {kassaOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setKassaOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-blad"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-inkt-900">Kassa per dag</h2>
              <button type="button" onClick={() => setKassaOpen(false)} aria-label="Sluiten">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Wat er aan de kassa ontvangen is, per betaalmanier. Overschrijvingen vooraf en wat
              op het overzicht als betaald is aangevinkt, tellen hier niet mee.
            </p>
            {Object.keys(kassa).length === 0 ? (
              <p className="mt-4 text-slate-600">Er is nog niets ontvangen aan de kassa.</p>
            ) : (
              <table className="mt-4 w-full text-base">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2">Dag</th>
                    <th className="py-2 text-right">Cash</th>
                    <th className="py-2 text-right">Bancontact</th>
                    <th className="py-2 text-right">Samen</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(kassa)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([dag, bedragen]) => (
                      <tr key={dag} className="border-t border-zand-100">
                        <td className="py-2 font-medium text-inkt-900">
                          {new Date(`${dag}T12:00:00`).toLocaleDateString("nl-BE", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </td>
                        <td className="py-2 text-right">{euro(bedragen.cash)}</td>
                        <td className="py-2 text-right">{euro(bedragen.bancontact)}</td>
                        <td className="py-2 text-right font-semibold">
                          {euro(bedragen.cash + bedragen.bancontact)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
