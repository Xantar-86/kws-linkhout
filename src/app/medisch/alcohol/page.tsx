import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import AlcoholPage from "./Client";

export const metadata: Metadata = {
  title: "Alcoholbeleid van de club",
  description:
    "Geen alcohol voor minderjarigen en verantwoord gebruik in de kantine. Het alcoholbeleid van KWS Linkhout in Lummen.",
  alternates: { canonical: "/medisch/alcohol" },
  openGraph: ogVoor("/medisch/alcohol"),
};

export default function Pagina() {
  return <AlcoholPage />;
}
