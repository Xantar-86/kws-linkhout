import { getPloeg, type PloegConfig } from "./ploegen";
import { bouwMatchday } from "./matchday";
import { bouwUitslag } from "./uitslag";
import { bouwAfbeeldingUrl, bouwUitslagAfbeeldingUrl } from "./afbeelding";
import { leesGoedkeuringToken, type PostSoort } from "./handtekening";
import { siteUrl } from "./omgeving";
import { haalAffiche } from "./opslag";

/**
 * Zet een goedkeuringstoken uit de mail om in de post die erachter zit.
 * Gedeeld door de goedkeuringspagina en de publiceerroute, zodat beide exact
 * dezelfde controles doen.
 */

export interface Voorstel {
  ploeg: PloegConfig;
  soort: PostSoort;
  aftrapIso: string;
  aftrap: Date;
  thuisploeg: string;
  uitploeg: string;
  isThuis: boolean;
  caption: string;
  afbeeldingUrl: string;
  /** Alleen bij een uitslag. */
  uitslagTekst?: string;
}

export type VoorstelFout = {
  bericht: string;
  status: number;
};

/**
 * Geeft het voorstel terug, of een fout met de juiste HTTP-status.
 * De aftraptijd in het token moet nog overeenkomen met de kalender; wijkt die
 * af, dan is de wedstrijd verzet en is de link niet meer geldig.
 */
export async function leesVoorstel(
  token: string | null
): Promise<{ voorstel: Voorstel } | { fout: VoorstelFout }> {
  if (!token) {
    return { fout: { bericht: "Token ontbreekt", status: 400 } };
  }

  const payload = leesGoedkeuringToken(token);
  if (!payload) {
    return { fout: { bericht: "Deze link is ongeldig of vervallen", status: 403 } };
  }

  const ploeg = getPloeg(payload.p);
  if (!ploeg) {
    return { fout: { bericht: "Onbekende ploeg", status: 404 } };
  }

  const basis = siteUrl();
  const soort: PostSoort = payload.s ?? "wedstrijd";

  if (soort === "uitslag") {
    const uitslag = await bouwUitslag(ploeg, 30);
    if (!uitslag) {
      return { fout: { bericht: "Er is geen afgewerkte wedstrijd gevonden", status: 404 } };
    }
    if (uitslag.aftrapIso !== payload.w) {
      return {
        fout: {
          bericht:
            "Er is intussen een nieuwere wedstrijd gespeeld. Vraag een nieuw voorstel aan.",
          status: 409,
        },
      };
    }

    return {
      voorstel: {
        ploeg,
        soort,
        aftrapIso: uitslag.aftrapIso,
        aftrap: uitslag.aftrap,
        thuisploeg: uitslag.thuisploeg,
        uitploeg: uitslag.uitploeg,
        isThuis: uitslag.isThuis,
        caption: uitslag.caption,
        afbeeldingUrl:
          (await haalAffiche({
            ploegSlug: ploeg.slug,
            soort: "uitslag",
            aftrapIso: uitslag.aftrapIso,
          })) ?? bouwUitslagAfbeeldingUrl(uitslag, basis),
        uitslagTekst: `${uitslag.thuisScore} - ${uitslag.uitScore}`,
      },
    };
  }

  const matchday = await bouwMatchday(ploeg, 30);
  if (!matchday) {
    return {
      fout: { bericht: "Er staat geen komende wedstrijd meer voor deze ploeg", status: 404 },
    };
  }
  if (matchday.aftrapIso !== payload.w) {
    return {
      fout: {
        bericht:
          "De kalender is gewijzigd sinds deze link verstuurd werd. Vraag een nieuw voorstel aan.",
        status: 409,
      },
    };
  }
  if (matchday.aftrap.getTime() < Date.now()) {
    return { fout: { bericht: "Deze wedstrijd is al gespeeld", status: 410 } };
  }

  return {
    voorstel: {
      ploeg,
      soort,
      aftrapIso: matchday.aftrapIso,
      aftrap: matchday.aftrap,
      thuisploeg: matchday.thuisploeg,
      uitploeg: matchday.uitploeg,
      isThuis: matchday.isThuis,
      caption: matchday.caption,
      afbeeldingUrl:
        (await haalAffiche({
          ploegSlug: ploeg.slug,
          soort: "wedstrijd",
          aftrapIso: matchday.aftrapIso,
        })) ?? bouwAfbeeldingUrl(matchday, basis),
    },
  };
}
