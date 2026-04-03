import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CacheBuster } from "@/components/CacheBuster";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const baseUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : "https://www.kwslinkhout.be";

export const metadata: Metadata = {
  title: "KWS Linkhout - Voetbalclub",
  description: "KWS Linkhout - Een club met een hart. 22 ploegen, 250+ leden. Van U6 tot senioren.",
  metadataBase: new URL(baseUrl),
  icons: {
    icon: "/images/kwslinkhout-logo.png",
    apple: "/images/kwslinkhout-logo.png",
    shortcut: "/images/kwslinkhout-logo.png",
  },
  other: {
    'view-transition': 'same-origin',
  },
  openGraph: {
    title: "KWS Linkhout - Voetbalclub",
    description: "KWS Linkhout - Een club met een hart. 22 ploegen, 250+ leden. Van U6 tot senioren.",
    images: [{ url: "https://www.kwslinkhout.be/images/logo-kws.jpg" }],
    locale: "nl_BE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "KWS Linkhout - Voetbalclub",
    description: "KWS Linkhout - Een club met een hart. 22 ploegen, 250+ leden.",
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
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
