import { Metadata } from "next";
import { getMutualiteitSecties } from "@/lib/mutualiteit";
import { DocumentenMutualiteitView } from "./View";

export const metadata: Metadata = {
  title: "Documenten Mutualiteit - KWS Linkhout",
  description:
    "Download hier de formulieren voor je mutualiteit voor terugbetaling van voetbalgerelateerde kosten.",
};

export default async function DocumentenMutualiteitPage() {
  const secties = await getMutualiteitSecties();
  return <DocumentenMutualiteitView secties={secties} />;
}
