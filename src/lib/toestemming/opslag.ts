import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { databaseBeschikbaar, db } from "@/lib/supabase";

/**
 * De wachtrij tussen de website en de pc.
 *
 * Een ingevuld formulier moet ergens staan tot de mappenwachter op de pc het
 * komt halen. Dat is de tabel toestemming_wachtrij in Supabase (zie
 * lib/supabase.ts), want het bestandssysteem van de server is na de build
 * alleen-lezen.
 *
 * Het gaat over namen, geboortedatums en handtekeningen van minderjarigen.
 * Daarom staat er ook in de database niets leesbaar in: we versleutelen de
 * hele inhoud met AES-256-GCM met een sleutel die alleen de server en de
 * mappenwachter kennen. In de tabel staat enkel ruis.
 *
 * Zodra de wachter het bestand heeft weggeschreven, verdwijnt het hier. Wat
 * langer dan MAX_DAGEN blijft staan, ruimen we zelf op: dan is er iets
 * misgelopen en hoeven die gegevens hier niet te blijven.
 */

const TABEL = "toestemming_wachtrij";
const MAX_DAGEN = 30;

function sleutel(): Buffer | null {
  const geheim = process.env.TOESTEMMING_SLEUTEL;
  if (!geheim) return null;
  // Uit het gedeelde geheim een sleutel van 32 bytes maken. De wachter doet
  // exact hetzelfde, zodat beide kanten op dezelfde sleutel uitkomen.
  return createHash("sha256").update(`kws-toestemming|${geheim}`).digest();
}

export function opslagBeschikbaar(): boolean {
  return databaseBeschikbaar() && Boolean(sleutel());
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
  if (!databaseBeschikbaar()) {
    return { ok: false, fout: "SUPABASE_URL of SUPABASE_SECRET_KEY ontbreekt." };
  }

  const blok = versleutel(Buffer.from(JSON.stringify(item), "utf8"), key);
  const { error } = await db().from(TABEL).insert({
    kenmerk: item.kenmerk,
    blok: blok.toString("base64"),
    grootte: blok.length,
  });
  return error ? { ok: false, fout: error.message } : { ok: true, kenmerk: item.kenmerk };
}

export interface WachtrijRegel {
  kenmerk: string;
  aangemaakt: string;
  grootte: number;
}

/** Wat er klaarstaat, zonder de inhoud prijs te geven. */
export async function lijstWachtrij(): Promise<WachtrijRegel[]> {
  if (!databaseBeschikbaar()) return [];
  const { data, error } = await db()
    .from(TABEL)
    .select("kenmerk, aangemaakt, grootte")
    .order("aangemaakt", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    kenmerk: r.kenmerk,
    aangemaakt: new Date(r.aangemaakt).toISOString(),
    grootte: r.grootte,
  }));
}

/** Het versleutelde blok van één inzending, zoals de pc het verwacht. */
export async function haalBlok(kenmerk: string): Promise<Buffer | null> {
  if (!databaseBeschikbaar()) return null;
  const { data, error } = await db().from(TABEL).select("blok").eq("kenmerk", kenmerk).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? Buffer.from(data.blok, "base64") : null;
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
  if (!databaseBeschikbaar()) return false;
  const { data, error } = await db().from(TABEL).delete().eq("kenmerk", kenmerk).select("kenmerk");
  if (error) throw new Error(error.message);
  return (data ?? []).length > 0;
}

/**
 * Wat te lang blijft staan, gaat weg. Loopt mee bij elke nieuwe inzending, dus
 * er is geen aparte taak voor nodig.
 */
export async function ruimOudeOp(nu = new Date()): Promise<number> {
  if (!databaseBeschikbaar()) return 0;
  const grens = new Date(nu.getTime() - MAX_DAGEN * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await db().from(TABEL).delete().lt("aangemaakt", grens).select("kenmerk");
  if (error) throw new Error(error.message);
  return (data ?? []).length;
}
