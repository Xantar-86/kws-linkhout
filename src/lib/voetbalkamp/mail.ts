import { Resend } from "resend";
import { KAMP, euro, mededeling, volledigeNaam, type KampInschrijving } from "./kamp";

/**
 * De bevestiging van een inschrijving voor het voetbalkamp.
 *
 * Eén mail naar de ouder, met de club in blinde kopie; dat is één verzending
 * op het mailtegoed. Opmaak en afzender zoals bij het mosselfeest.
 */

const ROOD = "#b91c1c";
const INKT = "#120c0d";
const ZAND = "#f4f1ec";
const GRIJS = "#6b7280";

function afzender(): string {
  const eigen = process.env.KAMP_MAIL_FROM;
  if (eigen) return eigen;
  const basis = process.env.SOCIAL_MAIL_FROM ?? "onboarding@resend.dev";
  const adres = /<([^>]+)>/.exec(basis)?.[1] ?? basis.trim();
  return `KWS Voetbalkamp <${adres}>`;
}

function clubAdressen(): string[] {
  const rauw =
    process.env.KAMP_MAIL_TO ??
    process.env.MOSSELFEEST_MAIL_TO ??
    process.env.SOCIAL_MAIL_TO ??
    "jochen.thoelen@gmail.com";
  return rauw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function ontsnap(tekst: string): string {
  return tekst.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function siteUrl(): string {
  return (process.env.SITE_URL ?? "https://www.kwslinkhout.be").replace(/\/$/, "");
}

function rij(label: string, waarde: string, extra = ""): string {
  return `
    <tr>
      <td style="padding:4px 0;width:130px;color:${GRIJS};vertical-align:top">${ontsnap(label)}</td>
      <td style="padding:4px 0;color:#334155;${extra}">${waarde}</td>
    </tr>`;
}

export async function stuurBevestiging(
  i: KampInschrijving,
): Promise<{ ok: boolean; verstuurd: boolean; fout?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, verstuurd: false, fout: "RESEND_API_KEY ontbreekt." };
  if (!i.email) return { ok: true, verstuurd: false };

  const bedrag = i.bedrag ?? KAMP.prijs;
  const speler = volledigeNaam(i);
  const geboren = new Date(`${i.geboortedatum}T12:00:00`).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const html = `
<!doctype html>
<html lang="nl">
  <body style="margin:0;padding:24px 12px;background:${ZAND};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;margin:0 auto;border-collapse:collapse;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 14px rgba(18,12,13,0.08)">
      <tr>
        <td style="background:${INKT};padding:20px 24px">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:12px;vertical-align:middle">
              <img src="${siteUrl()}/images/kwslinkhout-logo.png" width="44" height="44" alt="" style="display:block;width:44px;height:44px;object-fit:contain">
            </td>
            <td style="vertical-align:middle">
              <div style="color:#ffffff;font-size:15px;font-weight:700;letter-spacing:0.02em">K.W.S. LINKHOUT</div>
              <div style="color:rgba(255,255,255,0.7);font-size:12px">${ontsnap(KAMP.naam)} ${KAMP.jaar}</div>
            </td>
          </tr></table>
        </td>
      </tr>
      <tr>
        <td style="padding:26px 24px 24px 24px">
          <h1 style="margin:0 0 2px 0;font-size:21px;line-height:1.3;color:${ROOD}">${ontsnap(speler)} is ingeschreven</h1>
          <p style="margin:0 0 18px 0;font-size:14px;color:${GRIJS}">${ontsnap(KAMP.datumTekst)}</p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:${ZAND};border-radius:12px;margin:0 0 18px 0">
            <tr><td style="padding:14px 16px">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:${GRIJS}">Inschrijfnummer</div>
              <div style="font-size:30px;font-weight:800;color:${INKT};line-height:1.2">${i.nummer ?? "-"}</div>
            </td></tr>
          </table>

          <p style="margin:0 0 12px 0;font-size:15px;color:#334155;line-height:1.7">
            Dag ${ontsnap(i.ouderNaam)}, bedankt om ${ontsnap(i.voornaam)} in te schrijven voor het
            ${ontsnap(KAMP.naam.toLowerCase())}. Dit hebben we genoteerd:
          </p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">
            ${rij("Speler", ontsnap(speler), "font-weight:700;color:#0f172a")}
            ${rij("Geboren", ontsnap(geboren))}
            ${rij("Categorie", ontsnap(i.categorie))}
            ${rij("Lid van KWS", i.lid ? "ja" : "nee")}
            ${rij("Ouder", ontsnap(i.ouderNaam))}
            ${rij("Gsm", ontsnap(i.telefoon))}
            ${i.opmerking ? rij("Opmerking", ontsnap(i.opmerking).replace(/\n/g, "<br>")) : ""}
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:${ZAND};border-radius:12px;margin-top:18px">
            <tr><td style="padding:12px 16px">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:${GRIJS};margin-bottom:6px">Inbegrepen</div>
              ${KAMP.inbegrepen
                .map(
                  (item) =>
                    `<div style="font-size:14px;color:#334155;line-height:1.9"><span style="font-size:18px">${item.teken}</span>&nbsp; ${ontsnap(item.tekst)}</div>`,
                )
                .join("")}
            </td></tr>
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:2px solid ${ROOD};border-radius:12px;margin-top:20px">
            <tr><td style="padding:16px">
              <div style="font-size:15px;font-weight:700;color:${INKT};margin-bottom:6px">Betalen</div>
              <p style="margin:0 0 12px 0;font-size:14px;color:#334155;line-height:1.6">
                ${
                  bedrag !== null
                    ? "Gelieve het bedrag over te schrijven op onderstaande rekening. De inschrijving is definitief zodra de betaling binnen is."
                    : "Het bedrag laten we je nog weten. Schrijf dan over op onderstaande rekening, met deze mededeling."
                }
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">
                ${bedrag !== null ? rij("Bedrag", `${euro(bedrag)} euro`, "font-weight:700;color:#0f172a") : ""}
                ${rij("Rekening", ontsnap(KAMP.rekening), "font-weight:700;color:#0f172a")}
                ${rij("Op naam van", ontsnap(KAMP.rekeningNaam))}
                ${rij("Mededeling", ontsnap(mededeling(i)), `font-weight:700;color:${ROOD}`)}
              </table>
              <p style="margin:12px 0 0 0;font-size:13px;color:${GRIJS};line-height:1.6">
                Neem de mededeling letterlijk over, dan kunnen we je betaling meteen aan de inschrijving koppelen.
              </p>
            </td></tr>
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:18px;font-size:14px">
            ${rij("Wanneer", ontsnap(KAMP.datumTekst))}
            ${rij("Waar", ontsnap(KAMP.plaats))}
          </table>

          <p style="margin:18px 0 0 0;font-size:13px;color:${GRIJS};line-height:1.7">
            Klopt er iets niet, of kan ${ontsnap(i.voornaam)} toch niet komen? Mail naar
            <a href="mailto:${KAMP.contact}" style="color:${ROOD}">${KAMP.contact}</a>
            en vermeld het inschrijfnummer.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:${ZAND};padding:16px 24px;font-size:12px;line-height:1.6;color:${GRIJS}">
          K.W.S. Linkhout, Kapelstraat 72, Linkhout &middot; stamnummer 3531<br>
          <a href="mailto:${KAMP.contact}" style="color:${ROOD};text-decoration:none">${KAMP.contact}</a>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  try {
    const antwoord = await new Resend(apiKey).emails.send({
      from: afzender(),
      to: [i.email],
      bcc: clubAdressen(),
      subject: `Voetbalkamp: ${speler} is ingeschreven (nr. ${i.nummer ?? "-"})`,
      html,
    });
    if (antwoord.error) return { ok: false, verstuurd: false, fout: antwoord.error.message };
    return { ok: true, verstuurd: true };
  } catch (fout) {
    return { ok: false, verstuurd: false, fout: fout instanceof Error ? fout.message : "Onbekende fout" };
  }
}
