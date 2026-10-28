import { Resend } from "resend";
import { SPONSOR_CONTACT, WEDSTRIJDBAL } from "@/app/sponsoring/inhoud";
import type { Bestelling } from "./opslag";

/**
 * De mails na een betaalde wedstrijdbal, via Resend vanaf kwslinkhout.be.
 *
 * Twee mails:
 *
 *  - een bevestiging naar de sponsor, met wat hij betaald heeft;
 *  - een melding naar de club met al zijn gegevens. Antwoorden op die mail
 *    gaat rechtstreeks naar de sponsor.
 *
 * Dit gebeurt op de server, niet via Web3Forms in de browser zoals het
 * gewone formulier. Mollie verwittigt de site ook als de sponsor zijn browser
 * meteen na het betalen sluit, en dan is er geen browser meer om te mailen.
 *
 * Bij een testbetaling staat [TEST] voor het onderwerp van beide mails.
 */

const ROOD = "#b91c1c";
const INKT = "#120c0d";
const ZAND = "#f4f1ec";
const GRIJS = "#6b7280";

/** WEDSTRIJDBAL_MAIL_FROM zet desnoods de hele afzender zelf. */
function afzender(): string {
  return process.env.WEDSTRIJDBAL_MAIL_FROM ?? "KWS Linkhout <sponsoring@kwslinkhout.be>";
}

/** Wie de melding van een betaalde bal krijgt; komma's tussen meerdere adressen. */
function clubOntvangers(): string[] {
  const rauw = process.env.WEDSTRIJDBAL_MAIL_TO ?? process.env.SOCIAL_MAIL_TO ?? "jochen.thoelen@gmail.com";
  return rauw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function siteUrl(): string {
  return (process.env.SITE_URL ?? "https://www.kwslinkhout.be").replace(/\/$/, "");
}

function ontsnap(tekst: string): string {
  return tekst.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Dezelfde omlijsting als de mosselfeestmails: donkere band, witte kaart. */
function omhulsel(titel: string, ondertitel: string, binnenin: string): string {
  return `
<!doctype html>
<html lang="nl">
  <body style="margin:0;padding:24px 12px;background:${ZAND};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;margin:0 auto;border-collapse:collapse;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(18,12,13,0.08)">
      <tr>
        <td style="background:${INKT};padding:20px 24px">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:12px;vertical-align:middle">
                <img src="${siteUrl()}/images/kwslinkhout-logo.png" width="44" height="44" alt=""
                     style="display:block;width:44px;height:44px;object-fit:contain">
              </td>
              <td style="vertical-align:middle">
                <div style="color:#ffffff;font-size:15px;font-weight:700;letter-spacing:0.02em">K.W.S. LINKHOUT</div>
                <div style="color:rgba(255,255,255,0.7);font-size:12px">Sponsoring</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:26px 24px 8px 24px">
          <h1 style="margin:0 0 2px 0;font-size:21px;line-height:1.3;color:${ROOD}">${ontsnap(titel)}</h1>
          <p style="margin:0 0 18px 0;font-size:14px;color:${GRIJS}">${ontsnap(ondertitel)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px 24px">
          ${binnenin}
        </td>
      </tr>
      <tr>
        <td style="background:${ZAND};padding:16px 24px;font-size:12px;line-height:1.6;color:${GRIJS}">
          KWS Linkhout vzw, Kapelstraat 72, 3560 Linkhout &middot; btw BE 0459.873.832<br>
          <a href="mailto:${SPONSOR_CONTACT.mail}" style="color:${ROOD};text-decoration:none">${SPONSOR_CONTACT.mail}</a>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function tabel(rijen: [string, string][]): string {
  return `
    <table style="width:100%;border-collapse:collapse">
      ${rijen
        .map(
          ([label, waarde]) => `
        <tr>
          <td style="padding:6px 10px 6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:${GRIJS};vertical-align:top;white-space:nowrap">${ontsnap(label)}</td>
          <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#0f172a">${ontsnap(waarde)}</td>
        </tr>`
        )
        .join("")}
    </table>`;
}

const TESTBAND = `
    <p style="margin:0 0 16px 0;padding:8px 12px;border-radius:8px;background:#fffbeb;color:#92400e;font-size:13px">
      Testbetaling: er is geen echt geld betaald.
    </p>`;

export interface Betaalinfo {
  id: string;
  methode: string | null;
  betaaldOp: string | null;
}

function datum(iso: string | null): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleString("nl-BE", { timeZone: "Europe/Brussels", dateStyle: "long", timeStyle: "short" });
}

/** Beide mails versturen. Gooit een fout als er een niet vertrok. */
export async function stuurMails(bestelling: Bestelling, betaling: Betaalinfo): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY ontbreekt.");
  const resend = new Resend(apiKey);
  const g = bestelling.gegevens;
  const voor = bestelling.test ? "[TEST] " : "";
  const methode = betaling.methode ? ` via ${betaling.methode}` : "";

  const sponsor = omhulsel(
    "Bedankt voor uw steun!",
    `Uw wedstrijdbal van ${WEDSTRIJDBAL.prijs} is betaald.`,
    `${bestelling.test ? TESTBAND : ""}
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#334155">
      Beste ${ontsnap(g.name)},<br><br>
      We hebben uw betaling goed ontvangen. De club neemt contact met u op voor de affiche en de wedstrijd.
    </p>
    ${tabel([
      ["Wat", "Wedstrijdbal KWS Linkhout"],
      ["Bedrag", `${WEDSTRIJDBAL.prijs}${methode}`],
      ["Betaald op", datum(betaling.betaaldOp)],
      ["Referentie", betaling.id],
      ...(g.company ? ([["Bedrijf", g.company]] as [string, string][]) : []),
      ...(g.match ? ([["Voorkeur wedstrijd", g.match]] as [string, string][]) : []),
    ])}
    <p style="margin:18px 0 0 0;font-size:13px;color:${GRIJS};line-height:1.7">
      Een vraag? Antwoord gewoon op deze mail, of mail
      <a href="mailto:${SPONSOR_CONTACT.mail}" style="color:${ROOD}">${SPONSOR_CONTACT.naam}</a>.
    </p>`
  );

  const club = omhulsel(
    "Wedstrijdbal betaald",
    `${g.company || g.name} betaalde ${WEDSTRIJDBAL.prijs} online.`,
    `${bestelling.test ? TESTBAND : ""}
    ${tabel([
      ["Naam", g.name],
      ["Bedrijf", g.company || "-"],
      ["Adres", `${g.street}, ${g.zip} ${g.city}`],
      ["Btw-nummer", g.vat || "-"],
      ["E-mail", g.email],
      ["Telefoon", g.phone],
      ["Voorkeur wedstrijd", g.match || "-"],
      ["Bedrag", `${WEDSTRIJDBAL.prijs}${methode}`],
      ["Betaald op", datum(betaling.betaaldOp)],
      ["Mollie-betaling", betaling.id],
    ])}
    <p style="margin:18px 0 0 0;font-size:13px;color:${GRIJS};line-height:1.7">
      Antwoorden op deze mail gaat rechtstreeks naar de sponsor.
    </p>`
  );

  const resultaten = await Promise.all([
    resend.emails.send({
      from: afzender(),
      to: [g.email],
      replyTo: SPONSOR_CONTACT.mail,
      subject: `${voor}Bedankt voor uw wedstrijdbal bij KWS Linkhout`,
      html: sponsor,
    }),
    resend.emails.send({
      from: afzender(),
      to: clubOntvangers(),
      replyTo: g.email,
      subject: `${voor}Wedstrijdbal betaald - ${g.company || g.name}`,
      html: club,
    }),
  ]);
  const fout = resultaten.find((r) => r.error)?.error;
  if (fout) throw new Error(`Resend: ${fout.message}`);
}
