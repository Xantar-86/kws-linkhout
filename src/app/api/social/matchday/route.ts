import { NextRequest, NextResponse } from "next/server";
import { leesVoorstel } from "@/lib/social/goedkeuring";
import { doelenVoor } from "@/lib/social/omgeving";
import { isLive } from "@/lib/social/meta";

/**
 * Levert de gegevens achter een goedkeuringslink aan de goedkeuringspagina.
 * Puur lezen, hier wordt niets gepubliceerd.
 */

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const resultaat = await leesVoorstel(request.nextUrl.searchParams.get("token"));

  if ("fout" in resultaat) {
    return NextResponse.json(
      { error: resultaat.fout.bericht },
      { status: resultaat.fout.status }
    );
  }

  const { voorstel } = resultaat;
  const doelen = doelenVoor(voorstel.ploeg);

  return NextResponse.json({
    ploeg: {
      slug: voorstel.ploeg.slug,
      naam: voorstel.ploeg.naam,
      reeks: voorstel.ploeg.reeks,
    },
    soort: voorstel.soort,
    wedstrijd: {
      thuisploeg: voorstel.thuisploeg,
      uitploeg: voorstel.uitploeg,
      aftrapIso: voorstel.aftrapIso,
      isThuis: voorstel.isThuis,
      uitslag: voorstel.uitslagTekst ?? null,
    },
    caption: voorstel.caption,
    afbeeldingUrl: voorstel.afbeeldingUrl,
    beschikbaar: {
      facebook: Boolean(doelen.facebookPageId && doelen.pageToken),
      instagram: Boolean(doelen.instagramAccountId && doelen.pageToken),
    },
    live: isLive(),
  });
}
