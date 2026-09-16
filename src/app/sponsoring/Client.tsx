"use client";

// app/sponsoring/Client.tsx
//
// De sponsorpagina. Een ondernemer komt hier met één vraag: wat krijg ik, en
// wat kost het? Dus de formules staan hoog, met de bedragen erbij, en elke
// knop opent zijn eigen formulier in een venster, met het onderwerp al
// ingevuld, zoals op de oorspronkelijke sponsorsite.
//
// De pagina is ook bereikbaar als sponsoring.kwslinkhout.be en staat daar als
// losse site. Daarom zonder het menu van de clubsite (zie SiteOmlijsting);
// het clubschild bovenaan brengt je wel naar de clubsite.

import { useEffect, useState } from "react";
import { ArrowRight, Check, Eye, Handshake, Link2, Mail, CircleDot, AlertCircle, X } from "lucide-react";
import { PaginaKop } from "@/components/PaginaKop";
import { SectieKop } from "@/components/SectieKop";
import { Onthul } from "@/components/beweging/Onthul";
import { SPONSORS } from "@/components/home/SponsorsSection";
import { StatsSection, type Cijfer } from "@/components/home/StatsSection";
import { FORMULES, SPONSOR_CONTACT, WAAROM, WEDSTRIJDBAL, ZELEM } from "./inhoud";

const CIJFERS: Cijfer[] = [
  { waarde: 1938, vanaf: 1900, achtervoegsel: "", label: "Opgericht", onder: "Stamnummer 03531" },
  { waarde: 350, vanaf: 0, achtervoegsel: "+", label: "Leden", onder: "Spelers, trainers en vrijwilligers" },
  { waarde: 5, vanaf: 0, achtervoegsel: "", label: "Terreinen", onder: "Op twee sites, Linkhout en Zelem" },
  { waarde: 25, vanaf: 0, achtervoegsel: "+", label: "Ploegen", onder: "Jeugd, dames en senioren" },
];

/**
 * Altijd het volledige adres: op sponsoring.kwslinkhout.be zou "/" gewoon
 * deze pagina zelf zijn.
 */
const CLUBSITE = "https://www.kwslinkhout.be";

const WAAROM_ICONEN = [Eye, Handshake, Link2];

type Tab = "contact" | "wedstrijdbal";
type Status = { soort: "rust" } | { soort: "bezig" } | { soort: "ok"; lokaal?: boolean } | { soort: "fout"; tekst: string };

/* -------------------------------------------------------------------------
   De velden van beide formulieren, met hun controle.

   Een controle geeft een foutmelding terug, of null als het veld goed is.
   Een veld wordt pas beoordeeld zodra iemand het verlaat (of op versturen
   drukt), zodat niemand een rode rand krijgt terwijl hij nog aan het typen
   is. Daarna volgt het oordeel elke toets, zodat je meteen ziet dat het goed
   is.
   ------------------------------------------------------------------------- */

type VeldDef = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  verplicht?: boolean;
  breed?: boolean;
  meerRegels?: boolean;
  controle?: (waarde: string) => string | null;
};

const isMail = (w: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(w) ? null : "Dit e-mailadres klopt niet.");
const isTelefoon = (w: string) =>
  w.replace(/\D/g, "").length >= 9 ? null : "Dit telefoonnummer is te kort.";
const isPostcode = (w: string) => (/^\d{4}(\s?[a-z]{2})?$/i.test(w) ? null : "Een postcode heeft 4 cijfers.");
const isBtw = (w: string) =>
  /^(BE)?\s*[01]?\d{3}[.\s]?\d{3}[.\s]?\d{3}$/i.test(w.replace(/\s+/g, " ").trim())
    ? null
    : "Een Belgisch btw-nummer ziet eruit als BE 0123.456.789.";

const CONTACT_VELDEN: VeldDef[] = [
  { name: "name", label: "Naam", autoComplete: "name", verplicht: true },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email", verplicht: true, controle: isMail },
  { name: "phone", label: "Telefoonnummer", type: "tel", autoComplete: "tel", controle: isTelefoon },
  { name: "subject", label: "Onderwerp", verplicht: true },
  {
    name: "message",
    label: "Bericht",
    verplicht: true,
    breed: true,
    meerRegels: true,
    placeholder: "Vertel kort wie u bent en waar u aan denkt.",
  },
];

const BAL_VELDEN: VeldDef[] = [
  { name: "name", label: "Naam", autoComplete: "name", verplicht: true },
  { name: "company", label: "Bedrijfsnaam", autoComplete: "organization" },
  { name: "street", label: "Straat en nummer", autoComplete: "street-address", verplicht: true, breed: true },
  { name: "zip", label: "Postcode", autoComplete: "postal-code", verplicht: true, controle: isPostcode },
  { name: "city", label: "Gemeente", autoComplete: "address-level2", verplicht: true },
  { name: "vat", label: "Btw-nummer", placeholder: "BE 0123.456.789", controle: isBtw },
  { name: "email", label: "E-mailadres", type: "email", autoComplete: "email", verplicht: true, controle: isMail },
  { name: "phone", label: "Telefoonnummer", type: "tel", autoComplete: "tel", verplicht: true, controle: isTelefoon },
  { name: "match", label: "Voorkeur wedstrijd", placeholder: "bv. eerste thuiswedstrijd van het seizoen" },
];

/**
 * De formulieren gaan via Web3Forms, met de sleutel van de maker van de
 * oorspronkelijke sponsorsite. Bij Web3Forms is bepaald naar wie de mail gaat.
 * De sleutel is bedoeld om in de pagina te staan; het gratis plan aanvaardt
 * enkel inzendingen vanuit de browser, niet vanaf een server.
 *
 * Een kopie meesturen kan op het gratis plan niet. Daarom een tweede sleutel,
 * op het adres van Joel Bynens: elk formulier gaat naar beide.
 */
const WEB3FORMS_SLEUTELS = [
  "4a359a84-fa74-4483-b0da-841394499c56", // maker van de sponsorsite
  "79288482-8fd4-4dce-be91-99d69e4ec3df", // Joel Bynens
];

/** Wat er in de mail staat, zoals de maker het opgaf. */
function mailVoor(tab: Tab, data: Record<string, string>) {
  if (tab === "wedstrijdbal") {
    return {
      subject: `Wedstrijdbal bestelling - ${data.name}`,
      from_name: data.name,
      name: data.name,
      email: data.email,
      bedrijfsnaam: data.company || "-",
      adres: `${data.street}, ${data.zip} ${data.city}`,
      btw_nummer: data.vat || "-",
      telefoon: data.phone,
      voorkeur_wedstrijd: data.match || "-",
    };
  }
  return {
    subject: `Sponsoring KWS Linkhout - ${data.subject}`,
    from_name: data.name,
    name: data.name,
    email: data.email,
    telefoon: data.phone || "-",
    onderwerp: data.subject,
    bericht: data.message,
  };
}

function oordeel(v: VeldDef, waarde: string): string | null {
  const w = waarde.trim();
  if (!w) return v.verplicht ? `Vul ${v.label.toLowerCase()} in.` : null;
  return v.controle ? v.controle(w) : null;
}

export default function SponsoringClient() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("contact");
  const [waarden, setWaarden] = useState<Record<string, string>>({ subject: "" });
  const [bezocht, setBezocht] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>({ soort: "rust" });

  const velden = tab === "contact" ? CONTACT_VELDEN : BAL_VELDEN;

  /**
   * Elke knop op de pagina opent zijn eigen formulier in een venster, met het
   * onderwerp al ingevuld. Wat iemand al typte (naam, e-mail) blijft staan
   * als hij het venster sluit en een andere knop kiest.
   */
  function openFormulier(doel: Tab, metOnderwerp?: string) {
    setTab(doel);
    setBezocht({});
    setStatus({ soort: "rust" });
    if (metOnderwerp) setWaarden((w) => ({ ...w, subject: metOnderwerp }));
    setOpen(true);
  }

  // Sluiten met Escape, en de pagina erachter niet laten scrollen.
  useEffect(() => {
    if (!open) return;
    const toets = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", toets);
    const vroeger = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", toets);
      document.body.style.overflow = vroeger;
    };
  }, [open]);

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const vorm = e.currentTarget;

    // Alles beoordelen, en naar het eerste veld dat nog niet goed is.
    setBezocht(Object.fromEntries(velden.map((v) => [v.name, true])));
    const fout = velden.find((v) => oordeel(v, waarden[v.name] ?? ""));
    if (fout) {
      vorm.querySelector<HTMLElement>(`[name="${fout.name}"]`)?.focus();
      return;
    }

    const data = Object.fromEntries(velden.map((v) => [v.name, (waarden[v.name] ?? "").trim()]));
    const honing = (vorm.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";

    // Een robot vult het onzichtbare veld in: doen alsof het gelukt is.
    if (honing) {
      setStatus({ soort: "ok" });
      return;
    }
    // Wie de site op zijn eigen computer uitprobeert, stuurt geen echte mail.
    if (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) {
      setStatus({ soort: "ok", lokaal: true });
      return;
    }

    setStatus({ soort: "bezig" });
    try {
      const mail = mailVoor(tab, data);
      const antwoorden = await Promise.all(
        WEB3FORMS_SLEUTELS.map((access_key) =>
          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ access_key, ...mail }),
          })
            .then((r) => r.json())
            .then((d) => Boolean(d.success))
            .catch(() => false)
        )
      );
      // Gelukt zodra het bij minstens een van beiden aankwam: nog eens
      // versturen zou de ander een dubbele mail geven.
      if (!antwoorden.some(Boolean)) {
        setStatus({ soort: "fout", tekst: "Het bericht kon niet verstuurd worden. Mail ons gerust rechtstreeks." });
        return;
      }
      setStatus({ soort: "ok" });
      setWaarden({ subject: "" });
      setBezocht({});
    } catch {
      setStatus({ soort: "fout", tekst: "Geen verbinding. Probeer het zo meteen opnieuw." });
    }
  }

  return (
    <main className="min-h-screen bg-zand-50">
      <div className="relative">
        {/* Een losse site heeft geen menu, maar wel een weg naar de club. */}
        <a
          href={CLUBSITE}
          className="absolute left-0 right-0 top-0 z-20 mx-auto flex max-w-7xl items-center gap-3 px-4 py-5 text-white sm:px-6 lg:px-8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/kwslinkhout-logo.png" alt="" className="h-12 w-12 object-contain" />
          <span className="font-display text-lg font-bold tracking-tight">KWS Linkhout</span>
        </a>

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
              onClick={() => openFormulier("wedstrijdbal")}
              className="btn-secondary border-white/25 text-white hover:border-white/50 hover:bg-white/10"
            >
              Bestel een wedstrijdbal
            </button>
          </div>
        </PaginaKop>
      </div>

      {/* De samenwerking met KFCE Zelem, bovenaan zoals op de clubsite. */}
      <section className="section-padding bg-white">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Onthul>
            <div className="rounded-3xl border border-zand-200/70 bg-zand-50 p-8 shadow-blad md:p-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/samenwerking.png"
                alt="Het clubschild van KWS Linkhout en dat van Eendracht Zelem, met een handdruk ertussen: in samenwerking met"
                className="mx-auto w-full max-w-md"
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

      {/* Meer dan voetbal */}
      <section className="section-padding">
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
          <SectieKop opschrift="Waarom sponsoren" titel="Wat u ervoor terugkrijgt" accent="terugkrijgt" />
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

      {/* De formules, vier naast elkaar. Gold is het donkere blok met het lint. */}
      <section id="formules" className="section-padding scroll-mt-8 bg-white">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <SectieKop
            opschrift="Sponsorformules 2026"
            titel="Kies de formule die bij u past"
            accent="formule"
            onder="Alle bedragen zijn exclusief btw. Er is altijd een formule op maat mogelijk."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {FORMULES.map((f, i) => {
              const donker = Boolean(f.uitgelicht);
              return (
                <Onthul key={f.id} vertraging={i * 0.06} className="h-full">
                  <article
                    className={`relative flex h-full flex-col rounded-3xl border p-7 ${
                      donker
                        ? "border-primary bg-inkt-950 text-white shadow-2xl ring-1 ring-primary"
                        : "border-zand-200/70 bg-zand-50"
                    }`}
                  >
                    {f.uitgelicht && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-white shadow-lg">
                        {f.uitgelicht}
                      </span>
                    )}
                    <p
                      className={`text-[0.6875rem] font-semibold uppercase tracking-[0.2em] ${
                        donker ? "text-primary-400" : "text-primary"
                      }`}
                    >
                      {f.opschrift}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-3xl">{f.naam}</h3>
                    <p className={`mt-2 text-sm ${donker ? "text-white/65" : "text-gray-600"}`}>{f.kern}</p>

                    <ul className="mt-6 flex-1 space-y-3">
                      {f.inbegrepen.map((punt) => (
                        <li key={punt} className="flex gap-3 text-sm leading-relaxed">
                          <Check className={`mt-0.5 h-4 w-4 shrink-0 ${donker ? "text-primary-400" : "text-primary"}`} />
                          <span className={donker ? "text-white/80" : "text-gray-700"}>{punt}</span>
                        </li>
                      ))}
                    </ul>

                    <dl
                      className={`mt-7 grid grid-cols-2 gap-4 border-t pt-6 ${
                        donker ? "border-white/10" : "border-zand-200"
                      }`}
                    >
                      {f.prijzen.map((p) => (
                        <div key={p.label}>
                          <dt className={`text-xs ${donker ? "text-white/50" : "text-gray-500"}`}>{p.label}</dt>
                          <dd className="mt-1 font-bold tabular-nums">{p.bedrag}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className={`mt-3 text-xs ${donker ? "text-white/45" : "text-gray-500"}`}>{f.voetnoot}</p>

                    <button
                      type="button"
                      onClick={() => openFormulier("contact", f.opschrift === "Pakket" ? `Pakket ${f.naam}` : f.naam)}
                      className={
                        donker
                          ? "btn-primary mt-7 w-full"
                          : "btn-secondary mt-7 w-full border-gray-300 text-gray-900 hover:border-gray-900"
                      }
                    >
                      Bespreek {f.opschrift === "Pakket" ? `pakket ${f.naam}` : "het project"}
                    </button>
                  </article>
                </Onthul>
              );
            })}
          </div>
        </div>
      </section>

      {/* De wedstrijdbal, de laagdrempelige instapper. */}
      <section className="section-padding">
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
              <button type="button" onClick={() => openFormulier("wedstrijdbal")} className="btn-primary shrink-0">
                Bestel een wedstrijdbal
              </button>
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

      {/* Afsluiter: twee wegen, elk met een eigen formulier. */}
      <section id="contact" className="section-padding">
        <div className="container-custom max-w-4xl">
          <SectieKop
            opschrift="Vrijblijvend contact"
            titel="Zin om mee te bouwen aan KWS Linkhout?"
            accent="mee te bouwen"
            onder="Geen verplichtingen, gewoon een goed gesprek. We nemen persoonlijk contact met u op."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => openFormulier("contact", "Vrijblijvend gesprek over sponsoring")}
              className="group flex items-center justify-between gap-4 rounded-3xl border border-zand-200/70 bg-white p-7 text-left shadow-blad transition hover:border-primary"
            >
              <span>
                <span className="block text-lg font-bold text-gray-900">Neem contact op</span>
                <span className="mt-1 block text-sm text-gray-500">Een vraag, of een formule op maat</span>
              </span>
              <Mail className="h-6 w-6 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => openFormulier("wedstrijdbal")}
              className="group flex items-center justify-between gap-4 rounded-3xl border border-zand-200/70 bg-white p-7 text-left shadow-blad transition hover:border-primary"
            >
              <span>
                <span className="block text-lg font-bold text-gray-900">Bestel een wedstrijdbal</span>
                <span className="mt-1 block text-sm text-gray-500">{WEDSTRIJDBAL.prijs}, een vol jaar zichtbaar</span>
              </span>
              <CircleDot className="h-6 w-6 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="mt-10 flex flex-col items-center gap-1 text-center text-sm text-gray-500">
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
            <a href={CLUBSITE} className="mt-2 text-xs text-gray-400 underline-offset-2 hover:underline">
              Naar de clubsite, kwslinkhout.be
            </a>
          </div>
        </div>
      </section>

      {/* Het formuliervenster */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-inkt-950/70 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="venster-titel"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl md:p-9"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  {tab === "wedstrijdbal" ? `Wedstrijdbal, ${WEDSTRIJDBAL.prijs}` : "Vrijblijvend contact"}
                </p>
                <h2 id="venster-titel" className="mt-2 font-display text-2xl font-extrabold tracking-tight text-gray-900">
                  {tab === "wedstrijdbal" ? "Bestel een wedstrijdbal" : "Neem contact op"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
                className="-mr-2 -mt-1 rounded-full p-2 text-gray-400 transition-colors hover:bg-zand-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
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
                    Lokale proef: er is niets verstuurd. Online gaat dit via Web3Forms.
                  </p>
                )}
                <button type="button" onClick={() => setOpen(false)} className="btn-primary mt-6">
                  Sluiten
                </button>
              </div>
            ) : (
              <form
                key={tab}
                id={tab === "contact" ? "form-contact" : "form-ball"}
                onSubmit={verstuur}
                noValidate
                className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2"
              >
                {/* Onzichtbaar voor mensen; wie dit invult is een robot. */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                {velden.map((v) => (
                  <Veld
                    key={v.name}
                    veld={v}
                    waarde={waarden[v.name] ?? ""}
                    fout={bezocht[v.name] ? oordeel(v, waarden[v.name] ?? "") : null}
                    beoordeeld={Boolean(bezocht[v.name])}
                    opWijzig={(w) => setWaarden((oud) => ({ ...oud, [v.name]: w }))}
                    opVerlaat={() => setBezocht((oud) => ({ ...oud, [v.name]: true }))}
                  />
                ))}

                <div className="sm:col-span-2">
                  {status.soort === "fout" && (
                    <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{status.tekst}</p>
                  )}
                  <button type="submit" disabled={status.soort === "bezig"} className="btn-primary mt-2 w-full disabled:opacity-60">
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
        </div>
      )}
    </main>
  );
}

function Veld({
  veld,
  waarde,
  fout,
  beoordeeld,
  opWijzig,
  opVerlaat,
}: {
  veld: VeldDef;
  waarde: string;
  fout: string | null;
  beoordeeld: boolean;
  opWijzig: (waarde: string) => void;
  opVerlaat: () => void;
}) {
  const id = `veld-${veld.name}`;
  // Groen alleen voor wat echt ingevuld is: een leeg optioneel veld is niet
  // fout, maar ook niets om af te vinken.
  const goed = beoordeeld && !fout && waarde.trim() !== "";
  const rand = fout
    ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
    : goed
      ? "border-green-500 focus:border-green-600 focus:ring-green-600/15"
      : "border-gray-200 focus:border-primary focus:ring-primary/20";
  const klasse = `w-full rounded-xl border bg-white px-4 py-3 pr-11 text-gray-900 outline-none transition focus:ring-2 ${rand}`;
  const gemeen = {
    id,
    name: veld.name,
    value: waarde,
    placeholder: veld.placeholder,
    autoComplete: veld.autoComplete,
    required: veld.verplicht,
    "aria-invalid": Boolean(fout),
    "aria-describedby": fout ? `${id}-fout` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => opWijzig(e.target.value),
    onBlur: opVerlaat,
  };

  return (
    <div className={veld.breed || veld.meerRegels ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {veld.label}{" "}
        {veld.verplicht ? <span className="text-primary">*</span> : <span className="font-normal text-gray-400">(optioneel)</span>}
      </label>
      <div className="relative">
        {veld.meerRegels ? (
          <textarea {...gemeen} rows={5} className={klasse} />
        ) : (
          <input {...gemeen} type={veld.type ?? "text"} className={klasse} />
        )}
        {(goed || fout) && (
          <span className={`pointer-events-none absolute right-4 top-3.5 ${goed ? "text-green-600" : "text-red-500"}`}>
            {goed ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </span>
        )}
      </div>
      {fout && (
        <p id={`${id}-fout`} className="mt-1.5 text-sm text-red-600">
          {fout}
        </p>
      )}
    </div>
  );
}
