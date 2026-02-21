# Toegangsbeheer Setup - KWS Linkhout CMS

Dit document legt uit hoe je de rechten configureert zodat:
- **Jochen & Joel** direct kunnen publiceren
- **Andere gebruikers** eerst approval nodig hebben

## Waarom is dit nodig?

Decap CMS heeft een editorial workflow die geldt voor **iedereen** of **niemand**. Om specifieke gebruikers (Jochen & Joel) direct te laten publiceren, gebruiken we **GitHub Branch Protection** met admin uitsluitingen.

## Stappenplan

### Stap 1: GitHub Repository Instellingen

1. Ga naar: `https://github.com/Xantar-86/kws-linkhout/settings`
2. Klik in de linker sidebar op **"Manage access"** (of "Collaborators and teams")

### Stap 2: Gebruikers Toevoegen

#### Jochen & Joel (Admins):
1. Klik **"Invite a collaborator"**
2. Voer email/GitHub username in: `jochen_thoelen@telenet.be` (of GitHub username)
3. Rol selecteren: **"Admin"**
4. Herhaal voor Joel: `Joel.bynens@gmail.com`

#### Andere gebruikers:
1. Klik **"Invite a collaborator"**
2. Voer email/GitHub username in
3. Rol selecteren: **"Write"** (NIET Admin!)

### Stap 3: Branch Protection Instellen

1. Ga naar: `https://github.com/Xantar-86/kws-linkhout/settings/branches`
2. Klik **"Add rule"** (als er nog geen rule is) of bewerk bestaande rule
3. Vul in:
   - **Branch name pattern**: `main`

4. Zet vinkjes bij:
   - ☑️ **Restrict who can push to matching branches**
     - Selecteer: Jochen en Joel
   
   - ☑️ **Require a pull request before merging**
     - ☑️ Require approvals: `1`
     - ☑️ Dismiss stale PR approvals when new commits are pushed
   
   - ☑️ **Include administrators**
     - Dit is BELANGRIJK: zorgt ervoor dat admins (Jochen/Joel) direct kunnen pushen!

5. Klik **"Create"** of **"Save changes"**

### Stap 4: Testen

#### Test 1: Jochen of Joel
1. Ga naar `https://kwslinkhout.be/admin`
2. Log in
3. Maak een test artikel
4. Klik **"Publish"**
5. **Verwacht resultaat**: Direct live, geen approval nodig! ✅

#### Test 2: Andere gebruiker
1. Laat iemand anders inloggen (met Write rechten, geen Admin)
2. Maak een test artikel
3. Klik **"Publish"**
4. **Verwacht resultaat**: 
   - Status gaat naar "In Review"
   - Kan niet direct publiceren
   - Jochen of Joel moet approven

## Hoe ziet het eruit in de praktijk?

### Voor Jochen & Joel:
```
┌─────────────────────────────────────┐
│  CMS Editor                         │
│                                     │
│  [Content schrijven...]             │
│                                     │
│  [Save]  [Publish] ← Direct! ✅     │
└─────────────────────────────────────┘
         ↓
    [Direct Live!]
```

### Voor andere gebruikers:
```
┌─────────────────────────────────────┐
│  CMS Editor                         │
│                                     │
│  [Content schrijven...]             │
│                                     │
│  [Save]  [Publish] ← Blocked! ❌    │
└─────────────────────────────────────┘
         ↓
   [Draft] → [In Review] → [Ready]
         ↓
   [Pull Request aangemaakt]
         ↓
   [Wacht op approval Jochen/Joel]
         ↓
   [Approved] → [Live!]
```

## FAQ

### Q: Wat als Jochen of Joel per ongeluk iets verkeerds publiceert?
**A:** Geen probleem! Alles wordt opgeslagen in Git. Je kunt eenvoudig terugdraaien via GitHub of een nieuwe versie publiceren via de CMS.

### Q: Kunnen we later meer "direct publish" gebruikers toevoegen?
**A:** Ja! Voeg ze gewoon toe als GitHub Admin in de repository settings.

### Q: Wat als iemand zonder GitHub account toegang nodig heeft?
**A:** Zij kunnen inloggen via Email/Wachtwoord in Netlify Identity. Ze krijgen automatisch Write rechten en moeten wachten op approval.

### Q: Hoe krijg ik een melding als iemand iets ter review indient?
**A:** GitHub stuurt automatisch een email notificatie wanneer iemand een Pull Request aanmaakt (wat gebeurt bij "Ready" status).

## Troubleshooting

### Probleem: "Ik ben admin maar moet toch approval"
**Oplossing:** 
1. Ga naar GitHub → Settings → Branches
2. Bewerk de rule voor `main`
3. Controleer of ☑️ **"Include administrators"** AAN staat
4. Sla op

### Probleem: "Ik zie geen 'Publish' knop, alleen 'Save'"
**Oplossing:**
1. Controleer of je de juiste rechten hebt in GitHub
2. Log uit en opnieuw in in de CMS
3. Probeer een ander artikel

### Probleem: "Andere gebruiker kan helemaal niet publiceren"
**Oplossing:**
1. Controleer of de gebruiker "Write" rechten heeft (geen "Read")
2. Controleer of branch protection correct is ingesteld

## Links

- GitHub Repo Settings: `https://github.com/Xantar-86/kws-linkhout/settings`
- Branch Protection: `https://github.com/Xantar-86/kws-linkhout/settings/branches`
- CMS Admin: `https://kwslinkhout.be/admin`
