"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Expand,
  X,
} from "lucide-react";
import {
  GROEPSFOTO,
  PLOEGEN,
  SEIZOEN,
  type VoorstellingPloeg,
} from "./ploegen";

/**
 * De ploegvoorstelling als fotopagina.
 *
 * Geen raster met kleine prentjes: elke ploeg krijgt een eigen scherm, als een
 * affiche. De ploegnaam staat reuzegroot en hol achter de foto en schuift
 * mee terwijl je scrolt; de foto komt scheef binnen en legt zich recht. De
 * pagina opent en sluit met de foto waar iedereen samen op staat.
 *
 * Een klik op een foto opent hem schermvullend, met pijltjes (ook op het
 * toetsenbord) om door alle ploegen te bladeren.
 */

/** Alle foto's op een rij voor het schermvullende beeld; de groepsfoto eerst. */
const BEELDEN = [
  { src: GROEPSFOTO, titel: "De hele jeugd", onder: `Seizoen ${SEIZOEN}` },
  ...PLOEGEN.map((p) => ({
    src: p.foto,
    titel: p.naam,
    onder: p.reeksen.join(" · "),
  })),
];

/** Tekst met enkel een omlijning, voor de reuzenletters op de achtergrond. */
const HOL = {
  WebkitTextStroke: "1.5px rgb(255 255 255 / 0.16)",
  color: "transparent",
} as const;

function Poster({
  ploeg,
  nummer,
  links,
  onOpen,
}: {
  ploeg: VoorstellingPloeg;
  nummer: number;
  /** Staat de foto links? Wisselt per ploeg, zodat de pagina niet eentonig wordt. */
  links: boolean;
  onOpen: () => void;
}) {
  const anker = useRef<HTMLElement>(null);
  const stil = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: anker,
    offset: ["start end", "end start"],
  });
  // De reuzenletters schuiven tegen de scrolrichting in: dat geeft diepte.
  const ruw = useTransform(
    scrollYProgress,
    [0, 1],
    links ? ["18%", "-18%"] : ["-18%", "18%"],
  );
  const x = useSpring(ruw, { stiffness: 70, damping: 24, mass: 0.4 });

  return (
    <section
      ref={anker}
      id={ploeg.code}
      data-ploeg={ploeg.code}
      className="relative scroll-mt-36 overflow-hidden py-16 sm:py-24"
    >
      <motion.p
        aria-hidden="true"
        style={stil ? HOL : { ...HOL, x }}
        className={
          "pointer-events-none absolute top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[38vw] font-black leading-none tracking-tighter sm:text-[30vw] " +
          (links ? "right-[-4vw]" : "left-[-4vw]")
        }
      >
        {ploeg.code}
      </motion.p>

      <div className="container-custom relative grid items-center gap-10 lg:grid-cols-12">
        <motion.button
          type="button"
          onClick={onOpen}
          aria-label={`Foto van ${ploeg.naam} groot bekijken`}
          initial={stil ? false : { opacity: 0, y: 70, rotate: links ? -3 : 3 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "0px 0px -18% 0px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={
            "group relative block w-full lg:col-span-8 " +
            (links ? "" : "lg:order-2")
          }
        >
          {/* Het rode vlak dat achter de foto uitsteekt, zoals een dubbel gedrukte affiche. */}
          <span
            aria-hidden="true"
            className={
              "absolute inset-0 bg-primary transition-transform duration-500 ease-out group-hover:translate-y-4 " +
              (links
                ? "translate-x-3 translate-y-3 group-hover:translate-x-4"
                : "-translate-x-3 translate-y-3 group-hover:-translate-x-4")
            }
          />
          <span className="relative block aspect-[3/2] overflow-hidden bg-inkt-800 ring-1 ring-white/15">
            <Image
              src={ploeg.foto}
              alt={`Ploegfoto ${ploeg.naam} van KWS Linkhout, seizoen ${SEIZOEN}`}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
            <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-4 left-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white/90">
              {String(nummer).padStart(2, "0")} /{" "}
              {String(PLOEGEN.length).padStart(2, "0")}
            </span>
            <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition group-hover:bg-primary">
              <Expand className="h-4 w-4" />
            </span>
          </span>
        </motion.button>

        <motion.div
          initial={stil ? false : { opacity: 0, x: links ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -18% 0px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={
            "lg:col-span-4 " + (links ? "" : "lg:order-1 lg:text-right")
          }
        >
          {/* Bij "U7" zou de code twee keer boven elkaar staan; dan zegt het
              opschrift wat voor ploeg het is. */}
          <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-primary-400">
            {ploeg.naam === ploeg.code ? "Jeugdploeg" : ploeg.code}
          </p>
          <h2 className="mt-2 font-display text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-5xl">
            {ploeg.naam}
          </h2>
          {ploeg.reeksen.length > 0 && (
            <p className="mt-4 text-sm text-white/60">
              {ploeg.reeksen.join(" · ")}
            </p>
          )}
          {ploeg.trainers.length > 0 && (
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              <span className="block text-xs uppercase tracking-[0.2em] text-white/40">
                {ploeg.trainers.length > 1 ? "Trainers" : "Trainer"}
              </span>
              {ploeg.trainers.join(", ")}
            </p>
          )}
          <div
            className={
              "mt-6 flex flex-wrap gap-2 " + (links ? "" : "lg:justify-end")
            }
          >
            {ploeg.paginas.map((pagina) => (
              <Link
                key={pagina.slug}
                href={`/ploegen/${pagina.slug}`}
                className="group/knop inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary hover:bg-primary"
              >
                {pagina.naam}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/knop:-translate-y-0.5 group-hover/knop:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Beeld({
  index,
  onSluit,
  onGa,
}: {
  index: number;
  onSluit: () => void;
  onGa: (naar: number) => void;
}) {
  const beeld = BEELDEN[index];
  const start = useRef<number | null>(null);
  const vorige = useCallback(
    () => onGa((index - 1 + BEELDEN.length) % BEELDEN.length),
    [index, onGa],
  );
  const volgende = useCallback(
    () => onGa((index + 1) % BEELDEN.length),
    [index, onGa],
  );

  useEffect(() => {
    function toets(e: KeyboardEvent) {
      if (e.key === "Escape") onSluit();
      if (e.key === "ArrowLeft") vorige();
      if (e.key === "ArrowRight") volgende();
    }
    window.addEventListener("keydown", toets);
    // De pagina erachter mag niet meescrollen.
    const oud = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", toets);
      document.body.style.overflow = oud;
    };
  }, [onSluit, vorige, volgende]);

  const rond =
    "flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-primary";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={beeld.titel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col bg-black/95"
      onClick={onSluit}
      onTouchStart={(e) => (start.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (start.current === null) return;
        const verschil = e.changedTouches[0].clientX - start.current;
        start.current = null;
        if (Math.abs(verschil) > 60) (verschil > 0 ? vorige : volgende)();
      }}
    >
      <div
        className="flex items-center justify-between gap-4 p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="font-display text-lg font-bold leading-tight">
            {beeld.titel}
          </p>
          {beeld.onder && (
            <p className="text-xs text-white/60">{beeld.onder}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-display text-sm font-bold tabular-nums tracking-[0.2em] text-white/60">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(BEELDEN.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={onSluit}
            aria-label="Sluiten"
            className={rond}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={beeld.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 mx-4 sm:mx-20"
          >
            <Image
              src={beeld.src}
              alt={beeld.titel}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            vorige();
          }}
          aria-label="Vorige foto"
          className={rond + " absolute left-3 top-1/2 -translate-y-1/2"}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            volgende();
          }}
          aria-label="Volgende foto"
          className={rond + " absolute right-3 top-1/2 -translate-y-1/2"}
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      <p className="p-4 text-center text-xs text-white/40">
        Pijltjes of vegen om te bladeren, Esc om te sluiten
      </p>
    </motion.div>
  );
}

export default function PloegvoorstellingClient() {
  const [open, setOpen] = useState<number | null>(null);
  const [actief, setActief] = useState(PLOEGEN[0].code);
  const stil = useReducedMotion();

  // De opening: de groepsfoto zoomt traag uit en zakt weg terwijl je scrolt.
  const kop = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: kop,
    offset: ["start start", "end start"],
  });
  const schaal = useTransform(scrollYProgress, [0, 1], [1.08, 1.25]);
  const zak = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const dim = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Welke ploeg staat er in beeld? Voor de balk waarmee je kan springen.
  // Rechtstreeks uit de scrolpositie: de laatste ploeg waarvan de bovenkant
  // het midden van het scherm voorbij is. Een IntersectionObserver miste dat
  // soms bij snel scrollen, en dan bleef de eerste knop rood.
  useEffect(() => {
    const vakken = [...document.querySelectorAll<HTMLElement>("[data-ploeg]")];
    let wachtend = 0;
    function meet() {
      wachtend = 0;
      const midden = window.innerHeight / 2;
      let nu = vakken[0]?.dataset.ploeg ?? "";
      for (const vak of vakken) {
        if (vak.getBoundingClientRect().top <= midden)
          nu = vak.dataset.ploeg ?? nu;
      }
      setActief(nu);
    }
    function bijScrol() {
      if (!wachtend) wachtend = requestAnimationFrame(meet);
    }
    meet();
    window.addEventListener("scroll", bijScrol, { passive: true });
    window.addEventListener("resize", bijScrol);
    return () => {
      window.removeEventListener("scroll", bijScrol);
      window.removeEventListener("resize", bijScrol);
      if (wachtend) cancelAnimationFrame(wachtend);
    };
  }, []);

  // De actieve knop in de balk in beeld houden.
  const balk = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const knop = balk.current?.querySelector<HTMLElement>(
      `[data-knop="${actief}"]`,
    );
    const houder = balk.current;
    if (knop && houder) {
      houder.scrollTo({
        left: knop.offsetLeft - houder.clientWidth / 2 + knop.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [actief]);

  return (
    <div className="korrel relative bg-inkt-950 text-white">
      {/* ------------------------------------------------------------ opening */}
      <header
        ref={kop}
        className="relative flex min-h-[100svh] items-end overflow-hidden"
      >
        <motion.div
          style={stil ? undefined : { scale: schaal, y: zak }}
          className="absolute inset-0"
        >
          <Image
            src={GROEPSFOTO}
            alt="Alle jeugdspelers en trainers van KWS Linkhout samen voor het doel"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[45%_55%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-inkt-950 via-inkt-950/55 to-inkt-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_15%_100%,rgba(220,38,38,0.35),transparent_70%)]" />

        <motion.div
          style={stil ? undefined : { opacity: dim }}
          className="container-custom relative pb-14 pt-40 sm:pb-20"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-sm font-bold uppercase tracking-[0.35em] text-primary-400"
          >
            Seizoen {SEIZOEN}
          </motion.p>
          <h1 className="mt-4 font-display font-black uppercase leading-[0.82] tracking-tighter">
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="block text-[17vw] sm:text-[13vw] lg:text-[10.5rem]"
            >
              Ploeg
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ WebkitTextStroke: "2px #fff", color: "transparent" }}
              className="block text-[13.5vw] sm:text-[10.5vw] lg:text-[8.5rem]"
            >
              voorstelling
            </motion.span>
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 flex flex-wrap items-end justify-between gap-6"
          >
            <p className="max-w-md text-base leading-relaxed text-white/80">
              {PLOEGEN.length} ploegen, één club. Dit zijn de gezichten van de
              jeugd van KWS Linkhout dit seizoen.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(0)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-inkt-900 transition hover:bg-primary hover:text-white"
              >
                <Expand className="h-4 w-4" />
                Bekijk de groepsfoto
              </button>
              <a
                href={`#${PLOEGEN[0].code}`}
                aria-label="Naar de ploegen"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 transition hover:bg-white/10"
              >
                <ArrowDown className="h-5 w-5 animate-bounce" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* De balk en de ploegen zitten samen in een vak: zo plakt de balk enkel
          zolang de ploegen in beeld zijn, en niet meer over het slot. */}
      <div className="relative">
        {/* -------------------------------------------------- springen naar ploeg */}
        <nav
          aria-label="Spring naar een ploeg"
          className="sticky top-[4.5rem] z-30 border-y border-white/10 bg-inkt-950/85 backdrop-blur-md"
        >
          <div
            ref={balk}
            className="container-custom flex gap-1.5 overflow-x-auto py-3 [scrollbar-width:none]"
          >
            {PLOEGEN.map((p) => (
              <a
                key={p.code}
                href={`#${p.code}`}
                data-knop={p.code}
                className={
                  "shrink-0 rounded-full px-4 py-1.5 font-display text-sm font-bold tracking-wide transition " +
                  (actief === p.code
                    ? "bg-primary text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white")
                }
              >
                {p.code}
              </a>
            ))}
          </div>
        </nav>

        {/* --------------------------------------------------------- de ploegen */}
        {PLOEGEN.map((ploeg, i) => (
          <Poster
            key={ploeg.code}
            ploeg={ploeg}
            nummer={i + 1}
            links={i % 2 === 0}
            onOpen={() => setOpen(i + 1)}
          />
        ))}
      </div>

      {/* -------------------------------------------------------------- slot */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_100%,rgba(220,38,38,0.28),transparent_70%)]" />
        <div className="container-custom relative text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.35em] text-primary-400">
            Allemaal samen
          </p>
          <h2 className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter sm:text-7xl">
            Eén club.{" "}
            <span
              style={{ WebkitTextStroke: "1.5px #fff", color: "transparent" }}
            >
              Eén familie.
            </span>
          </h2>
          <motion.button
            type="button"
            onClick={() => setOpen(0)}
            aria-label="De groepsfoto groot bekijken"
            initial={stil ? false : { opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative mx-auto mt-12 block w-full max-w-6xl"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-y-4 bg-primary"
            />
            <span className="relative block aspect-[3/2] overflow-hidden ring-1 ring-white/15">
              <Image
                src={GROEPSFOTO}
                alt="Alle jeugdspelers en trainers van KWS Linkhout samen"
                fill
                sizes="(max-width: 1280px) 100vw, 1152px"
                className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.03]"
              />
            </span>
          </motion.button>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
            <Link href="/ploegen" className="btn-primary group">
              Alle ploegen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/word-lid"
              className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Zelf meespelen? Word lid
            </Link>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {open !== null && (
          <Beeld index={open} onSluit={() => setOpen(null)} onGa={setOpen} />
        )}
      </AnimatePresence>
    </div>
  );
}
