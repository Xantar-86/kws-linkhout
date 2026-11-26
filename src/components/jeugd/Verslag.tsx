import {
  LIJNEN,
  TAAK_SCHAAL,
  schaal as schaalVoor,
  zichtbaar,
  type Antwoorden,
  type EvalRol,
  type Groep,
  type Instellingen,
} from "@/lib/jeugd/vragen";
import { Veld, positieNamen } from "./Veld";

/** Ingevulde evaluatie om te lezen (fiche en verslag voor speler en ouders). */

function Blokjes({ waarde, max = 5 }: { waarde: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-2.5 w-4 rounded-sm ${i < waarde ? "bg-inkt-900" : "bg-zand-200"}`} />
      ))}
    </span>
  );
}

const OPVOLGING: Record<string, { tekst: string; kleur: string }> = {
  gehaald: { tekst: "Gehaald", kleur: "bg-emerald-50 text-emerald-800" },
  deels: { tekst: "Deels", kleur: "bg-amber-50 text-amber-800" },
  niet: { tekst: "Nog niet", kleur: "bg-primary-50 text-primary-800" },
};

export function Verslag({
  rol,
  groep,
  inst,
  a,
  vertrouwelijk = false,
}: {
  rol: EvalRol;
  groep: Groep;
  inst?: Instellingen;
  a: Antwoorden;
  /** Toon ook het vak "enkel voor de jeugdcoördinator". */
  vertrouwelijk?: boolean;
}) {
  const { schaal } = schaalVoor(rol, groep);
  const rubrieken = zichtbaar(rol, groep, a.keeper, inst);
  return (
    <div className="@container grid gap-4">
      {a.opvolging && a.opvolging.length > 0 && (
        <div className="grid gap-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-inkt-600">Opvolging vorige werkpunten</h4>
          <ul className="grid gap-2">
            {a.opvolging.map((o, i) => (
              <li key={i} className="grid gap-0.5 text-sm">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{o.tekst}</span>
                  {o.status && <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${OPVOLGING[o.status].kleur}`}>{OPVOLGING[o.status].tekst}</span>}
                </span>
                {o.feedback && <span className="whitespace-pre-line text-inkt-700">{o.feedback}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {rubrieken.map((r) => {
        const regels = r.vragen.flatMap((v) => {
          if (v.soort === "score") {
            const w = a.scores?.[v.id];
            if (!w) return [];
            return [
              <li key={v.id} className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm leading-snug">
                <span>{v.tekst}</span>
                <span className="flex items-center gap-2">
                  <Blokjes waarde={w} />
                  <span className="hidden w-32 text-xs text-inkt-600 @lg:inline">{schaal.find((s) => s.waarde === w)?.label}</span>
                </span>
              </li>,
            ];
          }
          if (v.soort === "tekst") {
            const t = a.teksten?.[v.id];
            if (!t || (v.vertrouwelijk && !vertrouwelijk)) return [];
            return [
              <li key={v.id} className="grid gap-0.5 text-sm">
                <span className="text-inkt-600">
                  {v.tekst}
                  {v.vertrouwelijk && <span className="ml-2 rounded bg-inkt-900 px-1.5 text-[11px] font-semibold text-white">enkel coördinator</span>}
                </span>
                <span className="whitespace-pre-line">{t}</span>
              </li>,
            ];
          }
          if (v.soort === "posities") {
            if (!a.posities?.length) return [];
            return [
              <li key={v.id} className="flex flex-wrap items-center gap-3 text-sm">
                <Veld gekozen={a.posities} klein />
                <span className="grid gap-0.5">
                  <span className="text-inkt-600">{v.tekst}</span>
                  <span>{positieNamen(a.posities)}</span>
                </span>
              </li>,
            ];
          }
          if (v.soort === "taken") {
            const L = a.taken?.lijn ? LIJNEN[a.taken.lijn] : undefined;
            if (!L || !a.taken || !Object.keys(a.taken.scores).length) return [];
            const lijst = [
              ...L.balbezit.map((t, i) => ({ t, k: `b${i}` })),
              ...L.balverlies.map((t, i) => ({ t, k: `v${i}` })),
            ].filter((x) => a.taken!.scores[x.k]);
            return [
              <li key={v.id} className="grid gap-1 text-sm">
                <span className="text-inkt-600">Taken als {L.naam.toLowerCase()}</span>
                <ul className="grid gap-1">
                  {lijst.map((x) => {
                    const w = a.taken!.scores[x.k];
                    return (
                      <li key={x.k} className="flex items-center justify-between gap-3">
                        <span>{x.t}</span>
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${
                            w === 1 ? "bg-primary-50 text-primary-800" : w === 2 ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"
                          }`}
                        >
                          {TAAK_SCHAAL.find((s) => s.waarde === w)?.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>,
            ];
          }
          if (!a.werkpunten?.length) return [];
          return [
            <li key={v.id} className="grid gap-1 text-sm">
              <span className="text-inkt-600">{v.tekst}</span>
              <ol className="grid gap-1">
                {a.werkpunten.map((w, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-inkt-900 text-[11px] font-bold text-white">{i + 1}</span>
                    {w}
                  </li>
                ))}
              </ol>
            </li>,
          ];
        });
        const opm = a.opmerkingen?.[r.id];
        if (!regels.length && !opm) return null;
        return (
          <div key={r.id} className="grid gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-inkt-600">{r.titel}</h4>
            <ul className="grid gap-2">{regels}</ul>
            {opm && <p className="whitespace-pre-line rounded-lg bg-zand-50 px-3 py-2 text-sm text-inkt-800">{opm}</p>}
          </div>
        );
      })}
    </div>
  );
}
