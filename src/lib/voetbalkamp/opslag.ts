import { del, list, put } from "@vercel/blob";
import { ontsleutelJson, sleutelUit, versleutelJson } from "@/lib/kluis";
import { KAMP, type KampInschrijving } from "./kamp";

/**
 * De inschrijvingen voor het voetbalkamp.
 *
 * Zelfde opzet als het mosselfeest (lib/mosselfeest/opslag.ts): elke
 * inschrijving is één versleuteld blokje in Vercel Blob, en het overzicht en
 * het Excel-bestand worden er telkens uit opgebouwd.
 *
 * De sleutel komt uit KAMP_SLEUTEL, en anders uit MOSSELFEEST_SLEUTEL. Met een
 * eigen doel-tekst, dus ook met hetzelfde geheim zijn het andere sleutels.
 */

const MAP = `voetbalkamp/${KAMP.id}`;

function sleutel(): Buffer | null {
  const geheim = process.env.KAMP_SLEUTEL ?? process.env.MOSSELFEEST_SLEUTEL;
  return geheim ? sleutelUit(geheim, "kws-voetbalkamp") : null;
}

export function opslagBeschikbaar(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN) && Boolean(sleutel());
}

function pad(kenmerk: string): string {
  return `${MAP}/${kenmerk}.bin`;
}

/** Een uniek adres, zodat de cache van de opslag nooit een oude versie geeft. */
function vers(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}vers=${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function bewaarInschrijving(
  inschrijving: KampInschrijving,
): Promise<{ ok: boolean; fout?: string }> {
  const key = sleutel();
  if (!key) return { ok: false, fout: "KAMP_SLEUTEL of MOSSELFEEST_SLEUTEL ontbreekt." };
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { ok: false, fout: "BLOB_READ_WRITE_TOKEN ontbreekt." };
  try {
    await put(pad(inschrijving.kenmerk), versleutelJson(inschrijving, key), {
      access: "public",
      contentType: "application/octet-stream",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return { ok: true };
  } catch (fout) {
    return { ok: false, fout: fout instanceof Error ? fout.message : "Onbekende fout" };
  }
}

/** Alle inschrijvingen, oudste eerst. */
export async function alleInschrijvingen(): Promise<KampInschrijving[]> {
  const key = sleutel();
  if (!key || !process.env.BLOB_READ_WRITE_TOKEN) return [];

  const adressen: string[] = [];
  let cursor: string | undefined;
  do {
    const pagina = await list({ prefix: `${MAP}/`, cursor });
    adressen.push(...pagina.blobs.filter((b) => b.pathname.endsWith(".bin")).map((b) => b.url));
    cursor = pagina.hasMore ? pagina.cursor : undefined;
  } while (cursor);

  const gevonden: KampInschrijving[] = [];
  const TEGELIJK = 12;
  for (let i = 0; i < adressen.length; i += TEGELIJK) {
    const stukken = await Promise.all(
      adressen.slice(i, i + TEGELIJK).map(async (adres) => {
        try {
          const antwoord = await fetch(vers(adres), { cache: "no-store" });
          if (!antwoord.ok) return null;
          return ontsleutelJson<KampInschrijving>(Buffer.from(await antwoord.arrayBuffer()), key);
        } catch {
          return null;
        }
      }),
    );
    for (const stuk of stukken) {
      if (stuk && typeof stuk.kenmerk === "string" && typeof stuk.aangemeld === "string") {
        gevonden.push(stuk);
      }
    }
  }
  return gevonden.sort((a, b) => a.aangemeld.localeCompare(b.aangemeld));
}

export async function haalInschrijving(kenmerk: string): Promise<KampInschrijving | null> {
  const key = sleutel();
  if (!key || !process.env.BLOB_READ_WRITE_TOKEN) return null;
  const { blobs } = await list({ prefix: pad(kenmerk) });
  const blob = blobs.find((b) => b.pathname === pad(kenmerk));
  if (!blob) return null;
  const antwoord = await fetch(vers(blob.url), { cache: "no-store" });
  if (!antwoord.ok) return null;
  return ontsleutelJson<KampInschrijving>(Buffer.from(await antwoord.arrayBuffer()), key);
}

export async function schrapInschrijving(kenmerk: string): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  const { blobs } = await list({ prefix: pad(kenmerk) });
  const blob = blobs.find((b) => b.pathname === pad(kenmerk));
  if (!blob) return false;
  await del(blob.url);
  return true;
}
