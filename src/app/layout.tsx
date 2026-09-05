import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";
import { SiteOmlijsting } from "@/components/layout/SiteOmlijsting";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CacheBuster } from "@/components/CacheBuster";
import { BewegingProvider } from "@/components/beweging/BewegingProvider";
import { Opening } from "@/components/beweging/Opening";
import { Cursor } from "@/components/beweging/Cursor";
import { Voortgang } from "@/components/beweging/Voortgang";
import { Analytics } from "@vercel/analytics/next";

// Inter voor de lopende tekst: rustig, en op kleine maten beter leesbaar dan
// om het even welk lettertype met karakter.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Archivo voor de koppen. Smaller en zwaarder dan Inter, met een stevige
// bovenlijn: het soort letter dat op een clubshirt of een affiche thuishoort.
// Het verschil tussen kop en tekst is wat een pagina ontworpen laat lijken in
// plaats van getypt.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Altijd het canonieke domein gebruiken: VERCEL_URL is per-deploy een
// wisselende *.vercel.app-URL, wat preview-afbeeldingen bij gedeelde links breekt.
const baseUrl = "https://www.kwslinkhout.be";

export const metadata: Metadata = {
  title: "KWS Linkhout - Voetbalclub",
  description: "KWS Linkhout - Een club met een hart. 25 ploegen, 300+ leden. Van U6 tot senioren.",
  metadataBase: new URL(baseUrl),
  icons: {
    icon: [
      { url: "/images/favicon-kws-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-kws.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/images/apple-touch-icon.png",
    shortcut: "/images/favicon-kws.png",
  },
  other: {
    'view-transition': 'same-origin',
  },
  openGraph: {
    title: "KWS Linkhout - Voetbalclub",
    description: "KWS Linkhout - Een club met een hart. 25 ploegen, 300+ leden. Van U6 tot senioren.",
    images: [{ url: "https://www.kwslinkhout.be/images/logo-kws.jpg" }],
    locale: "nl_BE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "KWS Linkhout - Voetbalclub",
    description: "KWS Linkhout - Een club met een hart. 25 ploegen, 300+ leden.",
    images: ["https://www.kwslinkhout.be/images/logo-kws.jpg"],
  },
};

/**
 * Beslist of het openingsdoek mag spelen, en dat vóór de browser iets tekent.
 *
 * Dit moet een gewoon scriptje zijn en geen React-component. React komt pas
 * aan bod nadat de pagina op het scherm staat, en tegen dan is het te laat:
 * het doek hoort er al te zijn vanaf het eerste beeldje, of helemaal niet.
 *
 * Het zet `data-opening="over"` op het html-element in vier gevallen: de
 * bezoeker heeft de opening deze sessie al gezien, hij staat niet op de
 * startpagina, hij vroeg om minder beweging, of er ging iets mis. De CSS
 * verbergt het doek dan meteen. Dat laatste geval is met opzet zo geschreven:
 * loopt dit script ergens vast, dan is het doek weg in plaats van dat het
 * blijft liggen.
 *
 * Zodra de opening wél speelt, ruimt het script haar ook op: na 1,6 seconde,
 * of eerder bij de eerste toets of klik. Wie meteen door wil, hoeft niet te
 * wachten.
 */
const openingsScript = `
(function () {
  var wortel = document.documentElement;
  var over = function () { wortel.setAttribute("data-opening", "over"); };
  try {
    var alGezien = sessionStorage.getItem("kws-opening");
    var opStartpagina = location.pathname === "/";
    var minderBeweging = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alGezien || !opStartpagina || minderBeweging) { over(); return; }

    sessionStorage.setItem("kws-opening", "1");
    setTimeout(over, 1600);
    window.addEventListener("keydown", over, { once: true });
    window.addEventListener("pointerdown", over, { once: true });
  } catch (e) {
    over();
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl-BE" className={`${inter.variable} ${archivo.variable}`}>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        {/* Moet vóór het doek staan, anders is het doek al getekend tegen dat
            het script beslist dat het weg mag. */}
        <script dangerouslySetInnerHTML={{ __html: openingsScript }} />
        <Opening />

        <CacheBuster />
        <ScrollToTop />

        <BewegingProvider>
          {/* Twee lagen die over de hele site heen liggen: de voortgangslijn
              boven aan het scherm en de ring rond de muisaanwijzer. Allebei
              zonder klikvlak, allebei verborgen voor schermlezers. */}
          <Voortgang />
          <Cursor />

          <SiteOmlijsting>{children}</SiteOmlijsting>
        </BewegingProvider>

        {/* Telt paginaweergaven. De cijfers staan bij het project op Vercel,
            onder Analytics; er wordt niets van de bezoeker zelf bewaard. */}
        <Analytics />
      </body>
    </html>
  );
}
