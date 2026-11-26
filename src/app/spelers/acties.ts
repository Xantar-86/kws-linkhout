"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/supabase";
import {
  hashCode,
  huidigeGebruiker,
  nieuweUitnodiging,
  uitnodigingsLink,
  magSpeler,
  vereisBeheerder,
  vereisGebruiker,
  wachtwoordKlopt,
  wachtwoordOpslag,
  wisSessie,
  zetSessie,
  type Rol,
} from "@/lib/jeugd/toegang";
import { spondAanmelding, synchroniseer } from "@/lib/jeugd/spond";

export type Staat = { fout?: string; ok?: string; link?: string } | null;

async function basisUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "www.kwslinkhout.be";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// ---------------------------------------------------------------------------
// Aanmelden

export async function aanmelden(_vorige: Staat, form: FormData): Promise<Staat> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const wachtwoord = String(form.get("wachtwoord") ?? "");
  if (!email || !wachtwoord) return { fout: "Vul uw e-mailadres en wachtwoord in." };
  const { data } = await db()
    .from("jeugd_gebruikers")
    .select("id, wachtwoord, sessie_versie")
    .eq("email", email)
    .maybeSingle();
  // Ook bij een onbekend adres rekenen we door, en de fout is altijd dezelfde.
  const klopt = wachtwoordKlopt(data?.wachtwoord as string | undefined, wachtwoord);
  if (!data || !klopt) {
    await new Promise((r) => setTimeout(r, 600));
    return { fout: "E-mailadres of wachtwoord klopt niet." };
  }
  await db().from("jeugd_gebruikers").update({ laatst_aangemeld: new Date().toISOString() }).eq("id", data.id);
  await zetSessie({ id: data.id as string, sessie_versie: data.sessie_versie as number });
  redirect("/spelers");
}

export async function afmelden() {
  await wisSessie();
  redirect("/spelers");
}

export async function wachtwoordKiezen(_vorige: Staat, form: FormData): Promise<Staat> {
  const code = String(form.get("code") ?? "");
  const een = String(form.get("wachtwoord") ?? "");
  const twee = String(form.get("herhaal") ?? "");
  if (een.length < 10) return { fout: "Kies een wachtwoord van minstens 10 tekens." };
  if (een !== twee) return { fout: "De twee wachtwoorden zijn niet gelijk." };
  const { data } = await db()
    .from("jeugd_gebruikers")
    .select("id, uitnodiging_tot, sessie_versie")
    .eq("uitnodiging_hash", hashCode(code))
    .maybeSingle();
  if (!data || !data.uitnodiging_tot || new Date(data.uitnodiging_tot as string) < new Date()) {
    return { fout: "Deze link is niet meer geldig. Vraag een nieuwe aan de beheerder." };
  }
  const { error } = await db()
    .from("jeugd_gebruikers")
    .update({
      wachtwoord: wachtwoordOpslag(een),
      uitnodiging_hash: null,
      uitnodiging_tot: null,
      laatst_aangemeld: new Date().toISOString(),
    })
    .eq("id", data.id);
  if (error) return { fout: "Bewaren lukte niet. Probeer het opnieuw." };
  await zetSessie({ id: data.id as string, sessie_versie: data.sessie_versie as number });
  redirect("/spelers");
}

// ---------------------------------------------------------------------------
// Beheer van accounts

const ROLLEN: Rol[] = ["bestuur", "coordinator", "trainer"];

export async function gebruikerToevoegen(_vorige: Staat, form: FormData): Promise<Staat> {
  await vereisBeheerder();
  const naam = String(form.get("naam") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const rol = String(form.get("rol") ?? "") as Rol;
  const ploegen = form.getAll("ploegen").map(String);
  const beheerder = form.get("beheerder") === "on";
  if (!naam || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { fout: "Vul een naam en een geldig e-mailadres in." };
  if (!ROLLEN.includes(rol)) return { fout: "Kies een rol." };
  if (rol !== "bestuur" && ploegen.length === 0) return { fout: "Vink minstens één ploeg aan." };
  const { data, error } = await db()
    .from("jeugd_gebruikers")
    .insert({ naam, email, rol, ploegen: rol === "bestuur" ? [] : ploegen, beheerder })
    .select("id")
    .single();
  if (error) {
    return { fout: error.code === "23505" ? "Er bestaat al een account met dit e-mailadres." : `Bewaren mislukt: ${error.message}` };
  }
  const code = await nieuweUitnodiging(data.id as string);
  revalidatePath("/spelers/beheer");
  return { ok: `Account voor ${naam} aangemaakt. Stuur deze link door; hij is 14 dagen geldig.`, link: uitnodigingsLink(await basisUrl(), code) };
}

export async function gebruikerAanpassen(_vorige: Staat, form: FormData): Promise<Staat> {
  const ik = await vereisBeheerder();
  const id = String(form.get("id") ?? "");
  const rol = String(form.get("rol") ?? "") as Rol;
  const ploegen = form.getAll("ploegen").map(String);
  const beheerder = form.get("beheerder") === "on";
  if (!ROLLEN.includes(rol)) return { fout: "Kies een rol." };
  if (id === ik.id && !beheerder) return { fout: "Ge kunt uzelf geen beheerder af maken." };
  const { error } = await db()
    .from("jeugd_gebruikers")
    .update({ rol, ploegen: rol === "bestuur" ? [] : ploegen, beheerder })
    .eq("id", id);
  if (error) return { fout: `Bewaren mislukt: ${error.message}` };
  revalidatePath("/spelers/beheer");
  return { ok: "Bewaard." };
}

export async function nieuweLink(_vorige: Staat, form: FormData): Promise<Staat> {
  await vereisBeheerder();
  const id = String(form.get("id") ?? "");
  const code = await nieuweUitnodiging(id);
  revalidatePath("/spelers/beheer");
  return { ok: "Nieuwe link gemaakt. De oude link en het oude wachtwoord werken niet meer.", link: uitnodigingsLink(await basisUrl(), code) };
}

export async function gebruikerVerwijderen(_vorige: Staat, form: FormData): Promise<Staat> {
  const ik = await vereisBeheerder();
  const id = String(form.get("id") ?? "");
  if (id === ik.id) return { fout: "Ge kunt uw eigen account niet verwijderen." };
  const { error } = await db().from("jeugd_gebruikers").delete().eq("id", id);
  if (error) return { fout: `Verwijderen mislukt: ${error.message}` };
  revalidatePath("/spelers/beheer");
  return { ok: "Account verwijderd." };
}

export async function nuSynchroniseren(_vorige: Staat, form: FormData): Promise<Staat> {
  const ik = await huidigeGebruiker();
  if (!ik?.beheerder) return { fout: "Geen toegang." };
  const aanmelding = spondAanmelding();
  if (!aanmelding) return { fout: "Het Spond-account is nog niet ingesteld (SPOND_EMAIL en SPOND_WACHTWOORD)." };
  try {
    const r = await synchroniseer({ aanmelding, volledig: form.get("volledig") === "on", bron: `knop ${ik.naam}` });
    revalidatePath("/spelers", "layout");
    return { ok: `Klaar: ${r.spelers} spelers, ${r.activiteiten} activiteiten, ${r.aanwezigheden} antwoorden (vanaf ${r.van}).` };
  } catch (e) {
    return { fout: e instanceof Error ? e.message : String(e) };
  }
}

// ---------------------------------------------------------------------------
// Aandachtspunten op de fiche. Iedereen die de speler mag zien, mag ze aanpassen.

export async function aandachtBewaren(_vorige: Staat, form: FormData): Promise<Staat> {
  const ik = await vereisGebruiker();
  const id = String(form.get("speler") ?? "");
  const { data: s } = await db().from("jeugd_spelers").select("ploegen").eq("id", id).maybeSingle();
  if (!s || !magSpeler(ik, s.ploegen as string[])) return { fout: "Geen toegang tot deze speler." };
  const tekst = (k: string) => String(form.get(k) ?? "").trim().slice(0, 2000) || null;
  const velden = { allergie: tekst("allergie"), medisch: tekst("medisch"), rekening: tekst("rekening") };
  const { error } = Object.values(velden).some(Boolean)
    ? await db()
        .from("jeugd_aandacht")
        .upsert({ speler_id: id, ...velden, gewijzigd_door: ik.naam, gewijzigd: new Date().toISOString() })
    : await db().from("jeugd_aandacht").delete().eq("speler_id", id);
  if (error) return { fout: `Bewaren mislukt: ${error.message}` };
  revalidatePath(`/spelers/speler/${id}`);
  revalidatePath("/spelers/ploeg/[id]", "page");
  return { ok: "Bewaard." };
}
