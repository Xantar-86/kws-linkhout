/**
 * Zet de spelers van een ploeg in lib/kernen.ts en koppelt de ploeg eraan.
 *
 * De namen komen van de club, meestal uit een ledenlijst. Wie nog geen
 * portret heeft, krijgt een leeg kader op de ploegpagina; de naam staat er
 * wel, en dat is wat telt voor wie zijn kind zoekt.
 *
 * gebruik: node scripts/kern-zetten.mjs U8 u8-a,u8-b namen.txt
 *          (namen.txt: een naam per regel)
 *
 * Het aanpassen van de ploegtekst blijft handwerk: die zin is per ploeg
 * anders en een script maakt daar alleen maar rommel van.
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , groep, slugs, bestand] = process.argv;
if (!groep || !slugs || !bestand) {
  console.error('gebruik: node scripts/kern-zetten.mjs U8 u8-a,u8-b namen.txt');
  process.exit(1);
}

const namen = readFileSync(bestand, "utf8")
  .split(/\r?\n/)
  .map((r) => r.trim())
  .filter(Boolean)
  .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase(), "nl"));

const KERNEN = "src/lib/kernen.ts";
let kernen = readFileSync(KERNEN, "utf8");
const blok =
  `  // ${groep}, zoals de club de lijst doorgaf.\n` +
  `  ${groep}: [\n` +
  namen.map((n) => `    { naam: ${JSON.stringify(n)} },\n`).join("") +
  `  ],\n\n`;

const bestaand = new RegExp(`  // [^\n]*\n(  //[^\n]*\n)*  ${groep}: \[[\s\S]*?\n  \],\n\n`);
if (bestaand.test(kernen)) {
  kernen = kernen.replace(bestaand, blok);
  console.log(`${groep}: lijst vervangen`);
} else {
  // Voor de eerste kern in het bestand invoegen, zodat de volgorde bewaard blijft.
  const anker = kernen.indexOf("export const KERNEN");
  const eerste = kernen.indexOf("  ", kernen.indexOf("{", anker) + 1);
  kernen = kernen.slice(0, eerste) + blok + kernen.slice(eerste);
  console.log(`${groep}: lijst toegevoegd`);
}
writeFileSync(KERNEN, kernen);

const TEAMS = "src/lib/teams.ts";
let teams = readFileSync(TEAMS, "utf8");
for (const slug of slugs.split(",")) {
  const i = teams.indexOf(`slug: "${slug}"`);
  if (i < 0) { console.error(`ploeg niet gevonden: ${slug}`); continue; }
  const eindBlok = teams.indexOf("\n  }", i);
  if (teams.slice(i, eindBlok).includes("spelersGroep:")) {
    teams = teams.slice(0, i) + teams.slice(i, eindBlok).replace(/spelersGroep: "[^"]*"/, `spelersGroep: "${groep}"`) + teams.slice(eindBlok);
    console.log(`  ${slug}: gekoppeld (was al gekoppeld)`);
  } else {
    const coach = teams.indexOf("coach:", i);
    const na = teams.indexOf("\n", coach) + 1;
    teams = teams.slice(0, na) + `    spelersGroep: "${groep}",\n` + teams.slice(na);
    console.log(`  ${slug}: gekoppeld`);
  }
}
writeFileSync(TEAMS, teams);
console.log(`${namen.length} spelers.`);
