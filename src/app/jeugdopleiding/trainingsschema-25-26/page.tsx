import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import TrainingsschemaClient from "./Client";

export const metadata: Metadata = {
  title: "Trainingsuren van alle ploegen",
  description:
    "Alle trainingsdagen en -uren van KWS Linkhout dit seizoen, per campus: Linkhout in de Kapelstraat en de tweede locatie in Zelem.",
  alternates: { canonical: "/jeugdopleiding/trainingsschema-25-26" },
  openGraph: ogVoor("/jeugdopleiding/trainingsschema-25-26"),
};

export default function Pagina() {
  return <TrainingsschemaClient />;
}
