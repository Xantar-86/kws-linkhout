"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Onthul } from "@/components/beweging/Onthul";
import { TekstOnthul } from "@/components/beweging/TekstOnthul";
import { ParallaxZoom } from "@/components/beweging/Parallax";
import { Magnetisch } from "@/components/beweging/Magnetisch";
import { duur } from "@/lib/beweging";

/**
 * Het slot van de startpagina, en het enige doel ervan.
 *
 * Alles hierboven is opbouw geweest: wanneer spelen ze, wie zijn ze, wat
 * hebben ze gedaan, wie steunt ze. Dit is waar het naartoe werkt, en dus de
 * enige plek op de pagina waar één vraag staat en verder niets. Geen tweede
 * kolom, geen kaartenrij, geen links naar elders. Wie tot hier gescrold is,
 * heeft het verhaal gehad en mag nu één ding beslissen.
 *
 * Vandaar ook dat het weer donker is. De hero was donker, dit is donker, en
 * daartussen ligt de lichte pagina. Zo sluit het einde aan op het begin en
 * voelt de pagina af in plaats van afgebroken.
 *
 * Het adres staat eronder omdat "kom eens langs" zonder adres een lege
 * uitnodiging is. Het is een link naar de contactpagina met de kaart, niet
 * naar een kaartendienst: die keuze laten we aan de bezoeker.
 */
export function SlotCTA() {
  return (
    <section className="korrel lichtrand relative overflow-hidden bg-inkt-950 py-28 md:py-36">
      {/* De jeugd op de achtergrond, ver weggedraaid in het donker. Het beeld
          zoomt traag uit terwijl de sectie voorbijkomt, wat de indruk geeft
          dat de ruimte opengaat op het moment dat de vraag gesteld wordt. */}
      <ParallaxZoom van={1.14} naar={1.02} className="absolute inset-0">
        <Image
          src="/images/teams/alle-jeugd.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20"
        />
      </ParallaxZoom>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_0%,rgba(220,38,38,0.25),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-inkt-950/70 via-inkt-950/80 to-inkt-950"
      />

      <div className="container-custom relative">
        <div className="mx-auto max-w-3xl text-center">
          <Onthul afstand={10} duurtijd={duur.kort}>
            <p className="opschrift justify-center text-primary-400">
              <span aria-hidden="true" className="h-px w-6 bg-primary-400/50" />
              Word lid
            </p>
          </Onthul>

          <h2 className="heading-1 mt-6 text-white">
            <TekstOnthul
              tekst="Kom eens langs op Linkhout"
              accent="Linkhout"
              accentClassName="text-primary-500"
            />
          </h2>

          <Onthul vertraging={0.14} duurtijd={duur.lang}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              Een training meepikken kan altijd, en het verplicht tot niets.
              Van de allerkleinsten tot de veteranen: er is bij ons voor
              iedereen een ploeg.
            </p>
          </Onthul>

          <Onthul vertraging={0.24} duurtijd={duur.lang}>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Magnetisch kracht={8}>
                <Link
                  href="/clubinfo/sectie?slug=nieuwe-aansluiting"
                  className="btn-primary group w-full text-base sm:w-auto"
                >
                  Sluit je aan
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Magnetisch>
              <Magnetisch kracht={8}>
                <Link
                  href="/contact"
                  className="btn-secondary w-full border-white/25 text-white hover:border-white/50 hover:bg-white/10 sm:w-auto"
                >
                  Stel je vraag
                </Link>
              </Magnetisch>
            </div>
          </Onthul>

          <Onthul vertraging={0.34}>
            <Link
              href="/contact"
              className="group mt-12 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white/70"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Kapelstraat 72, 3560 Linkhout
              <span className="text-white/45 transition-colors group-hover:text-white/70">
                &middot; bekijk de route
              </span>
            </Link>
          </Onthul>
        </div>
      </div>
    </section>
  );
}
