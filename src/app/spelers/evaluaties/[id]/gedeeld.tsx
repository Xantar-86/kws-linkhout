import Link from "next/link";
import { notFound } from "next/navigation";
import { magPloeg, vereisGebruiker } from "@/lib/jeugd/toegang";
import { ploegen as leesPloegen } from "@/lib/jeugd/gegevens";
import { ronde as leesRonde } from "@/lib/jeugd/evaluatie";
import { groepVanPloeg, type Groep } from "@/lib/jeugd/vragen";

/** Ronde ophalen voor een pagina, met de rechten van de aangemelde gebruiker. */
export async function rondeVoorPagina(id: string) {
  const ik = await vereisGebruiker();
  const [r, ploegen] = await Promise.all([leesRonde(id), leesPloegen()]);
  if (!r) notFound();
  const zichtbaar = r.ploegen.filter((p) => ik.beheerder || magPloeg(ik, p));
  if (!zichtbaar.length) notFound();
  const beheer = ik.beheerder || r.ploegen.every((p) => magPloeg(ik, p));
  const kort = new Map(ploegen.map((p) => [p.id, p.kort]));
  const volgorde: Groep[] = ["jong", "midden", "oud"];
  const groepen = volgorde.filter((g) => r.ploegen.some((p) => groepVanPloeg(kort.get(p)) === g));
  return { ik, r, ploegen, kort, zichtbaar, beheer, groepen };
}

export function Stappen({ id, stap }: { id: string; stap: 1 | 2 | 3 }) {
  const klasse = (n: number) =>
    n === stap ? "rounded-md bg-inkt-900 px-2 py-1 font-semibold text-white" : "rounded-md bg-zand-100 px-2 py-1 text-inkt-700 hover:bg-zand-200";
  return (
    <ol className="flex flex-wrap gap-2 text-sm">
      <li>
        <Link href={`/spelers/evaluaties/${id}`} className={klasse(1)}>1 Ploeg en datum</Link>
      </li>
      <li>
        <Link href={`/spelers/evaluaties/${id}/vragen`} className={klasse(2)}>2 Vragen kiezen</Link>
      </li>
      <li>
        <Link href={`/spelers/evaluaties/${id}/overzicht`} className={klasse(3)}>3 Overzicht en versturen</Link>
      </li>
    </ol>
  );
}
