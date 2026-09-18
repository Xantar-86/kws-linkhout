import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { del, list, put } from "@vercel/blob";

/**
 * De wachtrij tussen de website en de pc.
 *
 * Een ingevuld formulier moet ergens staan tot de mappenwachter op de pc het
 * komt halen. Dat is Vercel Blob, want het bestandssysteem van de server is na
 * de build alleen-lezen.
 *
 * Blob-adressen zijn niet te raden maar wel openbaar leesbaar, en hier gaat
 * het over namen, geboortedatums en handtekeningen van minderjarigen. Daarom
 * staat er niets leesbaar in: we versleutelen de hele inhoud met AES-256-GCM
 * met een sleutel die alleen de server en de mappenwachter kennen. Wie het
 * adres zou kennen, ziet enkel ruis.
 *
 * Zodra de wachter het bestand heeft weggeschreven, verdwijnt het hier. Wat
 * langer dan MAX_DAGEN blijft staan, ruimen we zelf op: dan is er iets
 * misgelopen en hoeven die gegevens hier niet te blijven.
 */

const MAP = "toestemming";
const MAX_DAGEN = 30;

function sleutel(): Buffer | null {
  const geheim = process.env.TOESTEMMING_SLEUTEL;
  if (!geheim) return null;
  // Uit het gedeelde geheim een sleutel van 32 bytes maken. De wachter doet
  // exact hetzelfde, zodat beide kanten op dezelfde sleutel uitkomen.
  return createHash("sha256").update(`kws-toestemming|${geheim}`).digest();
}

export function opslagBeschikbaar(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN) && Boolean(sleutel());
}

/** Wat er versleuteld in de wachtrij komt te staan. */
export interface WachtrijItem {
  kenmerk: string;
  bestandsnaam: string;
  /** De ploeg, en dus de submap onder "Goedkeuring Spelers". */
  ploeg: string;
  speler: string;
  aangemaakt: string;
  /** De ingevulde pdf, als base64. */
  pdf: string;
}

/**
 * Versleutelt naar een blok van [12 bytes nonce][16 bytes keurmerk][inhoud].
 * Eén blok, zodat de wachter niets hoeft samen te rapen.
 */
function versleutel(gegevens: Buffer, key: Buffer): Buffer {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, nonce);
  const inhoud = Buffer.concat([cipher.update(gegevens), cipher.final()]);
  return Buffer.concat([nonce, cipher.getAuthTag(), inhoud]);
}

function ontsleutel(blok: Buffer, key: Buffer): Buffer {
  const nonce = blok.subarray(0, 12);
  const keurmerk = blok.subarray(12, 28);
  const decipher = createDecipheriv("aes-256-gcm", key, nonce);
  decipher.setAuthTag(keurmerk);
  return Buffer.concat([decipher.update(blok.subarray(28)), decipher.final()]);
}

export interface BewaarResultaat {
  ok: boolean;
  kenmerk?: string;
  fout?: string;
}

/** Zet een ingevuld formulier in de wachtrij. */
export async function bewaarInWachtrij(item: WachtrijItem): Promise<BewaarResultaat> {
  const key = sleutel();
  if (!key) {
    return { ok: false, fout: "TOESTEMMING_SLEUTEL ontbreekt." };
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, fout: "BLOB_READ_WRITE_TOKEN ontbreekt." };
  }

  try {
    const blok = versleutel(Buffer.from(JSON.stringify(item), "utf8"), key);
    await put(`${MAP}/${item.kenmerk}.bin`, blok, {
      access: "public",
      contentType: "application/octet-stream",
      addRandomSuffix: false,
      // Geen caches ertussen: het bestand wordt één keer gehaald en dan weg.
      cacheControlMaxAge: 0,
    });
    return { ok: true, kenmerk: item.kenmerk };
  } catch (fout) {
    return { ok: false, fout: fout instanceof Error ? fout.message : "Onbekende fout" };
  }
}

export interface WachtrijRegel {
  kenmerk: string;
  aangemaakt: string;
  grootte: number;
}

/** Wat er klaarstaat, zonder de inhoud prijs te geven. */
export async function lijstWachtrij(): Promise<WachtrijRegel[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  const { blobs } = await list({ prefix: `${MAP}/` });
  return blobs
    .filter((b) => b.pathname.endsWith(".bin"))
    .map((b) => ({
      kenmerk: b.pathname.slice(MAP.length + 1, -4),
      aangemaakt: b.uploadedAt instanceof Date ? b.uploadedAt.toISOString() : String(b.uploadedAt),
      grootte: b.size,
    }))
    .sort((a, b) => a.aangemaakt.localeCompare(b.aangemaakt));
}

/** Het versleutelde blok van één inzending, zoals het in de blob staat. */
export async function haalBlok(kenmerk: string): Promise<Buffer | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const { blobs } = await list({ prefix: `${MAP}/${kenmerk}.bin` });
  const blob = blobs.find((b) => b.pathname === `${MAP}/${kenmerk}.bin`);
  if (!blob) return null;
  const antwoord = await fetch(blob.url, { cache: "no-store" });
  if (!antwoord.ok) return null;
  return Buffer.from(await antwoord.arrayBuffer());
}

/** Voor de server zelf: de inhoud van een wachtrij-item leesbaar maken. */
export function leesBlok(blok: Buffer): WachtrijItem | null {
  const key = sleutel();
  if (!key) return null;
  try {
    return JSON.parse(ontsleutel(blok, key).toString("utf8")) as WachtrijItem;
  } catch {
    return null;
  }
}

/** Uit de wachtrij halen, nadat de pc het bestand heeft weggeschreven. */
export async function schrapUitWachtrij(kenmerk: string): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  const { blobs } = await list({ prefix: `${MAP}/${kenmerk}.bin` });
  const blob = blobs.find((b) => b.pathname === `${MAP}/${kenmerk}.bin`);
  if (!blob) return false;
  await del(blob.url);
  return true;
}

/**
 * Wat te lang blijft staan, gaat weg. Loopt mee bij elke nieuwe inzending, dus
 * er is geen aparte taak voor nodig.
 */
export async function ruimOudeOp(nu = new Date()): Promise<number> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 0;
  const grens = nu.getTime() - MAX_DAGEN * 24 * 60 * 60 * 1000;
  const { blobs } = await list({ prefix: `${MAP}/` });
  let weg = 0;
  for (const blob of blobs) {
    const op = blob.uploadedAt instanceof Date ? blob.uploadedAt.getTime() : Date.parse(String(blob.uploadedAt));
    if (Number.isFinite(op) && op < grens) {
      await del(blob.url);
      weg += 1;
    }
  }
  return weg;
}
