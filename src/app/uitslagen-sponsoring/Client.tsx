"use client";

import { useEffect, useMemo, useState } from "react";
import { teams, type Team } from "@/lib/teams";
import {
  haalKlassementInBrowser,
  haalSeizoenInBrowser,
  rbfaTeamId,
  type Klassement,
  type SeizoenWedstrijd,
} from "@/lib/rbfa";
import { SPONSORS } from "@/components/home/SponsorsSection";

/**
 * Het tv-scherm in de kantine.
 *
 * Om beurten één ploeg: haar laatste uitslagen, de volgende wedstrijd en het
 * volledige klassement. Na elke twee ploegen een scherm met alle sponsors, en
 * onder elke ploeg staan de sponsors ook in een strook. Enkel ploegen met een
 * klassement komen aan bod; voor de jongste jeugd toont de bond er geen.
 *
 * Alles wordt in de browser van de tv opgehaald, zoals op de ploegpagina's:
 * de bond laat sinds oktober 2026 enkel echte browsers toe. Elk half uur
 * opnieuw, en om de paar uur laadt de pagina zichzelf opnieuw, zodat een
 * nieuwe versie van de site vanzelf op de tv komt.
 *
 * Het scherm is gemaakt voor een liggende tv (16:9) en past altijd zonder
 * scrollen: maten in vh en vw. Met ?ploeg=25&sponsor=12 in het adres stel je
 * in hoeveel seconden een ploeg en een sponsorscherm blijven staan.
 */

const STANDAARD_PLOEG_S = 20;
const STANDAARD_SPONSOR_S = 12;
const PLOEGEN_PER_SPONSOR = 2;
const VERVERS_MS = 30 * 60_000;
const HERLAAD_MS = 3 * 60 * 60_000;

interface PloegScherm {
  team: Team;
  klassement: Klassement;
  seizoen: SeizoenWedstrijd[];
}

type Dia = { soort: "ploeg"; ploeg: PloegScherm } | { soort: "sponsors" };

const wachten = (ms: number) => new Promise((klaar) => setTimeout(klaar, ms));

/** Alle ploegen met een klassement, één voor één, zodat de bond niet overstelpt wordt. */
async function haalAlles(): Promise<PloegScherm[]> {
  const gevonden: PloegScherm[] = [];
  for (const team of teams) {
    const id = rbfaTeamId([team.standingsIframe, team.calendarIframe]);
    if (!id) continue;
    try {
      const klassement = await haalKlassementInBrowser(id, 99);
      if (klassement) {
        const seizoen = await haalSeizoenInBrowser(id).catch(() => []);
        gevonden.push({ team, klassement, seizoen });
      }
    } catch {
      // Een ploeg die niet lukt, slaan we over; de rest gaat door.
    }
    await wachten(150);
  }
  return gevonden;
}

function leesSeconden(naam: string, standaard: number): number {
  try {
    const waarde = Number(new URLSearchParams(window.location.search).get(naam));
    return Number.isFinite(waarde) && waarde >= 3 ? waarde : standaard;
  } catch {
    return standaard;
  }
}

export default function TvClient() {
  const [ploegen, setPloegen] = useState<PloegScherm[] | null>(null);
  const [mislukt, setMislukt] = useState(false);
  const [nr, setNr] = useState(0);
  const [nu, setNu] = useState<Date | null>(null);
  const [tijden, setTijden] = useState({ ploeg: STANDAARD_PLOEG_S, sponsor: STANDAARD_SPONSOR_S });

  useEffect(() => {
    setTijden({
      ploeg: leesSeconden("ploeg", STANDAARD_PLOEG_S),
      sponsor: leesSeconden("sponsor", STANDAARD_SPONSOR_S),
    });
    let weg = false;
    async function laad() {
      const lijst = await haalAlles();
      if (weg) return;
      // Lukt een latere ronde niet, dan blijft de vorige stand staan.
      if (lijst.length > 0) {
        setPloegen(lijst);
        setMislukt(false);
      } else {
        setMislukt(true);
        setPloegen((vorige) => vorige ?? []);
      }
    }
    laad();
    const ververs = setInterval(laad, VERVERS_MS);
    const herlaad = setTimeout(() => window.location.reload(), HERLAAD_MS);
    return () => {
      weg = true;
      clearInterval(ververs);
      clearTimeout(herlaad);
    };
  }, []);

  // De klok rechtsboven.
  useEffect(() => {
    setNu(new Date());
    const klok = setInterval(() => setNu(new Date()), 15_000);
    return () => clearInterval(klok);
  }, []);

  // De volgorde: twee ploegen, sponsors, twee ploegen, sponsors, ...
  const dias = useMemo<Dia[]>(() => {
    const lijst: Dia[] = [];
    (ploegen ?? []).forEach((ploeg, i) => {
      lijst.push({ soort: "ploeg", ploeg });
      if ((i + 1) % PLOEGEN_PER_SPONSOR === 0) lijst.push({ soort: "sponsors" });
    });
    if (lijst.length === 0 || lijst[lijst.length - 1].soort !== "sponsors") {
      lijst.push({ soort: "sponsors" });
    }
    return lijst;
  }, [ploegen]);

  const dia = dias[nr % dias.length];
  const duur = (dia?.soort === "ploeg" ? tijden.ploeg : tijden.sponsor) * 1000;

  // Naar de volgende dia.
  useEffect(() => {
    if (!ploegen) return;
    const klok = setTimeout(() => setNr((n) => (n + 1) % dias.length), duur);
    return () => clearTimeout(klok);
  }, [nr, duur, dias.length, ploegen]);

  return (
    <main className="relative flex h-dvh w-screen cursor-none flex-col overflow-hidden bg-inkt-900 text-white">
      <Kop
        titel={dia?.soort === "ploeg" ? dia.ploeg.team.name : "Onze sponsors"}
        onder={dia?.soort === "ploeg" ? dia.ploeg.klassement.reeks : "Zij maken het mogelijk"}
        nu={nu}
      />

      {/* Hoe lang deze dia nog blijft staan. */}
      <div className="h-[0.5vh] w-full bg-white/10">
        {ploegen && (
          <div
            key={nr}
            className="h-full bg-primary"
            style={{ animation: `tv-balk ${duur}ms linear forwards` }}
          />
        )}
      </div>
      <style>{`@keyframes tv-balk { from { width: 0 } to { width: 100% } }`}</style>

      <div className="min-h-0 flex-1">
        {!ploegen ? (
          <div className="flex h-full items-center justify-center text-[3vh] text-white/60">
            De uitslagen worden opgehaald...
          </div>
        ) : dia?.soort === "ploeg" ? (
          <PloegDia key={nr} ploeg={dia.ploeg} />
        ) : (
          <SponsorDia key={nr} melding={mislukt && ploegen.length === 0} />
        )}
      </div>

      {dia?.soort === "ploeg" && <SponsorStrook />}
    </main>
  );
}

function Kop({ titel, onder, nu }: { titel: string; onder: string; nu: Date | null }) {
  return (
    <header className="flex h-[11vh] shrink-0 items-center gap-[1.5vw] px-[2.5vw]">
      <img src="/images/logo-kws.png" alt="KWS Linkhout" className="h-[8vh] w-auto" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[4.2vh] font-bold leading-tight">{titel}</p>
        <p className="truncate text-[2.2vh] text-white/60">{onder}</p>
      </div>
      {nu && (
        <p className="flex items-baseline gap-[1.2vw] text-white/80">
          <span className="inline-block text-[2.8vh] text-white/60 first-letter:uppercase">
            {nu.toLocaleDateString("nl-BE", { weekday: "long", day: "numeric", month: "long" })}
          </span>
          <span className="font-display text-[4.5vh] font-bold tabular-nums">
            {nu.toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </p>
      )}
    </header>
  );
}

function datumKort(iso: string): string {
  return new Date(iso).toLocaleDateString("nl-BE", { weekday: "short", day: "numeric", month: "short" });
}

function Logo({ src, naam, maat }: { src: string | null; naam: string; maat: string }) {
  if (!src) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-white/10 font-bold text-white/70"
        style={{ width: maat, height: maat, fontSize: `calc(${maat} * 0.4)` }}
      >
        {naam.slice(0, 1)}
      </span>
    );
  }
  return <img src={src} alt="" className="shrink-0 object-contain" style={{ width: maat, height: maat }} />;
}

function PloegDia({ ploeg }: { ploeg: PloegScherm }) {
  const gespeeld = ploeg.seizoen
    .filter((w) => w.toestand === "gespeeld")
    .sort((a, b) => b.start.localeCompare(a.start));
  const laatste = gespeeld[0];
  const vorige = gespeeld.slice(1, 4);
  const volgende = ploeg.seizoen
    .filter((w) => w.toestand === "gepland" && new Date(w.start).getTime() > Date.now())
    .sort((a, b) => a.start.localeCompare(b.start))[0];
  const rijen = ploeg.klassement.venster;

  return (
    <div className="tv-in grid h-full grid-cols-[42fr_58fr] gap-[2vw] px-[2.5vw] py-[2vh]">
      {/* Links: de uitslagen. */}
      <div className="flex min-h-0 flex-col gap-[2vh]">
        <p className="text-[2vh] font-semibold uppercase tracking-wider text-white/50">Laatste uitslag</p>
        {laatste ? (
          <div className="rounded-[1.5vh] bg-white/10 px-[1.5vw] py-[2.5vh]">
            <p className="text-[1.9vh] text-white/60">
              {datumKort(laatste.start)}
              {laatste.beker && " · beker"}
            </p>
            <div className="mt-[1.5vh] grid grid-cols-[1fr_auto_1fr] items-center gap-[1vw]">
              <Ploegnaam naam={laatste.thuisNaam} logo={laatste.thuisLogo} wij={laatste.eigenThuis} />
              <p
                className={
                  "rounded-[1vh] px-[1vw] py-[0.5vh] font-display text-[7vh] font-bold leading-none tabular-nums " +
                  (laatste.resultaat === "W"
                    ? "bg-green-600"
                    : laatste.resultaat === "V"
                      ? "bg-primary"
                      : "bg-white/20")
                }
              >
                {laatste.thuisScore} - {laatste.uitScore}
              </p>
              <Ploegnaam naam={laatste.uitNaam} logo={laatste.uitLogo} wij={!laatste.eigenThuis} />
            </div>
          </div>
        ) : (
          <p className="text-[2.4vh] text-white/50">Nog geen wedstrijd gespeeld.</p>
        )}

        {vorige.length > 0 && (
          <>
            <p className="text-[2vh] font-semibold uppercase tracking-wider text-white/50">Daarvoor</p>
            <ul className="flex flex-col gap-[1vh]">
              {vorige.map((w) => (
                <li
                  key={w.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-[1vw] rounded-[1vh] bg-white/5 px-[1vw] py-[1vh] text-[2.2vh]"
                >
                  <span
                    className={
                      "flex h-[3.4vh] w-[3.4vh] items-center justify-center rounded-[0.6vh] text-[1.8vh] font-bold " +
                      (w.resultaat === "W" ? "bg-green-600" : w.resultaat === "V" ? "bg-primary" : "bg-white/25")
                    }
                  >
                    {w.resultaat === "W" ? "W" : w.resultaat === "V" ? "V" : "G"}
                  </span>
                  <span className="truncate">
                    {w.eigenThuis ? w.uitNaam : w.thuisNaam}
                    <span className="text-white/50"> {w.eigenThuis ? "thuis" : "uit"}</span>
                  </span>
                  <span className="font-display font-bold tabular-nums">
                    {w.thuisScore} - {w.uitScore}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {volgende && (
          <div className="mt-auto rounded-[1.5vh] border-2 border-white/15 px-[1.5vw] py-[1.5vh]">
            <p className="text-[2vh] font-semibold uppercase tracking-wider text-white/50">Volgende wedstrijd</p>
            <p className="mt-[0.5vh] truncate text-[2.8vh] font-semibold">
              {volgende.eigenThuis ? volgende.uitNaam : volgende.thuisNaam}
              <span className="font-normal text-white/60"> {volgende.eigenThuis ? "thuis" : "uit"}</span>
            </p>
            <p className="text-[2.2vh] text-white/70">
              {new Date(volgende.start).toLocaleDateString("nl-BE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              om{" "}
              {new Date(volgende.start).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        )}
      </div>

      {/* Rechts: het volledige klassement. De rijen delen de hoogte. */}
      <div className="flex min-h-0 flex-col">
        <div className="grid grid-cols-[4vw_1fr_4vw_9vw_5vw_5vw] gap-[0.5vw] px-[1vw] pb-[0.8vh] text-[1.7vh] font-semibold uppercase tracking-wider text-white/50">
          <span>#</span>
          <span>Ploeg</span>
          <span className="text-right">M</span>
          <span className="text-center">W - G - V</span>
          <span className="text-right">+/-</span>
          <span className="text-right">Ptn</span>
        </div>
        <ol
          className="grid min-h-0 flex-1 gap-[0.4vh]"
          style={{ gridTemplateRows: `repeat(${rijen.length}, minmax(0, 1fr))` }}
        >
          {rijen.map((r) => (
            <li
              key={r.teamId}
              className={
                "grid grid-cols-[4vw_1fr_4vw_9vw_5vw_5vw] items-center gap-[0.5vw] rounded-[0.8vh] px-[1vw] tabular-nums " +
                (r.wij ? "bg-primary font-bold" : "bg-white/5")
              }
              style={{ fontSize: `min(2.6vh, ${Math.max(1.6, 36 / rijen.length)}vh)` }}
            >
              <span className="font-display font-bold">{r.plaats}</span>
              <span className="flex min-w-0 items-center gap-[0.6vw]">
                <Logo src={r.logo} naam={r.naam} maat="1.6em" />
                <span className="truncate">{r.naam}</span>
              </span>
              <span className="text-right">{r.gespeeld}</span>
              <span className="text-center">
                {r.gewonnen} - {r.gelijk} - {r.verloren}
              </span>
              <span className="text-right">{r.doelsaldo > 0 ? `+${r.doelsaldo}` : r.doelsaldo}</span>
              <span className="text-right font-display font-bold">{r.punten}</span>
            </li>
          ))}
        </ol>
      </div>
      <style>{`.tv-in { animation: tv-in 600ms ease-out both } @keyframes tv-in { from { opacity: 0; transform: translateY(1.5vh) } to { opacity: 1; transform: none } }`}</style>
    </div>
  );
}

function Ploegnaam({ naam, logo, wij }: { naam: string; logo: string | null; wij: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-[1vh] text-center">
      <Logo src={logo} naam={naam} maat="8vh" />
      <p className={"line-clamp-2 text-[2.2vh] leading-tight " + (wij ? "font-bold" : "text-white/80")}>{naam}</p>
    </div>
  );
}

/** De sponsors in een strook onderaan, zoals op de website. */
function SponsorStrook() {
  return (
    <div className="flex h-[14vh] shrink-0 items-center gap-[1.2vw] bg-white px-[2.5vw]">
      <p className="w-[7vw] shrink-0 text-[1.6vh] font-semibold uppercase leading-tight tracking-wider text-slate-500">
        Met dank aan
      </p>
      <div className="grid flex-1 grid-cols-8 items-center gap-[1.2vw]">
        {SPONSORS.map((s) => (
          <div key={s.naam} className="flex h-[9vh] items-center justify-center">
            <img src={s.beeld} alt={s.naam} className="max-h-full max-w-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Een volledig scherm met alle sponsors. */
function SponsorDia({ melding }: { melding: boolean }) {
  return (
    <div className="tv-in flex h-full flex-col bg-zand-50 px-[4vw] pb-[4vh] pt-[3vh] text-inkt-900">
      <p className="text-center font-display text-[5vh] font-bold">
        Met dank aan onze <span className="text-primary">sponsors</span>
      </p>
      <div className="mt-[3vh] grid min-h-0 flex-1 grid-cols-4 grid-rows-2 gap-[2vw]">
        {SPONSORS.map((s) => (
          <div key={s.naam} className="flex items-center justify-center rounded-[2vh] bg-white p-[3vh] shadow-blad">
            <img src={s.beeld} alt={s.naam} className="max-h-full max-w-full object-contain" />
          </div>
        ))}
      </div>
      <p className="mt-[2vh] text-center text-[2.2vh] text-slate-500">
        {melding
          ? "De uitslagen konden niet opgehaald worden; er wordt opnieuw geprobeerd."
          : "Ook sponsor worden? Spreek ons gerust aan of kijk op kwslinkhout.be/sponsoring"}
      </p>
      <style>{`.tv-in { animation: tv-in 600ms ease-out both } @keyframes tv-in { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}
