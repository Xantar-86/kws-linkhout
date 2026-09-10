import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import ClubinfoClient from "./Client";

export const metadata: Metadata = {
  title: "Clubinfo: bestuur, reglementen en structuur",
  description:
    "Alles over de werking van KWS Linkhout: het organigram, het huishoudelijk reglement, de privacyverklaring en het aanspreekpunt integriteit. Stamnummer 03531.",
  alternates: { canonical: "/clubinfo" },
  openGraph: ogVoor("/clubinfo"),
};

export default function Pagina() {
  return <ClubinfoClient />;
}
