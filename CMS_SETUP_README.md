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

## 🔐 Toegangsbeheer (Belangrijk!)

### Direct Publiceren vs Approval

Standaard moet **iedereen** (inclusief Jochen en Joel) door het review proces:
Draft → In Review → Ready → Publish

**Om direct te kunnen publiceren zonder approval:**

Jochen en Joel moeten **GitHub Admin** rechten hebben én **Branch Protection** moet correct zijn ingesteld.

### GitHub Branch Protection Instellen

1. **Ga naar je GitHub repo** → Settings → Branches
2. **Klik "Add rule"** (of bewerk bestaande rule voor `main`)
3. **Configureer als volgt:**

```
Branch name pattern: main

☑️ Restrict who can push to matching branches
   - Jochen en Joel toevoegen als "People with push access"

☑️ Require a pull request before merging
   - Require approvals: 1
   - ☑️ Dismiss stale PR approvals when new commits are pushed
   - ☑️ Require review from CODEOWNERS (optioneel)

☐ Require status checks to pass before merging
   (Vercel checks kunnen hier optioneel bij)

☑️ Include administrators
   (Dit zorgt ervoor dat alleen admins direct kunnen pushen)
```

4. **Save changes**

### Hoe werkt het dan?

| Rol | Direct publiceren? | Workflow |
|-----|-------------------|----------|
| **Jochen/Joel** (GitHub Admin) | ✅ Ja | Draft → Publish (direct live) |
| **Andere gebruikers** | ❌ Nee | Draft → Review → Ready → PR → Approval → Live |

### Toevoegen van nieuwe gebruikers

1. **GitHub**: Voeg gebruiker toe als **Collaborator** met **Write** rechten
2. **Netlify Identity**: Nodig uit via email (als Invite only)
3. **Resultaat**: Gebruiker kan inloggen maar moet wachten op approval

## Hoe werkt het?

1. **Inloggen**: Ga naar `https://kwslinkhout.be/admin`
2. **Multi-provider login**: Kies uit Email, GitHub of Google
3. **Content beheren**: 4 collecties beschikbaar:
   - **Nieuwsberichten**: Artikelen voor de nieuws pagina
   - **Evenementen**: Activiteiten voor de events pagina  
   - **In de Krant**: Krantenartikelen met logo's
   - **Foto's**: Foto albums met Google Photos links

## Workflow

### Voor Jochen & Joel (Direct publiceren):
1. Login op `/admin`
2. Klik "Nieuwsberichten" → "New"
3. Vul alle velden in
4. Klik "Publish" → Direct live!

### Voor andere gebruikers (Met approval):
1. Login op `/admin`
2. Schrijf content
3. Sla op als "Draft"
4. Zet status naar "In Review"
5. Wacht op approval van Jochen of Joel
6. Na approval → "Ready" → "Publish" → Live!

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
- **"Approval nodig terwijl ik admin ben"** → Controleer GitHub branch protection settings

## Support

- Decap CMS docs: https://decapcms.org/docs/
- Netlify Identity: https://docs.netlify.com/visitor-access/identity/
- GitHub Branch Protection: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches
