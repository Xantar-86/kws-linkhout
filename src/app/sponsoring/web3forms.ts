/**
 * De formulieren gaan via Web3Forms, met de sleutel van de maker van de
 * oorspronkelijke sponsorsite. Bij Web3Forms is bepaald naar wie de mail gaat.
 * De sleutel is bedoeld om in de pagina te staan; het gratis plan aanvaardt
 * enkel inzendingen vanuit de browser, niet vanaf een server.
 *
 * Een kopie meesturen kan op het gratis plan niet. Daarom een tweede sleutel,
 * op het adres van Joel Bynens: elk formulier gaat naar beide.
 */
const WEB3FORMS_SLEUTELS = [
  "4a359a84-fa74-4483-b0da-841394499c56", // maker van de sponsorsite
  "79288482-8fd4-4dce-be91-99d69e4ec3df", // Joel Bynens
];

/** De mail van een wedstrijdbal, zoals de maker het opgaf. */
export function balMail(data: Record<string, string>) {
  return {
    subject: `Wedstrijdbal bestelling - ${data.name}`,
    from_name: data.name,
    name: data.name,
    email: data.email,
    bedrijfsnaam: data.company || "-",
    adres: `${data.street}, ${data.zip} ${data.city}`,
    btw_nummer: data.vat || "-",
    telefoon: data.phone,
    voorkeur_wedstrijd: data.match || "-",
  };
}

/**
 * Naar beide sleutels versturen. Gelukt zodra het bij minstens een van beiden
 * aankwam: nog eens versturen zou de ander een dubbele mail geven.
 */
export async function stuurMail(mail: Record<string, string>): Promise<boolean> {
  const antwoorden = await Promise.all(
    WEB3FORMS_SLEUTELS.map((access_key) =>
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key, ...mail }),
      })
        .then((r) => r.json())
        .then((d) => Boolean(d.success))
        .catch(() => false)
    )
  );
  return antwoorden.some(Boolean);
}
