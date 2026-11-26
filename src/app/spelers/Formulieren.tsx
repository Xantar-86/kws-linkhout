"use client";

import { useActionState, useState } from "react";
import {
  aandachtBewaren,
  aanmelden,
  gebruikerAanpassen,
  gebruikerToevoegen,
  gebruikerVerwijderen,
  nieuweLink,
  nuSynchroniseren,
  wachtwoordKiezen,
  type Staat,
} from "./acties";

const veld =
  "w-full rounded-lg border border-zand-300 bg-white px-3 py-2.5 text-[15px] text-inkt-900 outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-700/15";
const knop =
  "inline-flex items-center justify-center rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60";
const knopLicht =
  "inline-flex items-center justify-center rounded-lg border border-zand-300 bg-white px-3 py-2 text-sm font-medium text-inkt-800 hover:border-inkt-600 disabled:opacity-60";

function Melding({ staat }: { staat: Staat }) {
  const [gekopieerd, setGekopieerd] = useState(false);
  if (!staat) return null;
  if (staat.fout) return <p className="rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-800">{staat.fout}</p>;
  return (
    <div className="grid gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
      <p>{staat.ok}</p>
      {staat.link && (
        <div className="flex flex-wrap items-center gap-2">
          <input readOnly value={staat.link} className={`${veld} min-w-0 flex-1 font-mono text-xs`} onFocus={(e) => e.target.select()} />
          <button
            type="button"
            className={knopLicht}
            onClick={() => {
              navigator.clipboard.writeText(staat.link!).then(() => setGekopieerd(true), () => setGekopieerd(false));
            }}
          >
            {gekopieerd ? "Gekopieerd" : "Kopieer link"}
          </button>
        </div>
      )}
    </div>
  );
}

export function AanmeldFormulier() {
  const [staat, actie, bezig] = useActionState(aanmelden, null);
  return (
    <form action={actie} className="grid gap-3">
      <label className="grid gap-1 text-sm font-medium text-inkt-800">
        E-mailadres
        <input name="email" type="email" autoComplete="username" required className={veld} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-inkt-800">
        Wachtwoord
        <input name="wachtwoord" type="password" autoComplete="current-password" required className={veld} />
      </label>
      <Melding staat={staat} />
      <button className={knop} disabled={bezig}>{bezig ? "Even geduld..." : "Aanmelden"}</button>
    </form>
  );
}

export function WachtwoordFormulier({ code }: { code: string }) {
  const [staat, actie, bezig] = useActionState(wachtwoordKiezen, null);
  return (
    <form action={actie} className="grid gap-3">
      <input type="hidden" name="code" value={code} />
      <label className="grid gap-1 text-sm font-medium text-inkt-800">
        Nieuw wachtwoord (minstens 10 tekens)
        <input name="wachtwoord" type="password" autoComplete="new-password" minLength={10} required className={veld} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-inkt-800">
        Nog eens hetzelfde
        <input name="herhaal" type="password" autoComplete="new-password" minLength={10} required className={veld} />
      </label>
      <Melding staat={staat} />
      <button className={knop} disabled={bezig}>{bezig ? "Even geduld..." : "Wachtwoord bewaren en aanmelden"}</button>
    </form>
  );
}

type PloegKeuze = { id: string; kort: string };

function PloegVinkjes({ ploegen, gekozen = [] }: { ploegen: PloegKeuze[]; gekozen?: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ploegen.map((p) => (
        <label key={p.id} className="flex cursor-pointer items-center gap-1.5 rounded-md border border-zand-300 bg-white px-2 py-1 text-sm has-[:checked]:border-primary-700 has-[:checked]:bg-primary-50">
          <input type="checkbox" name="ploegen" value={p.id} defaultChecked={gekozen.includes(p.id)} className="accent-primary-700" />
          {p.kort}
        </label>
      ))}
    </div>
  );
}

export function ToevoegFormulier({ ploegen, voorstel }: { ploegen: PloegKeuze[]; voorstel?: { naam?: string; email?: string; ploegen?: string[] } }) {
  const [staat, actie, bezig] = useActionState(gebruikerToevoegen, null);
  const [rol, setRol] = useState("trainer");
  return (
    <form action={actie} className="grid gap-3" key={voorstel?.email ?? "leeg"}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-inkt-800">
          Naam
          <input name="naam" defaultValue={voorstel?.naam} required className={veld} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-inkt-800">
          E-mailadres
          <input name="email" type="email" defaultValue={voorstel?.email} required className={veld} />
        </label>
      </div>
      <fieldset className="grid gap-1.5">
        <legend className="text-sm font-medium text-inkt-800">Rol</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          {[
            ["trainer", "Trainer"],
            ["coordinator", "Coördinator"],
            ["bestuur", "Bestuur (alle ploegen)"],
          ].map(([w, t]) => (
            <label key={w} className="flex items-center gap-1.5">
              <input type="radio" name="rol" value={w} checked={rol === w} onChange={() => setRol(w)} className="accent-primary-700" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>
      {rol !== "bestuur" && (
        <fieldset className="grid gap-1.5">
          <legend className="text-sm font-medium text-inkt-800">Ploegen die deze persoon ziet</legend>
          <PloegVinkjes ploegen={ploegen} gekozen={voorstel?.ploegen} />
        </fieldset>
      )}
      <label className="flex items-center gap-2 text-sm text-inkt-800">
        <input type="checkbox" name="beheerder" className="accent-primary-700" />
        Mag ook accounts beheren
      </label>
      <Melding staat={staat} />
      <div>
        <button className={knop} disabled={bezig}>{bezig ? "Even geduld..." : "Account maken en link tonen"}</button>
      </div>
    </form>
  );
}

export function AanpasFormulier({
  gebruiker,
  ploegen,
}: {
  gebruiker: { id: string; rol: string; ploegen: string[]; beheerder: boolean };
  ploegen: PloegKeuze[];
}) {
  const [staat, actie, bezig] = useActionState(gebruikerAanpassen, null);
  const [rol, setRol] = useState(gebruiker.rol);
  return (
    <form action={actie} className="grid gap-2">
      <input type="hidden" name="id" value={gebruiker.id} />
      <div className="flex flex-wrap gap-4 text-sm">
        {[
          ["trainer", "Trainer"],
          ["coordinator", "Coördinator"],
          ["bestuur", "Bestuur"],
        ].map(([w, t]) => (
          <label key={w} className="flex items-center gap-1.5">
            <input type="radio" name="rol" value={w} checked={rol === w} onChange={() => setRol(w)} className="accent-primary-700" />
            {t}
          </label>
        ))}
        <label className="flex items-center gap-1.5">
          <input type="checkbox" name="beheerder" defaultChecked={gebruiker.beheerder} className="accent-primary-700" />
          Beheerder
        </label>
      </div>
      {rol !== "bestuur" && <PloegVinkjes ploegen={ploegen} gekozen={gebruiker.ploegen} />}
      <Melding staat={staat} />
      <div>
        <button className={knopLicht} disabled={bezig}>{bezig ? "Bewaren..." : "Bewaar"}</button>
      </div>
    </form>
  );
}

export function LinkKnop({ id }: { id: string }) {
  const [staat, actie, bezig] = useActionState(nieuweLink, null);
  return (
    <form action={actie} className="grid gap-2">
      <input type="hidden" name="id" value={id} />
      <div>
        <button className={knopLicht} disabled={bezig}>Nieuwe uitnodigingslink</button>
      </div>
      <Melding staat={staat} />
    </form>
  );
}

export function VerwijderKnop({ id, naam }: { id: string; naam: string }) {
  const [staat, actie, bezig] = useActionState(gebruikerVerwijderen, null);
  const [zeker, setZeker] = useState(false);
  return (
    <form action={actie} className="grid gap-2">
      <input type="hidden" name="id" value={id} />
      {zeker ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span>{naam} verwijderen?</span>
          <button className="rounded-lg bg-primary-700 px-3 py-2 text-sm font-semibold text-white" disabled={bezig}>Ja, verwijder</button>
          <button type="button" className={knopLicht} onClick={() => setZeker(false)}>Nee</button>
        </div>
      ) : (
        <div>
          <button type="button" className={knopLicht} onClick={() => setZeker(true)}>Verwijderen</button>
        </div>
      )}
      <Melding staat={staat} />
    </form>
  );
}

export function SyncKnop() {
  const [staat, actie, bezig] = useActionState(nuSynchroniseren, null);
  return (
    <form action={actie} className="grid gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <button className={knop} disabled={bezig}>{bezig ? "Bezig met Spond..." : "Nu ophalen uit Spond"}</button>
        <label className="flex items-center gap-1.5 text-sm text-inkt-700">
          <input type="checkbox" name="volledig" className="accent-primary-700" />
          Heel het seizoen (trager)
        </label>
      </div>
      <Melding staat={staat} />
    </form>
  );
}

const AANDACHT = [
  { naam: "allergie", label: "Allergieën en medicatie", hint: "Bv. allergisch voor noten of bijen, puffer of epipen bij zich" },
  { naam: "medisch", label: "Medisch", hint: "Bv. astma, diabetes, epilepsie, blessure of operatie" },
  { naam: "rekening", label: "Waar we rekening mee houden", hint: "Bv. bril, gehoor, concentratie, wie de speler ophaalt" },
] as const;

export function AandachtFormulier({
  spelerId,
  waarden,
}: {
  spelerId: string;
  waarden: { allergie: string | null; medisch: string | null; rekening: string | null } | null;
}) {
  const [staat, actie, bezig] = useActionState(aandachtBewaren, null);
  const leeg = !waarden || !(waarden.allergie || waarden.medisch || waarden.rekening);
  // Open zolang er na het openen niets bewaard is (een fout houdt het open).
  const [bijOpenen, setBijOpenen] = useState<Staat | undefined>(undefined);
  const open = bijOpenen !== undefined && (staat === bijOpenen || Boolean(staat?.fout));

  if (!open) {
    return (
      <div className="grid gap-3">
        {leeg ? (
          <p className="text-sm text-inkt-600">Niets ingevuld.</p>
        ) : (
          <dl className="grid gap-3">
            {AANDACHT.map((v) =>
              waarden?.[v.naam] ? (
                <div key={v.naam} className="grid gap-0.5 text-sm">
                  <dt className="font-medium text-inkt-800">{v.label}</dt>
                  <dd className="whitespace-pre-line text-inkt-700">{waarden[v.naam]}</dd>
                </div>
              ) : null,
            )}
          </dl>
        )}
        {staat?.ok && <Melding staat={staat} />}
        <div>
          <button type="button" className={knopLicht} onClick={() => setBijOpenen(staat)}>
            {leeg ? "Invullen" : "Aanpassen"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={actie} className="grid gap-3">
      <input type="hidden" name="speler" value={spelerId} />
      {AANDACHT.map((v) => (
        <label key={v.naam} className="grid gap-1 text-sm font-medium text-inkt-800">
          {v.label}
          <textarea
            name={v.naam}
            rows={2}
            maxLength={2000}
            defaultValue={waarden?.[v.naam] ?? ""}
            placeholder={v.hint}
            className={`${veld} font-normal`}
          />
        </label>
      ))}
      <Melding staat={staat} />
      <div className="flex flex-wrap gap-2">
        <button className={knop} disabled={bezig}>{bezig ? "Bewaren..." : "Bewaar"}</button>
        <button type="button" className={knopLicht} onClick={() => setBijOpenen(undefined)}>Annuleren</button>
      </div>
    </form>
  );
}
