import type { Metadata } from "next";
import KampOverzicht from "./Client";

export const metadata: Metadata = {
  title: "Overzicht voetbalkamp",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return <KampOverzicht />;
}
