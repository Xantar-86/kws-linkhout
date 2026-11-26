import { headers } from "next/headers";

/** De basis-URL van de site zoals de bezoeker ze gebruikt (localhost of www). */
export async function basisUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "www.kwslinkhout.be";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
