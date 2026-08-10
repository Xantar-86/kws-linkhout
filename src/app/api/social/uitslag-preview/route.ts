import { NextRequest, NextResponse } from "next/server";
import { PLOEGEN } from "@/lib/social/ploegen";
import { bouwUitslag } from "@/lib/social/uitslag";
import { bouwUitslagAfbeeldingUrl } from "@/lib/social/afbeelding";
import { bouwUitslagMailHtml, verstuurMail, type UitslagMailItem } from "@/lib/social/mail";
import { siteUrl, cronGeautoriseerd } from "@/lib/social/omgeving";
import { alGemeld, noteerMelding } from "@/lib/social/logboek";
import { haalAffiche } from "@/lib/social/opslag";

/**
 * Kijkt of de KBVB de uitslag van een net gespeelde wedstrijd al gepubliceerd
 * heeft, en mailt die dan ter goedkeuring.
 *
 * Draait ieder uur na een speeldag. De meeste runs vinden niets nieuws en dat
 * is de normale uitkomst. Elke wedstrijd wordt maar één keer gemeld, dankzij
 * het meldingenlogboek in Supabase.
 *
 * Deze route post nooit iets. Met ?droog=1 krijg je de JSON terug zonder mail.
 */

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const droog = request.nextUrl.searchParams.get("droog") === "1";

  if (!cronGeautoriseerd(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const basis = siteUrl();
  const items: UitslagMailItem[] = [];
  const overgeslagen: string[] = [];

  for (const ploeg of PLOEGEN) {
    try {
      // Kijk tot drie dagen terug; daarna is de uitslag geen nieuws meer.
      const uitslag = await bouwUitslag(ploeg, 3);
      if (!uitslag) {
        overgeslagen.push(`${ploeg.naam}: geen recent afgewerkte wedstrijd`);
        continue;
      }

      // Zonder doelpunten is het wedstrijdblad vermoedelijk nog niet verwerkt.
      // Een echte 0-0 herkennen we niet van "nog geen data", dus wachten we
      // tot er iets staat, of tot de wedstrijd meer dan een dag oud is.
      const urenGeleden = (Date.now() - uitslag.aftrap.getTime()) / 3_600_000;
      if (uitslag.doelpunten.length === 0 && urenGeleden < 24) {
        overgeslagen.push(`${ploeg.naam}: wedstrijdblad lijkt nog niet verwerkt`);
        continue;
      }

      if (await alGemeld(ploeg.slug, uitslag.aftrapIso, "uitslag")) {
        overgeslagen.push(`${ploeg.naam}: al gemeld`);
        continue;
      }

      const opgeslagen = await haalAffiche({
        ploegSlug: ploeg.slug,
        soort: "uitslag",
        aftrapIso: uitslag.aftrapIso,
      });
      items.push({
        uitslag,
        afbeeldingUrl: opgeslagen ?? bouwUitslagAfbeeldingUrl(uitslag, basis),
      });
    } catch (error) {
      overgeslagen.push(`${ploeg.naam}: ${error instanceof Error ? error.message : error}`);
    }
  }

  if (items.length === 0) {
    return NextResponse.json({ verstuurd: false, reden: "niets nieuws", overgeslagen });
  }

  if (droog) {
    return NextResponse.json({
      verstuurd: false,
      droog: true,
      overgeslagen,
      voorstellen: items.map((i) => ({
        ploeg: i.uitslag.ploeg.naam,
        uitslag: `${i.uitslag.thuisScore}-${i.uitslag.uitScore}`,
        caption: i.uitslag.caption,
        afbeeldingUrl: i.afbeeldingUrl,
      })),
    });
  }

  const verstuurd = await verstuurMail({
    onderwerp:
      items.length === 1
        ? `Uitslag ${items[0].uitslag.ploeg.naam}: ${items[0].uitslag.thuisScore}-${items[0].uitslag.uitScore}`
        : `${items.length} uitslagen klaar ter goedkeuring`,
    html: bouwUitslagMailHtml(items, basis),
  });

  // Pas noteren als de mail echt vertrokken is, anders missen we de melding.
  if (verstuurd) {
    for (const item of items) {
      await noteerMelding(item.uitslag.ploeg.slug, item.uitslag.aftrapIso, "uitslag");
    }
  }

  return NextResponse.json({
    verstuurd,
    aantal: items.length,
    ploegen: items.map((i) => i.uitslag.ploeg.naam),
    overgeslagen,
  });
}
