"use client";

import { useActionState, useState } from "react";

type Staat = { fout?: string; ok?: string } | null;
type Actie = (vorige: Staat, form: FormData) => Promise<Staat>;

export const veld =
  "w-full rounded-lg border border-zand-300 bg-white px-3 py-2.5 text-[15px] text-inkt-900 outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-700/15";
export const knop =
  "inline-flex items-center justify-center rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60";
export const knopLicht =
  "inline-flex items-center justify-center rounded-lg border border-zand-300 bg-white px-3 py-2 text-sm font-medium text-inkt-800 hover:border-inkt-600 disabled:opacity-60";

export function Melding({ staat }: { staat: Staat }) {
  if (!staat) return null;
  if (staat.fout) return <p className="rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-800">{staat.fout}</p>;
  return <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{staat.ok}</p>;
}

type PloegKeuze = { id: string; kort: string };

function PloegKeuzes({ ploegen, gekozen = [] }: { ploegen: PloegKeuze[]; gekozen?: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ploegen.map((p) => (
        <label
          key={p.id}
          className="flex cursor-pointer items-center gap-1.5 rounded-md border border-zand-300 bg-white px-2.5 py-1.5 text-sm has-[:checked]:border-primary-700 has-[:checked]:bg-primary-50"
        >
          <input type="checkbox" name="ploegen" value={p.id} defaultChecked={gekozen.includes(p.id)} className="accent-primary-700" />
          {p.kort}
        </label>
      ))}
    </div>
  );
}

export function NieuweRonde({ actie, ploegen, voorstelNaam, voorstelTot }: { actie: Actie; ploegen: PloegKeuze[]; voorstelNaam: string; voorstelTot: string }) {
  const [staat, verstuur, bezig] = useActionState(actie, null);
  return (
    <form action={verstuur} className="grid gap-4">
      <label className="grid gap-1 text-sm font-medium text-inkt-800">
        Naam
        <input name="naam" defaultValue={voorstelNaam} required maxLength={120} className={veld} />
      </label>
      <fieldset className="grid gap-1.5">
        <legend className="text-sm font-medium text-inkt-800">Voor welke ploeg</legend>
        <PloegKeuzes ploegen={ploegen} gekozen={ploegen.length === 1 ? [ploegen[0].id] : []} />
      </fieldset>
      <label className="grid gap-1 text-sm font-medium text-inkt-800 sm:w-60">
        In te vullen tot en met
        <input name="open_tot" type="date" defaultValue={voorstelTot} required className={veld} />
      </label>
      <Melding staat={staat} />
      <div>
        <button className={knop} disabled={bezig}>{bezig ? "Even geduld..." : "Verder: vragen kiezen"}</button>
      </div>
    </form>
  );
}

export function RondeAanpassen({
  actie,
  id,
  naam,
  tot,
  ploegen,
  gekozen,
  concept,
}: {
  actie: Actie;
  id: string;
  naam: string;
  tot: string;
  ploegen: PloegKeuze[];
  gekozen: string[];
  concept: boolean;
}) {
  const [staat, verstuur, bezig] = useActionState(actie, null);
  return (
    <form action={verstuur} className="grid gap-3">
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-3 sm:grid-cols-[1fr_14rem]">
        <label className="grid gap-1 text-sm font-medium text-inkt-800">
          Naam
          <input name="naam" defaultValue={naam} required maxLength={120} className={veld} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-inkt-800">
          In te vullen tot en met
          <input name="open_tot" type="date" defaultValue={tot} required className={veld} />
        </label>
      </div>
      {concept && (
        <fieldset className="grid gap-1.5">
          <legend className="text-sm font-medium text-inkt-800">Ploegen</legend>
          <PloegKeuzes ploegen={ploegen} gekozen={gekozen} />
        </fieldset>
      )}
      <Melding staat={staat} />
      <div>
        <button className={knopLicht} disabled={bezig}>{bezig ? "Bewaren..." : "Bewaar"}</button>
      </div>
    </form>
  );
}

export function Versturen({ actie, id, tot, aantal }: { actie: Actie; id: string; tot: string; aantal: number }) {
  const [staat, verstuur, bezig] = useActionState(actie, null);
  const [zeker, setZeker] = useState(false);
  return (
    <form action={verstuur} className="grid gap-3">
      <input type="hidden" name="id" value={id} />
      <label className="grid gap-1 text-sm font-medium text-inkt-800 sm:w-60">
        In te vullen tot en met
        <input name="open_tot" type="date" defaultValue={tot} required className={veld} />
      </label>
      <Melding staat={staat} />
      {zeker ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm">Na het versturen liggen de vragen vast. Klaar?</span>
          <button className={knop} disabled={bezig}>{bezig ? "Bezig..." : `Ja, maak de links voor ${aantal} spelers`}</button>
          <button type="button" className={knopLicht} onClick={() => setZeker(false)}>Nee, nog aanpassen</button>
        </div>
      ) : (
        <div>
          <button type="button" className={knop} onClick={() => setZeker(true)}>Versturen naar de spelers</button>
        </div>
      )}
    </form>
  );
}

export function VerwijderRonde({ actie, id, metAntwoorden }: { actie: Actie; id: string; metAntwoorden: boolean }) {
  const [staat, verstuur, bezig] = useActionState(actie, null);
  const [zeker, setZeker] = useState(false);
  return (
    <form action={verstuur} className="grid gap-2">
      <input type="hidden" name="id" value={id} />
      {zeker ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span>{metAntwoorden ? "Alle ingevulde antwoorden gaan mee verloren. Zeker?" : "Deze evaluatie verwijderen?"}</span>
          <button className="rounded-lg bg-primary-700 px-3 py-2 font-semibold text-white" disabled={bezig}>Ja, verwijder</button>
          <button type="button" className={knopLicht} onClick={() => setZeker(false)}>Nee</button>
        </div>
      ) : (
        <div>
          <button type="button" className={knopLicht} onClick={() => setZeker(true)}>Evaluatie verwijderen</button>
        </div>
      )}
      <Melding staat={staat} />
    </form>
  );
}

export function Besproken({
  actie,
  id,
  besprokenOp,
  vrijgegeven,
  vandaag,
}: {
  actie: Actie;
  id: string;
  besprokenOp: string | null;
  vrijgegeven: boolean;
  vandaag: string;
}) {
  const [staat, verstuur, bezig] = useActionState(actie, null);
  return (
    <div className="grid gap-3">
      <form action={verstuur} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={id} />
        <label className="grid gap-1 text-sm font-medium text-inkt-800">
          Besproken met de speler op
          <input name="besproken_op" type="date" defaultValue={besprokenOp ?? vandaag} className={veld} />
        </label>
        <label className="flex items-center gap-2 pb-3 text-sm text-inkt-800">
          <input type="checkbox" name="vrijgeven" defaultChecked={vrijgegeven || !besprokenOp} className="accent-primary-700" />
          Verslag tonen aan speler en ouders
        </label>
        <button className={knopLicht} disabled={bezig}>Bewaar</button>
      </form>
      {vrijgegeven && (
        <form action={verstuur}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="intrekken" value="1" />
          <button className="text-sm text-primary-700" disabled={bezig}>Verslag weer verbergen</button>
        </form>
      )}
      <Melding staat={staat} />
    </div>
  );
}

/** Kopieer- en deelknoppen voor één persoonlijke link. */
export function LinkKnoppen({
  link,
  bericht,
  ontvangers,
}: {
  link: string;
  bericht: string;
  ontvangers: { naam: string; gsm: string | null; email: string | null }[];
}) {
  const [gekopieerd, setGekopieerd] = useState(false);
  const tekst = `${bericht}\n${link}`;
  const wa = (gsm: string) => `https://wa.me/${gsm.replace(/[^\d]/g, "").replace(/^0/, "32")}?text=${encodeURIComponent(tekst)}`;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(tekst).then(() => setGekopieerd(true), () => setGekopieerd(false))}
        className="rounded-md border border-zand-300 bg-white px-2 py-1 text-xs font-medium hover:border-inkt-600"
      >
        {gekopieerd ? "Gekopieerd" : "Kopieer"}
      </button>
      {ontvangers.map((o, i) => (
        <span key={i} className="inline-flex gap-1">
          {o.gsm && (
            <a
              href={wa(o.gsm)}
              target="_blank"
              rel="noopener noreferrer"
              title={`WhatsApp naar ${o.naam}`}
              className="rounded-md bg-[#1f7a4d] px-2 py-1 text-xs font-medium text-white hover:bg-[#17603c]"
            >
              WhatsApp {o.naam.split(" ")[0]}
            </a>
          )}
          {o.email && (
            <a
              href={`mailto:${o.email}?subject=${encodeURIComponent("Evaluatie KWS Linkhout")}&body=${encodeURIComponent(tekst)}`}
              title={`Mail naar ${o.naam}`}
              className="rounded-md border border-zand-300 bg-white px-2 py-1 text-xs font-medium hover:border-inkt-600"
            >
              Mail {o.naam.split(" ")[0]}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}

export function KopieerAlles({ tekst, label }: { tekst: string; label: string }) {
  const [klaar, setKlaar] = useState(false);
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(tekst).then(() => setKlaar(true), () => setKlaar(false))}
      className={knopLicht}
    >
      {klaar ? "Gekopieerd" : label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Fiche

export function NotitieToevoegen({ actie, spelerId }: { actie: Actie; spelerId: string }) {
  const [staat, verstuur, bezig] = useActionState(actie, null);
  const [soort, setSoort] = useState<"notitie" | "blessure">("notitie");
  const [sleutel, setSleutel] = useState(0);
  return (
    <form
      key={sleutel}
      action={async (f) => {
        verstuur(f);
        setSleutel((k) => k + 1);
      }}
      className="grid gap-2 rounded-lg bg-zand-50 p-3"
    >
      <input type="hidden" name="speler" value={spelerId} />
      <div className="flex gap-3 text-sm">
        {(
          [
            ["notitie", "Notitie"],
            ["blessure", "Blessure"],
          ] as const
        ).map(([k, t]) => (
          <label key={k} className="flex items-center gap-1.5">
            <input type="radio" name="soort" value={k} checked={soort === k} onChange={() => setSoort(k)} className="accent-primary-700" />
            {t}
          </label>
        ))}
      </div>
      <textarea
        name="tekst"
        rows={2}
        maxLength={2000}
        required
        placeholder={soort === "blessure" ? "Bv. verstuikte enkel, mag lopen maar nog geen duels" : "Bv. gesprek gehad over inzet op training"}
        className={veld}
      />
      {soort === "blessure" && (
        <div className="flex flex-wrap gap-3">
          <label className="grid gap-1 text-xs text-inkt-700">
            Sinds
            <input type="date" name="van" className="rounded-lg border border-zand-300 bg-white px-2 py-1.5 text-sm" />
          </label>
          <label className="grid gap-1 text-xs text-inkt-700">
            Terug op (als gekend)
            <input type="date" name="tot" className="rounded-lg border border-zand-300 bg-white px-2 py-1.5 text-sm" />
          </label>
        </div>
      )}
      <div>
        <button className={knopLicht} disabled={bezig}>Toevoegen</button>
      </div>
      <Melding staat={staat} />
    </form>
  );
}

export function KleineActie({ actie, id, label, vraag }: { actie: Actie; id: string; label: string; vraag?: string }) {
  const [staat, verstuur, bezig] = useActionState(actie, null);
  const [zeker, setZeker] = useState(false);
  return (
    <form action={verstuur} className="inline-flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      {vraag && !zeker ? (
        <button type="button" onClick={() => setZeker(true)} className="text-xs text-inkt-600 hover:text-primary-700">
          {label}
        </button>
      ) : (
        <>
          {vraag && <span className="text-xs">{vraag}</span>}
          <button className="text-xs font-medium text-primary-700" disabled={bezig}>
            {vraag ? "Ja" : label}
          </button>
          {vraag && (
            <button type="button" onClick={() => setZeker(false)} className="text-xs text-inkt-600">
              Nee
            </button>
          )}
        </>
      )}
      {staat?.fout && <span className="text-xs text-primary-700">{staat.fout}</span>}
    </form>
  );
}

export function GegevensAanpassen({
  actie,
  spelerId,
  rugnummer,
  voet,
  positie,
}: {
  actie: Actie;
  spelerId: string;
  rugnummer?: number;
  voet?: string;
  positie?: string;
}) {
  const [staat, verstuur, bezig] = useActionState(actie, null);
  return (
    <details className="group">
      <summary className="cursor-pointer text-sm font-medium text-primary-700">Positie, voet en rugnummer aanpassen</summary>
      <form action={verstuur} className="mt-3 grid gap-3 rounded-lg bg-zand-50 p-3">
        <input type="hidden" name="speler" value={spelerId} />
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-sm text-inkt-800">
            Positie
            <select name="positie" defaultValue={positie ?? ""} className={veld}>
              <option value="">Niet ingevuld</option>
              <option value="K">Keeper</option>
              <option value="V">Verdediger</option>
              <option value="M">Middenvelder</option>
              <option value="A">Aanvaller</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm text-inkt-800">
            Voorkeursvoet
            <select name="voet" defaultValue={voet ?? ""} className={veld}>
              <option value="">Niet ingevuld</option>
              <option value="rechts">Rechts</option>
              <option value="links">Links</option>
              <option value="beide">Beide</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm text-inkt-800">
            Rugnummer
            <input name="rugnummer" inputMode="numeric" defaultValue={rugnummer ?? ""} maxLength={2} className={veld} />
          </label>
        </div>
        <Melding staat={staat} />
        <div>
          <button className={knopLicht} disabled={bezig}>Bewaar</button>
        </div>
      </form>
    </details>
  );
}
