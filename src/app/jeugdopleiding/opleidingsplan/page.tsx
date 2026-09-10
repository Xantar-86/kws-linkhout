import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import OpleidingsplanPage from "./Client";

export const metadata: Metadata = {
  title: "Opleidingsplan van U6 tot U21",
  description:
    "Wat een jeugdspeler bij KWS Linkhout per leeftijd leert: van de Voetbaltuin tot de beloften, stap voor stap.",
  alternates: { canonical: "/jeugdopleiding/opleidingsplan" },
  openGraph: ogVoor("/jeugdopleiding/opleidingsplan"),
};

export default function Pagina() {
  return <OpleidingsplanPage />;
}
