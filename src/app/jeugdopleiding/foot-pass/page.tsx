import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import FootPassPage from "./Client";

export const metadata: Metadata = {
  title: "Foot PASS, het kwaliteitslabel van onze jeugdopleiding",
  description:
    "Foot PASS beoordeelt jeugdopleidingen in Vlaanderen. Wat het label inhoudt en hoe KWS Linkhout ermee aan de slag is.",
  alternates: { canonical: "/jeugdopleiding/foot-pass" },
  openGraph: ogVoor("/jeugdopleiding/foot-pass"),
};

export default function Pagina() {
  return <FootPassPage />;
}
