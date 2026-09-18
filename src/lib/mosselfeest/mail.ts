import { Resend } from "resend";
import { EVENEMENT, GERECHTEN, euro, mededeling } from "./kaart";
import type { Inschrijving } from "./opslag";

/**
 * De mails rond een inschrijving voor het mosselfeest.
 *
 * De inschrijver krijgt een bevestiging met wat hij besteld heeft, het bedrag
 * en de mededeling voor de overschrijving. De club krijgt dezelfde gegevens,
 * plus de stand van zaken.
 *
 * Let op: zolang er in Resend geen domein geverifieerd is, weigert Resend elke
 * ontvanger behalve het adres van het Resend-account zelf. De bevestiging naar
 * de inschrijver komt dan niet aan. Zie docs/TOESTEMMING.md; hetzelfde geldt
 * hier. Daarom is de mail nooit de enige plek waar een inschrijving staat: het
 * logboek is de waarheid.
 */

function afzender(): string {
  return process.env.SOCIAL_MAIL_FROM ?? "KWS Linkhout <onboarding@resend.dev>";
}

function ontvangers(): string[] {
  const rauw =
    process.env.MOSSELFEEST_MAIL_TO ?? process.env.SOCIAL_MAIL_TO ?? "jochen.thoelen@gmail.com";
  return rauw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function ontsnap(tekst: string): string {
  return tekst.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function besteltabel(inschrijving: Inschrijving): string {
  const rijen = GERECHTEN.filter((g) => (inschrijving.aantallen[g.id] ?? 0) > 0)
    .map((g) => {
      const aantal = inschrijving.aantallen[g.id];
      return `
        <tr>
          <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155">${aantal} &times; ${ontsnap(g.naam)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-align:right">${euro(g.prijs * aantal)} euro</td>
        </tr>`;
    })
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;margin-top:6px">
      ${rijen}
      <tr>
        <td style="padding:8px 10px;font-size:15px;font-weight:600;color:#0f172a">Totaal</td>
        <td style="padding:8px 10px;font-size:15px;font-weight:700;color:#0f172a;text-align:right">${euro(inschrijving.bedrag)} euro</td>
      </tr>
    </table>`;
}

function zittingLabel(id: string): string {
  return EVENEMENT.zittingen.find((z) => z.id === id)?.label ?? id;
}

export interface MailResultaat {
  ok: boolean;
  naarInschrijver: boolean;
  fout?: string;
}

export async function stuurInschrijvingMail(opts: {
  inschrijving: Inschrijving;
  /** Hoeveel inschrijvingen er nu in totaal zijn, voor de clubmail. */
  aantalTotaal?: number;
}): Promise<MailResultaat> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, naarInschrijver: false, fout: "RESEND_API_KEY ontbreekt." };

  const { inschrijving, aantalTotaal } = opts;
  const resend = new Resend(apiKey);
  const kop = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:620px;margin:0 auto;padding:24px">
      <h1 style="margin:0 0 2px 0;font-size:20px;color:#0f172a">${ontsnap(EVENEMENT.naam)} ${EVENEMENT.jaar}</h1>
      <p style="margin:0 0 18px 0;font-size:14px;color:#64748b">${ontsnap(zittingLabel(inschrijving.zitting))}</p>`;

  const betaalblok = `
    <div style="border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-top:18px">
      <p style="margin:0 0 8px 0;font-size:15px;font-weight:600;color:#0f172a">Betalen</p>
      <p style="margin:0;font-size:14px;color:#334155;line-height:1.7">
        ${euro(inschrijving.bedrag)} euro op ${EVENEMENT.rekening}<br>
        op naam van ${ontsnap(EVENEMENT.rekeningNaam)}<br>
        met als mededeling <strong>${ontsnap(mededeling(inschrijving.kenmerk, inschrijving.naam))}</strong>
      </p>
    </div>`;

  let naarInschrijver = false;

  // Eerst de club: die mail mag niet sneuvelen omdat het adres van de
  // inschrijver door Resend geweigerd wordt.
  try {
    const antwoord = await resend.emails.send({
      from: afzender(),
      to: ontvangers(),
      replyTo: inschrijving.email,
      subject: `Mosselfeest: ${inschrijving.naam} (${euro(inschrijving.bedrag)} euro)`,
      html: `${kop}
        <div style="border:1px solid #e2e8f0;border-radius:12px;padding:16px">
          <p style="margin:0 0 4px 0;font-size:14px;color:#334155"><strong>${ontsnap(inschrijving.naam)}</strong></p>
          <p style="margin:0;font-size:14px;color:#334155">${ontsnap(inschrijving.email)}${
            inschrijving.telefoon ? ` &middot; ${ontsnap(inschrijving.telefoon)}` : ""
          }</p>
        </div>
        ${besteltabel(inschrijving)}
        ${inschrijving.opmerking ? `<p style="margin:14px 0 0 0;font-size:14px;color:#334155"><strong>Opmerking:</strong> ${ontsnap(inschrijving.opmerking)}</p>` : ""}
        <p style="margin:18px 0 0 0;font-size:13px;color:#64748b">
          Kenmerk ${ontsnap(inschrijving.kenmerk)}${
            aantalTotaal ? ` &middot; ${aantalTotaal} inschrijving${aantalTotaal === 1 ? "" : "en"} in totaal` : ""
          }. Het logboek is bijgewerkt.
        </p>
      </div>`,
    });
    if (antwoord.error) {
      return { ok: false, naarInschrijver, fout: antwoord.error.message };
    }
  } catch (fout) {
    return {
      ok: false,
      naarInschrijver,
      fout: fout instanceof Error ? fout.message : "Onbekende fout",
    };
  }

  try {
    const antwoord = await resend.emails.send({
      from: afzender(),
      to: [inschrijving.email],
      subject: `Je inschrijving voor het mosselfeest is binnen`,
      html: `${kop}
        <p style="font-size:14px;color:#334155;line-height:1.7">
          Bedankt voor je inschrijving. Hieronder staat wat we voor je klaarzetten.
          Kloppen er dingen niet, mail dan naar
          <a href="mailto:${EVENEMENT.contact}" style="color:#b91c1c">${EVENEMENT.contact}</a>.
        </p>
        ${besteltabel(inschrijving)}
        ${betaalblok}
        <p style="margin:18px 0 0 0;font-size:13px;color:#64748b">
          ${ontsnap(EVENEMENT.plaats)}<br>
          Kenmerk ${ontsnap(inschrijving.kenmerk)}
        </p>
      </div>`,
    });
    naarInschrijver = !antwoord.error;
  } catch {
    naarInschrijver = false;
  }

  return { ok: true, naarInschrijver };
}
