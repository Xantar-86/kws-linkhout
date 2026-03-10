# GitHub OAuth Setup - BELANGRIJK

## Callback URL aanpassen

In je GitHub OAuth App moet de **Authorization callback URL** zijn:

```
https://kwslinkhout.be/admin-static/auth-callback.html
```

## Hoe de login werkt

1. Gebruiker gaat naar `/admin` → redirect naar `/admin-static/login.html`
2. Gebruiker klikt "Login met GitHub"
3. Popup opent naar GitHub OAuth
4. GitHub redirect terug naar `auth-callback.html` met code
5. Code wordt omgewisseld voor token via `/api/auth`
6. Token wordt opgeslagen in localStorage
7. Gebruiker wordt doorgestuurd naar `/admin-static/index.html`
8. Decap CMS laadt met het token

## Environment Variables (Vercel)

Zorg dat deze zijn ingesteld:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
