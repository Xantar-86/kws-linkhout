"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { haalSeizoenInBrowser, type SeizoenWedstrijd } from "@/lib/rbfa";
import {
  bouwChatGptOpdracht,
  bouwTekst,
  overzichtPloegen,
  weekVan,
  wedstrijdenInWeek,
  MAANDEN,
  type OverzichtPloeg,
} from "@/lib/weekoverzicht";
import { laadOpmaak, tekenBeeld, verdeel, type Opmaak } from "./teken";

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

/** "2026-11-23": de maandag zoals de server ze kent. */
function weekCode(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** De sleutel uit de mail (?t=&week=), en ?auto=1 als de thuis-pc de pagina opent. */
type Sleutel = { t: string; week: string; auto: boolean };

type Resultaat = { ok: boolean; live?: boolean; bericht: string };

/**
 * Instagram weigert beelden smaller dan 4:5; ons beeld is 3:4 of langer.
 * Daarom zetten we het op een breder doek, met een vervaagde kopie als rand.
 */
function naarVierVijf(bron: HTMLCanvasElement): HTMLCanvasElement {
  const h = bron.height;
  const w = Math.max(bron.width, Math.ceil(h * 0.8));
  if (w === bron.width) return bron;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.filter = "blur(40px)";
  ctx.drawImage(bron, -80, -80, w + 160, h + 160);
  ctx.filter = "none";
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bron, Math.round((w - bron.width) / 2), 0);
  return c;
}

/**
 * Voor Facebook en Instagram: JPEG. Instagram aanvaardt via de API enkel JPEG,
 * en twee PNG's samen gingen over de 4,5 MB die Vercel per aanvraag toelaat.
 */
function alsJpeg(c: HTMLCanvasElement, naam: string): Promise<File | null> {
  return new Promise((klaar) =>
    c.toBlob((blob) => klaar(blob ? new File([blob], naam, { type: "image/jpeg" }) : null), "image/jpeg", 0.92)
  );
}

declare global {
  interface Window {
    /** Wat de thuis-pc uitleest om te weten of het plaatsen klaar is. */
    __weekoverzicht?: { klaar: boolean; ok: boolean; bericht: string };
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
  const zoek = useSyncExternalStore(geenAbonnement, () => window.location.search, () => "");
  const sleutel = useMemo<Sleutel | null>(() => {
    const q = new URLSearchParams(zoek);
    const t = q.get("t");
    const week = q.get("week");
    return t && week ? { t, week, auto: q.get("auto") === "1" } : null;
  }, [zoek]);
  const [getekend, setGetekend] = useState("");
  const [geplaatst, setGeplaatst] = useState<{ facebook: string | null; instagram: string | null } | null>(null);
  const [bezig, setBezig] = useState(false);
  const [koppeling, setKoppeling] = useState<{ live: boolean; geldig: boolean; details: string } | null>(null);
  const [resultaat, setResultaat] = useState<Resultaat | null>(null);
  const autoGestart = useRef(false);

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
    return weekVan(basis);
  }, [verschuiving]);

  // Het ChatGPT-sjabloon, als het er is; anders het zelf getekende ontwerp.
  const [opmaak, setOpmaak] = useState<Opmaak | null>(null);
  useEffect(() => {
    void laadOpmaak().then(setOpmaak);
  }, []);

  const wedstrijden = useMemo(
    () => (geladen ? wedstrijdenInWeek(geladen, van, tot) : []),
    [geladen, van, tot]
  );
  const beelden = useMemo(() => (opmaak ? verdeel(wedstrijden) : []), [wedstrijden, opmaak]);
  const tekst = useMemo(() => bouwTekst(wedstrijden, van), [wedstrijden, van]);
  const opdracht = useMemo(() => bouwChatGptOpdracht(wedstrijden, van), [wedstrijden, van]);

  useEffect(() => {
    if (!geladen || !opmaak) return;
    let gestopt = false;
    void Promise.all(
      beelden.map((beeld, i) => {
        const c = canvassen.current[i];
        return c ? tekenBeeld(c, beeld, wedstrijden, van, i + 1, beelden.length, opmaak) : undefined;
      })
    ).then(() => {
      if (!gestopt) setGetekend(weekCode(van));
    });
    return () => {
      gestopt = true;
    };
  }, [geladen, opmaak, beelden, wedstrijden, van]);

  const magPlaatsen = !!sleutel && sleutel.week === weekCode(van);

  // Wat er voor deze week al op Facebook en Instagram staat.
  const vraagStaat = useCallback(() => {
    if (!sleutel) return;
    fetch(`/api/social/weekoverzicht-plaats?week=${sleutel.week}&t=${encodeURIComponent(sleutel.t)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!json) return;
        setGeplaatst(json.geplaatst);
        setKoppeling({ live: json.live, ...json.meta });
      })
      // Niet erg: de knop werkt ook zonder.
      .catch(() => undefined);
  }, [sleutel]);
  useEffect(vraagStaat, [vraagStaat]);

  const stuur = useCallback(
    async (velden: Record<string, string | File>): Promise<Resultaat> => {
      if (!sleutel) return { ok: false, bericht: "Geen sleutel" };
      const form = new FormData();
      form.set("week", sleutel.week);
      form.set("t", sleutel.t);
      for (const [k, v] of Object.entries(velden)) form.set(k, v);
      try {
        const r = await fetch("/api/social/weekoverzicht-plaats", { method: "POST", body: form });
        const json = await r.json().catch(() => ({}));
        if (json.overgeslagen) return { ok: true, bericht: `Niet geplaatst: ${json.overgeslagen}` };
        const regels: string[] = (json.resultaten ?? []).map((x: { bericht: string }) => x.bericht);
        return {
          ok: r.ok && json.ok !== false,
          live: json.live,
          bericht: regels.join(" | ") || json.error || `Fout ${r.status}`,
        };
      } catch (e) {
        return { ok: false, bericht: e instanceof Error ? e.message : String(e) };
      }
    },
    [sleutel]
  );

  const plaats = useCallback(
    async (bron: "pc" | "knop"): Promise<Resultaat> => {
      const c = canvassen.current[0];
      if (!c) return { ok: false, bericht: "Het beeld is er nog niet" };
      const naam = `kws-weekoverzicht-${weekCode(van)}`;
      const [beeld, beeldIg] = await Promise.all([alsJpeg(c, `${naam}.jpg`), alsJpeg(naarVierVijf(c), `${naam}-ig.jpg`)]);
      if (!beeld || !beeldIg) return { ok: false, bericht: "Het beeld kon niet gemaakt worden" };
      return stuur({ bron, tekst, beeld, beeldIg });
    },
    [stuur, tekst, van]
  );

  async function plaatsMetKnop() {
    setBezig(true);
    setResultaat(null);
    const r = await plaats("knop");
    setResultaat(r);
    setBezig(false);
    vraagStaat();
  }

  // De thuis-pc: alles nakijken en dan zelf plaatsen, of melden waarom niet.
  useEffect(() => {
    if (!sleutel?.auto || autoGestart.current || !geladen || verschuiving !== 0) return;
    if (getekend !== weekCode(van)) return;
    autoGestart.current = true;
    void (async () => {
      let r: Resultaat;
      if (sleutel.week !== weekCode(van)) {
        r = await stuur({ bron: "pc", overslaan: `de link is voor de week van ${sleutel.week}, niet voor deze week` });
      } else if (geladen.length === 0) {
        r = await stuur({ bron: "pc", overslaan: "de RBFA gaf geen enkele kalender terug" });
      } else if (mislukt.length > 0) {
        r = await stuur({ bron: "pc", overslaan: `de RBFA gaf niets terug voor ${mislukt.join(", ")}` });
      } else if (wedstrijden.length === 0) {
        r = await stuur({ bron: "pc", overslaan: "er zijn deze week geen wedstrijden" });
      } else {
        r = await plaats("pc");
      }
      setResultaat(r);
      window.__weekoverzicht = { klaar: true, ok: r.ok, bericht: r.bericht };
    })();
  }, [sleutel, geladen, mislukt, wedstrijden, getekend, van, verschuiving, stuur, plaats]);

  const toon = useCallback((t: string) => {
    setMelding(t);
    setTimeout(() => setMelding(""), 2500);
  }, []);

  const zon = new Date(van);
  zon.setDate(van.getDate() + 6);

  const bestandsnaam = (i: number) => {
    const d = `${van.getFullYear()}-${String(van.getMonth() + 1).padStart(2, "0")}-${String(van.getDate()).padStart(2, "0")}`;
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
          Alle wedstrijden van alle ploegen, rechtstreeks van de RBFA. Elke maandag om 18:00 komt
          het vanzelf op Facebook en Instagram. Met de link uit de maandagmail kun je het ook hier
          plaatsen.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setVerschuiving((v) => v - 1)}
            className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10"
          >
            Vorige week
          </button>
          <div className="min-w-[14rem] text-center text-lg font-semibold">
            Maandag {korteDatum(van)} tot zondag {korteDatum(zon)}
          </div>
          <button
            onClick={() => setVerschuiving((v) => v + 1)}
            className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10"
          >
            Volgende week
          </button>
          {verschuiving !== 0 && (
            <button onClick={() => setVerschuiving(0)} className="text-sm text-white/60 underline">
              terug naar deze week
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

            {magPlaatsen && (
              <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-4">
                {geplaatst?.facebook && geplaatst?.instagram ? (
                  <p className="text-green-300">Deze week staat al op Facebook en Instagram.</p>
                ) : (
                  <>
                    <button
                      onClick={plaatsMetKnop}
                      disabled={bezig || wedstrijden.length === 0 || getekend !== weekCode(van)}
                      className="rounded-lg bg-[#1877f2] px-5 py-3 font-semibold hover:bg-[#2d86f5] disabled:opacity-50"
                    >
                      {bezig ? "Bezig met plaatsen..." : "Plaats op Facebook en Instagram"}
                    </button>
                    {geplaatst?.facebook && (
                      <p className="mt-2 text-sm text-white/70">Op Facebook staat het al, enkel Instagram volgt nog.</p>
                    )}
                  </>
                )}
                {koppeling && (
                  <p className={`mt-3 text-sm ${koppeling.geldig ? "text-white/60" : "text-red-300"}`}>
                    {koppeling.geldig ? `Gekoppeld aan ${koppeling.details}` : `Meta-koppeling werkt niet: ${koppeling.details}`}
                    {koppeling.live ? "" : " (proefstand: er wordt niets echt geplaatst)"}
                  </p>
                )}
                {resultaat && (
                  <p className={`mt-3 text-sm ${resultaat.ok ? "text-green-300" : "text-red-300"}`}>
                    {resultaat.live === false ? "Proefstand, er is niets geplaatst: " : ""}
                    {resultaat.bericht}
                  </p>
                )}
              </div>
            )}

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
                  height={1440}
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
