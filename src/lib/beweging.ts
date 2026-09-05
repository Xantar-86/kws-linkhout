/**
 * Het bewegingssysteem van de site.
 *
 * Alle animatie op kwslinkhout.be put uit dit ene bestand. Niet uit netheid,
 * maar omdat beweging pas duur oogt wanneer ze overal hetzelfde ritme heeft.
 * Twee kaarten die net iets anders vallen, verraden meteen dat er geen systeem
 * achter zit.
 *
 * De vuistregels:
 *
 * - Alles wat verschijnt komt van onderen en vertraagt op het einde. Dat leest
 *   als iets dat neerkomt, niet als iets dat aan komt vliegen.
 * - Hoe groter het element, hoe trager. Een hele sectie mag bijna anderhalve
 *   seconde nemen, een knop hooguit twee tienden.
 * - Beweging is er om de blik te leiden, nooit om te vermaken. Wie twee keer
 *   langs dezelfde sectie scrollt, mag niet twee keer op de animatie moeten
 *   wachten: alles speelt eenmalig.
 * - Wie in zijn systeem minder beweging vraagt, krijgt de hele site zonder
 *   verplaatsing. Zie MotionConfig in app/layout.tsx.
 */

/** Een bezier-curve zoals framer-motion ze verwacht. */
export type Curve = [number, number, number, number];

/**
 * De versnellingscurven. Vier stuks, meer heeft een site niet nodig.
 */
export const curve = {
  /**
   * De werkpaardcurve: vertrekt meteen, landt zacht. Voor zowat alles wat in
   * beeld komt.
   */
  onthul: [0.22, 1, 0.36, 1] as Curve,

  /**
   * Trager en dieper. Voor het grote werk: de hero, het openingsgordijn, een
   * sectie die zich in haar geheel toont.
   */
  diep: [0.16, 1, 0.3, 1] as Curve,

  /**
   * Symmetrisch, versnelt en vertraagt. Voor iets dat zich verplaatst van A
   * naar B en op beide punten bestaat: een balk, een lade, een menu.
   */
  strak: [0.65, 0, 0.35, 1] as Curve,

  /**
   * Het omgekeerde van onthul: begint traag en trekt weg. Alleen voor dingen
   * die verdwijnen, want verdwijnen mag altijd sneller dan verschijnen.
   */
  weg: [0.55, 0, 1, 0.45] as Curve,
};

/**
 * Duurtijden in seconden. Een kleine, vaste ladder, zodat er nooit een losse
 * 0.37 in de code sluipt.
 */
export const duur = {
  /** Kleur- en schaduwwissels bij aanwijzen. Onder de tweehonderdste voelt het instant. */
  tik: 0.18,
  /** Een knop, een badge, een icoon dat van vorm verandert. */
  kort: 0.32,
  /** De standaard: een kaart, een alinea, een beeld dat in beeld komt. */
  basis: 0.55,
  /** Een kop, een sectiehoofding, iets waar de blik even bij blijft. */
  lang: 0.9,
  /** Het grote gebaar. Hero en gordijn, en verder niets. */
  filmisch: 1.4,
};

/**
 * Hoeveel pixels iets aflegt terwijl het verschijnt. Klein houden: een
 * element dat honderd pixels ver komt vliegen leest als een animatie, een
 * element dat er vierentwintig aflegt leest als aandacht.
 */
export const verzet = {
  klein: 12,
  basis: 28,
  groot: 56,
};

/**
 * Het tijdsverschil tussen twee opeenvolgende kinderen. Net genoeg om een
 * volgorde te laten voelen, te weinig om op te moeten wachten.
 */
export const trap = {
  woord: 0.045,
  kaart: 0.08,
  blok: 0.12,
};

/**
 * Veren, voor beweging die op een aanwijzer reageert. Een veer klopt daar
 * beter dan een curve: ze houdt rekening met de snelheid die er al was.
 */
export const veer = {
  /** Volgt de muis met merkbare naloop. Voor de cursorring. */
  traag: { type: "spring" as const, stiffness: 140, damping: 20, mass: 0.6 },
  /** Kleeft dichter aan. Voor magnetische knoppen. */
  magneet: { type: "spring" as const, stiffness: 260, damping: 24, mass: 0.5 },
  /** Kort en beslist, zonder na te wiebelen. Voor iets dat opengaat. */
  knap: { type: "spring" as const, stiffness: 380, damping: 30 },
};

/**
 * Wanneer een sectie als "in beeld" telt.
 *
 * De ondermarge betekent: pas meetellen als het element ruim twaalf procent
 * van het scherm binnen is. Zo start de animatie niet al terwijl de sectie nog
 * onder de vouw hangt, en is ze klaar tegen dat de bezoeker echt kijkt.
 *
 * `once` staat vast aan: een tweede keer langsscrollen hoort niets meer te
 * doen.
 */
export const kijk = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * De standaardovergang voor iets dat in beeld komt.
 */
export const overgang = {
  duration: duur.basis,
  ease: curve.onthul,
};

/**
 * Varianten die op meerdere plaatsen terugkeren.
 *
 * Een ouder met `groep` en kinderen met `lid` geeft de trapsgewijze opkomst
 * van een rij kaarten, zonder per kaart een vertraging te moeten uitrekenen.
 */
export const varianten = {
  /** Zet op de container van een rij of raster. */
  groep: (vertraging = 0, tussentijd = trap.kaart) => ({
    verborgen: {},
    zichtbaar: {
      transition: { delayChildren: vertraging, staggerChildren: tussentijd },
    },
  }),

  /** Zet op elk kind binnen zo'n groep. */
  lid: {
    verborgen: { opacity: 0, y: verzet.basis },
    zichtbaar: {
      opacity: 1,
      y: 0,
      transition: { duration: duur.basis, ease: curve.onthul },
    },
  },

  /** Een enkel blok dat op zichzelf opkomt. */
  blok: {
    verborgen: { opacity: 0, y: verzet.basis },
    zichtbaar: {
      opacity: 1,
      y: 0,
      transition: { duration: duur.lang, ease: curve.onthul },
    },
  },
};
