import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOpdrachten } from "@/lib/social/opdrachten";
import { OpdrachtKaart } from "./OpdrachtKaart";

/**
 * De werklijst: per openstaande post een kant-en-klare opdracht om in ChatGPT
 * te plakken, het logo van de tegenstander, en een plek om het gemaakte beeld
 * naartoe te slepen.
 *
 * Beveiligd met een sleutel in de URL, zodat de pagina te bookmarken is zonder
 * inlogscherm: /matchday/opdrachten?sleutel=...
 */

export const metadata: Metadata = {
  title: "Matchday-opdrachten | KWS Linkhout",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OpdrachtenPagina({
  searchParams,
}: {
  searchParams: Promise<{ sleutel?: string }>;
}) {
  const { sleutel } = await searchParams;
  const verwacht = process.env.MATCHDAY_SLEUTEL;

  if (!verwacht || sleutel !== verwacht) {
    notFound();
  }

  const opdrachten = await getOpdrachten();
  const wedstrijden = opdrachten.filter((o) => o.soort === "wedstrijd");
  const uitslagen = opdrachten.filter((o) => o.soort === "uitslag");
  const klaar = opdrachten.filter((o) => o.afficheUrl).length;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <header className="border-b-4 border-primary pb-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            KWS Linkhout
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Affiches maken</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Kopieer de opdracht, plak die in je ChatGPT-project met de sjablonen, sleep
            het logo erbij, en bewaar het beeld. De wachter op je pc pikt het op, of je
            sleept het hier meteen naar het vak.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            {opdrachten.length} opdracht{opdrachten.length === 1 ? "" : "en"} open,{" "}
            {klaar} met beeld klaar.
          </p>
        </header>

        {opdrachten.length === 0 && (
          <p className="mt-8 rounded-xl bg-white p-6 text-gray-600 shadow">
            Er staat op dit moment niets open. Er is geen wedstrijd binnen acht dagen en
            geen recente uitslag.
          </p>
        )}

        {wedstrijden.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-gray-900">Komende wedstrijden</h2>
            <div className="space-y-4">
              {wedstrijden.map((o) => (
                <OpdrachtKaart key={`${o.ploeg.slug}-w`} opdracht={o} sleutel={sleutel} />
              ))}
            </div>
          </section>
        )}

        {uitslagen.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-bold text-gray-900">Uitslagen</h2>
            <div className="space-y-4">
              {uitslagen.map((o) => (
                <OpdrachtKaart key={`${o.ploeg.slug}-u`} opdracht={o} sleutel={sleutel} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Zo werkt het</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-600">
            <li>Klik op <strong>Kopieer opdracht</strong>.</li>
            <li>
              Download de drie beelden met de knoppen <strong>1</strong>,{" "}
              <strong>2</strong> en <strong>3</strong>. Alle drie moeten mee de chat in;
              bestanden die alleen in je ChatGPT-project staan worden niet als
              voorbeeld gebruikt.
            </li>
            <li>
              Open een nieuwe chat, sleep de drie beelden erin{" "}
              <strong>in die volgorde</strong>, plak dan pas de opdracht en verstuur.
            </li>
            <li>
              Sleep het beeld dat je terugkrijgt naar het vak hierboven, of bewaar het in
              de map van die ploeg onder <code>C:\KWS-affiches</code>.
            </li>
          </ol>
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            De volgorde van de beelden telt: eerst het lege sjabloon, dan het KWS-schild,
            dan de tegenstander. De opdracht verwijst ernaar als afbeelding 1, 2 en 3.
          </p>
        </section>
      </div>
    </main>
  );
}
