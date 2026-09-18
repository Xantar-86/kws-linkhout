import { NextRequest, NextResponse } from "next/server";
import { logboekNaam, maakLogboek } from "@/lib/mosselfeest/logboek";
import { alleInschrijvingen } from "@/lib/mosselfeest/opslag";

/**
 * Het Excel-logboek, kant en klaar.
 *
 * Het programma op de pc haalt dit elk kwartier op met MOSSELFEEST_SLEUTEL en
 * schrijft het in de map van het mosselfeest in OneDrive. De
 * overzichtspagina gebruikt hetzelfde adres met het wachtwoord van de
 * organisatoren, zodat je het bestand ook gewoon kan downloaden.
 *
 * Het bestand wordt elke keer volledig opnieuw gemaakt uit de inschrijvingen.
 * Eigen wijzigingen in het bestand gaan dus verloren; betaald afvinken hoort
 * op de overzichtspagina.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function magBinnen(request: NextRequest): boolean {
  const kop = request.headers.get("authorization") ?? "";
  if (!kop.startsWith("Bearer ")) return false;
  const gegeven = kop.slice(7);
  const sleutel = process.env.MOSSELFEEST_SLEUTEL;
  const wachtwoord = process.env.MOSSELFEEST_WACHTWOORD;
  return Boolean((sleutel && gegeven === sleutel) || (wachtwoord && gegeven === wachtwoord));
}

export async function GET(request: NextRequest) {
  if (!magBinnen(request)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const inschrijvingen = await alleInschrijvingen();
  const bytes = await maakLogboek(inschrijvingen);

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="${logboekNaam()}"`,
      "cache-control": "no-store",
      // Zodat de wachter weet hoeveel er in zit zonder het bestand te openen.
      "x-aantal-inschrijvingen": String(inschrijvingen.length),
    },
  });
}
