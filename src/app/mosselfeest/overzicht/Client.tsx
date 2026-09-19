"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  Download,
  Loader2,
  LockKeyhole,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import {
  EVENEMENT,
  GERECHTEN,
  GROEPEN,
  euro,
  gerechtenVan,
} from "@/lib/mosselfeest/kaart";
import { telOp, type Inschrijving } from "@/lib/mosselfeest/totalen";
import { volledigeNaam } from "@/lib/mosselfeest/nakijken";
import { KaartToevoegen } from "./KaartToevoegen";

/**
 * Het overzicht van de inschrijvingen, voor de organisatoren.
 *
 * Bovenaan staat waar het om gaat: hoeveel van wat er besteld moet worden. De
 * lijst eronder is om te zoeken, betaald af te vinken en een inschrijving te
 * schrappen.
 *
 * Er is geen aanmeldsysteem: je geeft één keer het wachtwoord, de pagina houdt
 * het bij in dit tabblad en stuurt het mee bij elke aanvraag. Sluit je het
 * tabblad, dan is het weg.
 */

const BEWAARSLEUTEL = "kws-mosselfeest-wachtwoord";

/**
 * Hoelang een wijziging van dit scherm voorrang krijgt op wat de server zegt.
 *
 * De opslag geeft na een schrijfactie soms nog even de oude toestand terug.
 * Zonder deze voorrang sprong een pas afgevinkte inschrijving bij de eerste
 * verversing weer op openstaand, en leek het alsof er niets gebeurde, of erger,
 * alsof er willekeurige regels van status veranderden.
 */
const VOORRANG_MS = 90_000;

interface Wijziging {
  betaald?: boolean;
  weg?: boolean;
  tijd: number;
}

function Kaartje({
  label,
  waarde,
  toon,
  onder,
}: {
  label: string;
  waarde: string;
  toon?: "gewoon" | "goed" | "open";
  /** Kleine regel onder het cijfer, bijvoorbeeld een verdeling. */
  onder?: string;
}) {
  const kleur =
    toon === "goed" ? "text-green-700" : toon === "open" ? "text-primary" : "text-inkt-900";
  return (
    <div className="rounded-2xl border border-zand-200/70 bg-white p-4 shadow-blad">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${kleur}`}>{waarde}</p>
      {onder && <p className="mt-0.5 text-xs text-slate-500">{onder}</p>}
    </div>
  );
}

export default function OverzichtClient() {
  const [wachtwoord, setWachtwoord] = useState("");
  const [ingevoerd, setIngevoerd] = useState<string | null>(null);
  const [inschrijvingen, setInschrijvingen] = useState<Inschrijving[] | null>(null);
  // Wat dit scherm zelf net gewijzigd heeft, met het tijdstip erbij.
  const wijzigingen = useRef<Map<string, Wijziging>>(new Map());
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [zoek, setZoek] = useState("");
  const [enkelOnbetaald, setEnkelOnbetaald] = useState(false);

  /**
   * De lijst van de server, met de eigen recente wijzigingen eroverheen.
   * Wijzigingen ouder dan VOORRANG_MS laten we los; dan is de opslag bij.
   */
  const metEigenWijzigingen = useCallback((lijst: Inschrijving[]): Inschrijving[] => {
    const nu = Date.now();
    for (const [kenmerk, w] of wijzigingen.current) {
      if (nu - w.tijd > VOORRANG_MS) wijzigingen.current.delete(kenmerk);
    }
    return lijst
      .filter((i) => !wijzigingen.current.get(i.kenmerk)?.weg)
      .map((i) => {
        const w = wijzigingen.current.get(i.kenmerk);
        if (!w || w.betaald === undefined) return i;
        return {
          ...i,
          betaald: w.betaald,
          betaaldOp: w.betaald ? (i.betaaldOp ?? new Date(w.tijd).toISOString()) : undefined,
        };
      });
  }, []);

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
        try {
          sessionStorage.removeItem(BEWAARSLEUTEL);
        } catch {
          // Geen opslag beschikbaar: dan vraagt de pagina het straks opnieuw.
        }
        return;
      }
      if (!antwoord.ok) {
        setFout("Het overzicht kon niet opgehaald worden.");
        return;
      }
      const gegevens = (await antwoord.json()) as { inschrijvingen: Inschrijving[] };
      setInschrijvingen(metEigenWijzigingen(gegevens.inschrijvingen ?? []));
      setIngevoerd(geheim);
      try {
        sessionStorage.setItem(BEWAARSLEUTEL, geheim);
      } catch {
        // Niet kunnen bewaren is geen ramp, enkel wat onhandiger.
      }
    } catch {
      setFout("Het overzicht kon niet opgehaald worden.");
    } finally {
      setBezig(false);
    }
  }, [metEigenWijzigingen]);

  // Eén keer bij het openen: stond het wachtwoord nog in dit tabblad?
  useEffect(() => {
    let bewaard: string | null = null;
    try {
      bewaard = sessionStorage.getItem(BEWAARSLEUTEL);
    } catch {
      bewaard = null;
    }
    if (bewaard) haal(bewaard);
  }, [haal]);

  // Zelf optellen uit de lijst die op het scherm staat, zodat de cijfers
  // altijd overeenkomen met wat je ziet.
  const totalen = useMemo(
    () => (inschrijvingen ? telOp(inschrijvingen) : undefined),
    [inschrijvingen],
  );

  async function doeActie(kenmerk: string, actie: "betaald" | "schrappen", betaald?: boolean) {
    if (!ingevoerd) return;
    if (actie === "schrappen" && !confirm("Deze inschrijving definitief schrappen?")) return;

    setFout("");
    const antwoord = await fetch("/api/mosselfeest/beheer", {
      method: "POST",
      headers: { authorization: `Bearer ${ingevoerd}`, "content-type": "application/json" },
      body: JSON.stringify({ actie, kenmerk, betaald }),
    });
    if (!antwoord.ok) {
      setFout("Die wijziging is niet gelukt.");
      return;
    }

    // De wijziging onthouden en meteen toepassen. We halen daarna niets
    // opnieuw op: de opslag kan nog even de oude toestand teruggeven, en dan
    // zou de regel voor je ogen terugspringen. De knop Verversen haalt de
    // echte toestand op wanneer jij dat wil.
    wijzigingen.current.set(kenmerk, {
      betaald: actie === "betaald" ? betaald !== false : undefined,
      weg: actie === "schrappen",
      tijd: Date.now(),
    });
    setInschrijvingen((vorig) => (vorig ? metEigenWijzigingen(vorig) : vorig));
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
            Overzicht mosselfeest
          </h1>
          <p className="mt-1 text-center text-sm text-slate-500">
            Voor de organisatoren van {EVENEMENT.naam} {EVENEMENT.jaar}.
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

  const lijst = (inschrijvingen ?? [])
    .filter((i) => (enkelOnbetaald ? !i.betaald : true))
    .filter((i) => {
      if (!zoek.trim()) return true;
      const naald = zoek.trim().toLowerCase();
      return (
        volledigeNaam(i).toLowerCase().includes(naald) ||
        (i.email ?? "").toLowerCase().includes(naald) ||
        String(i.kaartnummer ?? "").includes(naald) ||
        i.kenmerk.toLowerCase().includes(naald)
      );
    });

  return (
    <main className="min-h-screen bg-zand-50">
      <header className="bg-inkt-900 text-white">
        <div className="container-custom flex flex-wrap items-center justify-between gap-3 py-5">
          <div>
            <p className="font-display text-base font-bold leading-tight">
              Overzicht {EVENEMENT.naam}
            </p>
            <p className="text-xs text-white/70">{EVENEMENT.datumTekst}</p>
          </div>
          <div className="flex gap-2">
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
            <a
              href="/api/mosselfeest/logboek"
              onClick={async (e) => {
                // Het logboek wil een sleutel in de kop, dus halen we het zelf
                // op en bieden we het bestand daarna aan.
                e.preventDefault();
                const antwoord = await fetch("/api/mosselfeest/logboek", {
                  headers: { authorization: `Bearer ${ingevoerd}` },
                });
                if (!antwoord.ok) {
                  setFout("Het logboek kon niet opgehaald worden.");
                  return;
                }
                const blob = await antwoord.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `Mosselfeest ${EVENEMENT.jaar} inschrijvingen.xlsx`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Excel
            </a>
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

        {totalen && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Kaartje
                label="Inschrijvingen"
                waarde={String(totalen.inschrijvingen)}
                onder={
                  totalen.perBron
                    ? `${totalen.perBron.online} online, ${totalen.perBron.kaart} kaarten` +
                      (totalen.perBron.verzamelpost
                        ? `, ${totalen.perBron.verzamelpost} stapels`
                        : "")
                    : undefined
                }
              />
              <Kaartje
                label="Porties"
                waarde={String(totalen.porties)}
                onder={`${totalen.plaatsen} plaatsen aan tafel`}
              />
              <Kaartje label="Totaal" waarde={`${euro(totalen.bedrag)} euro`} />
              <Kaartje label="Betaald" waarde={`${euro(totalen.bedragBetaald)} euro`} toon="goed" />
              <Kaartje
                label="Nog te ontvangen"
                waarde={`${euro(totalen.bedragOpen)} euro`}
                toon="open"
              />
            </div>

            <section className="rounded-2xl border border-zand-200/70 bg-white p-5 shadow-blad sm:p-7">
              <h2 className="mb-4 font-display text-lg font-bold text-inkt-900">
                Wat er besteld moet worden
              </h2>
              <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                {GROEPEN.map((groep) => {
                  const gerechten = gerechtenVan(groep.id);
                  if (gerechten.length === 0) return null;
                  return (
                    <div key={groep.id}>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {groep.titel}
                      </p>
                      <div className="divide-y divide-zand-200">
                        {gerechten.map((g) => {
                          const aantal = totalen.perGerecht[g.id] ?? 0;
                          return (
                            <div key={g.id} className="flex items-baseline justify-between gap-4 py-2">
                              <span
                                className={
                                  "text-sm " + (aantal > 0 ? "text-inkt-900" : "text-slate-400")
                                }
                              >
                                {g.naam}
                              </span>
                              <span
                                className={
                                  "shrink-0 font-display text-lg font-bold " +
                                  (aantal > 0 ? "text-inkt-900" : "text-slate-300")
                                }
                              >
                                {aantal}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-zand-200 pt-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Per zitting
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {EVENEMENT.zittingen.map((z) => {
                    const cijfers = totalen.perZitting[z.id] ?? {
                      inschrijvingen: 0,
                      porties: 0,
                      plaatsen: 0,
                      max: null,
                      vrij: null,
                    };
                    return (
                      <div key={z.id} className="rounded-xl bg-zand-50 p-3">
                        <p className="text-sm text-slate-700">{z.label}</p>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {cijfers.inschrijvingen} inschrijving
                          {cijfers.inschrijvingen === 1 ? "" : "en"}, {cijfers.porties} porties
                        </p>
                        {cijfers.max !== null && (
                          <p
                            className={
                              "mt-1 text-sm font-medium " +
                              ((cijfers.vrij ?? 0) <= 10 ? "text-primary" : "text-slate-700")
                            }
                          >
                            {cijfers.plaatsen} van de {cijfers.max} plaatsen bezet
                            {cijfers.vrij !== null && `, nog ${cijfers.vrij} vrij`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {(() => {
                  // Een verzamelpost mag zonder zitting geboekt worden. Die
                  // porties zitten wel in het totaal, dus we laten ze apart
                  // zien in plaats van ze te verzwijgen.
                  const inZittingen = Object.values(totalen.perZitting).reduce(
                    (som, z) => som + z.porties,
                    0,
                  );
                  const rest = totalen.porties - inZittingen;
                  if (rest <= 0) return null;
                  return (
                    <p className="mt-2 text-sm text-slate-500">
                      {rest} portie{rest === 1 ? "" : "s"} zonder zitting, uit stapels waarvan de
                      zitting nog niet vastligt.
                    </p>
                  );
                })()}
              </div>
            </section>
          </>
        )}

        <KaartToevoegen
          wachtwoord={ingevoerd}
          onToegevoegd={() => {
            // Meteen en nog eens wat later: een net toegevoegde inschrijving
            // duikt soms pas na enkele seconden op in de opslag.
            haal(ingevoerd);
            setTimeout(() => haal(ingevoerd), 4000);
          }}
        />

        <section className="rounded-2xl border border-zand-200/70 bg-white p-5 shadow-blad sm:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-inkt-900">
              De inschrijvingen ({lijst.length})
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={zoek}
                onChange={(e) => setZoek(e.target.value)}
                placeholder="Zoek op nummer, naam of mail"
                className="rounded-xl border border-zand-300 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={enkelOnbetaald}
                  onChange={(e) => setEnkelOnbetaald(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                Enkel onbetaald
              </label>
            </div>
          </div>

          {lijst.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              Nog geen inschrijvingen die hieraan voldoen.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zand-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Nr.</th>
                    <th className="py-2 pr-3">Naam</th>
                    <th className="py-2 pr-3">Zitting</th>
                    <th className="py-2 pr-3">Bestelling</th>
                    <th className="py-2 pr-3 text-right">Bedrag</th>
                    <th className="py-2 pr-3">Betaald</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {lijst.map((i) => (
                    <tr key={i.kenmerk} className="border-b border-zand-100 align-top">
                      <td className="py-3 pr-3">
                        <span className="font-display text-base font-bold text-inkt-900">
                          {i.kaartnummer ?? "-"}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-medium text-slate-400">
                          {i.bron === "kaart" ? "kaart" : i.bron === "verzamelpost" ? "stapel" : "online"}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-medium text-inkt-900">{volledigeNaam(i)}</p>
                        <p className="text-xs text-slate-500">{i.email}</p>
                        {i.telefoon && <p className="text-xs text-slate-500">{i.telefoon}</p>}
                        {i.ingevoerdDoor && (
                          <p className="text-xs text-slate-400">ingevoerd door {i.ingevoerdDoor}</p>
                        )}
                        {i.opmerking && (
                          <p className="mt-1 text-xs italic text-slate-500">{i.opmerking}</p>
                        )}
                      </td>
                      <td className="py-3 pr-3 text-xs text-slate-600">
                        {EVENEMENT.zittingen.find((z) => z.id === i.zitting)?.label ||
                          "nog niet gekend"}
                      </td>
                      <td className="py-3 pr-3 text-xs text-slate-600">
                        {GERECHTEN.filter((g) => (i.aantallen[g.id] ?? 0) > 0).map((g) => (
                          <span key={g.id} className="block">
                            {i.aantallen[g.id]} &times; {g.naam}
                          </span>
                        ))}
                      </td>
                      <td className="py-3 pr-3 text-right font-medium">{euro(i.bedrag)}</td>
                      <td className="py-3 pr-3">
                        <button
                          type="button"
                          onClick={() => doeActie(i.kenmerk, "betaald", !i.betaald)}
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
                          onClick={() => doeActie(i.kenmerk, "schrappen")}
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
            Betaald afvinken doe je hier, niet in Excel: dat bestand wordt elke keer opnieuw
            gemaakt uit deze gegevens, dus wijzigingen erin verdwijnen.
          </p>
        </section>
      </div>
    </main>
  );
}
