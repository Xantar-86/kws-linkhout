import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import PanathloncharterPage from "./Client";

export const metadata: Metadata = {
  title: "Panathloncharter: de rechten van het kind in de sport",
  description:
    "KWS Linkhout onderschrijft het Panathloncharter. De rechten van elk kind in de sport, en wat dat op ons veld betekent.",
  alternates: { canonical: "/jeugdopleiding/panathloncharter" },
  openGraph: ogVoor("/jeugdopleiding/panathloncharter"),
};

export default function Pagina() {
  return <PanathloncharterPage />;
}
