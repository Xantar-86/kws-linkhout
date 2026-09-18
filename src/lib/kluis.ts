import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * Kleine kluis voor gegevens die in Vercel Blob terechtkomen.
 *
 * Een blob-adres is niet te raden maar wel openbaar leesbaar. Voor
 * inschrijvingen en formulieren met namen, adressen en bedragen is dat niet
 * genoeg, dus gaat de inhoud er versleuteld in. De sleutel staat enkel in de
 * omgevingsvariabelen van de site en bij het programma op de pc dat de
 * bestanden ophaalt.
 *
 * AES-256-GCM: naast geheimhouding geeft dat ook een keurmerk, zodat een
 * gewijzigd blok niet stilletjes verkeerd gelezen wordt maar een fout geeft.
 *
 * Eén blok ziet er zo uit: [12 bytes nonce][16 bytes keurmerk][inhoud].
 *
 * lib/toestemming/opslag.ts doet hetzelfde met zijn eigen kopie van deze code;
 * die mag hier later overstappen.
 */

/** Uit een geheim een sleutel van 32 bytes maken, met een eigen doel-tekst. */
export function sleutelUit(geheim: string, doel: string): Buffer {
  return createHash("sha256").update(`${doel}|${geheim}`).digest();
}

export function versleutel(gegevens: Buffer, sleutel: Buffer): Buffer {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", sleutel, nonce);
  const inhoud = Buffer.concat([cipher.update(gegevens), cipher.final()]);
  return Buffer.concat([nonce, cipher.getAuthTag(), inhoud]);
}

export function ontsleutel(blok: Buffer, sleutel: Buffer): Buffer {
  const nonce = blok.subarray(0, 12);
  const keurmerk = blok.subarray(12, 28);
  const decipher = createDecipheriv("aes-256-gcm", sleutel, nonce);
  decipher.setAuthTag(keurmerk);
  return Buffer.concat([decipher.update(blok.subarray(28)), decipher.final()]);
}

/** Versleutelt een object als JSON. */
export function versleutelJson(waarde: unknown, sleutel: Buffer): Buffer {
  return versleutel(Buffer.from(JSON.stringify(waarde), "utf8"), sleutel);
}

/** Leest een versleuteld blok terug als object, of null als dat niet lukt. */
export function ontsleutelJson<T>(blok: Buffer, sleutel: Buffer): T | null {
  try {
    return JSON.parse(ontsleutel(blok, sleutel).toString("utf8")) as T;
  } catch {
    return null;
  }
}
