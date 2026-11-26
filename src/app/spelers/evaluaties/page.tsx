import Link from "next/link";
import { db } from "@/lib/supabase";
import { magPloeg, vereisGebruiker } from "@/lib/jeugd/toegang";
import { ploegen as leesPloegen } from "@/lib/jeugd/gegevens";
import { isOpen, rondes, vandaag } from "@/lib/jeugd/evaluatie";
import { Kaart, datumLang } from "../Onderdelen";

export default async function Evaluaties() {
  const ik = await vereisGebruiker();
  const [alle, ploegen] = await Promise.all([rondes(), leesPloegen()]);
  const kort = new Map(ploegen.map((p) => [p.id, p.kort]));
  const zichtbaar = alle.filter((r) => ik.beheerder || r.ploegen.some((p) => magPloeg(ik, p)));
  const ids = zichtbaar.filter((r) => r.status === "verstuurd").map((r) => r.id);
  const { data } = ids.length
    ? await db().from("jeugd_evaluaties").select("ronde_id, rol, ingediend").in("ronde_id", ids).range(0, 19999)
    : { data: [] };
  const tel = new Map<string, Record<string, { klaar: number; n: number }>>();
  for (const e of (data ?? []) as { ronde_id: string; rol: string; ingediend: string | null }[]) {
    const t = tel.get(e.ronde_id) ?? {};
    const x = (t[e.rol] ??= { klaar: 0, n: 0 });
    x.n++;
    if (e.ingediend) x.klaar++;
    tel.set(e.ronde_id, t);
  }
  const d = vandaag();

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">Evaluaties</h1>
          <p className="text-sm text-inkt-700">Stel per ploeg een evaluatie samen, kies de vragen en stuur ze naar uw spelers en hun ouders.</p>
        </div>
        <Link href="/spelers/evaluaties/nieuw" className="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800">
          Nieuwe evaluatie
        </Link>
      </div>

      {zichtbaar.length === 0 ? (
        <Kaart titel="Nog geen evaluaties">
          <p className="text-sm text-inkt-700">
            Maak een nieuwe evaluatie voor uw ploeg. Ge kiest eerst de vragen, bekijkt dan hoe het eruitziet, en stuurt pas daarna
            de persoonlijke links door.
          </p>
        </Kaart>
      ) : (
        <ul className="grid gap-3">
          {zichtbaar.map((r) => {
            const t = tel.get(r.id) ?? {};
            const status =
              r.status === "concept" ? "Nog niet verstuurd" : isOpen(r) ? `Open tot ${datumLang(r.open_tot)}` : r.open_tot < d ? "Afgesloten" : "Verstuurd";
            return (
              <li key={r.id}>
                <Link
                  href={r.status === "concept" ? `/spelers/evaluaties/${r.id}/vragen` : `/spelers/evaluaties/${r.id}`}
                  className="grid gap-3 rounded-xl border border-zand-200 bg-white p-4 shadow-zacht transition hover:border-inkt-600 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <span className="grid gap-1">
                    <span className="font-display text-xl font-bold uppercase leading-none">{r.naam}</span>
                    <span className="text-sm text-inkt-700">
                      {r.ploegen.map((p) => kort.get(p) ?? "?").join(", ")} · {status}
                      {r.aangemaakt_door && <> · door {r.aangemaakt_door}</>}
                    </span>
                  </span>
                  {r.status === "verstuurd" ? (
                    <span className="flex gap-4 text-sm tabular-nums">
                      {(["trainer", "speler", "ouders"] as const).map((rol) => (
                        <span key={rol} className="grid text-center">
                          <span className="font-semibold">
                            {t[rol]?.klaar ?? 0}/{t[rol]?.n ?? 0}
                          </span>
                          <span className="text-xs text-inkt-600">{rol}</span>
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="w-fit rounded-md bg-amber-50 px-2 py-1 text-sm font-medium text-amber-800">Verder opmaken</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
