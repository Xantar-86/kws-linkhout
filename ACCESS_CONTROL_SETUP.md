# CMS Toegangsbeheer - KWS Linkhout

## ⚠️ BELANGRIJK: Editoriale Workflow Werkt Voor Iedereen

Er bestaat een verkeerd begrip over hoe Decap CMS's Editorial Workflow werkt. Hier is de werkelijkheid:

### Wat je denkt dat kan:
- Jochen en Joel kunnen direct publiceren
- Andere gebruikers moeten approval vragen
- Technische beveiliging die dit afdwingt

### Wat er werkelijk is:
- **Iedereen** ziet de workflow: Draft → In Review → Ready → Publish
- **Iedereen** kan op "Publish" klikken (content gaat dan direct live)
- Het werkt op basis van **afspraken**, niet technische beperkingen

## Hoe Werkt Het Wel in de Praktijk?

### Scenario 1: Jochen & Joel
1. Loggen in op CMS
2. Maken content aan
3. Kunnen klikken: **"Publish"** → Content gaat direct live!
   - Of gebruiken de workflow: Draft → In Review → Ready → Publish

### Scenario 2: Andere gebruikers
1. Loggen in op CMS
2. Maken content aan als **"Draft"**
3. Sturen mail/WhatsApp naar Jochen/Joel: "Content klaar voor review"
4. Jochen/Joel loggen in, reviewen, en klikken **"Publish"**

## Wat Gebeurt Er Bij Misbruik?

**Als iemand zonder toestemming "Publish" klikt:**
- Content verschijnt meteen op de website
- Git commit wordt gedaan naar main branch
- Vercel build start automatisch
- Jochen/Joel kunnen dit zien in GitHub commits
- Misbruik kan leiden tot verwijdering van CMS toegang

## Aanbevelingen

### Goede Afspraken

1. **Train gebruikers goed**
   - Leg uit dat "Publish" direct live gaat
   - Geef duidelijke richtlijnen wanneer wel/niet te publiceren

2. **Gebruik communicatie**
   - Maak een duidelijke afspraak over "melden aan Jochen/Joel"
   - Eventueel een WhatsApp groep voor CMS notificaties

3. **Monitor activiteit**
   - Check regelmatig GitHub commits (`https://github.com/Xantar-86/kws-linkhout/commits`)
   - Gebruik Netlify Identity logs voor login monitoring

### Beveiliging (GitHub)

De GitHub repository heeft Branch Protection ingeschakeld. Dit:
- Voorkomt force pushes naar main
- Voorkomt directe commits (alleen via Decap CMS)

**Maar:** Het beschermt NIET tegen publicatie via Decap CMS omdat:
- Git Gateway (Decap) de commits doet namens een admin account
- Branch Protection niet kan onderscheiden wie op "Publish" klikte

## Mogelijke Verbeteringen (Toekomst)

### 1. GitHub Rulesets (Beta)
GitHub heeft nieuwe "Rulesets" die bypass lists hebben per gebruiker:
- Je kunt zeggen: "Alleen Jochen en Joel mogen direct naar main"
- Andere gebruikers moeten een PR aanmaken
- Dit is nieuw en complex om in te stellen

### 2. Custom Workflow
Een programmeerbare oplossing:
- GitHub Action die commits controleert
- Block commits van niet-geautoriseerde gebruikers
- Email notificatie naar Jochen/Joel voor approval
- **Nadeel:** Vereist ontwikkeling en onderhoud

### 3. Moderation Queue
Bouw een custom "moderatie" laag:
- Content van niet-admins wordt eerst opgeslagen in database
- Admins krijgen notificatie om te reviewen
- Na approval wordt het naar GitHub geschreven
- **Nadeel:** Vereist significante ontwikkeling

## Huidige Conclusie

**Voor nu:**
- Gebruik de Editorial Workflow zoals deze bedoeld is
- Vertrouw op goede afspraken en training
- Monitor GitHub commits
- Reageer snel bij misbruik

**Dit is hoe de meeste organisaties het doen.** Editorial workflows werken op basis van vertrouwen, niet technische beperkingen. Zelfs in professionele omgevingen (zoals WordPress) is het de verantwoordelijkheid van editors om de juiste knoppen te klikken.

## Checklist Voor Jochen & Joel

- [x] GitHub Collaborators toegevoegd voor alle gebruikers
- [x] Netlify Identity geconfigureerd met juiste providers
- [ ] Gebruikers getraind in correct gebruik van workflow
- [ ] Afspraak gemaakt over communicatie bij klaarstaande content
- [ ] Monitoring proces ingericht (GitHub commits checken)

## Meer Info

- Decap CMS Editorial Workflow: https://decapcms.org/docs/editorial-workflows/
- GitHub Branch Protection: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub Rulesets (Beta): https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
