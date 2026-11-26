import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/supabase";
import { evaluatieVanToken, evaluatieVanSpeler, instellingen, isOpen, ronde as leesRonde } from "@/lib/jeugd/evaluatie";
import { EvaluatieFormulier } from "@/components/jeugd/EvaluatieFormulier";
import { Verslag } from "@/components/jeugd/Verslag";
import { linkBewaren } from "@/app/spelers/evaluatie-acties";

/**
 * De evaluatie voor speler of ouders, via hun persoonlijke link. Geen
 * aanmelden nodig: wie de link heeft, kan voor die ene speler invullen.
 */
export const metadata: Metadata = {
  title: "Evaluatie KWS Linkhout",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";

function datum(d: string): string {
  return new Date(`${d}T12:00:00Z`).toLocaleDateString("nl-BE", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Brussels" });
}

export default async function EvaluatieViaLink({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const e = await evaluatieVanToken(token);
  if (!e || e.rol === "trainer") notFound();
  const [r, { data: s }, { data: ploeg }] = await Promise.all([
    leesRonde(e.ronde_id),
    db().from("jeugd_spelers").select("voornaam, achternaam").eq("id", e.speler_id).maybeSingle(),
    e.ploeg_id ? db().from("jeugd_ploegen").select("kort").eq("id", e.ploeg_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  if (!r || !s || r.status !== "verstuurd") notFound();
  const open = isOpen(r);
  const inst = instellingen(r);
  const tr = await evaluatieVanSpeler(r.id, e.speler_id, "trainer");
  const verslag = tr?.vrijgegeven && tr.ingediend ? tr : null;
  const ouders = e.rol === "ouders";
  const jong = e.groep !== "oud";

  return (
    <div className="min-h-screen bg-zand-50 text-inkt-900">
      <header className="bg-inkt-900 text-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Image src="/images/kwslinkhout-logo.png" alt="KWS Linkhout" width={44} height={44} className="h-11 w-11 object-contain" />
          <div className="grid leading-tight">
            <span className="font-display text-xl font-bold uppercase tracking-wide">{r.naam}</span>
            <span className="text-sm text-white/70">KWS Linkhout jeugd{ploeg?.kort ? ` · ${ploeg.kort}` : ""}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-3xl gap-6 px-4 pb-24 pt-6">
        <section className="grid gap-2">
          <h1 className="font-display text-3xl font-bold uppercase leading-tight">
            {ouders ? `Vragen voor de ouders van ${s.voornaam}` : `Hoe gaat het, ${s.voornaam}?`}
          </h1>
          {ouders ? (
            <p className="text-inkt-700">
              Twee keer per seizoen staan we stil bij hoe het gaat met elke speler. De trainer kijkt naar het voetbal; van u willen we
              vooral horen hoe {s.voornaam} zich voelt bij de club en wat u thuis merkt. Het duurt een vijftal minuten.
            </p>
          ) : jong ? (
            <p className="text-inkt-700">
              Duid bij elke zin het gezichtje aan dat het best past. Er zijn geen foute antwoorden. Vul dit gerust samen met mama of
              papa in.
            </p>
          ) : (
            <p className="text-inkt-700">
              Kijk eerlijk naar jezelf: 1 is helemaal niet, 5 is helemaal. Je trainer vult hetzelfde in, en daarna bespreken jullie het
              samen. Er zijn geen foute antwoorden.
            </p>
          )}
          {open && <p className="text-sm text-inkt-600">Invullen kan tot en met {datum(r.open_tot)}. Tussentijds bewaren mag, dezelfde link brengt u later terug.</p>}
        </section>

        {verslag && (
          <section className="grid gap-4 rounded-xl border-2 border-inkt-900 bg-white p-5">
            <div className="grid gap-1">
              <h2 className="font-display text-2xl font-bold uppercase">Het verslag van de trainer</h2>
              <p className="text-sm text-inkt-600">
                {verslag.besproken_op && <>Besproken op {datum(verslag.besproken_op)}. </>}
                Scores van 1 (moet nog veel groeien) tot 5 (uitstekend), voor de leeftijd van {s.voornaam}.
              </p>
            </div>
            <Verslag rol="trainer" groep={verslag.groep} inst={inst} a={verslag.antwoorden} />
          </section>
        )}

        {open ? (
          <EvaluatieFormulier
            rol={e.rol}
            groep={e.groep}
            inst={inst}
            start={e.antwoorden ?? {}}
            verborgen={{ token }}
            actie={linkBewaren}
            ingediend={e.ingediend}
            naamVeld={ouders ? { label: "Ingevuld door (uw naam, niet verplicht)", start: e.ingevuld_door ?? "" } : undefined}
            knopTekst="Versturen"
          />
        ) : (
          <section className="grid gap-2 rounded-xl border border-zand-200 bg-white p-5">
            <h2 className="font-display text-xl font-bold uppercase">Deze evaluatie is afgesloten</h2>
            <p className="text-inkt-700">
              {e.ingediend ? "Bedankt, uw antwoorden zijn goed aangekomen." : "Er kan niet meer ingevuld worden. Neem contact op met de trainer als u toch nog iets wilt meegeven."}
            </p>
          </section>
        )}

        <p className="text-xs text-inkt-600">
          Deze link is persoonlijk: stuur hem niet door. De antwoorden zijn enkel zichtbaar voor de trainers en de jeugdwerking van
          KWS Linkhout en worden niet gedeeld met anderen.
        </p>
      </main>
    </div>
  );
}
