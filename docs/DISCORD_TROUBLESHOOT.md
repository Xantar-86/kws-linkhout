# Discord Notificatie Troubleshoot

## Workflow wordt niet getriggerd?

Check: https://github.com/Xantar-86/kws-linkhout/actions

## Common issues:

### 1. Secret naam is verkeerd
Controleer dat de secret EXACT zo heet:
- `DISCORD_WEBHOOK_URL` (niet `DISCORD_WEBHOOK`)

### 2. Webhook URL is verkeerd gekopieerd
De URL moet zijn:
```
https://discord.com/api/webhooks/123456789/abc123def456
```

### 3. Workflow alleen op content folder
De workflow kijkt alleen naar wijzigingen in `content/` folder.
Als je andere files aanpast (zoals src/ of public/), wordt er geen notificatie gestuurd.

## Test zonder Decap CMS

Maak een test file aan om te testen:
```bash
# Lokaal
echo "test" >> content/test.md
git add .
git commit -m "Test notification"
git push
```

## Altijd notificatie (voor debugging)

Als je wilt testen of Discord werkt, pas de workflow aan:

```yaml
- name: Send Discord notification
  # Verwijder: if: steps.check.outputs.content_changed != '0'
  # Dan krijg je ALTIJD een notificatie bij elke push
```

## Check Vercel build

Ja, elke draft = nieuwe commit = Vercel build. Dit is normaal.

Als je dit wilt voorkomen:
- Gebruik `git-gateway` backend (maar dat vereist Netlify)
- Of accepteer dat builds nodig zijn

Een build kost Vercel credits, maar voor een hobby project is dat meestal gratis.
