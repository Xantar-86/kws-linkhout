import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import JeugdopleidingClient from "./Client";

export const metadata: Metadata = {
  title: "Onze jeugdopleiding: visie en aanpak",
  description:
    "Hoe KWS Linkhout jeugdspelers opleidt: het opleidingsplan, het Panathlon-charter, fair play en het Foot Pass-label van de jeugdwerking in Lummen.",
  alternates: { canonical: "/jeugdopleiding" },
  openGraph: ogVoor("/jeugdopleiding"),
};

export default function Pagina() {
  return <JeugdopleidingClient />;
}
