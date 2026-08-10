/**
 * Penseelvormen als SVG-data-URI's.
 *
 * Satori kan geen filters of textuur renderen, maar wel een <img> met een
 * data-URI. Zo krijgen we de geschilderde vlakken uit het clubsjabloon toch in
 * de gegenereerde afbeelding.
 *
 * Alles is deterministisch: dezelfde invoer geeft altijd exact dezelfde vorm,
 * zodat de afbeelding cachebaar blijft.
 */

/** Kleine deterministische generator (mulberry32), zodat vormen reproduceerbaar zijn. */
function ruis(seed: number): () => number {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function naarDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * Een geschilderd vlak: een rechthoek met rafelige, met de kwast gezette randen.
 * Gebruikt achter de clublogo's en de score.
 */
export function penseelVlak(opts: {
  breedte: number;
  hoogte: number;
  kleur: string;
  seed?: number;
}): string {
  const { breedte: b, hoogte: h, kleur } = opts;
  const r = ruis(opts.seed ?? 7);

  // Marge waarbinnen de rand mag uitslaan.
  const m = Math.min(b, h) * 0.07;
  const punten: string[] = [];

  const randPunten = (
    van: [number, number],
    naar: [number, number],
    aantal: number,
    normaal: [number, number]
  ) => {
    for (let i = 1; i <= aantal; i++) {
      const t = i / aantal;
      const x = van[0] + (naar[0] - van[0]) * t;
      const y = van[1] + (naar[1] - van[1]) * t;
      const uitslag = (r() - 0.35) * m;
      punten.push(`${(x + normaal[0] * uitslag).toFixed(1)},${(y + normaal[1] * uitslag).toFixed(1)}`);
    }
  };

  randPunten([m, m], [b - m, m], 9, [0, -1]);
  randPunten([b - m, m], [b - m, h - m], 6, [1, 0]);
  randPunten([b - m, h - m], [m, h - m], 9, [0, 1]);
  randPunten([m, h - m], [m, m], 6, [-1, 0]);

  // Losse spatten langs de zijkanten, zoals bij een droge kwast.
  const spatten: string[] = [];
  for (let i = 0; i < 7; i++) {
    const links = i % 2 === 0;
    const cx = links ? m * (0.2 + r() * 0.7) : b - m * (0.2 + r() * 0.7);
    const cy = h * (0.12 + r() * 0.76);
    const rx = m * (0.18 + r() * 0.4);
    const ry = rx * (0.6 + r() * 1.1);
    spatten.push(
      `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${kleur}"/>`
    );
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${b}" height="${h}" viewBox="0 0 ${b} ${h}">
<polygon points="${punten.join(" ")}" fill="${kleur}"/>
${spatten.join("")}
</svg>`;
  return naarDataUri(svg);
}

/**
 * De taps toelopende streep onder de kop, zoals de kwaststreek onder UITSLAG
 * in het clubsjabloon.
 */
export function penseelStreep(opts: {
  breedte: number;
  hoogte: number;
  kleur: string;
}): string {
  const { breedte: b, hoogte: h, kleur } = opts;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${b}" height="${h}" viewBox="0 0 ${b} ${h}">
<path d="M0,${h * 0.62} C${b * 0.18},${h * 0.08} ${b * 0.62},${h * 0.02} ${b},${h * 0.16}
 L${b},${h * 0.52} C${b * 0.6},${h * 0.4} ${b * 0.2},${h * 0.52} 0,${h}
 Z" fill="${kleur}"/>
<ellipse cx="${b * 0.05}" cy="${h * 0.85}" rx="${b * 0.03}" ry="${h * 0.09}" fill="${kleur}"/>
</svg>`;
  return naarDataUri(svg);
}

/**
 * De rode rasterhoek linksboven: een raster van stippen dat naar de rand toe
 * uitdunt, in de stijl van het clubsjabloon.
 */
export function rasterHoek(opts: {
  breedte: number;
  hoogte: number;
  kleur: string;
}): string {
  const { breedte: b, hoogte: h, kleur } = opts;
  const stippen: string[] = [];
  const stap = 13;

  for (let x = 0; x < b; x += stap) {
    for (let y = 0; y < h; y += stap) {
      // Dichtheid neemt af naarmate we van de hoek weglopen.
      const afstand = Math.sqrt((x / b) ** 2 + (y / h) ** 2);
      if (afstand > 1) continue;
      const straal = (1 - afstand) * 4.6;
      if (straal < 0.35) continue;
      stippen.push(
        `<circle cx="${x}" cy="${y}" r="${straal.toFixed(2)}" fill="${kleur}"/>`
      );
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${b}" height="${h}" viewBox="0 0 ${b} ${h}">
<path d="M0,0 L${b * 0.62},0 C${b * 0.3},${h * 0.28} ${b * 0.12},${h * 0.6} 0,${h} Z" fill="${kleur}" opacity="0.92"/>
${stippen.join("")}
</svg>`;
  return naarDataUri(svg);
}

/**
 * Gestileerde veldstrook voor onderaan de affiche. Vervangt de fotostrook uit
 * het clubsjabloon tot dat beeld als bestand beschikbaar is.
 */
export function veldStrook(opts: { breedte: number; hoogte: number }): string {
  const { breedte: b, hoogte: h } = opts;

  // Maaibanen in het gras.
  const banen: string[] = [];
  for (let i = 0; i < 9; i++) {
    const y = h * 0.3 + (i / 9) * h * 0.7;
    const hoogte = (h * 0.7) / 9 + 1;
    banen.push(
      `<rect x="0" y="${y.toFixed(1)}" width="${b}" height="${hoogte.toFixed(1)}" fill="${
        i % 2 === 0 ? "#2f7a34" : "#35883a"
      }"/>`
    );
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${b}" height="${h}" viewBox="0 0 ${b} ${h}">
<defs>
  <linearGradient id="lucht" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#c9b8a4"/>
    <stop offset="0.55" stop-color="#e2c9a6"/>
    <stop offset="1" stop-color="#7f9f6a"/>
  </linearGradient>
</defs>
<rect width="${b}" height="${h * 0.32}" fill="url(#lucht)"/>
<g>${banen.join("")}</g>

<!-- Bomenrand -->
<path d="M0,${h * 0.3} Q${b * 0.08},${h * 0.16} ${b * 0.17},${h * 0.29}
 Q${b * 0.25},${h * 0.14} ${b * 0.34},${h * 0.3}
 Q${b * 0.43},${h * 0.15} ${b * 0.52},${h * 0.29}
 Q${b * 0.61},${h * 0.17} ${b * 0.7},${h * 0.3}
 L${b},${h * 0.3} L${b},${h * 0.34} L0,${h * 0.34} Z" fill="#25451f" opacity="0.85"/>

<!-- Doel -->
<g stroke="#f4f1ec" stroke-width="3" fill="none" opacity="0.9">
  <rect x="${b * 0.4}" y="${h * 0.3}" width="${b * 0.2}" height="${h * 0.12}"/>
</g>

<!-- Belijning -->
<g stroke="#f4f1ec" stroke-width="4" fill="none" opacity="0.75">
  <path d="M0,${h * 0.62} L${b},${h * 0.56}"/>
  <ellipse cx="${b * 0.5}" cy="${h * 0.95}" rx="${b * 0.3}" ry="${h * 0.22}"/>
</g>

<!-- Tribune -->
<g>
  <rect x="${b * 0.72}" y="${h * 0.33}" width="${b * 0.26}" height="${h * 0.2}" fill="#f0ece5"/>
  <rect x="${b * 0.72}" y="${h * 0.31}" width="${b * 0.26}" height="${h * 0.045}" fill="#a51f1f"/>
  <g fill="#c62b2b">
    <rect x="${b * 0.745}" y="${h * 0.40}" width="${b * 0.05}" height="${h * 0.1}"/>
    <rect x="${b * 0.81}" y="${h * 0.40}" width="${b * 0.05}" height="${h * 0.1}"/>
    <rect x="${b * 0.875}" y="${h * 0.40}" width="${b * 0.05}" height="${h * 0.1}"/>
  </g>
</g>
</svg>`;
  return naarDataUri(svg);
}
