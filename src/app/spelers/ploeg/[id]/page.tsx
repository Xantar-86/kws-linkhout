import Link from "next/link";
import { notFound } from "next/navigation";
import { magPloeg, vereisGebruiker } from "@/lib/jeugd/toegang";
import { aandachtVoorSpelers, aanwezigheid, leeftijd, periodes, ploegen, siteFoto, siteKern, spelersVanPloeg, stafVanPloeg } from "@/lib/jeugd/gegevens";
import { POSITIES } from "@/lib/kernen";
import { Portret, Procent } from "../../Onderdelen";

export default async function PloegPagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ik = await vereisGebruiker();
  const ploeg = (await ploegen()).find((p) => p.id === id);
  if (!ploeg || !magPloeg(ik, id)) notFound();

  const [spelers, staf] = await Promise.all([spelersVanPloeg(id), stafVanPloeg(id)]);
  const [seizoen, h1, h2] = periodes();
  const huidig = new Date() < h2.van ? h1 : h2;
  const ids = spelers.map((s) => s.id);
  const [aSeizoen, aHuidig, aandacht] = await Promise.all([
    aanwezigheid(seizoen.van, seizoen.tot, ids),
    aanwezigheid(huidig.van, huidig.tot, ids),
    aandachtVoorSpelers(ids),
  ]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <Link href="/spelers" className="text-sm text-inkt-600 hover:text-primary-700">← Alle ploegen</Link>
        <h1 className="font-display text-3xl font-bold uppercase">{ploeg.kort}</h1>
        <p className="text-sm text-inkt-700">
          {spelers.length} spelers{staf.length > 0 && <> · {staf.map((s) => s.naam).join(", ")}</>}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zand-200 bg-white shadow-zacht">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-zand-200 text-left text-xs uppercase tracking-wide text-inkt-600">
              <th className="px-4 py-3 font-semibold">Speler</th>
              <th className="px-3 py-3 font-semibold">Leeftijd</th>
              <th className="px-3 py-3 font-semibold">Nr · positie</th>
              <th className="px-3 py-3 font-semibold">Trainingen {huidig.sleutel === "h1" ? "jul-dec" : "jan-jun"}</th>
              <th className="px-3 py-3 font-semibold">Trainingen seizoen</th>
              <th className="px-3 py-3 font-semibold">Wedstrijden seizoen</th>
            </tr>
          </thead>
          <tbody>
            {spelers.map((s) => {
              const naam = `${s.voornaam} ${s.achternaam}`;
              const kern = siteKern(s);
              const nr = (s.extra.rugnummer as number | undefined) ?? kern?.nummer;
              const pos = (s.extra.positie as string | undefined) ?? (kern?.positie ? POSITIES[kern.positie] : undefined);
              const let_op = aandacht.get(s.id);
              return (
                <tr key={s.id} className="border-b border-zand-100 last:border-0 hover:bg-zand-50">
                  <td className="px-4 py-2">
                    <Link href={`/spelers/speler/${s.id}`} className="flex items-center gap-3 font-medium hover:text-primary-700">
                      <Portret foto={siteFoto(s)} naam={naam} grootte={36} />
                      {naam}
                      {let_op?.gezondheid && (
                        <span title="Allergie of medische info: zie fiche" className="rounded bg-primary-700 px-1.5 text-xs font-bold text-white">
                          !
                        </span>
                      )}
                      {let_op?.rekening && !let_op.gezondheid && (
                        <span title="Aandachtspunt: zie fiche" className="rounded bg-zand-200 px-1.5 text-xs font-bold text-inkt-800">
                          i
                        </span>
                      )}
                    </Link>
                  </td>
                  <td className="px-3 py-2 tabular-nums text-inkt-700">{leeftijd(s.geboortedatum) ?? "?"}</td>
                  <td className="px-3 py-2 text-inkt-700">{[nr, pos].filter(Boolean).join(" · ") || "?"}</td>
                  <td className="px-3 py-2"><Procent telling={aHuidig.get(s.id)?.training} /></td>
                  <td className="px-3 py-2"><Procent telling={aSeizoen.get(s.id)?.training} /></td>
                  <td className="px-3 py-2"><Procent telling={aSeizoen.get(s.id)?.wedstrijd} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-inkt-600">
        Percentage = keren dat de speler &quot;komt&quot; antwoordde in Spond, op alle trainingen of wedstrijden waarvoor hij
        uitgenodigd was. Geannuleerde activiteiten tellen niet mee. Een rood uitroepteken betekent allergie of medische
        info op de fiche, een grijze i een ander aandachtspunt.
      </p>
    </div>
  );
}
