"use client";

// app/sponsoring/betaald/Client.tsx
//
// De bedankpagina na Mollie. Mollie stuurt de sponsor hierheen, of hij nu
// betaald heeft of afgebroken. Wat er echt gebeurd is, vragen we aan de site,
// die het aan Mollie vraagt: het adres zelf bewijst niets.
//
// De mails vertrekken op de server (lib/wedstrijdbal/verwerk.ts). Deze pagina
// zet dat ook in gang, voor het geval ze er sneller is dan de melding van
// Mollie; dubbel mailen kan niet.

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Check, Clock } from "lucide-react";
import { WEDSTRIJDBAL } from "../inhoud";

type Stand =
  | { soort: "laden" }
  | { soort: "betaald"; test: boolean }
  | { soort: "wachten" }
  | { soort: "mislukt" }
  | { soort: "onbekend" };

/** Bij een trage bank: zo vaak kijken we opnieuw, om de 3 seconden. */
const WACHTRONDES = 20;

export default function BetaaldClient() {
  const kenmerk = useSearchParams().get("b");
  const [stand, setStand] = useState<Stand>({ soort: "laden" });
  const bezig = useRef(false);

  useEffect(() => {
    if (!kenmerk) {
      setStand({ soort: "onbekend" });
      return;
    }
    if (bezig.current) return;
    bezig.current = true;
    let rondes = 0;
    let wekker: ReturnType<typeof setTimeout> | undefined;

    async function kijk() {
      const antwoord = await fetch(`/api/wedstrijdbal?b=${encodeURIComponent(kenmerk!)}`, { method: "POST" })
        .then((r) => (r.ok ? r.json() : r.status === 404 ? null : { status: "fout" }))
        .catch(() => ({ status: "fout" }));
      if (!antwoord) return setStand({ soort: "onbekend" });
      if (antwoord.status === "paid") return setStand({ soort: "betaald", test: Boolean(antwoord.test) });

      // Nog bezig, of de site kon Mollie even niet bereiken: opnieuw kijken.
      if (["open", "pending", "authorized", "fout"].includes(antwoord.status)) {
        setStand({ soort: "wachten" });
        if (rondes++ < WACHTRONDES) wekker = setTimeout(kijk, 3000);
        return;
      }
      setStand({ soort: "mislukt" });
    }

    kijk();
    return () => clearTimeout(wekker);
  }, [kenmerk]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zand-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-blad md:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/kwslinkhout-logo.png" alt="KWS Linkhout" className="mx-auto h-16 w-16 object-contain" />

        {stand.soort === "laden" && <p className="mt-8 text-gray-600">Even kijken of de betaling gelukt is...</p>}

        {stand.soort === "betaald" && (
          <>
            <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
              <Check className="h-7 w-7" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-gray-900">Bedankt voor uw steun!</h1>
            <p className="mt-3 leading-relaxed text-gray-600">
              Uw wedstrijdbal van {WEDSTRIJDBAL.prijs} is betaald. U krijgt een bevestiging per e-mail, en de club
              neemt contact met u op voor de affiche en de wedstrijd.
            </p>
            {stand.test && (
              <p className="mx-auto mt-4 max-w-sm rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Testbetaling: er is geen echt geld betaald.
              </p>
            )}
          </>
        )}

        {stand.soort === "wachten" && (
          <>
            <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <Clock className="h-7 w-7" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-gray-900">Betaling nog bezig</h1>
            <p className="mt-3 leading-relaxed text-gray-600">
              Uw betaling is nog niet bevestigd. Laat deze pagina open, of kom later terug via dezelfde link. Zodra
              ze binnen is, krijgt u een bevestiging per e-mail.
            </p>
          </>
        )}

        {(stand.soort === "mislukt" || stand.soort === "onbekend") && (
          <>
            <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-gray-900">
              {stand.soort === "mislukt" ? "De betaling is niet gelukt" : "Bestelling niet gevonden"}
            </h1>
            <p className="mt-3 leading-relaxed text-gray-600">
              {stand.soort === "mislukt"
                ? "Er is niets betaald. U kan het gerust opnieuw proberen."
                : "We vinden deze bestelling niet terug. Mail ons gerust als u denkt dat er iets misliep."}
            </p>
            <a href="/sponsoring" className="btn-primary mt-6 inline-flex">
              Terug naar de sponsorpagina
            </a>
          </>
        )}
      </div>
    </main>
  );
}
