import { NextRequest, NextResponse } from "next/server";
import { db, databaseBeschikbaar } from "@/lib/supabase";
import { controleerToken, postNaarFacebook, postNaarInstagram, isLive, type Platform, type PostResultaat } from "@/lib/social/meta";
import { verstuurMail } from "@/lib/social/mail";
import { siteUrl } from "@/lib/social/omgeving";
import { eisOp, geefVrij, geldigeWeek, legVast, noteerOvergeslagen, sleutelKlopt, staat, weekLink } from "@/lib/social/weekoverzicht-post";

/**
 * Zet het weekoverzicht op Facebook en Instagram.
 *
 * GET  ?week=&t=          wat er voor die week al geplaatst is
 * POST (multipart)        week, t, bron ("pc" of "knop"), en dan ofwel
 *                          tekst + beeld + beeldIg om te plaatsen,
 *                          ofwel overslaan=<reden> als de pc niets plaatst.
 *
 * Na elke poging van de pc komt er een mail met wat er gebeurd is. Zie
 * lib/social/weekoverzicht-post.ts voor de sleutel en het slot tegen dubbel posten.
 */

export const dynamic = "force-dynamic";
// Instagram verwerkt het beeld eerst, dat kan een halve minuut duren.
export const maxDuration = 60;

const BUCKET = "affiches";
const MAX_BYTES = 4 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const week = request.nextUrl.searchParams.get("week");
  if (!geldigeWeek(week) || !sleutelKlopt(week, request.nextUrl.searchParams.get("t"))) {
    return NextResponse.json({ error: "Ongeldige of vervallen link" }, { status: 401 });
  }
  // Werkt de pagina-sleutel nog? Meta kan ze intrekken; zo ziet ge dat voor ge plaatst.
  const token = process.env.FB_PAGE_TOKEN;
  const meta = token ? await controleerToken(token) : { geldig: false, details: "FB_PAGE_TOKEN ontbreekt" };
  return NextResponse.json({ week, live: isLive(), meta, geplaatst: await staat(week) });
}

function blok(titel: string, inhoud: string): string {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;background:#141010;color:#ffffff;border-radius:12px">
  <h2 style="margin:0 0 12px">${titel}</h2>${inhoud}</div>`;
}

const p = (t: string) => `<p style="color:#dddddd;line-height:1.5">${t}</p>`;
const knop = (href: string, t: string) =>
  `<p style="margin:24px 0"><a href="${href}" style="display:inline-block;padding:14px 24px;background:#9e1b1b;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700">${t}</a></p>`;

async function bewaarBeeld(naam: string, bestand: File): Promise<string> {
  const { error } = await db()
    .storage.from(BUCKET)
    .upload(naam, Buffer.from(await bestand.arrayBuffer()), {
      contentType: "image/png",
      upsert: true,
      // Kort, zodat een tweede poging met een verbeterd beeld meteen het nieuwe toont.
      cacheControl: "60",
    });
  if (error) throw new Error(`Beeld bewaren mislukt: ${error.message}`);
  // Een vraagteken erachter, zodat Meta zeker de nieuwste versie ophaalt.
  return `${db().storage.from(BUCKET).getPublicUrl(naam).data.publicUrl}?v=${Date.now()}`;
}

function geldigBeeld(f: FormDataEntryValue | null): f is File {
  return f instanceof File && f.type === "image/png" && f.size > 0 && f.size <= MAX_BYTES;
}

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const week = String(form.get("week") ?? "");
  if (!geldigeWeek(week) || !sleutelKlopt(week, String(form.get("t") ?? ""))) {
    return NextResponse.json({ error: "Ongeldige of vervallen link" }, { status: 401 });
  }
  if (!databaseBeschikbaar()) {
    return NextResponse.json({ error: "SUPABASE_URL of SUPABASE_SECRET_KEY ontbreekt." }, { status: 500 });
  }

  const bron = form.get("bron") === "pc" ? "pc" : "knop";
  const site = siteUrl();
  const link = weekLink(site, week);

  // De pc plaatst niets (geen wedstrijden, of de RBFA gaf niet alles): melden.
  const overslaan = form.get("overslaan");
  if (typeof overslaan === "string" && overslaan) {
    const reden = overslaan.slice(0, 300).replace(/[<>&]/g, "");
    await noteerOvergeslagen(week, reden);
    await verstuurMail({
      onderwerp: `Weekoverzicht ${week} niet automatisch geplaatst`,
      html: blok(
        "Weekoverzicht niet geplaatst",
        p(`De thuis-pc heeft het weekoverzicht van deze week niet geplaatst: <b>${reden}</b>.`) +
          p("Kijk de pagina na. Klopt alles, plaats het dan met de knop.") +
          knop(link, "Weekoverzicht openen")
      ),
    });
    return NextResponse.json({ ok: true, overgeslagen: reden });
  }

  const tekst = String(form.get("tekst") ?? "").trim();
  const beeld = form.get("beeld");
  const beeldIg = form.get("beeldIg");
  if (!tekst) return NextResponse.json({ error: "De tekst is leeg" }, { status: 400 });
  if (tekst.length > 2200) {
    return NextResponse.json({ error: "De tekst is te lang voor Instagram (max 2200 tekens)" }, { status: 400 });
  }
  if (!geldigBeeld(beeld) || !geldigBeeld(beeldIg)) {
    return NextResponse.json({ error: "Het beeld ontbreekt of is groter dan 4 MB" }, { status: 400 });
  }

  const pageId = process.env.FB_PAGE_ID;
  const igId = process.env.IG_ACCOUNT_ID;
  const token = process.env.FB_PAGE_TOKEN;

  const resultaten: PostResultaat[] = [];
  let urls: { fb: string; ig: string } | null = null;

  for (const platform of ["facebook", "instagram"] as Platform[]) {
    const doelId = platform === "facebook" ? pageId : igId;
    if (!doelId || !token) {
      resultaten.push({ platform, ok: false, postId: null, dryRun: false, bericht: `${platform}: nog niet gekoppeld (pagina-ID of token ontbreekt)` });
      continue;
    }
    if (!(await eisOp(week, platform))) {
      resultaten.push({ platform, ok: true, postId: null, dryRun: false, bericht: `${platform}: stond er deze week al op` });
      continue;
    }
    try {
      urls ??= {
        fb: await bewaarBeeld(`weekoverzicht-${week}.png`, beeld),
        ig: await bewaarBeeld(`weekoverzicht-${week}-ig.png`, beeldIg),
      };
      const r =
        platform === "facebook"
          ? await postNaarFacebook({ pageId: doelId, pageToken: token, caption: tekst, afbeeldingUrl: urls.fb })
          : await postNaarInstagram({ accountId: doelId, pageToken: token, caption: tekst, afbeeldingUrl: urls.ig });
      resultaten.push(r);
      if (r.ok && !r.dryRun) {
        await legVast(week, platform, `${new Date().toISOString()} ${bron} ${r.postId ?? ""}`);
      } else {
        await geefVrij(week, platform);
      }
    } catch (e) {
      await geefVrij(week, platform);
      resultaten.push({ platform, ok: false, postId: null, dryRun: false, bericht: e instanceof Error ? e.message : String(e) });
    }
  }

  const allesOk = resultaten.every((r) => r.ok);
  // De pc meldt altijd hoe het afliep; bij de knop ziet ge het op de pagina zelf.
  if (bron === "pc" || !allesOk) {
    const regels = resultaten.map((r) => `<li>${r.bericht.replace(/[<>&]/g, "")}</li>`).join("");
    const titel = !allesOk
      ? "Weekoverzicht: niet alles gelukt"
      : isLive()
        ? "Weekoverzicht geplaatst"
        : "Weekoverzicht: proef, niets geplaatst";
    await verstuurMail({
      onderwerp: `${titel} (${week})`,
      html: blok(
        titel,
        `<ul style="color:#dddddd;line-height:1.6">${regels}</ul>` +
          (allesOk ? "" : p("Probeer het opnieuw met de knop op de pagina.") + knop(link, "Weekoverzicht openen"))
      ),
    });
  }

  return NextResponse.json({ ok: allesOk, live: isLive(), resultaten }, { status: allesOk ? 200 : 502 });
}
