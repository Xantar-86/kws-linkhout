# CMS Productie Setup - KWS Linkhout

Decap CMS is geïntegreerd voor content management.

## Productie Setup (VOLTOOID)

### Stap 1: Netlify Site Import ✓
- [x] Site geïmporteerd in Netlify vanuit GitHub repo
- [x] Build settings: `npm run build` → `.next`

### Stap 2: Identity Inschakelen ✓
- [x] Identity enabled in Netlify
- [x] Git Gateway enabled
- [x] Registratie: Open of Invite only (naar keuze)

### Stap 3: Login Providers ✓
- [x] Email/Wachtwoord: Enabled
- [x] GitHub: Geconfigureerd (OAuth App)
- [x] Google: Geconfigureerd (OAuth App) - optioneel

### Stap 4: Deploy ✓
- [x] Productie config geactiveerd (`git-gateway`)
- [x] Site deployed

## ⚠️ Belangrijk: Editorial Workflow Limitatie

De Editorial Workflow (Draft → Review → Publish) werkt voor **alle gebruikers**.

Het is **niet mogelijk** om bepaalde gebruikers (zoals Jochen en Joel) uit te sluiten van dit proces zodat zij direct kunnen publiceren.

### Praktische werkwijze:

**Voor Jochen & Joel:**
- Maken content aan
- Kunnen direct op "Publish" klikken (content gaat live)
- Of gebruiken Draft → Review → Publish zoals bedoeld

**Voor andere gebruikers:**
- Maken content aan als "Draft"
- Laten weten aan Jochen/Joel dat het klaar is (mail/WhatsApp)
- Jochen/Joel reviewen en publiceren

Het werkt op basis van **vertrouwen** en **afspraken**, niet op technische blokkades.

## Hoe werkt het?

1. **Inloggen**: Ga naar `https://kwslinkhout.be/admin`
2. **Multi-provider login**: Kies uit Email, GitHub of Google
3. **Content beheren**: 4 collecties beschikbaar:
   - **Nieuwsberichten**: Artikelen voor de nieuws pagina
   - **Evenementen**: Activiteiten voor de events pagina  
   - **In de Krant**: Krantenartikelen met logo's
   - **Foto's**: Foto albums met Google Photos links

## Workflow

### Content aanmaken:
1. Login op `/admin`
2. Kies collectie (bijv. "Nieuwsberichten") → "New"
3. Vul alle velden in (titel, datum, categorie, etc.)
4. Sla op als "Draft"

### Voor Jochen & Joel (direct publiceren):
5. Klik "Publish" → Content gaat direct live!

### Voor andere gebruikers (met approval):
5. Laat Jochen of Joel weten dat content klaar staat
6. Jochen/Joel logt in, reviewt, en klikt "Publish"

## Data flow

```
CMS Editor → Netlify Git Gateway → GitHub Commit → Vercel Build → Live Site
```

## Belangrijke bestanden

- `public/admin-static/config.yml` - CMS configuratie (productie)
- `public/admin-static/index.html` - CMS entry point
- `content/nieuws/*.md` - Nieuws artikelen
- `content/events/*.md` - Evenementen
- `content/press/*.md` - Krantenartikelen
- `content/fotos/*.md` - Foto albums

## Problemen?

- **"Git Gateway Error"** → Controleer of Git Gateway is enabled in Netlify
- **"Login failed"** → Controleer OAuth app settings
- **"Config not found"** → Controleer of config.yml correct is geüpload
- **"Kan niet publiceren"** → Controleer of je de juiste rechten hebt in Netlify Identity

## Meer info

- Zie `ACCESS_CONTROL_SETUP.md` voor gedetailleerde uitleg over rechten
- Zie `PRODUCTION_CHECKLIST.md` voor de complete setup checklist

## Support

- Decap CMS docs: https://decapcms.org/docs/
- Netlify Identity: https://docs.netlify.com/visitor-access/identity/
