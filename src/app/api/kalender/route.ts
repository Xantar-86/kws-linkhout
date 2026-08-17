import { NextRequest, NextResponse } from "next/server";
import { teams } from "@/lib/teams";
import { getRbfaWedstrijden } from "@/lib/rbfa";
import { bouwIcs } from "@/lib/kalender-ics";

/**
 * De wedstrijdkalender van één ploeg als agendabestand.
 *
 * Aanroepen met ?ploeg=<slug>, bijvoorbeeld /api/kalender?ploeg=eerste-ploeg.
 * Wie zich hierop abonneert houdt de kalender vanzelf bij; wie hem downloadt
 * heeft een momentopname.
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Het ploegnummer bij de KBVB staat al in de adressen van de kalender op de
 * ploegpagina. We halen het daaruit in plaats van het nog eens apart bij te
 * houden; zo kan het niet uit elkaar lopen.
 */
function rbfaPloegId(url?: string): string | null {
  return url?.match(/\/ploeg\/(\d+)\//)?.[1] ?? null;
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("ploeg");
  const ploeg = teams.find((t) => t.slug === slug);

  if (!ploeg) {
    return NextResponse.json({ error: "Onbekende ploeg" }, { status: 404 });
  }

  const teamId = rbfaPloegId(ploeg.calendarIframe);
  if (!teamId) {
    return NextResponse.json(
      { error: `Voor ${ploeg.name} is er nog geen kalender bij de KBVB` },
      { status: 404 }
    );
  }

  try {
    const wedstrijden = await getRbfaWedstrijden(teamId);
    const ics = bouwIcs({
      naam: `K.W.S. Linkhout ${ploeg.name}`,
      wedstrijden,
      domein: request.nextUrl.hostname,
    });

    return new NextResponse(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="kws-${ploeg.slug}.ics"`,
        // Een uur bewaren volstaat: uitstel wordt zelden op het laatste
        // moment doorgegeven, en agenda's kijken toch maar enkele keren per dag.
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (fout) {
    console.error("[kalender] ophalen mislukt:", fout);
    return NextResponse.json(
      { error: "De kalender kon niet opgehaald worden" },
      { status: 502 }
    );
  }
}
