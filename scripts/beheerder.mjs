/**
 * Maakt de regel voor een beheerder van het beheer.
 *
 * Het wachtwoord zelf komt nergens terecht: dit drukt enkel het zout en het
 * versleutelde wachtwoord af. Plak de regel bij de instelling BEHEERDERS in
 * Vercel (Settings, Environment Variables) en zet er een komma tussen als er
 * al iemand in staat.
 *
 * gebruik: node scripts/beheerder.mjs "naam@club.be" "het wachtwoord"
 *          node scripts/beheerder.mjs "naam@club.be"          verzint er een
 */
import { randomBytes } from "node:crypto";
import { nieuwZout, versleutel } from "../src/lib/beheerders.ts";

const [, , email, meegegeven] = process.argv;

if (!email || !email.includes("@")) {
  console.error('gebruik: node scripts/beheerder.mjs "naam@club.be" "het wachtwoord"');
  process.exit(1);
}

// Zonder wachtwoord verzinnen we er een dat sterk genoeg is om door te geven.
const verzonnen = !meegegeven;
const wachtwoord = meegegeven ?? randomBytes(9).toString("base64url");

const zout = nieuwZout();
const regel = `${email.trim().toLowerCase()}:${zout}:${versleutel(wachtwoord, zout)}`;

console.log("\nZet deze regel bij BEHEERDERS (komma ertussen als er al iemand staat):\n");
console.log(regel);
if (verzonnen) console.log(`\nHet wachtwoord voor ${email} is:  ${wachtwoord}`);
console.log("\nGeef het wachtwoord persoonlijk door, niet samen met deze regel.\n");
