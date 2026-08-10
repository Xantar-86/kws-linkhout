import { NextRequest, NextResponse } from "next/server";
import { getOpdrachten } from "@/lib/social/opdrachten";
import { onderschriften } from "@/lib/social/affiche-ai";
import { siteUrl } from "@/lib/social/omgeving";

/**
 * De openstaande opdrachten als JSON, voor de affiche-maker op de pc.
 *
 * Dat programma stuurt ComfyUI aan met deze gegevens: per opdracht de drie
 * beelden en de opdrachttekst. Met ?open=1 krijg je alleen wat nog geen beeld
 * heeft, wat de gebruikelijke aanroep is.
 */

export const dynamic = "force-dynamic";

/** "DONDERDAG 13 AUGUSTUS", zoals het in de brede balk komt. */
function voluitDatum(iso: string): string {
  return new Intl.DateTimeFormat("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Brussels",
  })
    .format(new Date(iso))
    .toUpperCase();
}

export async function GET(request: NextRequest) {
  const sleutel = process.env.MATCHDAY_SLEUTEL;
  if (!sleutel || request.headers.get("authorization") !== `Bearer ${sleutel}`) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const alleenOpen = request.nextUrl.searchParams.get("open") === "1";

  // De beelden aanbieden op het adres waarop deze aanvraag binnenkwam. Draai je
  // lokaal, dan haalt de affiche-maker ze ook lokaal op en hoeft er niets
  // uitgerold te zijn.
  const basis = request.nextUrl.origin || siteUrl();
  const alles = await getOpdrachten();
  const opdrachten = alleenOpen ? alles.filter((o) => !o.afficheUrl) : alles;

  return NextResponse.json({
    aantal: opdrachten.length,
    opdrachten: opdrachten.map((o) => ({
      // Alles wat er op de affiche moet komen, kant en klaar.
      ...o.gegevens,
      ...onderschriften(o.gegevens),
      ploeg: o.ploeg.slug,
      ploegNaam: o.ploeg.naam,
      omschrijving: o.omschrijving,
      prompt: o.prompt,
      datumRegel: voluitDatum(o.aftrapIso),
      // Absolute URL's, zodat het programma op de pc ze kan ophalen.
      sjabloonUrl: `${basis}${o.sjabloonUrl}`,
      eigenLogoUrl: `${basis}${o.eigenLogoUrl}`,
      afficheUrl: o.afficheUrl,
    })),
  });
}
