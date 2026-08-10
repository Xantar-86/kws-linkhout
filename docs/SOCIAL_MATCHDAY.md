# Automatische matchday-posts

Twee soorten posts op Facebook en Instagram, voor vier ploegen: de
aankondiging van de volgende wedstrijd en de uitslag erna. Niets vertrekt
zonder jouw goedkeuring.

## Ploegen

| Slug | Ploeg | RBFA-ploeg-ID |
| --- | --- | --- |
| `heren-p2` | Eerste ploeg heren, 2 Provinciaal | 365216 |
| `heren-p4` | Tweede ploeg heren, 4 Provinciaal | 365215 |
| `dames-p1` | Eerste ploeg dames, Vrouwen 1 Provinciaal | 365217 |
| `dames-p2` | Tweede ploeg dames, Vrouwen 2 Provinciaal | 372245 |

## Hoe het loopt

**Aankondiging, woensdag om 18u00.** De cron roept `/api/social/preview` aan.
Die haalt per ploeg de eerstvolgende wedstrijd op bij de RBFA, bouwt de tekst
en de affiche, en mailt je één overzicht met de vier ploegen.

**Uitslag, zodra bekend.** De cron roept `/api/social/uitslag-preview` ieder
uur aan na een speeldag. Zodra de RBFA het wedstrijdblad verwerkt heeft, staan
de eindstand en de doelpuntenmakers erin en krijg jij de post ter goedkeuring.
Elke wedstrijd wordt maar één keer gemeld.

In beide mails staan per ploeg twee knoppen: **Goedkeuren en posten** en
**Aanpassen**. Allebei openen ze dezelfde goedkeuringspagina, de tweede meteen
met de tekst open om te bewerken. Daar kies je Facebook, Instagram of allebei.

Doe je niets, dan gebeurt er niets. De links vervallen na vijf dagen.

## De affiche

De affiche wordt gemaakt in ChatGPT, op basis van de twee lege clubsjablonen in
`public/images/social/`. Dat is een bewuste keuze: beeldgeneratie via een API is
nergens meer gratis (Google geeft nul quota voor beeld, HuggingFace tien cent per
maand, Cloudflare ongeveer één affiche per dag), terwijl de webinterface van
ChatGPT het wel gratis en in de juiste kwaliteit doet.

De werkverdeling:

1. De bot haalt de gegevens op en zet per ploeg een kant-en-klare opdracht klaar
   op [`/matchday/opdrachten`](../src/app/matchday/opdrachten/page.tsx), samen met
   het logo van de tegenstander.
2. Jij plakt die opdracht in een ChatGPT-project waarin beide sjablonen als
   bijlage staan, sleept het logo erbij, en bewaart het beeld in de map van die
   ploeg onder `C:\KWS-affiches\`.
3. De mappenwachter op de pc (`C:\Personal\KWS-Affiches\wachter.ps1`, met een
   snelkoppeling op het bureaublad) stuurt het beeld naar
   `/api/social/affiche-upload`, waar het aan de juiste wedstrijd gekoppeld en in
   Supabase Storage bewaard wordt.
4. De goedkeuringsmail gebruikt dat beeld. Staat er geen, dan valt de affiche
   terug op een zelf getekende versie, zodat de keten nooit stilvalt.

Reken op ongeveer een halve minuut werk per affiche.

De opdrachtpagina is beveiligd met `MATCHDAY_SLEUTEL` in de URL, zodat je hem kan
bookmarken zonder inlogscherm. Diezelfde sleutel gebruikt de wachter, en staat
lokaal in `C:\Personal\KWS-Affiches\sleutel.txt`.

**Wil de club later toch overstappen op volledig automatisch**, dan kost de
OpenAI-API met `gpt-image-2` ongeveer zeventig euro per jaar bij acht posts per
week. De promptopbouw in [`affiche-ai.ts`](../src/lib/social/affiche-ai.ts) is
daar al op voorbereid; alleen de aanroep moet omgezet worden.

## De zelf getekende terugval

De afbeelding wordt gegenereerd in 1080x1350 naar het clubsjabloon: geschilderde
vlakken, de clublogo's uit de RBFA-databank, en onderaan de veldstrook met de
praktische info. Twee varianten, `WEDSTRIJD` en `UITSLAG`.

De fotostrook onderaan is voorlopig getekend. Zet een echte foto als
`public/images/social/veld.jpg` (of `.png`) en die wordt automatisch gebruikt,
zonder codewijziging. Aanbevolen formaat: 1080 breed, ongeveer 322 hoog.

Lettertypes staan in `public/fonts/`: Anton voor de koppen en de score, Inter
voor de rest. Wil je een ander display-font, zet dan een `.ttf` als
`public/fonts/matchday.ttf`.

## De template aanpassen

De tekst staat in [`content/social/matchday-template.json`](../content/social/matchday-template.json),
niet in de code. Er is een aparte versie voor thuis- en uitwedstrijden.

Beschikbare placeholders:

| Placeholder | Voorbeeld |
| --- | --- |
| `{ploeg}` | Eerste ploeg |
| `{reeks}` | Provinciale 2 |
| `{thuisploeg}` | KWS Linkhout |
| `{uitploeg}` | Sporting Tessenderlo |
| `{tegenstander}` | Sporting Tessenderlo |
| `{datum}` | zaterdag 15 augustus |
| `{tijd}` | 20u00 |
| `{datumKort}` | ZA 15 AUG |
| `{locatie}` | Kapelstraat 72, 3560 Linkhout |
| `{hashtags}` | #kwslinkhout #eersteploeg |

Een regel waarvan alle placeholders leeg blijven valt automatisch weg. Bij een
uitwedstrijd zonder gekend adres verdwijnt de regel met `📍 {locatie}` dus
vanzelf, er blijft geen kaal icoontje staan.

Onder `afbeelding` pas je de kop, de labels en de kleuren van de graphic aan.

### Voorbeeld bekijken

```bash
npm run dev
```

Ga naar <http://localhost:3000/matchday/template>. Die pagina toont per ploeg de
afbeelding en de tekst zoals ze gepost zouden worden. Ze is alleen bereikbaar
tijdens ontwikkeling, niet in productie.

Wil je een eigen lettertype op de afbeelding? Zet een `.ttf` of `.otf` in
`public/fonts/matchday.ttf`. Wordt automatisch opgepikt.

## Instellen

### 1. Geheimen genereren

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Doe dat twee keer, voor `SOCIAL_SECRET` en `CRON_SECRET`.

### 2. Meta-app aanmaken

1. Ga naar <https://developers.facebook.com/apps> en maak een app van het type
   **Business**.
2. Voeg het product **Facebook Login for Business** toe.
3. Vraag de permissies `pages_manage_posts`, `pages_read_engagement`,
   `instagram_basic` en `instagram_content_publish`.
4. Haal via de Graph API Explorer een gebruikerstoken op, wissel dat in voor een
   langlevend token, en vraag daarmee het **pagina-token** op via
   `GET /me/accounts`. Dat pagina-token vervalt niet.
5. Voor productiegebruik moet de app door **App Review**. Zolang dat niet rond
   is, werkt het enkel voor beheerders van de app.

Pagina-ID vind je via `GET /me/accounts`, het Instagram-account-ID via
`GET /{page-id}?fields=instagram_business_account`.

> Instagram werkt alleen met een **Business- of Creator-account** dat gekoppeld
> is aan de Facebook-pagina. Een persoonlijk account kan niet.

### 3. Omgevingsvariabelen

Alles staat in [`.env.example`](../.env.example). Op Vercel zet je dezelfde
variabelen onder Settings > Environment Variables.

`SOCIAL_LIVE` blijft op `false` tot je alles getest hebt. In die stand toont
goedkeuren enkel wat er zou gebeuren.

### 4. Opslag

Koppel in het Vercel-dashboard een **Blob**-store aan het project: Storage >
Create > Blob. Vercel zet `BLOB_READ_WRITE_TOKEN` dan automatisch klaar. Daar
komen de affiches in te staan, en ook het logboek dat bijhoudt wat er al gemaild
en geplaatst is. Er is geen database voor nodig.

### 5. Cron aanzetten

In [`.github/workflows/matchday-voorstel.yml`](../.github/workflows/matchday-voorstel.yml)
staat het `schedule`-blok in commentaar. Haal de `#` weg zodra de rest werkt.
Zet `CRON_SECRET` bij de repository secrets en eventueel `SITE_URL` bij de
repository variables.

## Testen zonder iets te posten

```bash
# Voorstellen als JSON, zonder mail
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://www.kwslinkhout.be/api/social/preview?droog=1"

# Echte mail versturen (blijft dry-run zolang SOCIAL_LIVE uit staat)
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://www.kwslinkhout.be/api/social/preview"
```

De workflow handmatig starten kan ook, via Actions > Matchday-voorstel > Run
workflow.

## Routes

| Route | Doel |
| --- | --- |
| `GET /api/social/preview` | Aankondigingen bouwen en mailen. Cron-geheim vereist. |
| `GET /api/social/uitslag-preview` | Uitslagen nakijken en mailen. Cron-geheim vereist. |
| `GET /api/social/matchday-image` | De affiche. Ondertekende parameters. |
| `GET /api/social/matchday` | Gegevens voor de goedkeuringspagina. Token vereist. |
| `POST /api/social/publish` | Publiceert. Token vereist, alleen via POST. |
| `/matchday/goedkeuren` | De goedkeuringspagina uit de mail. |
| `/matchday/template` | Voorbeeld van beide affiches. Alleen lokaal. |
| `/matchday/opdrachten` | Werklijst met de opdrachten voor ChatGPT. Sleutel vereist. |
| `POST /api/social/affiche-upload` | Ontvangt een affiche uit ChatGPT. Sleutel vereist. |

## Cron aanzetten

Twee workflows in `.github/workflows/`, allebei met het `schedule`-blok in
commentaar:

- `matchday-voorstel.yml` voor de aankondigingen. Vuurt woensdag om 16:00 en
  17:00 UTC; de eerste stap breekt af als het lokaal geen 18u is. Zo klopt het
  tijdstip zomer en winter, want GitHub Actions kent alleen UTC.
- `matchday-uitslag.yml` voor de uitslagen. Vrijdag tot maandag, ieder uur.

Haal de `#` weg zodra de rest werkt.

## Waarom sommige keuzes zo zijn

**Geen LLM die de tekst schrijft.** Een clubpagina moet er elke week hetzelfde
uitzien. De template garandeert dat, en er kan niets onverwachts verschijnen.

**Publiceren kan alleen via POST.** Mailprogramma's laden links in een bericht
soms vooraf op om een voorbeeld te tonen. Was de knop een gewone link die
publiceert, dan zou een post kunnen vertrekken zonder dat je iets deed.

**De afbeeldingsparameters zijn ondertekend.** Anders kon iedereen een
afbeelding met het clublogo en willekeurige tekst laten genereren op ons eigen
domein.

**Er wordt niets gepost als de wedstrijd meer dan acht dagen weg ligt.** Zo
blijft het stil tijdens de winterstop en bij een vrij weekend.

## Als er iets misgaat

| Symptoom | Oorzaak |
| --- | --- |
| "Deze link is ongeldig of vervallen" | Token ouder dan 5 dagen, of `SOCIAL_SECRET` is gewijzigd. |
| "De kalender is gewijzigd" | De RBFA verzette de wedstrijd na het versturen van de mail. Vraag een nieuw voorstel. |
| Instagram: "media container ERROR" | De afbeelding-URL is niet publiek bereikbaar. Controleer `SITE_URL`. |
| Facebook: "Invalid OAuth access token" | Pagina-token ingetrokken of vervallen. Nieuw token halen via `GET /me/accounts`. |
| Mail komt niet aan | `RESEND_API_KEY` ontbreekt, of het domein staat niet geverifieerd bij Resend. |
