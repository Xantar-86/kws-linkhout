import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import EhboPage from "./Client";

export const metadata: Metadata = {
  title: "EHBO bij voetbalblessures",
  description:
    "Stappenplan bij een ongeval op het veld, eerste hulp bij de meest voorkomende voetbalblessures en wat er in onze EHBO-koffer zit.",
  alternates: { canonical: "/medisch/ehbo" },
  openGraph: ogVoor("/medisch/ehbo"),
};

export default function Pagina() {
  return <EhboPage />;
}
