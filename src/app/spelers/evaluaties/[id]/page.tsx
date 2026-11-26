import Link from "next/link";
import { db } from "@/lib/supabase";
import { magPloeg } from "@/lib/jeugd/toegang";
import { siteFoto, type Speler } from "@/lib/jeugd/gegevens";
import { evaluatiesVanRonde, instellingen, isOpen, status, vandaag, zorgVoorEvaluaties, type Evaluatie } from "@/lib/jeugd/evaluatie";
import { groepVanPloeg, zichtbaar as vragenVoor, type Groep } from "@/lib/jeugd/vragen";
import type { Uitnodiging } from "@/lib/jeugd/uitnodiging";
import { basisUrl } from "@/lib/jeugd/url";
import { KopieerAlles, LinkKnoppen, MailVoorbeeld, RondeAanpassen, VerwijderRonde } from "@/components/jeugd/Formulieren";
import { rondeAanpassen, rondeVerwijderen } from "../../evaluatie-acties";
import { Kaart, Portret, datumLang } from "../../Onderdelen";
import { Stappen, rondeVoorPagina } from "./gedeeld";

const CHIP: Record<string, { tekst: string; kleur: string }> = {
  leeg: { tekst: "Nog niet", kleur: "bg-zand-100 text-inkt-700" },
  bezig: { tekst: "Bezig", kleur: "bg-amber-50 text-amber-800" },
  ingediend: { tekst: "Ingevuld", kleur: "bg-emerald-50 text-emerald-800" },
};

function Chip({ s }: { s: keyof typeof CHIP }) {
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${CHIP[s].kleur}`}>{CHIP[s].tekst}</span>;
}

export default async function RondePagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { ik, r, ploegen, kort, zichtbaar, beheer } = await rondeVoorPagina(id);
  const keuzePloegen = ploegen.filter((p) => ik.beheerder || magPloeg(ik, p.id)).map((p) => ({ id: p.id, kort: p.kort }));

  if (r.status === "concept") {
    return (
      <div className="grid max-w-3xl gap-6">
        <div className="grid gap-2">
          <Link href="/spelers/evaluaties" className="text-sm text-inkt-600 hover:text-primary-700">← Evaluaties</Link>
          <h1 className="font-display text-3xl font-bold uppercase">{r.naam}</h1>
          <Stappen id={id} stap={2} />
        </div>
        <Kaart titel="Ploeg en datum">
          <RondeAanpassen actie={rondeAanpassen} id={id} naam={r.naam} tot={r.open_tot} ploegen={keuzePloegen} gekozen={r.ploegen} concept />
        </Kaart>
        <div className="flex flex-wrap gap-3">
          <Link href={`/spelers/evaluaties/${id}/vragen`} className="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white">
            Verder: vragen kiezen
          </Link>
        </div>
        {beheer && <VerwijderRonde actie={rondeVerwijderen} id={id} metAntwoorden={false} />}
      </div>
    );
  }

  // Spelers die sinds het versturen in Spond bijkwamen, krijgen nu ook hun links.
  if (isOpen(r)) await zorgVoorEvaluaties(r);
  const [evals, { data: spelersData }, basis] = await Promise.all([
    evaluatiesVanRonde(id),
    db()
      .from("jeugd_spelers")
      .select("id, voornaam, achternaam, ploegen, email, gsm, ouders, extra, actief, geboortedatum")
      .overlaps("ploegen", zichtbaar)
      .range(0, 4999),
    basisUrl(),
  ]);
  const spelers = new Map(((spelersData ?? []) as Speler[]).map((s) => [s.id, s]));
  const perSpeler = new Map<string, Partial<Record<Evaluatie["rol"], Evaluatie>>>();
  for (const e of evals) perSpeler.set(e.speler_id, { ...perSpeler.get(e.speler_id), [e.rol]: e });
  const open = isOpen(r);
  const tot = datumLang(r.open_tot);
  const heeftAntwoorden = evals.some((e) => status(e) !== "leeg");
  const inst = instellingen(r);
  const vertrouwelijk = (g: Groep) => vragenVoor("ouders", g, false, inst).some((rb) => rb.vragen.some((v) => v.id === "o11"));

  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <Link href="/spelers/evaluaties" className="text-sm text-inkt-600 hover:text-primary-700">← Evaluaties</Link>
        <h1 className="font-display text-3xl font-bold uppercase">{r.naam}</h1>
        <p className="text-sm text-inkt-700">
          {open ? <>Open tot en met {tot}</> : r.open_tot < vandaag() ? <>Afgesloten op {tot}</> : <>Verstuurd</>}
          {r.aangemaakt_door && <> · opgemaakt door {r.aangemaakt_door}</>}
        </p>
      </div>

      {zichtbaar.map((ploegId) => {
        const rijen = [...perSpeler.entries()]
          .filter(([, v]) => (v.trainer ?? v.speler ?? v.ouders)?.ploeg_id === ploegId)
          .map(([sid, v]) => ({ s: spelers.get(sid), v }))
          .filter((x): x is { s: Speler; v: Partial<Record<Evaluatie["rol"], Evaluatie>> } => Boolean(x.s))
          .sort((a, b) => `${a.s.voornaam} ${a.s.achternaam}`.localeCompare(`${b.s.voornaam} ${b.s.achternaam}`, "nl"));
        const klaar = (rol: Evaluatie["rol"]) => rijen.filter((x) => x.v[rol]?.ingediend).length;
        const lijst = rijen
          .map(({ s, v }) =>
            [
              `${s.voornaam} ${s.achternaam}`,
              v.speler?.token ? `  speler: ${basis}/evaluatie/${v.speler.token}` : "",
              v.ouders?.token ? `  ouders: ${basis}/evaluatie/${v.ouders.token}` : "",
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n\n");
        const ploegNaam = kort.get(ploegId) ?? "Ploeg";
        const ploegGroep = groepVanPloeg(kort.get(ploegId));
        const uitnodiging = (rol: Uitnodiging["rol"], voornaam: string, token: string, groep: Groep): Uitnodiging => ({
          rol,
          groep,
          voornaam,
          ploeg: ploegNaam,
          ronde: r.naam,
          tot,
          trainer: ik.naam,
          link: `${basis}/evaluatie/${token}`,
          basis,
          vertrouwelijk: vertrouwelijk(groep),
        });
        const eerste = rijen[0];
        const voorbeelden = eerste
          ? [
              {
                label: ploegGroep === "oud" ? "Mail aan de speler" : "Mail voor de speler",
                u: uitnodiging("speler", eerste.s.voornaam, eerste.v.speler?.token ?? "voorbeeld", ploegGroep),
              },
              { label: "Mail aan de ouders", u: uitnodiging("ouders", eerste.s.voornaam, eerste.v.ouders?.token ?? "voorbeeld", ploegGroep) },
            ]
          : [];

        return (
          <Kaart
            key={ploegId}
            titel={kort.get(ploegId) ?? "Ploeg"}
            rechts={
              <span className="text-sm tabular-nums text-inkt-600">
                trainer {klaar("trainer")}/{rijen.length} · speler {klaar("speler")}/{rijen.length} · ouders {klaar("ouders")}/{rijen.length}
              </span>
            }
          >
            {open && (
              <div className="flex flex-wrap items-center gap-3 text-sm text-inkt-700">
                <span>Stuur elke speler en ouder zijn eigen link. Een link werkt enkel voor die ene speler.</span>
                <KopieerAlles tekst={lijst} label="Alle links kopiëren" />
              </div>
            )}
            {open && <MailVoorbeeld voorbeelden={voorbeelden} />}
            <ul className="grid divide-y divide-zand-100">
              {rijen.map(({ s, v }) => {
                const naam = `${s.voornaam} ${s.achternaam}`;
                const groep = (v.speler ?? v.trainer ?? v.ouders)?.groep ?? ploegGroep;
                const oud = groep === "oud";
                const ouders = s.ouders.map((o) => ({ naam: o.naam || "ouder", gsm: o.gsm, email: o.email }));
                const spelerOntvangers = oud && (s.gsm || s.email) ? [{ naam: s.voornaam, gsm: s.gsm, email: s.email }] : ouders;
                return (
                  <li key={s.id} className="grid gap-3 py-3 lg:grid-cols-[13rem_12rem_minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
                    <Link href={`/spelers/speler/${s.id}`} className="flex items-center gap-3 font-medium hover:text-primary-700">
                      <Portret foto={siteFoto(s)} naam={naam} grootte={36} />
                      {naam}
                    </Link>
                    <div className="grid gap-1">
                      <span className="text-xs text-inkt-600">Trainer</span>
                      <span className="flex flex-wrap items-center gap-2">
                        <Chip s={status(v.trainer)} />
                        {v.trainer?.vrijgegeven && <span className="rounded-md bg-inkt-900 px-2 py-0.5 text-xs text-white">Besproken</span>}
                        <Link
                          href={`/spelers/evaluaties/${id}/speler/${s.id}`}
                          className="rounded-md bg-primary-700 px-2 py-1 text-xs font-semibold text-white hover:bg-primary-800"
                        >
                          {status(v.trainer) === "leeg" ? "Invullen" : "Openen"}
                        </Link>
                      </span>
                    </div>
                    <div className="grid gap-1">
                      <span className="flex items-center gap-2 text-xs text-inkt-600">
                        Speler <Chip s={status(v.speler)} />
                      </span>
                      {open && v.speler?.token && (
                        <LinkKnoppen
                          link={`${basis}/evaluatie/${v.speler.token}`}
                          bericht={
                            oud
                              ? `Dag ${s.voornaam}, hier is je evaluatie van KWS Linkhout. Vul ze in tegen ${tot}:`
                              : `Dag, hier is de evaluatie die ${s.voornaam} zelf invult, gerust samen met u. Graag tegen ${tot}:`
                          }
                          ontvangers={spelerOntvangers}
                          uitnodiging={uitnodiging("speler", s.voornaam, v.speler.token, groep)}
                        />
                      )}
                    </div>
                    <div className="grid gap-1">
                      <span className="flex items-center gap-2 text-xs text-inkt-600">
                        Ouders <Chip s={status(v.ouders)} />
                      </span>
                      {open && v.ouders?.token && (
                        <LinkKnoppen
                          link={`${basis}/evaluatie/${v.ouders.token}`}
                          bericht={`Dag, hier zijn de vragen voor de ouders bij de evaluatie van ${s.voornaam} bij KWS Linkhout. Graag invullen tegen ${tot}:`}
                          ontvangers={ouders}
                          uitnodiging={uitnodiging("ouders", s.voornaam, v.ouders.token, groep)}
                        />
                      )}
                      {open && !s.ouders.length && <span className="text-xs text-inkt-600">Geen ouders in Spond: kopieer de link.</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Kaart>
        );
      })}

      {beheer && (
        <Kaart titel="Instellingen">
          <RondeAanpassen
            actie={rondeAanpassen}
            id={id}
            naam={r.naam}
            tot={r.open_tot}
            ploegen={keuzePloegen}
            gekozen={r.ploegen}
            concept={false}
          />
          <VerwijderRonde actie={rondeVerwijderen} id={id} metAntwoorden={heeftAntwoorden} />
        </Kaart>
      )}
    </div>
  );
}
