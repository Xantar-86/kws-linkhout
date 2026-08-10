import Anthropic from "@anthropic-ai/sdk";
import type { Uitslag } from "./uitslag";
import { formatteerDoelpuntenmakers } from "./uitslag";

/**
 * Zet een paar steekwoorden van iemand uit de club om in een vlotte alinea
 * voor onder de uitslagpost. Bedoeld zodat de voorzitter zelf zijn indruk van
 * de wedstrijd kan doorgeven zonder een tekst te moeten schrijven.
 *
 * De feiten (uitslag, doelpuntenmakers) komen altijd uit de RBFA-data en staan
 * al in de post. Het model mag daar niets aan toevoegen of veranderen: het
 * krijgt ze enkel als context mee zodat de alinea klopt.
 */

const MODEL = "claude-opus-5";

const SYSTEEM = `Je schrijft korte wedstrijdverslagen voor de Facebook- en Instagrampagina van K.W.S. Linkhout, een Belgische amateurvoetbalclub.

Iemand van de club geeft je in enkele steekwoorden zijn indruk van de wedstrijd. Jij maakt daar een vlotte alinea van voor onder de uitslagpost.

Regels:
- Schrijf in het Nederlands, in de wij-vorm vanuit de club.
- Twee tot vier zinnen. Nooit langer.
- Toon: warm en clubgebonden, zoals een supporter die het verslag schrijft. Niet zakelijk, niet overdreven poëtisch.
- Verzin NOOIT feiten. Gebruik enkel wat in de steekwoorden en de meegegeven wedstrijdgegevens staat. Geen namen, minuten, kansen of statistieken die er niet in staan.
- Als de steekwoorden een speler noemen, mag je die vermelden. Anders niet.
- Herhaal de uitslag niet letterlijk, die staat al boven de tekst.
- Geen hashtags, geen emoji, geen aanhalingstekens rond de tekst.
- Nooit een gedachtestreepje (em-dash) gebruiken.
- Blijf respectvol over de tegenstander en de scheidsrechter, ook bij een verlies of een discutabele fase.

Geef enkel de alinea terug, zonder inleiding of uitleg.`;

export interface SfeertekstInput {
  uitslag: Uitslag;
  /** Wat de voorzitter of iemand anders doorgaf, in gewone taal. */
  steekwoorden: string;
}

function bouwContext(uitslag: Uitslag): string {
  const eigen = uitslag.isThuis ? uitslag.thuisploeg : uitslag.uitploeg;
  const tegen = uitslag.isThuis ? uitslag.uitploeg : uitslag.thuisploeg;
  const eigenScore = uitslag.isThuis ? uitslag.thuisScore : uitslag.uitScore;
  const tegenScore = uitslag.isThuis ? uitslag.uitScore : uitslag.thuisScore;

  const regels = [
    `Ploeg: ${uitslag.ploeg.naam} (${uitslag.ploeg.label})`,
    `Reeks: ${uitslag.reeks}`,
    `Wedstrijd: ${uitslag.thuisploeg} ${uitslag.thuisScore} - ${uitslag.uitScore} ${uitslag.uitploeg}`,
    `Wij zijn ${eigen} en speelden ${uitslag.isThuis ? "thuis" : "op verplaatsing"} tegen ${tegen}.`,
    `Resultaat voor ons: ${uitslag.resultaat} (${eigenScore}-${tegenScore}).`,
  ];

  const eigenDoelpunten = formatteerDoelpuntenmakers(uitslag.doelpunten, uitslag.isThuis);
  if (eigenDoelpunten) {
    regels.push(`Onze doelpuntenmakers: ${eigenDoelpunten}.`);
  }

  return regels.join("\n");
}

export interface SfeertekstResultaat {
  ok: boolean;
  tekst: string;
  fout?: string;
}

/**
 * Genereert de alinea. Geeft ok: false terug als er geen API-sleutel is of als
 * de API faalt; de post kan dan gewoon zonder sfeertekst verder.
 */
export async function genereerSfeertekst(
  input: SfeertekstInput
): Promise<SfeertekstResultaat> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { ok: false, tekst: "", fout: "ANTHROPIC_API_KEY ontbreekt" };
  }

  const steekwoorden = input.steekwoorden.trim();
  if (!steekwoorden) {
    return { ok: false, tekst: "", fout: "Geen steekwoorden ingevuld" };
  }
  if (steekwoorden.length > 1500) {
    return { ok: false, tekst: "", fout: "De invoer is te lang (max 1500 tekens)" };
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      system: SYSTEEM,
      // Korte, afgebakende schrijftaak: lage effort is hier ruim voldoende en
      // houdt de kost per wedstrijd verwaarloosbaar.
      output_config: { effort: "low" },
      messages: [
        {
          role: "user",
          content: [
            "Wedstrijdgegevens:",
            bouwContext(input.uitslag),
            "",
            "Wat er over de wedstrijd werd doorgegeven:",
            steekwoorden,
          ].join("\n"),
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return {
        ok: false,
        tekst: "",
        fout: "Het model gaf geen antwoord op deze invoer. Herformuleer de steekwoorden.",
      };
    }

    const tekst = response.content
      .filter((blok): blok is Anthropic.TextBlock => blok.type === "text")
      .map((blok) => blok.text)
      .join("\n")
      .trim();

    if (!tekst) {
      return { ok: false, tekst: "", fout: "Er kwam geen tekst terug" };
    }

    // Vangnet: em-dashes zijn niet gewenst in clubcommunicatie.
    return { ok: true, tekst: tekst.replace(/\s*—\s*/g, ", ") };
  } catch (error) {
    console.error("[social] sfeertekst genereren mislukt:", error);
    const bericht =
      error instanceof Anthropic.RateLimitError
        ? "Even te druk, probeer het over een minuut opnieuw."
        : error instanceof Anthropic.APIError
          ? `De tekstgenerator gaf een fout (${error.status}).`
          : "De tekstgenerator is niet bereikbaar.";
    return { ok: false, tekst: "", fout: bericht };
  }
}
