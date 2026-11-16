import { NextRequest, NextResponse } from "next/server";
import { verstuurMail, ontvangers } from "@/lib/social/mail";

/**
 * Elke maandagochtend een mail met de link naar het weekoverzicht van die week.
 *
 * Aangeroepen door de Vercel-cron (vercel.json), die CRON_SECRET als
 * Bearer-token meestuurt. De mail bevat zelf geen wedstrijden: de RBFA laat
 * onze server niet meer toe, dus het beeld wordt pas op de pagina gemaakt, in
 * de browser. Met ?droog=1 zie je wat er zou vertrekken zonder te mailen.
 */

export const dynamic = "force-dynamic";

const MAANDEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

/** Deze week, maandag tot zondag, in Belgische tijd: "16 tot 22 november". */
function dezeWeek(): string {
  const nu = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Brussels" }));
  const ma = new Date(nu);
  ma.setDate(nu.getDate() - ((nu.getDay() + 6) % 7));
  const zo = new Date(ma);
  zo.setDate(ma.getDate() + 6);
  return ma.getMonth() === zo.getMonth()
    ? `${ma.getDate()} tot ${zo.getDate()} ${MAANDEN[zo.getMonth()]}`
    : `${ma.getDate()} ${MAANDEN[ma.getMonth()]} tot ${zo.getDate()} ${MAANDEN[zo.getMonth()]}`;
}

export async function GET(request: NextRequest) {
  const geheim = process.env.CRON_SECRET;
  if (!geheim || request.headers.get("authorization") !== `Bearer ${geheim}`) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const site = process.env.SITE_URL ?? "https://www.kwslinkhout.be";
  const link = `${site}/matchday/weekoverzicht`;
  const week = dezeWeek();
  const onderwerp = `Weekoverzicht ${week} staat klaar`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;background:#141010;color:#ffffff;border-radius:12px">
  <h2 style="margin:0 0 12px">Wedstrijden deze week</h2>
  <p style="color:#dddddd;line-height:1.5">Het overzicht van alle wedstrijden van ${week} staat klaar voor Facebook en Instagram. Open de pagina, kijk het beeld na, download het en kopieer de tekst.</p>
  <p style="margin:24px 0"><a href="${link}" style="display:inline-block;padding:14px 24px;background:#9e1b1b;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700">Weekoverzicht openen</a></p>
  <p style="color:#999999;font-size:13px">Op de gsm kan je het beeld vanop de pagina meteen delen naar Facebook of Instagram.</p>
</div>`;

  if (request.nextUrl.searchParams.get("droog") === "1") {
    return NextResponse.json({ droog: true, aan: ontvangers(), onderwerp, link });
  }

  const verstuurd = await verstuurMail({ onderwerp, html });
  return NextResponse.json({ verstuurd }, { status: verstuurd ? 200 : 500 });
}
