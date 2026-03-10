"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import type { WedstrijdEvent } from "@/types";

const DAGEN = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
const MAANDEN = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

interface VolgendeWedstrijdProps {
  apiUrl: string;
  kalenderUrl: string;
  titel?: string;
  kleur?: "primary" | "pink";
}

export function VolgendeWedstrijd({
  apiUrl,
  kalenderUrl,
  titel = "Volgende Wedstrijd",
  kleur = "primary",
}: VolgendeWedstrijdProps) {
  const [wedstrijd, setWedstrijd] = useState<WedstrijdEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const badgeClasses =
    kleur === "pink" ? "bg-pink-100 text-pink-700" : "bg-primary/10 text-primary";
  const datumBgClass = kleur === "pink" ? "bg-pink-600" : "bg-primary";

  useEffect(() => {
    async function fetchWedstrijden() {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.volgende) {
          setWedstrijd({ ...data.volgende, start: new Date(data.volgende.start) });
        }
      } catch (error) {
        console.error("Fout bij ophalen wedstrijden:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWedstrijden();
  }, [apiUrl]);

  if (loading) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white rounded-2xl p-6 shadow-xl animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4" />
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (!wedstrijd) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`${badgeClasses} rounded-xl p-4`}>
                  <Calendar className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{titel}</h3>
                  <p className="text-gray-600">Bekijk alle aankomende wedstrijden</p>
                </div>
              </div>
              <a
                href={kalenderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Kalender bekijken
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const dagNaam = DAGEN[wedstrijd.start.getDay()];
  const dagNummer = wedstrijd.start.getDate();
  const maand = MAANDEN[wedstrijd.start.getMonth()];
  const uur = wedstrijd.start.getHours().toString().padStart(2, "0");
  const minuten = wedstrijd.start.getMinutes().toString().padStart(2, "0");

  return (
    <section className="py-6 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`${datumBgClass} text-white rounded-xl p-4 text-center min-w-[80px]`}>
                <div className="text-sm font-medium uppercase">{dagNaam}</div>
                <div className="text-3xl font-bold">{dagNummer}</div>
                <div className="text-sm">{maand}</div>
              </div>
              <div className="text-gray-600">
                <div className="text-sm">Aftrap</div>
                <div className="text-2xl font-bold text-gray-900">
                  {uur}:{minuten}
                </div>
              </div>
            </div>

            <div className="flex-1 text-center">
              <span className={`inline-block px-3 py-1 ${badgeClasses} rounded-full text-sm font-medium mb-2`}>
                {titel}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                {kleur === "primary" && <span className="text-2xl">⚽</span>}
                {wedstrijd.summary}
              </h3>
              {wedstrijd.location && (
                <div className="flex items-center justify-center gap-1 text-gray-500 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{wedstrijd.location}</span>
                </div>
              )}
            </div>

            <a
              href={kalenderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Volledige kalender
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
