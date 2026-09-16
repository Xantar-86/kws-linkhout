"use client";

// components/ploeg/KalenderBlok.tsx
//
// De wedstrijdkalender van een ploeg, zelf opgebouwd in plaats van de
// RBFA-site in een venster.
//
// Drie dingen, in de volgorde waarin een supporter ze zoekt: wanneer is de
// volgende wedstrijd, wat komt er daarna, en hoe zijn de laatste afgelopen.
// De rest van het seizoen staat een klik verder op de site van de bond.
//
// Bewust licht, onder het donkere klassement: twee donkere blokken na elkaar
// lezen als één zware massa.

import { useState } from "react";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { SeizoenWedstrijd } from "@/lib/rbfa";

const ZONE = "Europe/Brussels";

function dag(iso: string) {
  return new Date(iso).toLocaleDateString("nl-BE", { weekday: "short", timeZone: ZONE }).replace(".", "");
}
function datum(iso: string) {
  return new Date(iso).toLocaleDateString("nl-BE", { day: "numeric", month: "short", timeZone: ZONE }).replace(".", "");
}
function uur(iso: string) {
  return new Date(iso).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit", timeZone: ZONE });
}

/** De eigen ploeg heet bij de bond telkens anders ("WS Linkhout A", "W.S. LINKHOUT A"). */
function naam(w: SeizoenWedstrijd, kant: "thuis" | "uit") {
  const eigen = kant === "thuis" ? w.eigenThuis : !w.eigenThuis;
  return eigen ? "KWS Linkhout" : kant === "thuis" ? w.thuisNaam : w.uitNaam;
}

function Logo({ src }: { src: string | null }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zand-200 bg-white">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="h-6 w-6 object-contain" />
      ) : null}
    </span>
  );
}

function Label({ w }: { w: SeizoenWedstrijd }) {
  if (w.toestand === "uitgesteld") {
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.6875rem] font-semibold text-amber-800">Uitgesteld</span>;
  }
  if (w.beker) {
    return <span className="rounded-full bg-zand-100 px-2 py-0.5 text-[0.6875rem] font-semibold text-gray-600">Beker</span>;
  }
  return null;
}

const RESULTAAT = {
  W: { tekst: "W", klasse: "bg-emerald-600 text-white", uitleg: "Gewonnen" },
  G: { tekst: "G", klasse: "bg-gray-400 text-white", uitleg: "Gelijk" },
  V: { tekst: "V", klasse: "bg-primary text-white", uitleg: "Verloren" },
} as const;

export function KalenderBlok({
  seizoen,
  link,
  nu = new Date().toISOString(),
}: {
  seizoen: SeizoenWedstrijd[];
  /** De volledige kalender op de RBFA-site. */
  link: string;
  nu?: string;
}) {
  const [allesTonen, setAllesTonen] = useState(false);

  const komend = seizoen
    .filter((w) => w.toestand !== "gespeeld" && w.start >= nu)
    .sort((a, b) => a.start.localeCompare(b.start));
  // Ook wat voorbij is zonder uitslag: bij de jongste jeugd (tot en met U13)
  // publiceert de bond geen scores, maar gespeeld is er wel.
  const gespeeld = seizoen
    .filter((w) => w.toestand === "gespeeld" || (w.toestand !== "uitgesteld" && w.start < nu))
    .sort((a, b) => b.start.localeCompare(a.start));
  const metScores = gespeeld.some((w) => w.thuisScore != null);

  const volgende = komend[0];
  const straks = allesTonen ? komend.slice(1) : komend.slice(1, 6);
  const uitslagen = allesTonen ? gespeeld : gespeeld.slice(0, 5);
  const meer = komend.length - 1 > 5 || gespeeld.length > 5;

  return (
    <div className="overflow-hidden rounded-2xl border border-zand-200/70 bg-white shadow-lg">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zand-200/70 px-6 py-5 md:px-8">
        <div>
          <p className="opschrift">
            <CalendarDays className="h-4 w-4" />
            Wedstrijdkalender
          </p>
          <h2 className="heading-3 mt-2">Seizoen {seizoenNaam(seizoen)}</h2>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-primary"
        >
          Volledige kalender op RBFA
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* De volgende wedstrijd */}
      {volgende ? (
        <div className="border-b border-zand-200/70 bg-zand-50 px-6 py-6 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Volgende wedstrijd</p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex shrink-0 items-center gap-4">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-primary text-white">
                <span className="text-[0.6875rem] font-semibold uppercase leading-none">{dag(volgende.start)}</span>
                <span className="mt-1 font-display text-xl font-extrabold leading-none">{datum(volgende.start).split(" ")[0]}</span>
                <span className="mt-0.5 text-[0.6875rem] uppercase leading-none">{datum(volgende.start).split(" ")[1]}</span>
              </div>
              <div className="md:hidden">
                <p className="font-display text-2xl font-bold tabular-nums">{uur(volgende.start)}</p>
                <Label w={volgende} />
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              {(["thuis", "uit"] as const).map((kant) => (
                <div key={kant} className="flex items-center gap-3">
                  <Logo src={kant === "thuis" ? volgende.thuisLogo : volgende.uitLogo} />
                  <span
                    className={`min-w-0 truncate ${
                      (kant === "thuis") === volgende.eigenThuis ? "font-bold text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {naam(volgende, kant)}
                  </span>
                </div>
              ))}
            </div>

            <div className="hidden shrink-0 text-right md:block">
              <p className="font-display text-3xl font-bold tabular-nums">{uur(volgende.start)}</p>
              <div className="mt-1 flex justify-end">
                <Label w={volgende} />
              </div>
            </div>
          </div>
          {volgende.veld && (
            <p className="mt-4 flex items-start gap-1.5 text-sm text-gray-500">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {[volgende.veld.naam, volgende.veld.straat, volgende.veld.gemeente].filter(Boolean).join(", ")}
              </span>
            </p>
          )}
        </div>
      ) : (
        <p className="border-b border-zand-200/70 bg-zand-50 px-6 py-6 text-gray-500 md:px-8">
          Er staan geen wedstrijden meer gepland.
        </p>
      )}

      {/* Wat daarna komt, en hoe het de vorige keren afliep */}
      <div className="grid md:grid-cols-2 md:divide-x md:divide-zand-200/70">
        <Lijst titel="Daarna" leeg="Geen verdere wedstrijden gepland.">
          {straks.map((w) => (
            <Rij key={w.id} w={w}>
              <span className="text-right text-sm tabular-nums text-gray-600">{uur(w.start)}</span>
            </Rij>
          ))}
        </Lijst>

        <Lijst titel={metScores ? "Uitslagen" : "Gespeeld"} leeg="Nog geen wedstrijden gespeeld.">
          {uitslagen.map((w) => {
            const r = w.resultaat ? RESULTAAT[w.resultaat] : null;
            return (
              <Rij key={w.id} w={w}>
                <span className="flex items-center justify-end gap-2">
                  {w.thuisScore != null && (
                    <span className="text-sm font-bold tabular-nums text-gray-900">
                      {w.thuisScore} - {w.uitScore}
                    </span>
                  )}
                  {r && (
                    <span
                      title={r.uitleg}
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[0.6875rem] font-bold ${r.klasse}`}
                    >
                      {r.tekst}
                    </span>
                  )}
                </span>
              </Rij>
            );
          })}
        </Lijst>
      </div>

      {meer && (
        <div className="border-t border-zand-200/70 px-6 py-4 text-center md:px-8">
          <button
            type="button"
            onClick={() => setAllesTonen((v) => !v)}
            className="text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900"
          >
            {allesTonen ? "Minder tonen" : "Hele seizoen tonen"}
          </button>
        </div>
      )}
    </div>
  );
}

/** "2026-2027", uit de eerste en de laatste wedstrijd. */
function seizoenNaam(seizoen: SeizoenWedstrijd[]) {
  if (seizoen.length === 0) return "";
  const jaren = seizoen.map((w) => Number(w.start.slice(0, 4)));
  const min = Math.min(...jaren);
  const max = Math.max(...jaren);
  return min === max ? String(min) : `${min}-${max}`;
}

function Lijst({ titel, leeg, children }: { titel: string; leeg: string; children: React.ReactNode[] }) {
  return (
    <div className="px-6 py-5 md:px-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{titel}</p>
      {children.length ? (
        <ul className="mt-3 divide-y divide-zand-200/70">{children}</ul>
      ) : (
        <p className="mt-3 text-sm text-gray-500">{leeg}</p>
      )}
    </div>
  );
}

function Rij({ w, children }: { w: SeizoenWedstrijd; children: React.ReactNode }) {
  const tegenstander = w.eigenThuis ? w.uitNaam : w.thuisNaam;
  const logo = w.eigenThuis ? w.uitLogo : w.thuisLogo;
  return (
    <li className="grid grid-cols-[3.25rem_1fr_auto] items-center gap-3 py-2.5">
      <span className="text-xs leading-tight text-gray-500">
        <span className="block font-semibold uppercase text-gray-700">{dag(w.start)}</span>
        {datum(w.start)}
      </span>
      <span className="flex min-w-0 items-center gap-2.5">
        <Logo src={logo} />
        <span className="min-w-0">
          <span className="block truncate text-sm text-gray-900">{tegenstander}</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            {w.eigenThuis ? "Thuis" : "Uit"}
            <Label w={w} />
          </span>
        </span>
      </span>
      {children}
    </li>
  );
}
