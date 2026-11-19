import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/supabase";

/**
 * Houdt de database wakker.
 *
 * Supabase pauzeert een gratis project dat een week lang te weinig gebruikt
 * wordt. De club heeft rustige weken (tussen het mosselfeest en het kamp), en
 * dan zou een formulier plots niet meer werken. Daarom vraagt de Vercel-cron
 * (vercel.json) hier elke dag iets kleins op aan elke tabel.
 *
 * Aangeroepen door de Vercel-cron, die CRON_SECRET als Bearer-token meestuurt.
 */

export const dynamic = "force-dynamic";

const TABELLEN = [
  "voetbalkamp_inschrijvingen",
  "mosselfeest_inschrijvingen",
  "mosselfeest_voorraad",
  "wedstrijdbal_bestellingen",
  "toestemming_wachtrij",
  "social_markeringen",
];

export async function GET(request: NextRequest) {
  const geheim = process.env.CRON_SECRET;
  if (!geheim || request.headers.get("authorization") !== `Bearer ${geheim}`) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const fouten: string[] = [];
  for (const tabel of TABELLEN) {
    const { error } = await db().from(tabel).select("*", { count: "exact", head: true });
    if (error) fouten.push(`${tabel}: ${error.message}`);
  }
  if (fouten.length > 0) {
    console.error("[database-wakker] mislukt:", fouten.join("; "));
    return NextResponse.json({ ok: false, fouten }, { status: 500 });
  }
  return NextResponse.json({ ok: true, tabellen: TABELLEN.length });
}
