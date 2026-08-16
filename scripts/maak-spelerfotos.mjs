/**
 * Maakt webversies van de spelersfoto's en schrijft de ploeglijst weg.
 *
 * De originelen in `public/images/kws spelers/` zijn zo'n zes megabyte per
 * stuk; die kan je niet op een pagina zetten. Per speler komt er een klein
 * beeld voor het raster en een groter voor als je erop klikt.
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

import { readdirSync, mkdirSync, writeFileSync, unlinkSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import sharp from "sharp";

const BRON = "public/images/kws spelers";
const DOEL = "public/images/spelers";
const LIJST = "src/lib/spelers.ts";

/** Kleine versie voor het raster, en een grotere voor het vergrote beeld. */
const KLEIN = 560;
const GROOT = 1400;

/** Hoe hoog de uitsnede is, en hoeveel lucht er boven de kruin blijft. */
const UITSNEDE_HOOGTE = 0.42;
const RUIMTE_BOVEN = 0.1;

/**
 * Correcties voor foto's waar het zoeken naast zit.
 *
 * Het automatisch zoeken gaat uit van de ploegfotosessie: dezelfde afstand,
 * dezelfde achtergrond. Komt er een portret van elders, dan kan de kruin er
 * naast liggen. `kruin` is de hoogte van de kruin als deel van de foto,
 * `midden` de horizontale plaats, allebei tussen 0 en 1.
 */
const CORRECTIES = {
  "Brent Gilissen": { kruin: 0.215, midden: 0.51 },
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

const bestanden = readdirSync(BRON).filter((f) => /\.(jpe?g|png)$/i.test(f));
const spelers = [];
const trainers = [];

for (const bestand of bestanden) {
  const zonderExtensie = bestand.replace(/\.[^.]+$/, "").trim();

  // Staat de ploeg vooraan, dan is het een trainer. Achteraan of helemaal
  // niet is een speler: bij welke kern hij hoort staat in lib/kernen.ts en
  // niet in de bestandsnaam, dus dat achtervoegsel mag ook weg blijven.
  const achteraan = zonderExtensie.match(/^(.*?)\s+(P2|P4)$/i);
  const vooraan = zonderExtensie.match(/^(P2|P4)\s+(.*)$/i);

  let naam;
  let ploeg;
  let isTrainer = false;

  if (vooraan) {
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

  const bronPad = join(BRON, bestand);

  const gemeten = await zoekSpeler(bronPad);
  const correctie = CORRECTIES[naam] ?? {};
  const kruinFractie = correctie.kruin ?? gemeten.kruinFractie;
  const middenFractie = correctie.midden ?? gemeten.middenFractie;

  // Een vingerafdruk van de foto en de uitsnede in de bestandsnaam. Verandert
  // er iets, dan verandert het webadres mee en tonen browsers en de
  // beeldoptimalisatie meteen het nieuwe beeld in plaats van het oude uit hun
  // geheugen.
  const vingerafdruk = createHash("sha1")
    .update(readFileSync(bronPad))
    .update(`${kruinFractie.toFixed(4)}|${middenFractie.toFixed(4)}|${UITSNEDE_HOOGTE}|${RUIMTE_BOVEN}|${KLEIN}|${GROOT}`)
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

  // Vierkante uitsnede, met het hoofd altijd even ver van de bovenrand.
  const zijde = Math.round(H * UITSNEDE_HOOGTE);
  const top = Math.max(0, Math.min(H - zijde, Math.round(kruinFractie * H - RUIMTE_BOVEN * zijde)));
  const links = Math.max(0, Math.min(B - zijde, Math.round(middenFractie * B - zijde / 2)));

  await sharp(bronPad)
    .rotate()
    .extract({ left: links, top, width: zijde, height: zijde })
    .resize(KLEIN, KLEIN)
    .webp({ quality: 82 })
    .toFile(kleinPad);

  await sharp(bronPad)
    .rotate()
    .resize(GROOT, GROOT, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(grootPad);

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
