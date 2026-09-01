"use client";

// app/jeugdopleiding/trainingsschema-25-26/page.tsx
//
// Het trainingsschema, per campus.
//
// De uren stonden hier vroeger als een eigen kopie in dit bestand, los van de
// ploegen in lib/teams.ts. Die kopie bleef staan toen de uren wijzigden, en zo
// stonden hier een jaar lang de dagen van vorig seizoen. Nu komt alles uit
// teams.ts: past iemand daar een uur aan, dan volgt deze tabel vanzelf.

import { motion } from "framer-motion";
import { Clock, ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { teams, type Team } from "@/lib/teams";

const SEIZOEN = "2026-2027";

const DAGEN = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"] as const;
type Dag = (typeof DAGEN)[number];

/**
 * De uren per dag van één ploeg.
 *
 * Meestal geldt hetzelfde uur voor elke trainingsdag. Traint een ploeg op de
 * ene dag vroeger dan op de andere, dan staan de dagen in het uurveld zelf,
 * gescheiden door een punt: "Maandag 17:55 - 19:20 · Woensdag 16:30 - 18:00".
 */
function urenPerDag(ploeg: Team): Partial<Record<Dag, string>> {
  const uur = ploeg.trainingTime?.trim();
  if (!uur || ploeg.trainingDays.length === 0) return {};

  if (DAGEN.some((d) => new RegExp(`${d}\\s+\\d`, "i").test(uur))) {
    const per: Partial<Record<Dag, string>> = {};
    for (const stuk of uur.split("·")) {
      const dag = DAGEN.find((d) => new RegExp(`^${d}\\s`, "i").test(stuk.trim()));
      if (dag) per[dag] = stuk.trim().slice(dag.length).trim();
    }
    return per;
  }

  return Object.fromEntries(
    ploeg.trainingDays
      .map((d) => DAGEN.find((vast) => vast.toLowerCase() === d.toLowerCase()))
      .filter((d): d is Dag => Boolean(d))
      .map((d) => [d, uur]),
  );
}

/** Beide trainers achter elkaar, zonder lege plekken als er maar één is. */
function trainers(ploeg: Team): string {
  return [ploeg.coach, ploeg.assistantCoach].filter(Boolean).join(" & ");
}

/**
 * De volgorde in de tabel: eerst de jeugd van klein naar groot, dan de
 * meisjes- en damesploegen, dan de senioren. Zo staat een ouder die zijn
 * zoon of dochter zoekt meteen op de juiste hoogte.
 */
function volgorde(ploeg: Team): number {
  const leeftijd = ploeg.name.match(/U(\d+)/i);
  const nummer = leeftijd ? Number(leeftijd[1]) : 99;

  // De eerste damesploeg staat in teams.ts bij de senioren, en zou anders
  // onder de heren belanden, weg van de andere damesploegen. De naam beslist
  // hier dus, niet de rubriek.
  const meisjesOfDames = /^(Women|Dames)/i.test(ploeg.name);
  const rang = ploeg.category === "jeugd" ? 0 : meisjesOfDames ? 1 : 2;

  return rang * 1000 + nummer;
}

/** Alleen ploegen die echt trainen op een campus die we kennen. */
function ploegenOp(locatie: string): Team[] {
  return teams
    .filter((p) => p.trainingLocation === locatie && Object.keys(urenPerDag(p)).length > 0)
    .sort((a, b) => volgorde(a) - volgorde(b));
}

const campussen = [
  {
    naam: "Campus Linkhout",
    adres: "Kapelstraat 72, 3560 Linkhout",
    ploegen: ploegenOp("KWS"),
    achtergrond: "bg-white",
  },
  {
    naam: "Campus Zelem",
    adres: "Zelem",
    ploegen: ploegenOp("Zelem"),
    achtergrond: "bg-gray-50",
  },
];

function TrainingRij({ ploeg, index }: { ploeg: Team; index: number }) {
  const uren = urenPerDag(ploeg);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-gray-100 hover:bg-red-50/50 transition-colors"
    >
      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{ploeg.name}</td>
      {DAGEN.map((dag) => (
        <td
          key={dag}
          className={`px-4 py-3 text-center whitespace-nowrap ${
            uren[dag] ? "text-gray-900 font-medium" : "text-gray-300"
          }`}
        >
          {uren[dag] ?? "-"}
        </td>
      ))}
      <td className="px-4 py-3 text-gray-600 text-sm">{trainers(ploeg)}</td>
    </motion.tr>
  );
}

function Campus({
  naam,
  adres,
  ploegen,
  achtergrond,
}: {
  naam: string;
  adres: string;
  ploegen: Team[];
  achtergrond: string;
}) {
  if (ploegen.length === 0) return null;

  return (
    <section className={`section-padding ${achtergrond}`}>
      <div className="container-custom max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">{naam}</h2>
          </div>
          <p className="text-gray-600 ml-9">{adres}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-4 py-4 font-semibold">Ploeg</th>
                  {DAGEN.map((dag) => (
                    <th key={dag} className="text-center px-4 py-4 font-semibold">
                      {dag.slice(0, 2)}
                    </th>
                  ))}
                  <th className="text-left px-4 py-4 font-semibold">
                    <Users className="w-4 h-4 inline mr-1" />
                    Trainer
                  </th>
                </tr>
              </thead>
              <tbody>
                {ploegen.map((ploeg, index) => (
                  <TrainingRij key={ploeg.id} ploeg={ploeg} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function TrainingsschemaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link
            href="/jeugdopleiding"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar jeugdopleiding
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>
              <span className="text-sm font-medium text-white/80">Seizoen {SEIZOEN}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Schema Trainingen</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Bekijk hieronder alle trainingstijden voor het seizoen {SEIZOEN}. Kom steeds op tijd!
            </p>
          </motion.div>
        </div>
      </section>

      {campussen.map((campus) => (
        <Campus key={campus.naam} {...campus} />
      ))}

      {/* Info Cards */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Op tijd komen</h3>
              <p className="text-gray-600 text-sm">
                Wees 10 minuten voor aanvang aanwezig zodat je rustig kan opwarmen.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Trainingkledij</h3>
              <p className="text-gray-600 text-sm">
                Koud weer: Draag laagjes (thermokleding), een lange (trainings)broek, een shirt met
                lange mouwen en een trainingsjack.
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Locaties</h3>
              <p className="text-gray-600 text-sm">
                Controleer steeds op welk veld je moet zijn. Linkhout of Zelem.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
