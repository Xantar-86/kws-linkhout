# Productie Checklist - CMS Activatie

## ✅ VOLTOOID

Alle stappen zijn uitgevoerd en de CMS staat live!

### Stap 1: Netlify Site Import ✓
- [x] Site geïmporteerd in Netlify vanuit GitHub repo `Xantar-86/kws-linkhout`
- [x] Build command: `npm run build`
- [x] Publish directory: `.next`

### Stap 2: Identity Inschakelen ✓
- [x] Identity enabled
- [x] Git Gateway enabled
- [x] Registration configured (Open of Invite only)

### Stap 3: Login Providers ✓
- [x] **Email/Wachtwoord**: Enabled ✓
- [x] **GitHub**: OAuth App aangemaakt en geconfigureerd ✓
- [x] **Google**: OAuth App aangemaakt en geconfigureerd ✓ (optioneel)

### Stap 4: Productie Config ✓
- [x] `config.yml` aangepast naar `git-gateway` backend
- [x] `index.html` bevat Netlify Identity widget
- [x] Alle 4 collecties geconfigureerd

### Stap 5: Deploy ✓
- [x] Code gepusht naar main branch
- [x] Vercel build succesvol
- [x] CMS bereikbaar op `https://kwslinkhout.be/admin`

## 🔐 STAP 6: Toegangsbeheer (Nog doen!)

### Doel:
- **Jochen & Joel**: Direct publiceren zonder approval
- **Andere gebruikers**: Moeten eerst approval krijgen

### 6.1 GitHub Admins Instellen
- [ ] Jochen toevoegen als GitHub repo Admin
- [ ] Joel toevoegen als GitHub repo Admin
- [ ] Andere gebruikers: Alleen "Write" rechten (geen Admin)

### 6.2 Branch Protection Instellen
- [ ] Ga naar GitHub repo → Settings → Branches
- [ ] Klik "Add rule" voor branch `main`
- [ ] Configureer:
  - ☑️ Restrict who can push to matching branches
  - ☑️ Require a pull request before merging
  - ☑️ Require approvals: 1
  - ☑️ Include administrators
- [ ] Save changes

### 6.3 Testen
- [ ] Jochen logt in en probeert direct te publiceren
- [ ] Joel logt in en probeert direct te publiceren
- [ ] Testgebruiker logt in en ziet dat approval nodig is

## 🌐 Live URLs

| Pagina | URL |
|--------|-----|
| Website | https://kwslinkhout.be |
| CMS Admin | https://kwslinkhout.be/admin |
| Nieuws | https://kwslinkhout.be/nieuws |
| Evenementen | https://kwslinkhout.be/nieuws/events |
| In de Krant | https://kwslinkhout.be/in-de-krant |
| Foto's | https://kwslinkhout.be/fotos |

## 📚 CMS Collecties

| Collectie | Locatie | Doel |
|-----------|---------|------|
| Nieuwsberichten | `content/nieuws/` | Nieuwsartikelen op /nieuws |
| Evenementen | `content/events/` | Evenementen op /nieuws/events |
| In de Krant | `content/press/` | Krantenartikelen op /in-de-krant |
| Foto's | `content/fotos/` | Foto albums op /fotos |

## 👤 Gebruikers & Rechten

| Gebruiker | Rol | Kan direct publiceren? |
|-----------|-----|----------------------|
| Jochen | GitHub Admin + CMS | ✅ Ja |
| Joel | GitHub Admin + CMS | ✅ Ja |
| Andere gebruikers | GitHub Write + CMS | ❌ Nee (approval nodig) |

## 🔄 Workflow per Rol

### Voor Jochen & Joel:
```
Draft → Publish = Direct live! ✅
```

### Voor andere gebruikers:
```
Draft → In Review → Ready → PR → Approval → Publish = Live
```

## 🆘 Troubleshooting

| Probleem | Oplossing |
|----------|-----------|
| "Git Gateway Error" | Controleer Netlify Identity → Git Gateway |
| "Login failed" | Controleer OAuth app callback URLs |
| "404 on admin" | Controleer of admin folder is geüpload |
| "Config not found" | Controleer config.yml in public/admin-static/ |
| "Ik ben admin maar moet toch approval" | Controleer GitHub branch protection → "Include administrators" moet AAN staan |

## 📝 Notities

- **Domein**: Geen domeinverhuizing nodig! Site blijft op Vercel draaien.
- **Netlify**: Alleen gebruikt voor Identity + Git Gateway
- **Uploads**: Afbeeldingen/PDF's worden opgeslagen in `public/uploads/`
- **Editorial Workflow**: Ingeschakeld, maar alleen van toepassing op niet-admins

## 🎉 Gereed!

De CMS is volledig operationeel na voltooiing van Stap 6!
