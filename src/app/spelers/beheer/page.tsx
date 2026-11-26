import { db } from "@/lib/supabase";
import { vereisBeheerder } from "@/lib/jeugd/toegang";
import { laatsteSync, ploegen as leesPloegen } from "@/lib/jeugd/gegevens";
import { AanpasFormulier, LinkKnop, SyncKnop, ToevoegFormulier, VerwijderKnop } from "../Formulieren";
import { Kaart, tijdstip } from "../Onderdelen";

const ROL: Record<string, string> = { bestuur: "Bestuur", coordinator: "Coördinator", trainer: "Trainer" };

type Rij = {
  id: string;
  naam: string;
  email: string;
  rol: string;
  ploegen: string[];
  beheerder: boolean;
  wachtwoord: string | null;
  uitnodiging_tot: string | null;
  laatst_aangemeld: string | null;
};

export default async function Beheer({ searchParams }: { searchParams: Promise<{ staf?: string }> }) {
  const ik = await vereisBeheerder();
  const { staf: stafId } = await searchParams;
  const [ploegen, sync, gebruikers, staf] = await Promise.all([
    leesPloegen(),
    laatsteSync(),
    db().from("jeugd_gebruikers").select("id, naam, email, rol, ploegen, beheerder, wachtwoord, uitnodiging_tot, laatst_aangemeld").order("naam"),
    db().from("jeugd_staf").select("id, naam, email, rollen, ploegen").order("naam"),
  ]);
  const lijst = (gebruikers.data ?? []) as Rij[];
  const kort = new Map(ploegen.map((p) => [p.id, p.kort]));
  const keuze = ploegen.map((p) => ({ id: p.id, kort: p.kort }));
  const bekend = new Set(lijst.map((g) => g.email.toLowerCase()));
  const stafLijst = (staf.data ?? []) as { id: string; naam: string; email: string | null; rollen: string[]; ploegen: string[] }[];
  const voorstel = stafLijst.find((s) => s.id === stafId);

  return (
    <div className="grid gap-6">
      <h1 className="font-display text-3xl font-bold uppercase">Beheer</h1>

      <Kaart titel="Spond">
        <p className="text-sm text-inkt-700">
          Elke nacht worden de spelers, ploegen en aanwezigheden uit Spond opgehaald.
          {sync && (
            <>
              {" "}Laatste keer: {tijdstip(sync.start)},{" "}
              {sync.ok ? "gelukt" : sync.ok === false ? <span className="text-primary-700">mislukt: {sync.bericht}</span> : "bezig"}.
            </>
          )}
        </p>
        <SyncKnop />
      </Kaart>

      <Kaart titel="Wie heeft toegang" rechts={<span className="text-sm text-inkt-600">{lijst.length} accounts</span>}>
        <ul className="grid divide-y divide-zand-100">
          {lijst.map((g) => {
            const status = g.wachtwoord
              ? g.laatst_aangemeld
                ? `laatst aangemeld ${tijdstip(g.laatst_aangemeld)}`
                : "actief"
              : g.uitnodiging_tot && new Date(g.uitnodiging_tot) > new Date()
                ? `uitgenodigd, link geldig tot ${tijdstip(g.uitnodiging_tot)}`
                : "uitnodiging verlopen";
            return (
              <li key={g.id} className="grid gap-3 py-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-semibold">{g.naam}</span>
                  <span className="text-sm text-inkt-600">{g.email}</span>
                  <span className="rounded-md bg-zand-100 px-2 py-0.5 text-xs font-medium">{ROL[g.rol]}</span>
                  {g.beheerder && <span className="rounded-md bg-inkt-900 px-2 py-0.5 text-xs font-medium text-white">Beheerder</span>}
                  <span className="text-xs text-inkt-600">{status}</span>
                </div>
                <p className="text-sm text-inkt-700">
                  Ziet: {g.rol === "bestuur" ? "alle ploegen" : g.ploegen.map((p) => kort.get(p) ?? "?").join(", ") || "niets"}
                </p>
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-primary-700">Aanpassen</summary>
                  <div className="mt-3 grid gap-4 rounded-lg bg-zand-50 p-3">
                    <AanpasFormulier gebruiker={g} ploegen={keuze} />
                    <LinkKnop id={g.id} />
                    {g.id !== ik.id && <VerwijderKnop id={g.id} naam={g.naam} />}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      </Kaart>

      <div id="nieuw">
        <Kaart titel="Iemand toegang geven">
          <p className="text-sm text-inkt-700">
            Na het bewaren krijg je een link. Stuur die zelf door, bijvoorbeeld via WhatsApp. Via die link kiest de persoon
            een wachtwoord. Wachtwoord vergeten? Maak hierboven een nieuwe link.
          </p>
          <ToevoegFormulier
            ploegen={keuze}
            voorstel={voorstel ? { naam: voorstel.naam, email: voorstel.email ?? "", ploegen: voorstel.ploegen } : undefined}
          />
        </Kaart>
      </div>

      <Kaart titel="Trainers en afgevaardigden in Spond">
        <p className="text-sm text-inkt-700">Klik op een naam om het formulier hierboven in te vullen.</p>
        <ul className="grid gap-1 sm:grid-cols-2">
          {stafLijst.map((s) => (
            <li key={s.id} className="text-sm">
              {s.email && bekend.has(s.email.toLowerCase()) ? (
                <span className="text-inkt-600">{s.naam} (heeft al toegang)</span>
              ) : (
                <a href={`/spelers/beheer?staf=${s.id}#nieuw`} className="font-medium hover:text-primary-700">
                  {s.naam}
                </a>
              )}
              <span className="text-inkt-600"> · {s.rollen.join(", ")} · {s.ploegen.map((p) => kort.get(p) ?? "?").join(", ")}</span>
            </li>
          ))}
        </ul>
      </Kaart>
    </div>
  );
}
