import { Resend } from "resend";
import { KANALEN, datumNl, type Inzending } from "./velden";

/**
 * De mails rond een ingevuld toestemmingsformulier.
 *
 * Naar de club gaat een mail met de ingevulde pdf als bijlage, zodat het
 * document er meteen is, ook als de pc uit staat en de mappenwachter het nog
 * niet heeft opgehaald. Vulde de ouder een e-mailadres in, dan krijgt die een
 * eigen kopie: een toestemming die je niet kan nalezen is weinig waard.
 */

function afzender(): string {
  return process.env.SOCIAL_MAIL_FROM ?? "KWS Linkhout <onboarding@resend.dev>";
}

function ontvangers(): string[] {
  const rauw =
    process.env.TOESTEMMING_MAIL_TO ?? process.env.SOCIAL_MAIL_TO ?? "jochen.thoelen@gmail.com";
  return rauw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function ontsnap(tekst: string): string {
  return tekst.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** De acht keuzes als tabel, met ja en nee duidelijk in kleur. */
function keuzeTabel(inzending: Inzending): string {
  const rijen = KANALEN.map((kanaal) => {
    const keuze = inzending.keuzes[kanaal.id];
    const kleur = keuze === "Ja" ? "#166534" : "#b91c1c";
    const achtergrond = keuze === "Ja" ? "#dcfce7" : "#fee2e2";
    return `
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155">${ontsnap(kanaal.label)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;text-align:center">
          <span style="display:inline-block;padding:2px 10px;border-radius:999px;background:${achtergrond};color:${kleur};font-size:13px;font-weight:600">${keuze ?? "?"}</span>
        </td>
      </tr>`;
  }).join("");

  return `<table style="width:100%;border-collapse:collapse;margin-top:6px">${rijen}</table>`;
}

function regel(label: string, waarde: string): string {
  if (!waarde) return "";
  return `<p style="margin:0 0 4px 0;font-size:14px;color:#334155"><strong style="color:#0f172a">${ontsnap(label)}:</strong> ${ontsnap(waarde)}</p>`;
}

export interface MailResultaat {
  ok: boolean;
  fout?: string;
  naarOuder?: boolean;
}

export async function stuurToestemmingMail(opts: {
  inzending: Inzending;
  pdf: Uint8Array;
  bestandsnaam: string;
  kenmerk: string;
  op: Date;
}): Promise<MailResultaat> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, fout: "RESEND_API_KEY ontbreekt." };

  const { inzending, pdf, bestandsnaam, kenmerk, op } = opts;
  const resend = new Resend(apiKey);
  const bijlage = { filename: bestandsnaam, content: Buffer.from(pdf).toString("base64") };
  const ondertekenaars = [
    inzending.ouder1.naam,
    inzending.ouder2?.handtekening ? inzending.ouder2.naam : "",
    inzending.spelerZelf?.handtekening ? `${inzending.spelerZelf.naam} (speler)` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const kop = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;padding:24px">
      <h1 style="margin:0 0 2px 0;font-size:20px;color:#0f172a">Toestemming beeldmateriaal</h1>
      <p style="margin:0 0 18px 0;font-size:14px;color:#64748b">${ontsnap(inzending.speler)} &middot; ${ontsnap(inzending.ploeg)}</p>`;

  const clubMail = `${kop}
      <div style="border:1px solid #e2e8f0;border-radius:12px;padding:18px;margin-bottom:18px">
        ${regel("Speler", inzending.speler)}
        ${regel("Geboortedatum", datumNl(inzending.geboortedatum))}
        ${regel("Ploeg", inzending.ploeg)}
        ${regel("Trainer of afgevaardigde", inzending.afgevaardigde ?? "")}
        ${regel("Ondertekend door", ondertekenaars)}
        ${regel("Ingevuld op", `${datumNl(op)}`)}
        ${regel("E-mail ouder", inzending.email ?? "niet opgegeven")}
      </div>
      <h2 style="margin:0 0 0 0;font-size:16px;color:#0f172a">De keuzes</h2>
      ${keuzeTabel(inzending)}
      <p style="margin:18px 0 0 0;font-size:13px;color:#64748b">
        Het ingevulde formulier zit als bijlage. De mappenwachter op de pc zet het ook in
        Goedkeuring Spelers\\${ontsnap(inzending.ploeg)}. Kenmerk ${ontsnap(kenmerk)}.
      </p>
    </div>`;

  try {
    const antwoord = await resend.emails.send({
      from: afzender(),
      to: ontvangers(),
      subject: `Toestemming beeldmateriaal: ${inzending.speler} (${inzending.ploeg})`,
      html: clubMail,
      attachments: [bijlage],
    });
    if (antwoord.error) return { ok: false, fout: antwoord.error.message };
  } catch (fout) {
    return { ok: false, fout: fout instanceof Error ? fout.message : "Onbekende fout" };
  }

  // De kopie voor de ouder. Mislukt die, dan is de toestemming zelf wel
  // binnen; we melden het maar laten de inzending niet sneuvelen.
  let naarOuder = false;
  if (inzending.email) {
    const ouderMail = `${kop}
      <p style="font-size:14px;color:#334155;line-height:1.6">
        Bedankt, we hebben je keuzes ontvangen. In bijlage vind je het ingevulde formulier
        zoals het bij de club is aangekomen. Hou het bij: het is jouw bewijs van wat je
        wel en niet toestaat.
      </p>
      <h2 style="margin:18px 0 0 0;font-size:16px;color:#0f172a">Wat je hebt aangeduid</h2>
      ${keuzeTabel(inzending)}
      <p style="margin:18px 0 0 0;font-size:13px;color:#64748b;line-height:1.6">
        Wil je je keuze later wijzigen of intrekken, stuur dan een bericht naar
        <a href="mailto:info@kwslinkhout.be" style="color:#b91c1c">info@kwslinkhout.be</a>.
        Dat heeft geen enkel gevolg voor je kind binnen de club.
      </p>
    </div>`;
    try {
      const antwoord = await resend.emails.send({
        from: afzender(),
        to: [inzending.email],
        subject: "Je toestemming voor beeldmateriaal, KWS Linkhout",
        html: ouderMail,
        attachments: [bijlage],
      });
      naarOuder = !antwoord.error;
    } catch {
      naarOuder = false;
    }
  }

  return { ok: true, naarOuder };
}
