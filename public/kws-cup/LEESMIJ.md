# Bestanden voor de tornooipagina

Deze map wordt door `/kws-cup-2026` gebruikt. Zolang een bestand ontbreekt
toont de pagina daar een nette melding in plaats van een gebroken beeld.

| Bestand | Waarvoor |
|---|---|
| `plattegrond.jpg` | plattegrond van het terrein, klikbaar om te vergroten (staat er) |
| `circulatieplan.png` | het verkeersplan rond het terrein, klikbaar om te vergroten (staat er) |
| `tornooiblad-kbvb-kws.pdf` | het wedstrijdblad om af te drukken (ontbreekt nog) |
| `logos/<clubnaam>.png` | clublogo's, kleine letters met koppeltekens |

De logo's komen uit de Tornooiplanner: `python logos.py --klaarzetten` maakt
`export/logos/` met de juiste bestandsnamen, bijvoorbeeld `juve-hasselt.png`
en `rc-hades-kiewit-hasselt.png`. Kopieer die map naar `logos/`.

Het schema zelf staat niet hier maar in de Blob-opslag; dat komt van de
Tornooiplanner via `POST /api/kws-cup`.

De twee plannen komen uit `OneDrive\Documenten\kws\Tornooi\`
(`Veldindeling.jpg` en `Circulatieplan.png`) en zijn hier verkleind naar
1600 tot 1800 beeldpunten breed. Vervang je ze, doe dat dan met dezelfde
bestandsnamen.

Zolang het wedstrijdblad ontbreekt blijft de kaart "Bijlagen" onzichtbaar.
Zet het bestand erbij en voeg de regel toe die als commentaar bij `BIJLAGEN`
in `TornooiClient.tsx` staat.
