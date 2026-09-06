// app/word-lid/inhoud.ts
//
// De gegevens van de pagina, los van de weergave.
//
// Dit staat bewust niet in Client.tsx: een module met "use client" geeft aan
// de serverkant enkel verwijzingen terug en geen echte waarden, en dan kan de
// pagina de vragen niet meer omzetten naar de opmaak voor Google.

export const FORMULIER =
  "https://docs.google.com/forms/d/e/1FAIpQLSdU9K2xcf4JZp1rLe59JqVFvVnuWGZ5vVy1UMwD2a30jbmiPA/viewform";

/**
 * De vragen die op de pagina staan, zijn exact dezelfde die in de FAQ-opmaak
 * voor Google gaan. Verborgen vragen in de opmaak zetten is in strijd met de
 * richtlijnen, en dat risico is de moeite niet.
 */
export const VRAGEN = [
  {
    vraag: "Vanaf welke leeftijd kan mijn kind bij KWS Linkhout voetballen?",
    antwoord:
      "De jongste groep is de Voetbaltuin, onze U5. Die traint op woensdag van 18 tot 19 uur in " +
      "Linkhout en maakt spelenderwijs kennis met voetbal. Vanaf de U6 sluit je aan bij een ploeg " +
      "die ook wedstrijden speelt. Ervaring is nooit nodig.",
  },
  {
    vraag: "Mag mijn kind eerst een training komen proberen?",
    antwoord:
      "Ja. Een proeftraining is gratis en verplicht tot niets. Neem contact op met Maarten Cleeren, " +
      "onze AVJO, via info@kwslinkhout.be of 0494 84 36 93, en zeg erbij hoe oud je kind is.",
  },
  {
    vraag: "Wat kost het lidgeld?",
    antwoord:
      "Voor het seizoen 2026-2027 gaat het van € 130 voor de Voetbaltuin tot € 400 voor de " +
      "senioren. Het volledige overzicht per leeftijdsgroep staat op deze pagina.",
  },
  {
    vraag: "Wat zit er in het lidgeld?",
    antwoord:
      "De verzekering, de clubkledij met shirt, short en kousen, en de deelname aan de " +
      "clubactiviteiten. Voetbalschoenen en scheenbeschermers koop je zelf.",
  },
  {
    vraag: "Wat als het lidgeld op dit moment zwaar valt?",
    antwoord:
      "Dan zoeken we samen een oplossing, discreet. Er is de UiTPAS met kansentarief, er zijn " +
      "tussenkomsten van de gemeente Lummen en van het Sociaal Huis, en bij de club zelf kan je " +
      "het lidgeld in schijven betalen.",
  },
  {
    vraag: "Wat heb ik nodig om aan te sluiten?",
    antwoord:
      "Een geldige identiteitskaart en een pasfoto. Meer heeft de voetbalbond niet nodig om de " +
      "aansluiting in orde te brengen.",
  },
  {
    vraag: "Waar wordt er getraind?",
    antwoord:
      "Op twee plaatsen: in de Kapelstraat 72 in Linkhout, en in Zelem, dankzij de samenwerking " +
      "met Eendracht Zwart-Wit Zelem. Welke ploeg waar traint, staat in het trainingsschema.",
  },
];
