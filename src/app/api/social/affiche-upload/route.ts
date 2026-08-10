import { NextRequest, NextResponse } from "next/server";
import { getPloeg } from "@/lib/social/ploegen";
import { bouwMatchday } from "@/lib/social/matchday";
import { bouwUitslag } from "@/lib/social/uitslag";
import { bewaarAffiche, haalAffiche } from "@/lib/social/opslag";

/**
 * Ontvangt een affiche die in ChatGPT gemaakt is.
 *
 * Wordt aangeroepen door de mappenwachter op de pc, of door het sleepveld op
 * de opdrachtpagina. De aftraptijd wordt hier zelf opgezocht, zodat de
 * afzender alleen de ploeg en het soort hoeft door te geven.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Maximaal 15 MB; ruim genoeg voor een affiche uit ChatGPT. */
const MAX_BYTES = 15_728_640;

export async function POST(request: NextRequest) {
  const sleutel = process.env.MATCHDAY_SLEUTEL;
  if (!sleutel) {
    return NextResponse.json(
      { error: "MATCHDAY_SLEUTEL ontbreekt op de server" },
      { status: 500 }
    );
  }
  if (request.headers.get("authorization") !== `Bearer ${sleutel}`) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const ploegSlug = String(form.get("ploeg") ?? "");
  const gevraagdSoort = String(form.get("soort") ?? "auto");
  const bestand = form.get("bestand");

  const ploeg = getPloeg(ploegSlug);
  if (!ploeg) {
    return NextResponse.json({ error: `Onbekende ploeg: ${ploegSlug}` }, { status: 400 });
  }
  if (!(bestand instanceof Blob)) {
    return NextResponse.json({ error: "Geen bestand meegestuurd" }, { status: 400 });
  }
  if (bestand.size > MAX_BYTES) {
    return NextResponse.json({ error: "Het bestand is te groot" }, { status: 413 });
  }

  const mime = bestand.type || "image/png";
  if (!["image/png", "image/jpeg", "image/webp"].includes(mime)) {
    return NextResponse.json(
      { error: `Onverwacht bestandstype: ${mime}` },
      { status: 415 }
    );
  }

  // De wedstrijd waar dit beeld bij hoort, opzoeken in de kalender.
  //
  // Met soort "auto" (wat de mappenwachter stuurt) kiezen we zelf: staat er een
  // recente uitslag zonder beeld, dan is dat het; anders de komende wedstrijd.
  // Zo hoeft er op de pc maar één map per ploeg te bestaan.
  let soort: "wedstrijd" | "uitslag";
  let aftrapIso: string | null = null;

  if (gevraagdSoort === "uitslag") {
    soort = "uitslag";
    aftrapIso = (await bouwUitslag(ploeg, 7))?.aftrapIso ?? null;
  } else if (gevraagdSoort === "wedstrijd") {
    soort = "wedstrijd";
    aftrapIso = (await bouwMatchday(ploeg, 10))?.aftrapIso ?? null;
  } else {
    const uitslag = await bouwUitslag(ploeg, 4);
    const uitslagKlaar = uitslag
      ? await haalAffiche({
          ploegSlug: ploeg.slug,
          soort: "uitslag",
          aftrapIso: uitslag.aftrapIso,
        })
      : null;

    if (uitslag && !uitslagKlaar) {
      soort = "uitslag";
      aftrapIso = uitslag.aftrapIso;
    } else {
      soort = "wedstrijd";
      aftrapIso = (await bouwMatchday(ploeg, 10))?.aftrapIso ?? null;
    }
  }

  if (!aftrapIso) {
    return NextResponse.json(
      { error: `Geen ${soort} gevonden voor ${ploeg.naam} om dit beeld aan te koppelen` },
      { status: 404 }
    );
  }

  const resultaat = await bewaarAffiche({
    ploegSlug: ploeg.slug,
    soort,
    aftrapIso,
    bytes: Buffer.from(await bestand.arrayBuffer()),
    mime,
  });

  if (!resultaat.ok) {
    return NextResponse.json({ error: resultaat.fout }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    ploeg: ploeg.naam,
    soort,
    url: resultaat.url,
  });
}
