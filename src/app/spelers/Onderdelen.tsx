import Image from "next/image";
import type { Telling } from "@/lib/jeugd/gegevens";
import { procent, totaal } from "@/lib/jeugd/gegevens";

/** Kleine bouwstenen die op meerdere pagina's van het dossier terugkomen. */

export function Portret({ foto, naam, grootte = 48 }: { foto: { klein: string } | null; naam: string; grootte?: number }) {
  const letters = naam
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  if (foto) {
    return (
      <Image
        src={foto.klein}
        alt=""
        width={grootte}
        height={grootte}
        className="shrink-0 rounded-full bg-zand-200 object-cover"
        style={{ width: grootte, height: grootte }}
      />
    );
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-zand-200 font-display font-bold text-inkt-600"
      style={{ width: grootte, height: grootte, fontSize: grootte * 0.36 }}
      aria-hidden
    >
      {letters}
    </span>
  );
}

/** Kleur volgens hoe vaak iemand er was. */
function toon(p: number | null): string {
  if (p === null) return "bg-zand-300";
  if (p >= 80) return "bg-emerald-600";
  if (p >= 60) return "bg-amber-500";
  return "bg-primary-600";
}

export function Balk({ telling, label }: { telling: Telling | undefined; label?: string }) {
  const p = procent(telling);
  const n = telling ? totaal(telling) : 0;
  return (
    <div className="grid gap-1">
      {label && (
        <div className="flex items-baseline justify-between gap-2 text-sm">
          <span className="text-inkt-700">{label}</span>
          <span className="font-semibold tabular-nums">
            {p === null ? "geen" : `${p}%`}
            {n > 0 && <span className="ml-1 font-normal text-inkt-600">({telling!.komt} van {n})</span>}
          </span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-zand-200">
        <div className={`h-full rounded-full ${toon(p)}`} style={{ width: `${p ?? 0}%` }} />
      </div>
    </div>
  );
}

export function Procent({ telling }: { telling: Telling | undefined }) {
  const p = procent(telling);
  const n = telling ? totaal(telling) : 0;
  return (
    <span className="inline-flex items-center gap-2 tabular-nums">
      <span className={`h-2 w-2 rounded-full ${toon(p)}`} aria-hidden />
      {p === null ? <span className="text-inkt-600">geen</span> : <span>{p}%</span>}
      {n > 0 && <span className="text-xs text-inkt-600">{telling!.komt}/{n}</span>}
    </span>
  );
}

export function Kaart({ titel, children, rechts }: { titel: string; children: React.ReactNode; rechts?: React.ReactNode }) {
  return (
    <section className="grid content-start gap-4 rounded-xl border border-zand-200 bg-white p-5 shadow-zacht">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide">{titel}</h2>
        {rechts}
      </div>
      {children}
    </section>
  );
}

export function datumKort(iso: string): string {
  return new Date(iso).toLocaleDateString("nl-BE", { day: "numeric", month: "short", timeZone: "Europe/Brussels" });
}

export function datumLang(iso: string): string {
  return new Date(iso).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Brussels" });
}

export function tijdstip(iso: string): string {
  return new Date(iso).toLocaleString("nl-BE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Brussels" });
}
