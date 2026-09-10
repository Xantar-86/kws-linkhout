import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import MedischeOmkaderingPage from "./Client";

export const metadata: Metadata = {
  title: "Medische omkadering op het terrein",
  description:
    "Gekwalificeerde EHBO'ers, een AED en duidelijke afspraken: hoe KWS Linkhout zorgt voor een veilige sportomgeving.",
  alternates: { canonical: "/medisch/medische-omkadering" },
  openGraph: ogVoor("/medisch/medische-omkadering"),
};

export default function Pagina() {
  return <MedischeOmkaderingPage />;
}
