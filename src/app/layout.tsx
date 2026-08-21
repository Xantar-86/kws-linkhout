import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteOmlijsting } from "@/components/layout/SiteOmlijsting";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CacheBuster } from "@/components/CacheBuster";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl-BE" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <CacheBuster />
        <ScrollToTop />
        <SiteOmlijsting>{children}</SiteOmlijsting>
        {/* Telt paginaweergaven. De cijfers staan bij het project op Vercel,
            onder Analytics; er wordt niets van de bezoeker zelf bewaard. */}
        <Analytics />
      </body>
    </html>
  );
}
