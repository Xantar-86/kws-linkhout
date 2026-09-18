"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Camera,
  CheckCircle2,
  Download,
  Loader2,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Handtekeningvak } from "@/components/toestemming/Handtekeningvak";
import {
  KANALEN,
  controleer,
  datumNl,
  leeftijdOp,
  spelerTekentMee,
  type Inzending,
  type Keuze,
} from "@/lib/toestemming/velden";
import { teams } from "@/lib/teams";

/**
 * Het toestemmingsformulier zoals de ouder het op zijn telefoon invult.
 *
 * De opbouw volgt het papieren document deel voor deel, zodat wie het blad al
 * gezien heeft niet moet zoeken. De acht keuzes uit deel 3 staan elk apart met
 * een uitdrukkelijke ja en nee: vooraf aangevinkt staan mag niet, dan is het
 * geen vrije toestemming.
 *
 * Nakijken gebeurt met dezelfde `controleer` als op de server, zodat de ouder
 * hier al ziet wat er ontbreekt en de server niets doorlaat wat het formulier
 * zou tegenhouden.
 */

const ANDERE = "__andere__";

/** De ploegen waar dit formulier over gaat: de jeugd, inclusief de meisjes. */
const PLOEGEN = teams
  .filter((team) => team.category === "jeugd" || team.slug.startsWith("women-u"))
  .map((team) => ({ naam: team.name, trainer: team.coach }))
  .sort((a, b) => a.naam.localeCompare(b.naam, "nl-BE", { numeric: true }));

function Kop() {
  return (
    <header className="bg-inkt-900 text-white">
      <div className="container-custom flex items-center gap-3 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/kwslinkhout-logo.png"
          alt=""
          className="h-11 w-11 object-contain"
        />
        <div>
          <p className="font-display text-base font-bold leading-tight">K.W.S. Linkhout</p>
          <p className="text-xs text-white/70">Toestemming beeldmateriaal jeugd, seizoen 2026-2027</p>
        </div>
      </div>
    </header>
  );
}

function Deel({
  nummer,
  titel,
  children,
}: {
  nummer: string;
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zand-200/70 bg-white p-5 shadow-blad sm:p-7">
      <h2 className="mb-4 flex items-baseline gap-2 font-display text-lg font-bold text-inkt-900">
        <span className="text-primary">{nummer}</span>
        {titel}
      </h2>
      {children}
    </section>
  );
}

function Veld({
  label,
  verplicht,
  hulp,
  children,
}: {
  label: string;
  verplicht?: boolean;
  hulp?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {verplicht && <span className="ml-0.5 text-primary">*</span>}
      </span>
      {children}
      {hulp && <span className="mt-1.5 block text-xs text-slate-500">{hulp}</span>}
    </label>
  );
}

const INVOER =
  "w-full rounded-xl border border-zand-300 bg-white px-3.5 py-2.5 text-base text-inkt-900 " +
  "outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function ToestemmingClient() {
  const [speler, setSpeler] = useState("");
  const [geboortedatum, setGeboortedatum] = useState("");
  const [ploegKeuze, setPloegKeuze] = useState("");
  const [anderePloeg, setAnderePloeg] = useState("");
  const [afgevaardigde, setAfgevaardigde] = useState("");
  const [keuzes, setKeuzes] = useState<Record<string, Keuze>>({});
  const [ouder1Naam, setOuder1Naam] = useState("");
  const [ouder1Hand, setOuder1Hand] = useState("");
  const [tweedeOuder, setTweedeOuder] = useState(false);
  const [ouder2Naam, setOuder2Naam] = useState("");
  const [ouder2Hand, setOuder2Hand] = useState("");
  const [spelerHand, setSpelerHand] = useState("");
  const [email, setEmail] = useState("");
  const [gelezen, setGelezen] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [bezig, setBezig] = useState(false);
  const [fouten, setFouten] = useState<string[]>([]);
  const [klaar, setKlaar] = useState<{ kenmerk: string; kopie: boolean } | null>(null);

  const ploeg = ploegKeuze === ANDERE ? anderePloeg : ploegKeuze;
  const tekentMee = Boolean(geboortedatum) && spelerTekentMee(geboortedatum);
  const leeftijd = geboortedatum ? leeftijdOp(geboortedatum) : Number.NaN;
  const beantwoord = KANALEN.filter((k) => keuzes[k.id]).length;

  const inzending: Inzending = useMemo(
    () => ({
      speler: speler.trim(),
      geboortedatum,
      ploeg: ploeg.trim(),
      afgevaardigde: afgevaardigde.trim() || undefined,
      keuzes,
      ouder1: { naam: ouder1Naam.trim(), handtekening: ouder1Hand },
      ouder2:
        tweedeOuder && (ouder2Naam || ouder2Hand)
          ? { naam: ouder2Naam.trim(), handtekening: ouder2Hand }
          : undefined,
      spelerZelf: tekentMee ? { naam: speler.trim(), handtekening: spelerHand } : undefined,
      email: email.trim() || undefined,
      gelezen,
    }),
    [
      speler,
      geboortedatum,
      ploeg,
      afgevaardigde,
      keuzes,
      ouder1Naam,
      ouder1Hand,
      tweedeOuder,
      ouder2Naam,
      ouder2Hand,
      tekentMee,
      spelerHand,
      email,
      gelezen,
    ],
  );

  async function verstuur(gebeurtenis: React.FormEvent) {
    gebeurtenis.preventDefault();
    const klachten = controleer(inzending);
    if (klachten.length > 0) {
      setFouten(klachten);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }

    setFouten([]);
    setBezig(true);
    try {
      const antwoord = await fetch("/api/toestemming", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...inzending, website: honeypot }),
      });
      const gegevens = (await antwoord.json()) as {
        ok: boolean;
        klachten?: string[];
        kenmerk?: string;
        kopieNaarOuder?: boolean;
      };
      if (!antwoord.ok || !gegevens.ok) {
        setFouten(gegevens.klachten ?? ["Er ging iets mis bij het versturen."]);
        return;
      }
      setKlaar({
        kenmerk: gegevens.kenmerk ?? "",
        kopie: Boolean(gegevens.kopieNaarOuder),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFouten([
        "Het formulier kon niet verstuurd worden. Kijk je verbinding na en probeer opnieuw.",
      ]);
    } finally {
      setBezig(false);
    }
  }

  if (klaar) {
    return (
      <main className="min-h-screen bg-zand-50">
        <Kop />
        <div className="container-custom max-w-2xl py-12">
          <div className="rounded-2xl border border-zand-200/70 bg-white p-7 text-center shadow-blad">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-4 font-display text-2xl font-bold text-inkt-900">
              Bedankt, het is binnen
            </h1>
            <p className="lopende-tekst mt-3">
              <span>
                De toestemming voor {speler} is doorgestuurd naar de club. Het ingevulde formulier is
                opgemaakt als pdf en bewaard bij de gegevens van de ploeg.
              </span>
            </p>
            {klaar.kopie ? (
              <p className="mt-4 text-sm text-slate-600">
                Er is een kopie naar {email} gestuurd. Kijk eventueel in je ongewenste mail.
              </p>
            ) : (
              <p className="mt-4 text-sm text-slate-600">
                Wil je later iets wijzigen of je toestemming intrekken, mail dan naar{" "}
                <a href="mailto:info@kwslinkhout.be" className="text-primary underline">
                  info@kwslinkhout.be
                </a>
                .
              </p>
            )}
            {klaar.kenmerk && (
              <p className="mt-6 text-xs text-slate-400">Kenmerk {klaar.kenmerk}</p>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zand-50">
      <Kop />

      <form onSubmit={verstuur} className="container-custom max-w-3xl space-y-5 py-8">
        {/* Inleiding, met dezelfde boodschap als op het blad. */}
        <div className="rounded-2xl bg-inkt-900 p-6 text-white sm:p-8">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Toestemming voor het gebruik van beeldmateriaal
          </h1>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/80">
            <p>
              K.W.S. Linkhout maakt tijdens trainingen, wedstrijden, tornooien en clubactiviteiten
              regelmatig foto’s en filmpjes. Omdat het om beelden van minderjarigen gaat, vragen we
              daarvoor uitdrukkelijk je toestemming.
            </p>
            <p>
              Je beslist zelf, per kanaal, waarvoor je toestemming geeft. Je keuze heeft geen enkele
              invloed op het lidmaatschap, de selectie of de speelkansen van je kind, en je kan ze
              later altijd intrekken.
            </p>
          </div>
          <a
            href="/Docs/gdpr/Toestemming_Beeldmateriaal_Jeugd_KWS_Linkhout.pdf"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            Liever op papier? Download het blad
          </a>
        </div>

        <Deel nummer="1." titel="Gegevens van de speler">
          <div className="grid gap-4 sm:grid-cols-2">
            <Veld label="Naam en voornaam speler" verplicht>
              <input
                className={INVOER}
                value={speler}
                onChange={(e) => setSpeler(e.target.value)}
                autoComplete="off"
                placeholder="Familienaam en dan voornaam"
              />
            </Veld>
            <Veld
              label="Geboortedatum"
              verplicht
              hulp={
                Number.isFinite(leeftijd) && leeftijd > 0
                  ? `${leeftijd} jaar${tekentMee ? ", je kind ondertekent straks zelf mee" : ""}`
                  : undefined
              }
            >
              <input
                type="date"
                className={INVOER}
                value={geboortedatum}
                onChange={(e) => setGeboortedatum(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
              />
            </Veld>
            <Veld label="Ploeg" verplicht>
              <select
                className={INVOER}
                value={ploegKeuze}
                onChange={(e) => {
                  setPloegKeuze(e.target.value);
                  const gekozen = PLOEGEN.find((p) => p.naam === e.target.value);
                  if (gekozen && !afgevaardigde) setAfgevaardigde(gekozen.trainer);
                }}
              >
                <option value="">Kies de ploeg</option>
                {PLOEGEN.map((p) => (
                  <option key={p.naam} value={p.naam}>
                    {p.naam}
                  </option>
                ))}
                <option value={ANDERE}>Andere ploeg</option>
              </select>
            </Veld>
            {ploegKeuze === ANDERE && (
              <Veld label="Welke ploeg" verplicht>
                <input
                  className={INVOER}
                  value={anderePloeg}
                  onChange={(e) => setAnderePloeg(e.target.value)}
                />
              </Veld>
            )}
            <Veld label="Trainer of afgevaardigde" hulp="Mag je leeg laten als je het niet zeker weet.">
              <input
                className={INVOER}
                value={afgevaardigde}
                onChange={(e) => setAfgevaardigde(e.target.value)}
              />
            </Veld>
          </div>
        </Deel>

        <Deel nummer="2." titel="Over welke beelden gaat het">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zand-200 bg-zand-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-inkt-900">
                <Users className="h-4 w-4 text-slate-500" />
                Niet-gerichte beelden
              </p>
              <p className="mt-1.5 text-sm text-slate-600">
                Sfeerbeelden van een wedstrijd of tornooi, een ploeg in actie, het publiek. Niemand
                wordt er speciaal uitgelicht. Daarvoor is geen toestemming nodig, we informeren je
                erover.
              </p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary-50/50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-inkt-900">
                <Camera className="h-4 w-4 text-primary" />
                Gerichte beelden
              </p>
              <p className="mt-1.5 text-sm text-slate-600">
                Een portret of geposeerde foto, een ploegfoto, een close-up waarop je kind duidelijk
                herkenbaar en uitgelicht is. Daarvoor vragen we hieronder je toestemming.
              </p>
            </div>
          </div>
        </Deel>

        <Deel nummer="3." titel="Je toestemming per kanaal">
          <p className="mb-4 text-sm text-slate-600">
            Kies per lijn ja of nee. Er staat niets vooraf aangeduid, en wat je op nee zet, gebruiken
            wij niet.{" "}
            <span className={beantwoord === KANALEN.length ? "text-green-700" : "text-slate-500"}>
              {beantwoord} van {KANALEN.length} beantwoord.
            </span>
          </p>
          <div className="divide-y divide-zand-200">
            {KANALEN.map((kanaal) => (
              <fieldset
                key={kanaal.id}
                className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <legend className="contents">
                  <span className="text-sm text-slate-700">
                    {kanaal.label}
                    {kanaal.uitleg && (
                      <span className="mt-0.5 block text-xs text-slate-500">{kanaal.uitleg}</span>
                    )}
                  </span>
                </legend>
                <div className="flex shrink-0 gap-2">
                  {(["Ja", "Nee"] as const).map((optie) => (
                    <label key={optie} className="flex-1 sm:flex-none">
                      <input
                        type="radio"
                        name={kanaal.id}
                        value={optie}
                        checked={keuzes[kanaal.id] === optie}
                        onChange={() => setKeuzes((vorig) => ({ ...vorig, [kanaal.id]: optie }))}
                        className="peer sr-only"
                      />
                      <span
                        className={
                          "block cursor-pointer rounded-xl border px-6 py-2 text-center text-sm font-semibold transition " +
                          "border-zand-300 bg-white text-slate-600 hover:border-slate-400 " +
                          (optie === "Ja"
                            ? "peer-checked:border-green-600 peer-checked:bg-green-600 peer-checked:text-white"
                            : "peer-checked:border-slate-700 peer-checked:bg-slate-700 peer-checked:text-white")
                        }
                      >
                        {optie}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </Deel>

        <Deel nummer="4." titel="Wat de club altijd garandeert">
          <ul className="lopende-tekst">
            <li>Er worden nooit beelden gemaakt in kleedkamers, douches of sanitaire ruimtes.</li>
            <li>Wij publiceren geen beelden die je kind in een ongunstig of kwetsend daglicht stellen.</li>
            <li>
              Bij geen enkele foto publiceren wij het adres, de geboortedatum, het telefoonnummer of
              het e-mailadres van je kind. Bij sfeer- en wedstrijdfoto’s vermelden wij geen namen.
            </li>
            <li>
              Wij verkopen je gegevens en de beelden niet aan derden, en bewaren beelden niet langer
              dan nodig: zolang je kind lid is van de club halen wij de profielfoto daarna van de
              website.
            </li>
            <li>
              Je kan je toestemming altijd intrekken, of enkel de naamvermelding laten weghalen, via{" "}
              <a href="mailto:info@kwslinkhout.be" className="text-primary underline">
                info@kwslinkhout.be
              </a>
              . Dat heeft geen gevolg voor je kind binnen de club.
            </li>
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            De volledige afspraken en je rechten staan in het{" "}
            <a
              href="/Docs/gdpr/Toestemming_Beeldmateriaal_Jeugd_KWS_Linkhout.pdf"
              className="underline"
            >
              papieren formulier
            </a>{" "}
            en in de{" "}
            <a href="/Docs/Privacyverklaring.pdf" className="underline">
              privacyverklaring
            </a>{" "}
            van KWS vzw.
          </p>
        </Deel>

        <Deel nummer="5." titel="Ondertekening">
          <p className="mb-5 text-sm text-slate-600">
            Teken met je vinger op een telefoon of tablet, of met de muis op een computer. De datum
            van vandaag ({datumNl(new Date())}) komt automatisch op het formulier.
          </p>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Veld label="Naam en voornaam ouder of voogd" verplicht>
                <input
                  className={INVOER}
                  value={ouder1Naam}
                  onChange={(e) => setOuder1Naam(e.target.value)}
                  autoComplete="name"
                />
              </Veld>
              <Handtekeningvak
                label="Handtekening ouder of voogd"
                verplicht
                waarde={ouder1Hand}
                onChange={setOuder1Hand}
              />
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-zand-200 bg-zand-50 p-4">
              <input
                type="checkbox"
                checked={tweedeOuder}
                onChange={(e) => setTweedeOuder(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span className="text-sm text-slate-700">
                Een tweede ouder of voogd ondertekent ook
                <span className="mt-0.5 block text-xs text-slate-500">
                  Wonen de ouders niet samen, dan vragen wij dat beide ouders ondertekenen.
                </span>
              </span>
            </label>

            {tweedeOuder && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Veld label="Naam en voornaam tweede ouder of voogd" verplicht>
                  <input
                    className={INVOER}
                    value={ouder2Naam}
                    onChange={(e) => setOuder2Naam(e.target.value)}
                  />
                </Veld>
                <Handtekeningvak
                  label="Handtekening tweede ouder of voogd"
                  verplicht
                  waarde={ouder2Hand}
                  onChange={setOuder2Hand}
                />
              </div>
            )}

            {tekentMee && (
              <div className="rounded-xl border border-primary/20 bg-primary-50/40 p-4">
                <p className="mb-3 text-sm font-medium text-inkt-900">
                  {speler || "De speler"} is {leeftijd} jaar en ondertekent zelf mee
                  <span className="mt-0.5 block text-xs font-normal text-slate-600">
                    Vanaf 14 jaar is dat de onderscheidingsleeftijd voor het recht op afbeelding.
                  </span>
                </p>
                <Handtekeningvak
                  label="Handtekening speler"
                  verplicht
                  waarde={spelerHand}
                  onChange={setSpelerHand}
                />
              </div>
            )}

            <Veld
              label="Je e-mailadres"
              hulp="Niet verplicht. Vul je het in, dan krijg je het ingevulde formulier als pdf in je mailbox."
            >
              <input
                type="email"
                className={INVOER}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="naam@voorbeeld.be"
              />
            </Veld>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={gelezen}
                onChange={(e) => setGelezen(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span className="text-sm text-slate-700">
                Ik verklaar dat ik dit formulier gelezen en begrepen heb, en dat ik mijn keuzes vrij
                en geïnformeerd maak.<span className="ml-0.5 text-primary">*</span>
              </span>
            </label>
          </div>
        </Deel>

        {/* Verborgen veld tegen automatische inzendingen. */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        {fouten.length > 0 && (
          <div className="rounded-2xl border border-primary/30 bg-primary-50 p-5">
            <p className="flex items-center gap-2 font-semibold text-primary-800">
              <AlertCircle className="h-5 w-5" />
              Nog even nakijken
            </p>
            <ul className="mt-2 space-y-1 text-sm text-primary-900">
              {fouten.map((fout) => (
                <li key={fout}>{fout}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-3 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5" />
            Je gegevens gaan enkel naar de club, versleuteld verstuurd.
          </p>
          <button type="submit" disabled={bezig} className="btn-primary justify-center disabled:opacity-60">
            {bezig ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bezig met versturen
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Toestemming versturen
              </>
            )}
          </button>
        </div>

        <p className="flex items-center justify-center gap-2 pb-8 text-center text-xs text-slate-400">
          <CalendarDays className="h-3.5 w-3.5" />
          K.W.S. Linkhout, Kapelstraat 72 Linkhout, stamnummer 3531, info@kwslinkhout.be
        </p>
      </form>
    </main>
  );
}
