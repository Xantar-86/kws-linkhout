"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { haalSeizoenInBrowser, type SeizoenWedstrijd } from "@/lib/rbfa";
import {
  bouwChatGptOpdracht,
  bouwTekst,
  overzichtPloegen,
  weekendVan,
  wedstrijdenInWeekend,
  MAANDEN,
  type OverzichtPloeg,
} from "@/lib/weekoverzicht";
import { tekenBeeld, verdeel } from "./teken";

/**
 * Haalt de kalender van elke ploeg op in de browser (de bond weigert onze
 * server), tekent het overzicht en biedt het aan om te downloaden of te delen.
 */

const wachten = (ms: number) => new Promise((klaar) => setTimeout(klaar, ms));

type Geladen = { ploeg: OverzichtPloeg; seizoen: SeizoenWedstrijd[] };

const geenAbonnement = () => () => {};

/** Kan deze browser bestanden delen (gsm)? Dan tonen we de deelknop. */
function kanBestandenDelen(): boolean {
  try {
    const proef = new File([new Blob(["x"], { type: "image/png" })], "proef.png", { type: "image/png" });
    return !!navigator.canShare?.({ files: [proef] });
  } catch {
    return false;
  }
}

function korteDatum(d: Date): string {
  return `${d.getDate()} ${MAANDEN[d.getMonth()]}`;
}

export default function WeekoverzichtClient() {
  const [geladen, setGeladen] = useState<Geladen[] | null>(null);
  const [voortgang, setVoortgang] = useState({ klaar: 0, totaal: 0 });
  const [mislukt, setMislukt] = useState<string[]>([]);
  const [verschuiving, setVerschuiving] = useState(0);
  const [melding, setMelding] = useState("");
  const canvassen = useRef<(HTMLCanvasElement | null)[]>([]);

  // Alle ploegen een voor een ophalen, zodat de bond niet overstelpt wordt.
  useEffect(() => {
    let gestopt = false;
    (async () => {
      const ploegen = overzichtPloegen();
      setVoortgang({ klaar: 0, totaal: ploegen.length });
      const resultaat: Geladen[] = [];
      const fout: string[] = [];
      for (const ploeg of ploegen) {
        if (gestopt) return;
        try {
          resultaat.push({ ploeg, seizoen: await haalSeizoenInBrowser(ploeg.rbfaId) });
        } catch {
          fout.push(ploeg.label);
        }
        setVoortgang((v) => ({ ...v, klaar: v.klaar + 1 }));
        await wachten(120);
      }
      if (!gestopt) {
        setGeladen(resultaat);
        setMislukt(fout);
      }
    })();
    return () => {
      gestopt = true;
    };
  }, []);

  const kanDelen = useSyncExternalStore(geenAbonnement, kanBestandenDelen, () => false);

  const { van, tot } = useMemo(() => {
    const basis = new Date();
    basis.setDate(basis.getDate() + verschuiving * 7);
    return weekendVan(basis);
  }, [verschuiving]);

  const wedstrijden = useMemo(
    () => (geladen ? wedstrijdenInWeekend(geladen, van, tot) : []),
    [geladen, van, tot]
  );
  const beelden = useMemo(() => verdeel(wedstrijden), [wedstrijden]);
  const tekst = useMemo(() => bouwTekst(wedstrijden, van), [wedstrijden, van]);
  const opdracht = useMemo(() => bouwChatGptOpdracht(wedstrijden, van), [wedstrijden, van]);

  useEffect(() => {
    if (!geladen) return;
    beelden.forEach((beeld, i) => {
      const c = canvassen.current[i];
      if (c) void tekenBeeld(c, beeld, wedstrijden, van, i + 1, beelden.length);
    });
  }, [geladen, beelden, wedstrijden, van]);

  const toon = useCallback((t: string) => {
    setMelding(t);
    setTimeout(() => setMelding(""), 2500);
  }, []);

  const zat = new Date(van);
  zat.setDate(van.getDate() + 1);
  const zon = new Date(van);
  zon.setDate(van.getDate() + 2);

  const bestandsnaam = (i: number) => {
    const d = `${zat.getFullYear()}-${String(zat.getMonth() + 1).padStart(2, "0")}-${String(zat.getDate()).padStart(2, "0")}`;
    return `kws-weekoverzicht-${d}${beelden.length > 1 ? `-${i + 1}` : ""}.png`;
  };

  const alsBestand = (i: number): Promise<File | null> =>
    new Promise((klaar) => {
      const c = canvassen.current[i];
      if (!c) return klaar(null);
      c.toBlob((blob) => klaar(blob ? new File([blob], bestandsnaam(i), { type: "image/png" }) : null), "image/png");
    });

  async function download() {
    for (let i = 0; i < beelden.length; i++) {
      const bestand = await alsBestand(i);
      if (!bestand) continue;
      const url = URL.createObjectURL(bestand);
      const a = document.createElement("a");
      a.href = url;
      a.download = bestand.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      await wachten(300);
    }
  }

  async function deel() {
    const bestanden = (await Promise.all(beelden.map((_, i) => alsBestand(i)))).filter(
      (b): b is File => !!b
    );
    try {
      await navigator.clipboard.writeText(tekst).catch(() => undefined);
      await navigator.share({ files: bestanden });
      toon("Gedeeld. De tekst staat ook op het klembord.");
    } catch {
      // Geannuleerd: niets aan de hand.
    }
  }

  async function kopieer(t: string, wat: string) {
    try {
      await navigator.clipboard.writeText(t);
      toon(`${wat} gekopieerd`);
    } catch {
      toon("Kopiëren lukte niet, selecteer de tekst met de hand");
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0b0b] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold">Weekoverzicht voor sociale media</h1>
        <p className="mt-2 text-white/70">
          Alle wedstrijden van alle ploegen, rechtstreeks van de RBFA. Download het beeld, kopieer de
          tekst en post het zelf op Facebook en Instagram.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setVerschuiving((v) => v - 1)}
            className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10"
          >
            Vorig weekend
          </button>
          <div className="min-w-[14rem] text-center text-lg font-semibold">
            Vrijdag {korteDatum(van)} tot zondag {korteDatum(zon)}
          </div>
          <button
            onClick={() => setVerschuiving((v) => v + 1)}
            className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10"
          >
            Volgend weekend
          </button>
          {verschuiving !== 0 && (
            <button onClick={() => setVerschuiving(0)} className="text-sm text-white/60 underline">
              terug naar dit weekend
            </button>
          )}
        </div>

        {!geladen && (
          <div className="mt-10 rounded-xl bg-white/5 p-6">
            <p>
              Wedstrijden ophalen bij de RBFA: {voortgang.klaar} van {voortgang.totaal} ploegen...
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded bg-white/10">
              <div
                className="h-full bg-[#9e1b1b] transition-all"
                style={{ width: `${voortgang.totaal ? (voortgang.klaar / voortgang.totaal) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {geladen && (
          <>
            {mislukt.length > 0 && (
              <p className="mt-6 rounded-lg bg-yellow-500/15 p-3 text-yellow-200">
                Niet opgehaald (probeer de pagina te herladen): {mislukt.join(", ")}
              </p>
            )}
            {geladen.length === 0 && (
              <p className="mt-6 rounded-lg bg-red-500/15 p-3 text-red-200">
                De RBFA gaf niets terug. Herlaad de pagina binnen een paar minuten.
              </p>
            )}

            <p className="mt-6 text-white/70">
              {wedstrijden.length} wedstrijden, {beelden.length === 1 ? "1 beeld" : `${beelden.length} beelden (carrousel)`}.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={download}
                className="rounded-lg bg-[#9e1b1b] px-5 py-3 font-semibold hover:bg-[#b52222]"
              >
                {beelden.length === 1 ? "Beeld downloaden" : "Beelden downloaden"}
              </button>
              {kanDelen && (
                <button
                  onClick={deel}
                  className="rounded-lg bg-white px-5 py-3 font-semibold text-black hover:bg-white/90"
                >
                  Delen (Facebook, Instagram...)
                </button>
              )}
              <button
                onClick={() => kopieer(tekst, "Tekst")}
                className="rounded-lg border border-white/30 px-5 py-3 font-semibold hover:bg-white/10"
              >
                Tekst kopiëren
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {beelden.map((_, i) => (
                <canvas
                  key={`${van.getTime()}-${i}-${beelden.length}`}
                  ref={(el) => {
                    canvassen.current[i] = el;
                  }}
                  width={1080}
                  height={1350}
                  className="h-auto w-full rounded-lg shadow-2xl"
                />
              ))}
            </div>

            <h2 className="mt-10 text-xl font-semibold">Tekst bij de post</h2>
            <textarea
              readOnly
              value={tekst}
              rows={Math.min(30, tekst.split("\n").length + 1)}
              className="mt-2 w-full rounded-lg bg-white/5 p-4 font-mono text-sm text-white/90"
            />

            <details className="mt-8 rounded-lg bg-white/5 p-4">
              <summary className="cursor-pointer font-semibold">Liever een affiche uit ChatGPT?</summary>
              <p className="mt-3 text-sm text-white/70">
                Kopieer deze opdracht naar ChatGPT en voeg het clublogo toe als bijlage. Controleer daarna
                elk uur en elke naam: een AI-beeld verschrijft geregeld een tijd of ploeg. Het beeld
                hierboven klopt altijd.
              </p>
              <button
                onClick={() => kopieer(opdracht, "Opdracht")}
                className="mt-3 rounded-lg border border-white/30 px-4 py-2 text-sm hover:bg-white/10"
              >
                Opdracht kopiëren
              </button>
              <pre className="mt-3 whitespace-pre-wrap text-xs text-white/60">{opdracht}</pre>
            </details>
          </>
        )}

        {melding && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-white px-4 py-2 font-semibold text-black shadow-xl">
            {melding}
          </div>
        )}
      </div>
    </main>
  );
}
