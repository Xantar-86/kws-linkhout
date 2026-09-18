#!/usr/bin/env node
/**
 * De mappenwachter voor de toestemmingsformulieren.
 *
 * Haalt bij de site op wat er in de wachtrij staat, ontsleutelt het, en zet
 * elke ingevulde pdf in de juiste ploegmap onder "Goedkeuring Spelers". Pas
 * wanneer het bestand op schijf staat, meldt hij het terug en verdwijnt de
 * inzending uit de wachtrij. Loopt er iets mis, dan blijft ze staan en
 * probeert de volgende ronde het opnieuw.
 *
 * Draaien:
 *   node scripts/toestemming-wachter.mjs            eenmalig
 *   node scripts/toestemming-wachter.mjs --lus      blijven kijken
 *   node scripts/toestemming-wachter.mjs --proef    niets wegschrijven
 *
 * Instellingen komen uit .env.local van het project, of uit de omgeving:
 *   TOESTEMMING_SLEUTEL  hetzelfde geheim als op de site (verplicht)
 *   TOESTEMMING_SITE     standaard https://www.kwslinkhout.be
 *   TOESTEMMING_MAP      standaard de GDPR-map in OneDrive
 *   TOESTEMMING_TUSSEN   seconden tussen twee rondes in --lus (standaard 300)
 */

import { createDecipheriv, createHash } from "node:crypto";
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
  "GDPR",
  "Goedkeuring Spelers",
);

/** .env.local uitlezen, zodat het geheim niet apart ingesteld moet worden. */
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

const SLEUTEL = instelling("TOESTEMMING_SLEUTEL");
const SITE = (instelling("TOESTEMMING_SITE", "https://www.kwslinkhout.be") ?? "").replace(/\/$/, "");
const DOELMAP = instelling("TOESTEMMING_MAP", STANDAARD_MAP);
const TUSSEN = Number(instelling("TOESTEMMING_TUSSEN", "300")) * 1000;
const PROEF = process.argv.includes("--proef");
const LUS = process.argv.includes("--lus");

function nu() {
  return new Date().toLocaleString("nl-BE", { timeZone: "Europe/Brussels" });
}

/**
 * Het logboek. Als geplande taak is er geen venster om naar te kijken, dus
 * gaat elke regel ook naar logs/toestemming-wachter.log. Boven een halve
 * megabyte houden we enkel de laatste helft bij; dan blijft het bestand
 * hanteerbaar zonder dat er een opruimtaak bij hoeft.
 */
const LOGBESTAND = path.join(PROJECT, "logs", "toestemming-wachter.log");

function naarLogboek(regel) {
  try {
    mkdirSync(path.dirname(LOGBESTAND), { recursive: true });
    if (existsSync(LOGBESTAND) && statSync(LOGBESTAND).size > 512 * 1024) {
      const oud = readFileSync(LOGBESTAND, "utf8");
      writeFileSync(LOGBESTAND, oud.slice(Math.floor(oud.length / 2)), "utf8");
    }
    appendFileSync(LOGBESTAND, regel + "\r\n", "utf8");
  } catch {
    // Kan het logboek niet weg, dan is dat geen reden om te stoppen: de
    // formulieren afleveren is belangrijker dan erover schrijven.
  }
}

function meld(...stukken) {
  const regel = `[${nu()}] ${stukken.join(" ")}`;
  console.log(regel);
  naarLogboek(regel);
}

/** Dezelfde sleutelafleiding als de site in lib/toestemming/opslag.ts. */
function aesSleutel(geheim) {
  return createHash("sha256").update(`kws-toestemming|${geheim}`).digest();
}

function ontsleutel(blok, key) {
  const nonce = blok.subarray(0, 12);
  const keurmerk = blok.subarray(12, 28);
  const decipher = createDecipheriv("aes-256-gcm", key, nonce);
  decipher.setAuthTag(keurmerk);
  return Buffer.concat([decipher.update(blok.subarray(28)), decipher.final()]);
}

async function haalWachtrij() {
  const antwoord = await fetch(`${SITE}/api/toestemming/wachtrij`, {
    headers: { authorization: `Bearer ${SLEUTEL}` },
    cache: "no-store",
  });
  if (!antwoord.ok) throw new Error(`wachtrij opvragen gaf ${antwoord.status}`);
  return antwoord.json();
}

async function haalInzending(kenmerk, key) {
  const antwoord = await fetch(
    `${SITE}/api/toestemming/wachtrij?kenmerk=${encodeURIComponent(kenmerk)}`,
    { headers: { authorization: `Bearer ${SLEUTEL}` }, cache: "no-store" },
  );
  if (!antwoord.ok) throw new Error(`ophalen gaf ${antwoord.status}`);
  const blok = Buffer.from(await antwoord.arrayBuffer());
  return JSON.parse(ontsleutel(blok, key).toString("utf8"));
}

async function meldKlaar(kenmerk) {
  const antwoord = await fetch(`${SITE}/api/toestemming/wachtrij`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${SLEUTEL}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ kenmerk }),
  });
  if (!antwoord.ok) throw new Error(`afmelden gaf ${antwoord.status}`);
}

/**
 * Een pad dat nog niet bestaat. Staat er al een formulier voor dezelfde speler
 * en is het identiek, dan is dit een herhaling en hoeft er niets bij; wijkt het
 * af, dan komt er een nummer achter in plaats van dat we het oude overschrijven.
 */
async function vrijPad(map, bestandsnaam, nieuweInhoud) {
  const basis = bestandsnaam.replace(/\.pdf$/i, "");
  for (let poging = 0; poging < 50; poging++) {
    const naam = poging === 0 ? bestandsnaam : `${basis} (${poging + 1}).pdf`;
    const pad = path.join(map, naam);
    if (!existsSync(pad)) return { pad, bestaatAl: false };
    const bestaande = await readFile(pad);
    if (bestaande.equals(nieuweInhoud)) return { pad, bestaatAl: true };
  }
  throw new Error("te veel versies van hetzelfde formulier");
}

async function ronde(key) {
  const { aantal, wachtrij } = await haalWachtrij();
  if (!aantal) {
    meld("niets in de wachtrij");
    return 0;
  }

  meld(`${aantal} formulier${aantal === 1 ? "" : "en"} in de wachtrij`);
  let gedaan = 0;

  for (const regel of wachtrij) {
    try {
      const item = await haalInzending(regel.kenmerk, key);
      const map = path.join(DOELMAP, item.ploeg || "Zonder ploeg");
      const inhoud = Buffer.from(item.pdf, "base64");

      if (PROEF) {
        meld(`PROEF: zou schrijven naar ${path.join(map, item.bestandsnaam)} (${inhoud.length} bytes)`);
        continue;
      }

      await mkdir(map, { recursive: true });
      const { pad, bestaatAl } = await vrijPad(map, item.bestandsnaam, inhoud);
      if (bestaatAl) {
        meld(`stond er al, ongewijzigd: ${pad}`);
      } else {
        await writeFile(pad, inhoud);
        meld(`geschreven: ${pad}`);
      }

      await meldKlaar(regel.kenmerk);
      gedaan += 1;
    } catch (fout) {
      meld(`MISLUKT voor ${regel.kenmerk}: ${fout.message}. Blijft in de wachtrij.`);
    }
  }

  return gedaan;
}

async function hoofd() {
  if (!SLEUTEL) {
    console.error(
      "TOESTEMMING_SLEUTEL ontbreekt. Zet hem in .env.local van het project of in de omgeving.",
    );
    process.exit(1);
  }

  meld(`wachter gestart | site ${SITE} | map ${DOELMAP}${PROEF ? " | PROEF" : ""}`);
  const key = aesSleutel(SLEUTEL);

  for (;;) {
    try {
      await ronde(key);
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
