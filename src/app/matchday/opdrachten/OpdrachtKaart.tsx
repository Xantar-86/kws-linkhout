"use client";

import { useState, useCallback, useRef } from "react";

/**
 * Eén opdracht: de knoppen om de prompt te kopiëren en het logo te halen, en
 * een vak om het gemaakte beeld naartoe te slepen.
 */

interface OpdrachtGegevens {
  ploeg: { slug: string; naam: string; label: string };
  soort: "wedstrijd" | "uitslag";
  omschrijving: string;
  prompt: string;
  tegenstanderLogo: string | null;
  sjabloonUrl: string;
  eigenLogoUrl: string;
  afficheUrl: string | null;
  caption: string;
}

export function OpdrachtKaart({
  opdracht,
  sleutel,
}: {
  opdracht: OpdrachtGegevens;
  sleutel: string;
}) {
  const [gekopieerd, setGekopieerd] = useState(false);
  const [tekstOpen, setTekstOpen] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState<string | null>(null);
  const [beeldUrl, setBeeldUrl] = useState<string | null>(opdracht.afficheUrl);
  const [sleep, setSleep] = useState(false);
  const invoer = useRef<HTMLInputElement>(null);

  const kopieer = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(opdracht.prompt);
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2500);
    } catch {
      setMelding("Kopiëren lukte niet. Selecteer de tekst hieronder handmatig.");
      setTekstOpen(true);
    }
  }, [opdracht.prompt]);

  const stuur = useCallback(
    async (bestand: File) => {
      setBezig(true);
      setMelding(null);
      try {
        const form = new FormData();
        form.append("ploeg", opdracht.ploeg.slug);
        form.append("soort", opdracht.soort);
        form.append("bestand", bestand);

        const response = await fetch("/api/social/affiche-upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${sleutel}` },
          body: form,
        });
        const json = await response.json();

        if (!response.ok) {
          setMelding(json.error ?? "Uploaden mislukt.");
        } else {
          setBeeldUrl(`${json.url}?t=${Date.now()}`);
          setMelding("Beeld opgeslagen.");
        }
      } catch {
        setMelding("Uploaden mislukt door een netwerkfout.");
      } finally {
        setBezig(false);
      }
    },
    [opdracht.ploeg.slug, opdracht.soort, sleutel]
  );

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{opdracht.ploeg.naam}</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                opdracht.soort === "uitslag"
                  ? "bg-green-100 text-green-800"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {opdracht.soort}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-gray-600">{opdracht.omschrijving}</p>
        </div>

        {beeldUrl ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            Beeld klaar
          </span>
        ) : (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Wacht op beeld
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={kopieer}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          {gekopieerd ? "Gekopieerd" : "Kopieer opdracht"}
        </button>

        <a
          href={opdracht.sjabloonUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          1. Sjabloon
        </a>

        <a
          href={opdracht.eigenLogoUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          2. Logo KWS
        </a>

        {opdracht.tegenstanderLogo && (
          <a
            href={opdracht.tegenstanderLogo}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            3. Logo tegenstander
          </a>
        )}

        <button
          type="button"
          onClick={() => setTekstOpen((v) => !v)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          {tekstOpen ? "Verberg tekst" : "Toon opdracht en post"}
        </button>
      </div>

      {tekstOpen && (
        <div className="mt-4 space-y-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Opdracht voor ChatGPT
            </p>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-3 font-mono text-xs leading-relaxed text-gray-800">
              {opdracht.prompt}
            </pre>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Tekst van de post
            </p>
            <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 font-mono text-xs leading-relaxed text-gray-800">
              {opdracht.caption}
            </pre>
          </div>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setSleep(true);
        }}
        onDragLeave={() => setSleep(false)}
        onDrop={(e) => {
          e.preventDefault();
          setSleep(false);
          const bestand = e.dataTransfer.files?.[0];
          if (bestand) stuur(bestand);
        }}
        onClick={() => invoer.current?.click()}
        className={`mt-4 cursor-pointer rounded-lg border-2 border-dashed p-4 text-center text-sm transition ${
          sleep
            ? "border-primary bg-primary/5 text-primary"
            : "border-gray-300 text-gray-500 hover:border-gray-400"
        }`}
      >
        <input
          ref={invoer}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const bestand = e.target.files?.[0];
            if (bestand) stuur(bestand);
          }}
        />
        {bezig ? "Bezig met opslaan..." : "Sleep het beeld hierheen, of klik om te kiezen"}
      </div>

      {melding && <p className="mt-2 text-sm text-gray-600">{melding}</p>}

      {beeldUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={beeldUrl}
          alt=""
          className="mt-4 w-full max-w-xs rounded-lg border border-gray-200"
        />
      )}
    </article>
  );
}
