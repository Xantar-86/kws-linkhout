# Hoe de matchday-affiches gemaakt worden

De affiches worden **samengesteld op het echte sjabloon**. Het sjabloon wordt
pixel voor pixel overgenomen en er komt enkel tekst en een logo overheen.

Dat is een bewuste keuze. We hebben het eerst met een tekenmodel geprobeerd
(Qwen-Image-Edit op de eigen pc, zie [COMFYUI_AFFICHES.md](COMFYUI_AFFICHES.md)).
Dat vulde de affiche wel in, maar schreef "HEREN PA - VOLGENIS WEDSTREDD" waar
"HEREN P4 - VOLGENDE WEDSTRIJD" moest staan, en verminkte onderweg de woorden
VELD en KANTINE. Meer stappen hielpen de opmaak maar niet de spelling. Vijf
tekstvakken foutloos krijgen zit er bij zo'n model niet in.

Samenstellen duurt ongeveer een seconde per affiche, kost niets, en de tekst
klopt per definitie.

## Wat er ingevuld wordt

| Plek op het sjabloon | Wedstrijd | Uitslag |
| --- | --- | --- |
| Brede rode balk | datum voluit + aftrapuur | de eindstand |
| Ovale omlijning | ploeg + "VOLGENDE WEDSTRIJD" | ploeg + "UITSLAG" |
| Linker penseelvlak | thuisploeg: logo + naam | idem, met doelpuntenmakers |
| Rechter penseelvlak | uitploeg: logo + naam | idem, met doelpuntenmakers |
| Tussen de vlakken | "VS" | niets |
| Onder VELD | naam, straat en gemeente van het terrein | idem |
| Onder KANTINE | de club van het terrein | idem |

De thuisploeg staat altijd links. Speelt Linkhout op verplaatsing, dan staat ons
schild dus rechts en het logo van de tegenstander links.

## Waar de gegevens vandaan komen

Alles komt van de KBVB, per wedstrijd. Ook het terrein: hun feed geeft
`location` mee met naam, straat, postcode en gemeente. Dat is belangrijker dan
het lijkt, want het clubadres invullen bij elke thuiswedstrijd gaat mis zodra er
een tornooi op een ander veld gespeeld wordt. Op 16 augustus 2026 stond Linkhout
bijvoorbeeld als thuisploeg genoteerd terwijl er bij VK Gestel gespeeld werd.

De kantine volgt om dezelfde reden het terrein en niet wie er thuis staat. Op
eigen veld is het onze kantine met "Iedereen welkom voor en na de wedstrijd";
elders is het die van de gastclub met "Kom onze ploeg mee steunen".

## De logo's

Ons eigen schild komt uit `schild-kws.png`, uitgesneden uit het clublogo zonder
de twee zijlijnen, zodat het even zwaar weegt als het logo van de tegenstander.

Het logo van de tegenstander komt van de KBVB en is **ongeveer 65 bij 100
pixels**. Dat is de bron, en scherper dan de bron kan niemand het maken. Daarom
staat het op de affiche op een wit schijfje van iets meer dan honderd pixels: zo
goed als niet opgeblazen, en daarmee valt het niet op.

## Draaien

Op de pc, met de snelkoppeling **KWS Affiches maken**:

```
C:\Personal\KWS-Affiches\maak-affiches.mjs
```

Dat programma vraagt de site welke affiches ontbreken, stelt ze samen en stuurt
ze terug. Eén ploeg proberen kan met `node maak-affiches.mjs heren-p2`.

Elke affiche wordt ook lokaal bewaard als `laatste-{ploeg}-{soort}.png`.

## Nog te doen

Het samenstellen gebeurt nu op de pc omdat het lettertype Impact daar staat. Wil
je dat het zonder je pc werkt, dan moet er een lettertype meegeleverd worden aan
de kant van Vercel. Dan kan de hele keten daar draaien en hoeft er niets meer
aan te staan.
