import { NextRequest, NextResponse } from "next/server";
import { verstuurMail } from "@/lib/social/mail";
import { siteUrl } from "@/lib/social/omgeving";
import { dezeMaandag, staat, wasOvergeslagen, weekLink } from "@/lib/social/weekoverzicht-post";

/**
 * Maandagavond: staat het weekoverzicht op Facebook? De thuis-pc plaatst het
 * om 18:00. Stond die uit of liep er iets mis zonder melding, dan komt hier
 * een mail met de knop.
 *
 * Aangeroepen door de Vercel-cron (vercel.json) met CRON_SECRET als Bearer-token.
 */

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const geheim = process.env.CRON_SECRET;
  if (!geheim || request.headers.get("authorization") !== `Bearer ${geheim}`) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const week = dezeMaandag();
  const geplaatst = await staat(week);
  if (geplaatst.facebook) return NextResponse.json({ week, ok: true, geplaatst });
  // De pc heeft al gemaild waarom hij niets plaatste.
  if (await wasOvergeslagen(week)) return NextResponse.json({ week, ok: true, overgeslagen: true });

  const link = weekLink(siteUrl(), week);
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;background:#141010;color:#ffffff;border-radius:12px">
  <h2 style="margin:0 0 12px">Weekoverzicht nog niet geplaatst</h2>
  <p style="color:#dddddd;line-height:1.5">Om 18:00 is het weekoverzicht van deze week niet vanzelf op Facebook gekomen. Misschien stond de thuis-pc uit. Open de pagina, kijk het beeld na en plaats het met de knop.</p>
  <p style="margin:24px 0"><a href="${link}" style="display:inline-block;padding:14px 24px;background:#9e1b1b;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700">Weekoverzicht openen</a></p>
</div>`;

  if (request.nextUrl.searchParams.get("droog") === "1") {
    return NextResponse.json({ week, droog: true, zouMailen: true });
  }
  const verstuurd = await verstuurMail({ onderwerp: "Weekoverzicht nog niet geplaatst", html });
  return NextResponse.json({ week, verstuurd }, { status: verstuurd ? 200 : 500 });
}
