import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import CharterAntiRacismePage from "./Client";

export const metadata: Metadata = {
  title: "Charter anti-racisme: rode kaart tegen discriminatie",
  description:
    "KWS Linkhout ondertekende het charter tegen racisme en discriminatie. Wat het inhoudt en wat we van spelers, ouders en supporters verwachten.",
  alternates: { canonical: "/jeugdopleiding/charter-anti-racisme" },
  openGraph: ogVoor("/jeugdopleiding/charter-anti-racisme"),
};

export default function Pagina() {
  return <CharterAntiRacismePage />;
}
