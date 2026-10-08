"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  TriangleAlert,
  UserPlus,
  Users,
} from "lucide-react";
import {
  KAMP,
  GEMENGD,
  MEISJES,
  VOORLOPIG,
  controleer,
  euro,
  mededeling,
  nogOpen,
} from "@/lib/voetbalkamp/kamp";

/**
 * Het inschrijvingsformulier voor het voetbalkamp.
 *
 * Eén speler per inschrijving: elk kind krijgt zo zijn eigen nummer en zijn
 * eigen mededeling voor de overschrijving. Wie een broer of zus wil
 * inschrijven, klikt na het versturen op "Nog een kind inschrijven"; de
 * gegevens van de ouder blijven dan ingevuld.
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
            {KAMP.naam} {KAMP.jaar}
          </p>
        </div>
      </div>
    </header>
  );
}

function Deel({ titel, uitleg, children }: { titel: string; uitleg?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zand-200/70 bg-white p-5 shadow-blad sm:p-7">
      <h2 className="font-display text-lg font-bold text-inkt-900">{titel}</h2>
      {uitleg && <p className="mt-1 text-sm text-slate-500">{uitleg}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Veld({
  label,
  verplicht,
  breed,
  children,
}: {
  label: string;
  verplicht?: boolean;
  breed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={"block " + (breed ? "sm:col-span-2" : "")}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {verplicht && <span className="ml-0.5 text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}

const LEEG_KIND = {
  voornaam: "",
  naam: "",
  geboortedatum: "",
  categorie: "",
  lid: undefined as boolean | undefined,
  opmerking: "",
};
const LEEG_OUDER = { ouderNaam: "", email: "", telefoon: "" };

export default function VoetbalkampClient() {
  const [kind, setKind] = useState(LEEG_KIND);
  const [ouder, setOuder] = useState(LEEG_OUDER);
  const [honeypot, setHoneypot] = useState("");
  const [fouten, setFouten] = useState<string[]>([]);
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState<{
    nummer?: number;
    voornaam: string;
    naam: string;
    bevestiging: boolean;
  } | null>(null);
  const open = nogOpen();

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    const invoer = {
      ...kind,
      ...ouder,
      voornaam: kind.voornaam.trim(),
      naam: kind.naam.trim(),
      opmerking: kind.opmerking.trim() || undefined,
    };
    const klachten = controleer(invoer);
    if (klachten.length > 0) {
      setFouten(klachten);
      return;
    }
    setFouten([]);
    setBezig(true);
    try {
      const antwoord = await fetch("/api/voetbalkamp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...invoer, website: honeypot }),
      });
      const gegevens = (await antwoord.json()) as {
        ok: boolean;
        klachten?: string[];
        nummer?: number;
        bevestigingVerstuurd?: boolean;
      };
      if (!antwoord.ok || !gegevens.ok) {
        setFouten(gegevens.klachten ?? ["Er ging iets mis bij het versturen."]);
        return;
      }
      setKlaar({
        nummer: gegevens.nummer,
        voornaam: invoer.voornaam,
        naam: invoer.naam,
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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-zand-200/70 bg-white p-7 text-center shadow-blad"
          >
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-4 font-display text-2xl font-bold text-inkt-900">
              {klaar.voornaam} is ingeschreven
            </h1>
            <div className="mx-auto mt-5 w-full max-w-xs rounded-xl bg-zand-50 py-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Inschrijfnummer</p>
              <p className="font-display text-4xl font-bold text-inkt-900">{klaar.nummer ?? "-"}</p>
            </div>

            <div className="mt-6 rounded-xl border-2 border-primary/70 p-4 text-left text-sm text-slate-700">
              <p className="font-semibold text-inkt-900">Betalen</p>
              <p className="mt-1">
                {KAMP.prijs !== null
                  ? `Schrijf ${euro(KAMP.prijs)} euro over op ${KAMP.rekening} (${KAMP.rekeningNaam}) met als mededeling:`
                  : `Het bedrag laten we je nog weten. Schrijf dan over op ${KAMP.rekening} (${KAMP.rekeningNaam}) met als mededeling:`}
              </p>
              <p className="mt-2 rounded-lg bg-zand-50 px-3 py-2 font-mono font-semibold text-primary">
                {mededeling(klaar)}
              </p>
            </div>

            <p className="mt-5 text-sm text-slate-600">
              {klaar.bevestiging
                ? `We stuurden een bevestiging naar ${ouder.email}. Niets gekregen? Kijk even bij je ongewenste mail.`
                : `De bevestigingsmail kon niet vertrekken, maar de inschrijving is wel binnen. Noteer het nummer hierboven.`}
            </p>

            <button
              type="button"
              onClick={() => {
                setKind(LEEG_KIND);
                setKlaar(null);
                window.scrollTo({ top: 0 });
              }}
              className="btn-primary mt-6 inline-flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Nog een kind inschrijven
            </button>
            <p className="mt-2 text-xs text-slate-500">De gegevens van de ouder blijven ingevuld.</p>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zand-50">
      <Kop />
      <form onSubmit={verstuur} noValidate className="container-custom max-w-3xl space-y-6 py-8">
        {VOORLOPIG && (
          <div className="flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5">
            <TriangleAlert className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold">Nog niet doorgeven</p>
              <p className="mt-1">
                De prijs van het kamp ligt nog niet vast. Dit formulier werkt, maar is nog niet
                bedoeld om te delen.
              </p>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-inkt-900 text-white">
          <div className="grid sm:grid-cols-[1.1fr_0.9fr]">
            <div className="order-2 p-6 sm:order-1 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-400">
                Jeugdwerking
              </p>
              <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                {KAMP.naam} {KAMP.jaar}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Drie dagen voetballen in de herfstvakantie, met de trainers van KWS Linkhout. Voor
                meisjes en jongens, voor leden en voor wie het eens wil proberen.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                  <span>{KAMP.datumTekst.charAt(0).toUpperCase() + KAMP.datumTekst.slice(1)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                  <span>{KAMP.plaats}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                  <span>
                    Meisjes en jongens van {GEMENGD[0]} tot {GEMENGD[GEMENGD.length - 1]}
                    <span className="block text-white/70">
                      Meisjesploegen {MEISJES.slice(0, -1).join(", ")} en {MEISJES[MEISJES.length - 1]}
                    </span>
                  </span>
                </li>
              </ul>
              <div className="mt-6 inline-flex items-baseline gap-2 rounded-xl bg-white/10 px-4 py-2.5">
                <span className="text-xs uppercase tracking-wide text-white/60">Prijs</span>
                <span className="font-display text-xl font-bold">
                  {KAMP.prijs !== null ? `${euro(KAMP.prijs)} euro` : "volgt nog"}
                </span>
                <span className="text-xs text-white/60">per speler</span>
              </div>
            </div>
            {/* De hele jeugdwerking op een foto; het midden van de groep in beeld. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/teams/alle-jeugd.jpg"
              alt="De jeugdspelers en trainers van KWS Linkhout samen op het veld"
              className="order-1 h-48 w-full object-cover sm:order-2 sm:h-full"
              style={{ objectPosition: "50% 55%" }}
            />
          </div>
          <div className="border-t border-white/10 px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Inbegrepen</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {KAMP.inbegrepen.map((item) => (
                <li key={item.tekst} className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-4 py-3">
                  <span className="text-3xl leading-none" aria-hidden="true">
                    {item.teken}
                  </span>
                  <span className="text-sm font-medium text-white">{item.tekst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {!open && (
          <div className="rounded-2xl border border-primary/30 bg-primary-50 p-5 text-sm text-primary-900">
            De inschrijvingen zijn afgesloten. Probeer het nog via{" "}
            <a href={`mailto:${KAMP.contact}`} className="underline">
              {KAMP.contact}
            </a>
            .
          </div>
        )}

        <Deel titel="De speler" uitleg="Wie komt er voetballen? Eén kind per inschrijving.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Veld label="Voornaam" verplicht>
              <input
                className={INVOER}
                value={kind.voornaam}
                onChange={(e) => setKind({ ...kind, voornaam: e.target.value })}
                autoComplete="off"
              />
            </Veld>
            <Veld label="Familienaam" verplicht>
              <input
                className={INVOER}
                value={kind.naam}
                onChange={(e) => setKind({ ...kind, naam: e.target.value })}
                autoComplete="off"
              />
            </Veld>
            <Veld label="Geboortedatum" verplicht>
              <input
                type="date"
                className={INVOER}
                value={kind.geboortedatum}
                onChange={(e) => setKind({ ...kind, geboortedatum: e.target.value })}
              />
            </Veld>
            <Veld label="Leeftijdscategorie" verplicht>
              <select
                className={INVOER}
                value={kind.categorie}
                onChange={(e) => setKind({ ...kind, categorie: e.target.value })}
              >
                <option value="">Kies U6, U7, ... of WU8, WU10, ...</option>
                <optgroup label="Jongens en meisjes">
                  {GEMENGD.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Meisjesploegen">
                  {MEISJES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
              </select>
            </Veld>
            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 block text-sm font-medium text-slate-700">
                Al lid van KWS Linkhout?<span className="ml-0.5 text-primary">*</span>
              </legend>
              <div className="flex gap-2">
                {[
                  { waarde: true, tekst: "Ja, speelt al bij de club" },
                  { waarde: false, tekst: "Nee, nog geen lid" },
                ].map((keuze) => (
                  <label key={String(keuze.waarde)} className="flex-1">
                    <input
                      type="radio"
                      name="lid"
                      className="peer sr-only"
                      checked={kind.lid === keuze.waarde}
                      onChange={() => setKind({ ...kind, lid: keuze.waarde })}
                    />
                    <span className="block cursor-pointer rounded-xl border border-zand-300 bg-white px-4 py-2.5 text-center text-sm text-slate-700 transition hover:border-slate-400 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white">
                      {keuze.tekst}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Veld label="Iets wat de trainers moeten weten" breed>
              <textarea
                className={INVOER + " min-h-24"}
                value={kind.opmerking}
                onChange={(e) => setKind({ ...kind, opmerking: e.target.value })}
                placeholder="Allergieën, medicatie, ... Niet verplicht."
              />
            </Veld>
          </div>
        </Deel>

        <Deel titel="Ouder of voogd" uitleg="Hierop sturen we de bevestiging, en zo bereiken we je tijdens het kamp.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Veld label="Naam" verplicht breed>
              <input
                className={INVOER}
                value={ouder.ouderNaam}
                onChange={(e) => setOuder({ ...ouder, ouderNaam: e.target.value })}
                autoComplete="name"
              />
            </Veld>
            <Veld label="E-mailadres" verplicht>
              <input
                type="email"
                className={INVOER}
                value={ouder.email}
                onChange={(e) => setOuder({ ...ouder, email: e.target.value })}
                autoComplete="email"
                placeholder="naam@voorbeeld.be"
              />
            </Veld>
            <Veld label="Gsm" verplicht>
              <input
                type="tel"
                className={INVOER}
                value={ouder.telefoon}
                onChange={(e) => setOuder({ ...ouder, telefoon: e.target.value })}
                autoComplete="tel"
                placeholder="0470 12 34 56"
              />
            </Veld>
          </div>
        </Deel>

        {/* Voor robots: een mens ziet dit veld niet en vult het dus niet in. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          aria-hidden="true"
          name="website"
        />

        {fouten.length > 0 && (
          <div className="rounded-2xl border border-primary/30 bg-primary-50 p-4 text-sm text-primary-900">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" />
              Nog even nakijken
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {fouten.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-2xl border border-zand-200/70 bg-white p-5 shadow-blad sm:p-7">
          <p className="text-sm text-slate-600">
            Na het versturen krijg je een mail met het inschrijfnummer en de gegevens voor de
            overschrijving{KAMP.prijs !== null ? ` van ${euro(KAMP.prijs)} euro` : ""}.
          </p>
          <button
            type="submit"
            disabled={bezig || !open}
            className="btn-primary mt-4 w-full justify-center disabled:opacity-60 sm:w-auto"
          >
            {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : "Inschrijven"}
          </button>
          <p className="mt-3 text-xs text-slate-500">
            We gebruiken deze gegevens enkel voor het kamp. Zie de{" "}
            <Link href="/clubinfo/privacyverklaring" className="underline">
              privacyverklaring
            </Link>
            .
          </p>
        </div>
      </form>
    </main>
  );
}
