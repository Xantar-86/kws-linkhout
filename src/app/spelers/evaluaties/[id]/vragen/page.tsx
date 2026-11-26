import Link from "next/link";
import { redirect } from "next/navigation";
import { VragenKiezer } from "@/components/jeugd/VragenKiezer";
import { GROEP_NAAM } from "@/lib/jeugd/vragen";
import { vragenBewaren } from "../../../evaluatie-acties";
import { Stappen, rondeVoorPagina } from "../gedeeld";

export default async function VragenKiezen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { r, kort, groepen, beheer } = await rondeVoorPagina(id);
  if (r.status !== "concept" || !beheer) redirect(`/spelers/evaluaties/${id}`);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Link href="/spelers/evaluaties" className="text-sm text-inkt-600 hover:text-primary-700">← Evaluaties</Link>
        <h1 className="font-display text-3xl font-bold uppercase">{r.naam}</h1>
        <p className="text-sm text-inkt-700">
          {r.ploegen.map((p) => kort.get(p)).join(", ")} · vragen voor {groepen.map((g) => GROEP_NAAM[g]).join(" en ")}
        </p>
        <Stappen id={id} stap={2} />
      </div>
      <p className="max-w-3xl text-sm text-inkt-700">
        Alle vragen die bij deze leeftijd passen, staan aangevinkt. Vink af wat ge niet wilt gebruiken en voeg gerust eigen
        vragen toe. Daarna ziet ge in het overzicht precies wat de spelers en ouders te zien krijgen.
      </p>
      <VragenKiezer rondeId={id} groepen={groepen} start={{ keuze: r.keuze, eigen: r.eigen ?? [] }} actie={vragenBewaren} />
    </div>
  );
}
