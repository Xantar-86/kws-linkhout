"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, LockKeyhole, Printer } from "lucide-react";
import {
  EVENEMENT,
  GERECHTEN,
  GROEPEN,
  euro,
  gerechtenVan,
  isAfhalen,
} from "@/lib/mosselfeest/kaart";
import { openstaand, reedsBetaald, telOp, type Inschrijving } from "@/lib/mosselfeest/totalen";
import { volledigeNaam } from "@/lib/mosselfeest/nakijken";
import { bewaarWachtwoord, leesWachtwoord } from "../toegang";

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

type Soort = "bonnen" | "keuken" | "dag";

export default function AfdrukClient() {
  const [wachtwoord, setWachtwoord] = useState("");
  const [ingevoerd, setIngevoerd] = useState<string | null>(null);
  const [inschrijvingen, setInschrijvingen] = useState<Inschrijving[] | null>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  const [soort, setSoort] = useState<Soort>("bonnen");
  const [welkeZitting, setWelkeZitting] = useState("alle");
  const [enkelOnbetaald, setEnkelOnbetaald] = useState(false);
  /** Eén bepaalde inschrijving, via ?nr= in het adres. */
  const [enkelNummer, setEnkelNummer] = useState<number | null>(null);
  /** Of via een klik op een bonnetje in de lijst hieronder. */
  const [enkelKenmerk, setEnkelKenmerk] = useState<string | null>(null);
  const [autoAfdrukken, setAutoAfdrukken] = useState(false);

  // Het adres uitlezen doen we hier en niet met useSearchParams: dan blijft
  // deze pagina een gewone statische pagina zonder Suspense eromheen.
  useEffect(() => {
    const vraag = new URLSearchParams(window.location.search);
    const nr = Number.parseInt(vraag.get("nr") ?? "", 10);
    if (Number.isFinite(nr) && nr > 0) setEnkelNummer(nr);
    if (vraag.get("print") === "1") setAutoAfdrukken(true);
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
        return;
      }
      if (!antwoord.ok) {
        setFout("De lijst kon niet opgehaald worden.");
        return;
      }
      const gegevens = (await antwoord.json()) as { inschrijvingen: Inschrijving[] };
      setInschrijvingen(gegevens.inschrijvingen ?? []);
      setIngevoerd(geheim);
      bewaarWachtwoord(geheim);
    } catch {
      setFout("De lijst kon niet opgehaald worden.");
    } finally {
      setBezig(false);
    }
  }, []);

  useEffect(() => {
    const bewaard = leesWachtwoord();
    if (bewaard) haal(bewaard);
  }, [haal]);

  const gekozen = useMemo(() => {
    const alles = inschrijvingen ?? [];
    if (enkelKenmerk !== null) return alles.filter((i) => i.kenmerk === enkelKenmerk);
    if (enkelNummer !== null) return alles.filter((i) => i.kaartnummer === enkelNummer);
    return alles
      .filter((i) => (welkeZitting === "alle" ? true : (i.zitting || "zonder") === welkeZitting))
      .filter((i) => (enkelOnbetaald ? !i.betaald : true))
      .sort((a, b) => (a.kaartnummer ?? Number.MAX_SAFE_INTEGER) - (b.kaartnummer ?? Number.MAX_SAFE_INTEGER));
  }, [inschrijvingen, welkeZitting, enkelOnbetaald, enkelNummer, enkelKenmerk]);

  // Eén bonnetje dat met ?print=1 geopend wordt, drukt zichzelf af. Zo is het
  // aan de kassa één klik in plaats van drie.
  useEffect(() => {
    if (!autoAfdrukken || gekozen.length === 0) return;
    const wachten = setTimeout(() => window.print(), 400);
    return () => clearTimeout(wachten);
  }, [autoAfdrukken, gekozen.length]);

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
      {/* De kop met de weg terug, enkel op het scherm. */}
      <header className="bg-inkt-900 text-white print:hidden">
        <div className="container-custom flex flex-wrap items-center justify-between gap-3 py-3">
          <a
            href="/mosselfeest/overzicht"
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug naar het overzicht
          </a>
          <div className="flex gap-2">
            <a
              href="/mosselfeest/kassa"
              className="rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10"
            >
              Avondscherm
            </a>
            <a
              href="/mosselfeest/voorraad"
              className="rounded-xl border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10"
            >
              Voorraad
            </a>
          </div>
        </div>
      </header>

      {/* De keuzebalk, enkel op het scherm. */}
      <div className="border-b border-zand-200 bg-white print:hidden">
        <div className="container-custom flex flex-wrap items-end gap-4 py-4">
          {(enkelNummer !== null || enkelKenmerk !== null) && (
            <div className="w-full">
              <p className="text-sm text-slate-600">
                Eén bonnetje
                {gekozen[0]?.kaartnummer ? `, kaartnummer ${gekozen[0].kaartnummer}` : ""}.{" "}
                <button
                  type="button"
                  onClick={() => {
                    setEnkelNummer(null);
                    setEnkelKenmerk(null);
                  }}
                  className="text-primary underline"
                >
                  Toon toch de hele lijst
                </button>
              </p>
            </div>
          )}
          <div className={enkelNummer !== null || enkelKenmerk !== null ? "hidden" : ""}>
            <p className="text-xs uppercase tracking-wide text-slate-500">Wat</p>
            <div className="mt-1 flex gap-2">
              {(
                [
                  { id: "bonnen" as const, label: "Bonnetjes per inschrijving" },
                  { id: "keuken" as const, label: "Keukenlijst per zitting" },
                  { id: "dag" as const, label: "Wat voorzien per dag" },
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

          <label
            className={
              "block " + (enkelNummer !== null || enkelKenmerk !== null ? "hidden" : "")
            }
          >
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

          <label
            className={
              "flex items-center gap-2 pb-2 text-sm text-slate-600 " +
              (enkelNummer !== null || enkelKenmerk !== null ? "hidden" : "")
            }
          >
            <input
              type="checkbox"
              checked={enkelOnbetaald}
              onChange={(e) => setEnkelOnbetaald(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Enkel onbetaalde
          </label>

          <div className="ml-auto flex items-center gap-3 pb-1">
            <span className="text-sm text-slate-500">
              {gekozen.length} inschrijving{gekozen.length === 1 ? "" : "en"}
            </span>
            <button type="button" onClick={() => window.print()} className="btn-primary">
              <Printer className="mr-2 h-4 w-4" />
              Afdrukken
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-6 print:px-0 print:py-0">
        {enkelNummer !== null || enkelKenmerk !== null || soort === "bonnen" ? (
          <Bonnen lijst={gekozen} onEnkel={setEnkelKenmerk} />
        ) : soort === "dag" ? (
          <PerDag lijst={gekozen} />
        ) : (
          <Keukenlijst lijst={gekozen} />
        )}
      </div>
    </main>
  );
}

/** Eén kadertje per inschrijving. */
function Bonnen({
  lijst,
  onEnkel,
}: {
  lijst: Inschrijving[];
  /** Enkel dit bonnetje tonen, om het apart af te drukken. */
  onEnkel?: (kenmerk: string) => void;
}) {
  if (lijst.length === 0) {
    return <p className="text-sm text-slate-500">Geen inschrijvingen die hieraan voldoen.</p>;
  }

  // Op papier onder elkaar en over de volle breedte: in de keuken moet zo'n
  // bonnetje van op een afstand leesbaar zijn. Op het scherm blijven het er
  // twee naast elkaar, want daar wil je overzicht.
  return (
    <div className="grid gap-4 sm:grid-cols-2 print:grid-cols-1 print:gap-5">
      {lijst.map((i) => {
        const zitting = EVENEMENT.zittingen.find((z) => z.id === i.zitting);
        return (
          <div
            key={i.kenmerk}
            className="break-inside-avoid rounded-xl border-2 border-dashed border-slate-400 bg-white p-4 print:rounded-none print:p-6"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-2">
              <div>
                <p className="font-display text-2xl font-bold leading-none text-inkt-900 print:text-5xl">
                  {i.kaartnummer ?? "-"}
                </p>
                <p className="mt-1 text-sm font-semibold text-inkt-900 print:mt-2 print:text-2xl">
                  {volledigeNaam(i)}
                </p>
              </div>
              <div className="text-right text-xs text-slate-600 print:text-lg">
                {onEnkel && lijst.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      onEnkel(i.kenmerk);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="mb-1 inline-flex items-center gap-1 rounded-lg border border-zand-300 px-2 py-1 text-xs text-slate-600 transition hover:border-primary hover:text-primary print:hidden"
                  >
                    <Printer className="h-3 w-3" />
                    Enkel deze
                  </button>
                )}
                <p className="font-semibold print:text-xl">{zitting?.kort ?? "zonder zitting"}</p>
                {zitting && isAfhalen(zitting.id) && (
                  <p className="font-bold uppercase text-slate-900">Afhalen</p>
                )}
                <p className={i.betaald ? "text-green-700" : "font-bold text-primary"}>
                  {i.betaald
                    ? "betaald"
                    : reedsBetaald(i) > 0
                      ? `nog ${euro(openstaand(i))} euro`
                      : "nog te betalen"}
                </p>
              </div>
            </div>

            <table className="mt-2 w-full text-sm print:mt-4 print:text-xl">
              <tbody>
                {GERECHTEN.filter((g) => (i.aantallen[g.id] ?? 0) > 0).map((g) => (
                  <tr key={g.id}>
                    <td className="w-8 py-0.5 font-bold text-inkt-900 print:w-14 print:py-1 print:text-2xl">
                      {i.aantallen[g.id]}
                    </td>
                    <td className="py-0.5 text-slate-700 print:py-1">{g.naam}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {i.opmerking && (
              <p className="mt-2 border-t border-slate-200 pt-1 text-xs italic text-slate-600 print:text-base">
                {i.opmerking}
              </p>
            )}
            <p className="mt-2 text-right text-sm font-bold text-inkt-900 print:mt-3 print:text-2xl">
              {euro(i.bedrag)} euro
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** Per zitting de totalen per gerecht, met de namen eronder. */
function Keukenlijst({ lijst }: { lijst: Inschrijving[] }) {
  // De zittingen die echt in deze lijst voorkomen, in de volgorde van de kaart.
  const aanwezig = new Set(lijst.map((i) => i.zitting || "zonder"));
  const zittingen = [...EVENEMENT.zittingen.map((z) => z.id), "zonder"].filter((id) =>
    aanwezig.has(id),
  );

  if (lijst.length === 0) {
    return <p className="text-sm text-slate-500">Geen inschrijvingen die hieraan voldoen.</p>;
  }

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
                  <th className="w-14 py-1 pr-3">Nr.</th>
                  <th className="py-1 pr-3">Naam</th>
                  <th className="py-1 pr-3">Bestelling</th>
                  <th className="w-24 py-1 pr-4 text-right">Bedrag</th>
                  <th className="w-28 py-1">Betaald</th>
                </tr>
              </thead>
              <tbody>
                {vanZitting.map((i) => (
                  <tr key={i.kenmerk} className="border-b border-slate-100 align-top">
                    <td className="py-1 pr-3 font-bold">{i.kaartnummer ?? "-"}</td>
                    <td className="py-1 pr-3">{volledigeNaam(i)}</td>
                    <td className="py-1 pr-3 text-slate-700">
                      {GERECHTEN.filter((g) => (i.aantallen[g.id] ?? 0) > 0)
                        .map((g) => `${i.aantallen[g.id]} ${g.kort ?? g.naam}`)
                        .join(", ")}
                    </td>
                    <td className="py-1 pr-4 text-right">{euro(i.bedrag)}</td>
                    <td className={"py-1 " + (i.betaald ? "text-green-700" : "font-bold text-primary")}>
                      {i.betaald ? "ja" : reedsBetaald(i) > 0 ? `nog ${euro(openstaand(i))}` : "nee"}
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

/**
 * Wat er per dag voorzien moet worden.
 *
 * Het blad om mee te nemen naar de winkel: per gerecht wat vrijdag nodig heeft,
 * wat zaterdag nodig heeft, en het geheel. Porties van een inschrijving zonder
 * zitting horen bij geen van beide dagen en staan apart, zodat ze niet stil
 * verdwijnen.
 */
function PerDag({ lijst }: { lijst: Inschrijving[] }) {
  if (lijst.length === 0) {
    return <p className="text-sm text-slate-500">Geen inschrijvingen die hieraan voldoen.</p>;
  }

  const totalen = telOp(lijst);
  const zonderDag =
    totalen.porties -
    Object.values(totalen.perDagGerecht.vrijdag).reduce((a, b) => a + b, 0) -
    Object.values(totalen.perDagGerecht.zaterdag).reduce((a, b) => a + b, 0);

  return (
    <section>
      <div className="flex items-baseline justify-between border-b-2 border-inkt-900 pb-1">
        <h2 className="font-display text-xl font-bold text-inkt-900">
          Wat er voorzien moet worden
        </h2>
        <p className="text-sm text-slate-600">
          {totalen.inschrijvingen} inschrijving{totalen.inschrijvingen === 1 ? "" : "en"},{" "}
          {totalen.porties} porties
        </p>
      </div>

      <table className="mt-3 w-full border-collapse text-sm print:text-base">
        <thead>
          <tr className="border-b border-slate-300 text-left text-xs uppercase text-slate-500">
            <th className="py-1 pr-3">Gerecht</th>
            <th className="w-28 py-1 pr-3 text-right">Vrijdag 23</th>
            <th className="w-28 py-1 pr-3 text-right">Zaterdag 24</th>
            {zonderDag > 0 && <th className="w-28 py-1 pr-3 text-right">Zonder dag</th>}
            <th className="w-24 py-1 text-right">Totaal</th>
          </tr>
        </thead>
        <tbody>
          {GROEPEN.map((groep) => {
            const gerechten = gerechtenVan(groep.id);
            if (gerechten.length === 0) return null;
            return (
              <Fragment key={groep.id}>
                <tr>
                  <td colSpan={zonderDag > 0 ? 5 : 4} className="pt-3 pb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {groep.titel}
                    </span>
                  </td>
                </tr>
                {gerechten.map((g) => {
                  const vrijdag = totalen.perDagGerecht.vrijdag[g.id] ?? 0;
                  const zaterdag = totalen.perDagGerecht.zaterdag[g.id] ?? 0;
                  const totaal = totalen.perGerecht[g.id] ?? 0;
                  return (
                    <tr key={g.id} className="border-b border-slate-100">
                      <td className="py-1 pr-3">{g.naam}</td>
                      <td className="py-1 pr-3 text-right">{vrijdag || ""}</td>
                      <td className="py-1 pr-3 text-right">{zaterdag || ""}</td>
                      {zonderDag > 0 && (
                        <td className="py-1 pr-3 text-right text-slate-500">
                          {totaal - vrijdag - zaterdag || ""}
                        </td>
                      )}
                      <td className="py-1 text-right font-bold">{totaal}</td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </table>

      <p className="mt-4 text-xs text-slate-500">
        Afhalen telt mee bij de dag waarop er afgehaald wordt.
      </p>
    </section>
  );
}
