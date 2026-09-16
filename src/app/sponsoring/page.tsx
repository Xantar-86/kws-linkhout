import type { Metadata } from "next";
import { ogVoor } from "@/lib/seo";
import SponsoringClient from "./Client";

/**
 * Sponsor worden.
 *
 * Tot september 2026 stond dit op een aparte site, sponsoring.kwslinkhout.be.
 * Nu staat het in de clubsite zelf, in dezelfde stijl, zodat een ondernemer
 * die de club bekijkt niet ineens op een andere site belandt, en zodat de
 * pagina meetelt voor kwslinkhout.be in plaats van voor een subdomein.
 *
 * De formules en bedragen staan in inhoud.ts.
 *
 * sponsoring.kwslinkhout.be verwijst sinds september 2026 met een 301 hierheen
 * (ingesteld in Cloudflare door de maker van de oude site).
 */
export const metadata: Metadata = {
  title: "Sponsor worden: formules en Project Linkwood Park",
  description:
    "Word sponsor van KWS Linkhout in Lummen. Silver, Gold en Platinum met reclameborden, shirtlogo " +
    "en VIP-event, het Project Linkwood Park voor nieuwe kleedkamers, of een wedstrijdbal vanaf 150 euro.",
  alternates: { canonical: "/sponsoring" },
  openGraph: ogVoor("/sponsoring"),
};

export default function Pagina() {
  return <SponsoringClient />;
}
