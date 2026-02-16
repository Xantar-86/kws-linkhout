import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "KWS Linkhout - Voetbalclub",
  description: "KWS Linkhout - Een club met een hart. 23 ploegen, 250+ leden. Van U6 tot senioren.",
  icons: {
    icon: "/images/kwslinkhout-logo.png",
    apple: "/images/kwslinkhout-logo.png",
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
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
