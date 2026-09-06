import type { Metadata } from "next";
import PloegenClient from "./Client";

export const metadata: Metadata = {
  title: "Onze 25 ploegen, van U6 tot veteranen",
  description:
    "Alle ploegen van KWS Linkhout in Lummen: jeugd van U6 tot U17, zes dames- en meisjesploegen en de senioren. Bekijk trainingsuren, trainer en kalender per ploeg.",
  alternates: { canonical: "/ploegen" },
};

export default function Pagina() {
  return <PloegenClient />;
}
