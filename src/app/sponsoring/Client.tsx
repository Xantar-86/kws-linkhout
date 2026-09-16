"use client";

// app/sponsoring/Client.tsx
//
// De sponsorpagina. Een ondernemer komt hier met één vraag: wat krijg ik, en
// wat kost het? Dus de formules staan hoog, met de bedragen erbij, en elke
// knop brengt je naar hetzelfde formulier met het juiste onderwerp al gekozen.
// Geen losse pop-ups: een formulier op de pagina zelf werkt op elke telefoon
// en verdwijnt niet als je per ongeluk naast het venster tikt.

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Eye,
  Handshake,
  Link2,
  Mail,
  CircleDot,
  Building2,
} from "lucide-react";
import { PaginaKop } from "@/components/PaginaKop";
import { SectieKop } from "@/components/SectieKop";
import { Onthul } from "@/components/beweging/Onthul";
import { SPONSORS } from "@/components/home/SponsorsSection";
import { StatsSection, type Cijfer } from "@/components/home/StatsSection";
import {
  FORMULES,
  LINKWOOD_PARK,
  ONDERWERPEN,
  SPONSOR_CONTACT,
  WAAROM,
  WEDSTRIJDBAL,
  ZELEM,
} from "./inhoud";

const CIJFERS: Cijfer[] = [
  { waarde: 1938, vanaf: 1900, achtervoegsel: "", label: "Opgericht", onder: "Stamnummer 03531" },
  { waarde: 350, vanaf: 0, achtervoegsel: "+", label: "Leden", onder: "Spelers, trainers en vrijwilligers" },
  { waarde: 5, vanaf: 0, achtervoegsel: "", label: "Terreinen", onder: "Op twee sites, Linkhout en Zelem" },
  { waarde: 25, vanaf: 0, achtervoegsel: "+", label: "Ploegen", onder: "Jeugd, dames en senioren" },
];

const WAAROM_ICONEN = [Eye, Handshake, Link2];

type Tab = "contact" | "wedstrijdbal";
type Status = { soort: "rust" } | { soort: "bezig" } | { soort: "ok"; lokaal?: boolean } | { soort: "fout"; tekst: string };

export default function SponsoringClient() {
  const formulier = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>("contact");
  const [onderwerp, setOnderwerp] = useState(ONDERWERPEN[0]);
  const [status, setStatus] = useState<Status>({ soort: "rust" });

  /** Een knop op de pagina opent het formulier met het juiste onderwerp. */
  function naarFormulier(doel: Tab, metOnderwerp?: string) {
    setTab(doel);
    if (metOnderwerp) setOnderwerp(metOnderwerp);
    setStatus({ soort: "rust" });
    formulier.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const velden = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus({ soort: "bezig" });
    try {
      const r = await fetch("/api/sponsoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...velden, soort: tab }),
      });
      const d = await r.json();
      if (!r.ok) {
        setStatus({ soort: "fout", tekst: d.error ?? "Het bericht kon niet verstuurd worden." });
        return;
      }
      setStatus({ soort: "ok", lokaal: d.lokaal });
      e.currentTarget.reset();
    } catch {
      setStatus({ soort: "fout", tekst: "Geen verbinding. Probeer het zo meteen opnieuw." });
    }
  }

  return (
    <div className="min-h-screen bg-zand-50">
      <PaginaKop
        opschrift="Sponsoring"
        titel="Word sponsor van KWS Linkhout"
        accent="sponsor"
        onder="Meer dan tachtig jaar voetbal, ruim 350 leden en een van de sterkste jeugd- en meisjeswerkingen van Limburg. Als sponsor investeert u in mensen, niet enkel in reclame."
        beeld="/images/teams/1ste-ploeg-2025.jpg"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#formules" className="btn-primary group">
            Bekijk de formules
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <button
            type="button"
            onClick={() => naarFormulier("wedstrijdbal")}
            className="btn-secondary border-white/25 text-white hover:border-white/50 hover:bg-white/10"
          >
            Bestel een wedstrijdbal
          </button>
        </div>
      </PaginaKop>

      {/* Meer dan voetbal */}
      <section className="section-padding bg-white">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-2">
          <Onthul>
            <SectieKop
              opschrift="Meer dan voetbal"
              titel="Een club die mensen samenbrengt"
              accent="samenbrengt"
              uitlijning="links"
            />
            <div className="lopende-tekst mt-6">
              <p>
                KWS Linkhout, Koninklijke White Star Linkhout, is al sinds 1938 een vaste waarde in het
                sportieve en sociale leven van Linkhout en de ruime regio. Wat begon als een kleine
                dorpsclub, groeide uit tot een ambitieuze, warme en toekomstgerichte vereniging.
              </p>
              <p>
                De club staat bekend om haar sterke jeugdwerking en haar vooruitstrevende meisjes- en
                dameswerking, met zes dames- en meisjesploegen. Met investeringen in de infrastructuur
                in Linkhout en Zelem bouwt de club aan de toekomst, met plezier, respect en teamgevoel
                als kern.
              </p>
              <p>
                Als sponsor investeert u niet alleen in voetbal, maar in een maatschappelijk project dat
                jongeren kansen geeft en het leven in de gemeenschap versterkt.
              </p>
            </div>
          </Onthul>
          <Onthul vertraging={0.1}>
            <div className="overflow-hidden rounded-3xl shadow-blad">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/teams/alle-jeugd.jpg"
                alt="De jeugdspelers van KWS Linkhout samen op het terrein"
                className="aspect-[4/3] h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </Onthul>
        </div>
      </section>

      {/* De club in cijfers: dezelfde donkere band als op de startpagina, als
          scharnier tussen het verhaal en wat een sponsor ervoor terugkrijgt. */}
      <StatsSection
        cijfers={CIJFERS}
        opschrift="In cijfers"
        titel="Een club om op te bouwen"
        accent="bouwen"
        onder="Groot genoeg om zichtbaar te zijn in de hele streek, dichtbij genoeg om iedereen te kennen."
      />

      {/* Waarom sponsoren */}
      <section className="section-padding">
        <div className="container-custom">
          <SectieKop
            opschrift="Waarom sponsoren"
            titel="Wat u ervoor terugkrijgt"
            accent="terugkrijgt"
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {WAAROM.map((w, i) => {
              const Icoon = WAAROM_ICONEN[i];
              return (
                <Onthul key={w.titel} vertraging={i * 0.08}>
                  <div className="h-full rounded-2xl border border-zand-200/70 bg-white p-7 shadow-blad">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icoon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-gray-900">{w.titel}</h3>
                    <p className="mt-2 leading-relaxed text-gray-600">{w.tekst}</p>
                  </div>
                </Onthul>
              );
            })}
          </div>
        </div>
      </section>

      {/* De formules */}
      <section id="formules" className="section-padding scroll-mt-24 bg-white">
        <div className="container-custom">
          <SectieKop
            opschrift="Sponsorformules 2026"
            titel="Kies de formule die bij u past"
            accent="formule"
            onder="Alle bedragen zijn exclusief btw. Er is altijd een formule op maat mogelijk."
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {FORMULES.map((f, i) => (
              <Onthul key={f.id} vertraging={i * 0.08} className="h-full">
                <article
                  className={`flex h-full flex-col rounded-3xl border p-8 ${
                    f.id === "platinum"
                      ? "border-inkt-800 bg-inkt-950 text-white"
                      : "border-zand-200/70 bg-zand-50"
                  }`}
                >
                  <p
                    className={`text-[0.6875rem] font-semibold uppercase tracking-[0.2em] ${
                      f.id === "platinum" ? "text-primary-400" : "text-primary"
                    }`}
                  >
                    Pakket
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight">{f.naam}</h3>
                  <p className={`mt-2 ${f.id === "platinum" ? "text-white/65" : "text-gray-600"}`}>{f.kern}</p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {f.inbegrepen.map((punt) => (
                      <li key={punt} className="flex gap-3 text-sm leading-relaxed">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${f.id === "platinum" ? "text-primary-400" : "text-primary"}`}
                        />
                        <span className={f.id === "platinum" ? "text-white/80" : "text-gray-700"}>{punt}</span>
                      </li>
                    ))}
                  </ul>

                  <dl
                    className={`mt-7 grid grid-cols-2 gap-4 border-t pt-6 ${
                      f.id === "platinum" ? "border-white/10" : "border-zand-200"
                    }`}
                  >
                    {f.prijzen.map((p) => (
                      <div key={p.label}>
                        <dt className={`text-xs ${f.id === "platinum" ? "text-white/50" : "text-gray-500"}`}>
                          {p.label}
                        </dt>
                        <dd className="mt-1 text-lg font-bold tabular-nums">{p.bedrag}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className={`mt-3 text-xs ${f.id === "platinum" ? "text-white/45" : "text-gray-500"}`}>
                    {f.voetnoot}
                  </p>

                  <button
                    type="button"
                    onClick={() => naarFormulier("contact", `Pakket ${f.naam}`)}
                    className={
                      f.id === "platinum"
                        ? "btn-primary mt-7 w-full"
                        : "btn-secondary mt-7 w-full border-gray-300 text-gray-900 hover:border-gray-900"
                    }
                  >
                    Bespreek pakket {f.naam}
                  </button>
                </article>
              </Onthul>
            ))}
          </div>
        </div>
      </section>

      {/* Project Linkwood Park */}
      <section className="korrel relative overflow-hidden bg-inkt-950 py-20 text-white md:py-28">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_100%,rgba(220,38,38,0.22),transparent_65%)]"
        />
        <div className="container-custom relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Onthul>
            <p className="opschrift text-primary-400">
              <Building2 className="h-4 w-4" />
              Infrastructuurproject
            </p>
            <h2 className="heading-2 mt-4 text-white">{LINKWOOD_PARK.titel}</h2>
            <p className="mt-4 text-xl text-white/80">{LINKWOOD_PARK.actie}</p>
            <p className="mt-4 max-w-xl leading-relaxed text-white/60">{LINKWOOD_PARK.uitleg}</p>
            <dl className="mt-8 flex gap-10">
              <div>
                <dt className="text-sm text-white/50">Bijdrage</dt>
                <dd className="mt-1 font-display text-4xl font-extrabold tabular-nums">{LINKWOOD_PARK.bijdrage}</dd>
              </div>
              <div>
                <dt className="text-sm text-white/50">Zichtbaarheid</dt>
                <dd className="mt-1 font-display text-4xl font-extrabold tabular-nums">{LINKWOOD_PARK.zichtbaarheid}</dd>
              </div>
            </dl>
          </Onthul>
          <Onthul vertraging={0.1}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
              <p className="text-sm font-semibold text-white">Inbegrepen</p>
              <ul className="mt-5 space-y-3">
                {LINKWOOD_PARK.inbegrepen.map((punt) => (
                  <li key={punt} className="flex gap-3 text-sm leading-relaxed text-white/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                    {punt}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => naarFormulier("contact", "Project Linkwood Park")}
                className="btn-primary mt-8 w-full"
              >
                Bespreek Project Linkwood Park
              </button>
            </div>
          </Onthul>
        </div>
      </section>

      {/* De wedstrijdbal, de laagdrempelige instapper. */}
      <section className="section-padding pb-0">
        <div className="container-custom">
          <Onthul>
            <div className="flex flex-col items-start gap-6 rounded-3xl border border-zand-200/70 bg-white p-8 shadow-blad md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CircleDot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-extrabold tracking-tight text-gray-900">
                    Wedstrijdbal, {WEDSTRIJDBAL.prijs}
                  </h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-gray-600">{WEDSTRIJDBAL.uitleg}</p>
                </div>
              </div>
              <button type="button" onClick={() => naarFormulier("wedstrijdbal")} className="btn-primary shrink-0">
                Bestel een wedstrijdbal
              </button>
            </div>
          </Onthul>
        </div>
      </section>

      {/* De samenwerking met KFCE Zelem, met het volledige verhaal. Minder
          ruimte bovenaan: de wedstrijdbal erboven staat op dezelfde grond, en
          dan leest een volle sectie-afstand als een gat in plaats van een pauze. */}
      <section className="pb-20 pt-14 md:pb-28 md:pt-20">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Onthul>
            <div className="rounded-3xl border border-zand-200/70 bg-white p-8 shadow-blad md:p-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/samenwerking.png"
                alt="Het clubschild van KWS Linkhout en dat van Eendracht Zelem, met een handdruk ertussen: in samenwerking met"
                className="mx-auto w-full max-w-md"
                loading="lazy"
              />
            </div>
          </Onthul>
          <Onthul vertraging={0.1}>
            <SectieKop
              opschrift="Samenwerking"
              titel="Samen sterker met KFCE Zelem"
              accent="Samen sterker"
              uitlijning="links"
            />
            <div className="lopende-tekst mt-6">
              {ZELEM.map((alinea) => (
                <p key={alinea.slice(0, 24)}>{alinea}</p>
              ))}
            </div>
          </Onthul>
        </div>
      </section>

      {/* Wie er al meedoet */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectieKop opschrift="Zij gingen u voor" titel="Onze sponsors" accent="sponsors" />
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SPONSORS.map((s) => (
              <li
                key={s.naam}
                className="flex h-28 items-center justify-center rounded-2xl border border-zand-200/70 bg-zand-50 p-6"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.beeld} alt={s.naam} loading="lazy" className="max-h-full max-w-full object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Het formulier */}
      <section ref={formulier} id="formulier" className="section-padding scroll-mt-24">
        <div className="container-custom max-w-3xl">
          <SectieKop
            opschrift="Vrijblijvend contact"
            titel="Zin om mee te bouwen aan KWS Linkhout?"
            accent="mee te bouwen"
            onder="Geen verplichtingen, gewoon een goed gesprek. We nemen persoonlijk contact met u op."
          />

          <div className="mt-10 rounded-3xl border border-zand-200/70 bg-white p-6 shadow-blad md:p-10">
            <div className="flex rounded-2xl bg-zand-100 p-1" role="tablist">
              {(
                [
                  ["contact", "Vrijblijvend contact"],
                  ["wedstrijdbal", `Wedstrijdbal, ${WEDSTRIJDBAL.prijs}`],
                ] as const
              ).map(([waarde, label]) => (
                <button
                  key={waarde}
                  type="button"
                  role="tab"
                  aria-selected={tab === waarde}
                  onClick={() => {
                    setTab(waarde);
                    setStatus({ soort: "rust" });
                  }}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    tab === waarde ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {status.soort === "ok" ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  {tab === "wedstrijdbal" ? "Bestelling ontvangen" : "Bericht verstuurd"}
                </h3>
                <p className="mt-2 text-gray-600">
                  {tab === "wedstrijdbal"
                    ? "We bevestigen uw bestelling per e-mail."
                    : "We nemen zo snel mogelijk persoonlijk contact met u op."}
                </p>
                {status.lokaal && (
                  <p className="mx-auto mt-4 max-w-sm rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Lokale proef: er is niets verstuurd. Online gaat dit naar {SPONSOR_CONTACT.naam}.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setStatus({ soort: "rust" })}
                  className="mt-6 text-sm font-semibold text-primary"
                >
                  Nog een bericht sturen
                </button>
              </div>
            ) : (
              <form onSubmit={verstuur} className="mt-8 grid gap-5 sm:grid-cols-2">
                {/* Onzichtbaar voor mensen; wie dit invult is een robot. */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <Veld label="Naam" name="naam" verplicht autoComplete="name" />
                {tab === "wedstrijdbal" ? (
                  <Veld label="Bedrijfsnaam" name="bedrijf" autoComplete="organization" />
                ) : (
                  <Veld label="Telefoon" name="telefoon" type="tel" autoComplete="tel" />
                )}
                <Veld label="E-mailadres" name="email" type="email" verplicht autoComplete="email" breed={tab === "contact"} />

                {tab === "wedstrijdbal" ? (
                  <>
                    <Veld label="Telefoon" name="telefoon" type="tel" verplicht autoComplete="tel" />
                    <Veld label="Straat en nummer" name="straat" verplicht autoComplete="street-address" breed />
                    <Veld label="Postcode" name="postcode" verplicht autoComplete="postal-code" />
                    <Veld label="Gemeente" name="gemeente" verplicht autoComplete="address-level2" />
                    <Veld label="Btw-nummer" name="btw" />
                    <Veld label="Voorkeur wedstrijd" name="wedstrijd" />
                  </>
                ) : (
                  <>
                    <label className="sm:col-span-2">
                      <span className="mb-1.5 block text-sm font-medium text-gray-700">
                        Onderwerp <span className="text-primary">*</span>
                      </span>
                      <select
                        name="onderwerp"
                        required
                        value={onderwerp}
                        onChange={(e) => setOnderwerp(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        {ONDERWERPEN.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </label>
                    <label className="sm:col-span-2">
                      <span className="mb-1.5 block text-sm font-medium text-gray-700">
                        Bericht <span className="text-primary">*</span>
                      </span>
                      <textarea
                        name="bericht"
                        required
                        rows={5}
                        placeholder="Vertel kort wie u bent en waar u aan denkt."
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                  </>
                )}

                <div className="sm:col-span-2">
                  {status.soort === "fout" && (
                    <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{status.tekst}</p>
                  )}
                  <button type="submit" disabled={status.soort === "bezig"} className="btn-primary w-full disabled:opacity-60">
                    {status.soort === "bezig"
                      ? "Bezig met versturen..."
                      : tab === "wedstrijdbal"
                        ? "Bestelling versturen"
                        : "Verstuur bericht"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-1 text-center text-sm text-gray-500">
            <p>
              Liever rechtstreeks? Mail {SPONSOR_CONTACT.naam} op{" "}
              <a href={`mailto:${SPONSOR_CONTACT.mail}`} className="inline-flex items-center gap-1 font-semibold text-primary">
                <Mail className="h-3.5 w-3.5" />
                {SPONSOR_CONTACT.mail}
              </a>
            </p>
            <p className="mt-3 text-xs text-gray-400">
              KWS Linkhout vzw · Kapelstraat 72, 3560 Linkhout · KBVB 3531 · btw BE 0459.873.832
            </p>
            <Link href="/contact" className="mt-2 text-xs text-gray-400 underline-offset-2 hover:underline">
              Andere vragen? Naar de contactpagina
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Veld({
  label,
  name,
  type = "text",
  verplicht = false,
  autoComplete,
  breed = false,
}: {
  label: string;
  name: string;
  type?: string;
  verplicht?: boolean;
  autoComplete?: string;
  breed?: boolean;
}) {
  return (
    <label className={breed ? "sm:col-span-2" : undefined}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} {verplicht && <span className="text-primary">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={verplicht}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
