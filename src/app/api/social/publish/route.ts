import { NextRequest, NextResponse } from "next/server";
import { leesVoorstel } from "@/lib/social/goedkeuring";
import { fallbackAfbeeldingUrl } from "@/lib/social/afbeelding";
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
 * Publiceert een goedgekeurde post. Enkel bereikbaar met een geldig token uit
 * de voorstelmail, en alleen via POST, zodat een link die in een mailprogramma
 * vooraf geladen wordt nooit iets kan plaatsen.
 */

export const dynamic = "force-dynamic";

interface Body {
  token?: string;
  /** Eventueel aangepaste tekst uit de goedkeuringspagina. */
  caption?: string;
  platforms?: string[];
}

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const resultaat = await leesVoorstel(body.token ?? null);
  if ("fout" in resultaat) {
    return NextResponse.json(
      { error: resultaat.fout.bericht },
      { status: resultaat.fout.status }
    );
  }

  const { voorstel } = resultaat;
  const ploeg = voorstel.ploeg;

  const caption = (body.caption ?? voorstel.caption).trim();
  if (!caption) {
    return NextResponse.json({ error: "De tekst is leeg" }, { status: 400 });
  }
  if (caption.length > 2200) {
    // Instagram kapt bijschriften af boven 2200 tekens.
    return NextResponse.json(
      { error: "De tekst is te lang voor Instagram (max 2200 tekens)" },
      { status: 400 }
    );
  }

  const gevraagd = new Set(body.platforms ?? ["facebook", "instagram"]);
  const doelen = doelenVoor(ploeg);
  const afbeeldingUrl = voorstel.afbeeldingUrl || fallbackAfbeeldingUrl(siteUrl());

  // De post-sleutel bevat het soort, zodat de aankondiging en de uitslag van
  // dezelfde wedstrijd elkaar niet als dubbele post blokkeren.
  const sleutel = `${ploeg.slug}:${voorstel.soort}`;
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
    if (!doelId || !doelen.pageToken) {
      resultaten.push({
        platform,
        ok: false,
        postId: null,
        bericht: `${platform === "facebook" ? "Facebook" : "Instagram"} niet geconfigureerd voor ${ploeg.naam}`,
        dryRun: false,
      });
      return;
    }

    if (await alGepost(sleutel, voorstel.aftrapIso, platform)) {
      resultaten.push({
        platform,
        ok: true,
        postId: null,
        bericht: "Overgeslagen: deze post stond er al",
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
        ploegSlug: sleutel,
        aftrapIso: voorstel.aftrapIso,
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
    live: isLive(),
    ploeg: ploeg.naam,
    soort: voorstel.soort,
    resultaten,
    ok: resultaten.every((r) => r.ok),
  });
}
