import { NextRequest, NextResponse } from "next/server";
import { PLOEGEN } from "@/lib/social/ploegen";
import { bouwMatchday } from "@/lib/social/matchday";
import { bouwAfbeeldingUrl } from "@/lib/social/afbeelding";
import { haalAffiche } from "@/lib/social/opslag";
import { bouwMailHtml, verstuurMail, type MailItem } from "@/lib/social/mail";
import { siteUrl, cronGeautoriseerd } from "@/lib/social/omgeving";

/**
 * Wekelijkse voorstelmail. Wordt aangeroepen door de cron (GitHub Actions) met
 * het gedeelde geheim in de Authorization-header.
 *
 * Deze route post nooit iets. Ze bouwt de voorstellen en mailt ze.
 * Met ?droog=1 krijg je de JSON terug zonder mail te versturen, handig om te
 * testen.
 */

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const droog = request.nextUrl.searchParams.get("droog") === "1";

  if (!cronGeautoriseerd(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const basis = siteUrl();
  const items: MailItem[] = [];
  const overgeslagen: string[] = [];

  for (const ploeg of PLOEGEN) {
    try {
      const matchday = await bouwMatchday(ploeg);
      if (!matchday) {
        overgeslagen.push(`${ploeg.naam}: geen wedstrijd binnen 8 dagen`);
        continue;
      }
      // Het beeld dat in ChatGPT gemaakt is heeft voorrang; de zelf getekende
      // versie is enkel de terugval zolang dat er niet is.
      const opgeslagen = await haalAffiche({
        ploegSlug: ploeg.slug,
        soort: "wedstrijd",
        aftrapIso: matchday.aftrapIso,
      });
      items.push({
        matchday,
        afbeeldingUrl: opgeslagen ?? bouwAfbeeldingUrl(matchday, basis),
      });
    } catch (error) {
      overgeslagen.push(`${ploeg.naam}: ${error instanceof Error ? error.message : error}`);
    }
  }

  if (items.length === 0) {
    return NextResponse.json({ verstuurd: false, reden: "geen wedstrijden", overgeslagen });
  }

  const html = bouwMailHtml(items, basis);

  if (droog) {
    return NextResponse.json({
      verstuurd: false,
      droog: true,
      overgeslagen,
      voorstellen: items.map((i) => ({
        ploeg: i.matchday.ploeg.naam,
        aftrap: i.matchday.aftrapIso,
        caption: i.matchday.caption,
        afbeeldingUrl: i.afbeeldingUrl,
      })),
    });
  }

  const verstuurd = await verstuurMail({
    onderwerp: `Matchday: ${items.length} post${items.length > 1 ? "s" : ""} klaar ter goedkeuring`,
    html,
  });

  return NextResponse.json({
    verstuurd,
    aantal: items.length,
    ploegen: items.map((i) => i.matchday.ploeg.naam),
    overgeslagen,
  });
}
