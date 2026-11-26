import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { magSpeler, vereisGebruiker } from "@/lib/jeugd/toegang";
import {
  aandacht as leesAandacht,
  aanwezigheid,
  leeftijd,
  periodes,
  ploegen,
  recenteActiviteiten,
  siteFoto,
  siteKern,
  speler as leesSpeler,
} from "@/lib/jeugd/gegevens";
import { POSITIES } from "@/lib/kernen";
import { AandachtFormulier } from "../../Formulieren";
import { Balk, Kaart, Portret, datumKort, datumLang, tijdstip } from "../../Onderdelen";

const STATUS: Record<string, { tekst: string; kleur: string }> = {
  komt: { tekst: "Aanwezig", kleur: "bg-emerald-50 text-emerald-800" },
  komt_niet: { tekst: "Afwezig", kleur: "bg-primary-50 text-primary-800" },
  geen_antwoord: { tekst: "Geen antwoord", kleur: "bg-zand-100 text-inkt-700" },
};
const SOORT: Record<string, string> = { training: "Training", wedstrijd: "Wedstrijd", activiteit: "Activiteit" };

function Rij({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-2 text-sm">
      <dt className="text-inkt-600">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

export default async function Fiche({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ik = await vereisGebruiker();
  const s = await leesSpeler(id);
  if (!s || !magSpeler(ik, s.ploegen)) notFound();

  const alle = await ploegen();
  const zijnPloegen = alle.filter((p) => s.ploegen.includes(p.id));
  const naam = `${s.voornaam} ${s.achternaam}`;
  const foto = siteFoto(s);
  const kern = siteKern(s);
  const nr = (s.extra.rugnummer as number | undefined) ?? kern?.nummer;
  const pos = (s.extra.positie as string | undefined) ?? (kern?.positie ? POSITIES[kern.positie] : undefined);

  const lijst = periodes();
  const [perPeriode, recent, aandacht] = await Promise.all([
    Promise.all(lijst.map((p) => aanwezigheid(p.van, p.tot, [s.id]).then((m) => m.get(s.id)))),
    recenteActiviteiten(s.id, 15),
    leesAandacht(s.id),
  ]);
  const gezondheid = Boolean(aandacht?.allergie || aandacht?.medisch);

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
          </p>
          {!s.actief && <p className="text-sm font-medium text-primary-700">Staat niet meer in Spond</p>}
          {gezondheid && (
            <p className="w-fit rounded-md bg-primary-50 px-2 py-0.5 text-sm font-medium text-primary-800">
              Let op: allergie of medische info, zie aandachtspunten
            </p>
          )}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="grid content-start gap-5">
          <Kaart
            titel="Aandachtspunten"
            rechts={
              aandacht ? (
                <span className="text-xs text-inkt-600">
                  {aandacht.gewijzigd_door}, {tijdstip(aandacht.gewijzigd)}
                </span>
              ) : undefined
            }
          >
            <AandachtFormulier spelerId={s.id} waarden={aandacht} />
            <p className="text-xs text-inkt-600">
              Enkel zichtbaar voor wie toegang heeft tot de ploeg. Vul alleen in wat de ouders zelf meegaven.
            </p>
          </Kaart>

          <Kaart titel="Gegevens">
            <dl className="grid gap-2">
              <Rij label="Geboortedatum">
                {s.geboortedatum ? `${datumLang(s.geboortedatum)} (${leeftijd(s.geboortedatum)} jaar)` : "niet in Spond"}
              </Rij>
              <Rij label="Ploeg">{zijnPloegen.map((p) => p.naam).join(", ")}</Rij>
              {s.email && <Rij label="E-mail speler">{s.email}</Rij>}
              {s.gsm && <Rij label="Gsm speler">{s.gsm}</Rij>}
            </dl>
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
        </div>

        <div className="grid content-start gap-5">
          <Kaart titel="Aanwezigheid" rechts={<span className="text-xs text-inkt-600">volgens Spond</span>}>
            <div className="grid gap-5 sm:grid-cols-3">
              {lijst.map((p, i) => (
                <div key={p.sleutel} className="grid content-start gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-inkt-600">{p.naam}</h3>
                  <Balk label="Trainingen" telling={perPeriode[i]?.training} />
                  <Balk label="Wedstrijden" telling={perPeriode[i]?.wedstrijd} />
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

          <Kaart titel="Evaluaties">
            <p className="text-sm text-inkt-700">
              Hier komen de halfjaarlijkse evaluaties van trainer, speler en ouders, met de evolutie per onderdeel. Dit deel
              volgt zodra de club de vragenlijst gekozen heeft.
            </p>
          </Kaart>
        </div>
      </div>
    </div>
  );
}
