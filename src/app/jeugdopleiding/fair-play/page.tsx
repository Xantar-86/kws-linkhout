import type { Metadata } from "next";
import FairPlayClient from "./Client";

export const metadata: Metadata = {
  title: "Fair play: onze gedragsregels",
  description:
    "De afspraken voor spelers, ouders en trainers van KWS Linkhout, op en naast het veld.",
  alternates: { canonical: "/jeugdopleiding/fair-play" },
};

export default function Pagina() {
  return <FairPlayClient />;
}
