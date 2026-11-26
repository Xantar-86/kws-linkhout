/**
 * De uitnodigingsmail voor een evaluatie, in de opmaak van de clubmails
 * (voetbalkamp, mosselfeest). De trainer verstuurt hem zelf uit zijn eigen
 * mailbox: de knop zet de opgemaakte mail op het klembord en opent een lege
 * mail met ontvanger en onderwerp. Werkt in de browser en op de server.
 */

export type Uitnodiging = {
  rol: "speler" | "ouders";
  groep: "jong" | "midden" | "oud";
  voornaam: string;
  ploeg: string;
  ronde: string;
  tot: string;
  trainer: string;
  link: string;
  basis: string;
  /** Het ouderveld dat enkel de jeugdcoördinator ziet, zit in deze ronde. */
  vertrouwelijk: boolean;
};

const ROOD = "#b91c1c";
const INKT = "#120c0d";
const ZAND = "#f4f1ec";
const GRIJS = "#6b7280";
const TEKST = "#334155";

function ontsnap(tekst: string): string {
  return tekst.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Speler met eigen link (vanaf U13) wordt rechtstreeks aangesproken, anders de ouders. */
function aanSpeler(u: Uitnodiging) {
  return u.rol === "speler" && u.groep === "oud";
}

function inhoud(u: Uitnodiging, aan: string) {
  const v = u.voornaam;
  const groet = aan ? `Dag ${aan},` : "Dag,";
  if (aanSpeler(u)) {
    return {
      onderwerp: `Jouw evaluatie bij KWS Linkhout (${u.ploeg})`,
      titel: `Jouw evaluatie, ${v}`,
      groet: `Dag ${v},`,
      intro: [
        `Een paar keer per seizoen staan we bij KWS Linkhout even stil bij hoe het met elke speler gaat. Als trainer vul ik een evaluatie over jou in, en ik ben benieuwd hoe jij het zelf ziet.`,
        `Er zijn geen goede of foute antwoorden: zeg gewoon eerlijk wat je denkt. Daar leren we allebei het meest van.`,
      ],
      knop: "Mijn evaluatie invullen",
      stappen: [
        "Klik op de knop. Aanmelden is niet nodig.",
        "Beantwoord de vragen. Neem je tijd: het duurt een paar minuten.",
        "Niet in één keer klaar? Klik op Tussentijds bewaren en ga later verder via dezelfde link.",
        "Klik op Indienen als alles ingevuld is. Tot de einddatum kan je nog aanpassen.",
      ],
      daarna: `Ik leg jouw antwoorden naast die van mij en we bespreken ze samen. Daarna vind je het verslag en je werkpunten bovenaan dezelfde link terug.`,
      persoonlijk: "Deze link is enkel voor jou: stuur hem niet door.",
      vraag: "Vragen? Antwoord gewoon op deze mail of spreek me aan op training.",
    };
  }
  if (u.rol === "speler") {
    const jong = u.groep === "jong";
    return {
      onderwerp: `Evaluatie van ${v} bij KWS Linkhout (${u.ploeg})`,
      titel: `${v} vult zelf in`,
      groet,
      intro: [
        `Een paar keer per seizoen staan we bij KWS Linkhout even stil bij hoe het met elke speler gaat. Als trainer vul ik een evaluatie over ${v} in, en ik ben benieuwd hoe ${v} het zelf ziet.`,
        jong
          ? `Voor de jongsten gaat dat met gezichtjes in plaats van cijfers, en met korte vragen. Lees ze gerust samen met ${v}, maar laat ${v} zelf kiezen: het gaat om wat ${v} ervan vindt.`
          : `Laat ${v} de vragen gerust zelf invullen, met wat hulp waar nodig. Het gaat om hoe ${v} het zelf ziet, er zijn geen goede of foute antwoorden.`,
      ],
      knop: `Evaluatie van ${v} invullen`,
      stappen: [
        "Klik op de knop. Aanmelden is niet nodig.",
        jong
          ? `Bij de meeste vragen kiest ${v} een gezichtje. Lees de vragen voor waar nodig.`
          : "Beantwoord de vragen. Het duurt een paar minuten.",
        "Niet in één keer klaar? Klik op Tussentijds bewaren en ga later verder via dezelfde link.",
        "Klik op Indienen als alles ingevuld is. Tot de einddatum kan je nog aanpassen.",
      ],
      daarna: `Ik leg de antwoorden naast mijn eigen evaluatie en bespreek ze met ${v}. Daarna staat het verslag bovenaan dezelfde link.`,
      persoonlijk: `Deze link is enkel voor ${v}: stuur hem niet door. De vragen voor de ouders krijg je met een aparte link.`,
      vraag: "Vragen? Antwoord gewoon op deze mail of spreek me aan op training.",
    };
  }
  return {
    onderwerp: `Evaluatie van ${v}: vragen voor de ouders (${u.ploeg})`,
    titel: `Hoe zie jij het, als ouder?`,
    groet,
    intro: [
      `Een paar keer per seizoen staan we bij KWS Linkhout even stil bij hoe het met elke speler gaat. Als trainer vul ik een evaluatie over ${v} in, ${v} doet dat zelf ook, en we horen graag hoe jij het als ouder ziet.`,
      `Het gaat niet over voetbaltechniek, wel over hoe ${v} zich voelt bij de ploeg en de club, wat je thuis hoort en waar we rekening mee kunnen houden.`,
    ],
    knop: "Vragen voor de ouders invullen",
    stappen: [
      "Klik op de knop. Aanmelden is niet nodig.",
      "Beantwoord de vragen. Het duurt een vijftal minuten.",
      "Niet in één keer klaar? Klik op Tussentijds bewaren en ga later verder via dezelfde link.",
      "Klik op Indienen als alles ingevuld is. Tot de einddatum kan je nog aanpassen.",
    ],
    daarna:
      `Ik neem je antwoorden mee in het gesprek met ${v}. Daarna staat het verslag bovenaan dezelfde link.` +
      (u.vertrouwelijk ? " Eén vak is enkel voor de jeugdcoördinator: wat je daar schrijft, krijg ik als trainer niet te zien." : ""),
    persoonlijk: `Deze link hoort bij ${v}: stuur hem niet door.`,
    vraag: "Vragen? Antwoord gewoon op deze mail of spreek me aan aan het veld.",
  };
}

export function maakUitnodiging(u: Uitnodiging, aan = ""): { onderwerp: string; html: string; tekst: string } {
  const t = inhoud(u, aan);
  const ondertekening = `Sportieve groeten,\n${u.trainer}\nTrainer ${u.ploeg}, KWS Linkhout`;

  const tekst = [
    t.groet,
    "",
    ...t.intro.flatMap((p) => [p, ""]),
    `Invullen kan tot en met ${u.tot}:`,
    u.link,
    "",
    "Zo werkt het:",
    ...t.stappen.map((s, i) => `${i + 1}. ${s}`),
    "",
    t.daarna,
    "",
    t.persoonlijk,
    t.vraag,
    "",
    ondertekening,
  ].join("\n");

  const p = (s: string, extra = "") =>
    `<p style="margin:0 0 12px 0;font-size:15px;line-height:1.65;color:${TEKST};${extra}">${ontsnap(s)}</p>`;

  const html = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${ZAND}" style="width:100%;border-collapse:collapse;background:${ZAND};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<tr><td style="padding:20px 10px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="width:100%;max-width:600px;margin:0 auto;border-collapse:collapse;background:#ffffff;border-radius:14px;overflow:hidden">
  <tr>
    <td bgcolor="${INKT}" style="background:${INKT};padding:18px 24px">
      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr>
        <td style="padding-right:12px;vertical-align:middle">
          <img src="${u.basis}/images/kwslinkhout-logo.png" width="44" height="44" alt="KWS Linkhout" style="display:block;width:44px;height:44px">
        </td>
        <td style="vertical-align:middle">
          <div style="color:#ffffff;font-size:15px;font-weight:700;letter-spacing:0.02em">K.W.S. LINKHOUT</div>
          <div style="color:#c9c2c0;font-size:12px">Spelersevaluatie &middot; ${ontsnap(u.ploeg)}</div>
        </td>
      </tr></table>
    </td>
  </tr>
  <tr>
    <td style="padding:26px 24px 8px 24px">
      <h1 style="margin:0 0 2px 0;font-size:22px;line-height:1.3;color:${ROOD}">${ontsnap(t.titel)}</h1>
      <p style="margin:0 0 18px 0;font-size:14px;color:${GRIJS}">${ontsnap(u.ronde)} &middot; invullen tot en met ${ontsnap(u.tot)}</p>
      ${p(t.groet)}
      ${t.intro.map((s) => p(s)).join("\n      ")}
      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 6px 0"><tr>
        <td bgcolor="${ROOD}" style="background:${ROOD};border-radius:10px">
          <a href="${ontsnap(u.link)}" style="display:inline-block;padding:13px 22px;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none">${ontsnap(t.knop)} &rarr;</a>
        </td>
      </tr></table>
      <p style="margin:0 0 20px 0;font-size:12px;color:${GRIJS}">Werkt de knop niet? Open dan deze link:<br><a href="${ontsnap(u.link)}" style="color:${ROOD};word-break:break-all">${ontsnap(u.link)}</a></p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${ZAND}" style="width:100%;border-collapse:collapse;background:${ZAND};border-radius:12px">
        <tr><td style="padding:14px 16px">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:${GRIJS};margin-bottom:8px">Zo werkt het</div>
          <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
            ${t.stappen
              .map(
                (s, i) => `<tr>
              <td style="vertical-align:top;padding:3px 10px 3px 0"><div style="width:22px;height:22px;line-height:22px;text-align:center;border-radius:11px;background:${ROOD};color:#ffffff;font-size:12px;font-weight:700">${i + 1}</div></td>
              <td style="vertical-align:top;padding:4px 0;font-size:14px;line-height:1.55;color:${TEKST}">${ontsnap(s)}</td>
            </tr>`,
              )
              .join("")}
          </table>
        </td></tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border-left:4px solid ${ROOD};margin:18px 0 0 0">
        <tr><td style="padding:2px 0 2px 14px">
          <div style="font-size:14px;font-weight:700;color:${INKT};margin-bottom:4px">En daarna?</div>
          <div style="font-size:14px;line-height:1.6;color:${TEKST}">${ontsnap(t.daarna)}</div>
        </td></tr>
      </table>

      <p style="margin:18px 0 4px 0;font-size:13px;line-height:1.6;color:${GRIJS}">${ontsnap(t.persoonlijk)} ${ontsnap(t.vraag)}</p>
      <p style="margin:16px 0 18px 0;font-size:15px;line-height:1.6;color:${TEKST}">Sportieve groeten,<br><strong style="color:${INKT}">${ontsnap(u.trainer)}</strong><br><span style="color:${GRIJS};font-size:13px">Trainer ${ontsnap(u.ploeg)}, KWS Linkhout</span></p>
    </td>
  </tr>
  <tr>
    <td bgcolor="${ZAND}" style="background:${ZAND};padding:14px 24px;font-size:12px;line-height:1.6;color:${GRIJS}">
      K.W.S. Linkhout, Kapelstraat 72, Linkhout &middot; stamnummer 3531<br>
      <a href="https://www.kwslinkhout.be" style="color:${ROOD};text-decoration:none">www.kwslinkhout.be</a>
    </td>
  </tr>
</table>
</td></tr>
</table>`;

  return { onderwerp: t.onderwerp, html, tekst };
}
