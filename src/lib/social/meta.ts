/**
 * Publiceren naar Facebook en Instagram via de Meta Graph API.
 *
 * Alles staat standaard in dry-run: zolang SOCIAL_LIVE niet exact "true" is,
 * wordt er niets verstuurd en krijg je enkel terug wat er gepost zou worden.
 */

const GRAPH = "https://graph.facebook.com/v21.0";

export type Platform = "facebook" | "instagram";

export interface PostResultaat {
  platform: Platform;
  ok: boolean;
  /** ID van de post bij Meta, of null bij dry-run of fout. */
  postId: string | null;
  /** Leesbare uitleg voor in de bevestigingsmail en de logs. */
  bericht: string;
  dryRun: boolean;
}

export function isLive(): boolean {
  return process.env.SOCIAL_LIVE === "true";
}

async function graph(
  pad: string,
  body: Record<string, string>
): Promise<Record<string, unknown>> {
  const response = await fetch(`${GRAPH}/${pad}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
  const json = await response.json();
  if (!response.ok || json.error) {
    const fout = json?.error?.message ?? `HTTP ${response.status}`;
    throw new Error(`Graph API: ${fout}`);
  }
  return json;
}

/**
 * Post een foto met bijschrift op een Facebook-pagina.
 * Het /photos-endpoint zet de afbeelding in de post zelf, zonder linkpreview.
 */
export async function postNaarFacebook(opts: {
  pageId: string;
  pageToken: string;
  caption: string;
  afbeeldingUrl: string;
}): Promise<PostResultaat> {
  if (!isLive()) {
    return {
      platform: "facebook",
      ok: true,
      postId: null,
      bericht: `Dry-run: zou posten op pagina ${opts.pageId}`,
      dryRun: true,
    };
  }

  try {
    const json = await graph(`${opts.pageId}/photos`, {
      url: opts.afbeeldingUrl,
      caption: opts.caption,
      published: "true",
      access_token: opts.pageToken,
    });
    const postId = String(json.post_id ?? json.id ?? "");
    return {
      platform: "facebook",
      ok: true,
      postId,
      bericht: `Geplaatst op Facebook (${postId})`,
      dryRun: false,
    };
  } catch (error) {
    return {
      platform: "facebook",
      ok: false,
      postId: null,
      bericht: `Facebook mislukt: ${error instanceof Error ? error.message : error}`,
      dryRun: false,
    };
  }
}

/**
 * Post op Instagram. Dat gaat in twee stappen: eerst een mediacontainer maken,
 * die door Meta verwerkt wordt, en die daarna publiceren. De afbeelding moet op
 * een publiek bereikbare URL staan.
 */
export async function postNaarInstagram(opts: {
  accountId: string;
  pageToken: string;
  caption: string;
  afbeeldingUrl: string;
}): Promise<PostResultaat> {
  if (!isLive()) {
    return {
      platform: "instagram",
      ok: true,
      postId: null,
      bericht: `Dry-run: zou posten op IG-account ${opts.accountId}`,
      dryRun: true,
    };
  }

  try {
    const container = await graph(`${opts.accountId}/media`, {
      image_url: opts.afbeeldingUrl,
      caption: opts.caption,
      access_token: opts.pageToken,
    });
    const creationId = String(container.id);

    await wachtTotContainerKlaar(creationId, opts.pageToken);

    const json = await graph(`${opts.accountId}/media_publish`, {
      creation_id: creationId,
      access_token: opts.pageToken,
    });
    const postId = String(json.id ?? "");
    return {
      platform: "instagram",
      ok: true,
      postId,
      bericht: `Geplaatst op Instagram (${postId})`,
      dryRun: false,
    };
  } catch (error) {
    return {
      platform: "instagram",
      ok: false,
      postId: null,
      bericht: `Instagram mislukt: ${error instanceof Error ? error.message : error}`,
      dryRun: false,
    };
  }
}

/**
 * Meta verwerkt de mediacontainer asynchroon. Publiceren voor status_code
 * FINISHED is, geeft een fout, dus we pollen kort.
 */
async function wachtTotContainerKlaar(
  creationId: string,
  token: string,
  maxPogingen = 12
): Promise<void> {
  for (let poging = 0; poging < maxPogingen; poging++) {
    const response = await fetch(
      `${GRAPH}/${creationId}?fields=status_code,status&access_token=${encodeURIComponent(token)}`
    );
    const json = await response.json();
    const status = json?.status_code;

    if (status === "FINISHED") return;
    if (status === "ERROR" || status === "EXPIRED") {
      throw new Error(`Container ${status}: ${json?.status ?? "geen details"}`);
    }
    await new Promise((r) => setTimeout(r, 2500));
  }
  throw new Error("Container werd niet tijdig verwerkt door Instagram");
}

/**
 * Controleert of het token nog geldig is en welke rechten het draagt.
 * Handig voor de onderhoudsagent: Meta-tokens kunnen ingetrokken worden.
 */
export async function controleerToken(pageToken: string): Promise<{
  geldig: boolean;
  details: string;
}> {
  try {
    const response = await fetch(
      `${GRAPH}/me?fields=id,name&access_token=${encodeURIComponent(pageToken)}`
    );
    const json = await response.json();
    if (json.error) {
      return { geldig: false, details: json.error.message };
    }
    return { geldig: true, details: `${json.name} (${json.id})` };
  } catch (error) {
    return { geldig: false, details: String(error) };
  }
}
