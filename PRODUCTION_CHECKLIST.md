# Productie Checklist - CMS Activatie

## ✅ Wat er al is gedaan

- [x] CMS werkt lokaal
- [x] Nieuws pagina toont nu CMS artikelen
- [x] Test pagina redirect naar nieuws pagina
- [x] Productie config geactiveerd (Git Gateway)
- [x] Editorial workflow enabled
- [x] Multi-provider login configured (GitHub, Google, Email)

## 📝 Wat jij nog moet doen

### Stap 1: Netlify Account & Site Setup

1. Ga naar https://app.netlify.com
2. Maak account / login met GitHub
3. Klik "Add new site" → "Import an existing project"
4. Kies GitHub en selecteer `Xantar-86/kws-linkhout`
5. Bij "Basic build settings":
   ```
   Build command: npm run build
   Publish directory: .next
   ```
6. Klik "Deploy site"

### Stap 2: Identity Inschakelen

1. Ga naar je site → **Identity** tab
2. Klik **Enable Identity**
3. Ga naar **Settings → Identity**
4. Bij **Registration**:
   - **Invite only** (aanbevolen) - Alleen uitgenodigde gebruikers
   - Of **Open** - Iedereen kan registreren

### Stap 3: Login Providers Configureren

In **Identity → Settings → External providers**:

1. **GitHub**:
   - Enable → Configure
   - Client ID: (van GitHub OAuth app)
   - Client Secret: (van GitHub OAuth app)

2. **Google**:
   - Enable → Configure
   - Client ID: (van Google Cloud Console)
   - Client Secret: (van Google Cloud Console)
   - Zie: https://docs.netlify.com/visitor-access/oauth-provider/#google

3. **Email/Password**:
   - Enable (staat standaard aan)

### Stap 4: Git Gateway Activeren

1. Ga naar **Identity → Settings → Services**
2. Scroll naar **Git Gateway**
3. Klik **Enable Git Gateway**
4. Dit maakt automatisch een GitHub token aan

### Stap 5: Domein Configureren

1. Ga naar **Site settings → Domain management**
2. Klik **Add custom domain**
3. Vul in: `kwslinkhout.be`
4. Volg de DNS instructies:
   - Ga naar je domein provider
   - Voeg CNAME record toe: `kwslinkhout.be` → `jouw-site-xxx.netlify.app`
   - OF gebruik Netlify DNS (makkelijker)

### Stap 6: Gebruikers Toevoegen (bij Invite only)

1. Ga naar **Identity** tab
2. Klik **Invite users**
3. Vul email adressen in (bijvoorbeeld):
   - bestuur@kwslinkhout.be
   - voorzitter@kwslinkhout.be
   - webmaster@kwslinkhout.be
4. Gebruikers krijgen invite email met login link

### Stap 7: Testen

1. Ga naar https://kwslinkhout.be/admin
2. Je ziet nu het **Netlify Identity** login scherm met 3 opties:
   - **Continue with GitHub**
   - **Continue with Google**
   - **Sign in with email** (email + wachtwoord)

3. Log in met één van de methoden
4. Probeer een test artikel te maken

## 🔐 OAuth Apps Aanmaken

### GitHub OAuth App

1. Ga naar https://github.com/settings/developers
2. **New OAuth App**
3. Vul in:
   ```
   Application name: KWS Linkhout CMS
   Homepage URL: https://kwslinkhout.be
   Authorization callback URL: https://api.netlify.com/auth/done
   ```
4. Kopieer **Client ID** en **Client Secret**
5. Plak deze in Netlify (Identity → GitHub provider)

### Google OAuth App

1. Ga naar https://console.cloud.google.com
2. Maak project → APIs & Services → Credentials
3. **Create credentials → OAuth client ID**
4. Configureer consent screen:
   - User type: External
   - App name: KWS Linkhout CMS
   - Authorized domain: kwslinkhout.be
5. Create OAuth client ID:
   ```
   Application type: Web application
   Name: KWS Linkhout
   Authorized redirect URIs: https://api.netlify.com/auth/done
   ```
6. Kopieer **Client ID** en **Client Secret**
7. Plak deze in Netlify (Identity → Google provider)

## 📧 Email Login (zonder OAuth)

Email/wachtwoord werkt automatisch! Geen extra setup nodig.

Gebruikers kunnen:
1. Op "Sign in with email" klikken
2. Email invullen
3. Wachtwoord invullen (bij registratie)
4. Inloggen

## 🚀 Na Deploy

Bij elke wijziging in het CMS:
1. Editor maakt wijziging → Opslaan
2. Netlify maakt commit naar GitHub
3. GitHub triggert nieuwe build
4. Site is binnen 1-2 minuten geüpdatet

## 🆘 Problemen?

- **"Git Gateway Error"** → Controleer of Git Gateway is enabled
- **"Login failed"** → Controleer OAuth app settings en callback URL
- **"Config not found"** → Controleer of config.yml op de juiste plek staat

## 📚 Links

- Netlify Identity docs: https://docs.netlify.com/visitor-access/identity/
- Git Gateway docs: https://docs.netlify.com/visitor-access/git-gateway/
- Decap CMS docs: https://decapcms.org/docs/intro/
