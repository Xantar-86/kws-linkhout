import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import VoorstellingPage from "./Client";

export const metadata: Metadata = {
  title: "Het medisch beleid van de club",
  description:
    "Hoe KWS Linkhout de veiligheid en gezondheid van zijn spelers bewaakt: preventie, EHBO, AED en opvolging van blessures.",
  alternates: { canonical: "/medisch/voorstelling" },
  openGraph: ogVoor("/medisch/voorstelling"),
};

export default function Pagina() {
  return <VoorstellingPage />;
}
