import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { magPloeg } from "@/lib/jeugd/toegang";
import { aanwezigheid, leeftijd, periodes, siteFoto, speler as leesSpeler } from "@/lib/jeugd/gegevens";
import {
  evaluatiesVanRonde,
  instellingen,
  vandaag,
  vorigeWerkpunten,
  zorgVoorEvaluaties,
} from "@/lib/jeugd/evaluatie";
import { EvaluatieFormulier } from "@/components/jeugd/EvaluatieFormulier";
import { Besproken } from "@/components/jeugd/Formulieren";
import { Verslag } from "@/components/jeugd/Verslag";
import { GROEP_NAAM } from "@/lib/jeugd/vragen";
import { besprokenZetten, trainerBewaren } from "../../../../evaluatie-acties";
import { Balk, Kaart, Portret, tijdstip } from "../../../../Onderdelen";
import { rondeVoorPagina } from "../../gedeeld";

export default async function TrainerInvullen({ params }: { params: Promise<{ id: string; spelerId: string }> }) {
  const { id, spelerId } = await params;
  const { ik, r, kort } = await rondeVoorPagina(id);
  if (r.status !== "verstuurd") redirect(`/spelers/evaluaties/${id}/vragen`);
  const s = await leesSpeler(spelerId);
  if (!s) notFound();

  let alle = await evaluatiesVanRonde(id);
  if (!alle.some((e) => e.speler_id === spelerId && e.rol === "trainer")) {
    await zorgVoorEvaluaties(r);
    alle = await evaluatiesVanRonde(id);
  }
  const mijn = alle.filter((e) => e.speler_id === spelerId);
  const tr = mijn.find((e) => e.rol === "trainer");
  if (!tr || !tr.ploeg_id || !magPloeg(ik, tr.ploeg_id)) notFound();
  const sp = mijn.find((e) => e.rol === "speler");
  const ou = mijn.find((e) => e.rol === "ouders");
  const inst = instellingen(r);

  // Vorige en volgende speler van dezelfde ploeg, voor snel doorklikken.
  const ploegIds = alle
    .filter((e) => e.rol === "trainer" && e.ploeg_id === tr.ploeg_id)
    .map((e) => e.speler_id);
  const [seizoen] = periodes();
  const [aanw, vorige, namen] = await Promise.all([
    aanwezigheid(seizoen.van, seizoen.tot, [spelerId]),
    vorigeWerkpunten(spelerId, r),
    Promise.all(ploegIds.map((x) => leesSpeler(x))),
  ]);
  const volgorde = namen
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .sort((a, b) => `${a.voornaam} ${a.achternaam}`.localeCompare(`${b.voornaam} ${b.achternaam}`, "nl"));
  const plaats = volgorde.findIndex((x) => x.id === spelerId);
  const vorigeSp = volgorde[plaats - 1];
  const volgendeSp = volgorde[plaats + 1];
  const naam = `${s.voornaam} ${s.achternaam}`;
  const a = aanw.get(spelerId);
  const coordinatorZicht = ik.rol !== "trainer";

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/spelers/evaluaties/${id}`} className="text-sm text-inkt-600 hover:text-primary-700">
          ← {r.naam}, {kort.get(tr.ploeg_id)}
        </Link>
        <div className="flex gap-2 text-sm">
          {vorigeSp && (
            <Link href={`/spelers/evaluaties/${id}/speler/${vorigeSp.id}`} className="rounded-md border border-zand-300 bg-white px-3 py-1.5 hover:border-inkt-600">
              ← {vorigeSp.voornaam}
            </Link>
          )}
          {volgendeSp && (
            <Link href={`/spelers/evaluaties/${id}/speler/${volgendeSp.id}`} className="rounded-md border border-zand-300 bg-white px-3 py-1.5 hover:border-inkt-600">
              {volgendeSp.voornaam} →
            </Link>
          )}
        </div>
      </div>

      <section className="flex flex-wrap items-center gap-4">
        <Portret foto={siteFoto(s)} naam={naam} grootte={64} />
        <div className="grid gap-0.5">
          <h1 className="font-display text-3xl font-bold uppercase leading-none">{naam}</h1>
          <p className="text-sm text-inkt-700">
            {kort.get(tr.ploeg_id)} · {leeftijd(s.geboortedatum) ?? "?"} jaar · vragen voor {GROEP_NAAM[tr.groep]}
            {tr.ingevuld_door && <> · laatst bewaard door {tr.ingevuld_door}, {tijdstip(tr.bijgewerkt)}</>}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="grid content-start gap-5">
          <EvaluatieFormulier
            key={tr.id}
            rol="trainer"
            groep={tr.groep}
            inst={inst}
            start={tr.antwoorden ?? {}}
            verborgen={{ id: tr.id }}
            actie={trainerBewaren}
            vorigeWerkpunten={vorige}
            ingediend={tr.ingediend}
            knopTekst="Afwerken"
          />
          {tr.ingediend && (
            <Kaart titel="Gesprek met de speler">
              <p className="text-sm text-inkt-700">
                Bespreek de evaluatie met {s.voornaam}. Daarna kunt ge het verslag zichtbaar maken: speler en ouders zien het dan via
                hun eigen link.
              </p>
              <Besproken
                actie={besprokenZetten}
                id={tr.id}
                besprokenOp={tr.besproken_op}
                vrijgegeven={Boolean(tr.vrijgegeven)}
                vandaag={vandaag()}
              />
            </Kaart>
          )}
        </div>

        <aside className="grid content-start gap-5">
          <Kaart titel="Aanwezig dit seizoen" rechts={<span className="text-xs text-inkt-600">volgens Spond</span>}>
            <Balk label="Trainingen" telling={a?.training} />
            <Balk label="Wedstrijden" telling={a?.wedstrijd} />
          </Kaart>
          <Kaart titel="Zelfevaluatie speler" rechts={<span className="text-xs text-inkt-600">{sp?.ingediend ? "ingevuld" : "nog niet ingevuld"}</span>}>
            {sp?.ingediend ? (
              <Verslag rol="speler" groep={sp.groep} inst={inst} a={sp.antwoorden} />
            ) : (
              <p className="text-sm text-inkt-600">Verschijnt hier zodra {s.voornaam} het formulier indient.</p>
            )}
          </Kaart>
          <Kaart titel="Ouders" rechts={<span className="text-xs text-inkt-600">{ou?.ingediend ? `ingevuld${ou.ingevuld_door ? ` door ${ou.ingevuld_door}` : ""}` : "nog niet ingevuld"}</span>}>
            {ou?.ingediend ? (
              <Verslag rol="ouders" groep={ou.groep} inst={inst} a={ou.antwoorden} vertrouwelijk={coordinatorZicht} />
            ) : (
              <p className="text-sm text-inkt-600">Verschijnt hier zodra de ouders het formulier indienen.</p>
            )}
          </Kaart>
        </aside>
      </div>
    </div>
  );
}
