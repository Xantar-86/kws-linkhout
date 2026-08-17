/**
 * Maakt webversies van de spelersfoto's en schrijft de ploeglijst weg.
 *
 * De originelen in `public/images/kws spelers/` en `public/images/Trainers/`
 * zijn te groot om rechtstreeks te tonen. Per persoon komt er een klein beeld
 * voor het raster en een groter voor als je erop klikt.
 *
 * De ploeg leiden we af uit de bestandsnaam: "Mike Geybels P2.JPG" hoort bij
 * P2, en dat achtervoegsel hoort niet in de naam op de pagina.
 *
 * Alle foto's zijn in dezelfde opstelling genomen, maar niet iedereen stond
 * even ver van het toestel. Daarom knippen we niet blind een vierkant uit het
 * midden, maar zoeken we eerst waar het hoofd zit. Zo staan alle koppen in het
 * raster op precies dezelfde hoogte.
 *
 * Draaien: node scripts/maak-spelerfotos.mjs
 */

import { readdirSync, mkdirSync, writeFileSync, unlinkSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import sharp from "sharp";

/**
 * Twee bronmappen. In de spelersmap staat de ploeg in de bestandsnaam en
 * herken je een trainer aan de ploeg vooraan; alles in de trainersmap is per
 * definitie een trainer, daar volstaat de naam.
 */
const BRONNEN = [
  { map: "public/images/kws spelers", altijdTrainer: false },
  { map: "public/images/Trainers", altijdTrainer: true },
];
const DOEL = "public/images/spelers";
const LIJST = "src/lib/spelers.ts";

/**
 * Uitgeknipte spelers, gemaakt met `_knip-alles.mjs` in C:\Personal\KWS-Affiches.
 *
 * Staat er voor iemand een uitsnede, dan komt hij op de clubwand te staan.
 * Zo niet, dan wordt gewoon zijn foto gebruikt. Het uitknippen zelf gebeurt
 * daar en niet hier, want het model erachter weegt honderden megabytes.
 */
const UITGEKNIPT = "public/images/uitgeknipt";

/**
 * De clubwand achter de spelers.
 *
 * Dit is een echt beeld en geen tekening in code: zo kan de wand in Photoshop
 * gemaakt worden, met textuur en verloop, en hoeft er in de code niets
 * aangepast te worden om hem te vervangen.
 */
const WAND = "public/images/achtergrond spelers.png";

async function clubwand(breedte, hoogte) {
  return sharp(WAND).resize(breedte, hoogte, { fit: "cover" }).toBuffer();
}

/** Kleine versie voor het raster, en een grotere voor het vergrote beeld. */
const KLEIN = 560;
const GROOT = 1400;

/** Hoe hoog de uitsnede is, en hoeveel lucht er boven de kruin blijft. */
const UITSNEDE_HOOGTE = 0.42;
const RUIMTE_BOVEN = 0.1;

/** Het staande beeld voor de kaarten loopt verder door dan kop en schouders. */
const PORTRET_FACTOR = 1.7;

/**
 * Hoog dit op zodra je iets aan het snijden verandert.
 *
 * Het getal gaat mee in de vingerafdruk in de bestandsnaam. Zonder dat houdt
 * een browser de oude uitsnede vast, want het webadres blijft dan gelijk.
 */
const SNIJ_VERSIE = 10;

/**
 * Correcties voor foto's waar het zoeken naast zit.
 *
 * Het automatisch zoeken gaat uit van de ploegfotosessie: dezelfde afstand,
 * dezelfde achtergrond. Komt er een portret van elders, dan kan de kruin er
 * naast liggen. `kruin` is de hoogte van de kruin als deel van de foto,
 * `midden` de horizontale plaats, `hoogte` hoeveel van de foto de uitsnede
 * beslaat. Allemaal tussen 0 en 1.
 */
const CORRECTIES = {
  "Brent Gilissen": { kruin: 0.215, midden: 0.51 },
  // Staat al als portret in beeld en vult de foto; vrijwel niets bijsnijden.
  "Luc Brants": { kruin: 0.02, midden: 0.44, hoogte: 1 },
};

/** Maakt van "Lorenzo Silvente Fernandez" een bestandsnaam zonder rare tekens. */
function slug(naam) {
  return naam
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Zoekt waar de speler in het beeld staat.
 *
 * De randen van de foto zijn altijd achtergrond. Per beeldrij nemen we de
 * kleur van die randen als ijkpunt en kijken we waar het midden daarvan
 * afwijkt. De bovenste rij waar dat gebeurt is de kruin; het zwaartepunt van
 * de afwijkende punten daaronder zegt hoe ver de speler links of rechts staat.
 */
async function zoekSpeler(pad) {
  // Klein rekenen volstaat en scheelt veel tijd.
  const B = 200;
  const { data, info } = await sharp(pad)
    .rotate()
    .resize(B, null)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const H = info.height;
  const kleur = (x, y) => {
    const i = (y * B + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const verschil = (a, b) =>
    Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);

  const randBreedte = Math.round(B * 0.12);
  const midVan = Math.round(B * 0.25);
  const midTot = Math.round(B * 0.75);
  const drempel = 70;

  let kruin = null;
  let somX = 0;
  let aantalX = 0;
  let opeenvolgend = 0;

  // Een paar rijen wolkenlucht kunnen al van de randkleur afwijken. Daarom
  // begint een kruin pas te tellen na een aantal rijen op rij, en nooit
  // meteen bovenaan het beeld; niemand staat met zijn kruin tegen de rand.
  const vroegst = Math.round(H * 0.02);
  const nodigOpeenvolgend = 6;

  for (let y = 0; y < H; y++) {
    // Achtergrondkleur van deze rij: het gemiddelde van beide randen.
    let r = 0, g = 0, b = 0, n = 0;
    for (let x = 0; x < randBreedte; x++) {
      for (const xx of [x, B - 1 - x]) {
        const c = kleur(xx, y);
        r += c[0]; g += c[1]; b += c[2]; n++;
      }
    }
    const achtergrond = [r / n, g / n, b / n];

    let afwijkend = 0;
    let rijSom = 0;
    for (let x = midVan; x < midTot; x++) {
      if (verschil(kleur(x, y), achtergrond) > drempel) {
        afwijkend++;
        rijSom += x;
      }
    }

    if (kruin === null) {
      const genoeg = afwijkend >= (midTot - midVan) * 0.06;
      opeenvolgend = genoeg ? opeenvolgend + 1 : 0;
      if (y >= vroegst && opeenvolgend >= nodigOpeenvolgend) {
        kruin = y - (nodigOpeenvolgend - 1);
      }
    }
    if (kruin !== null && y > kruin && y < kruin + H * 0.25 && afwijkend > 0) {
      somX += rijSom;
      aantalX += afwijkend;
    }
  }

  return {
    kruinFractie: kruin === null ? 0.18 : kruin / H,
    middenFractie: aantalX > 0 ? somX / aantalX / B : 0.5,
  };
}

mkdirSync(DOEL, { recursive: true });

const spelers = [];
const trainers = [];

const teDoen = BRONNEN.filter((b) => existsSync(b.map)).flatMap((bron) =>
  readdirSync(bron.map)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .map((bestand) => ({ ...bron, bestand }))
);

for (const { map, bestand, altijdTrainer } of teDoen) {
  const zonderExtensie = bestand.replace(/\.[^.]+$/, "").trim();

  // Staat de ploeg vooraan, dan is het een trainer. Achteraan of helemaal
  // niet is een speler: bij welke kern hij hoort staat in lib/kernen.ts en
  // niet in de bestandsnaam, dus dat achtervoegsel mag ook weg blijven.
  const achteraan = zonderExtensie.match(/^(.*?)\s+(P2|P4)$/i);
  const vooraan = zonderExtensie.match(/^(P2|P4)\s+(.*)$/i);

  let naam;
  let ploeg;
  let isTrainer = altijdTrainer;

  if (altijdTrainer) {
    naam = zonderExtensie;
    ploeg = "";
  } else if (vooraan) {
    ploeg = vooraan[1].toUpperCase();
    naam = vooraan[2].trim();
    isTrainer = true;
  } else if (achteraan) {
    naam = achteraan[1].trim();
    ploeg = achteraan[2].toUpperCase();
  } else {
    naam = zonderExtensie;
    ploeg = "";
  }

  const bronPad = join(map, bestand);

  const gemeten = await zoekSpeler(bronPad);
  const correctie = CORRECTIES[naam] ?? {};
  const kruinFractie = correctie.kruin ?? gemeten.kruinFractie;
  const middenFractie = correctie.midden ?? gemeten.middenFractie;
  const hoogteFractie = correctie.hoogte ?? UITSNEDE_HOOGTE;

  // Een vingerafdruk van de foto en de uitsnede in de bestandsnaam. Verandert
  // er iets, dan verandert het webadres mee en tonen browsers en de
  // beeldoptimalisatie meteen het nieuwe beeld in plaats van het oude uit hun
  // geheugen.
  const vingerafdruk = createHash("sha1")
    .update(readFileSync(bronPad))
    .update(
      [
        SNIJ_VERSIE,
        kruinFractie.toFixed(4),
        middenFractie.toFixed(4),
        hoogteFractie,
        RUIMTE_BOVEN,
        PORTRET_FACTOR,
        isTrainer,
        KLEIN,
        GROOT,
      ].join("|")
    )
    .digest("hex")
    .slice(0, 8);

  const basis = `${slug(naam)}-${vingerafdruk}`;
  const kleinPad = join(DOEL, `${basis}-klein.webp`);
  const grootPad = join(DOEL, `${basis}.webp`);

  // metadata() leest de afmetingen uit het bestand zelf, dus van vóór het
  // rechtzetten. Bij een liggend opgeslagen portret staan breedte en hoogte
  // dan omgekeerd; oriëntatie 5 tot 8 betekent een kwartslag.
  const meta = await sharp(bronPad).metadata();
  const kwartslag = (meta.orientation ?? 1) >= 5;
  const B = kwartslag ? meta.height : meta.width;
  const H = kwartslag ? meta.width : meta.height;

  /**
   * Snijdt een beeld uit met een vaste verhouding, altijd even ver onder de
   * kruin en rond dezelfde as. Zo staat iedereen gelijk in beeld, of hij nu
   * van de ploegfotosessie komt of van een losse foto.
   *
   * Reikt de uitsnede buiten de foto, dan wordt de rest gevuld met een
   * vervaagde vergroting van de foto zelf. Dat is beter dan het hoofd tegen
   * de rand duwen, en het valt nauwelijks op.
   */
  async function snij({ uitBreedte, uitHoogte, doelPad, kwaliteit, factor = 1 }) {
    const verhouding = uitBreedte / uitHoogte;
    const hoog = Math.round(H * hoogteFractie * factor);
    const breed = Math.round(hoog * verhouding);

    const wensTop = Math.round(kruinFractie * H - RUIMTE_BOVEN * hoog);
    const wensLinks = Math.round(middenFractie * B - breed / 2);

    const top = Math.max(0, Math.min(Math.max(0, H - hoog), wensTop));
    const links = Math.max(0, Math.min(Math.max(0, B - breed), wensLinks));
    const hoogte = Math.min(hoog, H - top);
    const breedte = Math.min(breed, B - links);

    const tekortBoven = Math.max(0, top - wensTop);
    const tekortLinks = Math.max(0, links - wensLinks);
    const schaal = uitHoogte / hoog;

    // Nooit groter dan het doelbeeld, anders past het er straks niet in.
    const stukBreed = Math.min(uitBreedte, Math.round(breedte * schaal));
    const stukHoog = Math.min(uitHoogte, Math.round(hoogte * schaal));

    const stuk = await sharp(bronPad)
      .rotate()
      .extract({ left: links, top, width: breedte, height: hoogte })
      .resize(stukBreed, stukHoog)
      .toBuffer();

    const past =
      tekortBoven === 0 &&
      tekortLinks === 0 &&
      breedte === breed &&
      hoogte === hoog;

    if (past) {
      await sharp(stuk).webp({ quality: kwaliteit }).toFile(doelPad);
      return;
    }

    const achtergrond = await sharp(bronPad)
      .rotate()
      .resize(uitBreedte, uitHoogte, { fit: "cover" })
      .blur(Math.max(12, Math.round(uitHoogte / 20)))
      .modulate({ brightness: 1.05 })
      .toBuffer();

    await sharp(achtergrond)
      .composite([
        {
          input: stuk,
          left: Math.min(Math.round(tekortLinks * schaal), uitBreedte - stukBreed),
          top: Math.min(Math.round(tekortBoven * schaal), uitHoogte - stukHoog),
        },
      ])
      .webp({ quality: kwaliteit })
      .toFile(doelPad);
  }

  // Het vierkantje maken we verderop uit het staande beeld, zodat het dezelfde
  // wand en dezelfde bewerking heeft. Lukt dat niet, dan valt het terug op een
  // uitsnede uit de foto zelf.

  // Staand voor de kaarten in de kern. Is er een uitsnede, dan komt de speler
  // vrijstaand op de clubwand; anders blijft het gewoon zijn foto.
  const knipPad = join(UITGEKNIPT, `${bestand.replace(/\.[^.]+$/, "")}.png`);
  const portretBreed = Math.round((GROOT * 3) / 4);

  if (existsSync(knipPad)) {
    // Verkleinen maakt een beeld altijd wat weker, en op een donkere wand
    // ogen de shirts al snel flets. Daarom na het verkleinen verscherpen en
    // de kleur en het contrast wat aanzetten; dat haalt het rood terug.
    const persoon = await sharp(knipPad)
      .resize({
        height: Math.round(GROOT * 0.9),
        width: Math.round(portretBreed * 0.94),
        fit: "inside",
      })
      .modulate({ saturation: 1.2 })
      .linear(1.06, -6)
      .sharpen({ sigma: 1.1, m1: 0.6, m2: 2.4 })
      .toBuffer();
    const maat = await sharp(persoon).metadata();

    await sharp(await clubwand(portretBreed, GROOT))
      .composite([
        {
          input: persoon,
          left: Math.round((portretBreed - maat.width) / 2),
          top: GROOT - maat.height,
        },
      ])
      .webp({ quality: 86 })
      .toFile(grootPad);

    // Het vierkantje is de bovenkant van datzelfde beeld: kop en schouders,
    // op dezelfde wand.
    const zijde = Math.round(GROOT * 0.62);
    await sharp(grootPad)
      .extract({
        left: Math.round((portretBreed - zijde) / 2),
        top: Math.round(GROOT * 0.04),
        width: zijde,
        height: zijde,
      })
      .resize(KLEIN, KLEIN)
      .webp({ quality: 82 })
      .toFile(kleinPad);
  } else {
    await snij({ uitBreedte: KLEIN, uitHoogte: KLEIN, doelPad: kleinPad, kwaliteit: 82 });
    await snij({
      uitBreedte: portretBreed,
      uitHoogte: GROOT,
      doelPad: grootPad,
      kwaliteit: 86,
      // Trainers staan niet in de kaartenbalk; hun grote beeld hoeft dus niet
      // uitgerekt te worden tot heuphoogte.
      factor: isTrainer ? 1 : PORTRET_FACTOR,
    });
  }

  console.log(
    `${naam.padEnd(28)} ${ploeg}${isTrainer ? " trainer" : "       "}` +
      `  kruin ${kruinFractie.toFixed(3)}  midden ${middenFractie.toFixed(3)}`
  );

  const item = {
    naam,
    ploeg,
    klein: `/images/spelers/${basis}-klein.webp`,
    groot: `/images/spelers/${basis}.webp`,
  };
  (isTrainer ? trainers : spelers).push(item);
}

const opNaam = (a, b) => a.naam.localeCompare(b.naam, "nl");
spelers.sort(opNaam);
trainers.sort(opNaam);

const regels = [
  "// Gemaakt door scripts/maak-spelerfotos.mjs. Niet met de hand aanpassen:",
  "// zet een foto in public/images/kws spelers/ en draai het script opnieuw.",
  "",
  "export interface Speler {",
  "  naam: string;",
  '  /** "P2" of "P4", uit de bestandsnaam van de foto. */',
  "  ploeg: string;",
  "  /** Vierkant beeld voor in het raster. */",
  "  klein: string;",
  "  /** Groter beeld voor als je erop klikt. */",
  "  groot: string;",
  "}",
  "",
  `export const spelers: Speler[] = ${JSON.stringify(spelers, null, 2)};`,
  "",
  `export const trainers: Speler[] = ${JSON.stringify(trainers, null, 2)};`,
  "",
  "/** De foto van een trainer, als die er is. */",
  "export function trainerFoto(naam: string): Speler | undefined {",
  "  return trainers.find((t) => t.naam.toLowerCase() === naam.toLowerCase());",
  "}",
  "",
];

writeFileSync(LIJST, regels.join("\n"));

// Beelden van wie er niet meer is opruimen, bijvoorbeeld na een hernoeming.
const inGebruik = new Set(
  [...spelers, ...trainers].flatMap((s) => [
    s.klein.split("/").pop(),
    s.groot.split("/").pop(),
  ])
);
for (const bestand of readdirSync(DOEL)) {
  if (bestand.endsWith(".webp") && !inGebruik.has(bestand)) {
    unlinkSync(join(DOEL, bestand));
    console.log(`opgeruimd: ${bestand}`);
  }
}

console.log(`\n${spelers.length} spelers en ${trainers.length} trainers in ${LIJST}`);
