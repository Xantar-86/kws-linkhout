import { Resend } from "resend";
import { EVENEMENT, GERECHTEN, GROEPEN, euro, gerechtenVan, mededeling } from "./kaart";
import { telOp, type Inschrijving, type Totalen } from "./opslag";

/**
 * De mails rond het mosselfeest.
 *
 * Twee soorten, en bewust niet meer dan dat:
 *
 *  - Een bevestiging naar wie inschrijft, met wat hij besteld heeft, het bedrag
 *    en de mededeling voor de overschrijving.
 *  - Eén samenvatting per dag naar de club, met wat er die dag bijkwam en de
 *    stand van zaken.
 *
 * Er gaat dus géén mail per inschrijving naar de club. Dat was dubbel werk
 * naast de overzichtspagina en het Excel-logboek, en het verbruikt onnodig
 * mailtegoed: Resend geeft op het gratis plan 100 mails per dag. Loopt de
 * aankondiging goed, dan zitten er op één avond zo tientallen inschrijvingen
 * in, en dan wil je die teller niet aan de club verspillen.
 *
 * Een mail die niet vertrekt is nooit erg: de inschrijving is al bewaard voor
 * er gemaild wordt, en staat op de overzichtspagina en in het logboek.
 *
 * Let op: zolang er in Resend geen domein geverifieerd is, weigert Resend elke
 * ontvanger behalve het adres van het Resend-account zelf. De bevestiging naar
 * de inschrijver komt dan niet aan. Zie docs/MOSSELFEEST.md.
 */

/**
 * Afzender van de mosselfeest-mails.
 *
 * Het e-mailadres nemen we over uit SOCIAL_MAIL_FROM, want dat is het adres
 * dat Resend aanvaardt. De naam ervoor zetten we zelf, anders komt een
 * inschrijving binnen onder de naam van een andere functie van de site. Wordt
 * kwslinkhout.be later in Resend geverifieerd, dan verhuist deze naam
 * automatisch mee naar het nieuwe adres.
 *
 * Met MOSSELFEEST_MAIL_FROM zet je desnoods de hele afzender zelf.
 */
function afzender(): string {
  const eigen = process.env.MOSSELFEEST_MAIL_FROM;
  if (eigen) return eigen;
  const basis = process.env.SOCIAL_MAIL_FROM ?? "onboarding@resend.dev";
  const adres = /<([^>]+)>/.exec(basis)?.[1] ?? basis.trim();
  return `KWS Mosselfeest <${adres}>`;
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

function zittingLabel(id: string): string {
  return EVENEMENT.zittingen.find((z) => z.id === id)?.label ?? id;
}

function omhulsel(titel: string, ondertitel: string, binnenin: string): string {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;padding:24px">
      <h1 style="margin:0 0 2px 0;font-size:20px;color:#0f172a">${ontsnap(titel)}</h1>
      <p style="margin:0 0 18px 0;font-size:14px;color:#64748b">${ontsnap(ondertitel)}</p>
      ${binnenin}
    </div>`;
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

export interface MailResultaat {
  ok: boolean;
  verstuurd: boolean;
  fout?: string;
}

/** De bevestiging naar wie ingeschreven heeft. */
export async function stuurBevestiging(inschrijving: Inschrijving): Promise<MailResultaat> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, verstuurd: false, fout: "RESEND_API_KEY ontbreekt." };

  // Een ingetypte kaart heeft geen adres; daar valt niets te bevestigen.
  if (!inschrijving.email) return { ok: true, verstuurd: false };

  const betaalblok = `
    <div style="border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-top:18px">
      <p style="margin:0 0 8px 0;font-size:15px;font-weight:600;color:#0f172a">Betalen</p>
      <p style="margin:0;font-size:14px;color:#334155;line-height:1.7">
        ${euro(inschrijving.bedrag)} euro op ${EVENEMENT.rekening}<br>
        op naam van ${ontsnap(EVENEMENT.rekeningNaam)}<br>
        met als mededeling <strong>${ontsnap(mededeling(inschrijving.kenmerk, inschrijving.naam))}</strong>
      </p>
    </div>`;

  const html = omhulsel(
    `${EVENEMENT.naam} ${EVENEMENT.jaar}`,
    zittingLabel(inschrijving.zitting),
    `<p style="font-size:14px;color:#334155;line-height:1.7">
       Bedankt voor je inschrijving. Hieronder staat wat we voor je klaarzetten.
       Kloppen er dingen niet, mail dan naar
       <a href="mailto:${EVENEMENT.contact}" style="color:#b91c1c">${EVENEMENT.contact}</a>.
     </p>
     ${besteltabel(inschrijving)}
     ${betaalblok}
     <p style="margin:18px 0 0 0;font-size:13px;color:#64748b">
       ${ontsnap(EVENEMENT.plaats)}<br>
       Kenmerk ${ontsnap(inschrijving.kenmerk)}
     </p>`,
  );

  try {
    const antwoord = await new Resend(apiKey).emails.send({
      from: afzender(),
      to: [inschrijving.email],
      subject: "Je inschrijving voor het mosselfeest is binnen",
      html,
    });
    if (antwoord.error) return { ok: false, verstuurd: false, fout: antwoord.error.message };
    return { ok: true, verstuurd: true };
  } catch (fout) {
    return {
      ok: false,
      verstuurd: false,
      fout: fout instanceof Error ? fout.message : "Onbekende fout",
    };
  }
}

/** Het blok met wat er besteld moet worden, per groep van de kaart. */
function bestellijst(totalen: Totalen): string {
  const blokken = GROEPEN.map((groep) => {
    const gerechten = gerechtenVan(groep.id).filter((g) => (totalen.perGerecht[g.id] ?? 0) > 0);
    if (gerechten.length === 0) return "";
    const rijen = gerechten
      .map(
        (g) => `
        <tr>
          <td style="padding:5px 10px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155">${ontsnap(g.naam)}</td>
          <td style="padding:5px 10px;border-bottom:1px solid #f1f5f9;font-size:15px;font-weight:700;color:#0f172a;text-align:right">${totalen.perGerecht[g.id]}</td>
        </tr>`,
      )
      .join("");
    return `
      <p style="margin:16px 0 2px 0;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#94a3b8">${ontsnap(groep.titel)}</p>
      <table style="width:100%;border-collapse:collapse">${rijen}</table>`;
  }).join("");

  return blokken || `<p style="font-size:14px;color:#64748b">Nog niets besteld.</p>`;
}

export interface SamenvattingResultaat extends MailResultaat {
  /** Wat er in de mail stond, ook handig bij een droge proef. */
  nieuw: number;
  totaalInschrijvingen: number;
}

/**
 * De samenvatting voor de club: wat er sinds gisteren bijkwam, en de stand.
 *
 * `droog` stuurt niets en geeft enkel terug wat er zou vertrekken, zodat je de
 * planning kan uitproberen zonder mailtegoed op te branden.
 */
export async function stuurSamenvatting(opts: {
  inschrijvingen: Inschrijving[];
  /** Vanaf wanneer een inschrijving als nieuw geldt. Standaard 24 uur terug. */
  sinds?: Date;
  droog?: boolean;
}): Promise<SamenvattingResultaat> {
  const { inschrijvingen, droog = false } = opts;
  const sinds = opts.sinds ?? new Date(Date.now() - 24 * 60 * 60 * 1000);
  const totalen = telOp(inschrijvingen);
  const nieuwe = inschrijvingen.filter((i) => new Date(i.aangemeld) >= sinds);

  const basis = {
    nieuw: nieuwe.length,
    totaalInschrijvingen: totalen.inschrijvingen,
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ...basis, ok: false, verstuurd: false, fout: "RESEND_API_KEY ontbreekt." };
  }

  const nieuweRijen =
    nieuwe.length === 0
      ? `<p style="font-size:14px;color:#64748b">Er kwam niets bij.</p>`
      : `<table style="width:100%;border-collapse:collapse">${nieuwe
          .map((i) => {
            const bron =
              i.bron === "kaart" ? " (kaart)" : i.bron === "verzamelpost" ? " (stapel)" : "";
            return `
            <tr>
              <td style="padding:5px 10px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155">
                ${ontsnap(i.naam)}${bron}
                <span style="color:#94a3b8"> &middot; ${ontsnap(i.zitting ? zittingLabel(i.zitting) : "zonder zitting")}</span>
              </td>
              <td style="padding:5px 10px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-align:right">${euro(i.bedrag)}</td>
            </tr>`;
          })
          .join("")}</table>`;

  const cijfer = (label: string, waarde: string) => `
    <td style="padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8">${ontsnap(label)}</div>
      <div style="font-size:18px;font-weight:700;color:#0f172a">${ontsnap(waarde)}</div>
    </td>`;

  const html = omhulsel(
    `Mosselfeest: stand van zaken`,
    `${totalen.inschrijvingen} inschrijving${totalen.inschrijvingen === 1 ? "" : "en"}, ${totalen.porties} porties`,
    `<table style="width:100%;border-collapse:separate;border-spacing:6px 0">
       <tr>
         ${cijfer("Nieuw", String(nieuwe.length))}
         ${cijfer("Porties", String(totalen.porties))}
         ${cijfer("Nog te ontvangen", `${euro(totalen.bedragOpen)} euro`)}
       </tr>
     </table>

     <h2 style="margin:22px 0 0 0;font-size:16px;color:#0f172a">Nieuw sinds gisteren</h2>
     ${nieuweRijen}

     <h2 style="margin:22px 0 0 0;font-size:16px;color:#0f172a">Wat er besteld moet worden</h2>
     ${bestellijst(totalen)}

     <p style="margin:22px 0 0 0;font-size:13px;color:#64748b;line-height:1.7">
       Betaald: ${euro(totalen.bedragBetaald)} euro van ${euro(totalen.bedrag)} euro.<br>
       Het volledige overzicht, met betaald afvinken en het Excel-bestand, staat op
       <a href="${process.env.SITE_URL ?? "https://www.kwslinkhout.be"}/mosselfeest/overzicht" style="color:#b91c1c">de overzichtspagina</a>.
     </p>`,
  );

  if (droog) return { ...basis, ok: true, verstuurd: false };

  try {
    const antwoord = await new Resend(apiKey).emails.send({
      from: afzender(),
      to: ontvangers(),
      subject: `Mosselfeest: ${nieuwe.length} nieuw, ${totalen.porties} porties in totaal`,
      html,
    });
    if (antwoord.error) return { ...basis, ok: false, verstuurd: false, fout: antwoord.error.message };
    return { ...basis, ok: true, verstuurd: true };
  } catch (fout) {
    return {
      ...basis,
      ok: false,
      verstuurd: false,
      fout: fout instanceof Error ? fout.message : "Onbekende fout",
    };
  }
}
