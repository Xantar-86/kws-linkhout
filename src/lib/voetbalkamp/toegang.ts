import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Wie mag het overzicht van het voetbalkamp zien.
 *
 * Het wachtwoord staat in KAMP_WACHTWOORD, los van dat van het mosselfeest:
 * wie het kamp beheert, hoeft niet in de inschrijvingen van het mosselfeest te
 * kunnen. Staat de variabele er niet, dan komt niemand binnen.
 */

function wachtwoord(): string | undefined {
  return process.env.KAMP_WACHTWOORD || undefined;
}

function zelfdeGeheim(gegeven: string, verwacht: string): boolean {
  const a = Buffer.from(gegeven);
  const b = Buffer.from(verwacht);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function magBinnen(request: NextRequest): boolean {
  const verwacht = wachtwoord();
  if (!verwacht) return false;
  const kop = request.headers.get("authorization") ?? "";
  if (!kop.startsWith("Bearer ")) return false;
  return zelfdeGeheim(kop.slice(7), verwacht);
}
