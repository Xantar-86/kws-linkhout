import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import MedischClient from "./Client";

export const metadata: Metadata = {
  title: "Blessures, EHBO en de AED op het terrein",
  description:
    "Wat te doen bij een blessure of een voetbalongeval bij KWS Linkhout, waar de AED hangt en hoe je de papieren voor de verzekering in orde brengt.",
  alternates: { canonical: "/medisch" },
  openGraph: ogVoor("/medisch"),
};

export default function Pagina() {
  return <MedischClient />;
}
