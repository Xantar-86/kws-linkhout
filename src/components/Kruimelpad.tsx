"use client";

// components/Kruimelpad.tsx
//
// Het rijtje bovenaan een binnenpagina: Home, dan de rubriek, dan waar je bent.
//
// Twee dingen tegelijk. Voor de bezoeker is het een manier om een stap terug te
// zetten zonder de knop van de browser. Voor Google is het het verschil tussen
// een kale link naar kwslinkhout.be en een resultaat dat toont waar de pagina
// in de site hangt; daarvoor gaat er dezelfde reeks ook machineleesbaar mee.
//
// De reeks wordt afgeleid uit het adres, dus een pagina hoeft niets door te
// geven. Alleen de laatste kruimel komt van buiten: dat is de titel van de
// pagina zelf, en die weet PaginaKop al.

import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * De naam van een rubriek in het adres.
 *
 * Alleen de tussenliggende stukken staan hier. Het laatste stuk is de pagina
 * waar je op staat en die heeft haar eigen titel; die verzinnen we niet uit de
 * slug, want "u17-a" is geen "U17 A" en "api" is geen "API (Aanspreekpunt
 * Integriteit)".
 */
const RUBRIEKEN: Record<string, string> = {
  ploegen: "Ploegen",
  clubinfo: "Clubinfo",
  jeugdopleiding: "Jeugdopleiding",
  medisch: "Medisch",
  nieuws: "Nieuws",
  berichten: "Berichten",
  nieuwsbrief: "Nieuwsbrieven",
  fotos: "Foto's",
};

const BASIS = "https://www.kwslinkhout.be";

export type Kruimel = { naam: string; pad?: string };

/**
 * Bouwt de reeks uit het adres.
 *
 * Komt er een stuk voor dat we niet kennen, dan laten we het weg in plaats van
 * er een slordige naam van te maken. Liever een korte reeks dan een verkeerde.
 */
export function kruimelsUitPad(pad: string, titel: string): Kruimel[] {
  const delen = pad.split("/").filter(Boolean);
  const kruimels: Kruimel[] = [{ naam: "Home", pad: "/" }];

  delen.slice(0, -1).forEach((deel, i) => {
    const naam = RUBRIEKEN[deel];
    if (naam) kruimels.push({ naam, pad: "/" + delen.slice(0, i + 1).join("/") });
  });

  kruimels.push({ naam: titel });
  return kruimels;
}

export function Kruimelpad({ kruimels }: { kruimels: Kruimel[] }) {
  // Twee kruimels is enkel Home plus de pagina zelf; dat is geen pad maar een
  // omweg naar de startpagina, en dat staat al in de kop.
  if (kruimels.length < 3) return null;

  const opmaak = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: kruimels.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: k.naam,
      ...(k.pad ? { item: `${BASIS}${k.pad === "/" ? "" : k.pad}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(opmaak) }}
      />
      <nav aria-label="Kruimelpad">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-white/55">
          {kruimels.map((k, i) => (
            <li key={k.naam + i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-white/30" />
              )}
              {k.pad ? (
                <Link href={k.pad} className="transition-colors hover:text-white">
                  {k.naam}
                </Link>
              ) : (
                // De laatste is waar je staat; die is geen link.
                <span aria-current="page" className="text-white/80">
                  {k.naam}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
