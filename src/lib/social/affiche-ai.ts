import { readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * Genereert de matchday-affiche met een beeldmodel, op basis van het lege
 * clubsjabloon.
 *
 * Waarom een beeldmodel en niet zelf tekenen: het sjabloon is een ontworpen
 * beeld met penseelstreken en een geschilderd lettertype. Tekst daar netjes in
 * plaatsen lukt met code niet overtuigend genoeg.
 *
 * Aanbieder is Cloudflare Workers AI met FLUX.2 dev. Dat is de enige route die
 * op dit moment een gratis dagbudget geeft (10.000 neurons per dag, ongeveer
 * vijf affiches) en tegelijk een referentiebeeld aanvaardt. Google en OpenAI
 * hebben voor beeldgeneratie geen gratis laag meer.
 *
 * Let op: het dagbudget wordt gedeeld door alle modellen en reset om
 * middernacht UTC. Genereer daarom gespreid, niet vier affiches tegelijk.
 */

const MODEL = "@cf/black-forest-labs/flux-2-dev";

export interface AfficheOpdracht {
  soort: "wedstrijd" | "uitslag";
  /** Bijvoorbeeld "HEREN P2 - VOLGENDE WEDSTRIJD". */
  badge: string;
  thuisploeg: string;
  uitploeg: string;
  /** Volledige URL van het logo van de tegenstander, of null. */
  tegenstanderLogo: string | null;
  /** True als de tegenstander links op de affiche staat. */
  tegenstanderLinks: boolean;
  weekdag: string;
  dag: string;
  maand: string;
  tijd: string;
  thuisScore: string;
  uitScore: string;
  doelpuntenThuis: { minuut: string; naam: string }[];
  doelpuntenUit: { minuut: string; naam: string }[];
  veldNaam: string;
  /** Straat en gemeente, alleen bij een thuiswedstrijd. */
  veldStraat: string;
  veldGemeente: string;
}

export interface AfficheResultaat {
  ok: boolean;
  /** Beeldbytes, JPEG. */
  beeld?: Buffer;
  mime?: string;
  fout?: string;
  /** True als het dagbudget op is; dan kan het later opnieuw. */
  budgetOp?: boolean;
}

function sjabloonBestand(soort: "wedstrijd" | "uitslag"): string | null {
  const map = join(process.cwd(), "public", "images", "social");
  for (const ext of ["png", "jpg", "jpeg"]) {
    const pad = join(map, `sjabloon-${soort}.${ext}`);
    if (existsSync(pad)) return pad;
  }
  return null;
}

function lijst(doelpunten: { minuut: string; naam: string }[]): string {
  if (doelpunten.length === 0) return "none";
  return doelpunten.map((d) => `${d.minuut} ${d.naam}`).join(", ");
}

/**
 * De opdracht aan het beeldmodel, in het Engels omdat beeldmodellen daar
 * betrouwbaarder op reageren. De letterlijk te plaatsen tekst blijft Nederlands
 * en staat tussen aanhalingstekens, zodat het model die niet vertaalt.
 */
/**
 * De teksten onder de iconen VELD en KANTINE.
 *
 * Het veld is altijd de plaats waar effectief gespeeld wordt, ook bij een
 * tornooi op een ander terrein. De kantine hoort bij de thuisploeg: spelen we
 * op verplaatsing, dan is het hun kantine en niet de onze, en nodigen we onze
 * eigen mensen uit om mee te komen.
 */
export function onderschriften(o: AfficheOpdracht): {
  veld: string[];
  kantine: string[];
} {
  // De RBFA laat er soms dubbele spaties in staan.
  const net = (t: string) => t.replace(/\s+/g, " ").trim();

  const veld = o.veldNaam
    ? [net(o.veldNaam).toUpperCase(), net(o.veldStraat), net(o.veldGemeente)].filter(Boolean)
    : ["OP VERPLAATSING"];

  // De kantine hoort bij het terrein, niet bij wie er thuis staat. Bij een
  // tornooi op een ander veld is het dus ook niet de onze, ook al zijn wij
  // op papier de thuisploeg. De A of B achter een clubnaam mag eraf, want de
  // kantine is van de club en niet van de ploeg.
  const opEigenTerrein = /linkwood/i.test(o.veldNaam);
  const gastheer = net(o.thuisploeg).replace(/\s+[A-Z]$/, "");
  const kantine = opEigenTerrein
    ? ["K.W.S. LINKHOUT", "Iedereen welkom voor", "en na de wedstrijd!"]
    : [(o.veldNaam ? net(o.veldNaam) : gastheer).toUpperCase(), "Kom onze ploeg", "mee steunen!"];

  return { veld, kantine };
}

export function bouwPrompt(o: AfficheOpdracht): string {
  // De thuisploeg staat links, de bezoekers rechts. Speelt Linkhout op
  // verplaatsing, dan staat de tegenstander dus links.
  const links = o.thuisploeg;
  const rechts = o.uitploeg;
  const kwsKant = o.tegenstanderLinks ? "rechter" : "linker";
  const tegenKant = o.tegenstanderLinks ? "linker" : "rechter";
  const kop = o.soort === "uitslag" ? "UITSLAG" : "WEDSTRIJD";

  const regels: string[] = [
    "Ik stuur drie afbeeldingen mee, in deze volgorde:",
    `  1. de lege ${o.soort === "uitslag" ? "UITSLAG" : "WEDSTRIJD"}-affiche van K.W.S. Linkhout`,
    "  2. het schild van K.W.S. Linkhout (rood-wit gestreept schild met ster)",
    "  3. het clublogo van de tegenstander",
    "",
    "Neem afbeelding 1 letterlijk als basis en geef die terug met de lege",
    "vakken ingevuld. Teken de affiche NIET opnieuw. Alles wat er al op staat",
    "blijft exact zoals het is, op dezelfde plaats en in dezelfde stijl:",
    "  - de crèmekleurige papierachtergrond met textuur",
    "  - de rode stippenhoek linksboven",
    `  - het geschilderde woord "${kop}" met de kwaststreek eronder`,
    "  - het clubschild linksboven",
    "  - de vorm en plaats van elk rood penseelvlak",
    "  - de iconen en de woorden VELD en KANTINE",
    "  - de foto van het voetbalveld onderaan",
    "",
    "Voeg niets toe wat er niet staat: geen nieuwe kleuren, geen groen, geen",
    "andere lettertypes, geen extra vormen, geen clubnaam als titel.",
    "",
    "VUL DIT IN:",
    "",
    "In de brede rode penseelbalk onder de titel, alle tekst in wit:",
  ];

  if (o.soort === "uitslag") {
    regels.push(`  de eindstand "${o.thuisScore} - ${o.uitScore}", groot en gecentreerd.`);
  } else {
    regels.push(
      `  links een kalendericoon, daarnaast "${o.weekdag}" boven, "${o.dag}" groot in het midden en "${o.maand}" eronder;`,
      "  daarna een dunne verticale scheidingslijn;",
      `  dan een klokicoon, daarnaast "AFTRAP" boven en "${o.tijd}" groot eronder.`
    );
  }

  regels.push(
    "",
    `In de dunne ovale omlijning eronder, in dieprode hoofdletters op één regel: "${o.badge}"`,
    "",
    "In de twee grote rode penseelvlakken komt bovenaan een clublogo en",
    "daaronder de ploegnaam in witte hoofdletters:",
    "",
    `  ${kwsKant.toUpperCase()} VLAK: gebruik afbeelding 2 (het schild van K.W.S. Linkhout).`,
    `    Ploegnaam eronder: "${o.tegenstanderLinks ? rechts : links}"`,
    "",
    `  ${tegenKant.toUpperCase()} VLAK: gebruik afbeelding 3 (het logo van de tegenstander),`,
    "    op een witte ronde ondergrond zodat het loskomt van het rode vlak.",
    `    Ploegnaam eronder: "${o.tegenstanderLinks ? links : rechts}"`,
    "",
    "Verwissel de twee logo's niet en gebruik nooit twee keer hetzelfde logo."
  );

  if (o.soort === "uitslag") {
    const kwsDoelpunten = o.tegenstanderLinks ? o.doelpuntenUit : o.doelpuntenThuis;
    const tegenDoelpunten = o.tegenstanderLinks ? o.doelpuntenThuis : o.doelpuntenUit;
    regels.push(
      "",
      "Onder elke ploegnaam, binnen hetzelfde penseelvlak, de doelpuntenmakers",
      "van die ploeg in kleine witte hoofdletters, elk op een eigen regel, met",
      "de minuut ervoor:",
      `  ${kwsKant} vlak: ${lijst(kwsDoelpunten)}`,
      `  ${tegenKant} vlak: ${lijst(tegenDoelpunten)}`
    );
  } else {
    regels.push(
      "",
      'Tussen de twee vlakken: "VS" in grote witte letters met een rode rand.'
    );
  }

  const onderaan = onderschriften(o);
  const veldRegels = onderaan.veld.map((r, i) =>
    i === 0 ? `    "${r}" in vet` : `    "${r}" op de regel eronder`
  );
  const kantineRegels = onderaan.kantine.map((r, i) =>
    i === 0 ? `    "${r}" in vet` : `    "${r}" op de regel eronder`
  );

  regels.push(
    "",
    "Onderaan, naast de bestaande iconen, in ZWARTE letters (niet rood):",
    "",
    "  Onder het woord VELD:",
    ...veldRegels,
    "",
    "  Onder het woord KANTINE:",
    ...kantineRegels,
    "",
    "De woorden VELD en KANTINE zelf blijven dieprood zoals ze op het sjabloon",
    "staan; alleen de tekst eronder is zwart.",
    "",
    "Neem elke naam, elk cijfer en elk woord exact over zoals hierboven",
    "geschreven, met de Nederlandse spelling. Verzin geen andere namen of",
    "teksten. Geen watermerk.",
    "",
    "Lever het resultaat in dezelfde beeldverhouding als het sjabloon."
  );

  return regels.join("\n");
}

/** Haalt het logo van de tegenstander op als tweede referentiebeeld. */
async function haalLogo(url: string): Promise<Blob | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "image/jpeg";
    if (!type.startsWith("image/")) return null;
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > 4_000_000) return null;
    return new Blob([bytes], { type: type.split(";")[0] });
  } catch (error) {
    console.error("[social] logo ophalen mislukt:", error);
    return null;
  }
}

/** Genereert de affiche. Geeft ok: false met een reden als het niet lukt. */
export async function genereerAffiche(
  opdracht: AfficheOpdracht
): Promise<AfficheResultaat> {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_AI_TOKEN;
  if (!account || !token) {
    return {
      ok: false,
      fout: "CLOUDFLARE_ACCOUNT_ID of CLOUDFLARE_AI_TOKEN ontbreekt in de omgeving",
    };
  }

  const sjabloonPad = sjabloonBestand(opdracht.soort);
  if (!sjabloonPad) {
    return {
      ok: false,
      fout: `Sjabloon ontbreekt: public/images/social/sjabloon-${opdracht.soort}.png`,
    };
  }

  const form = new FormData();
  form.append("prompt", bouwPrompt(opdracht));
  form.append(
    "input_image",
    new Blob([new Uint8Array(readFileSync(sjabloonPad))], { type: "image/png" }),
    "sjabloon.png"
  );

  if (opdracht.tegenstanderLogo) {
    const logo = await haalLogo(opdracht.tegenstanderLogo);
    if (logo) form.append("input_image_2", logo, "logo.jpg");
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${MODEL}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
        signal: AbortSignal.timeout(300_000),
      }
    );

    const json = await response.json();

    if (!json?.success) {
      const bericht = json?.errors?.[0]?.message ?? `HTTP ${response.status}`;
      return {
        ok: false,
        fout: bericht,
        // Code 4006 is het opgebruikte dagbudget; morgen kan het weer.
        budgetOp: json?.errors?.[0]?.code === 4006 || response.status === 429,
      };
    }

    const b64 = json?.result?.image;
    if (typeof b64 !== "string" || b64.length === 0) {
      return { ok: false, fout: "Geen beeld in het antwoord" };
    }

    return { ok: true, beeld: Buffer.from(b64, "base64"), mime: "image/jpeg" };
  } catch (error) {
    console.error("[social] affiche genereren mislukt:", error);
    return {
      ok: false,
      fout: error instanceof Error ? error.message : String(error),
    };
  }
}
