import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { nieuwZout, versleutel } from "@/lib/beheerders";
import { db } from "@/lib/supabase";

/**
 * Wie in het spelersdossier mag, en wat hij ziet.
 *
 * Iedereen heeft een eigen account (tabel jeugd_gebruikers) met een eigen
 * wachtwoord. De beheerder maakt het account aan en krijgt een
 * uitnodigingslink die hij zelf doorstuurt (WhatsApp, mail); via die link
 * kiest de trainer zijn wachtwoord. Zo hangt het aanmelden van geen enkele
 * maildienst af. Wachtwoord vergeten: de beheerder maakt een nieuwe link.
 *
 * Rollen:
 *   bestuur      ziet alle ploegen
 *   coordinator  ziet de ploegen die de beheerder aanvinkt
 *   trainer      ziet de ploegen die de beheerder aanvinkt
 * "beheerder" staat daar los van: die mag ook accounts beheren.
 *
 * De sessie is een ondertekend koekje (JEUGD_GEHEIM). Bij elke pagina lezen
 * we het account opnieuw, dus wie verwijderd wordt of een nieuwe link krijgt,
 * is meteen overal afgemeld.
 */

export type Rol = "bestuur" | "coordinator" | "trainer";
export type Gebruiker = {
  id: string;
  naam: string;
  email: string;
  rol: Rol;
  ploegen: string[];
  beheerder: boolean;
  sessie_versie: number;
};

const KOEKJE = "kws_jeugd";
const DUUR_DAGEN = 30;
const UITNODIGING_DAGEN = 14;

function geheim(): string {
  const g = process.env.JEUGD_GEHEIM;
  if (!g || g.length < 32) throw new Error("JEUGD_GEHEIM ontbreekt of is te kort.");
  return g;
}

function handtekening(inhoud: string): string {
  return createHmac("sha256", geheim()).update(inhoud).digest("base64url");
}

function zelfde(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function zetSessie(g: Pick<Gebruiker, "id" | "sessie_versie">) {
  const tot = Date.now() + DUUR_DAGEN * 864e5;
  const inhoud = `${g.id}.${g.sessie_versie}.${tot}`;
  (await cookies()).set(KOEKJE, `${inhoud}.${handtekening(inhoud)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/spelers",
    maxAge: DUUR_DAGEN * 86400,
  });
}

export async function wisSessie() {
  (await cookies()).delete({ name: KOEKJE, path: "/spelers" });
}

/** De aangemelde gebruiker, of null. */
export async function huidigeGebruiker(): Promise<Gebruiker | null> {
  const waarde = (await cookies()).get(KOEKJE)?.value;
  if (!waarde) return null;
  const delen = waarde.split(".");
  if (delen.length !== 4) return null;
  const [id, versie, tot, sig] = delen;
  if (!zelfde(sig, handtekening(`${id}.${versie}.${tot}`))) return null;
  if (Number(tot) < Date.now()) return null;
  const { data } = await db()
    .from("jeugd_gebruikers")
    .select("id, naam, email, rol, ploegen, beheerder, sessie_versie")
    .eq("id", id)
    .maybeSingle();
  if (!data || data.sessie_versie !== Number(versie)) return null;
  return data as Gebruiker;
}

/** Voor elke pagina achter de aanmelding. */
export async function vereisGebruiker(): Promise<Gebruiker> {
  const g = await huidigeGebruiker();
  if (!g) redirect("/spelers");
  return g;
}

export async function vereisBeheerder(): Promise<Gebruiker> {
  const g = await vereisGebruiker();
  if (!g.beheerder) redirect("/spelers");
  return g;
}

/** Mag deze gebruiker de ploeg zien? */
export function magPloeg(g: Gebruiker, ploegId: string): boolean {
  return g.rol === "bestuur" || g.beheerder || g.ploegen.includes(ploegId);
}

/** Mag deze gebruiker de speler zien (via een van zijn ploegen)? */
export function magSpeler(g: Gebruiker, spelerPloegen: string[]): boolean {
  return spelerPloegen.some((p) => magPloeg(g, p));
}

export function wachtwoordOpslag(wachtwoord: string): string {
  const zout = nieuwZout();
  return `${zout}:${versleutel(wachtwoord, zout)}`;
}

/** Klopt het wachtwoord? Rekent ook door bij een onbekend adres, zodat de tijd niets verraadt. */
export function wachtwoordKlopt(opgeslagen: string | null | undefined, wachtwoord: string): boolean {
  const [zout, sleutel] = (opgeslagen ?? "").split(":");
  const berekend = Buffer.from(versleutel(wachtwoord, zout || "0".repeat(32)), "hex");
  if (!zout || !sleutel) return false;
  const bewaard = Buffer.from(sleutel, "hex");
  return bewaard.length === berekend.length && timingSafeEqual(bewaard, berekend);
}

export function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

/**
 * Maakt een nieuwe uitnodiging voor dit account en geeft de code terug. De
 * code zelf bewaren we niet, enkel de hash. Een nieuwe code meldt het account
 * ook overal af.
 */
export async function nieuweUitnodiging(gebruikerId: string): Promise<string> {
  const code = randomBytes(24).toString("base64url");
  const huidige = await db().from("jeugd_gebruikers").select("sessie_versie").eq("id", gebruikerId).single();
  if (huidige.error) throw new Error(huidige.error.message);
  const { error } = await db()
    .from("jeugd_gebruikers")
    .update({
      uitnodiging_hash: hashCode(code),
      uitnodiging_tot: new Date(Date.now() + UITNODIGING_DAGEN * 864e5).toISOString(),
      sessie_versie: (huidige.data.sessie_versie as number) + 1,
    })
    .eq("id", gebruikerId);
  if (error) throw new Error(error.message);
  return code;
}

export function uitnodigingsLink(basis: string, code: string): string {
  return `${basis.replace(/\/$/, "")}/spelers/uitnodiging?code=${code}`;
}
