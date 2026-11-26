import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { huidigeGebruiker } from "@/lib/jeugd/toegang";
import { afmelden } from "./acties";

/**
 * Het spelersdossier van de jeugd. Staat niet in het menu, niet in de
 * zoekmachines en is enkel te zien na aanmelden. Hier staan gegevens van
 * minderjarigen: niets van deze pagina's mag publiek gecached worden.
 */
export const metadata: Metadata = {
  title: "Spelersdossier",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SpelersLayout({ children }: { children: React.ReactNode }) {
  const ik = await huidigeGebruiker();
  return (
    <div className="min-h-screen bg-zand-50 text-inkt-900">
      <header className="bg-inkt-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/spelers" className="flex items-center gap-3">
            <Image src="/images/kwslinkhout-logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="grid leading-tight">
              <span className="font-display text-lg font-bold uppercase tracking-wide">Spelersdossier</span>
              <span className="text-xs text-white/60">KWS Linkhout jeugd</span>
            </span>
          </Link>
          {ik && (
            <nav className="ml-auto flex flex-wrap items-center gap-4 text-sm">
              <Link href="/spelers" className="text-white/80 hover:text-white">Ploegen</Link>
              {ik.beheerder && <Link href="/spelers/beheer" className="text-white/80 hover:text-white">Beheer</Link>}
              <span className="text-white/50">{ik.naam}</span>
              <form action={afmelden}>
                <button className="rounded-md border border-white/25 px-3 py-1.5 text-white/90 hover:border-white/60">Afmelden</button>
              </form>
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">{children}</main>
    </div>
  );
}
