import { NextRequest, NextResponse } from "next/server";
import { stuurSamenvatting } from "@/lib/mosselfeest/mail";
import { alleInschrijvingen } from "@/lib/mosselfeest/opslag";

/**
 * De dagelijkse samenvatting voor de club.
 *
 * Wordt aangeroepen door .github/workflows/mosselfeest-samenvatting.yml, met
 * CRON_SECRET in de kop. Vanaf de overzichtspagina of met de hand kan het ook
 * met MOSSELFEEST_SLEUTEL of het wachtwoord van de organisatoren.
 *
 * Er gaat pas echt iets de deur uit als MOSSELFEEST_SAMENVATTING exact "aan"
 * is. Staat die er niet, dan draait dit als een droge proef: je ziet wat er
 * zou vertrekken en er wordt niets verstuurd. Zo kan de planning uitgetest
 * worden zonder dat er ongewild mail naar de club gaat, en zonder mailtegoed
 * op te branden. Dezelfde aanpak als SOCIAL_LIVE bij de matchday-berichten.
 *
 * Met ?droog=1 forceer je een droge proef, ook als de schakelaar aan staat.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function magBinnen(request: NextRequest): boolean {
  const kop = request.headers.get("authorization") ?? "";
  if (!kop.startsWith("Bearer ")) return false;
  const gegeven = kop.slice(7);
  const toegelaten = [
    process.env.CRON_SECRET,
    process.env.MOSSELFEEST_SLEUTEL,
    process.env.MOSSELFEEST_WACHTWOORD,
  ].filter(Boolean);
  return toegelaten.some((geheim) => geheim === gegeven);
}

export async function GET(request: NextRequest) {
  if (!magBinnen(request)) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const aan = process.env.MOSSELFEEST_SAMENVATTING === "aan";
  const gevraagdDroog = request.nextUrl.searchParams.get("droog") === "1";
  const droog = gevraagdDroog || !aan;

  // Hoeveel uur terug er als "nieuw" geldt. Standaard een etmaal, wat past bij
  // één keer per dag; met ?uren=48 vang je een overgeslagen dag op.
  const uren = Number(request.nextUrl.searchParams.get("uren") ?? "24");
  const sinds = new Date(Date.now() - (Number.isFinite(uren) ? uren : 24) * 60 * 60 * 1000);

  const inschrijvingen = await alleInschrijvingen();
  const resultaat = await stuurSamenvatting({ inschrijvingen, sinds, droog });

  if (!resultaat.ok) {
    console.error("[mosselfeest] samenvatting mislukt:", resultaat.fout);
    return NextResponse.json(
      {
        ok: false,
        fout: resultaat.fout,
        nieuw: resultaat.nieuw,
        totaalInschrijvingen: resultaat.totaalInschrijvingen,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    verstuurd: resultaat.verstuurd,
    droog,
    reden: droog
      ? gevraagdDroog
        ? "droge proef gevraagd"
        : 'MOSSELFEEST_SAMENVATTING staat niet op "aan"'
      : undefined,
    nieuw: resultaat.nieuw,
    totaalInschrijvingen: resultaat.totaalInschrijvingen,
    sinds: sinds.toISOString(),
  });
}
