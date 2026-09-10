import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import DamesOverOnsPage from "./Client";

export const metadata: Metadata = {
  title: "Pionier van het damesvoetbal in Limburg",
  description:
    "Het verhaal van het damesvoetbal bij KWS Linkhout: van de eerste damesploeg tot zes dames- en meisjesploegen vandaag.",
  alternates: { canonical: "/ploegen/dames-over-ons" },
  openGraph: ogVoor("/ploegen/dames-over-ons"),
};

export default function Pagina() {
  return <DamesOverOnsPage />;
}
