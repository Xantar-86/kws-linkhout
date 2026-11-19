import { databaseBeschikbaar, db } from "@/lib/supabase";

/**
 * Opslag van de affiches en het meldingenlogboek, in Supabase (zie
 * lib/supabase.ts).
 *
 * Instagram haalt de afbeelding zelf op bij het publiceren, dus die moet op een
 * publiek bereikbare URL staan: de affiches staan in de publieke bucket
 * "affiches". Het bestandssysteem van de server is na de build alleen-lezen,
 * dus naar public/ schrijven kan niet. Het logboek staat in de tabel
 * social_markeringen.
 */

const BUCKET = "affiches";

function beschikbaar(): boolean {
  return databaseBeschikbaar();
}

/** Bestandsnaam van een affiche. Dezelfde wedstrijd geeft altijd dezelfde naam. */
function afficheNaam(opts: {
  ploegSlug: string;
  soort: "wedstrijd" | "uitslag";
  aftrapIso: string;
  ext?: string;
}): string {
  const stempel = opts.aftrapIso.replace(/[^0-9]/g, "").slice(0, 12);
  return `${opts.ploegSlug}-${opts.soort}-${stempel}.${opts.ext ?? "png"}`;
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
    return { ok: false, fout: "SUPABASE_URL of SUPABASE_SECRET_KEY ontbreekt." };
  }

  const ext = opts.mime === "image/png" ? "png" : opts.mime === "image/webp" ? "webp" : "jpg";
  const naam = afficheNaam({ ...opts, ext });

  try {
    // Oudere versies met een andere extensie opruimen, anders blijft een
    // vorige poging als los bestand achter.
    const zonderExt = naam.replace(/\.[a-z]+$/, "");
    const anders = ["png", "jpg", "webp"].map((e) => `${zonderExt}.${e}`).filter((n) => n !== naam);
    await db().storage.from(BUCKET).remove(anders);

    const { error } = await db().storage.from(BUCKET).upload(naam, opts.bytes, {
      contentType: opts.mime,
      upsert: true,
      cacheControl: "3600",
    });
    if (error) throw new Error(error.message);
    return { ok: true, url: db().storage.from(BUCKET).getPublicUrl(naam).data.publicUrl };
  } catch (error) {
    console.error("[social] affiche opslaan mislukt:", error);
    return { ok: false, fout: error instanceof Error ? error.message : String(error) };
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

  const stam = afficheNaam({ ...opts, ext: "" }).replace(/\.$/, "");
  const { data, error } = await db().storage.from(BUCKET).list("", { search: stam, limit: 10 });
  if (error || !data) return null;
  for (const ext of ["png", "jpg", "webp"]) {
    const naam = `${stam}.${ext}`;
    if (data.some((b) => b.name === naam)) return db().storage.from(BUCKET).getPublicUrl(naam).data.publicUrl;
  }
  return null;
}

/**
 * Het meldingenlogboek: welke wedstrijden zijn al gemaild, en welke posts staan
 * al op Facebook of Instagram. Een rij per gebeurtenis; het bestaan ervan is de
 * markering.
 */
const LOGBOEK = "social_markeringen";

/** Zoals de bestandsnamen in Vercel Blob, zodat de overgezette markeringen blijven kloppen. */
function zuiver(sleutel: string): string {
  return sleutel.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/** True als deze markering al bestaat. */
export async function isGemarkeerd(soort: string, sleutel: string): Promise<boolean> {
  if (!beschikbaar()) {
    console.warn("[social] geen database, dubbelcontrole overgeslagen");
    return false;
  }
  const { data, error } = await db()
    .from(LOGBOEK)
    .select("sleutel")
    .eq("soort", soort)
    .eq("sleutel", zuiver(sleutel))
    .maybeSingle();
  if (error) {
    console.error("[social] markering lezen mislukt:", error.message);
    return false;
  }
  return Boolean(data);
}

/** Zet een markering, zodat dezelfde gebeurtenis niet nog eens verwerkt wordt. */
export async function markeer(
  soort: string,
  sleutel: string,
  inhoud = ""
): Promise<void> {
  if (!beschikbaar()) return;
  const { error } = await db()
    .from(LOGBOEK)
    .upsert({ soort, sleutel: zuiver(sleutel), inhoud: inhoud || new Date().toISOString(), aangemaakt: new Date().toISOString() });
  if (error) console.error("[social] markering schrijven mislukt:", error.message);
}

/** Alle markeringen van een soort, handig voor diagnose. */
export async function lijstMarkeringen(soort: string): Promise<string[]> {
  if (!beschikbaar()) return [];
  const { data, error } = await db().from(LOGBOEK).select("sleutel").eq("soort", soort).order("aangemaakt");
  if (error) return [];
  return (data ?? []).map((r) => r.sleutel);
}
