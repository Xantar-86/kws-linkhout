import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import OpleidingsvisiePage from "./Client";

export const metadata: Metadata = {
  title: "Opleidingsvisie volgens de Vlaamse Voetbalfederatie",
  description:
    "Onze jeugdopleiding volgt de richtlijnen van de VFV: spelersgericht, met plezier en ontwikkeling voor het resultaat.",
  alternates: { canonical: "/jeugdopleiding/opleidingsvisie-vfv" },
  openGraph: ogVoor("/jeugdopleiding/opleidingsvisie-vfv"),
};

export default function Pagina() {
  return <OpleidingsvisiePage />;
}
