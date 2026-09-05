"use client";

import { Onthul } from "@/components/beweging/Onthul";
import { TekstOnthul } from "@/components/beweging/TekstOnthul";
import { duur } from "@/lib/beweging";

/**
 * De kop van een sectie: opschrift, titel, en een regel eronder.
 *
 * Dat dit één component is en geen acht keer overgetypte markup, is precies
 * wat een pagina samenhangend maakt. Elke sectie op de startpagina begint op
 * dezelfde hoogte, met dezelfde afstanden, en het opschrift komt overal een
 * fractie vóór de titel binnen. Die herhaling merk je niet bewust op, maar
 * het verschil met acht net iets andere koppen is het verschil tussen een
 * site die ontworpen is en een die gegroeid is.
 *
 * De titel komt woord voor woord op, de rest gewoon. Meer dan één gebaar per
 * kop wordt druk.
 */

interface SectieKopProps {
  /** Het kleine gespatieerde regeltje boven de titel. */
  opschrift?: string;
  titel: string;
  /** Dit woord uit de titel krijgt de clubkleur. */
  accent?: string;
  /** Een regel onder de titel. Kort houden: dit is geen alinea. */
  onder?: string;
  uitlijning?: "links" | "midden";
  /** Voor koppen op een donkere achtergrond. */
  donker?: boolean;
  className?: string;
}

export function SectieKop({
  opschrift,
  titel,
  accent,
  onder,
  uitlijning = "midden",
  donker = false,
  className = "",
}: SectieKopProps) {
  const gecentreerd = uitlijning === "midden";

  return (
    <div
      className={`${gecentreerd ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {opschrift && (
        <Onthul afstand={10} duurtijd={duur.kort}>
          <p className={`opschrift ${donker ? "text-primary-400" : ""}`}>
            <span
              aria-hidden="true"
              className={`h-px w-6 ${donker ? "bg-primary-400/50" : "bg-primary/40"}`}
            />
            {opschrift}
          </p>
        </Onthul>
      )}

      <h2 className={`heading-2 mt-4 ${donker ? "text-white" : ""}`}>
        <TekstOnthul
          tekst={titel}
          accent={accent}
          accentClassName={donker ? "text-primary-500" : "text-primary"}
        />
      </h2>

      {onder && (
        <Onthul vertraging={0.12} duurtijd={duur.lang}>
          <p
            className={`mt-4 text-base leading-relaxed ${
              donker ? "text-white/55" : "text-gray-600"
            } ${gecentreerd ? "mx-auto" : ""}`}
          >
            {onder}
          </p>
        </Onthul>
      )}
    </div>
  );
}
