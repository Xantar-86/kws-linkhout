// components/Clubgegevens.tsx
//
// De club als gestructureerde gegevens, voor zoekmachines.
//
// Dit is de enige plek waar de gegevens van de club machineleesbaar staan.
// Google leidt hier het kennispaneel uit af: naam, adres, telefoon, logo, de
// sociale kanalen en het feit dat dit een voetbalclub is en geen winkel. Tot
// nu toe stond er nergens op de site zulke opmaak, en dan moet een zoekmachine
// alles uit de lopende tekst raden.
//
// Eén blok volstaat voor de hele site, dus het staat in de layout. De
// verwijzingen (#club en #terrein) laten toe dat een evenement of een
// nieuwsbericht straks naar deze gegevens verwijst in plaats van ze te
// herhalen.

const CLUB = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsOrganization",
      "@id": "https://www.kwslinkhout.be/#club",
      name: "K.W.S. Linkhout",
      alternateName: ["KWS Linkhout", "Koninklijke White Star Linkhout"],
      description:
        "Voetbalclub uit Linkhout bij Lummen, sinds 1938. Vijfentwintig ploegen van U6 tot " +
        "veteranen, waaronder zes dames- en meisjesploegen.",
      url: "https://www.kwslinkhout.be",
      logo: "https://www.kwslinkhout.be/images/logo-kws.png",
      image: "https://www.kwslinkhout.be/images/teams/1ste-ploeg-2025.jpg",
      foundingDate: "1938",
      sport: "Voetbal",
      email: "info@kwslinkhout.be",
      telephone: "+3213444757",
      identifier: {
        "@type": "PropertyValue",
        name: "KBVB-stamnummer",
        value: "03531",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kapelstraat 72",
        postalCode: "3560",
        addressLocality: "Linkhout",
        addressRegion: "Limburg",
        addressCountry: "BE",
      },
      areaServed: [
        { "@type": "City", name: "Lummen" },
        { "@type": "City", name: "Halen" },
        { "@type": "City", name: "Herk-de-Stad" },
        { "@type": "City", name: "Beringen" },
      ],
      memberOf: {
        "@type": "SportsOrganization",
        name: "Koninklijke Belgische Voetbalbond",
        url: "https://www.rbfa.be",
      },
      sameAs: [
        "https://www.facebook.com/kwslinkhout/",
        "https://www.facebook.com/jeugdkws/",
      ],
      location: { "@id": "https://www.kwslinkhout.be/#terrein" },
    },
    {
      "@type": "SportsActivityLocation",
      "@id": "https://www.kwslinkhout.be/#terrein",
      name: "Sportterrein KWS Linkhout",
      url: "https://www.kwslinkhout.be/contact",
      telephone: "+3213444757",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kapelstraat 72",
        postalCode: "3560",
        addressLocality: "Linkhout",
        addressRegion: "Limburg",
        addressCountry: "BE",
      },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Kantine", value: true },
        { "@type": "LocationFeatureSpecification", name: "Gratis parking", value: true },
        { "@type": "LocationFeatureSpecification", name: "AED aanwezig", value: true },
        { "@type": "LocationFeatureSpecification", name: "Toegankelijk voor rolstoelen", value: true },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.kwslinkhout.be/#site",
      url: "https://www.kwslinkhout.be",
      name: "KWS Linkhout",
      inLanguage: "nl-BE",
      publisher: { "@id": "https://www.kwslinkhout.be/#club" },
    },
  ],
};

export function Clubgegevens() {
  return (
    <script
      type="application/ld+json"
      // De inhoud is een vaste constante uit dit bestand, geen invoer van
      // buitenaf, dus hier valt niets te injecteren.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(CLUB) }}
    />
  );
}
