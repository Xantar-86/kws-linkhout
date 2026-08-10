"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface MatchdayData {
  ploeg: { slug: string; naam: string; reeks: string };
  soort: "wedstrijd" | "uitslag";
  wedstrijd: {
    thuisploeg: string;
    uitploeg: string;
    aftrapIso: string;
    isThuis: boolean;
    uitslag: string | null;
  };
  caption: string;
  afbeeldingUrl: string;
  beschikbaar: { facebook: boolean; instagram: boolean };
  live: boolean;
}

interface Resultaat {
  platform: string;
  ok: boolean;
  bericht: string;
  dryRun: boolean;
}

export function GoedkeurClient() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const startInBewerkModus = params.get("modus") === "aanpassen";

  const [data, setData] = useState<MatchdayData | null>(null);
  const [fout, setFout] = useState<string | null>(null);
  const [laden, setLaden] = useState(true);
  const [caption, setCaption] = useState("");
  const [bewerken, setBewerken] = useState(startInBewerkModus);
  const [facebook, setFacebook] = useState(true);
  const [instagram, setInstagram] = useState(true);
  const [bezig, setBezig] = useState(false);
  const [resultaten, setResultaten] = useState<Resultaat[] | null>(null);

  useEffect(() => {
    if (!token) {
      setFout("Deze link is onvolledig.");
      setLaden(false);
      return;
    }
    async function ophalen() {
      try {
        const response = await fetch(
          `/api/social/matchday?token=${encodeURIComponent(token)}`
        );
        const json = await response.json();
        if (!response.ok) {
          setFout(json.error ?? "Er ging iets mis.");
        } else {
          setData(json);
          setCaption(json.caption);
          setFacebook(json.beschikbaar.facebook);
          setInstagram(json.beschikbaar.instagram);
        }
      } catch {
        setFout("De gegevens konden niet geladen worden.");
      } finally {
        setLaden(false);
      }
    }
    ophalen();
  }, [token]);

  const posten = useCallback(async () => {
    setBezig(true);
    setResultaten(null);
    try {
      const platforms = [
        ...(facebook ? ["facebook"] : []),
        ...(instagram ? ["instagram"] : []),
      ];
      const response = await fetch("/api/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, caption, platforms }),
      });
      const json = await response.json();
      if (!response.ok) {
        setFout(json.error ?? "Publiceren mislukt.");
      } else {
        setResultaten(json.resultaten);
      }
    } catch {
      setFout("Publiceren mislukt door een netwerkfout.");
    } finally {
      setBezig(false);
    }
  }, [token, caption, facebook, instagram]);

  if (laden) {
    return (
      <div className="animate-pulse rounded-2xl bg-white p-8 shadow">
        <div className="mb-4 h-6 w-1/3 rounded bg-gray-200" />
        <div className="h-64 rounded bg-gray-200" />
      </div>
    );
  }

  if (fout || !data) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-2 text-xl font-bold text-gray-900">Deze post kan niet meer</h1>
        <p className="text-gray-600">{fout}</p>
      </div>
    );
  }

  const aftrap = new Date(data.wedstrijd.aftrapIso).toLocaleString("nl-BE", {
    timeZone: "Europe/Brussels",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const geenPlatform = !facebook && !instagram;

  return (
    <div className="rounded-2xl bg-white p-6 shadow md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{data.ploeg.naam}</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            data.soort === "uitslag"
              ? "bg-green-100 text-green-800"
              : "bg-primary/10 text-primary"
          }`}
        >
          {data.soort === "uitslag" ? "Uitslag" : "Aankondiging"}
        </span>
      </div>
      <p className="mt-1 text-gray-600">
        {data.wedstrijd.thuisploeg}{" "}
        {data.wedstrijd.uitslag ? (
          <strong className="text-gray-900">{data.wedstrijd.uitslag}</strong>
        ) : (
          "-"
        )}{" "}
        {data.wedstrijd.uitploeg}
      </p>
      <p className="text-sm text-gray-500">
        {aftrap} · {data.ploeg.reeks} ·{" "}
        {data.wedstrijd.isThuis ? "thuiswedstrijd" : "uitwedstrijd"}
      </p>

      {!data.live && (
        <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Testmodus.</strong> SOCIAL_LIVE staat uit, dus posten toont enkel wat er
          zou gebeuren. Er vertrekt niets naar Facebook of Instagram.
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.afbeeldingUrl}
        alt="Voorbeeld van de matchday-afbeelding"
        className="mt-6 w-full rounded-xl border border-gray-200"
      />

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="caption" className="font-semibold text-gray-900">
            Tekst van de post
          </label>
          <button
            type="button"
            onClick={() => setBewerken((b) => !b)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {bewerken ? "Bewerken stoppen" : "Tekst aanpassen"}
          </button>
        </div>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          readOnly={!bewerken}
          rows={14}
          className={`w-full rounded-xl border p-4 font-mono text-sm leading-relaxed ${
            bewerken
              ? "border-primary bg-white text-gray-900"
              : "border-gray-200 bg-gray-50 text-gray-700"
          }`}
        />
        <p className="mt-1 text-right text-xs text-gray-400">{caption.length} / 2200 tekens</p>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2 font-semibold text-gray-900">Waar plaatsen?</legend>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={facebook}
              disabled={!data.beschikbaar.facebook}
              onChange={(e) => setFacebook(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Facebook
            {!data.beschikbaar.facebook && (
              <span className="text-sm text-gray-400">(niet ingesteld)</span>
            )}
          </label>
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={instagram}
              disabled={!data.beschikbaar.instagram}
              onChange={(e) => setInstagram(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Instagram
            {!data.beschikbaar.instagram && (
              <span className="text-sm text-gray-400">(niet ingesteld)</span>
            )}
          </label>
        </div>
      </fieldset>

      {resultaten ? (
        <div className="mt-6 space-y-2">
          {resultaten.map((r) => (
            <div
              key={r.platform}
              className={`rounded-lg border p-3 text-sm ${
                r.ok
                  ? "border-green-300 bg-green-50 text-green-900"
                  : "border-red-300 bg-red-50 text-red-900"
              }`}
            >
              <strong className="capitalize">{r.platform}</strong>: {r.bericht}
            </div>
          ))}
          <p className="pt-2 text-sm text-gray-500">
            Je kan dit venster sluiten. Dubbel posten wordt tegengehouden.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={posten}
          disabled={bezig || geenPlatform}
          className="mt-6 w-full rounded-xl bg-primary px-6 py-4 font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {bezig ? "Bezig met plaatsen..." : geenPlatform ? "Kies minstens één platform" : "Nu plaatsen"}
        </button>
      )}

      <p className="mt-4 text-center text-xs text-gray-400">
        Doe je niets, dan wordt er niets geplaatst.
      </p>
    </div>
  );
}
