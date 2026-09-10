import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import VoedingPage from "./Client";

export const metadata: Metadata = {
  title: "Voeding voor jonge voetballers",
  description:
    "Wat een jeugdspeler best eet en drinkt voor, tijdens en na training of wedstrijd. De voedingsrichtlijnen van KWS Linkhout.",
  alternates: { canonical: "/medisch/voeding" },
  openGraph: ogVoor("/medisch/voeding"),
};

export default function Pagina() {
  return <VoedingPage />;
}
