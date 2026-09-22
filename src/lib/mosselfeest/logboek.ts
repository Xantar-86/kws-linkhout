import ExcelJS from "exceljs";
import { EVENEMENT, GERECHTEN, GROEPEN, aantalPorties, gerechtenVan } from "./kaart";
import { telOp, type Inschrijving } from "./opslag";

/**
 * Het Excel-logboek van het mosselfeest.
 *
 * Twee bladen. "Overzicht" is wat je wil zien om te weten hoeveel van wat er
 * besteld moet worden: de totalen per gerecht, per zitting, en wat er nog
 * openstaat aan betalingen. "Inschrijvingen" is de lijst zelf, één regel per
 * inschrijving, met een kolom per gerecht.
 *
 * Het bestand wordt bij elke aanvraag volledig opnieuw gemaakt uit de
 * inschrijvingen. Zet er dus zelf niets in wat je wil bewaren: je eigen
 * wijzigingen verdwijnen bij de volgende keer dat de wachter het bestand
 * ophaalt. Betaald afvinken doe je op de overzichtspagina, niet in Excel.
 *
 * De totaalregel bovenaan "Inschrijvingen" gebruikt SUBTOTAL, zodat de
 * aantallen meerekenen met de filter: filter je op één zitting, dan zie je
 * meteen hoeveel porties die zitting nodig heeft.
 */

const ROOD = "FFB91C1C";
const ZAND = "FFF4F1EC";
const WIT = "FFFFFFFF";

function kopcel(cel: ExcelJS.Cell, tekst: string): void {
  cel.value = tekst;
  cel.font = { bold: true, color: { argb: WIT }, size: 11 };
  cel.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ROOD } };
  cel.alignment = { vertical: "middle", wrapText: true };
}

function titelcel(cel: ExcelJS.Cell, tekst: string): void {
  cel.value = tekst;
  cel.font = { bold: true, size: 12 };
  cel.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ZAND } };
}

export async function maakLogboek(inschrijvingen: Inschrijving[]): Promise<Buffer> {
  const totalen = telOp(inschrijvingen);
  const boek = new ExcelJS.Workbook();
  boek.creator = "kwslinkhout.be";
  boek.created = new Date();

  // ------------------------------------------------------------------ overzicht
  const o = boek.addWorksheet("Overzicht", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  o.columns = [
    { width: 42 },
    { width: 12 },
    { width: 12 },
    { width: 14 },
  ];

  o.getCell("A1").value = `${EVENEMENT.naam} ${EVENEMENT.jaar}`;
  o.getCell("A1").font = { bold: true, size: 16 };
  o.getCell("A2").value = EVENEMENT.datumTekst;
  o.getCell("A2").font = { color: { argb: "FF6B7280" } };
  o.getCell("A3").value = `Bijgewerkt op ${new Date().toLocaleString("nl-BE", {
    timeZone: "Europe/Brussels",
  })}`;
  o.getCell("A3").font = { color: { argb: "FF6B7280" }, size: 10 };

  let r = 5;
  titelcel(o.getCell(`A${r}`), "In het kort");
  r += 1;
  const bron = totalen.perBron ?? { online: totalen.inschrijvingen, kaart: 0, verzamelpost: 0 };
  const kort: [string, number | string, string?][] = [
    ["Inschrijvingen", totalen.inschrijvingen],
    ["Plaatsen aan tafel", totalen.plaatsen],
    ["   waarvan volwassenen", totalen.volwassenen],
    ["   waarvan kinderen", totalen.kinderen],
    ["   waarvan online ingevuld", bron.online],
    ["   waarvan ingetypte kaarten", bron.kaart],
    ["   waarvan stapels kaarten", bron.verzamelpost],
    ["Porties in totaal", totalen.porties],
    ["Bedrag in totaal", totalen.bedrag, "euro"],
    ["Waarvan betaald", totalen.bedragBetaald, "euro"],
    ["Nog te ontvangen", totalen.bedragOpen, "euro"],
  ];
  for (const [label, waarde, eenheid] of kort) {
    o.getCell(`A${r}`).value = label;
    const cel = o.getCell(`B${r}`);
    cel.value = waarde;
    cel.font = { bold: true };
    if (eenheid === "euro") cel.numFmt = '#,##0.00 "euro"';
    r += 1;
  }

  r += 1;
  titelcel(o.getCell(`A${r}`), "Per zitting");
  r += 1;
  kopcel(o.getCell(`A${r}`), "Zitting");
  kopcel(o.getCell(`B${r}`), "Inschr.");
  kopcel(o.getCell(`C${r}`), "Plaatsen");
  kopcel(o.getCell(`D${r}`), "Nog vrij");
  r += 1;
  for (const zitting of EVENEMENT.zittingen) {
    const cijfers = totalen.perZitting[zitting.id];
    o.getCell(`A${r}`).value = zitting.label;
    o.getCell(`B${r}`).value = cijfers?.inschrijvingen ?? 0;
    o.getCell(`C${r}`).value = zitting.max
      ? `${cijfers?.plaatsen ?? 0} van ${zitting.max}`
      : (cijfers?.plaatsen ?? 0);
    const vrij = cijfers?.vrij ?? null;
    o.getCell(`D${r}`).value = vrij === null ? "afhalen" : vrij;
    if (vrij !== null && vrij <= 10) {
      o.getCell(`D${r}`).font = { bold: true, color: { argb: ROOD } };
    }
    r += 1;
  }

  r += 1;
  titelcel(o.getCell(`A${r}`), "Wat er besteld moet worden");
  r += 1;
  kopcel(o.getCell(`A${r}`), "Gerecht");
  kopcel(o.getCell(`B${r}`), "Aantal");
  kopcel(o.getCell(`C${r}`), "Prijs");
  kopcel(o.getCell(`D${r}`), "Bedrag");
  r += 1;

  for (const groep of GROEPEN) {
    const gerechten = gerechtenVan(groep.id);
    if (gerechten.length === 0) continue;
    o.getCell(`A${r}`).value = groep.titel;
    o.getCell(`A${r}`).font = { bold: true, italic: true, color: { argb: "FF6B7280" } };
    r += 1;
    for (const g of gerechten) {
      const aantal = totalen.perGerecht[g.id] ?? 0;
      o.getCell(`A${r}`).value = `   ${g.naam}`;
      o.getCell(`B${r}`).value = aantal;
      o.getCell(`B${r}`).font = { bold: aantal > 0 };
      o.getCell(`C${r}`).value = g.prijs;
      o.getCell(`C${r}`).numFmt = '#,##0.00';
      o.getCell(`D${r}`).value = { formula: `B${r}*C${r}` };
      o.getCell(`D${r}`).numFmt = '#,##0.00';
      r += 1;
    }
  }

  // ------------------------------------------------------------- inschrijvingen
  const i = boek.addWorksheet("Inschrijvingen", {
    // Kenmerk, datum, bron en naam blijven staan als je naar rechts schuift;
    // anders weet je bij kolom "Portie friet" niet meer over wie het gaat.
    views: [{ state: "frozen", xSplit: 4, ySplit: 2 }],
  });

  const vasteKoppen = ["Nr.", "Datum", "Bron", "Naam", "Voornaam", "E-mail", "Telefoon", "Zitting"];
  const staartKoppen = [
    "Porties",
    "Bedrag",
    "Betaald",
    "Betaald op",
    "Ingevoerd door",
    "Opmerking",
  ];
  // De korte naam waar die er is: twee kolommen "Balletjes (tomatensaus)" naast
  // elkaar zegt niets over welke de kindportie is.
  const koppen = [...vasteKoppen, ...GERECHTEN.map((g) => g.kort ?? g.naam), ...staartKoppen];

  i.columns = koppen.map((kop, index) => {
    const isGerecht = index >= vasteKoppen.length && index < vasteKoppen.length + GERECHTEN.length;
    return { width: isGerecht ? 11 : kop === "Naam" || kop === "E-mail" ? 26 : kop === "Zitting" || kop === "Opmerking" ? 30 : 14 };
  });

  koppen.forEach((kop, index) => kopcel(i.getRow(1).getCell(index + 1), kop));
  i.getRow(1).height = 34;

  // Totaalregel die meerekent met de filter.
  const eersteGegevensRij = 3;
  const laatsteGegevensRij = Math.max(eersteGegevensRij, eersteGegevensRij + inschrijvingen.length - 1);
  const totaalRij = i.getRow(2);
  totaalRij.getCell(1).value = "Totaal";
  totaalRij.getCell(1).font = { bold: true };
  const eersteGerechtKolom = vasteKoppen.length + 1;
  for (let k = 0; k < GERECHTEN.length + 2; k++) {
    // De gerechten, plus de kolommen Porties en Bedrag erachter.
    const kolom = eersteGerechtKolom + k;
    const letter = i.getColumn(kolom).letter;
    const cel = totaalRij.getCell(kolom);
    cel.value = {
      formula: `SUBTOTAL(109,${letter}${eersteGegevensRij}:${letter}${laatsteGegevensRij})`,
    };
    cel.font = { bold: true };
    if (koppen[kolom - 1] === "Bedrag") cel.numFmt = '#,##0.00';
  }
  totaalRij.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ZAND } };

  const zittingLabel = new Map(EVENEMENT.zittingen.map((z) => [z.id, z.label]));

  inschrijvingen.forEach((inschrijving, index) => {
    const rij = i.getRow(eersteGegevensRij + index);
    const bronLabel =
      inschrijving.bron === "kaart"
        ? "kaart"
        : inschrijving.bron === "verzamelpost"
          ? "stapel"
          : "online";
    const waarden = [
      inschrijving.kaartnummer ?? "",
      new Date(inschrijving.aangemeld),
      bronLabel,
      inschrijving.naam,
      inschrijving.voornaam ?? "",
      inschrijving.email ?? "",
      inschrijving.telefoon ?? "",
      zittingLabel.get(inschrijving.zitting) ?? inschrijving.zitting ?? "",
      ...GERECHTEN.map((g) => inschrijving.aantallen[g.id] || 0),
      aantalPorties(inschrijving.aantallen),
      inschrijving.bedrag,
      inschrijving.betaald ? "ja" : "nee",
      inschrijving.betaaldOp ? new Date(inschrijving.betaaldOp) : "",
      inschrijving.ingevoerdDoor ?? "",
      inschrijving.opmerking ?? "",
    ];
    waarden.forEach((waarde, kolom) => {
      rij.getCell(kolom + 1).value = waarde as ExcelJS.CellValue;
    });
    rij.getCell(2).numFmt = "dd/mm/yyyy hh:mm";
    rij.getCell(koppen.indexOf("Betaald op") + 1).numFmt = "dd/mm/yyyy hh:mm";
    rij.getCell(koppen.indexOf("Bedrag") + 1).numFmt = '#,##0.00';

    // Een niet-betaalde inschrijving valt op, zodat opvolgen simpel blijft.
    const betaaldCel = rij.getCell(koppen.indexOf("Betaald") + 1);
    betaaldCel.alignment = { horizontal: "center" };
    if (!inschrijving.betaald) {
      betaaldCel.font = { bold: true, color: { argb: ROOD } };
      betaaldCel.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } };
    } else {
      betaaldCel.font = { color: { argb: "FF166534" } };
    }
  });

  i.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: laatsteGegevensRij, column: koppen.length },
  };

  return Buffer.from(await boek.xlsx.writeBuffer());
}

/** De bestandsnaam van het logboek. Blijft gelijk, zodat het bestand overschreven wordt. */
export function logboekNaam(): string {
  return `Mosselfeest ${EVENEMENT.jaar} inschrijvingen.xlsx`;
}
