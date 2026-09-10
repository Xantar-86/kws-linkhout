/**
 * Maakt webversies van de spelersfoto's en schrijft de ploeglijst weg.
 *
 * De originelen in `public/images/kws spelers/`, `public/images/Trainers/` en
 * `public/images/Fotos spelers/<ploeg>/` zijn te groot om rechtstreeks te
 * tonen. Per persoon komt er een klein beeld voor het raster en een groter
 * voor als je erop klikt.
 *
 * De ploeg leiden we af uit de bestandsnaam: "Mike Geybels P2.JPG" hoort bij
 * P2, en dat achtervoegsel hoort niet in de naam op de pagina. Bij de jeugd
 * staat de ploeg in de mapnaam en bevat het bestand enkel de naam.
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

/** De jeugdploegen: elke ploeg een eigen map, met de ploeg als mapnaam. */
const JEUGDMAP = "public/images/Fotos spelers";

/**
 * Waar de foto's vandaan komen. In de spelersmap staat de ploeg in de
 * bestandsnaam en herken je een trainer aan de ploeg vooraan; alles in de
 * trainersmap is per definitie een trainer, daar volstaat de naam.
 */
const BRONNEN = [
  { map: "public/images/kws spelers", altijdTrainer: false },
  { map: "public/images/Trainers", altijdTrainer: true },
  // De damesploegen hebben hun eigen map, met de ploeg vooraan in de naam en
  // een T1 achteraan bij een trainer.
  { map: "public/images/spelers p1 p2 kws ladies 2026-2027", dames: true },
  // En elke jeugdploeg een eigen map: "Fotos spelers/U11/Ibe Thoelen.jpeg".
  // Zo hoeft er hier niets bij als er een ploeg gefotografeerd wordt.
  ...(existsSync(JEUGDMAP)
    ? readdirSync(JEUGDMAP, { withFileTypes: true })
        .filter((m) => m.isDirectory())
        .map((m) => ({ map: join(JEUGDMAP, m.name), ploegUitMap: m.name, opfrissen: true }))
    : []),
];

/** Groepsfoto's horen bij de ploeg, niet bij een speelster. */
const GEEN_PORTRET = /groepsfoto/i;
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
const SNIJ_VERSIE = 12;

/**
 * Correcties voor foto's waar het zoeken naast zit.
 *
 * Het automatisch zoeken gaat uit van de ploegfotosessie: dezelfde afstand,
 * dezelfde achtergrond. Komt er een portret van elders, dan kan de kruin er
 * naast liggen. `kruin` is de hoogte van de kruin als deel van de foto,
 * `midden` de horizontale plaats, `hoogte` hoeveel van de foto de uitsnede
 * beslaat. Allemaal tussen 0 en 1.
 *
 * `draai` is iets anders: het aantal graden waarmee de speler rechtgezet
 * wordt, met de klok mee. Alleen invullen als iemand duidelijk scheef op de
 * foto staat; een beetje scheef is gewoon hoe mensen staan. `schaal` maakt
 * iemand kleiner (0.9) of groter (1.1) dan de vaste maat op de wand.
 */
const CORRECTIES = {
  "Brent Gilissen": { kruin: 0.215, midden: 0.51 },
  // Staat al als portret in beeld en vult de foto; vrijwel niets bijsnijden.
  "Luc Brants": { kruin: 0.02, midden: 0.44, hoogte: 1 },
  // Leunt op de foto naar zijn linkerkant. In het wijde beeld valt dat mee,
  // maar zonder de horizon en het doel eromheen springt het eruit. Vijf graden
  // terug zet hem recht zonder dat het gedraaid oogt.
  // Na het rechtzetten valt de schuine onderrand weg en wordt hij korter;
  // zonder dit wordt hij dan groter geschaald dan de rest en staat hij te
  // dicht op de kijker.
  "Noah Stockmans": { draai: -5, schaal: 0.95 },
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

/**
 * Haalt losse stukjes uit een uitsnede.
 *
 * Het uitknipmodel laat af en toe een snipper achtergrond staan die nergens
 * aan vastzit: een stukje doelnet, een reclamebord, een tak. Op de foto valt
 * dat niet op, maar op de donkere clubwand zweeft het ineens los naast de
 * speler.
 *
 * We houden daarom alleen wat aan de speler vastzit. Alles wat kleiner is dan
 * een twintigste van het grootste stuk gaat weg; dat is klein genoeg om een
 * uitgestoken arm of een bal in de hand te sparen, en groot genoeg om
 * snippers te vangen.
 *
 * De ondergrens ligt bewust laag. Een snipper is vaak halfdoorzichtig: op de
 * foto amper te zien, maar op de donkere wand een duidelijke veeg. Met een
 * hoge drempel telt zo'n veeg niet als eigen stuk en blijft hij staan.
 */
const SNIPPER_DEEL = 0.05;
const SNIPPER_ONDERGRENS = 24;

async function schoneUitsnede(pad) {
  const { data, info } = await sharp(pad)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const B = info.width;
  const H = info.height;
  const groep = new Int32Array(B * H).fill(-1);
  const groottes = [];
  const stapel = new Int32Array(B * H);

  for (let start = 0; start < B * H; start++) {
    if (groep[start] !== -1 || data[start * 4 + 3] < SNIPPER_ONDERGRENS) continue;
    const nummer = groottes.length;
    let top = 0;
    let aantal = 0;
    stapel[top++] = start;
    groep[start] = nummer;
    while (top > 0) {
      const punt = stapel[--top];
      aantal++;
      const x = punt % B;
      const y = (punt - x) / B;
      // Vier buren volstaat; diagonaal verbinden plakt losse snippers juist
      // weer aan de speler vast.
      if (x > 0) {
        const b = punt - 1;
        if (groep[b] === -1 && data[b * 4 + 3] >= SNIPPER_ONDERGRENS) { groep[b] = nummer; stapel[top++] = b; }
      }
      if (x < B - 1) {
        const b = punt + 1;
        if (groep[b] === -1 && data[b * 4 + 3] >= SNIPPER_ONDERGRENS) { groep[b] = nummer; stapel[top++] = b; }
      }
      if (y > 0) {
        const b = punt - B;
        if (groep[b] === -1 && data[b * 4 + 3] >= SNIPPER_ONDERGRENS) { groep[b] = nummer; stapel[top++] = b; }
      }
      if (y < H - 1) {
        const b = punt + B;
        if (groep[b] === -1 && data[b * 4 + 3] >= SNIPPER_ONDERGRENS) { groep[b] = nummer; stapel[top++] = b; }
      }
    }
    groottes.push(aantal);
  }

  if (groottes.length <= 1) return { buffer: await sharp(pad).png().toBuffer(), weg: 0 };

  const grootste = Math.max(...groottes);
  const grens = grootste * SNIPPER_DEEL;
  let weg = 0;
  for (let p = 0; p < B * H; p++) {
    if (data[p * 4 + 3] === 0) continue;
    const g = groep[p];
    // Wat nergens bij hoort is te flauw om iets te zijn, en wat bij een te
    // klein stuk hoort is een snipper. Allebei weg.
    if (g === -1 || groottes[g] < grens) {
      data[p * 4 + 3] = 0;
      weg++;
    }
  }

  return {
    buffer: await sharp(data, { raw: { width: B, height: H, channels: 4 } }).png().toBuffer(),
    weg,
  };
}

/**
 * Snijdt de wig onderaan weg die door het draaien ontstaat.
 *
 * Een foto eindigt onderaan recht, maar na een paar graden draaien loopt die
 * rand schuin en blijft er aan een kant een driehoek leeg. Op de wand zie je
 * dan achtergrond onder de speler in plaats van de speler zelf. We zoeken van
 * onderen af de eerste rij waar hij over vrijwel de volle breedte staat en
 * snijden alles daaronder weg.
 */
const ONDERKANT_DEEL = 0.92;

async function rechteOnderkant(png) {
  const { data, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const B = info.width;
  const H = info.height;

  const perRij = new Uint32Array(H);
  for (let y = 0; y < H; y++) {
    let n = 0;
    for (let x = 0; x < B; x++) if (data[(y * B + x) * 4 + 3] >= 128) n++;
    perRij[y] = n;
  }

  // De breedste rij in het onderste derde is de maat; daaronder mag het niet
  // veel smaller worden.
  let breedst = 0;
  for (let y = Math.floor(H * 0.66); y < H; y++) breedst = Math.max(breedst, perRij[y]);
  let onder = H - 1;
  while (onder > 0 && perRij[onder] < breedst * ONDERKANT_DEEL) onder--;

  if (onder >= H - 1) return png;
  return sharp(png)
    .extract({ left: 0, top: 0, width: B, height: onder + 1 })
    .png()
    .toBuffer();
}

/**
 * De opfrisbeurt voor een fotosessie die is bijgewerkt moet worden.
 *
 * HIER hoort elke nieuwe bewerking aan een portret thuis, en nergens anders.
 *
 * De reden is dit script zelf: het maakt bij elke run alle honderd portretten
 * opnieuw. Zet je een bewerking in de gewone gang, dan verandert daarmee ook
 * elk portret dat er al jaren staat en dat zo goedgekeurd is. Dat is twee keer
 * gebeurd voor deze functie er was.
 *
 * Staat `aan` uit, dan komt de uitsnede er onveranderd weer uit en blijft het
 * bestand tot op de byte hetzelfde als wat er nu online staat.
 */
async function opfrisbeurt(knipPad, { aan, draai }) {
  if (!aan) {
    return {
      buffer: await sharp(knipPad).png().toBuffer(),
      toon: {
        versterking: TOON_MIN,
        verschuiving: -6,
        wit: [1, 1, 1],
        verzadiging: 1.2,
      },
      snippers: 0,
    };
  }

  // 1. Losse snippers achtergrond eruit, voor er iets gemeten wordt.
  const schoon = await schoneUitsnede(knipPad);

  // 2. Rechtzetten wie scheef staat. De achtergrond is al weg, dus dit laat
  //    geen lege hoeken na.
  const buffer = draai
    ? await rechteOnderkant(
        await sharp(schoon.buffer)
          .rotate(draai, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .trim({ threshold: 1 })
          .png()
          .toBuffer()
      )
    : schoon.buffer;

  // Kleur en belichting doen we hier niet; zie TOON_MIN.
  const toon = { versterking: TOON_MIN, verschuiving: -6, wit: [1, 1, 1], verzadiging: 1.2 };

  return { buffer, toon, snippers: schoon.weg };
}

/**
 * De vaste, milde aanzet die elk portret op de wand krijgt: iets meer kleur
 * en contrast, omdat verkleinen een beeld weker maakt en shirts op een
 * donkere wand snel flets ogen. Meer dan dit doen we hier NIET: kleur en
 * belichting van een bleke foto zijn werk voor ComfyUI (Qwen-Image-Edit,
 * _verlevendig.mjs in C:\Personal\KWS-Affiches), vooraf op de foto zelf.
 */
const TOON_MIN = 1.06;

/** Ophogen bij elke wijziging aan de opfrisbeurt; zie de vingerafdruk. */
const OPFRIS_VERSIE = 5;

const teDoen = BRONNEN.filter((b) => existsSync(b.map)).flatMap((bron) =>
  readdirSync(bron.map)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .map((bestand) => ({ ...bron, bestand }))
);

for (const { map, bestand, altijdTrainer, dames, ploegUitMap, opfrissen } of teDoen) {
  if (GEEN_PORTRET.test(bestand)) continue;
  const zonderExtensie = bestand.replace(/\.[^.]+$/, "").trim();

  // Staat de ploeg vooraan, dan is het een trainer. Achteraan of helemaal
  // niet is een speler: bij welke kern hij hoort staat in lib/kernen.ts en
  // niet in de bestandsnaam, dus dat achtervoegsel mag ook weg blijven.
  const achteraan = zonderExtensie.match(/^(.*?)\s+(P2|P4)$/i);
  const vooraan = zonderExtensie.match(/^(P2|P4)\s+(.*)$/i);

  let naam;
  let ploeg;
  let isTrainer = altijdTrainer;

  const damesRij = zonderExtensie.match(/^(P1|P2)\s+(.*)$/i);

  if (ploegUitMap) {
    // Bij de jeugd zegt de map de ploeg en het bestand de naam. Staat er een
    // T1 achter, dan is het de trainer van die ploeg: die wordt op dezelfde
    // dag en tegen hetzelfde doek gefotografeerd als zijn spelers, dus hij
    // hoort in dezelfde map te kunnen staan.
    const jeugdTrainer = zonderExtensie.match(/^(.*?)\s+T\d$/i);
    naam = jeugdTrainer ? jeugdTrainer[1].trim() : zonderExtensie;
    ploeg = ploegUitMap;
    isTrainer = jeugdTrainer !== null;
  } else if (dames && damesRij) {
    // "P1 Frank Schroyen T1" is de trainer van de eerste damesploeg.
    ploeg = `Dames ${damesRij[1].toUpperCase()}`;
    naam = damesRij[2].replace(/\s+T\d$/i, "").trim();
    isTrainer = naam !== damesRij[2].trim();
  } else if (altijdTrainer) {
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
  const draai = correctie.draai ?? 0;
  const schaal = correctie.schaal ?? 1;

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
        // Achteraan en alleen als ze afwijken: zo blijft de naam van elk
        // portret dat hier niets mee te maken heeft precies wat hij was.
        // Verandert de opfrisbeurt, dan verandert het webadres van wie erdoor
        // gaat wel mee, anders blijft de browser de oude versie tonen.
        ...(draai ? [`draai${draai}`] : []),
        ...(schaal !== 1 ? [`schaal${schaal}`] : []),
        ...(opfrissen === true ? [`opfris${OPFRIS_VERSIE}`] : []),
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

  // Een uitsnede van een duimnagel levert alleen maar een vlek op; dan is de
  // gewone foto beter af.
  const knipMaat = existsSync(knipPad) ? await sharp(knipPad).metadata() : null;
  const bruikbareKnip = knipMaat !== null && Math.max(knipMaat.width, knipMaat.height) >= 400;

  // Buiten de tak, zodat de gemeten waarden verderop nog te melden zijn.
  let toon = null;
  let snippers = 0;

  if (bruikbareKnip) {
    // Verkleinen maakt een beeld altijd wat weker, en op een donkere wand
    // ogen de shirts al snel flets. Daarom na het verkleinen verscherpen en
    // de kleur en het contrast wat aanzetten; dat haalt het rood terug.
    // EEN hek om alles wat nieuw is. Zie de uitleg bij opfrisbeurt().
    const opgefrist = await opfrisbeurt(knipPad, { aan: opfrissen === true, draai });
    snippers = opgefrist.snippers;
    toon = opgefrist.toon;
    const persoon = await sharp(opgefrist.buffer)
      .resize({
        height: Math.round(GROOT * 0.9 * schaal),
        width: Math.round(portretBreed * 0.94 * schaal),
        fit: "inside",
      })
      // Witbalans en contrast in een keer: per kanaal een eigen versterking.
      // Eerst dit en pas daarna de verzadiging, anders wordt de zweem mee
      // opgeblazen in plaats van weggewerkt.
      .linear(
        toon.wit.map((w) => toon.versterking * w),
        [toon.verschuiving, toon.verschuiving, toon.verschuiving]
      )
      .modulate({ saturation: toon.verzadiging })
      .sharpen({ sigma: 1.1, m1: 0.6, m2: 2.4 })
      .toBuffer();

    const gerekt = persoon;
    const maat = await sharp(gerekt).metadata();
    const persoonLinks = Math.round((portretBreed - maat.width) / 2);
    const persoonTop = GROOT - maat.height;

    await sharp(await clubwand(portretBreed, GROOT))
      .composite([{ input: gerekt, left: persoonLinks, top: persoonTop }])
      .webp({ quality: 86 })
      .toFile(grootPad);

    // Het vierkantje wordt om het hoofd gelegd in plaats van om een vaste
    // plek in het beeld. De bovenkant van de uitsnede is de kruin, en een kop
    // met schouders is ongeveer even hoog als de speler breed is. Zo staat
    // iedereen goed, of hij nu ten voeten uit of tot de borst gefotografeerd
    // is.
    const zijde = Math.min(
      portretBreed,
      GROOT,
      Math.round(Math.min(maat.width * 1.2, maat.height))
    );
    const zijLinks = Math.max(
      0,
      Math.min(portretBreed - zijde, Math.round(persoonLinks + maat.width / 2 - zijde / 2))
    );
    const zijTop = Math.max(
      0,
      Math.min(GROOT - zijde, Math.round(persoonTop - zijde * 0.06))
    );

    await sharp(grootPad)
      .extract({ left: zijLinks, top: zijTop, width: zijde, height: zijde })
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
      `  kruin ${kruinFractie.toFixed(3)}  midden ${middenFractie.toFixed(3)}` +
      (toon
        ? `  toon x${toon.versterking.toFixed(2)}${toon.versterking > 1.15 ? " opgehaald" : ""}`
        : "") +
      (snippers > 0 ? `  ${snippers} snipperpunten weg` : "") +
      (draai ? `  ${draai} graden rechtgezet` : "")
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
  "// zet een foto in public/images/kws spelers/ of in public/images/Fotos",
  "// spelers/<ploeg>/ en draai het script opnieuw.",
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
  "/**",
  " * De foto van een trainer, als die er is.",
  " *",
  " * Een jeugdtrainer speelt soms zelf nog bij een van de ploegen. Zijn foto",
  " * staat dan bij de spelers en niet bij de trainers, en die willen we hier",
  " * evengoed tonen.",
  " */",
  "export function trainerFoto(naam: string): Speler | undefined {",
  "  const zelfde = (s: Speler) => s.naam.toLowerCase() === naam.toLowerCase();",
  "  return trainers.find(zelfde) ?? spelers.find(zelfde);",
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
