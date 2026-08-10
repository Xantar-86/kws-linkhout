import { createHmac, timingSafeEqual } from "crypto";

/**
 * HMAC-ondertekening voor twee dingen:
 *  - de goedkeuringslinks uit de mail (niemand mag zomaar een post lanceren)
 *  - de parameters van de matchday-afbeelding (niemand mag willekeurige tekst
 *    in een afbeelding op ons eigen domein zetten)
 *
 * Er is bewust geen database bij betrokken: de token draagt zelf alle info en
 * een vervaldatum.
 */

function geheim(): string {
  const s = process.env.SOCIAL_SECRET;
  if (!s) {
    throw new Error("SOCIAL_SECRET ontbreekt in de omgeving");
  }
  return s;
}

function base64url(buffer: Buffer): string {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function hmac(payload: string): string {
  return base64url(createHmac("sha256", geheim()).update(payload).digest());
}

function veiligGelijk(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Parameters die buiten de handtekening blijven. Ze bepalen alleen de
 * weergavegrootte en kunnen de inhoud van de afbeelding niet veranderen, dus
 * ze mogen zonder hertekenen aangepast worden.
 */
const ONGETEKEND = ["sig", "breedte"];

function tekenbaar(params: URLSearchParams): URLSearchParams {
  const kopie = new URLSearchParams(params);
  for (const naam of ONGETEKEND) kopie.delete(naam);
  kopie.sort();
  return kopie;
}

/** Ondertekent een set querystring-parameters. Voegt `sig` toe. */
export function tekenParams(params: URLSearchParams): URLSearchParams {
  const kopie = tekenbaar(params);
  kopie.set("sig", hmac(kopie.toString()));
  return kopie;
}

/** Controleert de `sig` van een querystring. */
export function controleerParams(params: URLSearchParams): boolean {
  const sig = params.get("sig");
  if (!sig) return false;
  try {
    return veiligGelijk(sig, hmac(tekenbaar(params).toString()));
  } catch {
    return false;
  }
}

/** Aankondiging van de volgende wedstrijd, of de uitslag erna. */
export type PostSoort = "wedstrijd" | "uitslag";

export interface GoedkeuringPayload {
  /** Ploeg-slug. */
  p: string;
  /** ISO-tijd van de aftrap, identificeert de wedstrijd. */
  w: string;
  /** Soort post. Ontbreekt bij oudere tokens; dan is het een aankondiging. */
  s?: PostSoort;
  /** Vervaltijd als unix-seconden. */
  exp: number;
}

/** Maakt een goedkeuringstoken dat na `geldigDagen` vervalt. */
export function maakGoedkeuringToken(
  ploegSlug: string,
  aftrapIso: string,
  soort: PostSoort = "wedstrijd",
  geldigDagen = 5
): string {
  const payload: GoedkeuringPayload = {
    p: ploegSlug,
    w: aftrapIso,
    s: soort,
    exp: Math.floor(Date.now() / 1000) + geldigDagen * 86_400,
  };
  const body = base64url(Buffer.from(JSON.stringify(payload)));
  return `${body}.${hmac(body)}`;
}

/** Leest en valideert een goedkeuringstoken. Geeft null bij ongeldig of vervallen. */
export function leesGoedkeuringToken(token: string): GoedkeuringPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    if (!veiligGelijk(sig, hmac(body))) return null;
    const payload: GoedkeuringPayload = JSON.parse(
      Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
    );
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
