"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, Download, Loader2, LockKeyhole, RefreshCw, Trash2, X } from "lucide-react";
import {
  KAMP,
  euro,
  mededeling,
  telOp,
  volledigeNaam,
  type KampInschrijving,
} from "@/lib/voetbalkamp/kamp";
import { bewaarWachtwoord, leesWachtwoord, vergeetWachtwoord } from "../toegang";

/**
 * Het overzicht van de inschrijvingen voor het voetbalkamp.
 *
 * Zelfde manier van werken als het overzicht van het mosselfeest, maar met een
 * eigen wachtwoord: één keer inloggen, en wat je afvinkt staat meteen goed op
 * het scherm, ook als de opslag even achterloopt.
 */

/** Hoelang een eigen wijziging voorrang krijgt op wat de server terugmeldt. */
const VOORRANG_MS = 90_000;

function Kaartje({ label, waarde, toon }: { label: string; waarde: string; toon?: "goed" | "open" }) {
  const kleur = toon === "goed" ? "text-green-700" : toon === "open" ? "text-primary" : "text-inkt-900";
  return (
    <div className="rounded-2xl border border-zand-200/70 bg-white p-4 shadow-blad">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${kleur}`}>{waarde}</p>
    </div>
  );
}

function leeftijd(geboortedatum: string): string {
  if (!geboortedatum) return "";
  const geboren = new Date(`${geboortedatum}T12:00:00`);
  const kamp = new Date(`${KAMP.dagen[0]}T12:00:00`);
  let jaren = kamp.getFullYear() - geboren.getFullYear();
  if (kamp < new Date(kamp.getFullYear(), geboren.getMonth(), geboren.getDate())) jaren -= 1;
  return `${jaren} jaar`;
}

export default function KampOverzicht() {
  const [wachtwoord, setWachtwoord] = useState("");
  const [ingevoerd, setIngevoerd] = useState<string | null>(null);
  const [lijst, setLijst] = useState<KampInschrijving[] | null>(null);
  const [eigen, setEigen] = useState<Map<string, { betaald?: boolean; weg?: boolean; tijd: number }>>(new Map());
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [zoek, setZoek] = useState("");
  const [filter, setFilter] = useState<"alle" | "open" | "betaald">("alle");

  const haal = useCallback(async (geheim: string) => {
    setBezig(true);
    setFout("");
    try {
      const antwoord = await fetch("/api/voetbalkamp/beheer", {
        headers: { authorization: `Bearer ${geheim}` },
        cache: "no-store",
      });
      if (antwoord.status === 401) {
        setFout("Dat wachtwoord klopt niet.");
        setIngevoerd(null);
        vergeetWachtwoord();
        return;
      }
      if (!antwoord.ok) {
        setFout("Het overzicht kon niet opgehaald worden.");
        return;
      }
      const gegevens = (await antwoord.json()) as { inschrijvingen: KampInschrijving[] };
      setLijst(gegevens.inschrijvingen ?? []);
      setIngevoerd(geheim);
      bewaarWachtwoord(geheim);
    } catch {
      setFout("Het overzicht kon niet opgehaald worden.");
    } finally {
      setBezig(false);
    }
  }, []);

  useEffect(() => {
    const bewaard = leesWachtwoord();
    if (bewaard) haal(bewaard);
  }, [haal]);

  // De lijst van de server, met de eigen recente wijzigingen eroverheen.
  const zichtbaar = useMemo(() => {
    const nu = Date.now();
    return (lijst ?? [])
      .map((i) => {
        const w = eigen.get(i.kenmerk);
        if (!w || nu - w.tijd > VOORRANG_MS) return i;
        if (w.weg) return null;
        return w.betaald === undefined ? i : { ...i, betaald: w.betaald };
      })
      .filter((i): i is KampInschrijving => i !== null);
  }, [lijst, eigen]);

  const totalen = useMemo(() => telOp(zichtbaar), [zichtbaar]);

  async function actie(kenmerk: string, soort: "betaald" | "schrappen", betaald?: boolean) {
    if (!ingevoerd) return;
    if (soort === "schrappen" && !confirm("Deze inschrijving definitief schrappen?")) return;
    setFout("");
    const antwoord = await fetch("/api/voetbalkamp/beheer", {
      method: "POST",
      headers: { authorization: `Bearer ${ingevoerd}`, "content-type": "application/json" },
      body: JSON.stringify({ actie: soort, kenmerk, betaald }),
    });
    if (!antwoord.ok) {
      setFout("Die wijziging is niet gelukt.");
      return;
    }
    setEigen((vorig) => {
      const nieuw = new Map(vorig);
      nieuw.set(kenmerk, soort === "schrappen" ? { weg: true, tijd: Date.now() } : { betaald, tijd: Date.now() });
      return nieuw;
    });
  }

  async function excel() {
    if (!ingevoerd) return;
    const antwoord = await fetch("/api/voetbalkamp/logboek", {
      headers: { authorization: `Bearer ${ingevoerd}` },
    });
    if (!antwoord.ok) {
      setFout("Het Excel-bestand kon niet gemaakt worden.");
      return;
    }
    const url = URL.createObjectURL(await antwoord.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = `${KAMP.naam} ${KAMP.jaar} inschrijvingen.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
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
          <h1 className="mt-4 text-center font-display text-xl font-bold text-inkt-900">Overzicht voetbalkamp</h1>
          <p className="mt-1 text-center text-sm text-slate-500">
            Voor de organisatoren van het {KAMP.naam.toLowerCase()}.
          </p>
          <input
            type="password"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            placeholder="Wachtwoord"
            autoFocus
            className="mt-5 w-full rounded-xl border border-zand-300 px-3.5 py-2.5 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {fout && <p className="mt-2 text-sm text-primary">{fout}</p>}
          <button type="submit" disabled={bezig} className="btn-primary mt-4 w-full justify-center">
            {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : "Openen"}
          </button>
        </form>
      </main>
    );
  }

  const naald = zoek.trim().toLowerCase();
  const getoond = zichtbaar
    .filter((i) => (filter === "open" ? !i.betaald : filter === "betaald" ? i.betaald : true))
    .filter(
      (i) =>
        !naald ||
        volledigeNaam(i).toLowerCase().includes(naald) ||
        i.ouderNaam.toLowerCase().includes(naald) ||
        i.email.toLowerCase().includes(naald) ||
        String(i.nummer ?? "").includes(naald),
    )
    .sort((a, b) => (a.nummer ?? 0) - (b.nummer ?? 0));

  const knop =
    "inline-flex items-center gap-2 rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10";

  return (
    <main className="min-h-screen bg-zand-50">
      <header className="bg-inkt-900 text-white">
        <div className="container-custom flex flex-wrap items-center justify-between gap-3 py-5">
          <div>
            <p className="font-display text-base font-bold leading-tight">Overzicht {KAMP.naam}</p>
            <p className="text-xs text-white/70">{KAMP.datumTekst}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={knop}
              onClick={() => {
                vergeetWachtwoord();
                setIngevoerd(null);
                setLijst(null);
              }}
            >
              Afmelden
            </button>
            <button type="button" className={knop} onClick={() => haal(ingevoerd)} disabled={bezig}>
              {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Verversen
            </button>
            <button type="button" className={knop} onClick={excel}>
              <Download className="h-4 w-4" />
              Excel
            </button>
          </div>
        </div>
      </header>

      <div className="container-custom max-w-6xl space-y-6 py-8">
        {fout && (
          <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary-50 p-4 text-sm text-primary-900">
            <AlertCircle className="h-4 w-4" />
            {fout}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kaartje label="Inschrijvingen" waarde={String(totalen.inschrijvingen)} />
          <Kaartje label="Betaald" waarde={`${totalen.betaald}`} toon="goed" />
          <Kaartje label="Nog niet betaald" waarde={`${totalen.inschrijvingen - totalen.betaald}`} toon="open" />
          <Kaartje
            label="Nog te ontvangen"
            waarde={KAMP.prijs !== null ? `${euro(totalen.bedragOpen)} euro` : "prijs volgt"}
            toon="open"
          />
        </div>

        {Object.keys(totalen.perCategorie).length > 0 && (
          <section className="rounded-2xl border border-zand-200/70 bg-white p-5 shadow-blad">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Per leeftijdscategorie{totalen.nietLeden > 0 ? `, waarvan ${totalen.nietLeden} nog geen lid` : ""}</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(totalen.perCategorie)
                .sort(([a], [b]) => a.localeCompare(b, "nl", { numeric: true }))
                .map(([categorie, aantal]) => (
                  <span key={categorie} className="rounded-lg bg-zand-50 px-3 py-1.5 text-sm text-slate-700">
                    {categorie} <span className="font-bold text-inkt-900">{aantal}</span>
                  </span>
                ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-zand-200/70 bg-white p-5 shadow-blad sm:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-inkt-900">De inschrijvingen ({getoond.length})</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={zoek}
                onChange={(e) => setZoek(e.target.value)}
                placeholder="Zoek op nummer, naam of mail"
                className="rounded-xl border border-zand-300 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="rounded-xl border border-zand-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="alle">Alle</option>
                <option value="open">Nog niet betaald</option>
                <option value="betaald">Betaald</option>
              </select>
            </div>
          </div>

          {getoond.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">Nog geen inschrijvingen die hieraan voldoen.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zand-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Nr.</th>
                    <th className="py-2 pr-3">Speler</th>
                    <th className="py-2 pr-3">Categorie</th>
                    <th className="py-2 pr-3">Ouder</th>
                    <th className="py-2 pr-3">Mededeling</th>
                    <th className="py-2 pr-3">Betaald</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {getoond.map((i) => (
                    <tr key={i.kenmerk} className="border-b border-zand-100 align-top">
                      <td className="py-3 pr-3 font-display text-base font-bold text-inkt-900">{i.nummer ?? "-"}</td>
                      <td className="py-3 pr-3">
                        <p className="font-medium text-inkt-900">{volledigeNaam(i)}</p>
                        <p className="text-xs text-slate-500">{leeftijd(i.geboortedatum)}</p>
                        {i.opmerking && <p className="mt-1 text-xs italic text-primary-800">{i.opmerking}</p>}
                      </td>
                      <td className="py-3 pr-3 text-slate-700">
                        {i.categorie}
                        {!i.lid && <span className="mt-0.5 block text-xs text-amber-700">nog geen lid</span>}
                      </td>
                      <td className="py-3 pr-3">
                        <p className="text-slate-700">{i.ouderNaam}</p>
                        <p className="text-xs text-slate-500">{i.email}</p>
                        <p className="text-xs text-slate-500">{i.telefoon}</p>
                      </td>
                      <td className="py-3 pr-3 font-mono text-xs text-slate-600">{mededeling(i)}</td>
                      <td className="py-3 pr-3">
                        <button
                          type="button"
                          onClick={() => actie(i.kenmerk, "betaald", !i.betaald)}
                          className={
                            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition " +
                            (i.betaald
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-primary-100 text-primary-800 hover:bg-primary-200")
                          }
                        >
                          {i.betaald ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                          {i.betaald ? "Betaald" : "Openstaand"}
                        </button>
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => actie(i.kenmerk, "schrappen")}
                          aria-label={`Inschrijving van ${volledigeNaam(i)} schrappen`}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-primary-50 hover:text-primary"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 text-xs text-slate-500">
            Betaald afvinken doe je hier, niet in Excel: dat bestand wordt elke keer opnieuw gemaakt.
          </p>
        </section>
      </div>
    </main>
  );
}
