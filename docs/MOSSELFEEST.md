# Mosselfeest: inschrijvingen en logboek

Inschrijven gebeurt op `/mosselfeest`. De organisatoren zien de totalen op
`/mosselfeest/overzicht`, en in OneDrive staat een Excel-bestand dat elk
kwartier bijgewerkt wordt. Doel: niet meer handmatig tellen hoeveel van wat er
besteld moet worden.

Er zijn vier schermen, alle vier achter hetzelfde wachtwoord:

| Scherm | Waarvoor |
| --- | --- |
| `/mosselfeest` | inschrijven, openbaar |
| `/mosselfeest/overzicht` | de lijst, de totalen, kaarten intypen, betaald afvinken |
| `/mosselfeest/kassa` | het avondscherm: zoeken, afvinken, iets bijzetten |
| `/mosselfeest/afdruk` | bonnetjes per inschrijving of een keukenlijst per zitting |
| `/mosselfeest/voorraad` | voorzien tegenover besteld, per dag |

## Plaatsen per zitting

Op de kaart staat per zitting een maximum: 200, 200, 175 en 175 plaatsen.
Afhalen heeft geen grens.

Een plaats is een stoel aan tafel, dus we tellen enkel de hoofd- en
kindergerechten mee; een dessert is geen extra stoel. Dat staat per gerecht in
`teltAlsPlaats`.

Het formulier toont per zitting hoeveel er nog vrij is en laat een volle
zitting niet meer kiezen. De server kijkt het bij het versturen nog eens na,
want tussen het openen van de pagina en het versturen kan er iemand anders
geweest zijn. Een organisator kan via **Kaart of stapel toevoegen** wel boven
het maximum gaan: die weet best of er nog een tafel bij kan.

## Waar wat staat

| Wat | Waar |
| --- | --- |
| De kaart: gerechten, prijzen, zittingen, rekening | `src/lib/mosselfeest/kaart.ts` |
| Het formulier | `src/app/mosselfeest/` |
| Het overzicht voor de organisatoren | `src/app/mosselfeest/overzicht/` |
| Inschrijving aannemen | `src/app/api/mosselfeest/route.ts` |
| Totalen, betaald afvinken, schrappen | `src/app/api/mosselfeest/beheer/route.ts` |
| Het Excel-logboek | `src/app/api/mosselfeest/logboek/route.ts` en `src/lib/mosselfeest/logboek.ts` |
| Opslag van de inschrijvingen | `src/lib/mosselfeest/opslag.ts` |
| Het bestand naar OneDrive halen | `scripts/mosselfeest-logboek.mjs` |

Beide pagina's staan niet in het menu, niet in de sitemap en op `noindex`, met
ook een `X-Robots-Tag` in `next.config.ts`.

## De kaart aanpassen

Alles zit in `src/lib/mosselfeest/kaart.ts`: één lijst `GERECHTEN` met per
gerecht een id, de naam zoals op de kaart, een prijs en een groep, plus
`EVENEMENT` met de datums, de zittingen en het rekeningnummer. Het formulier,
de berekening, het overzicht en het Excel-bestand leiden zich daaruit af, dus
er hoeft nergens anders iets aangepast te worden.

Laat het `id` van een gerecht ongewijzigd zodra er inschrijvingen zijn: dat id
staat in de bewaarde inschrijvingen. Een naam of prijs wijzigen mag wel.

Zet `VOORLOPIG` op `false` zodra de kaart klopt.

## Instellen

```
MOSSELFEEST_SLEUTEL=      # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
MOSSELFEEST_WACHTWOORD=   # wat de organisatoren intypen op het overzicht
MOSSELFEEST_MAIL_TO=      # leeg = SOCIAL_MAIL_TO
MOSSELFEEST_MAIL_FROM=    # leeg = "KWS Mosselfeest" op het adres uit SOCIAL_MAIL_FROM
MOSSELFEEST_SAMENVATTING= # exact "aan" voor de dagelijkse mail naar de club
```

`MOSSELFEEST_SLEUTEL` versleutelt de inschrijvingen in de opslag en geeft het
script op de pc toegang tot het logboek. `MOSSELFEEST_WACHTWOORD` is het
wachtwoord van de overzichtspagina; dat mag iets zijn dat mensen kunnen
onthouden, want het staat nergens anders voor open.

`BLOB_READ_WRITE_TOKEN` en `RESEND_API_KEY` zijn er al.

## Kaartnummers

De gedrukte kaarten die rondgaan beginnen bij 001. Online inschrijvingen
krijgen een nummer vanaf **1001**, zodat de twee reeksen niet overlappen en je
aan het nummer meteen ziet dat het een online reservatie is.

Het nummer wordt toegekend als het hoogste bestaande plus een, niet als een
telling. Schrap je een inschrijving, dan komt haar nummer dus niet opnieuw vrij
voor iemand anders: een nummer hoort voor altijd bij één kaart.

Bij een afgegeven papieren kaart typt de organisator het nummer van het blad
over. Nummers vanaf 1001 worden daar geweigerd, die zijn voor online.

De mededeling bij een overschrijving is `Mossel2026 <nummer>`, bijvoorbeeld
`Mossel2026 1001`. Kort en zonder naam, zodat ze op een rekeninguittreksel
volledig leesbaar blijft.

## Het moment mag ontbreken

In het bestand van het bestuur stond bij een aantal inschrijvingen geen moment
ingevuld. Dat kan hier ook: laat de zitting leeg en de inschrijving telt mee in
het totaal, met op het overzicht een aparte vermelding "zonder zitting". Beter
dat dan iets verzinnen.

## Een inschrijving wijzigen

Op het overzicht en op het avondscherm staat bij elke regel een potlood. Daar
wijzig je de naam, de zitting, de aantallen en de opmerking. Het bedrag wordt
opnieuw berekend en het kaartnummer blijft wat het was, want dat staat op het
papier van de gast. Wie de wijziging deed en wanneer wordt bijgehouden.

Dat is nodig op de avond zelf: iemand wil er nog een portie bij. Zonder deze
mogelijkheid werd dat een tweede inschrijving met een nieuw nummer, en dan
kloppen de aantallen niet meer.

## Het avondscherm

`/mosselfeest/kassa`, gemaakt voor de laptop aan de kassa. Zoeken op
kaartnummer of naam, Enter neemt de eerste treffer. Rechts staat de bestelling
groot, met het bedrag en één brede knop om betaald af te vinken. Werkt ook op
een tablet, waar de twee kolommen onder elkaar schuiven.

## Afdrukken

`/mosselfeest/afdruk`, met twee soorten:

- **Bonnetjes**: één kadertje per inschrijving, zoals de online inschrijvingen
  vroeger werden afgedrukt om mee naar de keuken te geven.
- **Keukenlijst**: per zitting de totalen per gerecht met de namen eronder.

Beide kan je beperken tot één zitting of tot de onbetaalde. De keuzebalk
verdwijnt bij het afdrukken.

## Voorraad per dag

`/mosselfeest/voorraad` is het vroegere blad "LeftOvers": per dag en per gerecht
vul je in hoeveel er voorzien is, en ernaast staat wat er besteld is en wat er
dus nog aan de deur verkocht kan worden. Staat er een negatief getal, dan is er
meer besteld dan voorzien.

De voorraad staat als apart versleuteld blokje in de opslag, buiten de map met
inschrijvingen. Dat is niet toevallig: alles in die map wordt als inschrijving
gelezen.

## Welke mails er vertrekken

- **Per inschrijving**: één verzending met de bevestiging naar de inschrijver
  en de club in blinde kopie. Dat scheelt de helft van het mailtegoed
  tegenover twee aparte mails, en de club heeft toch dezelfde bevestiging in
  de mailbox.
- **Eén keer per dag**: een samenvatting naar de club met wat er die dag bijkwam
  en hoeveel van wat er besteld moet worden.

Er gaat dus géén mail per inschrijving naar de club. Dat was dubbel werk naast
de overzichtspagina en het logboek, en het verbruikt mailtegoed: op het gratis
plan van Resend zijn dat 100 mails per dag en 3.000 per maand. Loopt de
aankondiging goed, dan kan er op één avond een pak inschrijvingen binnenkomen,
en dan wil je die dagteller niet aan jezelf verspillen.

Een mail die niet vertrekt kost nooit een inschrijving: die wordt bewaard vóór
er gemaild wordt, en staat daarna op de overzichtspagina en in het logboek.

Zolang er in Resend geen domein geverifieerd is, weigert Resend elke ontvanger
behalve het adres van het Resend-account zelf. De bevestiging naar de
inschrijver komt dan niet aan. Zie [TOESTEMMING.md](TOESTEMMING.md).

### De dagelijkse samenvatting aanzetten

Twee sloten, zodat er niets ongewild vertrekt:

1. `MOSSELFEEST_SAMENVATTING=aan` in Vercel. Staat die er niet, dan draait het
   eindpunt als droge proef: je ziet in het antwoord wat er zou vertrekken en
   er gaat niets de deur uit.
2. Het `schedule`-blok in `.github/workflows/mosselfeest-samenvatting.yml`, dat
   bewust uitgeschakeld staat. Probeer eerst met de hand
   (`workflow_dispatch`), en zet de planning daarna aan.

Uitproberen zonder te versturen:

```bash
curl -H "Authorization: Bearer $MOSSELFEEST_WACHTWOORD"   "https://www.kwslinkhout.be/api/mosselfeest/samenvatting?droog=1"
```

Met `?uren=48` vang je een overgeslagen dag op.

## Kaarten die op papier zijn afgegeven

Niet alles gebeurt online, en het totaal moet toch kloppen. Op
`/mosselfeest/overzicht` staat daarvoor **Kaart of stapel toevoegen**, met twee
manieren:

- **Eén afgegeven kaart**: met naam en zitting, zodat je achteraf nog weet wie
  wat besteld heeft en of er betaald is. Betaald staat standaard aan, want een
  kaart wordt meestal contant afgerekend.
- **Stapel kaarten**: een verzamelpost zonder namen, met een toelichting zoals
  "kaarten kantine week 1". Voor wanneer één per één intypen niet opweegt tegen
  de moeite, bijvoorbeeld 83 mosselen in één keer. De zitting mag hier leeg
  blijven; die porties tellen dan mee in het totaal en staan op het overzicht
  apart vermeld als "zonder zitting".

Beide komen als gewone inschrijving in dezelfde lijst, dus in hetzelfde totaal,
op het overzicht en in het Excel-logboek. De kolom **Bron** in het logboek zegt
waar een regel vandaan komt: `online`, `kaart` of `stapel`. Bovenaan het blad
Overzicht staat de verdeling.

Vul dit dus **niet** in Excel aan: dat bestand wordt elke ronde opnieuw gemaakt
en je regels zouden verdwijnen.

## Het Excel-logboek

Twee bladen:

- **Overzicht**: de totalen. Inschrijvingen, porties, bedrag, betaald, nog te
  ontvangen, per zitting, en per gerecht hoeveel er besteld moet worden.
- **Inschrijvingen**: één regel per inschrijving met een kolom per gerecht. De
  totaalregel bovenaan gebruikt `SUBTOTAL`, dus als je filtert (bijvoorbeeld op
  één zitting) rekenen de aantallen mee.

Het bestand wordt bij elke aanvraag volledig opnieuw gemaakt uit de
inschrijvingen. **Wijzig het dus niet zelf**: je wijzigingen verdwijnen bij de
volgende ronde. Betaald afvinken en inschrijvingen schrappen doe je op
`/mosselfeest/overzicht`; daar staat de waarheid.

Ophalen naar OneDrive:

```powershell
node scripts/mosselfeest-logboek.mjs          # eenmalig
node scripts/mosselfeest-logboek.mjs --lus    # blijven kijken, elk kwartier
```

Standaard komt het bestand in
`%USERPROFILE%\OneDrive\Documenten\KWS\Mosselfeest\`. Is er niets gewijzigd,
dan blijft het bestaande bestand staan, zodat OneDrive niet elke ronde opnieuw
moet synchroniseren. Elke regel gaat ook naar
`logs/mosselfeest-logboek.log`.

Als geplande taak werkt het net als bij de toestemmingen; zie
[TOESTEMMING.md](TOESTEMMING.md) voor het commando, met
`scripts\mosselfeest-logboek.mjs` in plaats van de wachter.

## Wat er bewaard wordt

Elke inschrijving is één versleuteld blokje in Vercel Blob, onder
`mosselfeest/<jaar>/`. Namen, e-mailadressen, telefoonnummers en bedragen staan
daar dus niet leesbaar in. Ze blijven staan tot na het feest: dit is geen
wachtrij maar de ledenlijst van de avond. Ruim ze na het feest op, dan blijven
er geen persoonsgegevens rondslingeren.

## De foto

`public/images/mosselfeest/mosselen-en-friet.jpg` is gemaakt met
`@cf/black-forest-labs/flux-1-schnell` via de Cloudflare-sleutel van het
project. Heb je een echte foto van een vorige editie, dan is die beter: zelfde
bestandsnaam eroverheen zetten volstaat.
