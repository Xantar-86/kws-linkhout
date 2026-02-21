# Content Folder

Deze folder bevat alle CMS content in markdown formaat.

## Structuur

```
content/
├── nieuws/           # Nieuwsberichten
├── events/           # Evenementen  
├── press/            # Krantenartikelen
├── fotos/            # Foto albums
└── README.md         # Dit bestand
```

## Bestandsformaat

Alle content bestanden gebruiken YAML frontmatter:

```yaml
---
title: "Titel van het item"
date: "2025-01-01"
---

Optionele markdown inhoud hier...
```

## Belangrijk

- **NIET** handmatig bewerken via GitHub/VS Code
- Gebruik altijd de CMS admin: `/admin`
- Wijzigingen via CMS worden automatisch gecommit
- Editorial workflow staat aan (Draft → Review → Publish)
