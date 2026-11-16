/**
 * Tekent het weekoverzicht op een canvas van 1080 x 1350 (staand, het formaat
 * dat Instagram en Facebook het best tonen).
 *
 * Bewust zelf getekend en niet door een beeldgenerator: elke aftraptijd en
 * ploegnaam moet exact kloppen, en dat kan een AI-beeld niet garanderen.
 *
 * Passen alle wedstrijden niet leesbaar op één beeld, dan wordt het een
 * carrousel: één beeld per dag, en een te volle dag over meerdere beelden.
 */

import {
  dagTitel,
  perDag,
  uur,
  weekTitel,
  type OverzichtWedstrijd,
} from "@/lib/weekoverzicht";

export const BREED = 1080;
/** 3:4, zoals Instagram sinds 2025 toont en zoals ChatGPT het sjabloon maakt. */
export const HOOG = 1440;

const ROOD = "#9e1b1b";
const ROOD_LICHT = "#c62828";
const DONKER = "#141010";
const WIT = "#ffffff";

const KOP_HOOGTE = 330;
const VOET_HOOGTE = 96;
/** Dagbalk inclusief de witrand boven het paneel. */
const DAGBALK = 54;
const PANEEL_RAND = 4;
const DAG_TUSSEN = 12;
const MARGE = 36;
const RIJ_MAX = 50;
const RIJ_MIN = 28;

/** Wat er op één beeld komt. */
export interface Beeld {
  dagen: { dag: Date; wedstrijden: OverzichtWedstrijd[]; vervolg: boolean }[];
}

/**
 * Het sjabloon uit ChatGPT: een lege achtergrond in de clubstijl met logo en
 * titel, waarop wij de datums en de tabel zetten. Staat het bestand er niet,
 * dan tekenen we alles zelf (donker ontwerp).
 *
 * De posities hieronder zijn afgemeten op het sjabloon, in pixels op 1080x1350.
 * Komt er een nieuw sjabloon, dan moeten enkel deze getallen mee veranderen.
 */
export const SJABLOON_PAD = "/images/social/sjabloon-weekoverzicht.png";
const SJABLOON = {
  /** Bovenkant en onderkant van de zone voor de tabel. */
  boven: 462,
  onder: 1292,
  /**
   * Het sjabloon uit ChatGPT (14/11/2026) heeft in het midden nog lege
   * tabellen met een vast aantal rijen. Die dekken we af met een donkere
   * achtergrond, met zachte randen zodat het in het beeld overloopt.
   */
  afdekVan: 440,
  afdekTot: 1314,
  /** Midden van de lege witte band waarin de datums komen. */
  datumX: 545,
  datumY: 399,
  datumKleur: "#b71c1c",
};

/** Dekt het middenstuk van het sjabloon af, zie SJABLOON.afdekVan. */
function dekAf(ctx: CanvasRenderingContext2D) {
  const { afdekVan: van, afdekTot: tot } = SJABLOON;
  const zacht = 26;

  const grond = ctx.createLinearGradient(0, van - zacht, 0, tot + 10);
  grond.addColorStop(0, "rgba(14,10,10,0)");
  grond.addColorStop(zacht / (tot - van + zacht + 10), "rgba(14,10,10,1)");
  grond.addColorStop(0.97, "rgba(14,10,10,1)");
  grond.addColorStop(1, "rgba(14,10,10,0)");
  ctx.fillStyle = grond;
  ctx.fillRect(0, van - zacht, BREED, tot - van + zacht + 10);

  // Rode gloed langs beide zijkanten, zoals in de rest van het sjabloon.
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, van, BREED, tot - van);
  ctx.clip();
  for (const x of [0, BREED]) {
    const gloed = ctx.createRadialGradient(x, (van + tot) / 2, 0, x, (van + tot) / 2, 420);
    gloed.addColorStop(0, "rgba(170,20,20,0.55)");
    gloed.addColorStop(1, "rgba(170,20,20,0)");
    ctx.fillStyle = gloed;
    ctx.fillRect(0, van, BREED, tot - van);
  }
  ctx.restore();
}

/** De lege zone voor de tabel, en het sjabloon als dat er is. */
export interface Opmaak {
  boven: number;
  onder: number;
  sjabloon: HTMLImageElement | null;
}

export const EIGEN_OPMAAK: Opmaak = {
  boven: KOP_HOOGTE,
  onder: HOOG - VOET_HOOGTE - 20,
  sjabloon: null,
};

/** Kijkt of er een sjabloon is en geeft de bijhorende opmaak. */
export async function laadOpmaak(): Promise<Opmaak> {
  const sjabloon = await laadBeeld(SJABLOON_PAD);
  return sjabloon ? { boven: SJABLOON.boven, onder: SJABLOON.onder, sjabloon } : EIGEN_OPMAAK;
}

function ruimte(o: Opmaak): number {
  return o.onder - o.boven;
}

function rijHoogte(beeld: Beeld, o: Opmaak): number {
  const rijen = beeld.dagen.reduce((n, d) => n + d.wedstrijden.length, 0);
  const vrij = ruimte(o) - beeld.dagen.length * (DAGBALK + DAG_TUSSEN + 2 * PANEEL_RAND);
  return Math.min(RIJ_MAX, rijen ? vrij / rijen : RIJ_MAX);
}

/** Verdeelt de wedstrijden over zo weinig mogelijk beelden. */
export function verdeel(lijst: OverzichtWedstrijd[], o: Opmaak = EIGEN_OPMAAK): Beeld[] {
  const dagen = perDag(lijst).map((d) => ({ ...d, vervolg: false }));
  if (dagen.length === 0) return [{ dagen: [] }];

  const alles: Beeld = { dagen };
  if (rijHoogte(alles, o) >= RIJ_MIN) return [alles];

  // Een te volle dag eerst in stukken, dan de stukken zo samen op een beeld
  // zetten als ze nog leesbaar passen.
  const perBeeld = Math.floor((ruimte(o) - DAGBALK - DAG_TUSSEN - 2 * PANEEL_RAND) / RIJ_MIN);
  const stukken: Beeld["dagen"] = [];
  for (const d of dagen) {
    for (let i = 0; i < d.wedstrijden.length; i += perBeeld) {
      stukken.push({ dag: d.dag, wedstrijden: d.wedstrijden.slice(i, i + perBeeld), vervolg: i > 0 });
    }
  }
  const beelden: Beeld[] = [];
  for (const stuk of stukken) {
    const laatste = beelden[beelden.length - 1];
    if (laatste && rijHoogte({ dagen: [...laatste.dagen, stuk] }, o) >= RIJ_MIN) {
      laatste.dagen.push(stuk);
    } else {
      beelden.push({ dagen: [stuk] });
    }
  }
  return beelden;
}

function laadBeeld(src: string): Promise<HTMLImageElement | null> {
  return new Promise((klaar) => {
    const img = new Image();
    img.onload = () => klaar(img);
    img.onerror = () => klaar(null);
    img.src = src;
  });
}

let fontsKlaar: Promise<void> | null = null;

/** Laadt Anton en Inter uit public/fonts, één keer. */
export function laadFonts(): Promise<void> {
  if (!fontsKlaar) {
    const lijst = [
      new FontFace("WO Anton", "url(/fonts/anton.ttf)"),
      new FontFace("WO Inter", "url(/fonts/inter-400.woff)", { weight: "400" }),
      new FontFace("WO Inter", "url(/fonts/inter-700.woff)", { weight: "700" }),
    ];
    fontsKlaar = Promise.all(
      lijst.map((f) =>
        f.load().then((geladen) => {
          document.fonts.add(geladen);
        })
      )
    ).then(() => undefined);
  }
  return fontsKlaar;
}

function afgerond(ctx: CanvasRenderingContext2D, x: number, y: number, b: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, b, h, r);
}

/** Zet tekst in een vak; krimpt het lettertype en kort desnoods af met "...". */
function pasTekst(
  ctx: CanvasRenderingContext2D,
  tekst: string,
  x: number,
  y: number,
  breedte: number,
  opts: { grootte: number; min: number; gewicht?: string; familie?: string; uitlijning?: CanvasTextAlign }
) {
  const familie = opts.familie ?? "WO Inter";
  const gewicht = opts.gewicht ?? "400";
  let grootte = opts.grootte;
  ctx.font = `${gewicht} ${grootte}px "${familie}"`;
  while (ctx.measureText(tekst).width > breedte && grootte > opts.min) {
    grootte -= 1;
    ctx.font = `${gewicht} ${grootte}px "${familie}"`;
  }
  let t = tekst;
  while (ctx.measureText(t).width > breedte && t.length > 4) {
    t = `${t.slice(0, -4).trimEnd()}...`;
  }
  ctx.textAlign = opts.uitlijning ?? "left";
  ctx.fillText(t, x, y);
}

function tekenAchtergrond(ctx: CanvasRenderingContext2D) {
  const grond = ctx.createLinearGradient(0, 0, 0, HOOG);
  grond.addColorStop(0, "#2a1414");
  grond.addColorStop(0.45, DONKER);
  grond.addColorStop(1, "#0b0808");
  ctx.fillStyle = grond;
  ctx.fillRect(0, 0, BREED, HOOG);

  // Stadionlicht linksboven en rechtsboven.
  for (const [x, y] of [
    [120, 40],
    [960, 40],
  ]) {
    const licht = ctx.createRadialGradient(x, y, 0, x, y, 420);
    licht.addColorStop(0, "rgba(255,235,220,0.28)");
    licht.addColorStop(1, "rgba(255,235,220,0)");
    ctx.fillStyle = licht;
    ctx.fillRect(0, 0, BREED, HOOG);
  }

  // Schuine rode banen als achtergrondaccent.
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = ROOD_LICHT;
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.lineTo(BREED, 120);
  ctx.lineTo(BREED, 190);
  ctx.lineTo(0, 320);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.moveTo(0, HOOG - 60);
  ctx.lineTo(BREED, HOOG - 230);
  ctx.lineTo(BREED, HOOG - 170);
  ctx.lineTo(0, HOOG);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function tekenKop(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  ondertitel: string,
  teller: string
) {
  if (logo) {
    // Het logo is breder dan hoog; maximaal 215 breed zodat de titel vrij blijft.
    const b = Math.min(215, (logo.width / logo.height) * 200);
    const h = (logo.height / logo.width) * b;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 24;
    ctx.drawImage(logo, MARGE, 165 - h / 2, b, h);
    ctx.restore();
  }

  const x = 270;
  ctx.fillStyle = WIT;
  ctx.textAlign = "left";
  ctx.font = `104px "WO Anton"`;
  ctx.fillText("WEDSTRIJDEN", x, 140);

  // "DEZE WEEK" op een rode schuine band.
  ctx.save();
  ctx.translate(x - 14, 160);
  ctx.transform(1, 0, -0.18, 1, 0, 0);
  ctx.fillStyle = ROOD;
  ctx.fillRect(0, 0, 520, 86);
  ctx.restore();
  ctx.fillStyle = WIT;
  ctx.font = `74px "WO Anton"`;
  ctx.fillText("DEZE WEEK", x + 6, 230);

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = `700 30px "WO Inter"`;
  ctx.fillText(ondertitel.toUpperCase(), x, 288);

  if (teller) {
    ctx.textAlign = "right";
    ctx.font = `700 24px "WO Inter"`;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText(teller, BREED - MARGE, 288);
  }
}

/** Rode schuine balk met de dag, en een dunne lijn die naar rechts doorloopt. */
function tekenDagbalk(ctx: CanvasRenderingContext2D, y: number, titel: string) {
  const h = DAGBALK - 10;
  const verloop = ctx.createLinearGradient(MARGE, 0, MARGE + 560, 0);
  verloop.addColorStop(0, ROOD_LICHT);
  verloop.addColorStop(1, ROOD);
  ctx.save();
  ctx.translate(MARGE, y);
  ctx.transform(1, 0, -0.25, 1, 0, 0);
  ctx.fillStyle = verloop;
  ctx.fillRect(14, 0, 540, h);
  ctx.fillRect(14, h - 4, BREED - 2 * MARGE + 20, 4);
  ctx.restore();

  ctx.fillStyle = WIT;
  ctx.textAlign = "left";
  ctx.font = `italic 700 30px "WO Inter"`;
  ctx.fillText(titel.toUpperCase(), MARGE + 22, y + h / 2 + 12);
}

/** Wit paneel waarop de rijen van een dag komen. */
function tekenPaneel(ctx: CanvasRenderingContext2D, y: number, hoogte: number) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#fbfbfb";
  afgerond(ctx, MARGE, y, BREED - 2 * MARGE, hoogte, 8);
  ctx.fill();
  ctx.restore();
}

/** Schuin label THUIS (rood), UIT (zwart) of UITGESTELD (grijs). */
function tekenLabel(ctx: CanvasRenderingContext2D, w: OverzichtWedstrijd, x: number, midden: number, h: number) {
  const b = 112;
  const lh = Math.min(30, h - 6);
  const label = w.uitgesteld ? "UITGESTELD" : w.eigenThuis ? "THUIS" : "UIT";
  ctx.save();
  ctx.translate(x, midden - lh / 2);
  ctx.transform(1, 0, -0.3, 1, 0, 0);
  ctx.fillStyle = w.uitgesteld ? "#8a8a8a" : w.eigenThuis ? ROOD_LICHT : "#161616";
  ctx.fillRect(lh * 0.3, 0, b, lh);
  ctx.restore();
  ctx.fillStyle = WIT;
  ctx.textAlign = "center";
  ctx.font = `italic 700 ${w.uitgesteld ? 14 : Math.round(lh * 0.66)}px "WO Inter"`;
  ctx.fillText(label, x + b / 2 + lh * 0.15, midden + lh * 0.24);
}

function tekenRij(ctx: CanvasRenderingContext2D, w: OverzichtWedstrijd, y: number, h: number, laatste: boolean) {
  const x = MARGE;
  const b = BREED - 2 * MARGE;
  const midden = y + h / 2;
  const grootte = Math.round(Math.min(26, h * 0.62));
  const tekstY = midden + grootte * 0.36;

  if (!laatste) {
    ctx.fillStyle = "#dedede";
    ctx.fillRect(x + 12, y + h - 1, b - 24, 1);
  }

  ctx.fillStyle = w.uitgesteld ? "#8a8a8a" : "#111111";
  ctx.textAlign = "left";
  ctx.font = `italic 700 ${grootte}px "WO Inter"`;
  ctx.fillText(uur(w.start), x + 22, tekstY);

  ctx.fillStyle = ROOD_LICHT;
  ctx.font = `700 ${grootte}px "WO Inter"`;
  ctx.fillText("|", x + 128, tekstY);
  ctx.fillText("|", x + 300, tekstY);

  pasTekst(ctx, w.ploeg, x + 150, tekstY, 140, { grootte, min: 13, gewicht: "700" });

  tekenDuel(ctx, w, x + 322, tekstY, b - 322 - 140, grootte);

  tekenLabel(ctx, w, x + b - 130, midden, h);
}

const isEigen = (naam: string) => naam.startsWith("KWS Linkhout");

/**
 * "thuis vs uit" met KWS Linkhout in het rood. Krimpt tot het past; past het
 * dan nog niet, dan wordt de tegenstander afgekort, nooit onze eigen naam.
 */
function tekenDuel(
  ctx: CanvasRenderingContext2D,
  w: OverzichtWedstrijd,
  x: number,
  y: number,
  breedte: number,
  start: number
) {
  const grijs = "#8a8a8a";
  const kleur = (naam: string) => (w.uitgesteld ? grijs : isEigen(naam) ? ROOD_LICHT : "#111111");
  const delen = [
    { t: w.thuis, k: kleur(w.thuis), kort: !isEigen(w.thuis) },
    { t: " vs ", k: w.uitgesteld ? grijs : "#555555", kort: false },
    { t: w.uit, k: kleur(w.uit), kort: !isEigen(w.uit) },
  ];
  const lettertype = (g: number) => `700 ${g}px "WO Inter"`;
  const totaal = () => delen.reduce((s, d) => s + ctx.measureText(d.t).width, 0);

  let grootte = start;
  ctx.font = lettertype(grootte);
  while (totaal() > breedte && grootte > 13) {
    grootte -= 1;
    ctx.font = lettertype(grootte);
  }
  // Nog te breed: de langste tegenstander inkorten.
  while (totaal() > breedte) {
    const kandidaten = delen.filter((d) => d.kort && d.t.length > 6);
    if (kandidaten.length === 0) break;
    const langste = kandidaten.reduce((a, d) => (ctx.measureText(d.t).width > ctx.measureText(a.t).width ? d : a));
    langste.t = `${langste.t.replace(/\.\.\.$/, "").slice(0, -2).trimEnd()}...`;
  }

  ctx.textAlign = "left";
  let pos = x;
  for (const d of delen) {
    ctx.fillStyle = d.k;
    ctx.fillText(d.t, pos, y);
    pos += ctx.measureText(d.t).width;
  }
}


function tekenVoet(ctx: CanvasRenderingContext2D) {
  const y = HOOG - VOET_HOOGTE;
  ctx.fillStyle = WIT;
  ctx.textAlign = "left";
  ctx.font = `46px "WO Anton"`;
  ctx.fillText("KOM SUPPORTEREN!", MARGE, y + 62);
  ctx.textAlign = "right";
  ctx.font = `700 26px "WO Inter"`;
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText("kwslinkhout.be", BREED - MARGE, y + 58);
  ctx.fillStyle = ROOD;
  ctx.fillRect(MARGE, y + 76, BREED - 2 * MARGE, 5);
}

/** Tekent één beeld op het gegeven canvas. */
export async function tekenBeeld(
  canvas: HTMLCanvasElement,
  beeld: Beeld,
  alles: OverzichtWedstrijd[],
  van: Date,
  nr: number,
  totaal: number,
  o: Opmaak = EIGEN_OPMAAK
): Promise<void> {
  await laadFonts();

  canvas.width = BREED;
  canvas.height = HOOG;
  const ctx = canvas.getContext("2d")!;
  const teller = totaal > 1 ? `${nr}/${totaal}` : "";

  if (o.sjabloon) {
    // Sjabloon passend maken op 1080x1440, zonder vervorming (bijsnijden).
    const s = o.sjabloon;
    const schaal = Math.max(BREED / s.width, HOOG / s.height);
    const b = s.width * schaal;
    const h = s.height * schaal;
    ctx.drawImage(s, (BREED - b) / 2, (HOOG - h) / 2, b, h);
    dekAf(ctx);

    ctx.fillStyle = SJABLOON.datumKleur;
    pasTekst(ctx, weekTitel(van).toUpperCase(), SJABLOON.datumX, SJABLOON.datumY + 13, 470, {
      grootte: 34,
      min: 22,
      gewicht: "italic 700",
      uitlijning: "center",
    });
    if (teller) {
      ctx.fillStyle = WIT;
      ctx.textAlign = "right";
      ctx.font = `700 24px "WO Inter"`;
      ctx.fillText(teller, BREED - MARGE, o.boven - 14);
    }
  } else {
    const logo = await laadBeeld("/images/logo-kws.png");
    tekenAchtergrond(ctx);
    tekenKop(ctx, logo, `van ${weekTitel(van)}`, teller);
  }

  let y = o.boven;
  if (beeld.dagen.length === 0) {
    ctx.fillStyle = o.sjabloon ? ROOD : WIT;
    ctx.textAlign = "center";
    ctx.font = `700 40px "WO Inter"`;
    ctx.fillText("Geen wedstrijden deze week", BREED / 2, y + ruimte(o) / 2);
  }

  const h = rijHoogte(beeld, o);
  // Een half gevuld beeld: de blokken verticaal in het midden van de vrije ruimte.
  const nodig = beeld.dagen.reduce((n, d) => n + DAGBALK + DAG_TUSSEN + 2 * PANEEL_RAND + d.wedstrijden.length * h, 0);
  y += Math.max(0, (ruimte(o) - nodig) / 2);
  for (const { dag, wedstrijden, vervolg } of beeld.dagen) {
    tekenDagbalk(ctx, y, `${dagTitel(dag)}${vervolg ? " (vervolg)" : ""}`);
    y += DAGBALK;
    tekenPaneel(ctx, y, wedstrijden.length * h + 2 * PANEEL_RAND);
    y += PANEEL_RAND;
    wedstrijden.forEach((w, i) => {
      tekenRij(ctx, w, y, h, i === wedstrijden.length - 1);
      y += h;
    });
    y += PANEEL_RAND + DAG_TUSSEN;
  }

  if (!o.sjabloon) tekenVoet(ctx);
}
