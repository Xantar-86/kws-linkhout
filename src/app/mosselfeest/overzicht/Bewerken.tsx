"use client";

import { useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { EVENEMENT, bedragVan, euro } from "@/lib/mosselfeest/kaart";
import type { Inschrijving } from "@/lib/mosselfeest/totalen";
import { Aantallen } from "./Aantallen";

/**
 * Een bestaande inschrijving wijzigen.
 *
 * Nodig op de avond zelf: iemand wil er nog een portie bij, of er staat een
 * fout in. Vroeger kon er enkel afgevinkt of geschrapt worden, en dan werd zo'n
 * wijziging een nieuwe inschrijving met een nieuw nummer, wat de aantallen
 * scheef trekt.
 *
 * Het kaartnummer blijft wat het was: dat staat op het papier van de gast.
 */

const INVOER =
  "w-full rounded-xl border border-zand-300 bg-white px-3 py-2 text-sm text-inkt-900 " +
  "outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function Bewerken({
  wachtwoord,
  inschrijving,
  onKlaar,
  onSluiten,
}: {
  wachtwoord: string;
  inschrijving: Inschrijving;
  onKlaar: (bijgewerkt: Inschrijving) => void;
  onSluiten: () => void;
}) {
  const [naam, setNaam] = useState(inschrijving.naam);
  const [voornaam, setVoornaam] = useState(inschrijving.voornaam ?? "");
  const [telefoon, setTelefoon] = useState(inschrijving.telefoon ?? "");
  const [zitting, setZitting] = useState(inschrijving.zitting ?? "");
  const [aantallen, setAantallen] = useState<Record<string, number>>({ ...inschrijving.aantallen });
  const [opmerking, setOpmerking] = useState(inschrijving.opmerking ?? "");
  const [door, setDoor] = useState("");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  const bedrag = bedragVan(aantallen);
  const verschil = Math.round((bedrag - inschrijving.bedrag) * 100) / 100;

  async function bewaar(gebeurtenis: React.FormEvent) {
    gebeurtenis.preventDefault();
    setFout("");
    setBezig(true);
    try {
      const antwoord = await fetch("/api/mosselfeest/beheer", {
        method: "POST",
        headers: { authorization: `Bearer ${wachtwoord}`, "content-type": "application/json" },
        body: JSON.stringify({
          actie: "wijzigen",
          kenmerk: inschrijving.kenmerk,
          naam,
          voornaam: voornaam || undefined,
          telefoon: telefoon || undefined,
          zitting: zitting || undefined,
          aantallen,
          opmerking: opmerking || undefined,
          ingevoerdDoor: door || undefined,
        }),
      });
      const gegevens = (await antwoord.json()) as {
        ok?: boolean;
        error?: string;
        inschrijving?: Inschrijving;
      };
      if (!antwoord.ok || !gegevens.ok || !gegevens.inschrijving) {
        setFout(gegevens.error ?? "De wijziging is niet bewaard.");
        return;
      }
      onKlaar(gegevens.inschrijving);
    } catch {
      setFout("De wijziging is niet bewaard.");
    } finally {
      setBezig(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-inkt-900/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={bewaar}
        className="my-8 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-blad sm:p-7"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-inkt-900">
              Inschrijving wijzigen
            </h2>
            <p className="text-sm text-slate-500">
              {inschrijving.kaartnummer ? `Nummer ${inschrijving.kaartnummer}` : "Zonder nummer"}
              {inschrijving.bron === "online" && ", online ingeschreven"}
            </p>
          </div>
          <button
            type="button"
            onClick={onSluiten}
            aria-label="Sluiten"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-zand-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Familienaam</span>
            <input className={INVOER} value={naam} onChange={(e) => setNaam(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Voornaam</span>
            <input
              className={INVOER}
              value={voornaam}
              onChange={(e) => setVoornaam(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Zitting</span>
            <select className={INVOER} value={zitting} onChange={(e) => setZitting(e.target.value)}>
              <option value="">Nog niet gekend</option>
              {EVENEMENT.zittingen.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Telefoon</span>
            <input
              className={INVOER}
              value={telefoon}
              onChange={(e) => setTelefoon(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-slate-700">Aantallen</p>
          <Aantallen aantallen={aantallen} onChange={setAantallen} compact />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Opmerking</span>
            <input
              className={INVOER}
              value={opmerking}
              onChange={(e) => setOpmerking(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Gewijzigd door (niet verplicht)
            </span>
            <input className={INVOER} value={door} onChange={(e) => setDoor(e.target.value)} />
          </label>
        </div>

        {fout && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-primary-50 p-3 text-sm text-primary-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {fout}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zand-200 pt-4">
          <p className="text-sm text-slate-600">
            Bedrag: <strong className="text-inkt-900">{euro(bedrag)} euro</strong>
            {verschil !== 0 && (
              <span className={verschil > 0 ? "text-primary" : "text-green-700"}>
                {" "}
                ({verschil > 0 ? "+" : ""}
                {euro(verschil)} tegenover voordien)
              </span>
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSluiten}
              className="rounded-xl border border-zand-300 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-400"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={bezig}
              className="btn-primary justify-center disabled:opacity-60"
            >
              {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : "Bewaren"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
