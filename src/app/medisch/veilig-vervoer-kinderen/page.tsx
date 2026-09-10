import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import VeiligVervoerKinderenPage from "./Client";

export const metadata: Metadata = {
  title: "Veilig vervoer van jeugdspelers",
  description:
    "Afspraken voor ouders en trainers die kinderen naar wedstrijden brengen: gordels, zitjes en verantwoordelijkheid.",
  alternates: { canonical: "/medisch/veilig-vervoer-kinderen" },
  openGraph: ogVoor("/medisch/veilig-vervoer-kinderen"),
};

export default function Pagina() {
  return <VeiligVervoerKinderenPage />;
}
