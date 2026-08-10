import { NextRequest, NextResponse } from "next/server";
import { getPloeg, PLOEGEN } from "@/lib/social/ploegen";
import { bouwMatchday, EIGEN_LOGO_PAD } from "@/lib/social/matchday";
import { bouwUitslag, afficheDoelpunten } from "@/lib/social/uitslag";
import { genereerAffiche, type AfficheOpdracht } from "@/lib/social/affiche-ai";

/**
 * Genereert één affiche met het beeldmodel en geeft de PNG rechtstreeks terug.
 * Bedoeld om de opzet te beproeven en de prompt bij te schaven.
 *
 * Alleen bereikbaar tijdens lokale ontwikkeling.
 *
 *   /api/social/affiche-test?soort=wedstrijd&ploeg=heren-p2
 *   /api/social/affiche-test?soort=uitslag&ploeg=heren-p2
 */

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Alleen lokaal beschikbaar" }, { status: 404 });
  }

  const params = request.nextUrl.searchParams;
  const soort = params.get("soort") === "uitslag" ? "uitslag" : "wedstrijd";
  const ploeg = getPloeg(params.get("ploeg") ?? "heren-p2") ?? PLOEGEN[0];

  let opdracht: AfficheOpdracht;

  if (soort === "uitslag") {
    const uitslag = await bouwUitslag(ploeg, 400);
    if (!uitslag) {
      return NextResponse.json(
        { error: `Geen gespeelde wedstrijd gevonden voor ${ploeg.naam}` },
        { status: 404 }
      );
    }
    opdracht = {
      soort,
      badge: `${ploeg.label} - UITSLAG`,
      thuisploeg: uitslag.thuisploeg,
      uitploeg: uitslag.uitploeg,
      tegenstanderLogo: uitslag.isThuis
        ? uitslag.uitLogo ?? null
        : uitslag.thuisLogo ?? null,
      tegenstanderLinks: !uitslag.isThuis,
      weekdag: "",
      dag: "",
      maand: "",
      tijd: "",
      thuisScore: String(uitslag.thuisScore),
      uitScore: String(uitslag.uitScore),
      doelpuntenThuis: afficheDoelpunten(uitslag, true),
      doelpuntenUit: afficheDoelpunten(uitslag, false),
      veldNaam: uitslag.isThuis ? "Linkwood Park" : "",
      veldStraat: uitslag.isThuis ? "Kapelstraat 72" : "",
      veldGemeente: uitslag.isThuis ? "3560 Linkhout" : "",
    };
  } else {
    const matchday = await bouwMatchday(ploeg, 400);
    if (!matchday) {
      return NextResponse.json(
        { error: `Geen komende wedstrijd gevonden voor ${ploeg.naam}` },
        { status: 404 }
      );
    }
    const kort = new Intl.DateTimeFormat("nl-BE", {
      timeZone: "Europe/Brussels",
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(matchday.aftrap);
    const deel = (soortNaam: string) =>
      kort.find((p) => p.type === soortNaam)?.value ?? "";

    opdracht = {
      soort,
      badge: `${ploeg.label} - VOLGENDE WEDSTRIJD`,
      thuisploeg: matchday.thuisploeg,
      uitploeg: matchday.uitploeg,
      tegenstanderLogo:
        (matchday.isThuis ? matchday.uitLogo : matchday.thuisLogo) ?? null,
      tegenstanderLinks: !matchday.isThuis,
      weekdag: deel("weekday").replace(".", "").toUpperCase(),
      dag: deel("day"),
      maand: deel("month").replace(".", "").toUpperCase(),
      tijd: `${deel("hour")}:${deel("minute")}`,
      thuisScore: "",
      uitScore: "",
      doelpuntenThuis: [],
      doelpuntenUit: [],
      veldNaam: matchday.isThuis ? "Linkwood Park" : "",
      veldStraat: matchday.isThuis ? "Kapelstraat 72" : "",
      veldGemeente: matchday.isThuis ? "3560 Linkhout" : "",
    };
  }

  // Het eigen logo geven we niet mee: dat staat al op het sjabloon.
  void EIGEN_LOGO_PAD;

  const resultaat = await genereerAffiche(opdracht);
  if (!resultaat.ok || !resultaat.beeld) {
    return NextResponse.json({ error: resultaat.fout, opdracht }, { status: 502 });
  }

  return new Response(new Uint8Array(resultaat.beeld), {
    headers: {
      "Content-Type": resultaat.mime ?? "image/jpeg",
      "Cache-Control": "no-store",
    },
  });
}
