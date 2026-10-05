/**
 * Maakt het huishoudelijk reglement als Word-document en pdf, uit de tekst
 * die op de site staat.
 *
 * De tekst in src/lib/clubinfo.ts is de enige bron: wat daar staat, staat op
 * de pagina én in het bestand dat je kan downloaden. Vroeger was de pdf een
 * afdruk van de oude website uit 2022 en liep hij achter op de site.
 *
 * De docx wordt hier gebouwd; de pdf maakt Word ervan (via PowerShell), want
 * dat staat op deze pc en LibreOffice niet.
 *
 * Draaien: node scripts/maak-reglement.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

const BRON = "src/lib/clubinfo.ts";
const DOCX = "public/Docs/huishoudelijk reglement.docx";
const PDF = "public/Docs/Huishoudelijk-Reglement.pdf";
const LOGO = "public/images/logo-kws.png";

/** De tekst van het reglement, zoals hij in clubinfo.ts staat. */
function leesTekst() {
  const bron = readFileSync(BRON, "utf8");
  const vanaf = bron.indexOf('slug: "huishoudelijk-reglement"');
  const start = bron.indexOf("content: `", vanaf) + "content: `".length;
  const einde = bron.indexOf("`", start);
  return bron.slice(start, einde).replace(/\\'/g, "'");
}

const ROOD = "B91C1C";
const GRIJS = "64748B";

/** "**Vet:** rest" of "**Alles vet**" naar runs. */
function runs(tekst, extra = {}) {
  const delen = tekst.split(/(\*\*[^*]+\*\*)/).filter(Boolean);
  return delen.map((deel) => {
    const vet = deel.startsWith("**") && deel.endsWith("**");
    return new TextRun({ text: vet ? deel.slice(2, -2) : deel, bold: vet || undefined, ...extra });
  });
}

function bouw(tekst) {
  const regels = tekst.split("\n");
  const alineas = [];
  let eersteKop = true;
  // Een gewone alinea die op een genummerd punt volgt (zoals de uitleg onder
  // 1.7) springt mee in, zodat hij bij dat punt hoort. Een kop of een alinea
  // met een vette aanhef ("NOTA 1:") zet dat weer af.
  let naPunt = false;

  for (const ruw of regels) {
    const regel = ruw.replace(/\s+$/, "");
    if (!regel.trim()) continue;

    if (regel === "---") {
      naPunt = false;
      alineas.push(
        new Paragraph({
          spacing: { before: 360, after: 120 },
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: "CBD5E1", space: 1 } },
        }),
      );
      continue;
    }

    // "**1. Algemene voorwaarden**": een kop. De allereerste is de titel.
    const kop = regel.match(/^\*\*(.+)\*\*$/);
    if (kop) {
      naPunt = false;
      if (eersteKop) {
        eersteKop = false;
        alineas.push(
          new Paragraph({
            heading: HeadingLevel.TITLE,
            spacing: { before: 240, after: 120 },
            children: [new TextRun({ text: "Huishoudelijk reglement jeugd", color: ROOD })],
          }),
          new Paragraph({
            spacing: { after: 360 },
            children: [new TextRun({ text: "KWS Linkhout", size: 28, color: GRIJS })],
          }),
        );
        continue;
      }
      // Hoofdstuk ("1. Algemene voorwaarden") of tussenkop ("TRAINING").
      const hoofdstuk = /^\d+\.\s/.test(kop[1]);
      alineas.push(
        new Paragraph({
          heading: hoofdstuk ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
          spacing: { before: hoofdstuk ? 360 : 240, after: 120 },
          keepNext: true,
          children: [new TextRun({ text: kop[1], color: hoofdstuk ? ROOD : "0F172A" })],
        }),
      );
      continue;
    }

    // "  * item": tweede niveau; "- item": eerste niveau.
    const sub = regel.match(/^\s+\*\s+(.*)$/);
    if (sub) {
      alineas.push(
        new Paragraph({ numbering: { reference: "bol", level: 1 }, spacing: { after: 40 }, children: runs(sub[1]) }),
      );
      continue;
    }
    const bol = regel.match(/^-\s+(.*)$/);
    if (bol) {
      alineas.push(
        new Paragraph({ numbering: { reference: "bol", level: 0 }, spacing: { after: 40 }, children: runs(bol[1]) }),
      );
      continue;
    }

    // "1.5 Tekst": het nummer in het rood, de tekst erachter; blijft bij
    // elkaar als het over een pagina loopt.
    const punt = regel.match(/^(\d+\.\d+)\s+(.*)$/);
    if (punt) {
      naPunt = true;
      alineas.push(
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 720, hanging: 720 },
          children: [new TextRun({ text: punt[1] + "\t", bold: true, color: ROOD }), ...runs(punt[2])],
        }),
      );
      continue;
    }

    // "A. Tekst": de uitzonderingen.
    const letter = regel.match(/^([A-C]\.)\s+(.*)$/);
    if (letter) {
      naPunt = true;
      alineas.push(
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 720, hanging: 720 },
          children: [new TextRun({ text: letter[1] + "\t", bold: true }), ...runs(letter[2])],
        }),
      );
      continue;
    }

    if (regel.startsWith("**")) naPunt = false;
    alineas.push(
      new Paragraph({
        spacing: { after: 120 },
        ...(naPunt ? { indent: { left: 720 } } : {}),
        children: runs(regel),
      }),
    );
  }
  return alineas;
}

const logo = new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { after: 120 },
  children: [new ImageRun({ type: "png", data: readFileSync(LOGO), transformation: { width: 64, height: 64 } })],
});

const document = new Document({
  creator: "KWS Linkhout",
  title: "Huishoudelijk reglement jeugd KWS Linkhout",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", run: { size: 44, bold: true, font: "Calibri" } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, font: "Calibri" } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 22, bold: true, font: "Calibri", allCaps: true } },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bol",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1620, hanging: 360 } } } },
        ],
      },
    ],
  },
  sections: [
    {
      properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
      children: [logo, ...bouw(leesTekst())],
    },
  ],
});

const buffer = await Packer.toBuffer(document);
writeFileSync(DOCX, buffer);
console.log(`geschreven: ${DOCX}`);

// Word maakt er de pdf van. PowerShell en Word zitten op deze pc.
const naarWindows = (p) => resolve(p).replace(/\//g, "\\");
const ps = `
$w = New-Object -ComObject Word.Application
$w.Visible = $false
$d = $w.Documents.Open('${naarWindows(DOCX)}', $false, $true)
$d.ExportAsFixedFormat('${naarWindows(PDF)}', 17)
Write-Output ("pagina's: " + $d.ComputeStatistics(2))
$d.Close($false)
$w.Quit()
`;
const uit = spawnSync("powershell", ["-NoProfile", "-Command", ps], { encoding: "utf8" });
if (uit.status !== 0) {
  console.error(uit.stderr || uit.stdout);
  process.exit(1);
}
console.log(`geschreven: ${PDF} (${uit.stdout.trim()})`);
