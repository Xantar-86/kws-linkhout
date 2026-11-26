import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { magSpeler, vereisGebruiker } from "@/lib/jeugd/toegang";
import {
  aandacht as leesAandacht,
  aanwezigheid,
  leeftijd,
  notities as leesNotities,
  periodes,
  ploegNamen,
  ploeghistoriek,
  ploegen,
  positieVan,
  recenteActiviteiten,
  rugnummerVan,
  siteFoto,
  speler as leesSpeler,
  type Telling,
} from "@/lib/jeugd/gegevens";
import { evaluatiesVanSpeler, instellingen } from "@/lib/jeugd/evaluatie";
import { Verslag } from "@/components/jeugd/Verslag";
import { Evolutie, Vergelijking, domeinScores } from "@/components/jeugd/Grafieken";
import { GegevensAanpassen, KleineActie, NotitieToevoegen } from "@/components/jeugd/Formulieren";
import { blessureHersteld, gegevensBewaren, notitieToevoegen, notitieVerwijderen } from "../../evaluatie-acties";
import { AandachtFormulier } from "../../Formulieren";
import { Balk, Kaart, Portret, datumKort, datumLang, tijdstip } from "../../Onderdelen";

const STATUS: Record<string, { tekst: string; kleur: string }> = {
  komt: { tekst: "Aanwezig", kleur: "bg-emerald-50 text-emerald-800" },
  komt_niet: { tekst: "Afwezig", kleur: "bg-primary-50 text-primary-800" },
  geen_antwoord: { tekst: "Geen antwoord", kleur: "bg-zand-100 text-inkt-700" },
};
const SOORT: Record<string, string> = { training: "Training", wedstrijd: "Wedstrijd", activiteit: "Activiteit" };
const OPVOLGING: Record<string, { tekst: string; kleur: string }> = {
  gehaald: { tekst: "Gehaald", kleur: "bg-emerald-50 text-emerald-800" },
  deels: { tekst: "Deels", kleur: "bg-amber-50 text-amber-800" },
  niet: { tekst: "Nog niet", kleur: "bg-primary-50 text-primary-800" },
};

function Rij({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-2 text-sm">
      <dt className="text-inkt-600">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

function Afwezig({ t }: { t: Telling | undefined }) {
  if (!t || (!t.komt_niet && !t.geen_antwoord)) return null;
  return (
    <p className="text-xs text-inkt-600">
      {t.komt_niet} afgemeld · {t.geen_antwoord} geen antwoord
    </p>
  );
}

export default async function Fiche({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ik = await vereisGebruiker();
  const s = await leesSpeler(id);
  if (!s || !magSpeler(ik, s.ploegen)) notFound();

  const lijst = periodes();
  const [alle, namen, perPeriode, recent, aandacht, notities, historiek, evals] = await Promise.all([
    ploegen(),
    ploegNamen(),
    Promise.all(lijst.map((p) => aanwezigheid(p.van, p.tot, [s.id]).then((m) => m.get(s.id)))),
    recenteActiviteiten(s.id, 15),
    leesAandacht(s.id),
    leesNotities(s.id),
    ploeghistoriek(s.id),
    evaluatiesVanSpeler(s.id),
  ]);
  const zijnPloegen = alle.filter((p) => s.ploegen.includes(p.id));
  const naam = `${s.voornaam} ${s.achternaam}`;
  const foto = siteFoto(s);
  const nr = rugnummerVan(s);
  const pos = positieVan(s);
  const voet = s.extra.voet as string | undefined;
  const gezondheid = Boolean(aandacht?.allergie || aandacht?.medisch);
  const coordinatorZicht = ik.rol !== "trainer";
  const nu = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Brussels" });
  const actieveBlessure = notities.find((n) => n.soort === "blessure" && (!n.tot || n.tot >= nu));

  // Evaluaties: alleen rondes waar al iets in staat.
  const metInhoud = evals.filter((x) => x.trainer?.ingediend || x.speler?.ingediend || x.ouders?.ingediend);
  const punten = metInhoud.map((x) => ({
    ronde: x.ronde.naam,
    trainer: x.trainer?.ingediend ? domeinScores("trainer", x.trainer.antwoorden) : {},
    speler: x.speler?.ingediend ? domeinScores("speler", x.speler.antwoorden) : {},
  }));
  const laatsteBeide = [...metInhoud].reverse().find((x) => x.trainer?.ingediend && x.speler?.ingediend);
  const laatsteWerkpunten = [...metInhoud].reverse().find((x) => x.trainer?.antwoorden.werkpunten?.length);
  const doelen = [...metInhoud].reverse().find((x) => x.speler?.antwoorden.teksten?.h1 || x.speler?.antwoorden.teksten?.h3);

  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <Link href={zijnPloegen[0] ? `/spelers/ploeg/${zijnPloegen[0].id}` : "/spelers"} className="text-sm text-inkt-600 hover:text-primary-700">
          ← {zijnPloegen[0]?.kort ?? "Ploegen"}
        </Link>
      </div>

      <section className="flex flex-wrap items-center gap-5 rounded-xl border border-zand-200 bg-white p-5 shadow-zacht">
        {foto ? (
          <Image src={foto.groot} alt="" width={120} height={120} className="h-28 w-28 rounded-xl bg-zand-200 object-cover" />
        ) : (
          <Portret foto={null} naam={naam} grootte={112} />
        )}
        <div className="grid min-w-0 gap-1">
          <h1 className="font-display text-3xl font-bold uppercase leading-none">{naam}</h1>
          <p className="text-inkt-700">
            {zijnPloegen.map((p) => p.kort).join(", ")}
            {nr !== undefined && <> · nr. {nr}</>}
            {pos && <> · {pos}</>}
            {voet && <> · {voet === "beide" ? "tweevoetig" : `${voet}voetig`}</>}
          </p>
          <div className="flex flex-wrap gap-2">
            {!s.actief && <span className="text-sm font-medium text-primary-700">Staat niet meer in Spond</span>}
            {gezondheid && (
              <span className="rounded-md bg-primary-50 px-2 py-0.5 text-sm font-medium text-primary-800">
                Let op: allergie of medische info, zie aandachtspunten
              </span>
            )}
            {actieveBlessure && (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-sm font-medium text-amber-800">
                Geblesseerd{actieveBlessure.tot ? ` tot ${datumKort(actieveBlessure.tot)}` : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="grid content-start gap-5">
          <Kaart
            titel="Aandachtspunten"
            rechts={aandacht ? <span className="text-xs text-inkt-600">{aandacht.gewijzigd_door}, {tijdstip(aandacht.gewijzigd)}</span> : undefined}
          >
            <AandachtFormulier spelerId={s.id} waarden={aandacht} />
            <p className="text-xs text-inkt-600">Enkel zichtbaar voor wie toegang heeft tot de ploeg. Vul alleen in wat de ouders zelf meegaven.</p>
          </Kaart>

          <Kaart titel="Gegevens">
            <dl className="grid gap-2">
              <Rij label="Geboortedatum">{s.geboortedatum ? `${datumLang(s.geboortedatum)} (${leeftijd(s.geboortedatum)} jaar)` : "niet in Spond"}</Rij>
              <Rij label="Ploeg">{zijnPloegen.map((p) => p.naam).join(", ")}</Rij>
              <Rij label="Positie">{pos ?? "niet ingevuld"}</Rij>
              <Rij label="Voorkeursvoet">{voet ?? "niet ingevuld"}</Rij>
              <Rij label="Rugnummer">{nr ?? "niet ingevuld"}</Rij>
              {s.email && <Rij label="E-mail speler">{s.email}</Rij>}
              {s.gsm && <Rij label="Gsm speler">{s.gsm}</Rij>}
            </dl>
            <GegevensAanpassen
              actie={gegevensBewaren}
              spelerId={s.id}
              rugnummer={s.extra.rugnummer as number | undefined}
              voet={voet}
              positie={s.extra.positiecode as string | undefined}
            />
          </Kaart>

          <Kaart titel="Ouders">
            {s.ouders.length === 0 ? (
              <p className="text-sm text-inkt-600">Geen ouders gekoppeld in Spond.</p>
            ) : (
              <ul className="grid gap-3">
                {s.ouders.map((o, i) => (
                  <li key={i} className="grid gap-0.5 text-sm">
                    <span className="font-medium">{o.naam || "Naam onbekend"}</span>
                    {o.email && <span className="break-all text-inkt-700">{o.email}</span>}
                    {o.gsm && <span className="text-inkt-700">{o.gsm}</span>}
                  </li>
                ))}
              </ul>
            )}
          </Kaart>

          <Kaart titel="Notities en blessures">
            {notities.length === 0 ? (
              <p className="text-sm text-inkt-600">Nog niets genoteerd.</p>
            ) : (
              <ul className="grid gap-3">
                {notities.map((n) => (
                  <li key={n.id} className="grid gap-1 border-l-2 border-zand-200 pl-3 text-sm">
                    <span className="flex flex-wrap items-center gap-2 text-xs text-inkt-600">
                      {n.soort === "blessure" && (
                        <span className={`rounded px-1.5 py-0.5 font-medium ${!n.tot || n.tot >= nu ? "bg-amber-50 text-amber-800" : "bg-zand-100 text-inkt-700"}`}>
                          Blessure{n.van ? ` sinds ${datumKort(n.van)}` : ""}
                          {n.tot ? `, ${n.tot >= nu ? "terug op" : "hersteld"} ${datumKort(n.tot)}` : ""}
                        </span>
                      )}
                      {n.door}, {tijdstip(n.aangemaakt)}
                    </span>
                    <span className="whitespace-pre-line">{n.tekst}</span>
                    <span className="flex gap-3">
                      {n.soort === "blessure" && (!n.tot || n.tot > nu) && <KleineActie actie={blessureHersteld} id={n.id} label="Hersteld vandaag" />}
                      {(n.door === ik.naam || ik.beheerder) && <KleineActie actie={notitieVerwijderen} id={n.id} label="Verwijderen" vraag="Zeker?" />}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <NotitieToevoegen actie={notitieToevoegen} spelerId={s.id} />
          </Kaart>

          {historiek.length > 0 && (
            <Kaart titel="Ploeggeschiedenis">
              <ul className="grid gap-1 text-sm">
                {historiek.map((h) => (
                  <li key={h.seizoen} className="flex justify-between gap-3">
                    <span className="text-inkt-600">{h.seizoen}</span>
                    <span>{h.ploegen.map((p) => namen.get(p) ?? "?").join(", ") || "geen ploeg"}</span>
                  </li>
                ))}
              </ul>
            </Kaart>
          )}
        </div>

        <div className="grid content-start gap-5">
          <Kaart titel="Evaluaties" rechts={<Link href="/spelers/evaluaties" className="text-sm font-medium text-primary-700">Alle evaluaties</Link>}>
            {metInhoud.length === 0 ? (
              <p className="text-sm text-inkt-700">
                Nog geen ingevulde evaluaties. Maak er een via{" "}
                <Link href="/spelers/evaluaties/nieuw" className="font-medium text-primary-700">Evaluaties</Link>; wat trainer, speler en ouders
                invullen, komt hier vanzelf bij.
              </p>
            ) : (
              <div className="grid gap-6">
                {laatsteWerkpunten && (
                  <div className="grid gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-inkt-600">Werkpunten sinds {laatsteWerkpunten.ronde.naam}</h3>
                    <ol className="grid gap-1.5">
                      {laatsteWerkpunten.trainer!.antwoorden.werkpunten!.map((w, i) => {
                        const later = metInhoud
                          .slice(metInhoud.indexOf(laatsteWerkpunten) + 1)
                          .flatMap((x) => x.trainer?.antwoorden.opvolging ?? [])
                          .find((o) => o.tekst === w);
                        return (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-inkt-900 text-[11px] font-bold text-white">{i + 1}</span>
                            <span className="flex-1">{w}</span>
                            {later?.status && (
                              <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${OPVOLGING[later.status].kleur}`}>{OPVOLGING[later.status].tekst}</span>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}

                {doelen && (
                  <div className="grid gap-1 text-sm">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-inkt-600">Doelen van {s.voornaam}</h3>
                    {doelen.speler!.antwoorden.teksten?.h1 && (
                      <p>
                        <span className="text-inkt-600">Dit seizoen: </span>
                        {doelen.speler!.antwoorden.teksten.h1}
                      </p>
                    )}
                    {doelen.speler!.antwoorden.teksten?.h2 && (
                      <p>
                        <span className="text-inkt-600">Over twee jaar: </span>
                        {doelen.speler!.antwoorden.teksten.h2}
                      </p>
                    )}
                    {doelen.speler!.antwoorden.teksten?.h3 && (
                      <p>
                        <span className="text-inkt-600">Droom: </span>
                        {doelen.speler!.antwoorden.teksten.h3}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-inkt-600">Evolutie per onderdeel (gemiddelde score)</h3>
                  {punten.length < 2 && <p className="text-xs text-inkt-600">Na de volgende evaluatie verschijnt hier een lijn.</p>}
                  <Evolutie punten={punten} />
                </div>

                {laatsteBeide && (
                  <div className="grid gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-inkt-600">Trainer naast speler, {laatsteBeide.ronde.naam}</h3>
                    <Vergelijking trainer={laatsteBeide.trainer!.antwoorden} speler={laatsteBeide.speler!.antwoorden} />
                  </div>
                )}

                <div className="grid gap-3">
                  {[...metInhoud].reverse().map((x, i) => {
                    const inst = instellingen(x.ronde);
                    return (
                      <details key={x.ronde.id} open={i === 0} className="rounded-lg border border-zand-200">
                        <summary className="flex cursor-pointer flex-wrap items-center gap-2 px-3 py-2">
                          <span className="font-semibold">{x.ronde.naam}</span>
                          <span className="text-xs text-inkt-600">
                            {[x.trainer?.ingediend && "trainer", x.speler?.ingediend && "speler", x.ouders?.ingediend && "ouders"].filter(Boolean).join(", ")}
                            {x.trainer?.besproken_op && <> · besproken {datumKort(x.trainer.besproken_op)}</>}
                          </span>
                          {x.trainer && (
                            <Link href={`/spelers/evaluaties/${x.ronde.id}/speler/${s.id}`} className="ml-auto text-xs font-medium text-primary-700">
                              Openen
                            </Link>
                          )}
                        </summary>
                        <div className="grid gap-5 border-t border-zand-200 p-3">
                          {x.trainer?.ingediend && (
                            <div className="grid gap-2">
                              <h4 className="font-display text-base font-bold uppercase">Trainer{x.trainer.ingevuld_door ? `: ${x.trainer.ingevuld_door}` : ""}</h4>
                              <Verslag rol="trainer" groep={x.trainer.groep} inst={inst} a={x.trainer.antwoorden} />
                            </div>
                          )}
                          {x.speler?.ingediend && (
                            <div className="grid gap-2">
                              <h4 className="font-display text-base font-bold uppercase">Speler zelf</h4>
                              <Verslag rol="speler" groep={x.speler.groep} inst={inst} a={x.speler.antwoorden} />
                            </div>
                          )}
                          {x.ouders?.ingediend && (
                            <div className="grid gap-2">
                              <h4 className="font-display text-base font-bold uppercase">Ouders{x.ouders.ingevuld_door ? `: ${x.ouders.ingevuld_door}` : ""}</h4>
                              <Verslag rol="ouders" groep={x.ouders.groep} inst={inst} a={x.ouders.antwoorden} vertrouwelijk={coordinatorZicht} />
                            </div>
                          )}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>
            )}
          </Kaart>

          <Kaart titel="Aanwezigheid" rechts={<span className="text-xs text-inkt-600">volgens Spond, enkel voorbije activiteiten</span>}>
            <div className="grid gap-5 sm:grid-cols-3">
              {lijst.map((p, i) => (
                <div key={p.sleutel} className="grid content-start gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-inkt-600">{p.naam}</h3>
                  <div className="grid gap-1">
                    <Balk label="Trainingen" telling={perPeriode[i]?.training} />
                    <Afwezig t={perPeriode[i]?.training} />
                  </div>
                  <div className="grid gap-1">
                    <Balk label="Wedstrijden" telling={perPeriode[i]?.wedstrijd} />
                    <Afwezig t={perPeriode[i]?.wedstrijd} />
                  </div>
                </div>
              ))}
            </div>
          </Kaart>

          <Kaart titel="Laatste activiteiten">
            {recent.length === 0 ? (
              <p className="text-sm text-inkt-600">Nog geen activiteiten.</p>
            ) : (
              <ul className="grid divide-y divide-zand-100">
                {recent.map((a) => (
                  <li key={a.id} className="flex items-center gap-3 py-2 text-sm">
                    <span className="w-14 shrink-0 tabular-nums text-inkt-600">{datumKort(a.start)}</span>
                    <span className="min-w-0 flex-1 truncate">
                      <span className="text-inkt-600">{SOORT[a.soort]}</span>
                      {a.soort === "wedstrijd" && a.tegenstander ? <> tegen {a.tegenstander}</> : a.soort !== "training" ? <> · {a.titel}</> : null}
                    </span>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${STATUS[a.status].kleur}`}>{STATUS[a.status].tekst}</span>
                  </li>
                ))}
              </ul>
            )}
          </Kaart>
        </div>
      </div>
    </div>
  );
}
