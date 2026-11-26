import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/supabase";
import { EvaluatieFormulier } from "@/components/jeugd/EvaluatieFormulier";
import { Versturen } from "@/components/jeugd/Formulieren";
import { instellingen } from "@/lib/jeugd/evaluatie";
import { GROEP_NAAM, type EvalRol } from "@/lib/jeugd/vragen";
import { rondeVersturen } from "../../../evaluatie-acties";
import { Kaart } from "../../../Onderdelen";
import { Stappen, rondeVoorPagina } from "../gedeeld";

const ROL_TITEL: Record<EvalRol, string> = {
  trainer: "Wat de trainer invult",
  speler: "Wat de speler ziet",
  ouders: "Wat de ouders zien",
};

export default async function Overzicht({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { r, kort, groepen, beheer } = await rondeVoorPagina(id);
  if (r.status !== "concept" || !beheer) redirect(`/spelers/evaluaties/${id}`);
  const inst = instellingen(r);
  const { count } = await db()
    .from("jeugd_spelers")
    .select("id", { count: "exact", head: true })
    .overlaps("ploegen", r.ploegen)
    .eq("actief", true);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Link href="/spelers/evaluaties" className="text-sm text-inkt-600 hover:text-primary-700">← Evaluaties</Link>
        <h1 className="font-display text-3xl font-bold uppercase">{r.naam}</h1>
        <p className="text-sm text-inkt-700">{r.ploegen.map((p) => kort.get(p)).join(", ")}</p>
        <Stappen id={id} stap={3} />
      </div>

      <p className="max-w-3xl text-sm text-inkt-700">
        Zo ziet de evaluatie eruit. Klopt er iets niet? Ga terug naar <Link href={`/spelers/evaluaties/${id}/vragen`} className="font-medium text-primary-700">vragen kiezen</Link>.
        {groepen.length > 1 && " Er zijn meerdere leeftijden: elke speler krijgt automatisch de versie voor zijn leeftijd."}
      </p>

      {(["speler", "ouders", "trainer"] as EvalRol[]).map((rol, i) => (
        <div key={rol} className="grid gap-3">
          {groepen.map((g, j) => (
            <details key={g} open={i === 0 && j === 0} className="group rounded-xl border border-zand-200 bg-zand-100/60 p-4">
              <summary className="cursor-pointer font-display text-xl font-bold uppercase">
                {ROL_TITEL[rol]}
                {groepen.length > 1 && <span className="ml-2 text-base font-normal normal-case text-inkt-600">{GROEP_NAAM[g]}</span>}
              </summary>
              <div className="mt-4">
                <EvaluatieFormulier rol={rol} groep={g} inst={inst} start={{}} verborgen={{}} alleenLezen />
              </div>
            </details>
          ))}
        </div>
      ))}

      <Kaart titel="Versturen">
        <p className="text-sm text-inkt-700">
          Na het versturen krijgt elke speler en elke ouder een eigen link. Die stuur je door via WhatsApp of mail, met één klik
          per persoon. Wat ze invullen, komt meteen op de fiche van de juiste speler.
        </p>
        <Versturen actie={rondeVersturen} id={id} tot={r.open_tot} aantal={count ?? 0} />
      </Kaart>
    </div>
  );
}
