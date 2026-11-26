import Link from "next/link";
import { huidigeGebruiker } from "@/lib/jeugd/toegang";
import {
  aantalSpelersPerPloeg,
  aanwezigheid,
  laatsteSync,
  periodes,
  zichtbarePloegen,
  type Telling,
} from "@/lib/jeugd/gegevens";
import { db } from "@/lib/supabase";
import { AanmeldFormulier } from "./Formulieren";
import { Procent, tijdstip } from "./Onderdelen";

export default async function Spelers() {
  const ik = await huidigeGebruiker();
  if (!ik) {
    return (
      <div className="mx-auto mt-10 grid max-w-sm gap-5 rounded-xl border border-zand-200 bg-white p-6 shadow-zacht">
        <div className="grid gap-1">
          <h1 className="font-display text-2xl font-bold uppercase">Aanmelden</h1>
          <p className="text-sm text-inkt-700">
            Enkel voor trainers, coördinatoren en bestuur van KWS Linkhout. Nog geen account? Vraag een uitnodiging aan de
            jeugdwerking.
          </p>
        </div>
        <AanmeldFormulier />
      </div>
    );
  }

  const [lijst, aantallen, sync] = await Promise.all([zichtbarePloegen(ik), aantalSpelersPerPloeg(), laatsteSync()]);
  const seizoen = periodes()[0];

  // Gemiddelde per ploeg: alle antwoorden van de spelers van die ploeg samen.
  const { data: spelers } = await db().from("jeugd_spelers").select("id, ploegen").eq("actief", true);
  const perSpeler = await aanwezigheid(seizoen.van, seizoen.tot);
  const perPloeg = new Map<string, { training: Telling; wedstrijd: Telling }>();
  for (const s of spelers ?? []) {
    const a = perSpeler.get(s.id as string);
    if (!a) continue;
    for (const p of s.ploegen as string[]) {
      const t = perPloeg.get(p) ?? { training: { komt: 0, komt_niet: 0, geen_antwoord: 0 }, wedstrijd: { komt: 0, komt_niet: 0, geen_antwoord: 0 } };
      for (const soort of ["training", "wedstrijd"] as const) {
        t[soort].komt += a[soort].komt;
        t[soort].komt_niet += a[soort].komt_niet;
        t[soort].geen_antwoord += a[soort].geen_antwoord;
      }
      perPloeg.set(p, t);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase">Ploegen</h1>
          <p className="text-sm text-inkt-700">{seizoen.naam}. Aanwezigheid volgens Spond.</p>
        </div>
        {sync && (
          <p className="text-xs text-inkt-600">
            Laatst bijgewerkt uit Spond: {tijdstip(sync.einde ?? sync.start)}
            {sync.ok === false && <span className="ml-1 text-primary-700">(mislukt)</span>}
          </p>
        )}
      </div>

      {lijst.length === 0 ? (
        <p className="rounded-xl border border-zand-200 bg-white p-5 text-inkt-700">
          Er zijn nog geen ploegen aan je account gekoppeld. Vraag het aan de beheerder.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lijst.map((p) => {
            const t = perPloeg.get(p.id);
            return (
              <Link
                key={p.id}
                href={`/spelers/ploeg/${p.id}`}
                className="group grid gap-3 rounded-xl border border-zand-200 bg-white p-4 shadow-zacht transition hover:border-primary-700"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-2xl font-bold uppercase group-hover:text-primary-700">{p.kort}</span>
                  <span className="text-sm text-inkt-600">{aantallen.get(p.id) ?? 0} spelers</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="grid gap-0.5">
                    <span className="text-xs uppercase tracking-wide text-inkt-600">Trainingen</span>
                    <Procent telling={t?.training} />
                  </div>
                  <div className="grid gap-0.5">
                    <span className="text-xs uppercase tracking-wide text-inkt-600">Wedstrijden</span>
                    <Procent telling={t?.wedstrijd} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
