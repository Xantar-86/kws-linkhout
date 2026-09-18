"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Minus, Plus, TriangleAlert } from "lucide-react";
import {
  EVENEMENT,
  GROEPEN,
  VOORLOPIG,
  aantalPorties,
  bedragVan,
  euro,
  gerechtenVan,
  mededeling,
} from "@/lib/mosselfeest/kaart";
import { MAX_PER_GERECHT, controleer, nogOpen } from "@/lib/mosselfeest/nakijken";

/**
 * Het inschrijvingsformulier voor het mosselfeest.
 *
 * Opgezet als de gedrukte kaart: per gerecht een aantal, en onderaan wat het
 * kost. Het totaal staat op een balk die blijft plakken, zodat je op een
 * telefoon altijd ziet waar je aan toe bent terwijl je door de kaart schuift.
 *
 * De kaart zelf staat in lib/mosselfeest/kaart.ts. Zolang VOORLOPIG daar op
 * true staat, waarschuwt de pagina dat de gerechten en prijzen nog niet
 * definitief zijn.
 */

const INVOER =
  "w-full rounded-xl border border-zand-300 bg-white px-3.5 py-2.5 text-base text-inkt-900 " +
  "outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20";

function Kop() {
  return (
    <header className="bg-inkt-900 text-white">
      <div className="container-custom flex items-center gap-3 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/kwslinkhout-logo.png" alt="" className="h-11 w-11 object-contain" />
        <div>
          <p className="font-display text-base font-bold leading-tight">K.W.S. Linkhout</p>
          <p className="text-xs text-white/70">
            {EVENEMENT.naam} {EVENEMENT.jaar}
          </p>
        </div>
      </div>
    </header>
  );
}

function Deel({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zand-200/70 bg-white p-5 shadow-blad sm:p-7">
      <h2 className="mb-4 font-display text-lg font-bold text-inkt-900">{titel}</h2>
      {children}
    </section>
  );
}

function Teller({
  aantal,
  onChange,
  naam,
}: {
  aantal: number;
  onChange: (nieuw: number) => void;
  naam: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={`Eén ${naam} minder`}
        disabled={aantal <= 0}
        onClick={() => onChange(Math.max(0, aantal - 1))}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-zand-300 bg-white text-slate-600 transition hover:border-slate-400 disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={MAX_PER_GERECHT}
        value={aantal === 0 ? "" : aantal}
        placeholder="0"
        aria-label={`Aantal ${naam}`}
        onChange={(e) => {
          const getal = Number.parseInt(e.target.value, 10);
          onChange(Number.isFinite(getal) ? Math.min(Math.max(0, getal), MAX_PER_GERECHT) : 0);
        }}
        className={
          "h-11 w-14 rounded-xl border bg-white text-center text-base font-semibold outline-none transition " +
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none " +
          (aantal > 0
            ? "border-primary/40 text-inkt-900"
            : "border-zand-300 text-slate-400")
        }
      />
      <button
        type="button"
        aria-label={`Eén ${naam} meer`}
        onClick={() => onChange(Math.min(MAX_PER_GERECHT, aantal + 1))}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-zand-300 bg-white text-slate-600 transition hover:border-slate-400"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function MosselfeestClient() {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [zitting, setZitting] = useState("");
  const [aantallen, setAantallen] = useState<Record<string, number>>({});
  const [opmerking, setOpmerking] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [bezig, setBezig] = useState(false);
  const [fouten, setFouten] = useState<string[]>([]);
  const [klaar, setKlaar] = useState<{ kenmerk: string; bedrag: number; bevestiging: boolean } | null>(
    null,
  );

  const bedrag = useMemo(() => bedragVan(aantallen), [aantallen]);
  const porties = useMemo(() => aantalPorties(aantallen), [aantallen]);
  const open = nogOpen();

  function zet(id: string, nieuw: number) {
    setAantallen((vorig) => {
      const volgend = { ...vorig };
      if (nieuw > 0) volgend[id] = nieuw;
      else delete volgend[id];
      return volgend;
    });
  }

  async function verstuur(gebeurtenis: React.FormEvent) {
    gebeurtenis.preventDefault();
    const invoer = {
      naam: naam.trim(),
      email: email.trim(),
      telefoon: telefoon.trim() || undefined,
      zitting,
      aantallen,
      opmerking: opmerking.trim() || undefined,
    };
    const klachten = controleer(invoer);
    if (klachten.length > 0) {
      setFouten(klachten);
      return;
    }

    setFouten([]);
    setBezig(true);
    try {
      const antwoord = await fetch("/api/mosselfeest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...invoer, website: honeypot }),
      });
      const gegevens = (await antwoord.json()) as {
        ok: boolean;
        klachten?: string[];
        kenmerk?: string;
        bedrag?: number;
        bevestigingVerstuurd?: boolean;
      };
      if (!antwoord.ok || !gegevens.ok) {
        setFouten(gegevens.klachten ?? ["Er ging iets mis bij het versturen."]);
        return;
      }
      setKlaar({
        kenmerk: gegevens.kenmerk ?? "",
        bedrag: gegevens.bedrag ?? bedrag,
        bevestiging: Boolean(gegevens.bevestigingVerstuurd),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFouten(["De inschrijving kon niet verstuurd worden. Kijk je verbinding na."]);
    } finally {
      setBezig(false);
    }
  }

  if (klaar) {
    return (
      <main className="min-h-screen bg-zand-50">
        <Kop />
        <div className="container-custom max-w-2xl py-12">
          <div className="rounded-2xl border border-zand-200/70 bg-white p-7 shadow-blad">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-4 text-center font-display text-2xl font-bold text-inkt-900">
              Je bent ingeschreven
            </h1>
            <p className="mt-3 text-center text-sm text-slate-600">
              Kenmerk <strong>{klaar.kenmerk}</strong>
              {klaar.bevestiging
                ? `. Er is een bevestiging naar ${email} gestuurd.`
                : ". Hou dit kenmerk bij; het staat ook in de mededeling van je betaling."}
            </p>

            <div className="mt-6 rounded-xl border border-zand-200 bg-zand-50 p-5">
              <p className="font-semibold text-inkt-900">Nog te betalen</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                <strong>{euro(klaar.bedrag)} euro</strong> op {EVENEMENT.rekening}
                <br />
                op naam van {EVENEMENT.rekeningNaam}
                <br />
                mededeling{" "}
                <strong className="whitespace-nowrap">
                  {mededeling(klaar.kenmerk, naam)}
                </strong>
              </p>
            </div>

            <p className="mt-5 text-center text-xs text-slate-500">
              Klopt er iets niet? Mail naar{" "}
              <a href={`mailto:${EVENEMENT.contact}`} className="text-primary underline">
                {EVENEMENT.contact}
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zand-50">
      <Kop />

      <form onSubmit={verstuur} className="container-custom max-w-3xl space-y-5 py-8">
        {VOORLOPIG && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold">Voorlopige kaart</p>
              <p className="mt-1">
                De gerechten, prijzen, datums en zittingen hieronder zijn nog niet de gedrukte
                kaart. Dit formulier is nog niet bedoeld om door te geven.
              </p>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-inkt-900 text-white">
          <div className="grid sm:grid-cols-[1.1fr_0.9fr]">
            <div className="order-2 p-6 sm:order-1 sm:p-8">
              <h1 className="font-display text-2xl font-bold sm:text-3xl">
                Inschrijven voor het mosselfeest
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                {EVENEMENT.datumTekst} in {EVENEMENT.plaats}. Schrijf in tot en met{" "}
                {new Date(EVENEMENT.inschrijvenTot).toLocaleDateString("nl-BE", {
                  day: "numeric",
                  month: "long",
                })}
                , zodat we weten hoeveel we moeten voorzien.
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mosselfeest/mosselen-en-friet.jpg"
              alt="Een pot mosselen met een puntzak friet en mayonaise op een houten tafel"
              className="order-1 h-44 w-full object-cover sm:order-2 sm:h-full"
            />
          </div>
        </div>

        {!open && (
          <div className="rounded-2xl border border-primary/30 bg-primary-50 p-5 text-sm text-primary-900">
            De inschrijvingen zijn afgesloten. Probeer het nog via{" "}
            <a href={`mailto:${EVENEMENT.contact}`} className="underline">
              {EVENEMENT.contact}
            </a>
            .
          </div>
        )}

        <Deel titel="Wie komt er eten">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Naam<span className="ml-0.5 text-primary">*</span>
              </span>
              <input
                className={INVOER}
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                E-mailadres<span className="ml-0.5 text-primary">*</span>
              </span>
              <input
                type="email"
                className={INVOER}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="naam@voorbeeld.be"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Telefoon</span>
              <input
                type="tel"
                className={INVOER}
                value={telefoon}
                onChange={(e) => setTelefoon(e.target.value)}
                autoComplete="tel"
                placeholder="Niet verplicht"
              />
            </label>
          </div>

          <fieldset className="mt-5">
            <legend className="mb-2 text-sm font-medium text-slate-700">
              Wanneer kom je eten?<span className="ml-0.5 text-primary">*</span>
            </legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {EVENEMENT.zittingen.map((z) => (
                <label key={z.id}>
                  <input
                    type="radio"
                    name="zitting"
                    value={z.id}
                    checked={zitting === z.id}
                    onChange={() => setZitting(z.id)}
                    className="peer sr-only"
                  />
                  <span className="block cursor-pointer rounded-xl border border-zand-300 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-400 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white">
                    {z.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </Deel>

        {GROEPEN.map((groep) => {
          const gerechten = gerechtenVan(groep.id);
          if (gerechten.length === 0) return null;
          return (
            <Deel key={groep.id} titel={groep.titel}>
              {groep.uitleg && <p className="-mt-2 mb-3 text-sm text-slate-500">{groep.uitleg}</p>}
              <div className="divide-y divide-zand-200">
                {gerechten.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between gap-4 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-inkt-900">{g.naam}</p>
                      {g.uitleg && <p className="text-xs text-slate-500">{g.uitleg}</p>}
                      <p className="mt-0.5 text-sm text-slate-600">{euro(g.prijs)} euro</p>
                    </div>
                    <Teller
                      naam={g.naam}
                      aantal={aantallen[g.id] ?? 0}
                      onChange={(nieuw) => zet(g.id, nieuw)}
                    />
                  </div>
                ))}
              </div>
            </Deel>
          );
        })}

        <Deel titel="Nog iets te melden">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Opmerking</span>
            <textarea
              className={INVOER + " min-h-24"}
              value={opmerking}
              onChange={(e) => setOpmerking(e.target.value)}
              maxLength={500}
              placeholder="Bijvoorbeeld een allergie of iets waar de keuken rekening mee moet houden."
            />
          </label>
        </Deel>

        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        {fouten.length > 0 && (
          <div className="rounded-2xl border border-primary/30 bg-primary-50 p-5">
            <p className="flex items-center gap-2 font-semibold text-primary-800">
              <AlertCircle className="h-5 w-5" />
              Nog even nakijken
            </p>
            <ul className="mt-2 space-y-1 text-sm text-primary-900">
              {fouten.map((fout) => (
                <li key={fout}>{fout}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Blijft onderaan staan terwijl je door de kaart schuift. */}
        <div className="sticky bottom-0 -mx-4 border-t border-zand-200 bg-zand-50/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">
                {porties === 0
                  ? "Nog niets gekozen"
                  : `${porties} portie${porties === 1 ? "" : "s"}`}
              </p>
              <p className="font-display text-xl font-bold text-inkt-900">
                {euro(bedrag)} euro
              </p>
            </div>
            <button
              type="submit"
              disabled={bezig || !open}
              className="btn-primary justify-center disabled:opacity-60"
            >
              {bezig ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Versturen
                </>
              ) : (
                "Inschrijven"
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Je betaalt met een overschrijving; de gegevens krijg je na het inschrijven.
          </p>
        </div>
      </form>
    </main>
  );
}
