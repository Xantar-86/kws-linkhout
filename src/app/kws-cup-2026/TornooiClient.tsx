"use client";

// Publieke weergave van het jeugdtornooi, opgezet als een toepassing en niet
// als een gewone webpagina: een vaste balk boven, tabbladen onderaan op een
// telefoon, en verder alleen de inhoud.
//
// Ververst zichzelf elke minuut, zodat een wijziging tijdens de tornooidag
// (bijvoorbeeld een ploeg die niet komt opdagen) meteen zichtbaar is.

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  FileText,
  Info,
  LayoutGrid,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";

export type Wedstrijd = {
  nr: number;
  reeks: string;
  poule: string;
  dag: string;
  start: string;
  eind: string;
  duur: number;
  velden: string[];
  thuis: string;
  uit: string;
  vriendschappelijk: boolean;
};

export type Poule = {
  naam: string;
  minuten: number;
  ploegen: { naam: string; wedstrijden: number }[];
};

export type Reeks = {
  naam: string;
  dag: string;
  start: string;
  eind: string;
  aantalPloegen: number;
  aantalWedstrijden: number;
  poules: Poule[];
};

export type Ploeg = {
  naam: string;
  club: string;
  logo: string | null;
  reeksen: string[];
  wedstrijden: number[];
};

export type Tornooi = {
  titel: string;
  jaar: number;
  bijgewerkt: string;
  dagen: { naam: string; reeksen: string[]; eerste: string; laatste: string; aantal: number }[];
  reeksen: Reeks[];
  wedstrijden: Wedstrijd[];
  ploegen: Ploeg[];
  clubs: { naam: string; logo: string | null; kleuren: string[] }[];
  velden: string[];
};

const TABS = [
  { id: "mijn", label: "Mijn ploeg", icoon: Star },
  { id: "schema", label: "Schema", icoon: CalendarDays },
  { id: "poules", label: "Poules", icoon: LayoutGrid },
  { id: "ploegen", label: "Ploegen", icoon: Users },
  { id: "info", label: "Info", icoon: Info },
] as const;
type TabId = (typeof TABS)[number]["id"];

/** Reeksen op leeftijd sorteren: U6, U7, U8, ... WU16 achteraan. */
function reeksVolgorde(naam: string) {
  const cijfer = parseInt(naam.replace(/\D/g, ""), 10) || 99;
  return (naam.startsWith("W") ? 100 : 0) + cijfer;
}

const MAANDEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

/**
 * Zet "zaterdag 29 augustus" plus een uur om in een echt tijdstip.
 *
 * Daarmee weten we welke wedstrijd nu bezig is en welke de volgende is. Lukt
 * het lezen niet, dan geven we niets terug en blijft de pagina gewoon werken,
 * alleen zonder die markeringen.
 */
function tijdstip(dag: string, uur: string, jaar: number): Date | null {
  const delen = dag.match(/(\d{1,2})\s+([a-zé]+)/i);
  const klok = uur.match(/^(\d{1,2}):(\d{2})$/);
  if (!delen || !klok) return null;
  const maand = MAANDEN.indexOf(delen[2].toLowerCase());
  if (maand < 0) return null;
  return new Date(jaar, maand, Number(delen[1]), Number(klok[1]), Number(klok[2]));
}

/**
 * Een ploeg in één bepaalde reeks.
 *
 * In de uitvoer staat een club met meerdere leeftijdsploegen als één ploeg,
 * met al zijn reeksen erbij: "KWS Linkhout" speelt zo in U6 tot en met U13.
 * Wie zijn ploeg zoekt wil die van zijn eigen kind, niet drieëntwintig
 * wedstrijden door elkaar. Daarom splitsen we hier per reeks.
 */
type Ingang = {
  sleutel: string;
  ploeg: Ploeg;
  reeks: string;
  aantal: number;
};

/** De sleutel waarmee we een keuze bewaren en terugvinden. */
function sleutelVan(naam: string, reeks: string) {
  return `${naam} | ${reeks}`;
}

/**
 * De plannen van het terrein en van het verkeer eromheen.
 *
 * De bestanden komen los in `public/kws-cup/`. Staat er nog geen bestand,
 * dan toont de kaart een nette melding in plaats van een gebroken beeld.
 */
const PLANNEN = [
  {
    sleutel: "plattegrond",
    titel: "Plattegrond van het terrein",
    bron: "/kws-cup/plattegrond.jpg",
    uitleg: "Waar de velden, de inkom, het secretariaat en het podium liggen.",
  },
  {
    sleutel: "circulatieplan",
    titel: "Circulatieplan",
    bron: "/kws-cup/circulatieplan.png",
    uitleg: "Eenrichtingsverkeer rond het terrein en waar je kan parkeren.",
  },
] as const;

/**
 * Bijlagen om te downloaden.
 *
 * Leeg zolang er geen bestand is: liever geen kaart dan een verwijzing die
 * op niets uitkomt. Zet het wedstrijdblad in `public/kws-cup/` en voeg hier
 * de regel toe die eronder staat.
 *
 *   { naam: "Wedstrijdblad KBVB", bron: "/kws-cup/tornooiblad-kbvb-kws.pdf" },
 */
const BIJLAGEN: { naam: string; bron: string }[] = [];

/**
 * Hoe lang er per poule gespeeld wordt, afgeleid uit het schema zelf.
 *
 * Dit stond eerst met de hand ingevuld en liep achter zodra de indeling
 * wijzigde. Alles wat hier staat komt nu uit de uitvoer van de
 * Tornooiplanner, dus het klopt altijd met de wedstrijden ernaast.
 */
function wedstrijdduur(tornooi: Tornooi) {
  return [...tornooi.reeksen]
    .sort((a, b) => reeksVolgorde(a.naam) - reeksVolgorde(b.naam))
    .flatMap((reeks) =>
      reeks.poules.map((poule) => {
        const wedstrijden = tornooi.wedstrijden.filter(
          (w) => w.reeks === reeks.naam && w.poule === poule.naam,
        );
        // Bij de allerkleinsten speelt een ploeg op twee veldjes tegelijk.
        const velden = Math.max(1, ...wedstrijden.map((w) => w.velden.length));
        const perPloeg = Math.max(0, ...poule.ploegen.map((p) => p.wedstrijden));
        return {
          sleutel: `${reeks.naam}-${poule.naam}`,
          reeks: reeks.naam,
          poule: poule.naam,
          minuten: poule.minuten,
          perPloeg,
          velden,
          ploegen: poule.ploegen.length,
        };
      }),
    );
}

/** De praktische afspraken voor op de dag zelf. */
const AFSPRAKEN = [
  {
    teken: "✏️",
    titel: "Aanmelden bij aankomst",
    tekst:
      "Meld je ploeg bij aankomst aan bij het secretariaat met een ingevuld " +
      "wedstrijdblad. Het secretariaat staat in de tent rechts van de inkom. " +
      "Daar krijg je het wedstrijdschema en alle nuttige info, en je kan er de " +
      "hele dag terecht.",
  },
  {
    teken: "🚥",
    titel: "Eenrichtingsverkeer",
    tekst:
      "Rond het terrein en op de parking geldt eenrichtingsverkeer, zodat alles " +
      "veilig blijft. Volg de signalisatie en de verkeersborden, en parkeer op de " +
      "aangeduide plaatsen. Het circulatieplan staat hieronder.",
  },
  {
    teken: "🥇",
    titel: "Medaille-uitreiking",
    tekst:
      "Na jullie laatste wedstrijd mogen jullie met de hele ploeg naar het podium " +
      "komen voor de medailles. Een mooi moment om samen af te sluiten.",
  },
  {
    teken: "🍔",
    titel: "Catering",
    tekst: "Zin in een snack? Kom langs bij onze stand voor een hotdog en een drankje.",
  },
  {
    teken: "🎁",
    titel: "Goodiebag bij vertrek",
    tekst:
      "Voor elke speler ligt er een goodiebag klaar aan het onthaal, als dank voor " +
      "jullie deelname. Haal die op bij het naar huis gaan, en alleen dan.",
  },
] as const;

/** Zoeken zonder te struikelen over hoofdletters, punten of accenten. */
function vereenvoudig(tekst: string) {
  return tekst
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function Logo({ ploeg, maat = 22 }: { ploeg?: Ploeg; maat?: number }) {
  if (!ploeg?.logo) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full
                   bg-gray-100 font-bold text-gray-400"
        style={{ width: maat, height: maat, fontSize: Math.round(maat * 0.4) }}
        aria-hidden
      >
        {ploeg?.naam?.slice(0, 2).toUpperCase() ?? "?"}
      </span>
    );
  }
  return (
    <Image
      src={ploeg.logo}
      alt=""
      width={maat}
      height={maat}
      className="shrink-0 object-contain"
    />
  );
}

/** Eén keuzeknop in een rij filters. Leest vlotter dan een keuzelijst. */
function Chip({
  actief,
  onClick,
  children,
}: {
  actief: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        actief
          ? "border-primary bg-primary text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Eén wedstrijd in een lijst: uur links, de twee ploegen in het midden,
 * reeks en veld rechts.
 */
function WedstrijdRij({
  wedstrijd: w,
  ploegIndex,
  uitgelicht,
  staat,
}: {
  wedstrijd: Wedstrijd;
  ploegIndex: Map<string, Ploeg>;
  uitgelicht?: string;
  staat?: "bezig" | "gespeeld" | null;
}) {
  const dik = (naam: string) =>
    uitgelicht && naam === uitgelicht ? "font-bold text-gray-900" : "text-gray-800";

  return (
    <article
      className={`flex items-stretch gap-3 border-b border-gray-100 bg-white px-4 py-3 last:border-b-0 ${
        staat === "gespeeld" ? "opacity-60" : ""
      }`}
    >
      {/* Uur en veld staan samen links: dat is wat je als eerste zoekt, en
          zo hoeft er op een telefoon niets opzij geschoven te worden. */}
      <div className="flex w-14 shrink-0 flex-col items-center justify-center gap-1">
        <div className="text-center leading-tight">
          <div className="text-base font-bold tabular-nums text-gray-900">{w.start}</div>
          <div className="text-[11px] tabular-nums text-gray-400">{w.eind}</div>
        </div>
        <span className="whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-[11px]
                         font-bold tracking-wide text-white">
          {w.velden.join("+")}
        </span>
      </div>

      <div className="min-w-0 flex-1 border-l border-gray-100 pl-3">
        <div className="flex items-center gap-2">
          <Logo ploeg={ploegIndex.get(w.thuis)} maat={20} />
          <span className={`truncate text-[15px] ${dik(w.thuis)}`}>{w.thuis}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <Logo ploeg={ploegIndex.get(w.uit)} maat={20} />
          <span className={`truncate text-[15px] ${dik(w.uit)}`}>{w.uit}</span>
        </div>
      </div>

      <div className="flex w-14 shrink-0 flex-col items-end justify-center">
        {staat === "bezig" ? (
          <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5
                           text-[11px] font-bold text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            bezig
          </span>
        ) : (
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
            {w.reeks}
          </span>
        )}
      </div>
    </article>
  );
}

/** Een lijst wedstrijden, gegroepeerd per dag met een blijvende dagkop. */
function WedstrijdLijst({
  wedstrijden,
  volgorde,
  ploegIndex,
  uitgelicht,
  nu,
  jaar,
  leeg,
}: {
  wedstrijden: Wedstrijd[];
  volgorde: string[];
  ploegIndex: Map<string, Ploeg>;
  uitgelicht?: string;
  nu: Date | null;
  jaar: number;
  leeg: string;
}) {
  const perDag = useMemo(() => {
    const kaart = new Map<string, Wedstrijd[]>();
    wedstrijden.forEach((w) => {
      const lijst = kaart.get(w.dag) ?? [];
      lijst.push(w);
      kaart.set(w.dag, lijst);
    });
    return [...kaart.entries()]
      .sort((a, b) => volgorde.indexOf(a[0]) - volgorde.indexOf(b[0]))
      .map(([dag, lijst]) => [dag, [...lijst].sort((a, b) => a.start.localeCompare(b.start))] as const);
  }, [wedstrijden, volgorde]);

  if (wedstrijden.length === 0) {
    return <p className="rounded-xl bg-white px-4 py-8 text-center text-gray-500">{leeg}</p>;
  }

  const staatVan = (w: Wedstrijd): "bezig" | "gespeeld" | null => {
    if (!nu) return null;
    const van = tijdstip(w.dag, w.start, jaar);
    const tot = tijdstip(w.dag, w.eind, jaar);
    if (!van || !tot) return null;
    if (nu >= van && nu <= tot) return "bezig";
    if (nu > tot) return "gespeeld";
    return null;
  };

  return (
    <div className="space-y-5">
      {perDag.map(([dag, lijst]) => (
        <section key={dag}>
          <h3 className="sticky top-14 z-20 bg-gray-50/95 py-2 text-xs font-bold uppercase
                         tracking-wide text-gray-500 backdrop-blur sm:top-[6.25rem]">
            {dag}
            <span className="ml-2 font-medium normal-case tracking-normal text-gray-400">
              {lijst.length} wedstrijden
            </span>
          </h3>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {lijst.map((w) => (
              <WedstrijdRij
                key={`${w.reeks}-${w.nr}`}
                wedstrijd={w}
                ploegIndex={ploegIndex}
                uitgelicht={uitgelicht}
                staat={staatVan(w)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Zoekveld met een kruisje om het leeg te maken. */
function Zoeken({
  waarde,
  onWijzig,
  plaatsaanduiding,
}: {
  waarde: string;
  onWijzig: (v: string) => void;
  plaatsaanduiding: string;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={waarde}
        onChange={(e) => onWijzig(e.target.value)}
        placeholder={plaatsaanduiding}
        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-9 pr-9
                   text-base outline-none focus:border-primary"
      />
      {waarde && (
        <button
          type="button"
          onClick={() => onWijzig("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400
                     hover:bg-gray-100"
          aria-label="Zoekopdracht wissen"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/**
 * Een plan met een vergroting bij het aanklikken.
 *
 * Zo'n plan staat op een telefoon veel te klein om iets op te lezen, dus gaat
 * hij bij het aantikken over het hele scherm open. Zolang het bestand er nog
 * niet is blijft het bij een nette melding.
 */
function Plan({
  titel,
  bron,
  uitleg,
}: {
  titel: string;
  bron: string;
  uitleg: string;
}) {
  const [open, setOpen] = useState(false);
  const [ingezoomd, setIngezoomd] = useState(false);
  const [ontbreekt, setOntbreekt] = useState(false);

  useEffect(() => {
    if (!open) return;
    setIngezoomd(false);
    const opToets = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", opToets);
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", opToets);
      document.body.style.overflow = vorige;
    };
  }, [open]);

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="px-4 py-3">
        <h4 className="font-bold text-gray-900">{titel}</h4>
        <p className="mt-0.5 text-sm text-gray-500">{uitleg}</p>
      </div>

      {ontbreekt ? (
        <p className="border-t border-gray-100 px-4 py-8 text-center text-sm text-gray-500">
          Dit plan volgt nog.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block w-full border-t border-gray-100"
          aria-label={`${titel} vergroot bekijken`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bron}
            alt={titel}
            onError={() => setOntbreekt(true)}
            className="w-full object-cover"
          />
          <span
            className="absolute inset-0 flex items-center justify-center bg-black/0
                       transition-colors group-hover:bg-black/20"
          >
            <span
              className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5
                         text-sm font-medium text-white opacity-0 transition-opacity
                         group-hover:opacity-100"
            >
              <Maximize2 className="h-4 w-4" />
              vergroten
            </span>
          </span>
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={titel}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white
                       hover:bg-white/25"
            aria-label="Sluiten"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIngezoomd((v) => !v);
            }}
            className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/15
                       px-3 py-2 text-sm font-medium text-white hover:bg-white/25"
          >
            {ingezoomd ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {ingezoomd ? "passend" : "inzoomen"}
          </button>

          {/* Het plan past standaard op het scherm, want ongevraagd opzij
              moeten schuiven is vervelend. Wie een veldnummer wil lezen zet
              het groter en kan er dan wel in schuiven. */}
          <div
            className={`flex max-h-full w-full ${ingezoomd ? "overflow-auto" : "justify-center"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bron}
              alt={titel}
              className={
                ingezoomd
                  ? "mx-auto min-w-[1400px] max-w-none"
                  : "max-h-[80vh] w-auto max-w-full object-contain"
              }
            />
          </div>
          <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center
                        text-sm text-white/70">
            {titel}
          </p>
        </div>
      )}
    </article>
  );
}

export default function TornooiClient({ tornooi: begin }: { tornooi: Tornooi }) {
  const [tornooi, setTornooi] = useState(begin);
  const [tab, setTab] = useState<TabId>("mijn");
  const [keuze, setKeuze] = useState("");
  const [zoek, setZoek] = useState("");
  const [zoekPloegen, setZoekPloegen] = useState("");
  const [dag, setDag] = useState("alle");
  const [schemaReeks, setSchemaReeks] = useState("alle");
  const [ververst, setVerverst] = useState<Date | null>(null);
  const [bezig, setBezig] = useState(false);
  const [nu, setNu] = useState<Date | null>(null);

  const haalOp = useCallback(async () => {
    setBezig(true);
    try {
      const antwoord = await fetch("/api/kws-cup", { cache: "no-store" });
      if (antwoord.ok) {
        setTornooi((await antwoord.json()) as Tornooi);
        setVerverst(new Date());
      }
    } catch {
      /* stil: bij een haperende verbinding blijft het huidige schema staan */
    } finally {
      setBezig(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(haalOp, 60_000);
    const bijTerugkeer = () => document.visibilityState === "visible" && haalOp();
    document.addEventListener("visibilitychange", bijTerugkeer);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", bijTerugkeer);
    };
  }, [haalOp]);

  // De klok pas na het inladen zetten: op de server is er geen "nu", en anders
  // zou het beeld daar anders uitvallen dan in de browser.
  useEffect(() => {
    setNu(new Date());
    const timer = setInterval(() => setNu(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  // keuze onthouden, zodat je ploeg er nog staat als je later terugkomt
  useEffect(() => {
    const bewaard = localStorage.getItem("kws-cup-ploeg");
    if (bewaard) setKeuze(bewaard);
  }, []);
  useEffect(() => {
    if (keuze) localStorage.setItem("kws-cup-ploeg", keuze);
    else localStorage.removeItem("kws-cup-ploeg");
  }, [keuze]);

  const reeksen = useMemo(
    () => [...tornooi.reeksen].sort((a, b) => reeksVolgorde(a.naam) - reeksVolgorde(b.naam)),
    [tornooi.reeksen],
  );

  const dagVolgorde = useMemo(() => tornooi.dagen.map((d) => d.naam), [tornooi.dagen]);

  const ploegIndex = useMemo(() => {
    const kaart = new Map<string, Ploeg>();
    tornooi.ploegen.forEach((p) => kaart.set(p.naam, p));
    return kaart;
  }, [tornooi.ploegen]);

  /**
   * Elke ploeg apart per reeks, op naam en daarna op leeftijd.
   *
   * Zo staat "KWS Linkhout" niet één keer met zeven reeksen in de lijst, maar
   * zeven keer: U6, U7, U8 en zo verder, elk met zijn eigen wedstrijden.
   */
  const ingangen = useMemo(() => {
    const alle: Ingang[] = [];
    tornooi.ploegen.forEach((ploeg) => {
      ploeg.reeksen.forEach((reeks) => {
        alle.push({
          sleutel: sleutelVan(ploeg.naam, reeks),
          ploeg,
          reeks,
          aantal: tornooi.wedstrijden.filter(
            (w) => w.reeks === reeks && (w.thuis === ploeg.naam || w.uit === ploeg.naam),
          ).length,
        });
      });
    });
    return alle.sort(
      (a, b) =>
        a.ploeg.naam.localeCompare(b.ploeg.naam, "nl") ||
        reeksVolgorde(a.reeks) - reeksVolgorde(b.reeks),
    );
  }, [tornooi.ploegen, tornooi.wedstrijden]);

  const filter = (lijst: Ingang[], term: string) => {
    const t = vereenvoudig(term);
    if (!t) return lijst;
    return lijst.filter((i) =>
      vereenvoudig(`${i.ploeg.naam} ${i.ploeg.club} ${i.reeks}`).includes(t),
    );
  };

  /**
   * De gekozen ingang.
   *
   * Een oudere keuze bevat alleen een ploegnaam, van voor we per reeks
   * splitsten. Die laten we op de eerste reeks van die ploeg uitkomen in
   * plaats van hem weg te gooien.
   */
  const mijn = useMemo(() => {
    if (!keuze) return undefined;
    return (
      ingangen.find((i) => i.sleutel === keuze) ??
      ingangen.find((i) => i.ploeg.naam === keuze)
    );
  }, [keuze, ingangen]);

  const mijnWedstrijden = useMemo(() => {
    if (!mijn) return [];
    return tornooi.wedstrijden
      .filter(
        (w) =>
          w.reeks === mijn.reeks &&
          (w.thuis === mijn.ploeg.naam || w.uit === mijn.ploeg.naam),
      )
      .sort(
        (a, b) =>
          dagVolgorde.indexOf(a.dag) - dagVolgorde.indexOf(b.dag) ||
          a.start.localeCompare(b.start),
      );
  }, [mijn, tornooi.wedstrijden, dagVolgorde]);

  /** De eerstvolgende wedstrijd van de gekozen ploeg, of die nu bezig is. */
  const volgende = useMemo(() => {
    if (!nu) return null;
    return (
      mijnWedstrijden.find((w) => {
        const tot = tijdstip(w.dag, w.eind, tornooi.jaar);
        return tot ? tot >= nu : false;
      }) ?? null
    );
  }, [mijnWedstrijden, nu, tornooi.jaar]);

  const mijnPoule = useMemo(() => {
    if (!mijn) return null;
    const reeks = tornooi.reeksen.find((r) => r.naam === mijn.reeks);
    return reeks?.poules.find((p) => p.ploegen.some((pl) => pl.naam === mijn.ploeg.naam)) ?? null;
  }, [mijn, tornooi.reeksen]);

  const schema = useMemo(
    () =>
      tornooi.wedstrijden.filter(
        (w) =>
          (dag === "alle" || w.dag === dag) &&
          (schemaReeks === "alle" || w.reeks === schemaReeks),
      ),
    [tornooi.wedstrijden, dag, schemaReeks],
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-20 sm:pb-0">
      {/* Vaste balk boven, zoals de titelbalk van een toepassing. */}
      <header className="sticky top-0 z-40 bg-primary text-white shadow-sm">
        <div className="container-custom flex h-14 items-center gap-3">
          <Image
            src="/images/logo-kws.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 object-contain"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold leading-tight">{tornooi.titel}</p>
            <p className="truncate text-[11px] leading-tight text-white/70">
              K.W.S. Linkhout · {tornooi.wedstrijden.length} wedstrijden
            </p>
          </div>
          <button
            type="button"
            onClick={haalOp}
            className="rounded-full p-2 hover:bg-white/15"
            aria-label="Schema opnieuw ophalen"
          >
            <RefreshCw className={`h-4 w-4 ${bezig ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Op een breed scherm staan de tabbladen hier; op een telefoon onderaan. */}
        <nav className="hidden border-t border-white/15 sm:block">
          <div className="container-custom flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium
                            transition-colors ${
                              tab === t.id
                                ? "border-white text-white"
                                : "border-transparent text-white/70 hover:text-white"
                            }`}
              >
                <t.icoon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <div className="container-custom flex-1 py-5">
        {/* MIJN PLOEG */}
        {tab === "mijn" && !mijn && (
          <section>
            <h2 className="text-xl font-bold text-gray-900">Volg je ploeg</h2>
            <p className="mt-1 text-gray-600">
              Zoek je ploeg en je ziet meteen wanneer en op welk veld je speelt. We onthouden
              je keuze op dit toestel.
            </p>
            <div className="mt-4">
              <Zoeken waarde={zoek} onWijzig={setZoek} plaatsaanduiding="Zoek een ploeg of club…" />
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
              {filter(ingangen, zoek).map((i) => (
                <button
                  key={i.sleutel}
                  onClick={() => {
                    setKeuze(i.sleutel);
                    setZoek("");
                  }}
                  className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3
                             text-left last:border-b-0 hover:bg-primary/5"
                >
                  <Logo ploeg={i.ploeg} maat={28} />
                  <span className="min-w-0 flex-1 truncate text-gray-900">{i.ploeg.naam}</span>
                  <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs
                                   font-bold text-primary">
                    {i.reeks}
                  </span>
                </button>
              ))}
              {filter(ingangen, zoek).length === 0 && (
                <p className="px-4 py-8 text-center text-gray-500">Geen ploeg gevonden.</p>
              )}
            </div>
          </section>
        )}

        {tab === "mijn" && mijn && (
          <section>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
              <Logo ploeg={mijn.ploeg} maat={44} />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold text-gray-900">{mijn.ploeg.naam}</h2>
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {mijn.reeks}
                  </span>
                  {mijnWedstrijden.length} wedstrijden
                </p>
              </div>
              <button
                type="button"
                onClick={() => setKeuze("")}
                className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-sm
                           font-medium text-gray-600 hover:border-gray-300"
              >
                Wissel
              </button>
            </div>

            {volgende && (
              <div className="mt-4 rounded-xl bg-primary p-4 text-white">
                <p className="text-xs font-bold uppercase tracking-wide text-white/70">
                  Volgende wedstrijd
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {volgende.start}
                  <span className="ml-2 text-base font-medium text-white/80">
                    veld {volgende.velden.join(" + ")}
                  </span>
                </p>
                <p className="mt-1 text-white/90">
                  tegen{" "}
                  <span className="font-semibold">
                    {volgende.thuis === mijn.ploeg.naam ? volgende.uit : volgende.thuis}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-white/70">
                  {volgende.dag} · {volgende.reeks} · {volgende.poule}
                </p>
              </div>
            )}

            <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-gray-500">
              Alle wedstrijden
            </h3>
            <div className="mt-2">
              <WedstrijdLijst
                wedstrijden={mijnWedstrijden}
                volgorde={dagVolgorde}
                ploegIndex={ploegIndex}
                uitgelicht={mijn.ploeg.naam}
                nu={nu}
                jaar={tornooi.jaar}
                leeg="Voor deze ploeg staat er nog geen wedstrijd in het schema."
              />
            </div>

            {mijnPoule && (
              <div className="mt-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
                  {mijn.reeks} · {mijnPoule.naam}
                  <span className="ml-2 font-medium normal-case tracking-normal text-gray-400">
                    {mijnPoule.minuten} min per wedstrijd
                  </span>
                </h3>
                <ul className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white">
                  {mijnPoule.ploegen.map((pl) => (
                    <li
                      key={pl.naam}
                      className={`flex items-center gap-3 border-b border-gray-100 px-4 py-2.5
                                  text-sm last:border-b-0 ${
                                    pl.naam === mijn.ploeg.naam ? "bg-primary/5 font-semibold" : ""
                                  }`}
                    >
                      <Logo ploeg={ploegIndex.get(pl.naam)} maat={20} />
                      <span className="min-w-0 flex-1 truncate text-gray-900">{pl.naam}</span>
                      <span className="shrink-0 text-gray-400">{pl.wedstrijden}×</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* SCHEMA */}
        {tab === "schema" && (
          <section>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Chip actief={dag === "alle"} onClick={() => setDag("alle")}>
                  alle dagen
                </Chip>
                {tornooi.dagen.map((d) => (
                  <Chip
                    key={d.naam}
                    actief={dag === d.naam}
                    onClick={() => {
                      setDag(d.naam);
                      setSchemaReeks("alle");
                    }}
                  >
                    {d.naam.split(" ")[0]}
                  </Chip>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Chip actief={schemaReeks === "alle"} onClick={() => setSchemaReeks("alle")}>
                  alle reeksen
                </Chip>
                {reeksen
                  .filter((r) => dag === "alle" || r.dag === dag)
                  .map((r) => (
                    <Chip
                      key={r.naam}
                      actief={schemaReeks === r.naam}
                      onClick={() => setSchemaReeks(r.naam)}
                    >
                      {r.naam}
                    </Chip>
                  ))}
              </div>
            </div>

            <div className="mt-4">
              <WedstrijdLijst
                wedstrijden={schema}
                volgorde={dagVolgorde}
                ploegIndex={ploegIndex}
                uitgelicht={mijn?.ploeg.naam}
                nu={nu}
                jaar={tornooi.jaar}
                leeg="Geen wedstrijden met deze filters."
              />
            </div>
          </section>
        )}

        {/* POULES */}
        {tab === "poules" && (
          <section className="space-y-5">
            {reeksen.map((r) => (
              <article key={r.naam} className="rounded-xl border border-gray-200 bg-white p-5">
                <header className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-lg font-bold text-gray-900">{r.naam}</h3>
                  <span className="text-sm text-gray-500">
                    {r.dag} · {r.start}–{r.eind} · {r.aantalPloegen} ploegen
                  </span>
                </header>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {r.poules.map((p) => (
                    <div key={p.naam}>
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-semibold text-gray-900">{p.naam}</h4>
                        <span className="text-xs text-gray-500">{p.minuten} min</span>
                      </div>
                      <ul className="mt-2 divide-y divide-gray-100 rounded-lg border border-gray-200">
                        {p.ploegen.map((pl) => (
                          <li
                            key={pl.naam}
                            className={`flex items-center gap-2 px-3 py-2 text-sm ${
                              pl.naam === mijn?.ploeg.naam ? "bg-primary/5 font-semibold" : ""
                            }`}
                          >
                            <Logo ploeg={ploegIndex.get(pl.naam)} maat={20} />
                            <span className="min-w-0 flex-1 truncate text-gray-900">{pl.naam}</span>
                            <span className="shrink-0 whitespace-nowrap text-gray-400">
                              {pl.wedstrijden}×
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}

        {/* PLOEGEN */}
        {tab === "ploegen" && (
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              Deelnemende ploegen ({ingangen.length})
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Een club met meerdere leeftijdsploegen staat hier per reeks.
            </p>
            <div className="mt-4">
              <Zoeken
                waarde={zoekPloegen}
                onWijzig={setZoekPloegen}
                plaatsaanduiding="Zoek een ploeg of club…"
              />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filter(ingangen, zoekPloegen).map((i) => (
                <button
                  key={i.sleutel}
                  onClick={() => {
                    setKeuze(i.sleutel);
                    setTab("mijn");
                  }}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white
                             px-3 py-3 text-left hover:border-primary/40 hover:bg-primary/5"
                >
                  <Logo ploeg={i.ploeg} maat={28} />
                  <span className="min-w-0 flex-1 truncate text-gray-900">{i.ploeg.naam}</span>
                  <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs
                                   font-bold text-primary">
                    {i.reeks}
                  </span>
                </button>
              ))}
            </div>
            {filter(ingangen, zoekPloegen).length === 0 && (
              <p className="mt-4 rounded-xl bg-white px-4 py-8 text-center text-gray-500">
                Geen ploeg gevonden.
              </p>
            )}
          </section>
        )}

        {/* INFO */}
        {tab === "info" && (
          <section className="space-y-5">
            <article className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-lg font-bold text-gray-900">Welkom op de KWS Cup</h3>
              <p className="mt-2 text-gray-700">
                De KWS Cup is het jaarlijkse jeugdtornooi van K.W.S. Linkhout. Op{" "}
                {tornooi.dagen.map((d) => d.naam).join(", ").replace(/,([^,]*)$/, " en$1")}{" "}
                verwelkomen wij met veel plezier alle collega-clubs.
              </p>
              <p className="mt-2 text-gray-700">
                Vragen over het tornooi? Mail ons op{" "}
                <a href="mailto:info@kwslinkhout.be" className="font-medium text-primary underline">
                  info@kwslinkhout.be
                </a>
                .
              </p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-lg font-bold text-gray-900">Praktisch</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-gray-500 sm:w-24">Waar</dt>
                  <dd className="text-gray-900">
                    K.W.S. Linkhout, Kapelstraat, Lummen
                    <a
                      href="https://maps.google.com/?q=K.W.S.+Linkhout+Kapelstraat+Lummen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 font-medium text-primary underline"
                    >
                      op de kaart
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-gray-500 sm:w-24">Velden</dt>
                  <dd className="text-gray-900">
                    A-plein: A1 tot A4 · B-veld: B1 en B2 · C-terrein: C1 tot C6
                  </dd>
                </div>
                {tornooi.dagen.map((d) => (
                  <div key={d.naam} className="flex gap-3">
                    <dt className="w-20 shrink-0 capitalize text-gray-500 sm:w-24">
                      {d.naam.split(" ")[0]}
                    </dt>
                    <dd className="text-gray-900">
                      {d.eerste}–{d.laatste} · {d.reeksen.join(", ")} · {d.aantal} wedstrijden
                    </dd>
                  </div>
                ))}
              </dl>
            </article>

            <div className="grid gap-5 lg:grid-cols-2">
              {PLANNEN.map((plan) => (
                <Plan key={plan.sleutel} titel={plan.titel} bron={plan.bron} uitleg={plan.uitleg} />
              ))}
            </div>

            <article className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-lg font-bold text-gray-900">Op de dag zelf</h3>
              <div className="mt-3 space-y-4">
                {AFSPRAKEN.map((a) => (
                  <div key={a.titel} className="flex gap-3">
                    {/* Het tekentje hoort bij de titel en zegt op zich niets,
                        dus voorlezers slaan het over. */}
                    <span className="shrink-0 text-xl leading-6" aria-hidden>
                      {a.teken}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900">{a.titel}</h4>
                      <p className="mt-0.5 text-sm leading-relaxed text-gray-700">{a.tekst}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="px-5 pt-5">
                <h3 className="text-lg font-bold text-gray-900">Wedstrijdduur per poule</h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  Rechtstreeks uit het schema, dus altijd gelijk aan de wedstrijden.
                </p>
              </div>
              <ul className="mt-3">
                {wedstrijdduur(tornooi).map((d) => (
                  <li
                    key={d.sleutel}
                    className="border-t border-gray-100 px-5 py-2.5 text-sm sm:flex sm:gap-3"
                  >
                    <span className="flex gap-2 sm:contents">
                      <span className="font-bold text-primary sm:w-12 sm:shrink-0">{d.reeks}</span>
                      <span className="text-gray-500 sm:w-24 sm:shrink-0">{d.poule}</span>
                    </span>
                    <span className="mt-0.5 block text-gray-800 sm:mt-0 sm:min-w-0 sm:flex-1">
                      {d.minuten} min per wedstrijd ·{" "}
                      {d.perPloeg} {d.perPloeg === 1 ? "wedstrijd" : "wedstrijden"} per ploeg ·{" "}
                      {d.ploegen} {d.ploegen === 1 ? "ploeg" : "ploegen"}
                      {d.velden > 1 && (
                        <span className="text-gray-500">
                          {" "}
                          · één ploeg speelt op {d.velden} veldjes tegelijk
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            {BIJLAGEN.length > 0 && (
            <article className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-lg font-bold text-gray-900">Bijlagen</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {BIJLAGEN.map((b) => (
                  <a
                    key={b.bron}
                    href={b.bron}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200
                               px-3 py-2 text-sm font-medium text-gray-700 hover:border-primary/40
                               hover:bg-primary/5"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    {b.naam}
                  </a>
                ))}
              </div>
            </article>
            )}

            <article className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-lg font-bold text-gray-900">Goed om te weten</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                <li>Bij U6 en U7 speelt één ploeg tegelijk op meerdere veldjes.</li>
                <li>
                  Het schema kan tijdens het tornooi wijzigen, bijvoorbeeld als een ploeg
                  afzegt. Deze pagina toont altijd de laatste versie.
                </li>
                <li>Vragen op de dag zelf? Kom naar het wedstrijdsecretariaat.</li>
              </ul>
            </article>

            <p className="px-1 pb-2 text-sm text-gray-500">
              K.W.S. Linkhout · {tornooi.titel}
              {ververst && (
                <>
                  {" · "}bijgewerkt om{" "}
                  {ververst.toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}
                </>
              )}
            </p>
          </section>
        )}
      </div>

      {/* Tabbalk onderaan op een telefoon, waar de duim hem kan bereiken. */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95
                   backdrop-blur sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium
                          transition-colors ${
                            tab === t.id ? "text-primary" : "text-gray-400"
                          }`}
            >
              <t.icoon className="h-5 w-5" />
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
