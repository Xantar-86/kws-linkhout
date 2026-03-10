# GitHub OAuth Fix - BELANGRIJK

## Wat je moet doen in GitHub

1. Ga naar https://github.com/settings/developers
2. Klik je "KWS Linkhout CMS" OAuth App
3. Wijzig **Authorization callback URL** naar:
   ```
   https://kwslinkhout.be/admin-static/auth-callback.html
   ```

## Hoe het nu werkt

1. Login pagina opent popup naar about:blank
2. Popup wordt naar GitHub genavigeerd (met timestamp om caching te voorkomen)
3. GitHub redirect terug naar auth-callback.html met code
4. Code wordt omgewisseld voor token
5. Token wordt teruggestuurd naar login pagina
6. Login pagina redirect naar admin

## Als het nog steeds niet werkt

De browser cached de popup. Probeer:
1. Browser cache legen (Ctrl+Shift+R op login pagina)
2. Of gebruik een incognito/private venster
