# Identity Error Oplossen

## Probleem
Foutmelding: `Unable to access identity settings. When using git-gateway backend make sure to enable Identity service and Git Gateway.`

## Oorzaak
De Netlify Identity service is niet correct geconfigureerd voor het domein `kwslinkhout.be`.

## Oplossing Stap voor Stap

### Stap 1: Controleer of de site is geïmporteerd in Netlify

1. Ga naar [Netlify Dashboard](https://app.netlify.com/)
2. Kijk of de site "kws-linkhout" of vergelijkbaar in de lijst staat
3. **Als de site er NIET is:**
   - Klik "Add new site" → "Import an existing project"
   - Kies GitHub
   - Selecteer de repo: `Xantar-86/kws-linkhout`
   - Configureer build:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Klik "Deploy site"

### Stap 2: Schakel Identity In

1. In Netlify, ga naar je site → "Identity" tab
2. Klik "Enable Identity"
3. Belangrijke instellingen:
   - **Registration**: Kies "Open" (voor nu, makkelijker testen)
   - **External providers**: Enable "GitHub" (en eventueel "Google")

### Stap 3: Schakel Git Gateway In

1. Ga naar "Identity" → "Services" → "Git Gateway"
2. Klik "Enable Git Gateway"
3. Er verschijnt een popup om te verbinden met GitHub
4. Klik "Connect to GitHub" en autoriseer Netlify
5. **Let op**: Dit maakt een nieuwe GitHub token aan voor Netlify

### Stap 4: Domein Configuratie (BELANGRIJK!)

1. Ga naar "Site configuration" → "Identity"
2. Scroll naar "Registration" → "External providers"
3. Configureer OAuth apps:

   **Voor GitHub:**
   - Ga naar GitHub → Settings → Developer settings → OAuth Apps
   - Klik "New OAuth App"
   - Application name: `KWS Linkhout CMS`
   - Homepage URL: `https://kwslinkhout.be`
   - Authorization callback URL: `https://kwslinkhout.be/.netlify/identity/github/callback`
   - Registreer en kopieer Client ID en Client Secret naar Netlify

### Stap 5: Test de Setup

1. Wacht 1-2 minuten op propagatie
2. Ga naar `https://kwslinkhout.be/admin`
3. Je zou nu het login scherm moeten zien

## Veelvoorkomende Problemen

### "No identity header found"
- **Oorzaak**: Identity is niet ingeschakeld
- **Oplossing**: Ga naar Netlify → Identity → Enable

### "Git Gateway Error"
- **Oorzaak**: Git Gateway is niet ingeschakeld
- **Oplossing**: Ga naar Identity → Services → Enable Git Gateway

### "Invalid token"
- **Oorzaak**: Oude sessie/cookies
- **Oplossing**: Clear browser cookies voor kwslinkhout.be en probeer opnieuw

### "Cannot access settings"
- **Oorzaak**: CORS of domein mismatch
- **Oplossing**: Controleer dat het domein in Netlify overeenkomt met `kwslinkhout.be`

## Quick Checklist

- [ ] Site is geïmporteerd in Netlify
- [ ] Identity is enabled
- [ ] Git Gateway is enabled
- [ ] GitHub OAuth is geconfigureerd (Client ID + Secret)
- [ ] Domein `kwslinkhout.be` is toegevoegd aan site

## Alternatief: Gebruik test-backend (voor debugging)

Als je wilt testen zonder Netlify Identity, kun je tijdelijk een test-backend gebruiken:

```yaml
# In config.yml - VERANDER DIT NIET IN PRODUCTIE!
backend:
  name: test-repo
```

Dit slaat wijzigingen alleen lokaal op (niet naar GitHub). Alleen voor debugging!

## Contact

Als het probleem aanhoudt, controleer de browser console (F12 → Console) voor gedetailleerde errors.
