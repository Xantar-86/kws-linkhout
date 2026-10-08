import { NextRequest, NextResponse } from "next/server";
import { logboekNaam, maakLogboek } from "@/lib/voetbalkamp/logboek";
import { alleInschrijvingen } from "@/lib/voetbalkamp/opslag";
import { magBinnen } from "@/lib/voetbalkamp/toegang";

/** Het Excel-bestand met de inschrijvingen, voor de knop op het overzicht. */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (!magBinnen(request)) return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  const bytes = await maakLogboek(await alleInschrijvingen());
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="${encodeURIComponent(logboekNaam())}"`,
      "cache-control": "no-store",
    },
  });
}
