#!/usr/bin/env node
/**
 * Haalt het Excel-logboek van het mosselfeest op en zet het in je map.
 *
 * De site maakt het bestand elke keer opnieuw uit de inschrijvingen, dus dit
 * script hoeft niets te vergelijken of samen te voegen: ophalen, wegschrijven,
 * klaar. Is er niets gewijzigd, dan blijft het bestaande bestand staan; zo
 * wordt OneDrive niet elke ronde opnieuw aan het werk gezet.
 *
 * Draaien:
 *   node scripts/mosselfeest-logboek.mjs           eenmalig
 *   node scripts/mosselfeest-logboek.mjs --lus     blijven kijken
 *
 * Instellingen komen uit .env.local van het project, of uit de omgeving:
 *   MOSSELFEEST_SLEUTEL  hetzelfde geheim als op de site (verplicht)
 *   MOSSELFEEST_SITE     standaard https://www.kwslinkhout.be
 *   MOSSELFEEST_MAP      standaard OneDrive\Documenten\KWS\Mosselfeest
 *   MOSSELFEEST_TUSSEN   seconden tussen twee rondes in --lus (standaard 900)
 */

import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HIER = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(HIER, "..");

const STANDAARD_MAP = path.join(
  process.env.USERPROFILE ?? "C:\\Users\\joche",
  "OneDrive",
  "Documenten",
  "KWS",
  "Mosselfeest",
);

function uitEnvBestand(naam) {
  for (const bestand of [".env.local", ".env"]) {
    const pad = path.join(PROJECT, bestand);
    if (!existsSync(pad)) continue;
    for (const regel of readFileSync(pad, "utf8").split(/\r?\n/)) {
      const gelijk = regel.indexOf("=");
      if (gelijk < 1 || regel.trimStart().startsWith("#")) continue;
      if (regel.slice(0, gelijk).trim() !== naam) continue;
      return regel
        .slice(gelijk + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
    }
  }
  return undefined;
}

function instelling(naam, standaard) {
  return process.env[naam] ?? uitEnvBestand(naam) ?? standaard;
}

const SLEUTEL = instelling("MOSSELFEEST_SLEUTEL");
const SITE = (instelling("MOSSELFEEST_SITE", "https://www.kwslinkhout.be") ?? "").replace(/\/$/, "");
const DOELMAP = instelling("MOSSELFEEST_MAP", STANDAARD_MAP);
const TUSSEN = Number(instelling("MOSSELFEEST_TUSSEN", "900")) * 1000;
const LUS = process.argv.includes("--lus");
const LOGBESTAND = path.join(PROJECT, "logs", "mosselfeest-logboek.log");

function meld(...stukken) {
  const regel = `[${new Date().toLocaleString("nl-BE", { timeZone: "Europe/Brussels" })}] ${stukken.join(" ")}`;
  console.log(regel);
  try {
    mkdirSync(path.dirname(LOGBESTAND), { recursive: true });
    if (existsSync(LOGBESTAND) && statSync(LOGBESTAND).size > 512 * 1024) {
      const oud = readFileSync(LOGBESTAND, "utf8");
      writeFileSync(LOGBESTAND, oud.slice(Math.floor(oud.length / 2)), "utf8");
    }
    appendFileSync(LOGBESTAND, regel + "\r\n", "utf8");
  } catch {
    // Zonder logboek werkt het ophalen nog altijd.
  }
}

/** De bestandsnaam uit de kop van het antwoord, of een redelijke terugval. */
function naamUitAntwoord(antwoord) {
  const kop = antwoord.headers.get("content-disposition") ?? "";
  const gevonden = /filename="([^"]+)"/.exec(kop);
  return gevonden ? gevonden[1] : "Mosselfeest inschrijvingen.xlsx";
}

async function ronde() {
  const antwoord = await fetch(`${SITE}/api/mosselfeest/logboek`, {
    headers: { authorization: `Bearer ${SLEUTEL}` },
    cache: "no-store",
  });
  if (!antwoord.ok) throw new Error(`logboek ophalen gaf ${antwoord.status}`);

  const aantal = antwoord.headers.get("x-aantal-inschrijvingen") ?? "?";
  const naam = naamUitAntwoord(antwoord);
  const inhoud = Buffer.from(await antwoord.arrayBuffer());
  const pad = path.join(DOELMAP, naam);

  await mkdir(DOELMAP, { recursive: true });

  if (existsSync(pad)) {
    const bestaande = await readFile(pad);
    if (bestaande.equals(inhoud)) {
      meld(`niets gewijzigd (${aantal} inschrijvingen)`);
      return;
    }
  }

  await writeFile(pad, inhoud);
  meld(`bijgewerkt: ${pad} (${aantal} inschrijvingen, ${inhoud.length} bytes)`);
}

async function hoofd() {
  if (!SLEUTEL) {
    console.error(
      "MOSSELFEEST_SLEUTEL ontbreekt. Zet hem in .env.local van het project of in de omgeving.",
    );
    process.exit(1);
  }

  meld(`logboek-wachter gestart | site ${SITE} | map ${DOELMAP}`);

  for (;;) {
    try {
      await ronde();
    } catch (fout) {
      meld(`ronde mislukt: ${fout.message}`);
    }
    if (!LUS) return;
    await new Promise((klaar) => setTimeout(klaar, TUSSEN));
  }
}

hoofd().catch((fout) => {
  console.error("onverwachte fout:", fout);
  process.exit(1);
});
