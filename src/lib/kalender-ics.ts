import type { WedstrijdEvent } from "@/types";

/**
 * Bouwt een agendabestand van de wedstrijden van één ploeg.
 *
 * We maken die zelf uit de KBVB-gegevens in plaats van naar een feed van
 * derden te wijzen. Zo werkt het voor elke ploeg, staat er hetzelfde in als
 * op de site, en blijft het werken wanneer zo'n externe feed verdwijnt.
 *
 * Wie zich abonneert in plaats van eenmalig te importeren, ziet een
 * verplaatste wedstrijd vanzelf mee verschuiven.
 */

/** Twee uur per wedstrijd; ruim genoeg voor de match en de nabespreking. */
const DUUR_MINUTEN = 120;

/** Regels langer dan 75 tekens moeten gevouwen worden, anders keurt het af. */
function vouw(regel: string): string {
  if (regel.length <= 74) return regel;
  const delen: string[] = [regel.slice(0, 74)];
  let rest = regel.slice(74);
  while (rest.length > 73) {
    delen.push(` ${rest.slice(0, 73)}`);
    rest = rest.slice(73);
  }
  if (rest) delen.push(` ${rest}`);
  return delen.join("\r\n");
}

/** Puntkomma's, komma's en backslashes hebben in een agendabestand betekenis. */
function ontsnap(tekst: string): string {
  return tekst
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** "20260816T110000Z", de vorm die een agenda verwacht. */
function alsUtc(datum: Date): string {
  return `${datum.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

export function bouwIcs(opts: {
  naam: string;
  wedstrijden: WedstrijdEvent[];
  /** Domein van de site, voor unieke verwijzingen per wedstrijd. */
  domein: string;
}): string {
  const nu = alsUtc(new Date());

  const regels: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//K.W.S. Linkhout//Wedstrijdkalender//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${ontsnap(opts.naam)}`,
    "X-WR-TIMEZONE:Europe/Brussels",
    // Vraag agenda's om een paar keer per dag te kijken of er iets wijzigde.
    "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
    "X-PUBLISHED-TTL:PT6H",
  ];

  for (const wedstrijd of opts.wedstrijden) {
    const start = wedstrijd.start;
    const einde = new Date(start.getTime() + DUUR_MINUTEN * 60_000);

    // Een vaste verwijzing per wedstrijd, zodat een verplaatsing de bestaande
    // afspraak verzet in plaats van er een tweede bij te zetten.
    const kern = `${start.toISOString().slice(0, 10)}-${wedstrijd.summary}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const omschrijving = [wedstrijd.reeks, wedstrijd.description]
      .filter(Boolean)
      .join(" - ");

    regels.push(
      "BEGIN:VEVENT",
      `UID:${kern}@${opts.domein}`,
      `DTSTAMP:${nu}`,
      `DTSTART:${alsUtc(start)}`,
      `DTEND:${alsUtc(einde)}`,
      vouw(`SUMMARY:${ontsnap(wedstrijd.summary)}`),
      ...(wedstrijd.location ? [vouw(`LOCATION:${ontsnap(wedstrijd.location)}`)] : []),
      ...(omschrijving ? [vouw(`DESCRIPTION:${ontsnap(omschrijving)}`)] : []),
      "END:VEVENT"
    );
  }

  regels.push("END:VCALENDAR");
  return `${regels.join("\r\n")}\r\n`;
}
