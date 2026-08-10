import { put, head, list, del } from "@vercel/blob";

/**
 * Opslag van de affiches en het meldingenlogboek in Vercel Blob.
 *
 * Instagram haalt de afbeelding zelf op bij het publiceren, dus die moet op een
 * publiek bereikbare URL staan. Vercel Blob geeft zo'n URL rechtstreeks terug.
 * Het bestandssysteem van de server is na de build alleen-lezen, dus naar
 * public/ schrijven kan niet.
 *
 * Vercel injecteert BLOB_READ_WRITE_TOKEN automatisch zodra er een Blob-store
 * aan het project gekoppeld is. Lokaal zet je die variabele zelf in .env.local.
 */

function beschikbaar(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Bestandsnaam van een affiche. Dezelfde wedstrijd geeft altijd dezelfde naam. */
function afficheNaam(opts: {
  ploegSlug: string;
  soort: "wedstrijd" | "uitslag";
  aftrapIso: string;
  ext?: string;
}): string {
  const stempel = opts.aftrapIso.replace(/[^0-9]/g, "").slice(0, 12);
  return `affiches/${opts.ploegSlug}-${opts.soort}-${stempel}.${opts.ext ?? "png"}`;
}

export interface OpslagResultaat {
  ok: boolean;
  url?: string;
  fout?: string;
}

/**
 * Bewaart een affiche en geeft de publieke URL terug. Een nieuwe poging voor
 * dezelfde wedstrijd vervangt de vorige.
 */
export async function bewaarAffiche(opts: {
  ploegSlug: string;
  soort: "wedstrijd" | "uitslag";
  aftrapIso: string;
  bytes: Buffer;
  mime: string;
}): Promise<OpslagResultaat> {
  if (!beschikbaar()) {
    return {
      ok: false,
      fout:
        "BLOB_READ_WRITE_TOKEN ontbreekt. Koppel een Blob-store aan het Vercel-project.",
    };
  }

  const ext = opts.mime === "image/png" ? "png" : opts.mime === "image/webp" ? "webp" : "jpg";
  const naam = afficheNaam({ ...opts, ext });

  try {
    // Oudere versies met een andere extensie opruimen, anders blijft een
    // vorige poging als losse blob achter.
    await verwijderAndereExtensies(naam);

    const resultaat = await put(naam, opts.bytes, {
      access: "public",
      contentType: opts.mime,
      // Zonder deze vlag krijgt elke upload een willekeurig achtervoegsel,
      // waardoor de URL per poging verandert.
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 3600,
    });

    return { ok: true, url: resultaat.url };
  } catch (error) {
    console.error("[social] affiche opslaan mislukt:", error);
    return { ok: false, fout: error instanceof Error ? error.message : String(error) };
  }
}

/** Ruimt dezelfde affiche met een andere extensie op. */
async function verwijderAndereExtensies(behoud: string): Promise<void> {
  const zonderExt = behoud.replace(/\.[a-z]+$/, "");
  for (const ext of ["png", "jpg", "webp"]) {
    const naam = `${zonderExt}.${ext}`;
    if (naam === behoud) continue;
    try {
      const bestaat = await head(naam);
      if (bestaat) await del(bestaat.url);
    } catch {
      // Bestond niet; niets te doen.
    }
  }
}

/**
 * Geeft de URL van een eerder bewaarde affiche, of null als die er niet is.
 * Zo weet de voorstelmail of het beeld al klaarstaat.
 */
export async function haalAffiche(opts: {
  ploegSlug: string;
  soort: "wedstrijd" | "uitslag";
  aftrapIso: string;
}): Promise<string | null> {
  if (!beschikbaar()) return null;

  for (const ext of ["png", "jpg", "webp"]) {
    try {
      const gevonden = await head(afficheNaam({ ...opts, ext }));
      if (gevonden) return gevonden.url;
    } catch {
      // Deze extensie bestaat niet; volgende proberen.
    }
  }
  return null;
}

/**
 * Het meldingenlogboek: welke wedstrijden zijn al gemaild, en welke posts staan
 * al op Facebook of Instagram. Een leeg bestandje per gebeurtenis is genoeg;
 * het bestaan ervan is de markering.
 */
function markeringNaam(soort: string, sleutel: string): string {
  return `logboek/${soort}/${sleutel.replace(/[^a-zA-Z0-9._-]/g, "_")}.txt`;
}

/** True als deze markering al bestaat. */
export async function isGemarkeerd(soort: string, sleutel: string): Promise<boolean> {
  if (!beschikbaar()) {
    console.warn("[social] geen blob-opslag, dubbelcontrole overgeslagen");
    return false;
  }
  try {
    const gevonden = await head(markeringNaam(soort, sleutel));
    return Boolean(gevonden);
  } catch {
    return false;
  }
}

/** Zet een markering, zodat dezelfde gebeurtenis niet nog eens verwerkt wordt. */
export async function markeer(
  soort: string,
  sleutel: string,
  inhoud = ""
): Promise<void> {
  if (!beschikbaar()) return;
  try {
    await put(markeringNaam(soort, sleutel), inhoud || new Date().toISOString(), {
      access: "public",
      contentType: "text/plain",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (error) {
    console.error("[social] markering schrijven mislukt:", error);
  }
}

/** Alle markeringen van een soort, handig voor diagnose. */
export async function lijstMarkeringen(soort: string): Promise<string[]> {
  if (!beschikbaar()) return [];
  try {
    const resultaat = await list({ prefix: `logboek/${soort}/` });
    return resultaat.blobs.map((b) => b.pathname);
  } catch {
    return [];
  }
}
