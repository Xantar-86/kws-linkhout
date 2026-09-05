"use client";

import { useState } from "react";

/**
 * Hoelang de hero moet wachten voor hij zichzelf toont.
 *
 * Het probleem dat dit oplost: de hero animeert bij het aankoppelen van
 * React, maar bij het eerste bezoek ligt het openingsdoek daar dan nog
 * overheen. Zonder deze wachttijd speelt het mooiste gebaar van de site zich
 * af achter een zwart vlak, en staat de hero al stil tegen dat de bezoeker
 * hem te zien krijgt.
 *
 * Het scriptje in app/layout.tsx heeft al beslist of het doek speelt en heeft
 * dat op het html-element gezet. Hier lezen we alleen af wat daar staat:
 * geen doek betekent meteen beginnen, wel een doek betekent wachten tot het
 * halverwege opengetrokken is. Die overlap is met opzet, want de hero die
 * achter een wijkend doek al in beweging is, leest als één doorlopend gebaar
 * in plaats van als twee animaties na elkaar.
 *
 * Waarom dit in de beginwaarde van de state zit en niet in een effect
 * ---------------------------------------------------------------------
 * Een effect is hier te laat. framer-motion zet zijn animaties zelf in een
 * indelingseffect, en die van een kindcomponent lopen vóór die van de ouder.
 * De hero zou zijn wachttijd dus pas te weten komen nadat de animaties
 * eronder al vertrokken waren met een wachttijd van nul.
 *
 * De functie hieronder draait daarentegen tijdens het tekenen zelf, nog voor
 * er ook maar één effect aan de beurt is, en maar één keer.
 *
 * Dat de server nul teruggeeft en de client mogelijk 1,15 levert geen
 * verschil op tussen beide tekeningen: de wachttijd komt alleen in de
 * `transition` van framer terecht en niet in de opgeleverde HTML. Er valt dus
 * niets uit de pas te lopen.
 */
export function useOpeningVertraging(vertraging = 1.15) {
  const [wachten] = useState(() => {
    // Op de server bestaat er geen document en speelt er geen doek.
    if (typeof document === "undefined") return 0;
    return document.documentElement.dataset.opening === "over" ? 0 : vertraging;
  });

  return wachten;
}
