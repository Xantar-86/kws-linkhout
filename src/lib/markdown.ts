// Eenvoudige markdown -> HTML parser (zelfde stijl als de nieuws-artikelpagina).
// Ondersteunt: **vet**, *cursief*, ## koppen, [links](url), - lijsten en regelovergangen.
export function parseMarkdown(content: string): string {
  // Verwijder CommonMark "harde regeleinde"-backslashes (regel eindigend op '\').
  // Decap voegt die toe; wij maken sowieso al een regelovergang met <br />.
  let html = content.replace(/\\+(?=\r?\n)/g, "").replace(/\\+$/g, "");
  // Afbeeldingen ![alt](url) - VOOR de link-regex zodat die niet eerst matcht.
  html = html.replace(
    /!\[(.*?)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="my-6 rounded-2xl mx-auto max-w-full h-auto" />'
  );
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(
    /##\s+(.*?)(?=\n|$)/g,
    '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>'
  );
  html = html.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">$1</a>'
  );
  html = html.replace(
    /^-\s+(.*?)(?=\n|$)/gm,
    '<li class="flex items-start gap-2"><span class="text-primary mt-1.5">•</span><span>$1</span></li>'
  );
  html = html.replace(/(<li.*?>.*?<\/li>\n?)+/g, '<ul class="space-y-2 my-4">$&</ul>');
  html = html
    .split("\n")
    .map((line) => {
      if (line.trim().startsWith("<") && !line.includes("</li>")) return line;
      return line + "<br />";
    })
    .join("\n");
  // CommonMark backslash-escapes voor leestekens ontdoen (bv. \# -> #, \. -> .)
  html = html.replace(/\\([#.\-!()[\]_*])/g, "$1");
  return html;
}
