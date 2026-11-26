"use client";

import { useActionState, useState } from "react";
import { GROEP_NAAM, keuzelijst, type EigenVraag, type EvalRol, type Groep, type Vraag } from "@/lib/jeugd/vragen";

type Staat = { fout?: string; ok?: string } | null;

const ROL_NAAM: Record<EvalRol, string> = { trainer: "Trainer", speler: "Speler", ouders: "Ouders" };
const ROL_UITLEG: Record<EvalRol, string> = {
  trainer: "Wat jij invult per speler. Scores van 1 tot 5.",
  speler: "De zelfevaluatie, in ik-taal. Tot U12 met gezichtjes, vanaf U13 met scores.",
  ouders: "Geen voetbaltechniek: hoe hun kind zich voelt en wat ze thuis merken.",
};

/** Welke knop ingedrukt werd, in een verborgen veld (React geeft de knop zelf niet mee). */
function zetVeld(knop: HTMLButtonElement, naam: string, waarde: string) {
  const veld = knop.form?.elements.namedItem(naam);
  if (veld instanceof HTMLInputElement) veld.value = waarde;
}

function soortLabel(v: Vraag): string {
  switch (v.soort) {
    case "score":
      return "score";
    case "tekst":
      return "open vraag";
    case "posities":
      return "veld";
    case "taken":
      return "taken per positie";
    default:
      return "3 werkpunten";
  }
}

export function VragenKiezer({
  rondeId,
  groepen,
  start,
  actie,
}: {
  rondeId: string;
  groepen: Groep[];
  start: { keuze: Partial<Record<EvalRol, string[]>> | null; eigen: EigenVraag[] };
  actie: (vorige: Staat, form: FormData) => Promise<Staat>;
}) {
  const [staat, verstuur, bezig] = useActionState(actie, null);
  const [rol, setRol] = useState<EvalRol>("trainer");
  const lijsten = Object.fromEntries(
    (["trainer", "speler", "ouders"] as EvalRol[]).map((r) => [r, keuzelijst(r, groepen)]),
  ) as Record<EvalRol, ReturnType<typeof keuzelijst>>;
  const [keuze, setKeuze] = useState<Record<EvalRol, string[]>>(() => {
    const k = {} as Record<EvalRol, string[]>;
    for (const r of ["trainer", "speler", "ouders"] as EvalRol[]) {
      k[r] = start.keuze?.[r] ?? lijsten[r].flatMap((x) => x.vragen.map((v) => v.id));
    }
    return k;
  });
  const [eigen, setEigen] = useState<EigenVraag[]>(start.eigen);
  const [nieuweTekst, setNieuweTekst] = useState("");
  const [nieuweSoort, setNieuweSoort] = useState<"score" | "tekst">("score");

  const aan = new Set(keuze[rol]);
  const zetVraag = (id: string, ja: boolean) =>
    setKeuze((k) => ({ ...k, [rol]: ja ? [...k[rol], id] : k[rol].filter((x) => x !== id) }));
  const zetRubriek = (ids: string[], ja: boolean) =>
    setKeuze((k) => ({ ...k, [rol]: ja ? [...new Set([...k[rol], ...ids])] : k[rol].filter((x) => !ids.includes(x)) }));
  const telling = (r: EvalRol) => {
    const alle = lijsten[r].flatMap((x) => x.vragen.map((v) => v.id));
    return alle.filter((id) => keuze[r].includes(id)).length + eigen.filter((e) => e.rol === r).length;
  };
  const meerdereGroepen = groepen.length > 1;

  return (
    <form action={verstuur} className="grid gap-5">
      <input type="hidden" name="id" value={rondeId} />
      <input type="hidden" name="instellingen" value={JSON.stringify({ keuze, eigen })} />
      <input type="hidden" name="verder" defaultValue="0" />

      <div role="tablist" className="flex flex-wrap gap-2">
        {(["trainer", "speler", "ouders"] as EvalRol[]).map((r) => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={rol === r}
            onClick={() => setRol(r)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${rol === r ? "bg-inkt-900 text-white" : "border border-zand-300 bg-white text-inkt-800"}`}
          >
            {ROL_NAAM[r]} <span className="ml-1 font-normal opacity-70">{telling(r)}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-inkt-700">{ROL_UITLEG[rol]}</p>

      {lijsten[rol].map((r) => {
        const ids = r.vragen.map((v) => v.id);
        const alleAan = ids.every((id) => aan.has(id));
        return (
          <section key={r.id} className="grid gap-2 rounded-xl border border-zand-200 bg-white p-4 shadow-zacht">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide">{r.titel}</h3>
              <button type="button" onClick={() => zetRubriek(ids, !alleAan)} className="text-sm font-medium text-primary-700">
                {alleAan ? "Alles uit" : "Alles aan"}
              </button>
            </div>
            <ul className="grid gap-1">
              {r.vragen.map((v) => (
                <li key={v.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-zand-50">
                    <input
                      type="checkbox"
                      checked={aan.has(v.id)}
                      onChange={(e) => zetVraag(v.id, e.target.checked)}
                      className="mt-1 h-4 w-4 accent-primary-700"
                    />
                    <span className="grid gap-0.5">
                      <span className={aan.has(v.id) ? "text-inkt-900" : "text-inkt-600 line-through decoration-zand-300"}>{v.tekst}</span>
                      <span className="flex flex-wrap gap-1 text-[11px] text-inkt-600">
                        <span className="rounded bg-zand-100 px-1.5">{soortLabel(v)}</span>
                        {v.soort === "score" && v.keeper === "enkel" && <span className="rounded bg-zand-100 px-1.5">enkel keepers</span>}
                        {meerdereGroepen &&
                          v.groepen.length < 3 &&
                          v.groepen
                            .filter((g) => groepen.includes(g))
                            .map((g) => (
                              <span key={g} className="rounded bg-zand-100 px-1.5">
                                {GROEP_NAAM[g]}
                              </span>
                            ))}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section className="grid gap-3 rounded-xl border-2 border-dashed border-zand-300 bg-white p-4">
        <h3 className="font-display text-lg font-bold uppercase tracking-wide">Eigen vragen voor {ROL_NAAM[rol].toLowerCase()}</h3>
        {eigen.filter((e) => e.rol === rol).length === 0 && <p className="text-sm text-inkt-600">Nog geen eigen vragen.</p>}
        <ul className="grid gap-2">
          {eigen
            .map((e, i) => ({ e, i }))
            .filter(({ e }) => e.rol === rol)
            .map(({ e, i }) => (
              <li key={i} className="flex flex-wrap items-center gap-2 rounded-lg bg-zand-50 px-3 py-2">
                <input
                  value={e.tekst}
                  maxLength={200}
                  onChange={(x) => setEigen((l) => l.map((y, j) => (j === i ? { ...y, tekst: x.target.value } : y)))}
                  className="min-w-0 flex-1 rounded-md border border-zand-300 bg-white px-2 py-1.5 text-sm"
                />
                <span className="rounded bg-zand-100 px-1.5 text-[11px] text-inkt-600">{e.soort === "score" ? "score" : "open vraag"}</span>
                <button type="button" onClick={() => setEigen((l) => l.filter((_, j) => j !== i))} className="text-sm text-primary-700">
                  Weg
                </button>
              </li>
            ))}
        </ul>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <input
            value={nieuweTekst}
            maxLength={200}
            onChange={(e) => setNieuweTekst(e.target.value)}
            placeholder={rol === "speler" ? "Bv. Ik kom graag naar de wedstrijden" : rol === "ouders" ? "Bv. Mijn kind eet goed voor een wedstrijd" : "Bv. Neemt de leiding in de groep"}
            className="rounded-lg border border-zand-300 bg-white px-3 py-2 text-sm"
          />
          <select value={nieuweSoort} onChange={(e) => setNieuweSoort(e.target.value as "score" | "tekst")} className="rounded-lg border border-zand-300 bg-white px-2 py-2 text-sm">
            <option value="score">Score</option>
            <option value="tekst">Open vraag</option>
          </select>
          <button
            type="button"
            disabled={!nieuweTekst.trim() || eigen.filter((e) => e.rol === rol).length >= 10}
            onClick={() => {
              setEigen((l) => [...l, { id: "", rol, soort: nieuweSoort, tekst: nieuweTekst.trim() }]);
              setNieuweTekst("");
            }}
            className="rounded-lg bg-inkt-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Toevoegen
          </button>
        </div>
      </section>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-2 border-t border-zand-200 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
        {staat?.fout && <p className="w-full rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-800">{staat.fout}</p>}
        {staat?.ok && <p className="text-sm text-emerald-800">{staat.ok}</p>}
        <span className="mr-auto text-sm text-inkt-600">
          Trainer {telling("trainer")} · Speler {telling("speler")} · Ouders {telling("ouders")} vragen
        </span>
        <button onClick={(e) => zetVeld(e.currentTarget, "verder", "0")} disabled={bezig} className="rounded-lg border border-zand-300 bg-white px-4 py-2.5 text-sm font-medium">
          Bewaren
        </button>
        <button onClick={(e) => zetVeld(e.currentTarget, "verder", "1")} disabled={bezig} className="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white">
          {bezig ? "Even geduld..." : "Bewaren en overzicht bekijken"}
        </button>
      </div>
    </form>
  );
}
