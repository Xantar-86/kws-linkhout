"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { getTeamsByCategory } from "@/lib/teams";
import { curve, duur, trap, veer } from "@/lib/beweging";

/**
 * De navigatiebalk.
 *
 * Drie dingen zijn hier wezenlijk veranderd ten opzichte van de vorige versie.
 *
 * 1. De uitklapmenu's werken nu ook zonder muis. Ze openden alleen op
 *    `onMouseEnter`, en dat betekende dat wie met de tab-toets navigeert
 *    nooit bij de ploegen, de jeugdpagina's of het medische gedeelte kwam.
 *    Dat is geen verfraaiing maar een gat: op een dropdown na was de halve
 *    site onbereikbaar. Nu openen ze bij het aanwijzen én bij het krijgen van
 *    focus, Escape sluit ze, en een klik ergens anders ook.
 *
 * 2. De balk is doorzichtig boven de hero en wordt wit zodra je scrollt. Dat
 *    laat de hero over zijn volle hoogte werken in plaats van dat er een rood
 *    blok bovenop staat.
 *
 * 3. De balk schuift weg als je naar beneden leest en komt terug zodra je
 *    omhoog gaat. Dat geeft de inhoud het volle scherm zonder dat de
 *    navigatie ooit ver weg is. Ze blijft wel staan zolang er een menu
 *    openstaat, want een balk die onder je handen wegschuift terwijl je in
 *    een uitklapmenu zit, is stuk.
 */

const navItems = [
  { name: "Home", href: "/", alleenMobiel: true },
  {
    name: "Senioren",
    href: "/ploegen#senioren",
    dropdown: getTeamsByCategory("senioren").map((team) => ({
      name: team.name,
      href: `/ploegen/team?slug=${team.slug}`,
    })),
  },
  {
    name: "Dames/Meisjes",
    href: "/ploegen#dames",
    dropdown: [
      { name: "Over ons", href: "/ploegen/dames-over-ons" },
      ...getTeamsByCategory("dames").map((team) => ({
        name: team.name,
        href: `/ploegen/team?slug=${team.slug}`,
      })),
    ],
  },
  {
    name: "Jeugdploegen",
    href: "/ploegen#jeugd",
    dropdown: getTeamsByCategory("jeugd").map((team) => ({
      name: team.name,
      href: `/ploegen/team?slug=${team.slug}`,
    })),
  },
  {
    name: "Nieuws",
    href: "/nieuws",
    dropdown: [
      { name: "Laatste Nieuws", href: "/nieuws" },
      { name: "Berichten", href: "/berichten" },
      { name: "Evenementen", href: "/nieuws/events" },
      { name: "Nieuwsbrief", href: "/nieuwsbrief" },
      { name: "In de Krant", href: "/in-de-krant" },
    ],
  },
  {
    name: "Jeugd",
    href: "/jeugdopleiding",
    dropdown: [
      { name: "Overzicht", href: "/jeugdopleiding" },
      { name: "Trainingsschema", href: "/jeugdopleiding/trainingsschema-25-26" },
      { name: "Opleidingsvisie VFV", href: "/jeugdopleiding/opleidingsvisie-vfv" },
      { name: "Opleidingsplan", href: "/jeugdopleiding/opleidingsplan" },
      { name: "Fair Play", href: "/jeugdopleiding/fair-play" },
      { name: "Panathlon Charter", href: "/jeugdopleiding/panathloncharter" },
      { name: "Anti-Racisme", href: "/jeugdopleiding/charter-anti-racisme" },
      { name: "Foot Pass", href: "/jeugdopleiding/foot-pass" },
      { name: "Ondersteuning lidgeld", href: "/jeugdopleiding/lidgeld-ondersteuning" },
    ],
  },
  {
    name: "Medisch",
    href: "/medisch",
    dropdown: [
      { name: "Voorstelling", href: "/medisch" },
      { name: "Voetbalongeval", href: "/medisch/voetbalongeval" },
      { name: "Medische Omkadering", href: "/medisch/medische-omkadering" },
      { name: "EHBO", href: "/medisch/ehbo" },
      { name: "Reanimatie & Defibrillator", href: "/medisch/reanimatie-defibrillator" },
      { name: "Veilig Vervoer Kinderen", href: "/medisch/veilig-vervoer-kinderen" },
      { name: "Voeding", href: "/medisch/voeding" },
      { name: "Alcohol", href: "/medisch/alcohol" },
    ],
  },
  {
    name: "Clubinfo",
    href: "/clubinfo",
    dropdown: [
      { name: "Missie & Visie", href: "/clubinfo/sectie?slug=missie-visie" },
      { name: "Huishoudelijk Reglement", href: "/clubinfo/sectie?slug=huishoudelijk-reglement" },
      { name: "API (Integriteit)", href: "/clubinfo/sectie?slug=api" },
      { name: "Organigram", href: "/clubinfo/sectie?slug=organigram" },
      { name: "Nieuwe Aansluiting", href: "/clubinfo/sectie?slug=nieuwe-aansluiting" },
      { name: "Privacyverklaring", href: "/clubinfo/sectie?slug=privacyverklaring" },
    ],
  },
  { name: "Foto's", href: "/fotos" },
  { name: "Contact", href: "/contact" },
];

type NavItem = (typeof navItems)[number];

/** De pagina's waarboven de balk doorzichtig mag beginnen: die met een donkere hero. */
const DONKERE_KOP = ["/"];

function NavDropdown({
  item,
  open,
  zetOpen,
  licht,
  actief,
}: {
  item: NavItem;
  open: boolean;
  zetOpen: (naam: string | null) => void;
  licht: boolean;
  actief: boolean;
}) {
  const omhulsel = useRef<HTMLDivElement>(null);

  const kleur = licht
    ? "text-white/80 hover:text-white"
    : "text-gray-600 hover:text-gray-900";
  const kleurActief = licht ? "text-white" : "text-gray-900";

  if (!("dropdown" in item) || !item.dropdown) {
    return (
      <Link
        href={item.href}
        className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
          actief ? kleurActief : kleur
        }`}
      >
        {item.name}
        {actief && <Streep licht={licht} />}
      </Link>
    );
  }

  return (
    <div
      ref={omhulsel}
      className="relative"
      onMouseEnter={() => zetOpen(item.name)}
      onMouseLeave={() => zetOpen(null)}
      // Focus binnen de groep opent het menu, focus die de groep verlaat
      // sluit het. Dat is wat de tab-toets nodig heeft: `onFocus` en `onBlur`
      // borrelen op vanuit de kinderen, dus dit dekt zowel de knop als alle
      // links in het uitklapmenu.
      onFocus={() => zetOpen(item.name)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) zetOpen(null);
      }}
    >
      <Link
        href={item.href}
        aria-expanded={open}
        className={`relative flex items-center gap-1 py-2 text-sm font-medium transition-colors duration-200 ${
          actief || open ? kleurActief : kleur
        }`}
      >
        {item.name}
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
        {actief && <Streep licht={licht} />}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: duur.tik, ease: curve.onthul }}
            // De oorsprong bovenaan: het menu groeit uit de knop waar het bij
            // hoort, niet uit zijn eigen midden.
            style={{ transformOrigin: "top left" }}
            className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-xl border border-zand-200 bg-white shadow-zwevend"
          >
            <div className="max-h-[70vh] overflow-y-auto py-1.5">
              {item.dropdown.map((sub) => (
                <Link
                  key={sub.name}
                  href={sub.href}
                  onClick={() => zetOpen(null)}
                  className="block px-4 py-2.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-primary-50 hover:text-primary"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Het streepje onder het huidige onderdeel. */
function Streep({ licht }: { licht: boolean }) {
  return (
    <motion.span
      layoutId="nav-streep"
      transition={veer.knap}
      className={`absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full ${
        licht ? "bg-white" : "bg-primary"
      }`}
    />
  );
}

export function Header() {
  const pad = usePathname();
  const [mobielOpen, setMobielOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [gescrold, setGescrold] = useState(false);
  const [verborgen, setVerborgen] = useState(false);

  const { scrollY } = useScroll();
  const vorigeScroll = useRef(0);

  // Boven een donkere hero begint de balk doorzichtig; op alle andere
  // pagina's staat hij meteen wit, want daar zou witte tekst op wit vallen.
  const overDonkereKop = DONKERE_KOP.includes(pad);
  const licht = overDonkereKop && !gescrold;

  useMotionValueEvent(scrollY, "change", (huidig) => {
    const vorige = vorigeScroll.current;
    vorigeScroll.current = huidig;

    setGescrold(huidig > 24);

    // Een menu dat openstaat houdt de balk vast: wegschuiven onder een open
    // uitklapmenu zou het menu meesleuren.
    if (mobielOpen || openMenu) {
      setVerborgen(false);
      return;
    }

    // De drempel van acht pixels vangt het trillen van een trackpad op.
    // Zonder zou de balk bij elke kleine tegenbeweging terugspringen.
    if (Math.abs(huidig - vorige) < 8) return;

    // Boven de hoogte van de balk zelf nooit verbergen: daar hoort hij
    // gewoon te staan.
    setVerborgen(huidig > vorige && huidig > 160);
  });

  // Escape sluit wat er openstaat. Verwachte werking van elk menu, en de
  // enige uitweg voor wie geen muis heeft om ergens anders mee te klikken.
  useEffect(() => {
    function opToets(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setMobielOpen(false);
    }
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
  }, []);

  // Bij een paginawissel gaat alles dicht. Zonder dit blijft het mobiele menu
  // openstaan over de nieuwe pagina heen.
  //
  // Dit gebeurt tijdens het tekenen en niet in een effect. Een effect zou pas
  // afgaan nadat de nieuwe pagina al met een openstaand menu op het scherm
  // heeft gestaan, en dan zie je het menu een beeldje lang dichtklappen. React
  // beveelt voor precies dit geval aan om de state aan te passen terwijl je
  // tekent: het merkt de wijziging op en tekent opnieuw voor er iets zichtbaar
  // wordt.
  const [vorigPad, setVorigPad] = useState(pad);
  if (pad !== vorigPad) {
    setVorigPad(pad);
    setMobielOpen(false);
    setOpenMenu(null);
  }

  // Zolang het mobiele menu openstaat, ligt de pagina eronder stil.
  useEffect(() => {
    if (!mobielOpen) return;
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = vorige;
    };
  }, [mobielOpen]);

  const isActief = (href: string) => {
    const kaal = href.split("#")[0].split("?")[0];
    if (kaal === "/") return pad === "/";
    return pad === kaal || pad.startsWith(`${kaal}/`);
  };

  return (
    <motion.header
      animate={{ y: verborgen ? "-100%" : "0%" }}
      transition={{ duration: duur.kort, ease: curve.strak }}
      // De negatieve ondermarge is wat de doorzichtige balk mogelijk maakt.
      // Een `sticky` element blijft namelijk gewoon ruimte innemen in de
      // pagina, dus zonder dit stond de balk bóven de hero in plaats van
      // eroverheen: een witte strook met witte tekst erop, en dus een
      // navigatie die nergens te bekennen was. Met de marge weggerekend valt
      // de hero eronderdoor en ligt de balk er echt overheen. Alleen op
      // pagina's met een donkere kop, want elders hoort de balk gewoon zijn
      // plaats in te nemen.
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        overDonkereKop ? "-mb-20" : ""
      } ${
        gescrold || mobielOpen
          ? "border-b border-zand-200/80 bg-white/85 backdrop-blur-xl"
          : overDonkereKop
            ? "bg-transparent"
            : "border-b border-zand-200/80 bg-white"
      }`}
    >
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 items-center" aria-label="KWS Linkhout, naar de startpagina">
            <div className="relative h-14 w-14 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 lg:h-16 lg:w-16">
              <Image
                src="/images/kwslinkhout-logo.png"
                alt="KWS Linkhout"
                fill
                sizes="64px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex">
            {navItems
              .filter((item) => !("alleenMobiel" in item && item.alleenMobiel))
              .map((item) => (
                <NavDropdown
                  key={item.name}
                  item={item}
                  open={openMenu === item.name}
                  zetOpen={setOpenMenu}
                  licht={licht}
                  actief={isActief(item.href)}
                />
              ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* De enige knop in de balk, en meteen het doel van de hele site.
                Vanaf de grote schermen, want daaronder is de ruimte op. */}
            <Link
              href="/clubinfo/sectie?slug=nieuwe-aansluiting"
              className={`hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 lg:inline-flex ${
                licht
                  ? "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm hover:bg-white/20"
                  : "bg-primary text-white hover:bg-primary-700 hover:shadow-blad"
              }`}
            >
              Word lid
            </Link>

            <button
              type="button"
              onClick={() => setMobielOpen((open) => !open)}
              aria-expanded={mobielOpen}
              aria-label={mobielOpen ? "Menu sluiten" : "Menu openen"}
              className={`rounded-lg p-2 transition-colors duration-200 xl:hidden ${
                licht && !mobielOpen
                  ? "text-white hover:bg-white/15"
                  : "text-gray-700 hover:bg-zand-100"
              }`}
            >
              {mobielOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobielOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: duur.kort, ease: curve.strak }}
            className="overflow-hidden border-t border-zand-200 bg-white xl:hidden"
          >
            <motion.nav
              initial="verborgen"
              animate="zichtbaar"
              variants={{
                zichtbaar: { transition: { staggerChildren: trap.woord } },
              }}
              className="container-custom max-h-[calc(100svh-5rem)] overflow-y-auto py-4 pb-10"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  variants={{
                    verborgen: { opacity: 0, x: -8 },
                    zichtbaar: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: duur.kort, ease: curve.onthul },
                    },
                  }}
                  className="border-b border-zand-100 py-1 last:border-0"
                >
                  <Link
                    href={item.href}
                    className={`block py-3 font-semibold ${
                      isActief(item.href) ? "text-primary" : "text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Link>

                  {"dropdown" in item && item.dropdown && (
                    <div className="ml-1 grid gap-0.5 border-l-2 border-zand-200 pb-3 pl-4">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="py-2 text-sm text-gray-600"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              <Link
                href="/clubinfo/sectie?slug=nieuwe-aansluiting"
                className="btn-primary mt-6 w-full"
              >
                Word lid
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
