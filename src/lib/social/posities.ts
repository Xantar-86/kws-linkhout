import { readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * Posities van de tekstvelden op het clubsjabloon.
 *
 * Het sjabloon is een ontworpen beeld: de achtergrond, het clublogo, de kop en
 * de lege penseelvlakken zitten er al in. Deze module zegt alleen waar de
 * variabele tekst en de logo's terechtkomen.
 *
 * Alles in percentages van de affichegrootte, zodat het klopt ongeacht de
 * resolutie van het sjabloonbestand. Bijstellen doe je in
 * content/social/affiche-posities.json, niet in de code.
 */

export interface Vak {
  left: number;
  top: number;
  breedte: number;
  hoogte?: number;
}

export interface AffichePosities {
  balk: Vak;
  badge: Vak;
  vlakLinks: Vak;
  vlakRechts: Vak;
  midden: Vak;
  veld: Vak;
  kantine: Vak;
}

export interface PositieConfig {
  wedstrijd: AffichePosities;
  uitslag: AffichePosities;
}

const STANDAARD: PositieConfig = {
  wedstrijd: {
    balk: { left: 30, top: 25.5, breedte: 49.5, hoogte: 8.3 },
    badge: { left: 35.5, top: 35, breedte: 34.5, hoogte: 2.6 },
    vlakLinks: { left: 4.4, top: 38.5, breedte: 42, hoogte: 22.5 },
    vlakRechts: { left: 56.5, top: 38, breedte: 37.5, hoogte: 22.5 },
    midden: { left: 46.5, top: 45, breedte: 10, hoogte: 9 },
    veld: { left: 31.5, top: 68.5, breedte: 22 },
    kantine: { left: 64.5, top: 68.5, breedte: 24 },
  },
  uitslag: {
    balk: { left: 30.5, top: 29.3, breedte: 53.5, hoogte: 8 },
    badge: { left: 35.8, top: 38.5, breedte: 37, hoogte: 2.6 },
    vlakLinks: { left: 3, top: 42.5, breedte: 44, hoogte: 23.5 },
    vlakRechts: { left: 58.5, top: 42.5, breedte: 39, hoogte: 23.5 },
    midden: { left: 47.5, top: 50, breedte: 11, hoogte: 9 },
    veld: { left: 31.5, top: 71.5, breedte: 22 },
    kantine: { left: 64.5, top: 71.5, breedte: 24 },
  },
};

let cache: PositieConfig | null = null;

export function getPosities(): PositieConfig {
  if (cache) return cache;
  try {
    const pad = join(process.cwd(), "content", "social", "affiche-posities.json");
    const data = JSON.parse(readFileSync(pad, "utf-8"));
    cache = {
      wedstrijd: { ...STANDAARD.wedstrijd, ...data.wedstrijd },
      uitslag: { ...STANDAARD.uitslag, ...data.uitslag },
    };
  } catch (error) {
    console.error("[social] posities niet leesbaar, standaard gebruikt:", error);
    cache = STANDAARD;
  }
  return cache;
}

/** Rekent een vak in percentages om naar pixels binnen de affiche. */
export function naarPixels(vak: Vak, breedte: number, hoogte: number) {
  return {
    left: Math.round((vak.left / 100) * breedte),
    top: Math.round((vak.top / 100) * hoogte),
    width: Math.round((vak.breedte / 100) * breedte),
    height: vak.hoogte ? Math.round((vak.hoogte / 100) * hoogte) : undefined,
  };
}

/**
 * Leest breedte en hoogte uit een PNG- of JPEG-bestand, zonder beeldbibliotheek.
 * We hebben die nodig om de affiche exact even groot te maken als het sjabloon;
 * dan klopt elke procentuele positie en wordt er niets bijgesneden.
 */
function afmetingen(pad: string): { breedte: number; hoogte: number } | null {
  try {
    const buf = readFileSync(pad);

    // PNG: de IHDR-chunk staat vast op byte 16.
    if (buf.length > 24 && buf.toString("ascii", 1, 4) === "PNG") {
      return { breedte: buf.readUInt32BE(16), hoogte: buf.readUInt32BE(20) };
    }

    // JPEG: doorloop de markers tot een Start Of Frame.
    if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) {
          i++;
          continue;
        }
        const marker = buf[i + 1];
        // SOF0 tot SOF15, met uitzondering van de niet-frame markers.
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { hoogte: buf.readUInt16BE(i + 5), breedte: buf.readUInt16BE(i + 7) };
        }
        i += 2 + buf.readUInt16BE(i + 2);
      }
    }
  } catch (error) {
    console.error("[social] afmetingen lezen mislukt:", error);
  }
  return null;
}

export interface Sjabloon {
  url: string;
  breedte: number;
  hoogte: number;
}

/**
 * Het lege clubsjabloon voor een variant, of null als het er nog niet is.
 * Zonder sjabloon valt de affiche terug op de zelf getekende versie.
 */
export function getSjabloon(
  soort: "wedstrijd" | "uitslag",
  origin: string
): Sjabloon | null {
  const map = join(process.cwd(), "public", "images", "social");
  for (const ext of ["png", "jpg", "jpeg"]) {
    const naam = `sjabloon-${soort}.${ext}`;
    const pad = join(map, naam);
    if (!existsSync(pad)) continue;

    const maat = afmetingen(pad);
    if (!maat) continue;

    return {
      url: `${origin}/images/social/${naam}`,
      breedte: maat.breedte,
      hoogte: maat.hoogte,
    };
  }
  return null;
}
