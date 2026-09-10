import type { Metadata } from "next";
import Link from "next/link";
import { ogVoor } from "@/lib/seo";
import { PaginaKop } from "@/components/PaginaKop";
import { LIDGELD, CONTACTEN, FORMULIER } from "@/app/word-lid/inhoud";

/**
 * Wat voetballen bij de club kost.
 *
 * Uit het SEO-plan: niemand in de streek beantwoordt deze vraag op zijn site,
 * terwijl elke ouder ze stelt. De bedragen komen uit dezelfde lijst als op
 * Word lid, dus ze kunnen niet uit elkaar lopen.
 */
export const metadata: Metadata = {
  title: "Wat kost voetballen bij KWS Linkhout?",
  description:
    "Het lidgeld per leeftijd voor 2026-2027, van 130 euro voor de Voetbaltuin tot 400 euro voor de senioren. " +
    "Wat erin zit, wat je zelf koopt, de terugbetaling van de mutualiteit en hulp als het krap zit.",
  alternates: { canonical: "/lidgeld" },
  openGraph: ogVoor("/lidgeld"),
};

const jeugd = CONTACTEN.find((c) => c.voor === "Jeugd")!;

export default function Pagina() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PaginaKop
        opschrift="Seizoen 2026-2027"
        titel="Wat kost voetballen bij ons?"
        accent="kost"
        onder="Het lidgeld per leeftijd, wat erin zit en wat je zelf nog koopt. Geen verrassingen achteraf."
        terug={{ naar: "/word-lid", label: "Terug naar Word lid" }}
      />

      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl lopende-tekst">
          <h2>Het lidgeld per leeftijd</h2>
          <p>
            Het lidgeld hangt af van de leeftijdsgroep. Een speler van bijvoorbeeld de U8 valt onder
            &quot;U6 tot en met U9&quot;.
          </p>
          <div className="tabelhouder my-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200 text-sm uppercase tracking-wide text-gray-500">
                  <th className="py-3 pr-4">Leeftijdsgroep</th>
                  <th className="py-3 pr-4">Lidgeld</th>
                  <th className="py-3">Opmerking</th>
                </tr>
              </thead>
              <tbody>
                {LIDGELD.map((rij) => (
                  <tr key={rij.groep} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">{rij.groep}</td>
                    <td className="py-3 pr-4 font-semibold text-primary">{rij.bedrag}</td>
                    <td className="py-3 text-gray-600">{rij.nota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Wat er inbegrepen is</h2>
          <p>
            Een lid kost de club gemiddeld meer dan het dubbele van het lidgeld; de rest wordt
            bijgepast uit de activiteiten van de club. In het lidgeld zit:
          </p>
          <ul>
            <li>de aansluiting bij de voetbalbond en de verplichte bondsverzekering;</li>
            <li>de clubkledij: shirt, short en kousen;</li>
            <li>de trainingen en de wedstrijden, met de scheidsrechters;</li>
            <li>het gebruik van de terreinen, de kleedkamers en het trainingsmateriaal;</li>
            <li>de begeleiding door de trainers van de jeugdopleiding;</li>
            <li>de deelname aan de clubactiviteiten.</li>
          </ul>

          <h2>Wat je zelf koopt</h2>
          <p>
            Voetbalschoenen en scheenbeschermers. Voor de eerste trainingen volstaan sportschoenen
            en een drinkfles; koop pas voetbalschoenen als je zeker weet dat je blijft.
          </p>

          <h2>Terugbetaling door de mutualiteit</h2>
          <p>
            De meeste ziekenfondsen betalen een deel van het lidgeld van een sportclub terug. Het
            attest dat je daarvoor nodig hebt, vind je bij de{" "}
            <Link href="/documenten-mutualiteit">documenten voor de mutualiteit</Link>.
          </p>

          <h2>Als het krap zit</h2>
          <p>
            Lidgeld mag geen reden zijn om niet te voetballen. Er zijn mogelijkheden om te spreiden
            of ondersteuning te krijgen; lees{" "}
            <Link href="/jeugdopleiding/lidgeld-ondersteuning">ondersteuning bij het lidgeld</Link>{" "}
            of spreek {jeugd.naam} discreet aan via{" "}
            <a href={`mailto:${jeugd.mail}`}>{jeugd.mail}</a> of{" "}
            <a href={`tel:${jeugd.telLink}`}>{jeugd.tel}</a>.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/word-lid" className="btn-primary">
              Zo word je lid
            </Link>
            <a href={FORMULIER} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Inschrijvingsformulier
            </a>
            <Link href="/proeftraining" className="btn-secondary">
              Eerst een training proberen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
