# GitHub OAuth Setup voor Decap CMS

## Stap 1: GitHub OAuth App Configuratie

1. Ga naar https://github.com/settings/developers
2. Klik "OAuth Apps" → "New OAuth App"
3. Vul in:
   - **Application name**: KWS Linkhout CMS
   - **Homepage URL**: https://kwslinkhout.be
   - **Authorization callback URL**: https://kwslinkhout.be/admin-static/auth.html
4. Klik "Register application"
5. Kopieer **Client ID** en **Client Secret**

## Stap 2: Vercel Environment Variables

1. Ga naar https://vercel.com/dashboard → je project → Settings → Environment Variables
2. Voeg toe:
   - `GITHUB_CLIENT_ID` = (je Client ID)
   - `GITHUB_CLIENT_SECRET` = (je Client Secret)
3. Klik "Save" en redeploy

## Stap 3: Test

Ga naar https://kwslinkhout.be/admin

Je zou nu een "Login with GitHub" knop moeten zien.

## Hoe het werkt

1. Je klikt "Login with GitHub"
2. Decap CMS opent een popup naar GitHub OAuth
3. Na toestemming redirect GitHub naar `/admin-static/auth.html`
4. De auth.html pagina wisselt de code om voor een token via `/api/auth`
5. Het token wordt teruggestuurd naar Decap CMS
6. Je bent ingelogd!
