"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Onthul } from "@/components/beweging/Onthul";
import { TekstOnthul } from "@/components/beweging/TekstOnthul";
import { Parallax } from "@/components/beweging/Parallax";
import { GeschiedenisButton } from "./HistoryModal";
import { duur } from "@/lib/beweging";

/**
 * Het verhaal van de club, met de ploegfoto ernaast.
 *
 * De compositie rechts bestaat uit drie lagen die elk een andere snelheid
 * hebben bij het scrollen: het rode vlak achteraan komt het traagst mee, de
 * foto zit ertussen, en het kaartje met het jaartal vooraan loopt het hardst.
 * Dat is de hele parallax van deze sectie, en samen zijn de uitersten
 * nauwelijks veertig pixels. Genoeg om ruimte te suggereren, te weinig om op
 * te merken als effect.
 *
 * De kop kwam hier vroeger letter voor letter binnen, als een typemachine.
 * Dat is vervangen door een onthulling per woord: even speels, maar zonder
 * de seconden wachten voor de zin er staat, en zonder dat de regel eronder
 * blijft verspringen terwijl er getypt wordt.
 */
export function AboutSection() {
  return (
    <section className="section-padding overflow-hidden bg-white">
      <div className="container-custom">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Het verhaal. */}
          <div>
            <Onthul afstand={10} duurtijd={duur.kort}>
              <p className="opschrift">
                <span aria-hidden="true" className="h-px w-6 bg-primary/40" />
                De club
              </p>
            </Onthul>

            <h2 className="heading-1 mt-4">
              <TekstOnthul tekst="Een club met een hart" accent="hart" />
              <Onthul
                als="span"
                richting="geen"
                vertraging={0.55}
                duurtijd={duur.kort}
                className="ml-3 inline-block align-middle"
              >
                <Heart
                  className="h-7 w-7 fill-primary text-primary md:h-9 md:w-9"
                  aria-hidden="true"
                />
              </Onthul>
            </h2>

            <Onthul vertraging={0.1} duurtijd={duur.lang}>
              <p className="text-body mt-7">
                Bij KWS Linkhout draait het niet alleen om voetbal. Het gaat om
                vriendschap, respect en samen groeien. Van onze jongste
                U6-spelers tot onze veteranen: iedereen telt mee.
              </p>
            </Onthul>

            <Onthul vertraging={0.18} duurtijd={duur.lang}>
              <p className="text-body mt-5">
                Met 25 ploegen, waaronder zes dames- en meisjesploegen, is er
                voor ieder wat wils. Kom eens langs en ervaar de sfeer zelf.
              </p>
            </Onthul>

            <Onthul vertraging={0.26}>
              <div className="mt-9">
                <GeschiedenisButton />
              </div>
            </Onthul>
          </div>

          {/* De ploegfoto, in lagen. */}
          <Onthul richting="links" afstand={40} duurtijd={duur.filmisch}>
            <div className="relative">
              {/* Achteraan: een rood vlak dat schuin achter de foto uitsteekt.
                  Het geeft de compositie een schaduw met kleur in plaats van
                  grijs, en het vult de hoek die de gekantelde foto openlaat. */}
              <Parallax kracht={22} className="absolute -inset-5">
                <div
                  aria-hidden="true"
                  className="h-full w-full rotate-3 rounded-4xl bg-primary/10"
                />
              </Parallax>

              {/* De foto zelf, licht gekanteld. Bij het aanwijzen komt ze
                  recht te hangen: een klein beloninkje voor wie er met de
                  muis overheen gaat, en het bewijst dat het beeld leeft. */}
              <Parallax kracht={-12} className="relative">
                <div className="-rotate-2 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:rotate-0">
                  <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-opgetild">
                    <Image
                      src="/images/foto-homepage.jpg"
                      alt="De ploegen van KWS Linkhout samen op het veld"
                      width={1089}
                      height={608}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="h-auto w-full rounded-xl"
                    />
                    <p className="py-3 text-center text-sm font-medium text-gray-500">
                      Onze trots: 25 ploegen, 300+ leden
                    </p>
                  </div>
                </div>
              </Parallax>

              {/* Vooraan: het jaartal. De laag die het hardst meekomt, dus die
                  het dichtst bij de kijker lijkt te hangen. */}
              <Parallax
                kracht={-30}
                className="absolute -bottom-6 -left-4 hidden sm:block"
              >
                <div className="rounded-2xl bg-inkt-950 px-6 py-4 shadow-opgetild">
                  <p className="font-display text-3xl font-extrabold leading-none text-white">
                    1938
                  </p>
                  <p className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-white/55">
                    Opgericht
                  </p>
                </div>
              </Parallax>
            </div>
          </Onthul>
        </div>
      </div>
    </section>
  );
}
