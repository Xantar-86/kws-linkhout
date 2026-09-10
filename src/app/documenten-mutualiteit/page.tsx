import { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import { getMutualiteitSecties } from "@/lib/mutualiteit";
import { DocumentenMutualiteitView } from "./View";

export const metadata: Metadata = {
  title: "Attest voor de mutualiteit",
  alternates: { canonical: "/documenten-mutualiteit" },
  openGraph: ogVoor("/documenten-mutualiteit"),
  description:
    "Download hier de formulieren voor je mutualiteit voor terugbetaling van voetbalgerelateerde kosten.",
};

export default async function DocumentenMutualiteitPage() {
  const secties = await getMutualiteitSecties();
  return <DocumentenMutualiteitView secties={secties} />;
}
