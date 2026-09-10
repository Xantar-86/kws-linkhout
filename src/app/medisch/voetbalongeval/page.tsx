import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import VoetbalongevalPage from "./Client";

export const metadata: Metadata = {
  title: "Wat te doen bij een voetbalongeval",
  description:
    "De procedure bij een blessure tijdens training of wedstrijd: het ongevalsformulier van de bond, de termijnen en wie je verwittigt.",
  alternates: { canonical: "/medisch/voetbalongeval" },
  openGraph: ogVoor("/medisch/voetbalongeval"),
};

export default function Pagina() {
  return <VoetbalongevalPage />;
}
