import ExcelJS from "exceljs";
import { KAMP, mededeling, telOp, type KampInschrijving } from "./kamp";

/**
 * Het Excel-bestand met de inschrijvingen voor het voetbalkamp.
 *
 * Eén blad, één regel per speler. Wie betaald heeft, staat in het groen; wie
 * nog moet betalen in het rood, zodat opvolgen simpel blijft. Bovenaan een
 * totaalregel die met de filter meerekent.
 *
 * Het bestand wordt telkens opnieuw gemaakt. Betaald afvinken hoort op het
 * overzicht, niet in Excel.
 */

const ROOD = "FFB91C1C";
const ZAND = "FFF4F1EC";
const WIT = "FFFFFFFF";
const LICHTGROEN = "FFDCFCE7";
const LICHTROOD = "FFFEE2E2";

export async function maakLogboek(lijst: KampInschrijving[]): Promise<Buffer> {
  const boek = new ExcelJS.Workbook();
  boek.creator = "kwslinkhout.be";
  boek.created = new Date();

  const blad = boek.addWorksheet("Inschrijvingen", { views: [{ state: "frozen", ySplit: 3 }] });

  const kolommen: { kop: string; breed: number }[] = [
    { kop: "Nr.", breed: 7 },
    { kop: "Ingeschreven op", breed: 17 },
    { kop: "Voornaam", breed: 16 },
    { kop: "Familienaam", breed: 18 },
    { kop: "Geboortedatum", breed: 14 },
    { kop: "Categorie", breed: 11 },
    { kop: "Lid", breed: 7 },
    { kop: "Ouder", breed: 22 },
    { kop: "E-mail", breed: 30 },
    { kop: "Gsm", breed: 15 },
    { kop: "Opmerking", breed: 40 },
    { kop: "Bedrag", breed: 10 },
    { kop: "Betaald", breed: 9 },
    { kop: "Betaald op", breed: 17 },
    { kop: "Mededeling", breed: 34 },
  ];
  blad.columns = kolommen.map((k) => ({ width: k.breed }));

  const totalen = telOp(lijst);
  blad.getCell("A1").value =
    `${KAMP.naam} ${KAMP.jaar}: ${totalen.inschrijvingen} inschrijvingen, ` +
    `${totalen.betaald} betaald, ${totalen.inschrijvingen - totalen.betaald} nog niet. ` +
    `Bijgewerkt op ${new Date().toLocaleString("nl-BE", { timeZone: "Europe/Brussels" })}.`;
  blad.getCell("A1").font = { bold: true, size: 12 };

  const kopRij = blad.getRow(2);
  kolommen.forEach((k, i) => {
    const cel = kopRij.getCell(i + 1);
    cel.value = k.kop;
    cel.font = { bold: true, color: { argb: WIT } };
    cel.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ROOD } };
    cel.alignment = { vertical: "middle" };
  });
  kopRij.height = 22;

  const eerste = 4;
  const laatste = Math.max(eerste, eerste + lijst.length - 1);
  const totaal = blad.getRow(3);
  totaal.getCell(1).value = "Totaal";
  totaal.getCell(1).font = { bold: true };
  // Aantal zichtbare regels en het bedrag, met de filter mee.
  totaal.getCell(3).value = { formula: `SUBTOTAL(103,C${eerste}:C${laatste})` };
  totaal.getCell(12).value = { formula: `SUBTOTAL(109,L${eerste}:L${laatste})` };
  totaal.getCell(12).numFmt = "#,##0.00";
  totaal.font = { bold: true };
  totaal.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ZAND } };

  const opNummer = [...lijst].sort((a, b) => (a.nummer ?? 0) - (b.nummer ?? 0));
  opNummer.forEach((i, index) => {
    const rij = blad.getRow(eerste + index);
    const bedrag = i.bedrag ?? KAMP.prijs;
    rij.values = [
      i.nummer ?? "",
      new Date(i.aangemeld),
      i.voornaam,
      i.naam,
      i.geboortedatum ? new Date(`${i.geboortedatum}T12:00:00`) : "",
      i.categorie,
      i.lid ? "ja" : "nee",
      i.ouderNaam,
      i.email,
      i.telefoon,
      i.opmerking ?? "",
      bedrag ?? "",
      i.betaald ? "ja" : "nee",
      i.betaaldOp ? new Date(i.betaaldOp) : "",
      mededeling(i),
    ];
    rij.getCell(2).numFmt = "dd/mm/yyyy hh:mm";
    rij.getCell(5).numFmt = "dd/mm/yyyy";
    rij.getCell(12).numFmt = "#,##0.00";
    rij.getCell(14).numFmt = "dd/mm/yyyy hh:mm";
    rij.getCell(11).alignment = { wrapText: true, vertical: "top" };
    const kleur = i.betaald ? LICHTGROEN : LICHTROOD;
    rij.getCell(13).fill = { type: "pattern", pattern: "solid", fgColor: { argb: kleur } };
    rij.getCell(13).alignment = { horizontal: "center" };
    rij.getCell(13).font = { bold: true, color: { argb: i.betaald ? "FF166534" : ROOD } };
  });

  blad.autoFilter = { from: { row: 2, column: 1 }, to: { row: laatste, column: kolommen.length } };

  return Buffer.from(await boek.xlsx.writeBuffer());
}

export function logboekNaam(): string {
  return `${KAMP.naam} ${KAMP.jaar} inschrijvingen.xlsx`;
}
