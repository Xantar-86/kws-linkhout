# Discord Notificatie Setup (100% Gratis)

Je krijgt een notificatie in Discord wanneer er nieuwe content is.

## Stap 1: Maak Discord server (als je die nog niet hebt)

1. Download Discord: https://discord.com/download
2. Registreer gratis account
3. Maak een server:
   - Klik "+" links onderin
   - "Create My Own"
   - Kies naam (bijv. "KWS Linkhout Admin")

## Stap 2: Maak webhook

1. In je Discord server, klik op een kanaal (bijv. #general)
2. Klik tandwiel ernaast → "Integrations"
3. Klik "Webhooks" → "New Webhook"
4. Naam: "KWS CMS"
5. Kanaal: kies waar je notificaties wilt
6. Klik "Copy Webhook URL"

De URL ziet er zo uit:
```
https://discord.com/api/webhooks/123456789/abc123def456
```

## Stap 3: Voeg toe aan GitHub

1. Ga naar https://github.com/Xantar-86/kws-linkhout/settings/secrets/actions
2. Klik "New repository secret"
3. Name: `DISCORD_WEBHOOK_URL`
4. Value: plak de Discord webhook URL
5. Klik "Add secret"

## Stap 4: Test

1. Wacht 2 minuten op deploy
2. Maak test artikel in Decap CMS
3. Je krijgt een notificatie in Discord!

## Voordelen

✅ 100% gratis - voor altijd
✅ Directe notificatie op telefoon/computer
✅ Je ziet wie wat heeft toegevoegd
✅ Directe link naar CMS

## Problemen?

Check GitHub Actions: https://github.com/Xantar-86/kws-linkhout/actions
