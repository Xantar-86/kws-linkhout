import { NextRequest, NextResponse } from "next/server";
import { SPONSOR_CONTACT } from "@/app/sponsoring/inhoud";

/**
 * De twee formulieren van de sponsorpagina: vrijblijvend contact en een
 * wedstrijdbal bestellen.
 *
 * Voorheen gingen die via Web3Forms, een externe dienst. Nu sturen we ze zelf
 * door met Resend, dezelfde weg als de toegangsaanvragen voor het beheer. De
 * mail gaat naar het aanspreekpunt sponsoring, met info@ in kopie, en een
 * antwoord gaat rechtstreeks naar wie het formulier invulde.
 *
 * Lokaal wordt er NIETS verstuurd. Anders krijgt de voorzitter een mail telkens
 * iemand het formulier uitprobeert op zijn eigen computer.
 */

/** Zodat een naam met < of & de mail niet kan verbouwen. */
function veilig(tekst: unknown): string {
  return String(tekst ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rij(label: string, waarde: unknown): string {
  const w = String(waarde ?? "").trim();
  return w ? `<tr><td style="padding:4px 12px 4px 0;color:#666">${label}</td><td>${veilig(w)}</td></tr>` : "";
}

export async function POST(request: NextRequest) {
  let gegevens: Record<string, unknown>;
  try {
    gegevens = await request.json();
  } catch {
    return NextResponse.json({ error: "De aanvraag kon niet gelezen worden." }, { status: 400 });
  }

  // Een onzichtbaar veld dat enkel robots invullen.
  if (gegevens.website) return NextResponse.json({ success: true });

  // De veldnamen en de inhoud van de mail zijn die van de oorspronkelijke
  // sponsorsite (form-contact en form-ball), zodat de mail er hetzelfde uitziet.
  const soort = gegevens.soort === "wedstrijdbal" ? "wedstrijdbal" : "contact";
  const veld = (naam: string) => String(gegevens[naam] ?? "").trim();
  const naam = veld("name");
  const email = veld("email");

  if (!naam || !/^[^s@]+@[^s@]+.[^s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Naam en een geldig e-mailadres zijn verplicht." }, { status: 400 });
  }

  let onderwerp: string;
  let tabel: string;

  if (soort === "wedstrijdbal") {
    if (["street", "zip", "city", "phone"].some((v) => !veld(v))) {
      return NextResponse.json({ error: "Vul alle verplichte velden in." }, { status: 400 });
    }
    onderwerp = `Wedstrijdbal bestelling - ${naam}`;
    tabel =
      rij("Naam", naam) +
      rij("E-mail", email) +
      rij("Bedrijfsnaam", veld("company") || "-") +
      rij("Adres", `${veld("street")}, ${veld("zip")} ${veld("city")}`) +
      rij("BTW-nummer", veld("vat") || "-") +
      rij("Telefoon", veld("phone")) +
      rij("Voorkeur wedstrijd", veld("match") || "-");
  } else {
    if (!veld("subject") || !veld("message")) {
      return NextResponse.json({ error: "Vul een onderwerp en een bericht in." }, { status: 400 });
    }
    onderwerp = `Sponsoring KWS Linkhout - ${veld("subject")}`;
    tabel =
      rij("Naam", naam) +
      rij("E-mail", email) +
      rij("Telefoon", veld("phone") || "-") +
      rij("Onderwerp", veld("subject")) +
      `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">Bericht</td><td style="white-space:pre-wrap">${veilig(veld("message"))}</td></tr>`;
  }

  const html = `<h2 style="font-family:sans-serif">${veilig(onderwerp)}</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${tabel}</table>
    <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:20px">
      Verstuurd via kwslinkhout.be/sponsoring. Antwoorden gaat rechtstreeks naar ${veilig(email)}.
    </p>`;

  if (process.env.NODE_ENV !== "production") {
    console.log("[sponsoring] lokaal, niet verstuurd:", { onderwerp, naar: SPONSOR_CONTACT.mail, van: email });
    return NextResponse.json({ success: true, lokaal: true });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("[sponsoring] RESEND_API_KEY ontbreekt");
    return NextResponse.json({ error: "Het bericht kon niet verstuurd worden." }, { status: 500 });
  }

  const antwoord = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({
      // Zoals from_name bij Web3Forms: de naam van wie het formulier invulde.
      from: `${naam.replace(/[<>"\r\n]/g, "")} via KWS Linkhout <noreply@kwslinkhout.be>`,
      to: SPONSOR_CONTACT.mail,
      cc: "info@kwslinkhout.be",
      reply_to: email,
      subject: onderwerp,
      html,
    }),
  });

  if (!antwoord.ok) {
    console.error("[sponsoring] Resend gaf", antwoord.status);
    return NextResponse.json({ error: "Het bericht kon niet verstuurd worden." }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
