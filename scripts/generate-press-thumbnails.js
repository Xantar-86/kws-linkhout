const fs = require("fs");
const path = require("path");

const PDF_DIR = path.join(__dirname, "../public/docs/pers");

// Parse date from filename
function parseDateFromFilename(filename) {
  // Pattern 1: DDMMYYYY (e.g., 06122018)
  let match = filename.match(/(\d{2})(\d{2})(\d{4})/);
  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const year = parseInt(match[3]);
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2010 && year <= 2030) {
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
  }
  
  // Pattern 2: DD-MM-YY or D-M-YY or DD-M-YYYY
  match = filename.match(/(\d{1,2})[\-\.](\d{1,2})[\-\.](\d{2,4})/);
  if (match) {
    let day = parseInt(match[1]);
    let month = parseInt(match[2]);
    let year = parseInt(match[3]);
    if (year < 100) year += 2000;
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2010 && year <= 2030) {
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
  }
  
  return null;
}

function parseSourceFromFilename(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes("hbvl") || lower.includes("het belang") || lower.includes("belang-van-limburg")) {
    return "Het Belang van Limburg";
  }
  if (lower.includes("hln") || lower.includes("het laatste nieuws") || lower.includes("laatste nieuws")) {
    return "Het Laatste Nieuws";
  }
  if (lower.includes("gva") || lower.includes("gazet van antwerpen")) {
    return "Gazet van Antwerpen";
  }
  return "Krantenartikel";
}

function parseTitleFromFilename(filename) {
  let title = filename.replace(/\.pdf$/i, "");
  
  // Remove common prefixes
  title = title.replace(/^Art\s*/i, "");
  title = title.replace(/^Artikel[-\s]*/i, "");
  title = title.replace(/^Tekst\s+artikel\s*/i, "");
  
  // Remove date patterns
  title = title.replace(/\d{2}\d{2}\d{4}/, "");
  title = title.replace(/\d{1,2}[\-\.]\d{1,2}[\-\.]\d{2,4}/, "");
  
  // Clean up
  title = title.replace(/[-_]/g, " ");
  title = title.replace(/\s+/g, " ");
  title = title.trim();
  title = title.replace(/�/g, "ë");
  
  // Clean up specific patterns
  title = title.replace(/HBvL\s*/gi, "");
  title = title.replace(/Het Belang van Limburg\s*/gi, "");
  title = title.replace(/Het Laatste Nieuws\s*/gi, "");
  title = title.replace(/digitaal\s*/gi, "");
  title = title.replace(/\s*\(\d+\)\s*$/g, ""); // Remove (1), (2) etc. at end
  
  return title.trim();
}

function main() {
  const files = fs.readdirSync(PDF_DIR)
    .filter(f => f.toLowerCase().endsWith(".pdf"))
    .filter(f => !f.includes("(1)")); // Skip duplicates
  
  console.log(`Found ${files.length} PDF files`);
  
  const articles = [];
  
  for (const file of files) {
    const pdfPath = path.join(PDF_DIR, file);
    
    const date = parseDateFromFilename(file);
    const source = parseSourceFromFilename(file);
    let title = parseTitleFromFilename(file);
    
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);
    
    articles.push({
      id: "", // Will be assigned after sorting
      title: title,
      source: source,
      sourceLogo: "/images/press/hbvl-logo.png",
      date: date || "2015-01-01",
      url: `/docs/pers/${file}`,
      thumbnail: null,
      summary: `Krantenartikel uit ${source}${date ? ' van ' + date : ''}.`
    });
  }
  
  // Sort by date (newest first)
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Assign IDs after sorting
  articles.forEach((article, index) => {
    article.id = (index + 1).toString();
  });
  
  // Generate TypeScript content
  const tsContent = `export interface PressArticle {
  id: string;
  title: string;
  source: string;
  sourceLogo: string;
  date: string;
  url: string;
  thumbnail: string | null;
  summary: string;
}

export const pressArticles: PressArticle[] = ${JSON.stringify(articles, null, 2)};

export const getRecentPressArticles = (limit: number = 5): PressArticle[] => {
  return [...pressArticles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};
`;
  
  fs.writeFileSync(path.join(__dirname, "../src/lib/press.ts"), tsContent);
  
  console.log("✅ Done!");
  console.log(`Generated ${articles.length} articles`);
  console.log(`Data saved to: src/lib/press.ts`);
}

main();
