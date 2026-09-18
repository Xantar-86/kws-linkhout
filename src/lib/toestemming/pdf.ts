import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFArray, PDFDocument, PDFName, PDFRef, StandardFonts, rgb } from "pdf-lib";
import type { PDFForm, PDFImage, PDFPage } from "pdf-lib";
import {
  KANALEN,
  bestandsnaam,
  datumNl,
  spelerTekentMee,
  type Inzending,
} from "./velden";

/**
 * Het ingevulde toestemmingsformulier maken.
 *
 * We vullen het echte clubdocument in, niet een nabouw: het staat als
 * formulier met benoemde velden in public/Docs/gdpr/ en daar zitten vier
 * tekstvakken, acht ja/nee-radiogroepen en drie handtekeningvakken in.
 *
 * Na het invullen vlakken we het document af. Daarna is er geen formulier meer
 * en kan niemand de antwoorden nog aanpassen zonder dat het opvalt, wat voor
 * een toestemming het punt is.
 */

const SJABLOON = path.join(
  process.cwd(),
  "public",
  "Docs",
  "gdpr",
  "Toestemming_Beeldmateriaal_Jeugd_KWS_Linkhout.pdf",
);

/** De drie handtekeningvakken zoals ze in het document heten. */
const HANDTEKENINGVELDEN = {
  ouder1: "Handtekening ouder of voogd 1",
  ouder2: "Handtekening ouder of voogd 2",
  speler: "Handtekening speler",
} as const;

export interface GemaaktFormulier {
  bytes: Uint8Array;
  bestandsnaam: string;
}

export interface Herkomst {
  /** Waar het formulier ingevuld is, voor de bewijsregel onderaan. */
  adres: string;
  /** Het ip-adres van de invuller, als de server dat doorkrijgt. */
  ip?: string;
  /** Kenmerk van de inzending, om mail en bestand aan elkaar te knopen. */
  kenmerk: string;
  /** Tijdstip van ondertekenen. */
  op: Date;
}

/**
 * Een handtekeningveld van het document afhalen en er het getekende beeld in
 * de plaats zetten.
 *
 * pdf-lib kan een handtekeningveld niet met removeField weghalen: zo'n veld
 * heeft geen weergave-stroom en de bibliotheek valt daarover. We zoeken het
 * veld daarom zelf op in de veldenlijst, halen de annotatie van de pagina en
 * schrappen het veld. Wat overblijft is gewoon een beeld op de pagina.
 */
function zetHandtekening(
  pdf: PDFDocument,
  form: PDFForm,
  veldnaam: string,
  beeld: PDFImage | null,
): void {
  const acro = form.acroForm;
  let doel;
  try {
    doel = form.getField(veldnaam).acroField.dict;
  } catch {
    // Veld bestaat niet in dit sjabloon: dan valt er ook niets te vervangen.
    return;
  }

  const paginas = pdf.getPages();
  for (const [acroVeld, ref] of acro.getAllFields()) {
    if (acroVeld.dict !== doel) continue;

    const rechthoek = acroVeld.dict.lookup(PDFName.of("Rect"));
    const r = rechthoek instanceof PDFArray ? rechthoek.asRectangle() : null;
    const pagina = vindPagina(paginas, ref);

    if (beeld && r && pagina) {
      // Binnen het kader blijven en de verhouding van de krabbel bewaren.
      const marge = 3;
      const schaal = Math.min(
        (r.width - marge * 2) / beeld.width,
        (r.height - marge * 2) / beeld.height,
      );
      const breedte = beeld.width * schaal;
      const hoogte = beeld.height * schaal;
      pagina.drawImage(beeld, {
        x: r.x + (r.width - breedte) / 2,
        y: r.y + (r.height - hoogte) / 2,
        width: breedte,
        height: hoogte,
      });
    }

    for (const pg of paginas) pg.node.removeAnnot(ref);
    acro.removeField(acroVeld);
    return;
  }
}

/**
 * De pagina waarop een veld staat, gezocht via de annotatielijst van elke
 * pagina. De handtekeningvakken staan op de laatste pagina, dus die is ook de
 * terugvaloptie.
 */
function vindPagina(paginas: PDFPage[], ref: PDFRef): PDFPage | undefined {
  for (const pagina of paginas) {
    const annots = pagina.node.Annots();
    if (annots && annots.indexOf(ref) !== undefined) return pagina;
  }
  return paginas[paginas.length - 1];
}

/**
 * Loze verwijzingen uit /Annots halen.
 *
 * pdf-lib verwijdert bij het afvlakken van een radiogroep de onderliggende
 * vakjes, maar laat de verwijzing ernaar in de annotatielijst van de pagina
 * staan. Een lezer die de annotaties opvraagt (Acrobat, pdf.js, een
 * mailprogramma met voorbeeldweergave) valt daarover en toont een fout. Daarom
 * kuisen we ze hier zelf op.
 */
function ruimLozeAnnotatiesOp(pdf: PDFDocument): number {
  let opgeruimd = 0;
  for (const pagina of pdf.getPages()) {
    const annots = pagina.node.Annots();
    if (!annots) continue;
    for (let i = annots.size() - 1; i >= 0; i--) {
      const item = annots.get(i);
      if (!(item instanceof PDFRef)) continue;
      if (pdf.context.lookup(item) === undefined) {
        annots.remove(i);
        opgeruimd += 1;
      }
    }
  }
  return opgeruimd;
}

/** Een data-URL van het handtekeningvak naar bytes. */
function pngUitDataUrl(dataUrl: string): Uint8Array {
  const komma = dataUrl.indexOf(",");
  return Uint8Array.from(Buffer.from(dataUrl.slice(komma + 1), "base64"));
}

export async function maakFormulier(
  inzending: Inzending,
  herkomst: Herkomst,
): Promise<GemaaktFormulier> {
  const sjabloon = await readFile(SJABLOON);
  const pdf = await PDFDocument.load(sjabloon);
  const form = pdf.getForm();
  const vandaag = datumNl(herkomst.op);

  // Deel 1: gegevens van de speler.
  form.getTextField("Naam en voornaam speler").setText(inzending.speler.trim());
  form.getTextField("Geboortedatum").setText(datumNl(inzending.geboortedatum));
  form.getTextField("Ploeg").setText(inzending.ploeg.trim());
  form.getTextField("Trainer of afgevaardigde").setText((inzending.afgevaardigde ?? "").trim());

  // Deel 3: de acht kanalen. Elke lijn heeft een uitdrukkelijke keuze.
  for (const kanaal of KANALEN) {
    const keuze = inzending.keuzes[kanaal.id];
    if (keuze !== "Ja" && keuze !== "Nee") continue;
    form.getRadioGroup(kanaal.pdfVeld).select(keuze);
  }

  // Deel 6: namen, datums en de getekende handtekeningen.
  form.getTextField("Naam ouder of voogd 1").setText(inzending.ouder1.naam.trim());
  form.getTextField("Datum ouder of voogd 1").setText(vandaag);

  const heeftOuder2 = Boolean(inzending.ouder2?.handtekening);
  form.getTextField("Naam ouder of voogd 2").setText(heeftOuder2 ? inzending.ouder2!.naam.trim() : "");
  form.getTextField("Datum ouder of voogd 2").setText(heeftOuder2 ? vandaag : "");

  const spelerTekent = spelerTekentMee(inzending.geboortedatum, herkomst.op) && Boolean(inzending.spelerZelf?.handtekening);
  form.getTextField("Naam speler").setText(spelerTekent ? inzending.spelerZelf!.naam.trim() : "");
  form.getTextField("Datum speler").setText(spelerTekent ? vandaag : "");

  const beeldOuder1 = await pdf.embedPng(pngUitDataUrl(inzending.ouder1.handtekening));
  zetHandtekening(pdf, form, HANDTEKENINGVELDEN.ouder1, beeldOuder1);

  if (heeftOuder2) {
    const beeld = await pdf.embedPng(pngUitDataUrl(inzending.ouder2!.handtekening));
    zetHandtekening(pdf, form, HANDTEKENINGVELDEN.ouder2, beeld);
  } else {
    zetHandtekening(pdf, form, HANDTEKENINGVELDEN.ouder2, null);
  }

  if (spelerTekent) {
    const beeld = await pdf.embedPng(pngUitDataUrl(inzending.spelerZelf!.handtekening));
    zetHandtekening(pdf, form, HANDTEKENINGVELDEN.speler, beeld);
  } else {
    zetHandtekening(pdf, form, HANDTEKENINGVELDEN.speler, null);
  }

  // Bewijsregel: wanneer, waar en van welk toestel de toestemming kwam. Dat is
  // wat de club moet kunnen aantonen als iemand later vraagt hoe de
  // toestemming gegeven is.
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const paginas = pdf.getPages();
  const laatste = paginas[paginas.length - 1];
  const tijd = new Intl.DateTimeFormat("nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Brussels",
  }).format(herkomst.op);
  const regel =
    `Digitaal ingevuld en ondertekend via ${herkomst.adres} op ${vandaag} om ${tijd}` +
    (herkomst.ip ? ` vanaf ${herkomst.ip}` : "") +
    ` | kenmerk ${herkomst.kenmerk}`;
  laatste.drawText(regel, {
    x: 40,
    y: 22,
    size: 6.5,
    font,
    color: rgb(0.42, 0.45, 0.5),
  });

  form.flatten();
  ruimLozeAnnotatiesOp(pdf);

  return {
    bytes: await pdf.save(),
    bestandsnaam: bestandsnaam(inzending.speler, inzending.ploeg),
  };
}
