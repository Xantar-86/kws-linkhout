# Mosselfeest: inschrijvingen en logboek

Inschrijven gebeurt op `/mosselfeest`. De organisatoren zien de totalen op
`/mosselfeest/overzicht`, en in OneDrive staat een Excel-bestand dat elk
kwartier bijgewerkt wordt. Doel: niet meer handmatig tellen hoeveel van wat er
besteld moet worden.

> **Nog niet in gebruik.** Deze functie staat op de branch `mosselfeest` en is
> nog niet uitgerold. De kaart in `src/lib/mosselfeest/kaart.ts` is een
> voorlopige opzet: de gerechten, prijzen, datums en zittingen moeten nog
> vervangen worden door wat er gedrukt is. Zolang `VOORLOPIG` daar op `true`
> staat, waarschuwt het formulier de bezoeker daarover.

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
```

`MOSSELFEEST_SLEUTEL` versleutelt de inschrijvingen in de opslag en geeft het
script op de pc toegang tot het logboek. `MOSSELFEEST_WACHTWOORD` is het
wachtwoord van de overzichtspagina; dat mag iets zijn dat mensen kunnen
onthouden, want het staat nergens anders voor open.

`BLOB_READ_WRITE_TOKEN` en `RESEND_API_KEY` zijn er al.

Let op: zolang er in Resend geen domein geverifieerd is, komt de bevestiging
naar de inschrijver niet aan; de mail naar de club wel, want dat is het adres
van het Resend-account. Zie [TOESTEMMING.md](TOESTEMMING.md). Daarom is de mail
nooit de enige plek waar een inschrijving staat.

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
