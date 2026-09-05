"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Onthul } from "@/components/beweging/Onthul";
import { TekstOnthul } from "@/components/beweging/TekstOnthul";
import { Magnetisch } from "@/components/beweging/Magnetisch";
import { useOpeningVertraging } from "@/components/beweging/useOpening";
import { curve, duur } from "@/lib/beweging";

/**
 * De hero: de eerste vijf seconden van de site.
 *
 * De opbouw is er een van lagen, en die volgorde is het hele idee. Achteraan
 * een foto van de club die traag inzoomt, daarboven twee verlopen die het
 * beeld naar de onderkant toe in het donker laten lopen, dan een korrel om de
 * banden uit het verloop te halen, en pas vooraan de tekst. Dat geeft diepte
 * zonder dat er ook maar iets in 3D hoeft te zijn.
 *
 * Bij het scrollen zakt de tekst iets trager weg dan de pagina en vervaagt ze,
 * terwijl de foto erachter juist iets meekomt. Twee lagen die uit elkaar
 * schuiven: dat is wat het scrollen zwaar en filmisch maakt, en het kost twee
 * transformaties.
 *
 * De hoogte is 82% van het scherm en niet het volle scherm. Dat is bewust:
 * de rand van de wedstrijdsectie eronder blijft net zichtbaar, en niets
 * nodigt zo goed uit tot scrollen als iets dat half in beeld staat. Een hero
 * die precies het scherm vult, ziet eruit als het einde van de pagina.
 */
export function HeroSection() {
  const anker = useRef<HTMLElement>(null);
  const minderBeweging = useReducedMotion();

  // Wacht op het openingsdoek, als dat er is.
  const wacht = useOpeningVertraging();

  const { scrollYProgress } = useScroll({
    target: anker,
    offset: ["start start", "end start"],
  });

  // De tekst zakt weg en vervaagt terwijl je voorbijscrollt, de foto komt een
  // stuk minder ver mee. Het verschil tussen de twee is de diepte.
  const tekstY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const tekstDekking = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const beeldY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const beeldSchaal = useTransform(scrollYProgress, [0, 1], [1.08, 1.16]);

  const stil = minderBeweging;

  return (
    <section
      ref={anker}
      className="korrel relative flex min-h-[82svh] items-center overflow-hidden bg-inkt-950 py-24 md:py-0"
    >
      {/* Laag 1: de club zelf, ver naar achteren geduwd. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={stil ? undefined : { y: beeldY, scale: beeldSchaal }}
      >
        <Image
          src="/images/teams/1ste-ploeg-2025.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-center opacity-30"
        />
      </motion.div>

      {/* Laag 2: het licht. Een warme gloed rechtsboven waar het logo komt,
          en een zware voet onderaan zodat de tekst overal leesbaar blijft en
          de sectie naar de volgende toe wegzakt. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_15%,rgba(220,38,38,0.28),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-inkt-950/85 via-inkt-950/60 to-inkt-950"
      />

      {/* Laag 3: de inhoud. */}
      <motion.div
        className="container-custom relative z-10"
        style={stil ? undefined : { y: tekstY, opacity: tekstDekking }}
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
          <div className="text-center lg:text-left">
            <Onthul
              meteen
              richting="op"
              afstand={12}
              vertraging={wacht}
              duurtijd={duur.basis}
            >
              <span className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Stamnummer 03531
                <span className="text-white/25">/</span>
                Sinds 1938
              </span>
            </Onthul>

            <h1 className="heading-display mt-6 text-white">
              <span className="block">
                <TekstOnthul meteen tekst="Meer dan voetbal." vertraging={wacht + 0.12} />
              </span>
              <span className="block text-white/55">
                <TekstOnthul
                  meteen
                  tekst="Een familie sinds 1938."
                  accent="familie"
                  accentClassName="text-primary-500"
                  vertraging={wacht + 0.26}
                />
              </span>
            </h1>

            <Onthul meteen vertraging={wacht + 0.5} duurtijd={duur.lang}>
              <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-white/65 lg:mx-0">
                Vijfentwintig ploegen, ruim driehonderd leden, van de U6 tot de
                veteranen. Wie hier wil voetballen, vindt zijn plek.
              </p>
            </Onthul>

            <Onthul meteen vertraging={wacht + 0.62} duurtijd={duur.lang}>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Magnetisch>
                  <Link href="/ploegen" className="btn-primary group w-full sm:w-auto">
                    Ontdek onze 25 ploegen
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Magnetisch>
                <Magnetisch>
                  <Link
                    href="/clubinfo/sectie?slug=nieuwe-aansluiting"
                    className="btn-secondary w-full border-white/25 text-white hover:border-white/50 hover:bg-white/10 sm:w-auto"
                  >
                    Word lid
                  </Link>
                </Magnetisch>
              </div>
            </Onthul>
          </div>

          {/* Het merk: clublogo en de samenwerking met Zelem. Op een klein
              scherm zou dit de tekst naar beneden duwen tot onder de vouw,
              dus daar valt het weg; het logo staat dan al in de navigatiebalk. */}
          <Onthul
            meteen
            richting="op"
            afstand={20}
            vertraging={wacht + 0.34}
            duurtijd={duur.filmisch}
            className="hidden justify-self-center lg:block"
          >
            <div className="flex flex-col items-center gap-10">
              <motion.div
                className="relative h-56 w-56 xl:h-72 xl:w-72"
                // Nauwelijks merkbaar ademen. Het houdt de hero levend zonder
                // dat er iets gebeurt waar je naar moet kijken.
                animate={stil ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/kwslinkhout-logo.png"
                  alt="KWS Linkhout"
                  fill
                  priority
                  sizes="288px"
                  className="object-contain drop-shadow-[0_8px_40px_rgba(220,38,38,0.35)]"
                />
              </motion.div>

              {/* De samenwerking met Zelem.
                  In het beeldbestand staat "In samenwerking met" in zwarte
                  letters onder de twee schilden, en dat is op deze donkere
                  hero eenvoudigweg onleesbaar. Vandaar dat die strook hier
                  weggesneden wordt en de regel als echte tekst boven de
                  schilden staat: wit, scherp op elk scherm, en meteen ook
                  voorleesbaar. Boven in plaats van onder, want zo loopt de
                  zin door in wat eronder staat. */}
              <div className="flex flex-col items-center gap-3.5">
                <span className="text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-white/60">
                  In samenwerking met
                </span>
                <div
                  className="relative w-72 overflow-hidden xl:w-80"
                  // De verhouding van het beeld zonder de onderste tekstband:
                  // 560 breed bij 230 van de oorspronkelijke 313 hoog.
                  style={{ aspectRatio: "560 / 230" }}
                >
                  <Image
                    src="/images/samenwerking-outline.png"
                    alt="K.W.S. Linkhout en Eendracht Zwart-Wit Zelem"
                    fill
                    priority
                    sizes="320px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </Onthul>
        </div>
      </motion.div>

      {/* De uitnodiging om te scrollen. Een lijn met een lichtpunt dat er
          traag doorheen zakt: rustiger dan een wippend pijltje, en het wijst
          dezelfde kant op. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: wacht + 1, duration: duur.lang, ease: curve.onthul }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-white/45">
          Scroll
        </span>
        <span className="relative block h-12 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-linear-to-b from-transparent to-primary"
            animate={stil ? undefined : { y: [-16, 48] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
