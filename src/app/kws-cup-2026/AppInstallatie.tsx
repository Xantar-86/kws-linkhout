"use client";

// app/kws-cup-2026/AppInstallatie.tsx
//
// Zet de tornooipagina op het beginscherm van de telefoon, en zorgt dat ze
// blijft werken als het netwerk op het terrein hapert.
//
// Twee dingen gebeuren hier:
//   1. de servicemedewerker (/kws-cup-sw.js) registreren, zodra de pagina
//      geladen is en dus niets meer in de weg zit;
//   2. een kaartje tonen met de manier om te installeren. Android en Chrome
//      bieden dat zelf aan met een gebeurtenis die we opvangen en achter een
//      knop zetten; Safari doet dat niet en daar blijft het bij uitleg.
//
// Wat er bewust niet in zit: meldingen. Dat vraagt sleutels, een lijst met
// aangemelde toestellen en iets dat ze verstuurt, en dat is een apart plan.

import { useSyncExternalStore } from "react";
import { Share, Smartphone } from "lucide-react";

/** De gebeurtenis die Chrome stuurt als de pagina installeerbaar is. */
type Installatievoorstel = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Het voorstel komt vaak binnen voor de bezoeker het kaartje te zien krijgt, en
 * de browser stuurt het maar één keer. Daarom vangen we het hier op, buiten de
 * component, en laten we de component zich abonneren. Anders is het voorstel
 * verdwenen zodra hij van tabblad wisselt en terugkomt.
 */
let voorstel: Installatievoorstel | null = null;
let geinstalleerd = false;
const luisteraars = new Set<() => void>();

function meld() {
  luisteraars.forEach((f) => f());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    // Zonder dit toont Chrome zijn eigen balkje onderaan; wij zetten het liever
    // op een plek waar het uitgelegd staat.
    e.preventDefault();
    voorstel = e as Installatievoorstel;
    meld();
  });

  window.addEventListener("appinstalled", () => {
    // Het tabblad waarin dit gebeurde blijft een gewoon tabblad, dus daar helpt
    // de mediaregel hieronder niet. Zonder deze vlag zou hier na het
    // installeren nog altijd staan hoe je moet installeren.
    voorstel = null;
    geinstalleerd = true;
    meld();
  });

  if ("serviceWorker" in navigator) {
    const registreer = () =>
      navigator.serviceWorker
        // Het bereik is ruimer dan de map waarin het bestand staat, en dat mag
        // alleen omdat het in de hoofdmap staat. Zie de uitleg in dat bestand.
        .register("/kws-cup-sw.js", { scope: "/kws-cup-2026" })
        .catch(() => {
          /* stil: zonder servicemedewerker werkt alles nog, alleen niet offline */
        });

    // Liefst pas na het laden, want de eerste weergave van het schema is
    // belangrijker dan het vullen van de opslag. Maar dit stuk komt zelf als
    // los bestand binnen en is soms pas aan de beurt als het laden al gedaan
    // is; dan komt die gebeurtenis niet meer en zou er niets geregistreerd
    // worden. Vandaar allebei de wegen.
    if (document.readyState === "complete") registreer();
    else window.addEventListener("load", registreer, { once: true });
  }
}

/** Draait de pagina al als app, dan hoeft er niets uitgelegd te worden. */
function alsApp() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari kent de mediaregel wel, maar zet daarnaast zijn eigen vlag.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isApple() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * Wat er te zien hoort te zijn.
 *
 * "onbekend" is wat de server ervan maakt: daar is er geen browser om te weten
 * of dit een iPhone is of de pagina al als app draait. De browser vervangt dat
 * meteen na het inladen door het echte antwoord.
 */
type Stand = "onbekend" | "app" | "kan" | "apple" | "anders";

function stand(): Stand {
  if (geinstalleerd || alsApp()) return "app";
  if (voorstel) return "kan";
  if (isApple()) return "apple";
  return "anders";
}

function abonneer(bij: () => void) {
  luisteraars.add(bij);
  return () => {
    luisteraars.delete(bij);
  };
}

export default function AppInstallatie() {
  const toestand = useSyncExternalStore(abonneer, stand, (): Stand => "onbekend");

  // Draait de pagina al als app, dan hoeft er niets uitgelegd te worden.
  if (toestand === "onbekend" || toestand === "app") return null;

  async function installeer() {
    if (!voorstel) return;
    await voorstel.prompt();
    await voorstel.userChoice;
    // De browser hergebruikt het voorstel niet; wat de bezoeker ook kiest, de
    // knop hoort weg te zijn.
    voorstel = null;
    meld();
  }

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <Smartphone className="h-5 w-5 text-primary" />
        Zet het schema op je beginscherm
      </h3>
      <p className="mt-2 text-sm text-gray-700">
        Dan opent het als een app, schermvullend en zonder adresbalk, en blijft het
        laatst gelezen schema leesbaar als het netwerk op het terrein tegenzit.
      </p>

      {toestand === "kan" ? (
        <button
          type="button"
          onClick={installeer}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2
                     text-sm font-semibold text-white hover:bg-primary-800"
        >
          <Smartphone className="h-4 w-4" />
          Installeren
        </button>
      ) : toestand === "apple" ? (
        <p className="mt-3 flex items-start gap-2 text-sm text-gray-600">
          <Share className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <span>
            In Safari: tik op de deelknop onderaan en kies{" "}
            <span className="font-medium text-gray-800">Zet op beginscherm</span>.
          </span>
        </p>
      ) : (
        <p className="mt-3 text-sm text-gray-600">
          In Chrome: menu rechtsboven en dan{" "}
          <span className="font-medium text-gray-800">App installeren</span>. In Safari op een
          iPhone: de deelknop en dan{" "}
          <span className="font-medium text-gray-800">Zet op beginscherm</span>.
        </p>
      )}
    </article>
  );
}
