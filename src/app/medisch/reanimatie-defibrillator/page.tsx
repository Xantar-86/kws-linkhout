import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import ReanimatieDefibrillatorPage from "./Client";

export const metadata: Metadata = {
  title: "Reanimatie en de AED op het terrein",
  description:
    "Waar de AED hangt bij KWS Linkhout en hoe je reanimeert bij een hartstilstand. Snel handelen redt levens.",
  alternates: { canonical: "/medisch/reanimatie-defibrillator" },
  openGraph: ogVoor("/medisch/reanimatie-defibrillator"),
};

export default function Pagina() {
  return <ReanimatieDefibrillatorPage />;
}
