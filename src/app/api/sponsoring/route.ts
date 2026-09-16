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

  const soort = gegevens.soort === "wedstrijdbal" ? "wedstrijdbal" : "contact";
  const naam = String(gegevens.naam ?? "").trim();
  const email = String(gegevens.email ?? "").trim();

  if (!naam || !email || !email.includes("@")) {
    return NextResponse.json({ error: "Naam en een geldig e-mailadres zijn verplicht." }, { status: 400 });
  }

  let onderwerp: string;
  let tabel: string;

  if (soort === "wedstrijdbal") {
    for (const veld of ["straat", "postcode", "gemeente", "telefoon"]) {
      if (!String(gegevens[veld] ?? "").trim()) {
        return NextResponse.json({ error: "Vul alle verplichte velden in." }, { status: 400 });
      }
    }
    onderwerp = `Bestelling wedstrijdbal door ${naam}`;
    tabel =
      rij("Naam", naam) +
      rij("Bedrijf", gegevens.bedrijf) +
      rij("Adres", `${gegevens.straat}, ${gegevens.postcode} ${gegevens.gemeente}`) +
      rij("Btw-nummer", gegevens.btw) +
      rij("E-mail", email) +
      rij("Telefoon", gegevens.telefoon) +
      rij("Voorkeur wedstrijd", gegevens.wedstrijd);
  } else {
    if (!String(gegevens.onderwerp ?? "").trim() || !String(gegevens.bericht ?? "").trim()) {
      return NextResponse.json({ error: "Kies een onderwerp en schrijf een bericht." }, { status: 400 });
    }
    onderwerp = `Sponsoring: ${String(gegevens.onderwerp)} (${naam})`;
    tabel =
      rij("Naam", naam) +
      rij("E-mail", email) +
      rij("Telefoon", gegevens.telefoon) +
      rij("Onderwerp", gegevens.onderwerp) +
      `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">Bericht</td><td style="white-space:pre-wrap">${veilig(gegevens.bericht)}</td></tr>`;
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
      from: "KWS Linkhout sponsoring <noreply@kwslinkhout.be>",
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
