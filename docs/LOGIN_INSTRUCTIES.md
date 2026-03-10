# Inloggen op KWS Linkhout CMS

## Probleem met OAuth
De automatische GitHub login heeft caching problemen in sommige browsers. Daarom gebruiken we een betrouwbaardere methode.

## Hoe inloggen?

### Stap 1: Maak GitHub Personal Access Token

1. Ga naar https://github.com/settings/tokens
2. Klik "Generate new token (classic)"
3. Geef een naam (bijv. "KWS Linkhout CMS")
4. Vink aan: **repo** (volledige toegang tot repositories)
5. Klik "Generate token"
6. **Kopieer het token** (je kunt het maar één keer zien!)

### Stap 2: Login op CMS

1. Ga naar https://kwslinkhout.be/admin
2. Decap CMS vraagt om een token
3. Plak je GitHub Personal Access Token
4. Klik "Login"

### Stap 3: Token opslaan

Je browser onthoudt het token. Je hoeft dit niet elke keer opnieuw te doen.

## Veiligheid

- Bewaar je token veilig (niet delen!)
- Het token werkt alleen voor deze repository
- Je kunt het token altijd intrekken in GitHub settings

## Problemen?

Als je "Bad credentials" ziet:
1. Check dat je het volledige token hebt gekopieerd
2. Genereer een nieuw token als dit niet werkt
