import Link from "next/link";
import { vereisGebruiker } from "@/lib/jeugd/toegang";
import { zichtbarePloegen } from "@/lib/jeugd/gegevens";
import { NieuweRonde } from "@/components/jeugd/Formulieren";
import { rondeMaken } from "../../evaluatie-acties";
import { Kaart } from "../../Onderdelen";

export default async function NieuweEvaluatie() {
  const ik = await vereisGebruiker();
  const ploegen = await zichtbarePloegen(ik);
  const nu = new Date();
  const maand = nu.getMonth();
  const moment = maand >= 10 || maand <= 1 ? "Winterstop" : maand >= 3 && maand <= 6 ? "Einde seizoen" : "Evaluatie";
  const jaar = maand >= 6 ? nu.getFullYear() : nu.getFullYear() - 1;
  const tot = new Date(nu.getTime() + 21 * 864e5).toLocaleDateString("sv-SE", { timeZone: "Europe/Brussels" });

  return (
    <div className="grid max-w-2xl gap-6">
      <div className="grid gap-1">
        <Link href="/spelers/evaluaties" className="text-sm text-inkt-600 hover:text-primary-700">← Evaluaties</Link>
        <h1 className="font-display text-3xl font-bold uppercase">Nieuwe evaluatie</h1>
        <ol className="flex flex-wrap gap-2 text-sm">
          <li className="rounded-md bg-inkt-900 px-2 py-1 font-semibold text-white">1 Ploeg en datum</li>
          <li className="rounded-md bg-zand-100 px-2 py-1 text-inkt-700">2 Vragen kiezen</li>
          <li className="rounded-md bg-zand-100 px-2 py-1 text-inkt-700">3 Overzicht en versturen</li>
        </ol>
      </div>
      <Kaart titel="Ploeg en datum">
        {ploegen.length === 0 ? (
          <p className="text-sm text-inkt-700">Je hebt nog geen toegang tot een ploeg. Vraag het aan de beheerder.</p>
        ) : (
          <NieuweRonde
            actie={rondeMaken}
            ploegen={ploegen.map((p) => ({ id: p.id, kort: p.kort }))}
            voorstelNaam={`${moment} ${jaar}-${jaar + 1}`}
            voorstelTot={tot}
          />
        )}
      </Kaart>
    </div>
  );
}
