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

### Stap 6: Gebruikers Toevoegen ✓
- [x] Jochen toegevoegd als GitHub Collaborator (Admin)
- [x] Joel toegevoegd als GitHub Collaborator (Admin)
- [x] Andere gebruikers toegevoegd als GitHub Collaborators (Write)

## ⚠️ Belangrijke Notitie: Editorial Workflow

Decap CMS's Editorial Workflow werkt voor **alle gebruikers**. Het is **technisch niet mogelijk** om alleen Jochen en Joel direct te laten publiceren terwijl anderen approval nodig hebben.

### Praktische oplossing:
- **Jochen & Joel**: Kunnen direct publiceren (en zullen dat ook doen)
- **Andere gebruikers**: Werken met Draft → melden aan Jochen/Joel → publicatie

Het werkt op basis van **afspraken**, niet technische beperkingen.

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

## 👤 Gebruikers

Alle gebruikers kunnen inloggen via:
- ✉️ Email + Wachtwoord
- 🐙 GitHub
- 🔵 Google (indien geconfigureerd)

**Workflow:**
- Iedereen ziet: Draft → In Review → Ready → Publish
- Jochen & Joel publiceren direct
- Anderen vragen approval via mail/WhatsApp

## 🔄 Workflow

### Voor Jochen & Joel:
```
Draft → Publish = Direct live! ✅
```

### Voor andere gebruikers:
```
Draft → [Mail naar Jochen/Joel] → Publish = Live
```

## 🆘 Troubleshooting

| Probleem | Oplossing |
|----------|-----------|
| "Git Gateway Error" | Controleer Netlify Identity → Git Gateway |
| "Login failed" | Controleer OAuth app callback URLs |
| "404 on admin" | Controleer of admin folder is geüpload |
| "Config not found" | Controleer config.yml in public/admin-static/ |

## 📝 Notities

- **Domein**: Geen domeinverhuizing nodig! Site blijft op Vercel draaien.
- **Netlify**: Alleen gebruikt voor Identity + Git Gateway
- **Uploads**: Afbeeldingen/PDF's worden opgeslagen in `public/uploads/`
- **Editorial Workflow**: Ingeschakeld voor iedereen (werkt op vertrouwen)

## 📖 Documentatie

- `CMS_SETUP_README.md` - Algemene setup instructies
- `ACCESS_CONTROL_SETUP.md` - Uitleg over rechten en workflow
- `content/README.md` - Uitleg over content structuur

## 🎉 Gereed!

De CMS is volledig operationeel. Train gebruikers om met de workflow te werken!
