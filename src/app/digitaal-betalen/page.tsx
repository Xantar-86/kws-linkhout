import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import DigitaalBetalenClient from "./Client";

export const metadata: Metadata = {
  title: "Digitaal betalen aan de toog",
  description:
    "Betalen in de kantine van KWS Linkhout met de clubkaart, met je bankkaart of met Payconiq. Zo werkt elk van de drie.",
  alternates: { canonical: "/digitaal-betalen" },
  openGraph: ogVoor("/digitaal-betalen"),
};

export default function Pagina() {
  return <DigitaalBetalenClient />;
}
