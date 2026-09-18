import { NextResponse } from "next/server";
import { EVENEMENT } from "@/lib/mosselfeest/kaart";
import { alleInschrijvingen, telOp } from "@/lib/mosselfeest/opslag";

/**
 * Hoeveel plaatsen er per zitting nog vrij zijn.
 *
 * Openbaar, want het formulier moet dit tonen voor er iemand aan het invullen
 * begint. Er gaat hier dus met opzet niets persoonlijks over de lijn: enkel per
 * zitting het maximum, het bezette aantal en wat er nog vrij is.
 *
 * De maxima staan op de kaart (200, 200, 175 en 175). Een dessert telt niet
 * mee als plaats; zie teltAlsPlaats in kaart.ts.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  try {
    const totalen = telOp(await alleInschrijvingen());
    return NextResponse.json(
      {
        zittingen: EVENEMENT.zittingen.map((z) => {
          const cijfers = totalen.perZitting[z.id];
          return {
            id: z.id,
            max: z.max ?? null,
            bezet: cijfers?.plaatsen ?? 0,
            vrij: cijfers?.vrij ?? null,
            volzet: z.max !== undefined && (cijfers?.plaatsen ?? 0) >= z.max,
          };
        }),
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (fout) {
    console.error("[mosselfeest] plaatsen opvragen mislukt:", fout);
    // Liever geen cijfers dan een formulier dat niet opent: het formulier
    // toont dan gewoon geen vrije plaatsen en de server kijkt bij het
    // versturen nog een keer na.
    return NextResponse.json({ zittingen: [] }, { status: 200 });
  }
}
