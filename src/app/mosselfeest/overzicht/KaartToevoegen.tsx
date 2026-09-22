"use client";

import { useState } from "react";
import { AlertCircle, ClipboardList, Layers, Loader2, Plus } from "lucide-react";
import { BRIEFJE_EERSTE_KAARTNUMMER, EVENEMENT, bedragVan, euro } from "@/lib/mosselfeest/kaart";
import { Aantallen } from "./Aantallen";

/**
 * Een inschrijving toevoegen die niet online gebeurd is.
 *
 * Twee manieren, want ze dienen iets anders:
 *
 *  - Eén kaart: iemand heeft een gedrukte kaart of een briefje afgegeven. Met
 *    naam en zitting, zodat je achteraf nog weet wie wat besteld heeft en of er
 *    betaald is. Staat er geen nummer op het papier, dan kent het systeem er
 *    een toe vanaf 2001; dat schrijf je op het briefje.
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
  const [zonderNummer, setZonderNummer] = useState(false);
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
          kaartnummer:
            bron === "kaart" && !zonderNummer && kaartnummer.trim()
              ? Number.parseInt(kaartnummer, 10)
              : undefined,
          automatischNummer: bron === "kaart" && zonderNummer,
          zitting: zitting || undefined,
          aantallen,
          betaald,
          opmerking: opmerking || undefined,
          ingevoerdDoor: ingevoerdDoor || undefined,
        }),
      });
      const gegevens = (await antwoord.json()) as {
        ok?: boolean;
        error?: string;
        inschrijving?: { kaartnummer?: number };
      };
      if (!antwoord.ok || !gegevens.ok) {
        setFout(gegevens.error ?? "Toevoegen is niet gelukt.");
        return;
      }
      const nummer = gegevens.inschrijving?.kaartnummer;
      setGelukt(
        bron === "verzamelpost"
          ? `Stapel "${naam}" toegevoegd.`
          : zonderNummer && nummer
            ? `Toegevoegd met nummer ${nummer}. Schrijf dat nummer op het briefje.`
            : `Kaart van ${naam} toegevoegd.`,
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
              titel: "Eén kaart of briefje",
              uitleg: "Met naam, zodat je weet wie wat besteld heeft.",
            },
            {
              id: "verzamelpost" as const,
              icoon: Layers,
              titel: "Stapel kaarten",
              uitleg: "Enkel de aantallen, met een toelichting.",
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
          <div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Nummer op de kaart
              </span>
              <input
                className={INVOER + (zonderNummer ? " bg-zand-50 text-slate-400" : "")}
                value={zonderNummer ? "" : kaartnummer}
                disabled={zonderNummer}
                onChange={(e) => setKaartnummer(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                placeholder="bijvoorbeeld 037"
              />
            </label>
            <label className="mt-2 flex items-start gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={zonderNummer}
                onChange={(e) => setZonderNummer(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 accent-primary"
              />
              <span>
                Geen nummer op het papier. Het systeem geeft er een vanaf{" "}
                {BRIEFJE_EERSTE_KAARTNUMMER}, schrijf dat op het briefje.
              </span>
            </label>
          </div>
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
            Zitting <span className="text-slate-400">(mag leeg)</span>
          </span>
          <select className={INVOER} value={zitting} onChange={(e) => setZitting(e.target.value)}>
            <option value="">Nog niet gekend</option>
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
        <Aantallen
          aantallen={aantallen}
          onChange={setAantallen}
          max={bron === "verzamelpost" ? 2000 : 40}
        />
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
      {gelukt && <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{gelukt}</p>}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Bedrag volgens de kaart: <strong>{euro(bedrag)} euro</strong>
        </p>
        <button
          type="submit"
          disabled={bezig}
          className="btn-primary justify-center disabled:opacity-60"
        >
          {bezig ? <Loader2 className="h-4 w-4 animate-spin" /> : "Toevoegen"}
        </button>
      </div>
    </form>
  );
}
