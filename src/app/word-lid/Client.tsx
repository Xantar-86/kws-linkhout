"use client";

// app/word-lid/Client.tsx
//
// De pagina waar een ouder of een speler beslist om aan te sluiten.
//
// Alles wat daarvoor nodig is, staat hier op één plek: de drie stappen, het
// lidgeld per leeftijd, wie je aanspreekt en de vragen die iedereen stelt.
// Voordien was dit een rubriek in de clubinfo, achter /clubinfo/sectie?slug=,
// zonder eigen adres en zonder eigen titel. Voor de belangrijkste pagina van
// de club is dat de verkeerde plaats.

import { CalendarDays, ClipboardList, CreditCard, HandCoins, IdCard, Mail, Phone, UserPlus } from "lucide-react";
import Link from "next/link";
import { PaginaKop } from "@/components/PaginaKop";
import { SectieKop } from "@/components/SectieKop";
import { Onthul } from "@/components/beweging/Onthul";
import { trap } from "@/lib/beweging";
import { FORMULIER, VRAGEN } from "./inhoud";

const STAPPEN = [
  {
    icoon: CalendarDays,
    titel: "Kom eerst eens proberen",
    tekst:
      "Een training meepikken kan altijd en verplicht tot niets. Laat even weten hoe oud je bent " +
      "of hoe oud je kind is, dan zeggen we bij welke ploeg en op welke dag je welkom bent.",
  },
  {
    icoon: ClipboardList,
    titel: "Vul het inschrijvingsformulier in",
    tekst:
      "Eén formulier voor de jeugd en de dames, voor het seizoen 2026-2027. Je vult je e-mailadres " +
      "in en of je al bij de club aangesloten bent.",
  },
  {
    icoon: CreditCard,
    titel: "Bevestiging en betaling",
    tekst:
      "Je krijgt een bevestigingsmail met de verdere stappen en de betaalinstructies. Daarna " +
      "regelen wij de aansluiting bij de voetbalbond.",
  },
];

const LIDGELD = [
  { groep: "U5, de Voetbaltuin", bedrag: "€ 130", nota: "€ 160 bij aansluiting bij de Bond" },
  { groep: "U6 tot en met U9, en WU9", bedrag: "€ 295", nota: "" },
  { groep: "U10 tot en met U13, en WU13", bedrag: "€ 320", nota: "" },
  { groep: "U15 tot en met U17, en WU16 tot WU20", bedrag: "€ 350", nota: "" },
  { groep: "Senioren heren (P2 en P4) en dames (P1)", bedrag: "€ 400", nota: "" },
];

const CONTACTEN = [
  {
    voor: "Jeugd",
    naam: "Maarten Cleeren",
    rol: "AVJO, algemeen verantwoordelijke jeugdopleiding",
    mail: "info@kwslinkhout.be",
    tel: "0494 84 36 93",
    telLink: "+32494843693",
  },
  {
    voor: "Dames en meisjes",
    naam: "Ben Jouck",
    rol: "Futbalista",
    mail: "info@kwslinkhout.be",
    tel: "0479 07 35 55",
    telLink: "+32479073555",
  },
  {
    voor: "Senioren",
    naam: "Ramon Fernandez",
    rol: "Sportief verantwoordelijke senioren",
    mail: "info@kwslinkhout.be",
    tel: "0475 61 02 86",
    telLink: "+32475610286",
  },
];

export default function WordLidClient() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PaginaKop
        opschrift="Aansluiten bij de club"
        icoon={UserPlus}
        titel="Kom voetballen bij KWS Linkhout"
        accent="voetballen"
        onder="Van de Voetbaltuin voor de allerkleinsten tot de veteranen, en van de meisjes-U8 tot de eerste damesploeg. Een training meepikken kan altijd, en verplicht tot niets."
      >
        <div className="flex flex-wrap gap-3">
          <a
            href={FORMULIER}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <UserPlus className="h-4 w-4" />
            Inschrijvingsformulier
          </a>
          <a
            href="mailto:info@kwslinkhout.be?subject=Proeftraining"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Eerst eens proberen
          </a>
        </div>
      </PaginaKop>

      {/* De drie stappen */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <SectieKop
            uitlijning="links"
            opschrift="Hoe het werkt"
            titel="In drie stappen aangesloten"
            accent="stappen"
            className="mb-10"
          />

          <ol className="grid gap-6 md:grid-cols-3">
            {STAPPEN.map((stap, i) => {
              const Icoon = stap.icoon;
              return (
                <Onthul als="li" key={stap.titel} vertraging={i * trap.kaart} className="h-full">
                  <div className="kaart h-full p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <Icoon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{stap.titel}</h3>
                    <p className="text-gray-700">{stap.tekst}</p>
                  </div>
                </Onthul>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Lidgeld */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-5xl">
          <SectieKop
            uitlijning="links"
            opschrift="Seizoen 2026-2027"
            titel="Wat het lidgeld kost"
            accent="lidgeld"
            onder="Eén bedrag per seizoen, per leeftijdsgroep. Je krijgt de betaalinstructies in de bevestigingsmail na je inschrijving."
            className="mb-10"
          />

          <Onthul>
            <div className="kaart overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zand-200/70">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900">Leeftijdsgroep</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Per seizoen</th>
                  </tr>
                </thead>
                <tbody>
                  {LIDGELD.map((rij) => (
                    <tr key={rij.groep} className="border-b border-zand-200/70 last:border-b-0">
                      <td className="px-6 py-4 text-gray-700">
                        {rij.groep}
                        {rij.nota && (
                          <span className="block text-sm text-gray-500">{rij.nota}</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right font-bold tabular-nums text-gray-900">
                        {rij.bedrag}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Onthul>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Onthul>
              <div className="kaart h-full p-6">
                <h3 className="mb-3 text-lg font-bold text-gray-900">Wat er inbegrepen is</h3>
                <ul className="lopende-tekst">
                  <li>De verzekering via de voetbalbond</li>
                  <li>De clubkledij: shirt, short en kousen</li>
                  <li>Deelname aan de clubactiviteiten</li>
                </ul>
                <p className="mt-2 text-sm text-gray-500">
                  Voetbalschoenen en scheenbeschermers koop je zelf.
                </p>
              </div>
            </Onthul>

            <Onthul vertraging={trap.kaart}>
              <div className="kaart h-full p-6">
                <div className="mb-3 flex items-center gap-3">
                  <HandCoins className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-gray-900">Als het krap zit</h3>
                </div>
                <p className="text-gray-700">
                  Voetballen bij ons mag niet stranden op het lidgeld. Er is de UiTPAS met
                  kansentarief, er zijn tussenkomsten van de gemeente en van het Sociaal Huis, en bij
                  de club zelf kan je in schijven betalen.
                </p>
                <Link
                  href="/jeugdopleiding/lidgeld-ondersteuning"
                  className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
                >
                  Bekijk wat er mogelijk is
                </Link>
              </div>
            </Onthul>
          </div>
        </div>
      </section>

      {/* Wie spreek je aan */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <SectieKop
            uitlijning="links"
            opschrift="Bij wie kom je terecht"
            titel="Wie je aanspreekt"
            accent="aanspreekt"
            className="mb-10"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {CONTACTEN.map((c, i) => (
              <Onthul key={c.voor} vertraging={i * trap.kaart} className="h-full">
                <div className="kaart h-full p-6">
                  <p className="opschrift mb-3">
                    <span aria-hidden="true" className="h-px w-6 bg-primary/40" />
                    {c.voor}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900">{c.naam}</h3>
                  <p className="mb-4 text-sm text-gray-500">{c.rol}</p>
                  <a
                    href={`mailto:${c.mail}`}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    {c.mail}
                  </a>
                  <a
                    href={`tel:${c.telLink}`}
                    className="mt-1 flex items-center gap-2 text-sm text-gray-700 hover:text-primary"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    {c.tel}
                  </a>
                </div>
              </Onthul>
            ))}
          </div>

          <Onthul className="mt-8">
            <div className="kaart flex flex-wrap items-center gap-4 p-6">
              <IdCard className="h-6 w-6 shrink-0 text-primary" />
              <p className="m-0 flex-1 text-gray-700">
                <b className="text-gray-900">Wat je nodig hebt:</b> een geldige identiteitskaart en
                een pasfoto. Meer vraagt de voetbalbond niet om de aansluiting in orde te brengen.
              </p>
            </div>
          </Onthul>
        </div>
      </section>

      {/* Vragen */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-3xl">
          <SectieKop
            uitlijning="links"
            opschrift="Voor je beslist"
            titel="Vragen die ouders stellen"
            accent="Vragen"
            className="mb-10"
          />

          <div className="flex flex-col gap-4">
            {VRAGEN.map((v, i) => (
              <Onthul key={v.vraag} vertraging={Math.min(i, 4) * 0.05}>
                <details className="kaart group p-6">
                  <summary className="cursor-pointer list-none text-lg font-bold text-gray-900 marker:hidden">
                    {v.vraag}
                  </summary>
                  <p className="mt-3 text-gray-700">{v.antwoord}</p>
                </details>
              </Onthul>
            ))}
          </div>
        </div>
      </section>

      {/* Slot */}
      <section className="korrel lichtrand section-padding relative overflow-hidden bg-inkt-950">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(85%_60%_at_50%_100%,rgba(220,38,38,0.22),transparent_65%)]"
        />
        <div className="container-custom relative max-w-3xl text-center">
          <SectieKop
            donker
            opschrift="Tot op het veld"
            titel="Klaar om aan te sluiten?"
            accent="aan te sluiten?"
            onder="Vul het formulier in, of kom eerst gewoon een training meepikken. Beide mag, en beide verplicht tot niets."
            className="mx-auto"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={FORMULIER}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              <UserPlus className="h-5 w-5" />
              Inschrijvingsformulier
            </a>
            <a
              href="mailto:info@kwslinkhout.be?subject=Proeftraining"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Mail className="h-5 w-5" />
              Een proeftraining vragen
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
