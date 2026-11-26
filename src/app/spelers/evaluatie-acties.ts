"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/supabase";
import { magPloeg, magSpeler, vereisGebruiker, type Gebruiker } from "@/lib/jeugd/toegang";
import {
  evaluatie,
  evaluatieVanToken,
  instellingen,
  isOpen,
  ronde as leesRonde,
  vandaag,
  zorgVoorEvaluaties,
  type Ronde,
} from "@/lib/jeugd/evaluatie";
import { RUBRIEKEN, ontbrekend, schoonmaken, type EigenVraag, type EvalRol } from "@/lib/jeugd/vragen";

const ROLLEN: EvalRol[] = ["trainer", "speler", "ouders"];
import { seizoenNaam } from "@/lib/jeugd/spond";
import type { Staat } from "./acties";

const DATUM = /^\d{4}-\d{2}-\d{2}$/;

// ---------------------------------------------------------------------------
// Evaluaties opmaken: de trainer kiest ploeg, vragen en einddatum, en verstuurt.

function magRonde(ik: Gebruiker, r: Pick<Ronde, "ploegen">): boolean {
  return ik.beheerder || (r.ploegen.length > 0 && r.ploegen.every((p) => magPloeg(ik, p)));
}

async function rondeMetToegang(id: string) {
  const ik = await vereisGebruiker();
  const r = await leesRonde(id);
  if (!r || !magRonde(ik, r)) return null;
  return { ik, r };
}

async function inVolgorde(ploegen: string[]): Promise<string[]> {
  const { data } = await db().from("jeugd_ploegen").select("id").in("id", ploegen).order("volgorde");
  return (data ?? []).map((p) => p.id as string);
}

function volledigeKeuze(): Partial<Record<EvalRol, string[]>> {
  return Object.fromEntries(ROLLEN.map((rol) => [rol, RUBRIEKEN[rol].flatMap((r) => r.vragen.map((v) => v.id))]));
}

export async function rondeMaken(_vorige: Staat, form: FormData): Promise<Staat> {
  const ik = await vereisGebruiker();
  const naam = String(form.get("naam") ?? "").trim().slice(0, 120);
  const tot = String(form.get("open_tot") ?? "");
  const ploegen = form.getAll("ploegen").map(String);
  if (!naam) return { fout: "Geef de evaluatie een naam, bv. Winterstop U13." };
  if (!DATUM.test(tot) || tot < vandaag()) return { fout: "Kies tot wanneer er ingevuld kan worden." };
  if (!ploegen.length) return { fout: "Kies minstens één ploeg." };
  if (!ploegen.every((p) => magPloeg(ik, p))) return { fout: "Je kunt enkel een evaluatie maken voor je eigen ploegen." };
  const { data, error } = await db()
    .from("jeugd_rondes")
    .insert({ naam, seizoen: seizoenNaam(), open_tot: tot, ploegen: await inVolgorde(ploegen), aangemaakt_door: ik.naam })
    .select("id")
    .single();
  if (error) return { fout: `Bewaren mislukt: ${error.message}` };
  revalidatePath("/spelers/evaluaties");
  redirect(`/spelers/evaluaties/${data.id}/vragen`);
}

export async function vragenBewaren(_vorige: Staat, form: FormData): Promise<Staat> {
  const t = await rondeMetToegang(String(form.get("id") ?? ""));
  if (!t) return { fout: "Geen toegang tot deze evaluatie." };
  if (t.r.status !== "concept") return { fout: "Deze evaluatie is al verstuurd; de vragen liggen vast." };
  let ruw: { keuze?: Record<string, unknown>; eigen?: unknown[] };
  try {
    ruw = JSON.parse(String(form.get("instellingen") ?? "{}"));
  } catch {
    return { fout: "De keuze kon niet gelezen worden." };
  }
  const keuze: Partial<Record<EvalRol, string[]>> = {};
  for (const rol of ROLLEN) {
    const bestaand = new Set(RUBRIEKEN[rol].flatMap((r) => r.vragen.map((v) => v.id)));
    const lijst = ruw.keuze?.[rol];
    keuze[rol] = Array.isArray(lijst)
      ? [...new Set(lijst.filter((x): x is string => typeof x === "string" && bestaand.has(x)))]
      : [...bestaand];
  }
  const eigen: EigenVraag[] = [];
  for (const x of Array.isArray(ruw.eigen) ? ruw.eigen : []) {
    const v = (x ?? {}) as Record<string, unknown>;
    const rol = ROLLEN.includes(v.rol as EvalRol) ? (v.rol as EvalRol) : null;
    const tekst = typeof v.tekst === "string" ? v.tekst.trim().slice(0, 200) : "";
    if (!rol || !tekst || eigen.filter((e) => e.rol === rol).length >= 10) continue;
    const id = typeof v.id === "string" && /^x[a-z0-9]{6,12}$/.test(v.id) ? v.id : `x${randomBytes(5).toString("hex")}`;
    eigen.push({ id, rol, soort: v.soort === "tekst" ? "tekst" : "score", tekst });
  }
  const { error } = await db().from("jeugd_rondes").update({ keuze, eigen }).eq("id", t.r.id);
  if (error) return { fout: `Bewaren mislukt: ${error.message}` };
  revalidatePath(`/spelers/evaluaties/${t.r.id}`, "layout");
  if (form.get("verder") === "1") redirect(`/spelers/evaluaties/${t.r.id}/overzicht`);
  return { ok: "Bewaard." };
}

export async function rondeVersturen(_vorige: Staat, form: FormData): Promise<Staat> {
  const t = await rondeMetToegang(String(form.get("id") ?? ""));
  if (!t) return { fout: "Geen toegang tot deze evaluatie." };
  if (t.r.status !== "concept") redirect(`/spelers/evaluaties/${t.r.id}`);
  const tot = String(form.get("open_tot") ?? "");
  if (!DATUM.test(tot) || tot < vandaag()) return { fout: "De einddatum ligt in het verleden. Kies een nieuwe." };
  const { data, error } = await db()
    .from("jeugd_rondes")
    .update({
      status: "verstuurd",
      open_van: vandaag(),
      open_tot: tot,
      verstuurd: new Date().toISOString(),
      keuze: t.r.keuze ?? volledigeKeuze(),
    })
    .eq("id", t.r.id)
    .select("*")
    .single();
  if (error) return { fout: `Versturen mislukt: ${error.message}` };
  await zorgVoorEvaluaties(data as Ronde);
  revalidatePath("/spelers/evaluaties", "layout");
  redirect(`/spelers/evaluaties/${t.r.id}`);
}

export async function rondeAanpassen(_vorige: Staat, form: FormData): Promise<Staat> {
  const t = await rondeMetToegang(String(form.get("id") ?? ""));
  if (!t) return { fout: "Geen toegang tot deze evaluatie." };
  const naam = String(form.get("naam") ?? "").trim().slice(0, 120);
  const tot = String(form.get("open_tot") ?? "");
  if (!naam || !DATUM.test(tot)) return { fout: "Vul een naam en een geldige einddatum in." };
  const velden: Record<string, unknown> = { naam, open_tot: tot };
  const ploegen = form.getAll("ploegen").map(String);
  if (t.r.status === "concept" && ploegen.length) {
    if (!ploegen.every((p) => magPloeg(t.ik, p))) return { fout: "Je kunt enkel je eigen ploegen kiezen." };
    velden.ploegen = await inVolgorde(ploegen);
  }
  const { data, error } = await db().from("jeugd_rondes").update(velden).eq("id", t.r.id).select("*").single();
  if (error) return { fout: `Bewaren mislukt: ${error.message}` };
  if (t.r.status === "verstuurd") await zorgVoorEvaluaties(data as Ronde);
  revalidatePath(`/spelers/evaluaties/${t.r.id}`, "layout");
  return { ok: "Bewaard." };
}

export async function rondeVerwijderen(_vorige: Staat, form: FormData): Promise<Staat> {
  const t = await rondeMetToegang(String(form.get("id") ?? ""));
  if (!t) return { fout: "Geen toegang tot deze evaluatie." };
  const { error } = await db().from("jeugd_rondes").delete().eq("id", t.r.id);
  if (error) return { fout: `Verwijderen mislukt: ${error.message}` };
  revalidatePath("/spelers/evaluaties", "layout");
  redirect("/spelers/evaluaties");
}

// ---------------------------------------------------------------------------
// Invullen door de trainer (aangemeld)

export async function trainerBewaren(_vorige: Staat, form: FormData): Promise<Staat> {
  const ik = await vereisGebruiker();
  const e = await evaluatie(String(form.get("id") ?? ""));
  if (!e || e.rol !== "trainer" || !e.ploeg_id || !magPloeg(ik, e.ploeg_id)) return { fout: "Geen toegang tot deze evaluatie." };
  let ruw: unknown;
  try {
    ruw = JSON.parse(String(form.get("antwoorden") ?? "{}"));
  } catch {
    return { fout: "De antwoorden konden niet gelezen worden." };
  }
  const r = await leesRonde(e.ronde_id);
  if (!r) return { fout: "Evaluatie niet gevonden." };
  const inst = instellingen(r);
  const antwoorden = schoonmaken("trainer", e.groep, ruw, inst);
  const indienen = form.get("indienen") === "1";
  if (indienen) {
    const mist = ontbrekend("trainer", e.groep, antwoorden, inst);
    if (mist.length) return { fout: `Nog ${mist.length} ${mist.length === 1 ? "score" : "scores"} open. Die zijn rood aangeduid.` };
  }
  const { error } = await db()
    .from("jeugd_evaluaties")
    .update({
      antwoorden,
      ingevuld_door: ik.naam,
      ingediend: indienen ? new Date().toISOString() : e.ingediend,
      bijgewerkt: new Date().toISOString(),
    })
    .eq("id", e.id);
  if (error) return { fout: `Bewaren mislukt: ${error.message}` };
  revalidatePath(`/spelers/evaluaties/${e.ronde_id}`, "layout");
  revalidatePath(`/spelers/speler/${e.speler_id}`);
  return { ok: indienen ? "Afgewerkt en bewaard." : "Tussentijds bewaard." };
}

/** Na het gesprek met de speler: datum vastleggen en het verslag zichtbaar maken voor speler en ouders. */
export async function besprokenZetten(_vorige: Staat, form: FormData): Promise<Staat> {
  const ik = await vereisGebruiker();
  const e = await evaluatie(String(form.get("id") ?? ""));
  if (!e || e.rol !== "trainer" || !e.ploeg_id || !magPloeg(ik, e.ploeg_id)) return { fout: "Geen toegang." };
  const intrekken = form.get("intrekken") === "1";
  const op = String(form.get("besproken_op") ?? "");
  if (!intrekken && !DATUM.test(op)) return { fout: "Kies de datum van het gesprek." };
  if (!intrekken && !e.ingediend) return { fout: "Werk de evaluatie eerst af." };
  const { error } = await db()
    .from("jeugd_evaluaties")
    .update(
      intrekken
        ? { vrijgegeven: null }
        : { besproken_op: op, vrijgegeven: form.get("vrijgeven") === "on" ? new Date().toISOString() : null },
    )
    .eq("id", e.id);
  if (error) return { fout: `Bewaren mislukt: ${error.message}` };
  revalidatePath(`/spelers/evaluaties/${e.ronde_id}`, "layout");
  revalidatePath(`/spelers/speler/${e.speler_id}`);
  return { ok: intrekken ? "Het verslag is niet meer zichtbaar voor speler en ouders." : "Bewaard." };
}

// ---------------------------------------------------------------------------
// Invullen via de persoonlijke link (speler of ouders, zonder aanmelden)

export async function linkBewaren(_vorige: Staat, form: FormData): Promise<Staat> {
  const e = await evaluatieVanToken(String(form.get("token") ?? ""));
  if (!e || e.rol === "trainer") return { fout: "Deze link is niet geldig." };
  const r = await leesRonde(e.ronde_id);
  if (!r || !isOpen(r)) return { fout: "Deze evaluatie is afgesloten. Neem contact op met de trainer." };
  let ruw: unknown;
  try {
    ruw = JSON.parse(String(form.get("antwoorden") ?? "{}"));
  } catch {
    return { fout: "De antwoorden konden niet gelezen worden." };
  }
  const inst = instellingen(r);
  const antwoorden = schoonmaken(e.rol, e.groep, ruw, inst);
  const indienen = form.get("indienen") === "1";
  if (indienen) {
    const mist = ontbrekend(e.rol, e.groep, antwoorden, inst);
    if (mist.length) return { fout: `Nog ${mist.length} ${mist.length === 1 ? "vraag" : "vragen"} open. Die zijn rood aangeduid.` };
  }
  const door = String(form.get("ingevuld_door") ?? "").trim().slice(0, 80) || null;
  const { error } = await db()
    .from("jeugd_evaluaties")
    .update({
      antwoorden,
      ingevuld_door: door,
      ingediend: indienen ? new Date().toISOString() : e.ingediend,
      bijgewerkt: new Date().toISOString(),
    })
    .eq("id", e.id);
  if (error) return { fout: "Bewaren lukte niet. Probeer het opnieuw." };
  return { ok: indienen ? "Bedankt! Je antwoorden zijn doorgestuurd." : "Tussentijds bewaard. Je kunt later verder via dezelfde link." };
}

// ---------------------------------------------------------------------------
// Fiche: notities en blessures, en spelersgegevens

async function spelerMetToegang(id: string) {
  const ik = await vereisGebruiker();
  const { data } = await db().from("jeugd_spelers").select("id, ploegen, extra").eq("id", id).maybeSingle();
  if (!data || !magSpeler(ik, data.ploegen as string[])) return null;
  return { ik, speler: data as { id: string; ploegen: string[]; extra: Record<string, unknown> } };
}

export async function notitieToevoegen(_vorige: Staat, form: FormData): Promise<Staat> {
  const t = await spelerMetToegang(String(form.get("speler") ?? ""));
  if (!t) return { fout: "Geen toegang tot deze speler." };
  const soort = form.get("soort") === "blessure" ? "blessure" : "notitie";
  const tekst = String(form.get("tekst") ?? "").trim().slice(0, 2000);
  const van = String(form.get("van") ?? "");
  const tot = String(form.get("tot") ?? "");
  if (!tekst) return { fout: "Schrijf eerst iets." };
  const { error } = await db()
    .from("jeugd_notities")
    .insert({
      speler_id: t.speler.id,
      soort,
      tekst,
      van: DATUM.test(van) ? van : null,
      tot: DATUM.test(tot) ? tot : null,
      door: t.ik.naam,
    });
  if (error) return { fout: `Bewaren mislukt: ${error.message}` };
  revalidatePath(`/spelers/speler/${t.speler.id}`);
  return { ok: "Toegevoegd." };
}

export async function notitieVerwijderen(_vorige: Staat, form: FormData): Promise<Staat> {
  const ik = await vereisGebruiker();
  const id = String(form.get("id") ?? "");
  const { data } = await db().from("jeugd_notities").select("speler_id, door").eq("id", id).maybeSingle();
  if (!data) return { fout: "Niet gevonden." };
  const t = await spelerMetToegang(data.speler_id as string);
  if (!t || (data.door !== ik.naam && !ik.beheerder)) return { fout: "Enkel wie het schreef of een beheerder kan dit verwijderen." };
  const { error } = await db().from("jeugd_notities").delete().eq("id", id);
  if (error) return { fout: `Verwijderen mislukt: ${error.message}` };
  revalidatePath(`/spelers/speler/${data.speler_id}`);
  return { ok: "Verwijderd." };
}

export async function blessureHersteld(_vorige: Staat, form: FormData): Promise<Staat> {
  const id = String(form.get("id") ?? "");
  const { data } = await db().from("jeugd_notities").select("speler_id").eq("id", id).maybeSingle();
  if (!data) return { fout: "Niet gevonden." };
  const t = await spelerMetToegang(data.speler_id as string);
  if (!t) return { fout: "Geen toegang." };
  const tot = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Brussels" });
  const { error } = await db().from("jeugd_notities").update({ tot }).eq("id", id);
  if (error) return { fout: `Bewaren mislukt: ${error.message}` };
  revalidatePath(`/spelers/speler/${data.speler_id}`);
  return { ok: "Hersteld." };
}

const VOETEN = ["links", "rechts", "beide"];
const POS = ["K", "V", "M", "A"];

export async function gegevensBewaren(_vorige: Staat, form: FormData): Promise<Staat> {
  const t = await spelerMetToegang(String(form.get("speler") ?? ""));
  if (!t) return { fout: "Geen toegang tot deze speler." };
  const extra = { ...(t.speler.extra ?? {}) };
  const nr = String(form.get("rugnummer") ?? "").trim();
  const voet = String(form.get("voet") ?? "");
  const pos = String(form.get("positie") ?? "");
  if (nr === "") delete extra.rugnummer;
  else if (/^\d{1,2}$/.test(nr)) extra.rugnummer = Number(nr);
  else return { fout: "Rugnummer: een getal van 1 tot 99." };
  if (VOETEN.includes(voet)) extra.voet = voet;
  else delete extra.voet;
  if (POS.includes(pos)) extra.positiecode = pos;
  else delete extra.positiecode;
  delete extra.positie;
  const { error } = await db().from("jeugd_spelers").update({ extra }).eq("id", t.speler.id);
  if (error) return { fout: `Bewaren mislukt: ${error.message}` };
  revalidatePath(`/spelers/speler/${t.speler.id}`);
  return { ok: "Bewaard." };
}
