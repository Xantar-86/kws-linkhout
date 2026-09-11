import type { Metadata } from "next";
import Link from "next/link";
import { ogVoor } from "@/lib/seo";
import { PaginaKop } from "@/components/PaginaKop";
import { teams } from "@/lib/teams";
import { CONTACTEN } from "@/app/word-lid/inhoud";

/**
 * Een training komen proberen.
 *
 * Uit het SEO-plan: "proeftraining voetbal kind" beantwoordt niemand in de
 * streek op zijn site. De uren komen rechtstreeks uit lib/teams.ts, dezelfde
 * bron als de ploegpagina's en het trainingsschema, dus ze lopen nooit achter.
 */
export const metadata: Metadata = {
  title: "Kom een training proberen, gratis en zonder verplichting",
  description:
    "Een proeftraining is gratis en verplicht tot niets. Wanneer welke leeftijd traint in Linkhout en Zelem, " +
    "wat je meebrengt en bij wie je je aanmeldt.",
  alternates: { canonical: "/proeftraining" },
  openGraph: ogVoor("/proeftraining"),
};

export default function Pagina() {
  const ploegen = teams.filter((t) => t.category !== "senioren" && t.trainingDays.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <PaginaKop
        opschrift="Gratis en zonder verplichting"
        titel="Kom een training proberen"
        accent="proberen"
        onder="Ervaring is niet nodig. Kom kijken of het iets voor jou of je kind is, en beslis daarna."
        terug={{ naar: "/word-lid", label: "Terug naar Word lid" }}
      />

      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl lopende-tekst">
          <h2>Hoe het werkt</h2>
          <ol>
            <li>
              Laat weten hoe oud je bent of hoe oud je kind is. Wij zeggen bij welke ploeg en op
              welke dag je welkom bent.
            </li>
            <li>Kom een of twee keer meetrainen. De trainer vangt je op; je hoeft niemand te kennen.</li>
            <li>
              Bevalt het? Dan schrijf je in via <Link href="/word-lid">Word lid</Link>. Zo niet, dan
              is er niets aan de hand.
            </li>
          </ol>

          <h2>Wat neem je mee</h2>
          <ul>
            <li>sportieve kledij die vuil mag worden;</li>
            <li>sportschoenen of voetbalschoenen, wat je hebt;</li>
            <li>scheenbeschermers als je ze al hebt;</li>
            <li>een drinkfles.</li>
          </ul>

          <h2>Wanneer traint welke leeftijd</h2>
          <p>
            Een kind speelt bij de ploeg van zijn geboortejaar: U9 zijn de kinderen die dit seizoen
            negen worden, enzovoort. Twijfel je? Vraag het, wij zoeken het op.
          </p>
          <div className="tabelhouder my-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 uppercase tracking-wide text-gray-500">
                  <th className="py-3 pr-4">Ploeg</th>
                  <th className="py-3 pr-4">Dagen</th>
                  <th className="py-3 pr-4">Uur</th>
                  <th className="py-3">Waar</th>
                </tr>
              </thead>
              <tbody>
                {ploegen.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      <Link href={`/ploegen/${t.slug}`}>{t.name}</Link>
                    </td>
                    <td className="py-3 pr-4">{t.trainingDays.join(" en ")}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">{t.trainingTime}</td>
                    <td className="py-3">{t.trainingLocation ?? "KWS Linkhout"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            &quot;KWS&quot; is ons terrein aan de Kapelstraat 72 in Linkhout; &quot;Zelem&quot; is
            het terrein van Eendracht Zelem, waar een deel van de jeugd traint. Het volledige schema
            staat op <Link href="/jeugdopleiding/trainingsschema-25-26">het trainingsschema</Link>.
          </p>

          <h2>Meld je aan</h2>
          <p>Een mailtje of telefoontje volstaat. Zeg erbij hoe oud de speler is.</p>
          <ul>
            {CONTACTEN.map((c) => (
              <li key={c.naam}>
                <strong>{c.voor}:</strong> {c.naam} ({c.rol}),{" "}
                <a href={`mailto:${c.mail}`}>{c.mail}</a>, <a href={`tel:${c.telLink}`}>{c.tel}</a>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/word-lid" className="btn-primary">
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
