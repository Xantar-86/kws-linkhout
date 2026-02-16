const PDFParser = require('pdf2json');
const fs = require('fs');
const path = require('path');

const PDF_PATH = path.join(__dirname, '../public/docs/nieuws/nieuwsbrief.pdf');

const pdfParser = new PDFParser();

pdfParser.on('pdfParser_dataError', errData => {
  console.error('Error:', errData.parserError);
});

pdfParser.on('pdfParser_dataReady', pdfData => {
  console.log('=== PDF TEXT CONTENT ===\n');
  
  // Extract text from all pages
  let fullText = '';
  pdfData.Pages.forEach((page, index) => {
    console.log(`\n--- Page ${index + 1} ---\n`);
    
    page.Texts.forEach(textItem => {
      const text = decodeURIComponent(textItem.R[0].T);
      process.stdout.write(text + ' ');
    });
    console.log('\n');
  });
  
  console.log('\n=== END OF CONTENT ===');
});

pdfParser.loadPDF(PDF_PATH);
