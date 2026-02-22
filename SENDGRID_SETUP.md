# SendGrid Setup voor Email Notificaties

SendGrid is gratis (100 emails/dag) en veel betrouwbaarder dan Gmail SMTP.

## Stap 1: Maak SendGrid account

1. Ga naar https://signup.sendgrid.com/
2. Registreer met je email
3. Verifieer je account

## Stap 2: Maak API Key

1. Login op https://app.sendgrid.com
2. Ga naar Settings → API Keys
3. Klik "Create API Key"
4. Naam: "KWS CMS"
5. Rechten: "Full Access" of "Restricted Access" met alleen "Mail Send"
6. Kopieer de API key (begint met `SG.`)

## Stap 3: Verifieer sender email

1. Ga naar Settings → Sender Authentication
2. Klik "Verify Single Sender"
3. Vul in:
   - From Name: KWS Linkhout CMS
   - From Email: jouw email adres (bijv. jochen_thoelen@telenet.be)
   - Reply To: zelfde adres
4. Klik "Create"
5. Check je email en klik de verificatie link

## Stap 4: Voeg secrets toe aan GitHub

1. Ga naar https://github.com/Xantar-86/kws-linkhout/settings/secrets/actions
2. Klik "New repository secret"
3. Voeg toe:
   - `SENDGRID_API_KEY` = je API key (bijv. `SG.xxx...`)
   - `SENDGRID_FROM_EMAIL` = je geverifieerde email adres

## Stap 5: Test

1. Wacht op deploy (1-2 minuten)
2. Maak test artikel in Decap CMS
3. Check of je een email ontvangt

## Problemen?

- Check SendGrid Activity: https://app.sendgrid.com/email_activity
- Kijk voor errors in GitHub Actions: https://github.com/Xantar-86/kws-linkhout/actions
