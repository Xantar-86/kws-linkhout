import { NextRequest, NextResponse } from "next/server";
import { getPloeg } from "@/lib/social/ploegen";
import { bouwMatchday } from "@/lib/social/matchday";
import { bouwUitslag } from "@/lib/social/uitslag";
import { bouwAfbeeldingUrl, bouwUitslagAfbeeldingUrl } from "@/lib/social/afbeelding";
import { haalAffiche } from "@/lib/social/opslag";
import { siteUrl, doelenVoor } from "@/lib/social/omgeving";
import {
  postNaarFacebook,
  postNaarInstagram,
  isLive,
  type PostResultaat,
  type Platform,
} from "@/lib/social/meta";
import { alGepost, noteerPost } from "@/lib/social/logboek";

/**
 * Plaatst een post rechtstreeks vanaf de opdrachtpagina.
 *
 * Beveiligd met dezelfde sleutel als die pagina, en alleen via POST, zodat een
 * link die per ongeluk geopend wordt nooit iets kan plaatsen.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 120;

interface Body {
  ploeg?: string;
  soort?: "wedstrijd" | "uitslag";
  caption?: string;
  platforms?: string[];
}

export async function POST(request: NextRequest) {
  const sleutel = process.env.MATCHDAY_SLEUTEL;
  if (!sleutel || request.headers.get("authorization") !== `Bearer ${sleutel}`) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const ploeg = getPloeg(body.ploeg ?? "");
  if (!ploeg) {
    return NextResponse.json({ error: "Onbekende ploeg" }, { status: 400 });
  }
  const soort = body.soort === "uitslag" ? "uitslag" : "wedstrijd";

  // Wedstrijd opzoeken en de affiche bepalen.
  const basis = siteUrl();
  let aftrapIso: string;
  let standaardCaption: string;
  let terugvalAfbeelding: string;

  if (soort === "uitslag") {
    const uitslag = await bouwUitslag(ploeg, 14);
    if (!uitslag) {
      return NextResponse.json(
        { error: `Geen recente uitslag voor ${ploeg.naam}` },
        { status: 404 }
      );
    }
    aftrapIso = uitslag.aftrapIso;
    standaardCaption = uitslag.caption;
    terugvalAfbeelding = bouwUitslagAfbeeldingUrl(uitslag, basis);
  } else {
    const matchday = await bouwMatchday(ploeg, 14);
    if (!matchday) {
      return NextResponse.json(
        { error: `Geen komende wedstrijd voor ${ploeg.naam}` },
        { status: 404 }
      );
    }
    if (matchday.aftrap.getTime() < Date.now()) {
      return NextResponse.json({ error: "Deze wedstrijd is al gespeeld" }, { status: 410 });
    }
    aftrapIso = matchday.aftrapIso;
    standaardCaption = matchday.caption;
    terugvalAfbeelding = bouwAfbeeldingUrl(matchday, basis);
  }

  const afbeeldingUrl =
    (await haalAffiche({ ploegSlug: ploeg.slug, soort, aftrapIso })) ?? terugvalAfbeelding;

  const caption = (body.caption ?? standaardCaption).trim();
  if (!caption) {
    return NextResponse.json({ error: "De tekst is leeg" }, { status: 400 });
  }
  if (caption.length > 2200) {
    return NextResponse.json(
      { error: "De tekst is te lang voor Instagram (max 2200 tekens)" },
      { status: 400 }
    );
  }

  const gevraagd = new Set(body.platforms ?? []);
  if (gevraagd.size === 0) {
    return NextResponse.json({ error: "Kies minstens één platform" }, { status: 400 });
  }

  const doelen = doelenVoor(ploeg);
  const sleutelPost = `${ploeg.slug}:${soort}`;
  const resultaten: PostResultaat[] = [];

  async function plaats(
    platform: Platform,
    doelId: string | undefined,
    poster: (opts: {
      pageId: string;
      pageToken: string;
      caption: string;
      afbeeldingUrl: string;
    }) => Promise<PostResultaat>
  ) {
    const naam = platform === "facebook" ? "Facebook" : "Instagram";
    if (!doelId || !doelen.pageToken) {
      resultaten.push({
        platform,
        ok: false,
        postId: null,
        bericht: `${naam} is nog niet ingesteld voor ${ploeg!.naam}`,
        dryRun: false,
      });
      return;
    }
    if (await alGepost(sleutelPost, aftrapIso, platform)) {
      resultaten.push({
        platform,
        ok: true,
        postId: null,
        bericht: `Stond al op ${naam}`,
        dryRun: false,
      });
      return;
    }

    const uitkomst = await poster({
      pageId: doelId,
      pageToken: doelen.pageToken,
      caption,
      afbeeldingUrl,
    });
    resultaten.push(uitkomst);

    if (uitkomst.ok && !uitkomst.dryRun) {
      await noteerPost({
        ploegSlug: sleutelPost,
        aftrapIso,
        platform,
        postId: uitkomst.postId,
        caption,
      });
    }
  }

  if (gevraagd.has("facebook")) {
    await plaats("facebook", doelen.facebookPageId, postNaarFacebook);
  }
  if (gevraagd.has("instagram")) {
    await plaats("instagram", doelen.instagramAccountId, (opts) =>
      postNaarInstagram({
        accountId: opts.pageId,
        pageToken: opts.pageToken,
        caption: opts.caption,
        afbeeldingUrl: opts.afbeeldingUrl,
      })
    );
  }

  return NextResponse.json({
    ok: resultaten.every((r) => r.ok),
    live: isLive(),
    resultaten,
  });
}
