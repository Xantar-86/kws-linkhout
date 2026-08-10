import { PLOEGEN, type PloegConfig } from "./ploegen";
import { bouwMatchday, formatteerKort } from "./matchday";
import { bouwUitslag, afficheDoelpunten } from "./uitslag";
import { bouwPrompt, type AfficheOpdracht } from "./affiche-ai";
import { haalAffiche } from "./opslag";
import { doelenVoor } from "./omgeving";
import { alGepost } from "./logboek";

/**
 * De opdrachten die klaarstaan om er een affiche van te maken.
 *
 * Het beeld wordt gemaakt in ChatGPT: de opdrachtpagina geeft per ploeg een
 * kant-en-klare prompt en het logo van de tegenstander. Zodra het beeld
 * opgeslagen is in de bewaakte map, uploadt de wachter het en is de post
 * compleet.
 */

export interface Opdracht {
  ploeg: PloegConfig;
  soort: "wedstrijd" | "uitslag";
  aftrapIso: string;
  /** Korte omschrijving voor de pagina, bijvoorbeeld "KWS - Hasselt, zo 9 aug". */
  omschrijving: string;
  /** De volledige tekst om in ChatGPT te plakken. */
  prompt: string;
  /** URL van het logo van de tegenstander, om mee te sturen. */
  tegenstanderLogo: string | null;
  /** Het lege clubsjabloon dat als basis dient. */
  sjabloonUrl: string;
  /** Ons eigen clubschild. */
  eigenLogoUrl: string;
  /** Publieke URL van het beeld als dat al geüpload is. */
  afficheUrl: string | null;
  /** De begeleidende tekst van de post. Aanpasbaar op de pagina. */
  caption: string;
  /** Waar deze ploeg naartoe kan posten. */
  beschikbaar: { facebook: boolean; instagram: boolean };
  /** Al geplaatst op deze platformen. */
  geplaatst: { facebook: boolean; instagram: boolean };
  /** Alle ingevulde waarden, voor wie de affiche zelf samenstelt. */
  gegevens: AfficheOpdracht;
}


/** Welke platformen ingesteld zijn, en waar deze post al staat. */
async function platformStatus(
  ploeg: PloegConfig,
  soort: "wedstrijd" | "uitslag",
  aftrapIso: string
) {
  const doelen = doelenVoor(ploeg);
  const sleutel = `${ploeg.slug}:${soort}`;
  return {
    beschikbaar: {
      facebook: Boolean(doelen.facebookPageId && doelen.pageToken),
      instagram: Boolean(doelen.instagramAccountId && doelen.pageToken),
    },
    geplaatst: {
      facebook: await alGepost(sleutel, aftrapIso, "facebook"),
      instagram: await alGepost(sleutel, aftrapIso, "instagram"),
    },
  };
}

function korteDatum(datum: Date): string {
  const k = formatteerKort(datum);
  return `${k.datum.toLowerCase()} ${k.tijd}`;
}

/** Bouwt de opdracht voor de eerstvolgende wedstrijd van een ploeg. */
async function wedstrijdOpdracht(
  ploeg: PloegConfig,
  binnenDagen: number
): Promise<Opdracht | null> {
  const matchday = await bouwMatchday(ploeg, binnenDagen);
  if (!matchday) return null;

  const kort = formatteerKort(matchday.aftrap);
  const gegevens: AfficheOpdracht = {
    soort: "wedstrijd",
    badge: `${ploeg.label} - VOLGENDE WEDSTRIJD`,
    thuisploeg: matchday.thuisploeg,
    uitploeg: matchday.uitploeg,
    tegenstanderLogo: (matchday.isThuis ? matchday.uitLogo : matchday.thuisLogo) ?? null,
    tegenstanderLinks: !matchday.isThuis,
    weekdag: kort.weekdagKort,
    dag: kort.dagNummer,
    maand: kort.maandKort,
    tijd: kort.tijd,
    thuisScore: "",
    uitScore: "",
    doelpuntenThuis: [],
    doelpuntenUit: [],
    veldNaam: matchday.veld?.naam ?? "",
    veldStraat: matchday.veld?.straat ?? "",
    veldGemeente: matchday.veld?.gemeente ?? "",
  };

  return {
    ploeg,
    soort: "wedstrijd",
    aftrapIso: matchday.aftrapIso,
    omschrijving: `${matchday.thuisploeg} - ${matchday.uitploeg}, ${korteDatum(matchday.aftrap)}`,
    prompt: bouwPrompt(gegevens),
    tegenstanderLogo: gegevens.tegenstanderLogo,
    sjabloonUrl: "/images/social/sjabloon-wedstrijd.png",
    eigenLogoUrl: "/images/logo-kws.png",
    afficheUrl: await haalAffiche({
      ploegSlug: ploeg.slug,
      soort: "wedstrijd",
      aftrapIso: matchday.aftrapIso,
    }),
    caption: matchday.caption,
    gegevens,
    ...(await platformStatus(ploeg, "wedstrijd", matchday.aftrapIso)),
  };
}

/** Bouwt de opdracht voor de laatst gespeelde wedstrijd van een ploeg. */
async function uitslagOpdracht(
  ploeg: PloegConfig,
  binnenDagen: number
): Promise<Opdracht | null> {
  const uitslag = await bouwUitslag(ploeg, binnenDagen);
  if (!uitslag) return null;

  const gegevens: AfficheOpdracht = {
    soort: "uitslag",
    badge: `${ploeg.label} - UITSLAG`,
    thuisploeg: uitslag.thuisploeg,
    uitploeg: uitslag.uitploeg,
    tegenstanderLogo: (uitslag.isThuis ? uitslag.uitLogo : uitslag.thuisLogo) ?? null,
    tegenstanderLinks: !uitslag.isThuis,
    weekdag: "",
    dag: "",
    maand: "",
    tijd: "",
    thuisScore: String(uitslag.thuisScore),
    uitScore: String(uitslag.uitScore),
    doelpuntenThuis: afficheDoelpunten(uitslag, true),
    doelpuntenUit: afficheDoelpunten(uitslag, false),
    veldNaam: uitslag.veld?.naam ?? "",
    veldStraat: uitslag.veld?.straat ?? "",
    veldGemeente: uitslag.veld?.gemeente ?? "",
  };

  return {
    ploeg,
    soort: "uitslag",
    aftrapIso: uitslag.aftrapIso,
    omschrijving: `${uitslag.thuisploeg} ${uitslag.thuisScore} - ${uitslag.uitScore} ${uitslag.uitploeg}`,
    prompt: bouwPrompt(gegevens),
    tegenstanderLogo: gegevens.tegenstanderLogo,
    sjabloonUrl: "/images/social/sjabloon-uitslag.png",
    eigenLogoUrl: "/images/logo-kws.png",
    afficheUrl: await haalAffiche({
      ploegSlug: ploeg.slug,
      soort: "uitslag",
      aftrapIso: uitslag.aftrapIso,
    }),
    caption: uitslag.caption,
    gegevens,
    ...(await platformStatus(ploeg, "uitslag", uitslag.aftrapIso)),
  };
}

/**
 * Alle opdrachten die nu klaarstaan: de komende wedstrijden en de recente
 * uitslagen. Ploegen zonder wedstrijd worden overgeslagen.
 */
export async function getOpdrachten(opts?: {
  wedstrijdBinnenDagen?: number;
  uitslagBinnenDagen?: number;
}): Promise<Opdracht[]> {
  const wedstrijdDagen = opts?.wedstrijdBinnenDagen ?? 8;
  const uitslagDagen = opts?.uitslagBinnenDagen ?? 4;

  const resultaten = await Promise.all(
    PLOEGEN.flatMap((ploeg) => [
      wedstrijdOpdracht(ploeg, wedstrijdDagen).catch((error) => {
        console.error(`[social] opdracht ${ploeg.slug} mislukt:`, error);
        return null;
      }),
      uitslagOpdracht(ploeg, uitslagDagen).catch((error) => {
        console.error(`[social] uitslagopdracht ${ploeg.slug} mislukt:`, error);
        return null;
      }),
    ])
  );

  return resultaten.filter((o): o is Opdracht => o !== null);
}
