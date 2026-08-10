import type { Matchday } from "./matchday";
import type { Uitslag } from "./uitslag";
import { maakGoedkeuringToken, type PostSoort } from "./handtekening";
import { isLive } from "./meta";
import { formatteerDoelpuntenmakers } from "./uitslag";

/**
 * De voorstelmails. Per ploeg zie je de affiche en de exacte tekst, met twee
 * knoppen: meteen goedkeuren, of eerst aanpassen.
 *
 * Geen van beide knoppen post rechtstreeks. Ze openen allebei de
 * goedkeuringspagina, want mailprogramma's laden links soms vooraf op en dan
 * zou een post ongewild vertrekken.
 */

export interface MailItem {
  matchday: Matchday;
  afbeeldingUrl: string;
}

export interface UitslagMailItem {
  uitslag: Uitslag;
  afbeeldingUrl: string;
}

/**
 * Afzender van de voorstelmails.
 *
 * Resend weigert een afzender op een domein dat niet geverifieerd is. Zolang
 * kwslinkhout.be daar niet staat, gebruiken we het testadres van Resend; dat
 * mag alleen mailen naar het adres waarmee het Resend-account geregistreerd is.
 */
function afzender(): string {
  return process.env.SOCIAL_MAIL_FROM ?? "KWS Matchday <onboarding@resend.dev>";
}

export function ontvangers(): string[] {
  return (process.env.SOCIAL_MAIL_TO ?? "jochen.thoelen@gmail.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function knop(href: string, tekst: string, kleur: string): string {
  return `<a href="${href}" style="display:inline-block;padding:12px 22px;margin:4px 8px 4px 0;background:${kleur};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px">${tekst}</a>`;
}

function ontsnap(tekst: string): string {
  return tekst.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

/** Eén voorstel: affiche, tekst en de twee knoppen. */
function blok(opts: {
  ploegNaam: string;
  slug: string;
  aftrapIso: string;
  soort: PostSoort;
  ondertitel: string;
  caption: string;
  afbeeldingUrl: string;
  siteUrl: string;
}): string {
  const token = maakGoedkeuringToken(opts.slug, opts.aftrapIso, opts.soort);
  const basis = `${opts.siteUrl}/matchday/goedkeuren?token=${encodeURIComponent(token)}`;
  const captionHtml = ontsnap(opts.caption).replace(/\n/g, "<br>");

  return `
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:28px">
      <h2 style="margin:0 0 4px 0;font-size:18px;color:#111827">${ontsnap(opts.ploegNaam)}</h2>
      <p style="margin:0 0 16px 0;color:#6b7280;font-size:14px">${ontsnap(opts.ondertitel)}</p>
      <img src="${opts.afbeeldingUrl}" alt="" width="320" style="width:320px;max-width:100%;border-radius:8px;display:block;margin-bottom:16px">
      <div style="background:#f9fafb;border-radius:8px;padding:14px;font-size:14px;line-height:1.6;color:#111827;margin-bottom:18px">
        ${captionHtml}
      </div>
      ${knop(`${basis}&modus=posten`, "Goedkeuren en posten", "#16a34a")}
      ${knop(`${basis}&modus=aanpassen`, "Aanpassen", "#2563eb")}
      <p style="margin:14px 0 0 0;color:#9ca3af;font-size:12px">
        Doe je niets, dan wordt er niets gepost. De link vervalt na 5 dagen.
      </p>
    </div>`;
}

function omhulsel(titel: string, inleiding: string, inhoud: string): string {
  const waarschuwing = isLive()
    ? ""
    : `<p style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px;color:#92400e;font-size:14px">
         <strong>Testmodus.</strong> SOCIAL_LIVE staat niet aan, dus goedkeuren toont enkel wat er gepost zou worden. Er vertrekt niets naar Facebook of Instagram.
       </p>`;

  return `<!doctype html>
<html lang="nl"><body style="margin:0;padding:24px;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;padding:28px">
    <h1 style="margin:0 0 6px 0;font-size:22px;color:#dc2626">${titel}</h1>
    <p style="margin:0 0 22px 0;color:#6b7280;font-size:14px">${inleiding}</p>
    ${waarschuwing}
    ${inhoud}
    <p style="margin:24px 0 0 0;color:#9ca3af;font-size:12px;border-top:1px solid #e5e7eb;padding-top:16px">
      Automatisch verstuurd door de matchday-bot van KWS Linkhout.
    </p>
  </div>
</body></html>`;
}

/** Wekelijkse mail met de aankondigingen van de komende wedstrijden. */
export function bouwMailHtml(items: MailItem[], siteUrl: string): string {
  const blokken = items
    .map((item) =>
      blok({
        ploegNaam: item.matchday.ploeg.naam,
        slug: item.matchday.ploeg.slug,
        aftrapIso: item.matchday.aftrapIso,
        soort: "wedstrijd",
        ondertitel: `${item.matchday.thuisploeg} - ${item.matchday.uitploeg}`,
        caption: item.matchday.caption,
        afbeeldingUrl: item.afbeeldingUrl,
        siteUrl,
      })
    )
    .join("");

  return omhulsel(
    "Wedstrijden van dit weekend",
    "Klaar om te plaatsen. Kijk de tekst na en kies per ploeg wat je doet.",
    blokken
  );
}

/** Mail met de uitslagen die de KBVB net gepubliceerd heeft. */
export function bouwUitslagMailHtml(items: UitslagMailItem[], siteUrl: string): string {
  const blokken = items
    .map((item) => {
      const u = item.uitslag;
      const scorers = formatteerDoelpuntenmakers(u.doelpunten, u.isThuis);
      return blok({
        ploegNaam: u.ploeg.naam,
        slug: u.ploeg.slug,
        aftrapIso: u.aftrapIso,
        soort: "uitslag",
        ondertitel: `${u.thuisploeg} ${u.thuisScore} - ${u.uitScore} ${u.uitploeg}${
          scorers ? ` · ${scorers}` : ""
        }`,
        caption: u.caption,
        afbeeldingUrl: item.afbeeldingUrl,
        siteUrl,
      });
    })
    .join("");

  return omhulsel(
    "Uitslag binnen",
    "De KBVB heeft het wedstrijdblad verwerkt. Dit is de post die klaarstaat.",
    blokken
  );
}

/** Verstuurt een mail via Resend. Geeft false als er geen key is. */
export async function verstuurMail(opts: {
  onderwerp: string;
  html: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[social] RESEND_API_KEY ontbreekt, mail niet verstuurd");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      from: afzender(),
      to: ontvangers(),
      subject: opts.onderwerp,
      html: opts.html,
    }),
  });

  if (!response.ok) {
    console.error("[social] Resend gaf status", response.status, await response.text());
    return false;
  }
  return true;
}
