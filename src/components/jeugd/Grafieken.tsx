import { SPELER, TRAINER, type Antwoorden } from "@/lib/jeugd/vragen";

/**
 * Grafieken op de fiche. Twee reeksen, altijd dezelfde kleuren:
 * trainer blauw, speler oranje (gevalideerd palet, slot 1 en 2).
 */

const KLEUR = { trainer: "#2a78d6", speler: "#eb6834" };

const DOMEIN_VAN = new Map<string, string>();
const TEKST_VAN = new Map<string, string>();
for (const r of TRAINER) {
  for (const v of r.vragen) {
    if (r.domein) DOMEIN_VAN.set(v.id, r.domein);
    TEKST_VAN.set(v.id, v.tekst);
  }
}
const DOMEINEN = ["Techniek", "Tactiek", "Fysiek", "Mentaal", "Keeper"];

function gemiddelde(x: number[]): number | undefined {
  return x.length ? Math.round((x.reduce((a, b) => a + b, 0) / x.length) * 10) / 10 : undefined;
}

/** Gemiddelde per domein; voor de speler via de trainervraag die hetzelfde meet. */
export function domeinScores(rol: "trainer" | "speler", a: Antwoorden | undefined): Record<string, number> {
  const per: Record<string, number[]> = {};
  if (!a?.scores) return {};
  for (const [id, w] of Object.entries(a.scores)) {
    let d: string | undefined;
    if (rol === "trainer") d = DOMEIN_VAN.get(id);
    else {
      const v = SPELER.flatMap((r) => r.vragen).find((x) => x.id === id);
      d = v?.soort === "score" && v.vergelijk ? DOMEIN_VAN.get(v.vergelijk) : undefined;
    }
    if (d) (per[d] ??= []).push(w);
  }
  return Object.fromEntries(Object.entries(per).map(([d, l]) => [d, gemiddelde(l)!]));
}

export function Legende() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-inkt-700">
      <span className="inline-flex items-center gap-1.5">
        <svg width="18" height="10" aria-hidden>
          <line x1="0" y1="5" x2="18" y2="5" stroke={KLEUR.trainer} strokeWidth="2" />
          <circle cx="9" cy="5" r="3.5" fill={KLEUR.trainer} stroke="#fff" strokeWidth="1.5" />
        </svg>
        Trainer
      </span>
      <span className="inline-flex items-center gap-1.5">
        <svg width="18" height="10" aria-hidden>
          <line x1="0" y1="5" x2="18" y2="5" stroke={KLEUR.speler} strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="9" cy="5" r="3.5" fill="#fff" stroke={KLEUR.speler} strokeWidth="2" />
        </svg>
        Speler zelf
      </span>
    </div>
  );
}

/** Evolutie per domein over de rondes heen: één klein grafiekje per domein. */
export function Evolutie({ punten }: { punten: { ronde: string; trainer: Record<string, number>; speler: Record<string, number> }[] }) {
  const domeinen = DOMEINEN.filter((d) => punten.some((p) => p.trainer[d] !== undefined || p.speler[d] !== undefined));
  if (!domeinen.length) return null;
  const B = 220;
  const H = 120;
  const m = { l: 22, r: 10, t: 10, b: 24 };
  const x = (i: number) => (punten.length === 1 ? (m.l + B - m.r) / 2 : m.l + (i * (B - m.l - m.r)) / (punten.length - 1));
  const y = (w: number) => m.t + ((5 - w) * (H - m.t - m.b)) / 4;

  function lijn(reeks: "trainer" | "speler", d: string) {
    const pts = punten.map((p, i) => ({ i, w: p[reeks][d] })).filter((p): p is { i: number; w: number } => p.w !== undefined);
    return (
      <g>
        {pts.length > 1 && (
          <polyline
            points={pts.map((p) => `${x(p.i)},${y(p.w)}`).join(" ")}
            fill="none"
            stroke={KLEUR[reeks]}
            strokeWidth="2"
            strokeDasharray={reeks === "speler" ? "4 3" : undefined}
            strokeLinejoin="round"
          />
        )}
        {pts.map((p) => (
          <g key={p.i}>
            <title>{`${punten[p.i].ronde}, ${reeks === "trainer" ? "trainer" : "speler"}: ${String(p.w).replace(".", ",")}`}</title>
            <circle cx={x(p.i)} cy={y(p.w)} r="10" fill="transparent" />
            <circle
              cx={x(p.i)}
              cy={y(p.w)}
              r="4"
              fill={reeks === "trainer" ? KLEUR.trainer : "#fff"}
              stroke={reeks === "trainer" ? "#fff" : KLEUR.speler}
              strokeWidth={reeks === "trainer" ? 2 : 2}
            />
          </g>
        ))}
      </g>
    );
  }

  return (
    <div className="grid gap-3">
      <Legende />
      <div className="grid gap-4 sm:grid-cols-2">
        {domeinen.map((d) => {
          const laatste = [...punten].reverse().find((p) => p.trainer[d] !== undefined)?.trainer[d];
          return (
            <figure key={d} className="grid gap-1">
              <figcaption className="flex items-baseline justify-between text-sm">
                <span className="font-semibold">{d}</span>
                {laatste !== undefined && <span className="tabular-nums text-inkt-600">trainer {String(laatste).replace(".", ",")}</span>}
              </figcaption>
              <svg viewBox={`0 0 ${B} ${H}`} className="w-full" role="img" aria-label={`Evolutie ${d}`}>
                {[1, 2, 3, 4, 5].map((w) => (
                  <g key={w}>
                    <line x1={m.l} x2={B - m.r} y1={y(w)} y2={y(w)} stroke="#e7e1d4" strokeWidth="1" />
                    <text x={m.l - 6} y={y(w) + 3} textAnchor="end" fontSize="9" fill="#6b6457">
                      {w}
                    </text>
                  </g>
                ))}
                {punten.map((p, i) => {
                  // Eerste label links uitlijnen, laatste rechts, zodat niets buiten het vak valt.
                  const anker = punten.length === 1 ? "middle" : i === 0 ? "start" : i === punten.length - 1 ? "end" : "middle";
                  const max = punten.length > 2 ? 14 : 24;
                  return (
                    <text key={i} x={anker === "start" ? m.l - 4 : anker === "end" ? B - m.r + 4 : x(i)} y={H - 6} textAnchor={anker} fontSize="9" fill="#6b6457">
                      {p.ronde.length > max ? `${p.ronde.slice(0, max - 1)}…` : p.ronde}
                    </text>
                  );
                })}
                {lijn("speler", d)}
                {lijn("trainer", d)}
              </svg>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

/** Trainer naast speler, per vraag die beiden scoorden. Een verschil van 2 of meer valt op. */
export function Vergelijking({ trainer, speler }: { trainer: Antwoorden; speler: Antwoorden }) {
  const paren = SPELER.flatMap((r) => r.vragen)
    .flatMap((v) => {
      if (v.soort !== "score" || !v.vergelijk) return [];
      const t = trainer.scores?.[v.vergelijk];
      const s = speler.scores?.[v.id];
      return t && s ? [{ id: v.id, tekst: TEKST_VAN.get(v.vergelijk) ?? v.tekst, t, s }] : [];
    })
    .filter((p, i, l) => l.findIndex((q) => q.tekst === p.tekst) === i);
  if (!paren.length) return null;
  const B = 150;
  const x = (w: number) => 8 + ((w - 1) * (B - 16)) / 4;
  return (
    <div className="grid gap-2">
      <Legende />
      <ul className="grid gap-1">
        {paren.map((p) => {
          const verschil = Math.abs(p.t - p.s) >= 2;
          return (
            <li key={p.id} className={`grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-2 py-1 text-sm ${verschil ? "bg-zand-100" : ""}`}>
              <span>
                {p.tekst}
                {verschil && (
                  <span className="ml-2 whitespace-nowrap rounded bg-inkt-900 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {p.s > p.t ? "schat zich hoger in" : "schat zich lager in"}
                  </span>
                )}
              </span>
              <svg viewBox={`0 0 ${B} 20`} className="w-36" role="img" aria-label={`Trainer ${p.t}, speler ${p.s}`}>
                <line x1={x(1)} x2={x(5)} y1="10" y2="10" stroke="#e7e1d4" strokeWidth="2" strokeLinecap="round" />
                {[1, 2, 3, 4, 5].map((w) => (
                  <circle key={w} cx={x(w)} cy="10" r="1.5" fill="#c9c0ad" />
                ))}
                <g>
                  <title>{`Speler: ${p.s}`}</title>
                  <circle cx={x(p.s)} cy="10" r="5.5" fill="#fff" stroke={KLEUR.speler} strokeWidth="2.5" />
                </g>
                <g>
                  <title>{`Trainer: ${p.t}`}</title>
                  <circle cx={x(p.t)} cy="10" r="4.5" fill={KLEUR.trainer} stroke="#fff" strokeWidth="2" />
                </g>
              </svg>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
