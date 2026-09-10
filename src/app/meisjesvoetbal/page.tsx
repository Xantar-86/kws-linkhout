import type { Metadata } from "next";
import Link from "next/link";
import { ogVoor } from "@/lib/seo";
import { PaginaKop } from "@/components/PaginaKop";
import { teams } from "@/lib/teams";
import { CONTACTEN } from "@/app/word-lid/inhoud";

/**
 * Meisjesvoetbal als eigen verhaal.
 *
 * Uit het SEO-plan: geen enkele club in de streek heeft hier een pagina over,
 * terwijl KWS Linkhout er zes ploegen voor heeft. De ploegen komen uit
 * lib/teams.ts; de geschiedenis staat op /ploegen/dames-over-ons.
 */
export const metadata: Metadata = {
  title: "Meisjesvoetbal in Lummen: van de U8 tot de dames",
  description:
    "Bij KWS Linkhout voetballen meisjes vanaf de U8 in eigen ploegen, tot aan de dames in eerste provinciale. " +
    "Trainingsuren, trainsters en hoe je een training komt proberen.",
  alternates: { canonical: "/meisjesvoetbal" },
  openGraph: ogVoor("/meisjesvoetbal"),
};

export default function Pagina() {
  const ploegen = teams.filter((t) => t.category === "dames" || /dames|women/i.test(t.name));
  const dames = CONTACTEN.find((c) => c.voor === "Dames en meisjes")!;

  return (
    <div className="min-h-screen bg-gray-50">
      <PaginaKop
        opschrift="Dames en meisjes"
        titel="Meisjesvoetbal in Lummen"
        accent="Meisjesvoetbal"
        onder="Van de jongste meisjes tot de dames in eerste provinciale: bij ons speel je met en tegen meisjes, met eigen trainsters en trainers."
        terug={{ naar: "/ploegen", label: "Alle ploegen" }}
      />

      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl lopende-tekst">
          <h2>Van de U8 tot de dames</h2>
          <p>
            KWS Linkhout was een van de eerste clubs in Limburg met damesvoetbal, en dat is vandaag
            uitgegroeid tot een volledige lijn van {ploegen.length} ploegen: meisjesploegen vanaf de U8, een
            Women U20 als brug naar de senioren, en twee damesploegen. Het verhaal daarachter lees je op{" "}
            <Link href="/ploegen/dames-over-ons">pionier van het damesvoetbal</Link>.
          </p>
          <div className="tabelhouder my-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 uppercase tracking-wide text-gray-500">
                  <th className="py-3 pr-4">Ploeg</th>
                  <th className="py-3 pr-4">Trainer</th>
                  <th className="py-3 pr-4">Training</th>
                  <th className="py-3">Waar</th>
                </tr>
              </thead>
              <tbody>
                {ploegen.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      <Link href={`/ploegen/${t.slug}`}>{t.name}</Link>
                    </td>
                    <td className="py-3 pr-4">{t.coach}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {t.trainingDays.join(" en ")}, {t.trainingTime}
                    </td>
                    <td className="py-3">{t.trainingLocation ?? "KWS Linkhout"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Bij de jongens of apart?</h2>
          <p>
            Allebei kan. Een meisje mag in de jeugd ook bij een gemengde ploeg van haar leeftijd
            spelen; veel meisjes beginnen zo en stappen later over naar een meisjesploeg. Wat het
            beste past, bekijken we samen na een paar trainingen.
          </p>

          <h2>Kom proberen</h2>
          <p>
            Een proeftraining is gratis en verplicht tot niets. Neem contact op met {dames.naam} (
            {dames.rol}) via <a href={`mailto:${dames.mail}`}>{dames.mail}</a> of{" "}
            <a href={`tel:${dames.telLink}`}>{dames.tel}</a>, en zeg erbij hoe oud ze is.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/proeftraining" className="btn-primary">
              Een training proberen
            </Link>
            <Link href="/word-lid" className="btn-secondary">
              Zo word je lid
            </Link>
            <Link href="/lidgeld" className="btn-secondary">
              Wat het kost
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
