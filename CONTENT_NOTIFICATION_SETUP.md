# Content Notificatie Setup

## Wat werkt er nu?

Wanneer iemand nieuwe content toevoegt via Decap CMS, wordt er automatisch een **GitHub Actions workflow** gestart die een email stuurt naar Jochen en Joel.

## Vereiste: Email Credentials Instellen

Je moet SMTP credentials toevoegen aan de GitHub repository secrets:

### Stap 1: Kies een email provider

**Optie A: Gmail (makkelijkst)**
1. Ga naar https://myaccount.google.com/apppasswords
2. Genereer een "App Password" voor deze applicatie
3. Gebruik dit als EMAIL_PASSWORD

**Optie B: Een andere SMTP provider** (zoals SendGrid, Mailgun, etc.)

### Stap 2: Voeg secrets toe aan GitHub

1. Ga naar https://github.com/Xantar-86/kws-linkhout/settings/secrets/actions
2. Klik "New repository secret"
3. Voeg toe:
   - `EMAIL_USERNAME` = jouw email adres (bijv. cms@kwslinkhout.be)
   - `EMAIL_PASSWORD` = je app password of SMTP password

### Stap 3: Test

1. Maak een test artikel in Decap CMS als Draft
2. Sla op
3. Binnen enkele minuten ontvangen Jochen en Joel een email

## Hoe het werkt

1. Iemand maakt content in Decap CMS
2. Decap CMS saved naar GitHub
3. GitHub Actions detecteert wijziging in `content/` folder
4. Workflow stuurt email naar:
   - jochen_thoelen@telenet.be
   - Joel.bynens@gmail.com
5. Email bevat link naar CMS zodat ze kunnen reviewen en publiceren

## Problemen?

Als emails niet aankomen:
1. Check GitHub Actions logs: https://github.com/Xantar-86/kws-linkhout/actions
2. Controleer of secrets correct zijn ingesteld
3. Check spam folders
