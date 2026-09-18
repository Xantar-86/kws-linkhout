# Toestemming beeldmateriaal jeugd

Het digitale broertje van het papieren formulier
`Toestemming_Beeldmateriaal_Jeugd_KWS_Linkhout.pdf`. Een ouder vult het op de
telefoon in, tekent met de vinger, en de club krijgt hetzelfde document terug
als wanneer het op papier was ingevuld.

## Waar het staat

| Wat | Waar |
| --- | --- |
| Het formulier | `/toestemming` (niet in het menu, niet in de sitemap, `noindex`) |
| Blanco sjabloon | `public/Docs/gdpr/Toestemming_Beeldmateriaal_Jeugd_KWS_Linkhout.pdf` |
| Aannemen en verwerken | `src/app/api/toestemming/route.ts` |
| Wachtrij voor de pc | `src/app/api/toestemming/wachtrij/route.ts` |
| Mappenwachter | `scripts/toestemming-wachter.mjs` |
| Velden, keuzes, nakijken | `src/lib/toestemming/velden.ts` |

Het adres is niet geheim maar wel onvindbaar: het gaat via de afgevaardigden
naar de ouders van een ploeg. Er staat nergens een link naartoe.

## Hoe het werkt

1. De ouder vult `/toestemming` in: gegevens van de speler, per kanaal een
   uitdrukkelijke ja of nee, en een handtekening die met de vinger of de muis
   getekend wordt. Vanaf 14 jaar verschijnt er ook een vak voor de speler zelf,
   want dat is de onderscheidingsleeftijd voor het recht op afbeelding.
2. De server vult **het echte clubdocument** in. Dat is een pdf-formulier met
   benoemde velden: vier tekstvakken, acht ja/nee-radiogroepen en drie
   handtekeningvakken. De getekende handtekeningen komen als beeld in die
   vakken. Daarna wordt het document afgevlakt: er is geen formulier meer en de
   antwoorden zijn niet meer aan te passen.
3. Onderaan komt een bewijsregel: via welk adres, op welke dag, op welk uur, van
   welk ip-adres en met welk kenmerk de toestemming gegeven is.
4. Het document wordt gemaild en tegelijk versleuteld in een wachtrij gezet.
5. De mappenwachter op de pc haalt het uit die wachtrij en zet het in
   `OneDrive\Documenten\KWS\GDPR\Goedkeuring Spelers\<ploeg>\`, als
   `Toestemming <naam speler> <ploeg>.pdf`, dus in de vorm
   `Toestemming Familienaam Voornaam U15.pdf`.

Mail en wachtrij zijn twee onafhankelijke afleveringen. Lukt er één, dan is het
formulier binnen; dat staat ook zo in het antwoord aan de ouder.

## Instellen

In `.env.local` en bij de omgevingsvariabelen van het Vercel-project:

```
TOESTEMMING_SLEUTEL=   # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
TOESTEMMING_MAIL_TO=   # leeg = SOCIAL_MAIL_TO
```

`TOESTEMMING_SLEUTEL` doet twee dingen: de mappenwachter meldt zich ermee aan bij
de wachtrij, en de inhoud van de wachtrij wordt ermee versleuteld. Zet exact
hetzelfde geheim op de site en op de pc.

`BLOB_READ_WRITE_TOKEN` en `RESEND_API_KEY` zijn er al voor de matchday-posts en
worden hier hergebruikt.

### Mailen naar een ander adres dan het Resend-account

Zolang er in Resend geen domein geverifieerd is, weigert Resend elke ontvanger
behalve het adres van het Resend-account zelf. De foutmelding is duidelijk:

> You can only send testing emails to your own email address. To send emails to
> other recipients, please verify a domain at resend.com/domains, and change the
> `from` address to an email using this domain.

Wil je de formulieren naar `jochen_thoelen@telenet.be` (of naar een clubadres)
laten mailen, dan moet `kwslinkhout.be` in Resend geverifieerd worden en moet
`SOCIAL_MAIL_FROM` een afzender op dat domein worden, bijvoorbeeld
`KWS Linkhout <toestemming@kwslinkhout.be>`. Dat lost tegelijk dezelfde
beperking op voor de matchday-mails.

Tot dan komt het formulier nog steeds binnen via de mappenwachter.

## De mappenwachter draaien

```powershell
# eenmalig, kijkt wat er klaarstaat en schrijft het weg
node scripts/toestemming-wachter.mjs

# blijven kijken, standaard elke 5 minuten
node scripts/toestemming-wachter.mjs --lus

# niets wegschrijven, enkel tonen wat hij zou doen
node scripts/toestemming-wachter.mjs --proef
```

Instellingen komen uit `.env.local` van het project, of uit de omgeving:

| Variabele | Standaard |
| --- | --- |
| `TOESTEMMING_SLEUTEL` | verplicht, uit `.env.local` |
| `TOESTEMMING_SITE` | `https://www.kwslinkhout.be` |
| `TOESTEMMING_MAP` | `%USERPROFILE%\OneDrive\Documenten\KWS\GDPR\Goedkeuring Spelers` |
| `TOESTEMMING_TUSSEN` | `300` (seconden tussen twee rondes in `--lus`) |

Elke regel gaat ook naar `logs/toestemming-wachter.log`, want als geplande taak
is er geen venster om naar te kijken. Boven een halve megabyte houdt het script
enkel de laatste helft bij.

### Als geplande taak

Op de pc van Jochen staat de taak **KWS toestemming wachter**, die elk kwartier
loopt. Ze roept niet rechtstreeks node aan maar
`scripts/toestemming-wachter-stil.vbs`, een starter die node zonder venster
opstart. Anders flitst er elk kwartier een zwart venster op het scherm: een
taak die als aangemelde gebruiker draait, krijgt een console.

Opnieuw aanmaken:

```powershell
$naam    = 'KWS toestemming wachter'
$project = 'F:\Projecten\websites\kws-linkhout'
$vbs     = Join-Path $project 'scripts\toestemming-wachter-stil.vbs'

Get-ScheduledTask -TaskName $naam -ErrorAction SilentlyContinue |
  Unregister-ScheduledTask -Confirm:$false

Register-ScheduledTask -TaskName $naam `
  -Action (New-ScheduledTaskAction -Execute 'wscript.exe' `
      -Argument "//nologo `"$vbs`"" -WorkingDirectory $project) `
  -Trigger (New-ScheduledTaskTrigger -Once -At ((Get-Date).AddMinutes(1)) `
      -RepetitionInterval (New-TimeSpan -Minutes 15)) `
  -Settings (New-ScheduledTaskSettingsSet -StartWhenAvailable `
      -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
      -RunOnlyIfNetworkAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries) `
  -Principal (New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" `
      -LogonType Interactive -RunLevel Limited)
```

Met beheerdersrechten kan `-LogonType S4U` in plaats van `Interactive`. Dan
draait de taak als echte achtergrondtaak, ook zonder aangemelde sessie, en is
de VBS-starter niet meer nodig: de taak mag dan rechtstreeks
`C:\Program Files\nodejs\node.exe` met `scripts\toestemming-wachter.mjs`
aanroepen.

Handmatig starten en nakijken:

```powershell
Start-ScheduledTask -TaskName 'KWS toestemming wachter'
Get-ScheduledTaskInfo -TaskName 'KWS toestemming wachter'
Get-Content .\logs\toestemming-wachter.log -Tail 20
```

Mislukt het wegschrijven, dan blijft de inzending in de wachtrij staan en
probeert de volgende ronde het opnieuw. Staat er al een formulier voor dezelfde
speler en is het identiek, dan blijft dat staan; wijkt het af, dan komt er een
nummer achter in plaats van dat het oude overschreven wordt.

## Wat er waar bewaard wordt

- De wachtrij staat in Vercel Blob. Blob-adressen zijn niet te raden maar wel
  openbaar leesbaar, en hier gaat het over namen, geboortedatums en
  handtekeningen van minderjarigen. Daarom staat er niets leesbaar in: de hele
  inhoud is versleuteld met AES-256-GCM, met een sleutel die alleen de site en
  de mappenwachter kennen. De lijst met wat er klaarstaat bevat enkel
  kenmerken, geen namen.
- Zodra de wachter het bestand heeft weggeschreven, verdwijnt het uit de
  wachtrij. Wat door een fout langer dan 30 dagen blijft staan, ruimt de site
  zelf op bij de volgende inzending.
- De pdf zelf wordt niet op de server bewaard. De blijvende kopie is het bestand
  in `Goedkeuring Spelers` en de bijlage in de mailbox.

## Als het document wijzigt

De veldnamen in `src/lib/toestemming/velden.ts` moeten overeenkomen met de
namen in het pdf-bestand. Namen opvragen:

```bash
node -e "const {PDFDocument}=require('pdf-lib');const fs=require('fs');(async()=>{const p=await PDFDocument.load(fs.readFileSync('public/Docs/gdpr/Toestemming_Beeldmateriaal_Jeugd_KWS_Linkhout.pdf'));for(const f of p.getForm().getFields())console.log(f.constructor.name,JSON.stringify(f.getName()))})()"
```

Let op twee dingen bij een nieuw sjabloon:

- De ja/nee-vakjes moeten radiogroepen blijven met exportwaarden `Ja` en `Nee`.
- Handtekeningvelden kan `pdf-lib` niet met `removeField` verwijderen: zo'n veld
  heeft geen weergave-stroom en de bibliotheek valt daarover. `pdf.ts` haalt die
  velden daarom zelf uit de veldenlijst en van de pagina.
- `pdf-lib` laat bij het afvlakken van radiogroepen verwijzingen naar
  verwijderde vakjes achter in `/Annots`. Een lezer die de annotaties opvraagt
  geeft dan een fout. `pdf.ts` ruimt die verwijzingen op; haal dat niet weg.
