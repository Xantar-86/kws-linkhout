// Maakt een beheerder voor het spelersdossier (/spelers), of geeft een
// bestaande beheerder een nieuwe uitnodigingslink. Voor als er nog niemand
// is, of als de enige beheerder zijn wachtwoord kwijt is.
//
//   node scripts/spelers-beheerder.mjs "Naam" "naam@voorbeeld.be" [https://www.kwslinkhout.be]
//
// Leest SUPABASE_URL en SUPABASE_SECRET_KEY uit .env.local.

import { createHash, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const [naam, emailRuw, basis = "https://www.kwslinkhout.be"] = process.argv.slice(2);
if (!naam || !emailRuw) {
  console.error('Gebruik: node scripts/spelers-beheerder.mjs "Naam" "e-mail" [basis-url]');
  process.exit(1);
}
const email = emailRuw.trim().toLowerCase();

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((r) => /^[A-Z_]+=/.test(r))
    .map((r) => [r.slice(0, r.indexOf("=")), r.slice(r.indexOf("=") + 1).replace(/^"|"$/g, "")]),
);
const db = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

const code = randomBytes(24).toString("base64url");
const bestaand = await db.from("jeugd_gebruikers").select("id, sessie_versie").eq("email", email).maybeSingle();
if (bestaand.error) throw bestaand.error;
const velden = {
  naam,
  email,
  rol: "bestuur",
  beheerder: true,
  uitnodiging_hash: createHash("sha256").update(code).digest("hex"),
  uitnodiging_tot: new Date(Date.now() + 14 * 864e5).toISOString(),
};
const r = bestaand.data
  ? await db.from("jeugd_gebruikers").update({ ...velden, sessie_versie: bestaand.data.sessie_versie + 1 }).eq("id", bestaand.data.id)
  : await db.from("jeugd_gebruikers").insert(velden);
if (r.error) throw r.error;
console.log(`${bestaand.data ? "Nieuwe link voor" : "Beheerder aangemaakt:"} ${naam}`);
console.log(`${basis.replace(/\/$/, "")}/spelers/uitnodiging?code=${code}`);
