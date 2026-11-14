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
  weekendTitel,
  type OverzichtWedstrijd,
} from "@/lib/weekoverzicht";

export const BREED = 1080;
export const HOOG = 1350;

const ROOD = "#9e1b1b";
const ROOD_LICHT = "#c62828";
const DONKER = "#141010";
const WIT = "#ffffff";

const KOP_HOOGTE = 330;
const VOET_HOOGTE = 96;
const DAGBALK = 62;
const DAG_TUSSEN = 18;
const MARGE = 36;
const RIJ_MAX = 60;
const RIJ_MIN = 42;

/** Wat er op één beeld komt. */
export interface Beeld {
  dagen: { dag: Date; wedstrijden: OverzichtWedstrijd[]; vervolg: boolean }[];
}

function ruimte(): number {
  return HOOG - KOP_HOOGTE - VOET_HOOGTE - 20;
}

function rijHoogte(beeld: Beeld): number {
  const rijen = beeld.dagen.reduce((n, d) => n + d.wedstrijden.length, 0);
  const vrij = ruimte() - beeld.dagen.length * (DAGBALK + DAG_TUSSEN);
  return Math.min(RIJ_MAX, rijen ? vrij / rijen : RIJ_MAX);
}

/** Verdeelt de wedstrijden over zo weinig mogelijk beelden. */
export function verdeel(lijst: OverzichtWedstrijd[]): Beeld[] {
  const dagen = perDag(lijst).map((d) => ({ ...d, vervolg: false }));
  if (dagen.length === 0) return [{ dagen: [] }];

  const alles: Beeld = { dagen };
  if (rijHoogte(alles) >= RIJ_MIN) return [alles];

  // Een te volle dag eerst in stukken, dan de stukken zo samen op een beeld
  // zetten als ze nog leesbaar passen.
  const perBeeld = Math.floor((ruimte() - DAGBALK - DAG_TUSSEN) / RIJ_MIN);
  const stukken: Beeld["dagen"] = [];
  for (const d of dagen) {
    for (let i = 0; i < d.wedstrijden.length; i += perBeeld) {
      stukken.push({ dag: d.dag, wedstrijden: d.wedstrijden.slice(i, i + perBeeld), vervolg: i > 0 });
    }
  }
  const beelden: Beeld[] = [];
  for (const stuk of stukken) {
    const laatste = beelden[beelden.length - 1];
    if (laatste && rijHoogte({ dagen: [...laatste.dagen, stuk] }) >= RIJ_MIN) {
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

  // "DIT WEEKEND" op een rode schuine band.
  ctx.save();
  ctx.translate(x - 14, 160);
  ctx.transform(1, 0, -0.18, 1, 0, 0);
  ctx.fillStyle = ROOD;
  ctx.fillRect(0, 0, 520, 86);
  ctx.restore();
  ctx.fillStyle = WIT;
  ctx.font = `74px "WO Anton"`;
  ctx.fillText("DIT WEEKEND", x + 6, 230);

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

function tekenDagbalk(ctx: CanvasRenderingContext2D, y: number, titel: string) {
  ctx.save();
  ctx.translate(MARGE, y);
  ctx.transform(1, 0, -0.12, 1, 0, 0);
  ctx.fillStyle = ROOD;
  ctx.fillRect(6, 0, 640, DAGBALK - 8);
  ctx.restore();

  // Klein kalendericoon.
  const ix = MARGE + 22;
  const iy = y + 11;
  ctx.fillStyle = WIT;
  afgerond(ctx, ix, iy, 34, 32, 5);
  ctx.fill();
  ctx.fillStyle = ROOD;
  ctx.fillRect(ix, iy + 9, 34, 3);
  ctx.fillStyle = WIT;
  ctx.font = `40px "WO Anton"`;
  ctx.textAlign = "left";
  ctx.fillText(titel.toUpperCase(), MARGE + 72, y + 44);
}

function tekenRij(ctx: CanvasRenderingContext2D, w: OverzichtWedstrijd, y: number, h: number, even: boolean) {
  const x = MARGE;
  const b = BREED - 2 * MARGE;
  const midden = y + h / 2;
  const tekstY = midden + Math.round(h * 0.17);
  const grootte = Math.round(Math.min(26, h * 0.46));

  ctx.fillStyle = even ? "#ffffff" : "#f3eded";
  afgerond(ctx, x, y + 2, b, h - 4, 10);
  ctx.fill();

  // Aftrapuur in een rood blok.
  ctx.fillStyle = w.uitgesteld ? "#8a8a8a" : ROOD;
  afgerond(ctx, x + 6, y + 6, 104, h - 12, 8);
  ctx.fill();
  ctx.fillStyle = WIT;
  ctx.font = `${Math.round(grootte * 1.15)}px "WO Anton"`;
  ctx.textAlign = "center";
  ctx.fillText(uur(w.start), x + 58, tekstY + 1);

  // Ploeg.
  ctx.fillStyle = "#1a1a1a";
  pasTekst(ctx, w.ploeg, x + 124, tekstY, 150, { grootte, min: 14, gewicht: "700" });

  // Thuis vs uit, onze eigen naam vet.
  const vsX = x + 286 + 268;
  ctx.fillStyle = w.eigenThuis ? "#111111" : "#333333";
  pasTekst(ctx, w.thuis, vsX - 30, tekstY, 255, {
    grootte: grootte - 2,
    min: 13,
    gewicht: w.eigenThuis ? "700" : "400",
    uitlijning: "right",
  });
  ctx.fillStyle = ROOD;
  afgerond(ctx, vsX - 20, midden - 15, 40, 30, 7);
  ctx.fill();
  ctx.fillStyle = WIT;
  ctx.font = `20px "WO Anton"`;
  ctx.textAlign = "center";
  ctx.fillText("VS", vsX, midden + 8);
  ctx.fillStyle = w.eigenThuis ? "#333333" : "#111111";
  pasTekst(ctx, w.uit, vsX + 30, tekstY, 255, {
    grootte: grootte - 2,
    min: 13,
    gewicht: w.eigenThuis ? "400" : "700",
  });

  // Label thuis, uit of uitgesteld.
  const lb = 128;
  const lx = x + b - lb - 8;
  const label = w.uitgesteld ? "UITGESTELD" : w.eigenThuis ? "THUIS" : "UIT";
  ctx.fillStyle = w.uitgesteld ? "#8a8a8a" : w.eigenThuis ? "#141414" : ROOD;
  afgerond(ctx, lx, midden - 17, lb, 34, 17);
  ctx.fill();
  ctx.fillStyle = WIT;
  ctx.font = `${w.uitgesteld ? 17 : 21}px "WO Anton"`;
  ctx.textAlign = "center";
  ctx.fillText(label, lx + lb / 2, midden + 8);
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
  totaal: number
): Promise<void> {
  await laadFonts();
  const logo = await laadBeeld("/images/logo-kws.png");

  canvas.width = BREED;
  canvas.height = HOOG;
  const ctx = canvas.getContext("2d")!;

  tekenAchtergrond(ctx);
  tekenKop(ctx, logo, weekendTitel(alles, van), totaal > 1 ? `${nr}/${totaal}` : "");

  let y = KOP_HOOGTE;
  if (beeld.dagen.length === 0) {
    ctx.fillStyle = WIT;
    ctx.textAlign = "center";
    ctx.font = `700 40px "WO Inter"`;
    ctx.fillText("Geen wedstrijden dit weekend", BREED / 2, y + 300);
  }

  const h = rijHoogte(beeld);
  // Een half gevuld beeld: de blokken verticaal in het midden van de vrije ruimte.
  const nodig = beeld.dagen.reduce((n, d) => n + DAGBALK + DAG_TUSSEN + d.wedstrijden.length * h, 0);
  y += Math.max(0, (ruimte() - nodig) / 2);
  for (const { dag, wedstrijden, vervolg } of beeld.dagen) {
    tekenDagbalk(ctx, y, `${dagTitel(dag)} ${dag.getFullYear()}${vervolg ? " (vervolg)" : ""}`);
    y += DAGBALK;
    wedstrijden.forEach((w, i) => {
      tekenRij(ctx, w, y, h, i % 2 === 0);
      y += h;
    });
    y += DAG_TUSSEN;
  }

  tekenVoet(ctx);
}
