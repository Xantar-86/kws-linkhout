"use client";

import { useState } from "react";
import { AlertCircle, ClipboardList, Layers, Loader2, Plus } from "lucide-react";
import { EVENEMENT, GROEPEN, bedragVan, euro, gerechtenVan } from "@/lib/mosselfeest/kaart";

/**
 * Een inschrijving toevoegen die niet online gebeurd is.
 *
 * Twee manieren, want ze dienen iets anders:
 *
 *  - Eén kaart: iemand heeft een gedrukte kaart afgegeven. Met naam en zitting,
 *    zodat je achteraf nog weet wie wat besteld heeft en of er betaald is.
 *  - Stapel kaarten: een verzamelpost zonder namen, bijvoorbeeld "83 mosselen
 *    van de kaarten in de kantine". Voor wanneer één per één intypen niet
 *    opweegt tegen de moeite.
 *
 * Beide komen als gewone inschrijving in dezelfde lijst, dus in hetzelfde
 * totaal en in hetzelfde Excel-logboek.
 */

const INVOER =
  "w-full rounded-xl border border-zand-300 bg-white px-3 py-2 text-sm text-inkt-900 " +
  "outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function KaartToevoegen({
  wachtwoord,
  onToegevoegd,
}: {
  wachtwoord: string;
  onToegevoegd: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [bron, setBron] = useState<"kaart" | "verzamelpost">("kaart");
  const [naam, setNaam] = useState("");
  const [voornaam, setVoornaam] = useState("");
  const [kaartnummer, setKaartnummer] = useState("");
  const [zitting, setZitting] = useState("");
  const [aantallen, setAantallen] = useState<Record<string, number>>({});
  const [betaald, setBetaald] = useState(true);
  const [ingevoerdDoor, setIngevoerdDoor] = useState("");
  const [opmerking, setOpmerking] = useState("");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const [gelukt, setGelukt] = useState("");

  const bedrag = bedragVan(aantallen);

  function leegmaken() {
    setNaam("");
    setVoornaam("");
    setKaartnummer("");
    setZitting("");
    setAantallen({});
    setOpmerking("");
    setBetaald(true);
  }

  async function verstuur(gebeurtenis: React.FormEvent) {
    gebeurtenis.preventDefault();
    setFout("");
    setGelukt("");
    setBezig(true);
    try {
      const antwoord = await fetch("/api/mosselfeest/beheer", {
        method: "POST",
        headers: { authorization: `Bearer ${wachtwoord}`, "content-type": "application/json" },
        body: JSON.stringify({
          actie: "toevoegen",
          bron,
          naam,
          voornaam: bron === "kaart" ? voornaam || undefined : undefined,
          kaartnummer: kaartnummer.trim() ? Number.parseInt(kaartnummer, 10) : undefined,
          zitting: zitting || undefined,
          aantallen,
          betaald,
          opmerking: opmerking || undefined,
          ingevoerdDoor: ingevoerdDoor || undefined,
        }),
      });
      const gegevens = (await antwoord.json()) as { ok?: boolean; error?: string };
      if (!antwoord.ok || !gegevens.ok) {
        setFout(gegevens.error ?? "Toevoegen is niet gelukt.");
        return;
      }
      setGelukt(
        bron === "kaart" ? `Kaart van ${naam} toegevoegd.` : `Stapel "${naam}" toegevoegd.`,
      );
      leegmaken();
      onToegevoegd();
    } catch {
      setFout("Toevoegen is niet gelukt.");
    } finally {
      setBezig(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zand-300 bg-white/60 px-5 py-4 text-sm font-medium text-slate-600 transition hover:border-primary/40 hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        Kaart of stapel toevoegen die niet online is ingevuld
      </button>
    );
  }

  return (
    <form
      onSubmit={verstuur}
      className="rounded-2xl border border-zand-200/70 bg-white p-5 shadow-blad sm:p-7"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-inkt-900">Handmatig toevoegen</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-slate-500 underline"
        >
          Sluiten
        </button>
      </div>

      <div className="mb-5 grid gap-2 sm:grid-cols-2">
        {(
          [
            {
              id: "kaart" as const,
              icoon: ClipboardList,
              titel: "Eén afgegeven kaart",
              uitleg: "Met naam en zitting, zodat je weet wie wat besteld heeft.",
            },
            {
              id: "verzamelpost" as const,
              icoon: Layers,
              titel: "Stapel kaarten",
              uitleg: "Enkel de aantallen, met een toelichting. Bijvoorbeeld 83 mosselen.",
            },
          ]
        ).map((keuze) => {
          const Icoon = keuze.icoon;
          const gekozen = bron === keuze.id;
          return (
            <button
              key={keuze.id}
              type="button"
              onClick={() => setBron(keuze.id)}
              className={
                "rounded-xl border p-3 text-left transition " +
                (gekozen
                  ? "border-primary bg-primary-50/60"
                  : "border-zand-300 bg-white hover:border-slate-400")
              }
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-inkt-900">
                <Icoon className={"h-4 w-4 " + (gekozen ? "text-primary" : "text-slate-400")} />
                {keuze.titel}
              </p>
              <p className="mt-1 text-xs text-slate-500">{keuze.uitleg}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {bron === "kaart" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Nummer op de kaart
            </span>
            <input
              className={INVOER}
              value={kaartnummer}
              onChange={(e) => setKaartnummer(e.target.value.replace(/[^0-9]/g, ""))}
              inputMode="numeric"
              placeholder="bijvoorbeeld 037"
            />
            <span className="mt-1 block text-xs text-slate-500">
              De gedrukte kaarten; 1001 en hoger is voor online.
            </span>
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {bron === "kaart" ? "Familienaam" : "Toelichting bij de stapel"}
          </span>
          <input
            className={INVOER}
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            placeholder={bron === "kaart" ? "Naam" : "Bijvoorbeeld kaarten kantine week 1"}
          />
        </label>
        {bron === "kaart" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Voornaam</span>
            <input
              className={INVOER}
              value={voornaam}
              onChange={(e) => setVoornaam(e.target.value)}
              placeholder="Voornaam"
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Zitting{bron === "verzamelpost" && " (mag leeg blijven)"}
          </span>
          <select className={INVOER} value={zitting} onChange={(e) => setZitting(e.target.value)}>
            <option value="">{bron === "kaart" ? "Kies de zitting" : "Nog niet gekend"}</option>
            {EVENEMENT.zittingen.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-slate-700">Aantallen</p>
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {GROEPEN.map((groep) => {
            const gerechten = gerechtenVan(groep.id);
            if (gerechten.length === 0) return null;
            return (
              <div key={groep.id}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {groep.titel}
                </p>
                <div className="divide-y divide-zand-100">
                  {gerechten.map((g) => (
                    <div key={g.id} className="flex items-center justify-between gap-3 py-1.5">
                      <label htmlFor={`aantal-${g.id}`} className="text-sm text-slate-700">
                        {g.naam}
                        <span className="ml-1 text-xs text-slate-400">{euro(g.prijs)}</span>
                      </label>
                      <input
                        id={`aantal-${g.id}`}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={bron === "verzamelpost" ? 2000 : 40}
                        value={aantallen[g.id] ?? ""}
                        placeholder="0"
                        onChange={(e) => {
                          const getal = Number.parseInt(e.target.value, 10);
                          setAantallen((vorig) => {
                            const volgend = { ...vorig };
                            if (Number.isFinite(getal) && getal > 0) volgend[g.id] = getal;
                            else delete volgend[g.id];
                            return volgend;
                          });
                        }}
                        className="h-9 w-16 rounded-lg border border-zand-300 text-center text-sm outline-none focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Ingevoerd door (niet verplicht)
          </span>
          <input
            className={INVOER}
            value={ingevoerdDoor}
            onChange={(e) => setIngevoerdDoor(e.target.value)}
            placeholder="Je naam"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Opmerking (niet verplicht)
          </span>
          <input
            className={INVOER}
            value={opmerking}
            onChange={(e) => setOpmerking(e.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={betaald}
          onChange={(e) => setBetaald(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        Is al betaald
      </label>

      {fout && (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-primary-50 p-3 text-sm text-primary-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {fout}
        </p>
      )}
      {gelukt && (
        <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{gelukt}</p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Bedrag volgens de kaart: <strong>{euro(bedrag)} euro</strong>
        </p>
        <button type="submit" disabled={bezig} className="btn-primary justify-center disabled:opacity-60">
          {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : "Toevoegen"}
        </button>
      </div>
    </form>
  );
}
