"use client";

// components/PaginaKop.tsx
//
// De kop van elke pagina die niet de startpagina is.
//
// Dat dit één component is en geen dertig keer overgetypte markup, is wat de
// site samenhangend maakt. Voordien begon elke pagina met haar eigen rode
// verloop, haar eigen hoogte en haar eigen animatieduur: dertig keer bijna
// hetzelfde, en dat "bijna" is precies wat een site goedkoop doet ogen.
//
// De kop is donker en niet rood. De startpagina opent donker, dus een
// binnenpagina die daarna in dezelfde inkt opent, leest als hetzelfde huis.
// Het rood blijft waar het het meeste waard is: in het accentwoord, de knoppen
// en de kleine merktekens.

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Onthul } from "@/components/beweging/Onthul";
import { TekstOnthul } from "@/components/beweging/TekstOnthul";
import { duur, verzet } from "@/lib/beweging";
import type { ReactNode } from "react";

interface PaginaKopProps {
  /** Het kleine gespatieerde regeltje boven de titel. */
  opschrift?: string;
  titel: string;
  /** Dit woord uit de titel krijgt de clubkleur. */
  accent?: string;
  /** Eén of twee zinnen. Wie meer nodig heeft, schrijft geen kop maar een alinea. */
  onder?: string;
  /** Het pictogram bij het opschrift. */
  icoon?: LucideIcon;
  /** Terugkoppeling naar de bovenliggende pagina. */
  terug?: { naar: string; label: string };
  /**
   * Een foto achter de kop. Zonder foto valt de kop terug op de inkt met een
   * warme gloed; dat is bewust geen tweede keus, maar de rustige variant.
   */
  beeld?: string;
  /** Losse elementen onder de tekst: knoppen, cijfers, een zoekveld. */
  children?: ReactNode;
}

export function PaginaKop({
  opschrift,
  titel,
  accent,
  onder,
  icoon: Icoon,
  terug,
  beeld,
  children,
}: PaginaKopProps) {
  return (
    <header className="korrel lichtrand relative overflow-hidden bg-inkt-950 pb-16 pt-32 md:pb-20 md:pt-40">
      {beeld && (
        <>
          <Image
            src={beeld}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          {/* Zonder deze laag leest witte tekst niet op een foto met lucht erin. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-inkt-950/80 via-inkt-950/70 to-inkt-950"
          />
        </>
      )}

      {/* De gloed onderin, dezelfde als bij de cijfers op de startpagina. Ze
          maakt van het zwart een verlichte ruimte in plaats van een gat. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(85%_60%_at_50%_100%,rgba(220,38,38,0.20),transparent_65%)]"
      />

      <div className="container-custom relative">
        {terug && (
          <Onthul meteen afstand={verzet.klein} duurtijd={duur.kort}>
            <Link
              href={terug.naar}
              className="inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {terug.label}
            </Link>
          </Onthul>
        )}

        <div className={`max-w-3xl ${terug ? "mt-8" : ""}`}>
          {opschrift && (
            <Onthul meteen afstand={10} duurtijd={duur.kort}>
              <p className="opschrift text-primary-400">
                {Icoon ? (
                  <Icoon className="h-4 w-4" />
                ) : (
                  <span aria-hidden="true" className="h-px w-6 bg-primary-400/50" />
                )}
                {opschrift}
              </p>
            </Onthul>
          )}

          <h1 className="heading-1 mt-4 text-white">
            <TekstOnthul
              tekst={titel}
              accent={accent}
              accentClassName="text-primary-500"
              meteen
            />
          </h1>

          {onder && (
            <Onthul meteen vertraging={0.12} duurtijd={duur.lang}>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/60">{onder}</p>
            </Onthul>
          )}

          {children && (
            <Onthul meteen vertraging={0.2} duurtijd={duur.basis}>
              <div className="mt-8">{children}</div>
            </Onthul>
          )}
        </div>
      </div>
    </header>
  );
}
