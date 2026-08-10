import type { Platform } from "./meta";
import { isGemarkeerd, markeer } from "./opslag";

/**
 * Houdt bij wat er al gebeurd is, zodat niets twee keer vertrekt:
 *  - welke wedstrijden al gemaild zijn (de uitslagcontrole draait ieder uur)
 *  - welke posts al op Facebook of Instagram staan
 *
 * De markeringen liggen in Vercel Blob, dezelfde opslag als de affiches. Dat
 * scheelt een database en een extra sleutel.
 */

function sleutel(ploegSlug: string, aftrapIso: string, extra?: string): string {
  const stempel = aftrapIso.replace(/[^0-9]/g, "").slice(0, 12);
  return extra ? `${ploegSlug}-${stempel}-${extra}` : `${ploegSlug}-${stempel}`;
}

/** True als deze wedstrijd al op dit platform gepost is. */
export async function alGepost(
  ploegSlug: string,
  aftrapIso: string,
  platform: Platform
): Promise<boolean> {
  return isGemarkeerd("geplaatst", sleutel(ploegSlug, aftrapIso, platform));
}

/** Legt een geslaagde post vast. */
export async function noteerPost(opts: {
  ploegSlug: string;
  aftrapIso: string;
  platform: Platform;
  postId: string | null;
  caption: string;
}): Promise<void> {
  await markeer(
    "geplaatst",
    sleutel(opts.ploegSlug, opts.aftrapIso, opts.platform),
    [
      `geplaatst: ${new Date().toISOString()}`,
      `platform: ${opts.platform}`,
      `post: ${opts.postId ?? "onbekend"}`,
      "",
      opts.caption,
    ].join("\n")
  );
}

/**
 * True als deze wedstrijd al gemeld is (de voorstelmail is verstuurd).
 * Zo blijft de uurlijkse uitslagcontrole idempotent.
 */
export async function alGemeld(
  ploegSlug: string,
  aftrapIso: string,
  soort: string
): Promise<boolean> {
  return isGemarkeerd("gemeld", sleutel(ploegSlug, aftrapIso, soort));
}

/** Legt vast dat er voor deze wedstrijd een voorstel gemaild is. */
export async function noteerMelding(
  ploegSlug: string,
  aftrapIso: string,
  soort: string
): Promise<void> {
  await markeer("gemeld", sleutel(ploegSlug, aftrapIso, soort));
}
