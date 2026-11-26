/**
 * De vragen van de halfjaarlijkse evaluatie, voor trainer, speler en ouders.
 *
 * Gebaseerd op het clubformulier U13-U17, de nieuwe voorstellen en de
 * opbouw van het POP/PAP van RC Hades. Dubbels zijn samengevoegd:
 * - "Eerste baltoets" zit in balcontrole en aanname.
 * - "Coördinatie en duelkracht" is gesplitst in twee vragen.
 * - De persoonlijkheidsscores van Hades zitten in de mentale vragen van de
 *   trainer (motivatie, druk, leergierig, orde, sociaal, communicatie).
 * - "Coaching van de verdediging" bij keepers zit in communicatie op het veld.
 * - De zelfscore per domein (Hades) valt weg: de speler scoort dezelfde
 *   onderdelen als de trainer, zodat ze naast elkaar kunnen staan.
 * - Werkpunten, het doel voor het volgende halfjaar en het actieplan zijn
 *   één lijst van maximaal drie werkpunten, die bij de volgende evaluatie
 *   bovenaan staan om op te volgen.
 * - De vier spelfases zitten in de tactische vragen.
 * - "Wat merkt ge thuis" en "wat moet de trainer weten" zijn één vraag.
 *
 * De ids blijven altijd dezelfde: oude antwoorden hangen eraan vast. Een
 * vraag weghalen mag, een id hergebruiken voor iets anders niet.
 */

export type Groep = "jong" | "midden" | "oud";
export type EvalRol = "trainer" | "speler" | "ouders";

const A: Groep[] = ["jong", "midden", "oud"];
const J: Groep[] = ["jong"];
const M: Groep[] = ["midden", "oud"];
const O: Groep[] = ["oud"];

export type Vraag =
  | { id: string; soort: "score"; tekst: string; groepen: Groep[]; keeper?: "enkel" | "niet"; vergelijk?: string }
  | { id: string; soort: "tekst"; tekst: string; groepen: Groep[]; hint?: string; vertrouwelijk?: boolean; regels?: number }
  | { id: string; soort: "posities"; tekst: string; groepen: Groep[]; hint?: string }
  | { id: string; soort: "taken"; tekst: string; groepen: Groep[] }
  | { id: string; soort: "werkpunten"; tekst: string; groepen: Groep[]; hint?: string };

export type Rubriek = { id: string; titel: string; uitleg?: string; domein?: string; opmerking?: boolean; vragen: Vraag[] };

/** Groep volgens de ploeg: tot U9 jong, U10 tot U12 midden, vanaf U13 oud. */
export function groepVanPloeg(kort: string | undefined): Groep {
  const n = Number(kort?.match(/U\s?0*(\d+)/i)?.[1] ?? 13);
  return n <= 9 ? "jong" : n <= 12 ? "midden" : "oud";
}

export const GROEP_NAAM: Record<Groep, string> = { jong: "U6 tot U9", midden: "U10 tot U12", oud: "U13 tot U17" };

// ---------------------------------------------------------------------------
// Trainer

export const TRAINER: Rubriek[] = [
  {
    id: "techniek",
    titel: "Techniek",
    domein: "Techniek",
    opmerking: true,
    vragen: [
      { id: "t1", soort: "score", tekst: "Balcontrole, aanname en eerste baltoets", groepen: A },
      { id: "t2", soort: "score", tekst: "Passing, kort en lang", groepen: A },
      { id: "t3", soort: "score", tekst: "Dribbelen en 1-tegen-1", groepen: A },
      { id: "t4", soort: "score", tekst: "Afwerking", groepen: A, keeper: "niet" },
      { id: "t6", soort: "score", tekst: "Tweevoetigheid (links en rechts)", groepen: A },
      { id: "t7", soort: "score", tekst: "Kopspel", groepen: O, keeper: "niet" },
      { id: "t8", soort: "score", tekst: "Verdedigen in 1-tegen-1 (bal afpakken)", groepen: M, keeper: "niet" },
    ],
  },
  {
    id: "keeper",
    titel: "Keeper",
    domein: "Keeper",
    opmerking: true,
    vragen: [
      { id: "g1", soort: "score", tekst: "Vangen en klemmen", groepen: A, keeper: "enkel" },
      { id: "g2", soort: "score", tekst: "Positiekeuze en uitkomen", groepen: M, keeper: "enkel" },
      { id: "g3", soort: "score", tekst: "Duiken en vallen", groepen: A, keeper: "enkel" },
      { id: "g4", soort: "score", tekst: "Voetenwerk, uittrap en uitworp", groepen: M, keeper: "enkel" },
    ],
  },
  {
    id: "tactiek",
    titel: "Tactiek",
    domein: "Tactiek",
    opmerking: true,
    vragen: [
      { id: "k6", soort: "score", tekst: "Samenspel: speelt de bal af aan een ploegmaat", groepen: J },
      { id: "k1", soort: "score", tekst: "Spelinzicht en keuzes aan de bal", groepen: M },
      { id: "k2", soort: "score", tekst: "Positiespel en vrijlopen bij balbezit", groepen: M },
      { id: "k3", soort: "score", tekst: "Ruimte herkennen en benutten", groepen: O },
      { id: "k4", soort: "score", tekst: "Omschakelen bij balverlies en balwinst", groepen: M },
      { id: "k5", soort: "score", tekst: "Verdedigend positiespel: druk zetten en dekken", groepen: M },
    ],
  },
  {
    id: "fysiek",
    titel: "Fysiek",
    domein: "Fysiek",
    opmerking: true,
    vragen: [
      { id: "f4", soort: "score", tekst: "Motoriek: lopen, springen, evenwicht", groepen: J },
      { id: "f1", soort: "score", tekst: "Snelheid (start- en loopsnelheid)", groepen: A },
      { id: "f2", soort: "score", tekst: "Uithouding en wendbaarheid", groepen: M },
      { id: "f3a", soort: "score", tekst: "Coördinatie", groepen: M },
      { id: "f3b", soort: "score", tekst: "Duelkracht", groepen: M },
    ],
  },
  {
    id: "mentaal",
    titel: "Mentaal en persoonlijkheid",
    domein: "Mentaal",
    opmerking: true,
    vragen: [
      { id: "m1", soort: "score", tekst: "Inzet en motivatie op training", groepen: A },
      { id: "m2", soort: "score", tekst: "Concentratie en omgaan met druk in de wedstrijd", groepen: M },
      { id: "m3", soort: "score", tekst: "Zelfvertrouwen en doorzettingsvermogen", groepen: A },
      { id: "m4", soort: "score", tekst: "Coachbaarheid en leergierigheid", groepen: A },
      { id: "m7", soort: "score", tekst: "Teamspirit en sociale vaardigheden", groepen: A },
      { id: "m5", soort: "score", tekst: "Fair play, omgaan met winst en verlies", groepen: A },
      { id: "m6", soort: "score", tekst: "Zelfstandigheid, orde en stiptheid (op tijd, materiaal in orde)", groepen: M },
      { id: "m8", soort: "score", tekst: "Verantwoordelijkheid en initiatief", groepen: O },
      { id: "m9", soort: "score", tekst: "Communicatie en coaching op het veld", groepen: O },
    ],
  },
  {
    id: "posities",
    titel: "Posities",
    vragen: [
      {
        id: "pos",
        soort: "posities",
        tekst: "Waar komt de speler het best tot zijn recht?",
        groepen: M,
        hint: "Tik de posities aan, de belangrijkste eerst.",
      },
      { id: "taken", soort: "taken", tekst: "Taken op de hoofdpositie", groepen: O },
    ],
  },
  {
    id: "besluit",
    titel: "Besluit",
    vragen: [
      { id: "p1", soort: "tekst", tekst: "Sterke punten", groepen: A, regels: 3 },
      { id: "p3", soort: "tekst", tekst: "Groeipotentieel en advies van de trainer", groepen: A, regels: 3 },
      {
        id: "wp",
        soort: "werkpunten",
        tekst: "Werkpunten voor het volgende halfjaar",
        groepen: A,
        hint: "Maximaal drie, samen met de speler afgesproken. Bij de volgende evaluatie staan ze bovenaan om op te volgen.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Speler (in ik-taal). `vergelijk` wijst naar de vraag van de trainer die
// hetzelfde meet, voor de vergelijking op de fiche.

export const SPELER: Rubriek[] = [
  {
    id: "bal",
    titel: "Met de bal",
    domein: "Techniek",
    vragen: [
      { id: "s1", soort: "score", tekst: "Ik kan de bal goed aannemen en meenemen", groepen: A, vergelijk: "t1" },
      { id: "s2", soort: "score", tekst: "Mijn passes komen goed aan", groepen: A, vergelijk: "t2" },
      { id: "s3", soort: "score", tekst: "Ik durf een tegenstander uit te dagen", groepen: A, vergelijk: "t3" },
      { id: "s4", soort: "score", tekst: "Ik werk goed af op doel", groepen: A, vergelijk: "t4" },
      { id: "s19", soort: "score", tekst: "Ik speel met links en met rechts", groepen: M, vergelijk: "t6" },
    ],
  },
  {
    id: "ploeg",
    titel: "In de ploeg",
    domein: "Tactiek",
    vragen: [
      { id: "s20", soort: "score", tekst: "Ik speel de bal af naar een ploegmaat", groepen: J, vergelijk: "k6" },
      { id: "s5", soort: "score", tekst: "Ik weet waar ik moet staan en loop me vrij", groepen: M, vergelijk: "k2" },
      { id: "s6", soort: "score", tekst: "Ik schakel snel om als we de bal verliezen of winnen", groepen: O, vergelijk: "k4" },
      { id: "s7", soort: "score", tekst: "Ik ben snel", groepen: A, vergelijk: "f1" },
      { id: "s21", soort: "score", tekst: "Ik hou het lang vol", groepen: M, vergelijk: "f2" },
    ],
  },
  {
    id: "ikzelf",
    titel: "Ikzelf",
    domein: "Mentaal",
    vragen: [
      { id: "s8", soort: "score", tekst: "Ik doe mijn best op elke training", groepen: A, vergelijk: "m1" },
      { id: "s9", soort: "score", tekst: "Ik blijf geconcentreerd tijdens de wedstrijd", groepen: M, vergelijk: "m2" },
      { id: "s10", soort: "score", tekst: "Ik geef niet op als het moeilijk gaat", groepen: A, vergelijk: "m3" },
      { id: "s11", soort: "score", tekst: "Ik luister naar de trainer", groepen: A, vergelijk: "m4" },
      { id: "s22", soort: "score", tekst: "Ik help mijn ploegmaats", groepen: A, vergelijk: "m7" },
      { id: "s12", soort: "score", tekst: "Ik voel me goed in de ploeg", groepen: A },
      { id: "s17", soort: "score", tekst: "Ik ben tevreden over mijn speeltijd", groepen: O },
      { id: "s18", soort: "score", tekst: "Ik slaap genoeg, eet gezond en rust voor een wedstrijd", groepen: O },
    ],
  },
  {
    id: "mijnposities",
    titel: "Mijn posities",
    vragen: [
      { id: "pos", soort: "posities", tekst: "Op welke posities speel ik het liefst?", groepen: M, hint: "Tik aan, je liefste positie eerst." },
      { id: "taken", soort: "taken", tekst: "Hoe doe ik het op mijn hoofdpositie?", groepen: O },
    ],
  },
  {
    id: "doelen",
    titel: "Mijn doelen",
    vragen: [
      { id: "h1", soort: "tekst", tekst: "Wat is mijn doel voor dit seizoen?", groepen: O },
      { id: "h2", soort: "tekst", tekst: "Waar wil ik over twee jaar staan?", groepen: O },
      { id: "h3", soort: "tekst", tekst: "Mijn grote droom als voetballer", groepen: O },
    ],
  },
  {
    id: "woorden",
    titel: "In mijn eigen woorden",
    vragen: [
      { id: "s13", soort: "tekst", tekst: "Waar ben ik goed in, waar ben ik trots op?", groepen: A },
      { id: "s14", soort: "tekst", tekst: "Waar wil ik beter in worden?", groepen: A },
      { id: "s15", soort: "tekst", tekst: "Wat vind ik het leukst aan de training?", groepen: A },
      { id: "s23", soort: "tekst", tekst: "Wat vind ik het minst leuk aan de training?", groepen: A },
      { id: "s16", soort: "tekst", tekst: "Wat zou ik graag anders zien?", groepen: M },
    ],
  },
];

// ---------------------------------------------------------------------------
// Ouders: geen voetbaltechniek, wel hoe het kind zich voelt.

export const OUDERS: Rubriek[] = [
  {
    id: "kind",
    titel: "Hoe gaat het met uw kind",
    vragen: [
      { id: "o1", soort: "score", tekst: "Mijn kind gaat graag naar de training", groepen: A },
      { id: "o2", soort: "score", tekst: "Mijn kind voelt zich goed in de ploeg", groepen: A },
      { id: "o3", soort: "score", tekst: "Mijn kind vertelt thuis positief over trainer en ploeg", groepen: A },
      { id: "o4", soort: "score", tekst: "Ik zie mijn kind groeien, als voetballer en als persoon", groepen: A },
      { id: "o5", soort: "score", tekst: "De combinatie met school en andere hobby's lukt goed", groepen: M },
    ],
  },
  {
    id: "club",
    titel: "Over de club",
    vragen: [
      { id: "o6", soort: "score", tekst: "De communicatie van trainer en club is duidelijk", groepen: A },
      { id: "o7", soort: "score", tekst: "Ik weet bij wie ik terechtkan met een vraag of probleem", groepen: A },
    ],
  },
  {
    id: "woorden",
    titel: "In uw eigen woorden",
    vragen: [
      {
        id: "o8",
        soort: "tekst",
        tekst: "Wat merkt u thuis op, of is er iets wat de trainer moet weten?",
        hint: "Bv. motivatie, vermoeidheid, kleine blessures, drukte op school",
        groepen: A,
      },
      { id: "o9", soort: "tekst", tekst: "Waarin kan uw kind volgens u nog groeien?", groepen: A },
      {
        id: "o11",
        soort: "tekst",
        tekst: "Vraag of opmerking enkel voor de jeugdcoördinator",
        hint: "Dit ziet de trainer niet.",
        groepen: A,
        vertrouwelijk: true,
      },
    ],
  },
];

export const RUBRIEKEN: Record<EvalRol, Rubriek[]> = { trainer: TRAINER, speler: SPELER, ouders: OUDERS };

// ---------------------------------------------------------------------------
// Schalen

export type Schaal = { waarde: number; label: string }[];

export const SCHAAL_TRAINER: Schaal = [
  { waarde: 1, label: "Moet nog veel groeien" },
  { waarde: 2, label: "Groeit" },
  { waarde: 3, label: "Goed" },
  { waarde: 4, label: "Zeer goed" },
  { waarde: 5, label: "Uitstekend" },
];

export const SCHAAL_AKKOORD: Schaal = [
  { waarde: 1, label: "Helemaal niet" },
  { waarde: 2, label: "Eerder niet" },
  { waarde: 3, label: "Soms" },
  { waarde: 4, label: "Meestal" },
  { waarde: 5, label: "Helemaal" },
];

/** Drie gezichtjes voor de jongere spelers; waarden 1, 3 en 5 zodat ze naast de trainer passen. */
export const SCHAAL_SMILEY: Schaal = [
  { waarde: 1, label: "Nog niet zo goed" },
  { waarde: 3, label: "Gaat wel" },
  { waarde: 5, label: "Heel goed" },
];

export function schaal(rol: EvalRol, groep: Groep): { schaal: Schaal; smiley: boolean } {
  if (rol === "trainer") return { schaal: SCHAAL_TRAINER, smiley: false };
  if (rol === "speler" && groep !== "oud") return { schaal: SCHAAL_SMILEY, smiley: true };
  return { schaal: SCHAAL_AKKOORD, smiley: false };
}

// ---------------------------------------------------------------------------
// Posities (veld in 1-4-3-3, met de gebruikelijke nummers) en taken per lijn.
// De taken zijn voor KWS geschreven; de club kan ze vrij aanpassen.

export const VELD: { nr: number; naam: string; x: number; y: number; lijn: string }[] = [
  { nr: 1, naam: "Keeper", x: 50, y: 92, lijn: "keeper" },
  { nr: 2, naam: "Rechtsachter", x: 85, y: 72, lijn: "flank" },
  { nr: 3, naam: "Centrale verdediger rechts", x: 62, y: 76, lijn: "centraal" },
  { nr: 4, naam: "Centrale verdediger links", x: 38, y: 76, lijn: "centraal" },
  { nr: 5, naam: "Linksachter", x: 15, y: 72, lijn: "flank" },
  { nr: 6, naam: "Verdedigende middenvelder", x: 50, y: 58, lijn: "midden" },
  { nr: 8, naam: "Centrale middenvelder", x: 70, y: 46, lijn: "midden" },
  { nr: 10, naam: "Aanvallende middenvelder", x: 30, y: 40, lijn: "tien" },
  { nr: 7, naam: "Rechtsbuiten", x: 84, y: 24, lijn: "buiten" },
  { nr: 11, naam: "Linksbuiten", x: 16, y: 24, lijn: "buiten" },
  { nr: 9, naam: "Spits", x: 50, y: 15, lijn: "spits" },
];

export const LIJNEN: Record<string, { naam: string; balbezit: string[]; balverlies: string[] }> = {
  keeper: {
    naam: "Keeper",
    balbezit: [
      "Speelt kort in naar een vrije verdediger als het kan",
      "Kiest bewust tussen kort en lang inspelen",
      "Is aanspeelbaar bij een terugspeelbal",
      "Brengt de bal snel in het spel na een redding",
    ],
    balverlies: [
      "Staat goed opgesteld tegenover bal en doel",
      "Komt op het juiste moment uit bij diepe ballen en voorzetten",
      "Coacht de verdediging luid en duidelijk",
      "Blijft rustig in een 1-tegen-1 en maakt zich groot",
    ],
  },
  centraal: {
    naam: "Centrale verdediger",
    balbezit: [
      "Maakt het veld breed bij de opbouw",
      "Speelt de bal veilig en snel in naar het middenveld",
      "Durft op te komen met de bal als er ruimte is",
      "Kiest de lange bal als de opbouw dichtzit",
    ],
    balverlies: [
      "Houdt de lijn samen met de andere verdedigers",
      "Dekt de spits kort en wint de duels",
      "Dekt de ruimte achter de andere verdedigers af",
      "Wint de hoge ballen en werkt voorzetten weg",
    ],
  },
  flank: {
    naam: "Flankverdediger",
    balbezit: [
      "Geeft breedte en biedt zich aan langs de zijlijn",
      "Schuift mee in de aanval en overlapt de buitenspeler",
      "Geeft een voorzet of trekt naar binnen op het juiste moment",
      "Speelt veilig in als er druk is",
    ],
    balverlies: [
      "Zet druk op de buitenspeler van de tegenstander",
      "Laat de tegenstander niet binnendoor",
      "Sluit naar binnen aan als de bal aan de andere kant is",
      "Komt snel terug na een aanval",
    ],
  },
  midden: {
    naam: "Middenvelder",
    balbezit: [
      "Biedt zich aan tussen de linies en vraagt de bal",
      "Draait open en speelt vooruit als het kan",
      "Verlegt het spel naar de andere kant",
      "Houdt de bal onder druk en verliest hem niet centraal",
    ],
    balverlies: [
      "Schermt de verdediging af en sluit het midden",
      "Zet meteen druk na balverlies",
      "Wint de tweede ballen",
      "Volgt zijn man mee terug",
    ],
  },
  tien: {
    naam: "Aanvallende middenvelder",
    balbezit: [
      "Zoekt de ruimte tussen middenveld en verdediging van de tegenstander",
      "Geeft de laatste pass of de steekbal",
      "Durft zelf te trappen of in te dribbelen",
      "Loopt mee in het strafschopgebied",
    ],
    balverlies: [
      "Zet als eerste druk op de opbouwende middenvelder",
      "Sluit de passlijn naar de diepe middenvelder af",
      "Werkt mee terug tot op het middenveld",
    ],
  },
  buiten: {
    naam: "Buitenspeler",
    balbezit: [
      "Houdt de breedte en staat klaar voor de diepe bal",
      "Gaat de 1-tegen-1 aan met de flankverdediger",
      "Geeft een voorzet of snijdt naar binnen voor een doelpoging",
      "Loopt in aan de tweede paal bij een voorzet van de andere kant",
    ],
    balverlies: [
      "Zet druk op de flankverdediger van de tegenstander",
      "Sluit de passlijn naar binnen af",
      "Werkt terug om de eigen flankverdediger te helpen",
    ],
  },
  spits: {
    naam: "Spits",
    balbezit: [
      "Vraagt de bal diep en in de voeten",
      "Kaatst en legt af voor opkomende ploegmaats",
      "Kiest een goede plaats in het strafschopgebied",
      "Werkt kansen rustig af",
    ],
    balverlies: [
      "Zet druk op de centrale verdedigers en de keeper",
      "Stuurt de opbouw van de tegenstander naar één kant",
      "Sluit de passlijn naar de verdedigende middenvelder af",
    ],
  },
};

export const TAAK_SCHAAL: Schaal = [
  { waarde: 1, label: "Werkpunt" },
  { waarde: 2, label: "Aandachtspunt" },
  { waarde: 3, label: "In orde" },
];

export function lijnVanNummer(nr: number | undefined): string | undefined {
  return VELD.find((v) => v.nr === nr)?.lijn;
}

// ---------------------------------------------------------------------------
// Antwoorden

export type Opvolging = { tekst: string; status: "gehaald" | "deels" | "niet" | ""; feedback: string };
export type Taken = { lijn: string; scores: Record<string, number> };

/** Zoals de antwoorden in de database staan: per vraag-id een waarde. */
export type Antwoorden = {
  keeper?: boolean;
  scores?: Record<string, number>;
  teksten?: Record<string, string>;
  posities?: number[];
  taken?: Taken;
  werkpunten?: string[];
  opvolging?: Opvolging[];
  opmerkingen?: Record<string, string>;
};

/** Een vraag die de trainer zelf toevoegt aan zijn evaluatie. */
export type EigenVraag = { id: string; rol: EvalRol; soort: "score" | "tekst"; tekst: string };

/**
 * Wat de trainer voor zijn evaluatie koos: per rol de aangevinkte vragen
 * (null = alles) en zijn eigen vragen.
 */
export type Instellingen = { keuze?: Partial<Record<EvalRol, string[]>> | null; eigen?: EigenVraag[] };

/** De rubrieken en vragen die gelden voor deze rol, groep, keeper of niet, en de keuze van de trainer. */
export function zichtbaar(rol: EvalRol, groep: Groep, keeper = false, inst?: Instellingen): Rubriek[] {
  const gekozen = inst?.keuze?.[rol] ? new Set(inst.keuze[rol]) : null;
  const uit = RUBRIEKEN[rol]
    .map((r) => ({
      ...r,
      vragen: r.vragen.filter(
        (v) =>
          v.groepen.includes(groep) &&
          (!gekozen || gekozen.has(v.id)) &&
          !(v.soort === "score" && v.keeper === "enkel" && !keeper) &&
          !(v.soort === "score" && v.keeper === "niet" && keeper),
      ),
    }))
    .filter((r) => r.vragen.length > 0);
  const eigen = (inst?.eigen ?? []).filter((v) => v.rol === rol);
  if (eigen.length) {
    uit.push({
      id: "eigen",
      titel: rol === "trainer" ? "Eigen vragen" : "Nog enkele vragen van de trainer",
      vragen: eigen.map((v) => ({ id: v.id, soort: v.soort, tekst: v.tekst, groepen: A })),
    });
  }
  return uit;
}

/** Alle vragen die bij deze groepen passen, om aan te vinken bij het opmaken. */
export function keuzelijst(rol: EvalRol, groepen: Groep[]): Rubriek[] {
  return RUBRIEKEN[rol]
    .map((r) => ({ ...r, vragen: r.vragen.filter((v) => v.groepen.some((g) => groepen.includes(g))) }))
    .filter((r) => r.vragen.length > 0);
}

/** Wat nog ontbreekt om in te dienen: alle scores zijn verplicht, teksten niet. */
export function ontbrekend(rol: EvalRol, groep: Groep, a: Antwoorden, inst?: Instellingen): string[] {
  const mist: string[] = [];
  for (const r of zichtbaar(rol, groep, a.keeper, inst)) {
    for (const v of r.vragen) if (v.soort === "score" && !a.scores?.[v.id]) mist.push(v.id);
  }
  return mist;
}

/** Gemiddelde score per domein (Techniek, Tactiek, ...), voor de grafiek op de fiche. */
export function perDomein(rol: EvalRol, groep: Groep, a: Antwoorden): Record<string, number> {
  const uit: Record<string, number> = {};
  for (const r of zichtbaar(rol, groep, a.keeper)) {
    if (!r.domein) continue;
    const s = r.vragen.flatMap((v) => (v.soort === "score" && a.scores?.[v.id] ? [a.scores[v.id]] : []));
    if (s.length) uit[r.domein] = Math.round((s.reduce((x, y) => x + y, 0) / s.length) * 10) / 10;
  }
  return uit;
}

/** Ruwe invoer uit een formulier opschonen tot geldige antwoorden. */
export function schoonmaken(rol: EvalRol, groep: Groep, ruw: unknown, inst?: Instellingen): Antwoorden {
  const r = (ruw && typeof ruw === "object" ? ruw : {}) as Record<string, unknown>;
  const keeper = rol === "trainer" && r.keeper === true;
  const geldig = new Map<string, Vraag>();
  for (const rub of zichtbaar(rol, groep, keeper, inst)) for (const v of rub.vragen) geldig.set(v.id, v);
  const tekst = (x: unknown, max = 2000) => (typeof x === "string" ? x.trim().slice(0, max) : "");
  const uit: Antwoorden = {};
  if (keeper) uit.keeper = true;

  const { schaal: s } = schaal(rol, groep);
  const toegelaten = new Set(s.map((x) => x.waarde));
  const scores: Record<string, number> = {};
  for (const [id, w] of Object.entries((r.scores as Record<string, unknown>) ?? {})) {
    if (geldig.get(id)?.soort === "score" && typeof w === "number" && toegelaten.has(w)) scores[id] = w;
  }
  if (Object.keys(scores).length) uit.scores = scores;

  const teksten: Record<string, string> = {};
  for (const [id, w] of Object.entries((r.teksten as Record<string, unknown>) ?? {})) {
    const t = tekst(w);
    if (geldig.get(id)?.soort === "tekst" && t) teksten[id] = t;
  }
  if (Object.keys(teksten).length) uit.teksten = teksten;

  if (geldig.has("pos") && Array.isArray(r.posities)) {
    const nrs = new Set(VELD.map((v) => v.nr));
    const p = [...new Set(r.posities.filter((x): x is number => typeof x === "number" && nrs.has(x)))].slice(0, 4);
    if (p.length) uit.posities = p;
  }

  if (geldig.has("taken") && r.taken && typeof r.taken === "object") {
    const t = r.taken as { lijn?: unknown; scores?: Record<string, unknown> };
    const lijn = typeof t.lijn === "string" && LIJNEN[t.lijn] ? t.lijn : undefined;
    if (lijn) {
      const sleutels = new Set([...LIJNEN[lijn].balbezit.map((_, i) => `b${i}`), ...LIJNEN[lijn].balverlies.map((_, i) => `v${i}`)]);
      const sc: Record<string, number> = {};
      for (const [k, w] of Object.entries(t.scores ?? {})) if (sleutels.has(k) && (w === 1 || w === 2 || w === 3)) sc[k] = w;
      uit.taken = { lijn, scores: sc };
    }
  }

  if (geldig.has("wp") && Array.isArray(r.werkpunten)) {
    const w = r.werkpunten.map((x) => tekst(x, 300)).filter(Boolean).slice(0, 3);
    if (w.length) uit.werkpunten = w;
  }

  if (rol === "trainer" && (!inst?.keuze?.trainer || inst.keuze.trainer.includes("wp")) && Array.isArray(r.opvolging)) {
    const o = r.opvolging.slice(0, 3).map((x) => {
      const y = (x ?? {}) as Record<string, unknown>;
      const status = ["gehaald", "deels", "niet"].includes(y.status as string) ? (y.status as Opvolging["status"]) : "";
      return { tekst: tekst(y.tekst, 300), status, feedback: tekst(y.feedback, 1000) };
    });
    if (o.some((x) => x.tekst)) uit.opvolging = o.filter((x) => x.tekst);
  }

  if (rol === "trainer") {
    const opm: Record<string, string> = {};
    const rubrieken = new Set(zichtbaar(rol, groep, keeper, inst).filter((x) => x.opmerking).map((x) => x.id));
    for (const [id, w] of Object.entries((r.opmerkingen as Record<string, unknown>) ?? {})) {
      const t = tekst(w);
      if (rubrieken.has(id) && t) opm[id] = t;
    }
    if (Object.keys(opm).length) uit.opmerkingen = opm;
  }
  return uit;
}
