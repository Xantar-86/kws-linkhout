"use client";

import { useActionState, useMemo, useState } from "react";
import {
  LIJNEN,
  TAAK_SCHAAL,
  lijnVanNummer,
  ontbrekend,
  schaal as schaalVoor,
  zichtbaar,
  type Antwoorden,
  type EvalRol,
  type Groep,
  type Instellingen,
  type Opvolging,
  type Schaal,
  type Vraag,
} from "@/lib/jeugd/vragen";
import { Veld, positieNamen } from "./Veld";

type Staat = { fout?: string; ok?: string } | null;

const veld =
  "w-full rounded-lg border border-zand-300 bg-white px-3 py-2.5 text-[15px] text-inkt-900 outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-700/15 disabled:bg-zand-50";

/** Een gezichtje voor de jongste spelers: 1 = bedrukt, 3 = neutraal, 5 = blij. */
function Gezicht({ waarde, aan }: { waarde: number; aan: boolean }) {
  const mond = waarde === 1 ? "M12 25 Q20 18 28 25" : waarde === 3 ? "M12 23 L28 23" : "M12 21 Q20 29 28 21";
  const kleur = waarde === 1 ? "#f59e0b" : waarde === 3 ? "#eab308" : "#16a34a";
  return (
    <svg viewBox="0 0 40 40" className="h-11 w-11" aria-hidden>
      <circle cx="20" cy="20" r="18" fill={aan ? kleur : "#f3efe6"} stroke={aan ? "#1f2937" : "#c9c0ad"} strokeWidth="1.5" />
      <circle cx="14" cy="15" r="2.2" fill="#1f2937" />
      <circle cx="26" cy="15" r="2.2" fill="#1f2937" />
      <path d={mond} stroke="#1f2937" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ScoreKeuze({
  naam,
  schaal,
  smiley,
  waarde,
  onKies,
  uit,
}: {
  naam: string;
  schaal: Schaal;
  smiley: boolean;
  waarde: number | undefined;
  onKies: (w: number) => void;
  uit?: boolean;
}) {
  const gekozen = schaal.find((s) => s.waarde === waarde);
  return (
    <div className="grid gap-1">
      <div role="radiogroup" aria-label={naam} className={smiley ? "flex gap-3" : "flex gap-1.5"}>
        {schaal.map((s) => {
          const aan = s.waarde === waarde;
          return (
            <button
              key={s.waarde}
              type="button"
              role="radio"
              aria-checked={aan}
              aria-label={`${s.label}`}
              title={s.label}
              disabled={uit}
              onClick={() => onKies(s.waarde)}
              className={
                smiley
                  ? `rounded-full p-0.5 transition ${aan ? "ring-2 ring-inkt-900 ring-offset-2" : "opacity-80 hover:opacity-100"}`
                  : `grid h-10 w-10 place-items-center rounded-lg border text-sm font-bold tabular-nums transition ${
                      aan
                        ? "border-primary-700 bg-primary-700 text-white"
                        : "border-zand-300 bg-white text-inkt-800 hover:border-inkt-600"
                    }`
              }
            >
              {smiley ? <Gezicht waarde={s.waarde} aan={aan} /> : s.waarde}
            </button>
          );
        })}
      </div>
      <span className="min-h-4 text-xs text-inkt-600">{gekozen ? gekozen.label : smiley ? "" : `1 = ${schaal[0].label}, 5 = ${schaal.at(-1)!.label}`}</span>
    </div>
  );
}

/** Welke knop ingedrukt werd, in een verborgen veld (React geeft de knop zelf niet mee). */
function zetIndienen(knop: HTMLButtonElement, waarde: string) {
  const veld = knop.form?.elements.namedItem("indienen");
  if (veld instanceof HTMLInputElement) veld.value = waarde;
}

export type FormulierProps = {
  rol: EvalRol;
  groep: Groep;
  inst: Instellingen;
  start: Antwoorden;
  verborgen: Record<string, string>;
  actie?: (vorige: Staat, form: FormData) => Promise<Staat>;
  alleenLezen?: boolean;
  /** Werkpunten van de vorige evaluatie, om op te volgen (enkel trainer). */
  vorigeWerkpunten?: { ronde: string; werkpunten: string[] } | null;
  /** Bij ouders: wie vult in. */
  naamVeld?: { label: string; start: string };
  ingediend?: string | null;
  knopTekst?: string;
};

export function EvaluatieFormulier(props: FormulierProps) {
  const { rol, groep, inst, verborgen, alleenLezen, vorigeWerkpunten, naamVeld } = props;
  const leegActie = async () => null;
  const [staat, actie, bezig] = useActionState(props.actie ?? leegActie, null);
  const [a, setA] = useState<Antwoorden>(() => ({
    ...props.start,
    opvolging:
      props.start.opvolging ?? vorigeWerkpunten?.werkpunten.map((tekst) => ({ tekst, status: "" as const, feedback: "" })),
  }));
  const [toonMist, setToonMist] = useState(false);
  // Gecontroleerd, want React maakt gewone velden leeg na het bewaren.
  const [naam, setNaam] = useState(naamVeld?.start ?? "");

  const rubrieken = useMemo(() => zichtbaar(rol, groep, a.keeper, inst), [rol, groep, a.keeper, inst]);
  const mist = useMemo(() => new Set(ontbrekend(rol, groep, a, inst)), [rol, groep, a, inst]);
  const totaalScores = rubrieken.reduce((n, r) => n + r.vragen.filter((v) => v.soort === "score").length, 0);
  const { schaal, smiley } = schaalVoor(rol, groep);
  const keeperMogelijk = rol === "trainer" && (!inst.keuze?.trainer || inst.keuze.trainer.some((id) => id.startsWith("g")));
  const wpGekozen = rubrieken.some((r) => r.vragen.some((v) => v.soort === "werkpunten"));

  const zet = (f: (x: Antwoorden) => Antwoorden) => setA((x) => f(x));
  const score = (id: string, w: number) => zet((x) => ({ ...x, scores: { ...x.scores, [id]: w } }));
  const tekst = (id: string, t: string) => zet((x) => ({ ...x, teksten: { ...x.teksten, [id]: t } }));

  function vraagBlok(v: Vraag) {
    const rood = toonMist && mist.has(v.id);
    if (v.soort === "score") {
      return (
        <div key={v.id} id={`v-${v.id}`} className={`grid gap-2 rounded-lg p-2 sm:grid-cols-[1fr_auto] sm:items-center ${rood ? "bg-primary-50 ring-1 ring-primary-600" : ""}`}>
          <span className="text-[15px] text-inkt-900">{v.tekst}</span>
          <ScoreKeuze naam={v.tekst} schaal={schaal} smiley={smiley} waarde={a.scores?.[v.id]} onKies={(w) => score(v.id, w)} uit={alleenLezen} />
        </div>
      );
    }
    if (v.soort === "tekst") {
      return (
        <label key={v.id} className="grid gap-1 p-2 text-[15px] text-inkt-900">
          <span>
            {v.tekst}
            {v.vertrouwelijk && <span className="ml-2 rounded bg-inkt-900 px-1.5 py-0.5 text-[11px] font-semibold text-white">enkel coördinator</span>}
          </span>
          {v.hint && <span className="text-xs text-inkt-600">{v.hint}</span>}
          <textarea
            rows={v.regels ?? 2}
            maxLength={2000}
            disabled={alleenLezen}
            value={a.teksten?.[v.id] ?? ""}
            onChange={(e) => tekst(v.id, e.target.value)}
            className={veld}
          />
        </label>
      );
    }
    if (v.soort === "posities") {
      const p = a.posities ?? [];
      return (
        <div key={v.id} className="grid gap-2 p-2">
          <span className="text-[15px] text-inkt-900">{v.tekst}</span>
          {v.hint && <span className="text-xs text-inkt-600">{v.hint}</span>}
          <div className="flex flex-wrap items-start gap-4">
            <Veld
              gekozen={p}
              onKies={
                alleenLezen
                  ? undefined
                  : (nr) =>
                      zet((x) => {
                        const nu = x.posities ?? [];
                        const nieuw = nu.includes(nr) ? nu.filter((n) => n !== nr) : [...nu, nr].slice(0, 4);
                        const lijn = x.taken?.lijn ?? lijnVanNummer(nieuw[0]);
                        return { ...x, posities: nieuw, taken: lijn ? { lijn, scores: x.taken?.scores ?? {} } : x.taken };
                      })
              }
            />
            <p className="min-w-40 flex-1 text-sm text-inkt-700">{p.length ? positieNamen(p) : "Nog niets gekozen."}</p>
          </div>
        </div>
      );
    }
    if (v.soort === "taken") {
      const lijn = a.taken?.lijn ?? lijnVanNummer(a.posities?.[0]);
      const L = lijn ? LIJNEN[lijn] : undefined;
      const zetTaak = (k: string, w: number) =>
        zet((x) => ({ ...x, taken: { lijn: lijn!, scores: { ...(x.taken?.scores ?? {}), [k]: w } } }));
      return (
        <div key={v.id} className="grid gap-3 p-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] text-inkt-900">{v.tekst}</span>
            <select
              value={lijn ?? ""}
              disabled={alleenLezen}
              onChange={(e) => zet((x) => ({ ...x, taken: { lijn: e.target.value, scores: {} } }))}
              className="rounded-lg border border-zand-300 bg-white px-2 py-1.5 text-sm"
            >
              <option value="">Kies de positie</option>
              {Object.entries(LIJNEN).map(([k, l]) => (
                <option key={k} value={k}>
                  {l.naam}
                </option>
              ))}
            </select>
          </div>
          {L &&
            (["balbezit", "balverlies"] as const).map((fase) => (
              <div key={fase} className="grid gap-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-inkt-600">{fase === "balbezit" ? "Bij balbezit" : "Bij balverlies"}</h4>
                {L[fase].map((t, i) => {
                  const k = `${fase === "balbezit" ? "b" : "v"}${i}`;
                  const w = a.taken?.scores?.[k];
                  return (
                    <div key={k} className="grid gap-1.5 rounded-lg bg-zand-50 p-2 sm:grid-cols-[1fr_auto] sm:items-center">
                      <span className="text-sm">{t}</span>
                      <div role="radiogroup" aria-label={t} className="flex gap-1">
                        {TAAK_SCHAAL.map((s) => (
                          <button
                            key={s.waarde}
                            type="button"
                            role="radio"
                            aria-checked={w === s.waarde}
                            disabled={alleenLezen}
                            onClick={() => zetTaak(k, s.waarde)}
                            className={`rounded-md border px-2 py-1 text-xs font-medium ${
                              w === s.waarde
                                ? s.waarde === 1
                                  ? "border-primary-700 bg-primary-700 text-white"
                                  : s.waarde === 2
                                    ? "border-amber-500 bg-amber-500 text-white"
                                    : "border-emerald-700 bg-emerald-700 text-white"
                                : "border-zand-300 bg-white text-inkt-800"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      );
    }
    // werkpunten
    const w = a.werkpunten ?? [];
    return (
      <div key={v.id} className="grid gap-2 p-2">
        <span className="text-[15px] text-inkt-900">{v.tekst}</span>
        {v.hint && <span className="text-xs text-inkt-600">{v.hint}</span>}
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-inkt-900 text-xs font-bold text-white">{i + 1}</span>
            <input
              value={w[i] ?? ""}
              maxLength={300}
              disabled={alleenLezen}
              onChange={(e) =>
                zet((x) => {
                  const n = [...(x.werkpunten ?? [])];
                  n[i] = e.target.value;
                  return { ...x, werkpunten: n };
                })
              }
              className={veld}
            />
          </div>
        ))}
      </div>
    );
  }

  const opvolging = a.opvolging ?? [];
  const beantwoord = totaalScores - mist.size;

  return (
    <form
      action={actie}
      onSubmit={(e) => {
        const veld = e.currentTarget.elements.namedItem("indienen");
        if (veld instanceof HTMLInputElement && veld.value === "1" && mist.size) {
          e.preventDefault();
          setToonMist(true);
          document.getElementById(`v-${[...mist][0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }}
      className="grid gap-5"
    >
      {Object.entries(verborgen).map(([k, w]) => (
        <input key={k} type="hidden" name={k} value={w} />
      ))}
      <input type="hidden" name="antwoorden" value={JSON.stringify(a)} />
      <input type="hidden" name="indienen" defaultValue="0" />

      {keeperMogelijk && (
        <label className="flex w-fit items-center gap-2 rounded-lg border border-zand-300 bg-white px-3 py-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={Boolean(a.keeper)}
            disabled={alleenLezen}
            onChange={(e) => zet((x) => ({ ...x, keeper: e.target.checked }))}
            className="accent-primary-700"
          />
          Deze speler is keeper (keepersvragen in plaats van afwerking en kopspel)
        </label>
      )}

      {rol === "trainer" && wpGekozen && opvolging.length > 0 && (
        <section className="grid gap-3 rounded-xl border-2 border-inkt-900 bg-white p-4">
          <div>
            <h3 className="font-display text-lg font-bold uppercase">Opvolging werkpunten</h3>
            {vorigeWerkpunten && <p className="text-sm text-inkt-600">Afgesproken bij {vorigeWerkpunten.ronde}</p>}
          </div>
          {opvolging.map((o: Opvolging, i) => (
            <div key={i} className="grid gap-2 rounded-lg bg-zand-50 p-3">
              <span className="font-medium">{o.tekst}</span>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    ["gehaald", "Gehaald"],
                    ["deels", "Deels"],
                    ["niet", "Nog niet"],
                  ] as const
                ).map(([k, t]) => (
                  <button
                    key={k}
                    type="button"
                    disabled={alleenLezen}
                    onClick={() => zet((x) => ({ ...x, opvolging: (x.opvolging ?? []).map((y, j) => (j === i ? { ...y, status: k } : y)) }))}
                    className={`rounded-md border px-3 py-1 text-sm ${o.status === k ? "border-inkt-900 bg-inkt-900 text-white" : "border-zand-300 bg-white"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                placeholder="Feedback van de trainer"
                disabled={alleenLezen}
                value={o.feedback}
                onChange={(e) => zet((x) => ({ ...x, opvolging: (x.opvolging ?? []).map((y, j) => (j === i ? { ...y, feedback: e.target.value } : y)) }))}
                className={veld}
              />
            </div>
          ))}
        </section>
      )}

      {rubrieken.map((r) => (
        <section key={r.id} className="grid gap-1 rounded-xl border border-zand-200 bg-white p-4 shadow-zacht">
          <h3 className="mb-1 font-display text-lg font-bold uppercase tracking-wide">{r.titel}</h3>
          <div className="grid divide-y divide-zand-100">{r.vragen.map(vraagBlok)}</div>
          {rol === "trainer" && r.opmerking && (
            <label className="mt-2 grid gap-1 text-sm text-inkt-700">
              Opmerking bij {r.titel.toLowerCase()} (niet verplicht)
              <textarea
                rows={2}
                disabled={alleenLezen}
                value={a.opmerkingen?.[r.id] ?? ""}
                onChange={(e) => zet((x) => ({ ...x, opmerkingen: { ...x.opmerkingen, [r.id]: e.target.value } }))}
                className={veld}
              />
            </label>
          )}
        </section>
      ))}

      {naamVeld && (
        <label className="grid gap-1 text-sm font-medium text-inkt-800">
          {naamVeld.label}
          <input name="ingevuld_door" value={naam} onChange={(e) => setNaam(e.target.value)} maxLength={80} disabled={alleenLezen} className={veld} />
        </label>
      )}

      {!alleenLezen && props.actie && (
        <div className="sticky bottom-0 z-10 -mx-4 grid gap-2 border-t border-zand-200 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
          {staat?.fout && <p className="rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-800">{staat.fout}</p>}
          {staat?.ok && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{staat.ok}</p>}
          {toonMist && mist.size > 0 && (
            <p className="text-sm text-primary-800">
              Nog {mist.size} {mist.size === 1 ? "score" : "scores"} open, rood aangeduid.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-full text-sm tabular-nums text-inkt-600 sm:mr-auto sm:w-auto">
              {beantwoord} van {totaalScores} scores
              {props.ingediend && <> · al ingediend, aanpassen mag nog</>}
            </span>
            <button
              onClick={(e) => zetIndienen(e.currentTarget, "0")}
              disabled={bezig}
              className="rounded-lg border border-zand-300 bg-white px-4 py-2.5 text-sm font-medium text-inkt-800 hover:border-inkt-600 disabled:opacity-60"
            >
              Tussentijds bewaren
            </button>
            <button
              onClick={(e) => zetIndienen(e.currentTarget, "1")}
              disabled={bezig}
              className="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60"
            >
              {bezig ? "Even geduld..." : (props.knopTekst ?? "Indienen")}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
