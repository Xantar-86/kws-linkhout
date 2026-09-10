import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import LidgeldOndersteuningClient from "./Client";

export const metadata: Metadata = {
  title: "Ondersteuning bij het lidgeld",
  description:
    "Valt het lidgeld zwaar? Via de UiTPAS, de gemeente Lummen of het Sociaal Huis, of met een gespreide betaling bij de club zelf.",
  alternates: { canonical: "/jeugdopleiding/lidgeld-ondersteuning" },
  openGraph: ogVoor("/jeugdopleiding/lidgeld-ondersteuning"),
};

export default function Pagina() {
  return <LidgeldOndersteuningClient />;
}
