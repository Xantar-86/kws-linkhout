import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PLOEGEN } from "@/lib/social/ploegen";
import { bouwMatchday } from "@/lib/social/matchday";
import { bouwUitslag, formatteerDoelpuntenmakers } from "@/lib/social/uitslag";
import { bouwAfbeeldingUrl, bouwUitslagAfbeeldingUrl } from "@/lib/social/afbeelding";

/**
 * Voorbeeldpagina om de matchday-template te beoordelen zonder iets te posten
 * of te mailen. Alleen bereikbaar tijdens lokale ontwikkeling (npm run dev).
 *
 * Pas content/social/matchday-template.json aan en herlaad deze pagina om het
 * resultaat te zien.
 */

export const metadata: Metadata = {
  title: "Matchday-template",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TemplatePagina() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const voorbeelden = await Promise.all(
    PLOEGEN.map(async (ploeg) => {
      try {
        // Ruime horizon, zodat er ook buiten het seizoen iets te zien is.
        const matchday = await bouwMatchday(ploeg, 365);
        if (!matchday) {
          return { ploeg, fout: "Geen komende wedstrijd gevonden in de kalender." };
        }
        let afbeeldingUrl: string | null = null;
        try {
          afbeeldingUrl = bouwAfbeeldingUrl(matchday, "");
        } catch {
          afbeeldingUrl = null;
        }
        return { ploeg, matchday, afbeeldingUrl };
      } catch (error) {
        return { ploeg, fout: error instanceof Error ? error.message : String(error) };
      }
    })
  );

  // Ruime horizon zodat er ook buiten het weekend een uitslag te zien is.
  const uitslagen = await Promise.all(
    PLOEGEN.map(async (ploeg) => {
      try {
        const uitslag = await bouwUitslag(ploeg, 400);
        let afbeeldingUrl: string | null = null;
        if (uitslag) {
          try {
            afbeeldingUrl = bouwUitslagAfbeeldingUrl(uitslag, "");
          } catch {
            afbeeldingUrl = null;
          }
        }
        return { ploeg, uitslag, afbeeldingUrl };
      } catch (error) {
        return { ploeg, fout: error instanceof Error ? error.message : String(error) };
      }
    })
  );

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold text-gray-900">Matchday-template</h1>
        <p className="mt-2 text-gray-600">
          Zo ziet de automatische post eruit. Aanpassen doe je in{" "}
          <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm">
            content/social/matchday-template.json
          </code>
          .
        </p>

        <div className="mt-8 space-y-8">
          {voorbeelden.map((v) => (
            <section key={v.ploeg.slug} className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-bold text-gray-900">{v.ploeg.naam}</h2>
              <p className="text-sm text-gray-500">{v.ploeg.reeks}</p>

              {"fout" in v && v.fout ? (
                <p className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">{v.fout}</p>
              ) : (
                <>
                  {v.afbeeldingUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.afbeeldingUrl}
                      alt=""
                      className="mt-4 w-full max-w-md rounded-xl border border-gray-200"
                    />
                  ) : (
                    <p className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                      Zet SOCIAL_SECRET in .env.local om de afbeelding te kunnen tonen.
                    </p>
                  )}
                  <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 font-mono text-sm leading-relaxed text-gray-800">
                    {v.matchday!.caption}
                  </pre>
                </>
              )}
            </section>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-bold text-gray-900">Uitslagposts</h2>
        <p className="mt-1 text-gray-600">
          Laatst gespeelde wedstrijd per ploeg, met de doelpuntenmakers zoals de RBFA ze
          doorgeeft.
        </p>

        <div className="mt-6 space-y-6">
          {uitslagen.map((u) => (
            <section key={u.ploeg.slug} className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-lg font-bold text-gray-900">{u.ploeg.naam}</h3>
              {"fout" in u && u.fout ? (
                <p className="mt-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">{u.fout}</p>
              ) : !u.uitslag ? (
                <p className="mt-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                  Nog geen afgewerkte wedstrijd gevonden.
                </p>
              ) : (
                <>
                  <p className="mt-1 text-sm text-gray-500">
                    {u.uitslag.thuisploeg} {u.uitslag.thuisScore} - {u.uitslag.uitScore}{" "}
                    {u.uitslag.uitploeg} · {u.uitslag.resultaat}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Tegenstander scoorde:{" "}
                    {formatteerDoelpuntenmakers(u.uitslag.doelpunten, !u.uitslag.isThuis) ||
                      "niets"}
                  </p>
                  {u.afbeeldingUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.afbeeldingUrl}
                      alt=""
                      className="mt-4 w-full max-w-md rounded-xl border border-gray-200"
                    />
                  )}
                  <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 font-mono text-sm leading-relaxed text-gray-800">
                    {u.uitslag.caption}
                  </pre>
                </>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
