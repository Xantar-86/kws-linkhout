import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import ContactClient from "./Client";

export const metadata: Metadata = {
  title: "Contact, adres en bereikbaarheid",
  description:
    "KWS Linkhout, Kapelstraat 72 in Linkhout bij Lummen. Contactpersonen per ploeg, de weg naar het terrein en naar de tweede locatie in Zelem.",
  alternates: { canonical: "/contact" },
  openGraph: ogVoor("/contact"),
};

export default function Pagina() {
  return <ContactClient />;
}
