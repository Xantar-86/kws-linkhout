// Gemaakt door scripts/maak-spelerfotos.mjs. Niet met de hand aanpassen:
// zet een foto in public/images/kws spelers/ of in public/images/Fotos
// spelers/<ploeg>/ en draai het script opnieuw.

export interface Speler {
  naam: string;
  /** "P2" of "P4", uit de bestandsnaam van de foto. */
  ploeg: string;
  /** Vierkant beeld voor in het raster. */
  klein: string;
  /** Groter beeld voor als je erop klikt. */
  groot: string;
}

export const spelers: Speler[] = [
  {
    "naam": "Alexander Cypers",
    "ploeg": "P4",
    "klein": "/images/spelers/alexander-cypers-055791cb-klein.webp",
    "groot": "/images/spelers/alexander-cypers-055791cb.webp"
  },
  {
    "naam": "Alexander Manshoven",
    "ploeg": "U13",
    "klein": "/images/spelers/alexander-manshoven-f9053700-klein.webp",
    "groot": "/images/spelers/alexander-manshoven-f9053700.webp"
  },
  {
    "naam": "Aliano Baeten",
    "ploeg": "U17A",
    "klein": "/images/spelers/aliano-baeten-81403dbf-klein.webp",
    "groot": "/images/spelers/aliano-baeten-81403dbf.webp"
  },
  {
    "naam": "Aline Flossie",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/aline-flossie-00a88a90-klein.webp",
    "groot": "/images/spelers/aline-flossie-00a88a90.webp"
  },
  {
    "naam": "Amélie Mondelaers",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/amelie-mondelaers-69f1292d-klein.webp",
    "groot": "/images/spelers/amelie-mondelaers-69f1292d.webp"
  },
  {
    "naam": "Arthur Hoogstijns",
    "ploeg": "U9",
    "klein": "/images/spelers/arthur-hoogstijns-ac6abc9c-klein.webp",
    "groot": "/images/spelers/arthur-hoogstijns-ac6abc9c.webp"
  },
  {
    "naam": "Ben Andries",
    "ploeg": "P2",
    "klein": "/images/spelers/ben-andries-a4ca9776-klein.webp",
    "groot": "/images/spelers/ben-andries-a4ca9776.webp"
  },
  {
    "naam": "Berre Hombroek",
    "ploeg": "U17A",
    "klein": "/images/spelers/berre-hombroek-ffbcdaf6-klein.webp",
    "groot": "/images/spelers/berre-hombroek-ffbcdaf6.webp"
  },
  {
    "naam": "Bram Mariën",
    "ploeg": "P4",
    "klein": "/images/spelers/bram-marien-f181f911-klein.webp",
    "groot": "/images/spelers/bram-marien-f181f911.webp"
  },
  {
    "naam": "Brent Gilissen",
    "ploeg": "P2",
    "klein": "/images/spelers/brent-gilissen-f5ab2227-klein.webp",
    "groot": "/images/spelers/brent-gilissen-f5ab2227.webp"
  },
  {
    "naam": "Briana Geerts",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/briana-geerts-75529813-klein.webp",
    "groot": "/images/spelers/briana-geerts-75529813.webp"
  },
  {
    "naam": "Cas Horions",
    "ploeg": "U9",
    "klein": "/images/spelers/cas-horions-72ce1a47-klein.webp",
    "groot": "/images/spelers/cas-horions-72ce1a47.webp"
  },
  {
    "naam": "Castor Ulenaers",
    "ploeg": "U11",
    "klein": "/images/spelers/castor-ulenaers-08e1330a-klein.webp",
    "groot": "/images/spelers/castor-ulenaers-08e1330a.webp"
  },
  {
    "naam": "Cisse Simons",
    "ploeg": "U9",
    "klein": "/images/spelers/cisse-simons-8502e55e-klein.webp",
    "groot": "/images/spelers/cisse-simons-8502e55e.webp"
  },
  {
    "naam": "Daan Debruyne",
    "ploeg": "P2",
    "klein": "/images/spelers/daan-debruyne-cf8d9c50-klein.webp",
    "groot": "/images/spelers/daan-debruyne-cf8d9c50.webp"
  },
  {
    "naam": "Daan Moermans",
    "ploeg": "U17A",
    "klein": "/images/spelers/daan-moermans-473147f0-klein.webp",
    "groot": "/images/spelers/daan-moermans-473147f0.webp"
  },
  {
    "naam": "Destiny Banken",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/destiny-banken-8db4b56e-klein.webp",
    "groot": "/images/spelers/destiny-banken-8db4b56e.webp"
  },
  {
    "naam": "Dries Huysmans",
    "ploeg": "P2",
    "klein": "/images/spelers/dries-huysmans-0431210e-klein.webp",
    "groot": "/images/spelers/dries-huysmans-0431210e.webp"
  },
  {
    "naam": "Elias Chaufoureau",
    "ploeg": "P2",
    "klein": "/images/spelers/elias-chaufoureau-833b0b37-klein.webp",
    "groot": "/images/spelers/elias-chaufoureau-833b0b37.webp"
  },
  {
    "naam": "Elliot Michiels",
    "ploeg": "U11",
    "klein": "/images/spelers/elliot-michiels-1fcf91b2-klein.webp",
    "groot": "/images/spelers/elliot-michiels-1fcf91b2.webp"
  },
  {
    "naam": "Emiel Cypers",
    "ploeg": "U11",
    "klein": "/images/spelers/emiel-cypers-98429798-klein.webp",
    "groot": "/images/spelers/emiel-cypers-98429798.webp"
  },
  {
    "naam": "Emiel Neyens",
    "ploeg": "U11",
    "klein": "/images/spelers/emiel-neyens-16707b30-klein.webp",
    "groot": "/images/spelers/emiel-neyens-16707b30.webp"
  },
  {
    "naam": "Emilie Konings",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/emilie-konings-0e05a4f7-klein.webp",
    "groot": "/images/spelers/emilie-konings-0e05a4f7.webp"
  },
  {
    "naam": "Emma Kellens",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/emma-kellens-249334d7-klein.webp",
    "groot": "/images/spelers/emma-kellens-249334d7.webp"
  },
  {
    "naam": "Emma Veekmans",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/emma-veekmans-ace999eb-klein.webp",
    "groot": "/images/spelers/emma-veekmans-ace999eb.webp"
  },
  {
    "naam": "Hannelore Barro",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/hannelore-barro-efa2b449-klein.webp",
    "groot": "/images/spelers/hannelore-barro-efa2b449.webp"
  },
  {
    "naam": "Ibe Thoelen",
    "ploeg": "U11",
    "klein": "/images/spelers/ibe-thoelen-1c0e0db6-klein.webp",
    "groot": "/images/spelers/ibe-thoelen-1c0e0db6.webp"
  },
  {
    "naam": "Ignas Van Genechten",
    "ploeg": "U17A",
    "klein": "/images/spelers/ignas-van-genechten-41af307b-klein.webp",
    "groot": "/images/spelers/ignas-van-genechten-41af307b.webp"
  },
  {
    "naam": "Jacey Vanweddingen",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/jacey-vanweddingen-44fc6b3f-klein.webp",
    "groot": "/images/spelers/jacey-vanweddingen-44fc6b3f.webp"
  },
  {
    "naam": "Jacob Van Genechten",
    "ploeg": "P4",
    "klein": "/images/spelers/jacob-van-genechten-6814a919-klein.webp",
    "groot": "/images/spelers/jacob-van-genechten-6814a919.webp"
  },
  {
    "naam": "Jade Beckers",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/jade-beckers-4747c416-klein.webp",
    "groot": "/images/spelers/jade-beckers-4747c416.webp"
  },
  {
    "naam": "Jake Michiels",
    "ploeg": "U9",
    "klein": "/images/spelers/jake-michiels-79f7f777-klein.webp",
    "groot": "/images/spelers/jake-michiels-79f7f777.webp"
  },
  {
    "naam": "Janne Vaes",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/janne-vaes-86a8577b-klein.webp",
    "groot": "/images/spelers/janne-vaes-86a8577b.webp"
  },
  {
    "naam": "Jarne Peeters",
    "ploeg": "P2",
    "klein": "/images/spelers/jarne-peeters-cd4ce37e-klein.webp",
    "groot": "/images/spelers/jarne-peeters-cd4ce37e.webp"
  },
  {
    "naam": "Jaydrick Fornerino",
    "ploeg": "P4",
    "klein": "/images/spelers/jaydrick-fornerino-5cc3200e-klein.webp",
    "groot": "/images/spelers/jaydrick-fornerino-5cc3200e.webp"
  },
  {
    "naam": "Jelle Asnong",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-asnong-cc8f1b63-klein.webp",
    "groot": "/images/spelers/jelle-asnong-cc8f1b63.webp"
  },
  {
    "naam": "Jelle Pieraerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-pieraerts-d789048a-klein.webp",
    "groot": "/images/spelers/jelle-pieraerts-d789048a.webp"
  },
  {
    "naam": "Jelte Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jelte-bynens-1fcda72e-klein.webp",
    "groot": "/images/spelers/jelte-bynens-1fcda72e.webp"
  },
  {
    "naam": "Jenz Neven",
    "ploeg": "P4",
    "klein": "/images/spelers/jenz-neven-14d2cb48-klein.webp",
    "groot": "/images/spelers/jenz-neven-14d2cb48.webp"
  },
  {
    "naam": "Jolien Wouters",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/jolien-wouters-a6feb698-klein.webp",
    "groot": "/images/spelers/jolien-wouters-a6feb698.webp"
  },
  {
    "naam": "Jonas Vaes",
    "ploeg": "P4",
    "klein": "/images/spelers/jonas-vaes-5714f2f9-klein.webp",
    "groot": "/images/spelers/jonas-vaes-5714f2f9.webp"
  },
  {
    "naam": "Joost Beutels",
    "ploeg": "P2",
    "klein": "/images/spelers/joost-beutels-b5186c2b-klein.webp",
    "groot": "/images/spelers/joost-beutels-b5186c2b.webp"
  },
  {
    "naam": "Jordy Berings",
    "ploeg": "P2",
    "klein": "/images/spelers/jordy-berings-f8b42a7d-klein.webp",
    "groot": "/images/spelers/jordy-berings-f8b42a7d.webp"
  },
  {
    "naam": "Jorne Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jorne-bynens-4bb95645-klein.webp",
    "groot": "/images/spelers/jorne-bynens-4bb95645.webp"
  },
  {
    "naam": "Jure Neven",
    "ploeg": "U17A",
    "klein": "/images/spelers/jure-neven-7aff65ce-klein.webp",
    "groot": "/images/spelers/jure-neven-7aff65ce.webp"
  },
  {
    "naam": "Juul Vanheukelom",
    "ploeg": "U17A",
    "klein": "/images/spelers/juul-vanheukelom-372e091b-klein.webp",
    "groot": "/images/spelers/juul-vanheukelom-372e091b.webp"
  },
  {
    "naam": "Juul Verpoorten",
    "ploeg": "U17A",
    "klein": "/images/spelers/juul-verpoorten-13844532-klein.webp",
    "groot": "/images/spelers/juul-verpoorten-13844532.webp"
  },
  {
    "naam": "Kaat Smeulders",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/kaat-smeulders-58ac61ee-klein.webp",
    "groot": "/images/spelers/kaat-smeulders-58ac61ee.webp"
  },
  {
    "naam": "Kahraman Can",
    "ploeg": "P2",
    "klein": "/images/spelers/kahraman-can-eaf36170-klein.webp",
    "groot": "/images/spelers/kahraman-can-eaf36170.webp"
  },
  {
    "naam": "Kara Peeters",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/kara-peeters-ee827ba0-klein.webp",
    "groot": "/images/spelers/kara-peeters-ee827ba0.webp"
  },
  {
    "naam": "Kenneth Cupers",
    "ploeg": "P4",
    "klein": "/images/spelers/kenneth-cupers-e37fe9aa-klein.webp",
    "groot": "/images/spelers/kenneth-cupers-e37fe9aa.webp"
  },
  {
    "naam": "Klevin Sagang",
    "ploeg": "P2",
    "klein": "/images/spelers/klevin-sagang-f5711c9f-klein.webp",
    "groot": "/images/spelers/klevin-sagang-f5711c9f.webp"
  },
  {
    "naam": "Kyare Houben",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/kyare-houben-8d3ef488-klein.webp",
    "groot": "/images/spelers/kyare-houben-8d3ef488.webp"
  },
  {
    "naam": "Kyra Sagovac",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/kyra-sagovac-6b0d667e-klein.webp",
    "groot": "/images/spelers/kyra-sagovac-6b0d667e.webp"
  },
  {
    "naam": "Lars Andries",
    "ploeg": "P4",
    "klein": "/images/spelers/lars-andries-8ad24768-klein.webp",
    "groot": "/images/spelers/lars-andries-8ad24768.webp"
  },
  {
    "naam": "Laurens Decoster",
    "ploeg": "P4",
    "klein": "/images/spelers/laurens-decoster-fc2dbc38-klein.webp",
    "groot": "/images/spelers/laurens-decoster-fc2dbc38.webp"
  },
  {
    "naam": "Lennert Mellebeek",
    "ploeg": "P4",
    "klein": "/images/spelers/lennert-mellebeek-b48285a1-klein.webp",
    "groot": "/images/spelers/lennert-mellebeek-b48285a1.webp"
  },
  {
    "naam": "Leon Vanneroem",
    "ploeg": "U9",
    "klein": "/images/spelers/leon-vanneroem-58da57c1-klein.webp",
    "groot": "/images/spelers/leon-vanneroem-58da57c1.webp"
  },
  {
    "naam": "Lilly Luyck",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/lilly-luyck-1f556927-klein.webp",
    "groot": "/images/spelers/lilly-luyck-1f556927.webp"
  },
  {
    "naam": "Lola Jouck",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/lola-jouck-8b24b464-klein.webp",
    "groot": "/images/spelers/lola-jouck-8b24b464.webp"
  },
  {
    "naam": "Lorenzo Silvente Fernandez",
    "ploeg": "P2",
    "klein": "/images/spelers/lorenzo-silvente-fernandez-fe9ea852-klein.webp",
    "groot": "/images/spelers/lorenzo-silvente-fernandez-fe9ea852.webp"
  },
  {
    "naam": "Louis Vanschoonbeek",
    "ploeg": "U9",
    "klein": "/images/spelers/louis-vanschoonbeek-57291b21-klein.webp",
    "groot": "/images/spelers/louis-vanschoonbeek-57291b21.webp"
  },
  {
    "naam": "Lucas Volders",
    "ploeg": "P4",
    "klein": "/images/spelers/lucas-volders-901ece82-klein.webp",
    "groot": "/images/spelers/lucas-volders-901ece82.webp"
  },
  {
    "naam": "Marie Doggen",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/marie-doggen-a25ba7ac-klein.webp",
    "groot": "/images/spelers/marie-doggen-a25ba7ac.webp"
  },
  {
    "naam": "Mathieu Huls",
    "ploeg": "U11",
    "klein": "/images/spelers/mathieu-huls-ffa61dd5-klein.webp",
    "groot": "/images/spelers/mathieu-huls-ffa61dd5.webp"
  },
  {
    "naam": "Mathilde Ramaekers",
    "ploeg": "U9",
    "klein": "/images/spelers/mathilde-ramaekers-2336eaaf-klein.webp",
    "groot": "/images/spelers/mathilde-ramaekers-2336eaaf.webp"
  },
  {
    "naam": "Matisse Peeters",
    "ploeg": "U17A",
    "klein": "/images/spelers/matisse-peeters-3549f9eb-klein.webp",
    "groot": "/images/spelers/matisse-peeters-3549f9eb.webp"
  },
  {
    "naam": "Mats Van Der Leun",
    "ploeg": "U11",
    "klein": "/images/spelers/mats-van-der-leun-120467bb-klein.webp",
    "groot": "/images/spelers/mats-van-der-leun-120467bb.webp"
  },
  {
    "naam": "Mats-Alexander Tutenel",
    "ploeg": "U17A",
    "klein": "/images/spelers/mats-alexander-tutenel-69f3e3d1-klein.webp",
    "groot": "/images/spelers/mats-alexander-tutenel-69f3e3d1.webp"
  },
  {
    "naam": "Matthias Corten",
    "ploeg": "P2",
    "klein": "/images/spelers/matthias-corten-ce77a0eb-klein.webp",
    "groot": "/images/spelers/matthias-corten-ce77a0eb.webp"
  },
  {
    "naam": "Maxim Coemans",
    "ploeg": "U9",
    "klein": "/images/spelers/maxim-coemans-03c83319-klein.webp",
    "groot": "/images/spelers/maxim-coemans-03c83319.webp"
  },
  {
    "naam": "Maxim Leduc",
    "ploeg": "P4",
    "klein": "/images/spelers/maxim-leduc-85babd18-klein.webp",
    "groot": "/images/spelers/maxim-leduc-85babd18.webp"
  },
  {
    "naam": "Maxim Vaes",
    "ploeg": "P2",
    "klein": "/images/spelers/maxim-vaes-8bf9c1cc-klein.webp",
    "groot": "/images/spelers/maxim-vaes-8bf9c1cc.webp"
  },
  {
    "naam": "Meret Moldonado",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/meret-moldonado-7dbc9971-klein.webp",
    "groot": "/images/spelers/meret-moldonado-7dbc9971.webp"
  },
  {
    "naam": "Meyra Cesur",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/meyra-cesur-d56595e4-klein.webp",
    "groot": "/images/spelers/meyra-cesur-d56595e4.webp"
  },
  {
    "naam": "Mike Geybels",
    "ploeg": "P2",
    "klein": "/images/spelers/mike-geybels-cd99ac82-klein.webp",
    "groot": "/images/spelers/mike-geybels-cd99ac82.webp"
  },
  {
    "naam": "Milan Roosen",
    "ploeg": "P2",
    "klein": "/images/spelers/milan-roosen-24cfa961-klein.webp",
    "groot": "/images/spelers/milan-roosen-24cfa961.webp"
  },
  {
    "naam": "Milan Vanluyten",
    "ploeg": "P4",
    "klein": "/images/spelers/milan-vanluyten-a6b53bbf-klein.webp",
    "groot": "/images/spelers/milan-vanluyten-a6b53bbf.webp"
  },
  {
    "naam": "Mon Hoebrekx",
    "ploeg": "U17A",
    "klein": "/images/spelers/mon-hoebrekx-c9e64f61-klein.webp",
    "groot": "/images/spelers/mon-hoebrekx-c9e64f61.webp"
  },
  {
    "naam": "Nena Convents",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/nena-convents-d7766c41-klein.webp",
    "groot": "/images/spelers/nena-convents-d7766c41.webp"
  },
  {
    "naam": "Nick Tuteleers",
    "ploeg": "P2",
    "klein": "/images/spelers/nick-tuteleers-0dc36880-klein.webp",
    "groot": "/images/spelers/nick-tuteleers-0dc36880.webp"
  },
  {
    "naam": "Niels Gabriels",
    "ploeg": "P2",
    "klein": "/images/spelers/niels-gabriels-2800d265-klein.webp",
    "groot": "/images/spelers/niels-gabriels-2800d265.webp"
  },
  {
    "naam": "Noah Gielkens",
    "ploeg": "P4",
    "klein": "/images/spelers/noah-gielkens-ed7a4144-klein.webp",
    "groot": "/images/spelers/noah-gielkens-ed7a4144.webp"
  },
  {
    "naam": "Noah Stockmans",
    "ploeg": "U9",
    "klein": "/images/spelers/noah-stockmans-3fa949eb-klein.webp",
    "groot": "/images/spelers/noah-stockmans-3fa949eb.webp"
  },
  {
    "naam": "Noah Vandenhoudt",
    "ploeg": "P2",
    "klein": "/images/spelers/noah-vandenhoudt-d37c66e4-klein.webp",
    "groot": "/images/spelers/noah-vandenhoudt-d37c66e4.webp"
  },
  {
    "naam": "Oona Vansteenwegen Walterus",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/oona-vansteenwegen-walterus-8097b1f2-klein.webp",
    "groot": "/images/spelers/oona-vansteenwegen-walterus-8097b1f2.webp"
  },
  {
    "naam": "Oscar Cleeren",
    "ploeg": "U9",
    "klein": "/images/spelers/oscar-cleeren-b13da54c-klein.webp",
    "groot": "/images/spelers/oscar-cleeren-b13da54c.webp"
  },
  {
    "naam": "Otis Kitenge",
    "ploeg": "U11",
    "klein": "/images/spelers/otis-kitenge-987bfe4f-klein.webp",
    "groot": "/images/spelers/otis-kitenge-987bfe4f.webp"
  },
  {
    "naam": "Pieter Peremans",
    "ploeg": "P2",
    "klein": "/images/spelers/pieter-peremans-551440bd-klein.webp",
    "groot": "/images/spelers/pieter-peremans-551440bd.webp"
  },
  {
    "naam": "Raissa Ciavarro",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/raissa-ciavarro-b14d77b4-klein.webp",
    "groot": "/images/spelers/raissa-ciavarro-b14d77b4.webp"
  },
  {
    "naam": "Sam Das",
    "ploeg": "U17A",
    "klein": "/images/spelers/sam-das-3adc2d63-klein.webp",
    "groot": "/images/spelers/sam-das-3adc2d63.webp"
  },
  {
    "naam": "Senn Deferme",
    "ploeg": "U11",
    "klein": "/images/spelers/senn-deferme-a7e53051-klein.webp",
    "groot": "/images/spelers/senn-deferme-a7e53051.webp"
  },
  {
    "naam": "Seppe Verdonck",
    "ploeg": "P2",
    "klein": "/images/spelers/seppe-verdonck-1e116c1d-klein.webp",
    "groot": "/images/spelers/seppe-verdonck-1e116c1d.webp"
  },
  {
    "naam": "Shantie Banken",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/shantie-banken-b601be3b-klein.webp",
    "groot": "/images/spelers/shantie-banken-b601be3b.webp"
  },
  {
    "naam": "Sharleen Vanderheyden",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/sharleen-vanderheyden-1ec5f670-klein.webp",
    "groot": "/images/spelers/sharleen-vanderheyden-1ec5f670.webp"
  },
  {
    "naam": "Simon Reykers",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-reykers-70b6314b-klein.webp",
    "groot": "/images/spelers/simon-reykers-70b6314b.webp"
  },
  {
    "naam": "Simon Volders",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-volders-457a361f-klein.webp",
    "groot": "/images/spelers/simon-volders-457a361f.webp"
  },
  {
    "naam": "Stan Clemens",
    "ploeg": "U9",
    "klein": "/images/spelers/stan-clemens-fd7134af-klein.webp",
    "groot": "/images/spelers/stan-clemens-fd7134af.webp"
  },
  {
    "naam": "Thomas Kellens",
    "ploeg": "P4",
    "klein": "/images/spelers/thomas-kellens-95162613-klein.webp",
    "groot": "/images/spelers/thomas-kellens-95162613.webp"
  },
  {
    "naam": "Tibo Rousset",
    "ploeg": "P4",
    "klein": "/images/spelers/tibo-rousset-a3892b23-klein.webp",
    "groot": "/images/spelers/tibo-rousset-a3892b23.webp"
  },
  {
    "naam": "Ties Van de Vijver",
    "ploeg": "U11",
    "klein": "/images/spelers/ties-van-de-vijver-74f28a0e-klein.webp",
    "groot": "/images/spelers/ties-van-de-vijver-74f28a0e.webp"
  },
  {
    "naam": "Tygo de Grave",
    "ploeg": "U17A",
    "klein": "/images/spelers/tygo-de-grave-0c96e7cd-klein.webp",
    "groot": "/images/spelers/tygo-de-grave-0c96e7cd.webp"
  },
  {
    "naam": "Victor Darville",
    "ploeg": "U9",
    "klein": "/images/spelers/victor-darville-1f6bd334-klein.webp",
    "groot": "/images/spelers/victor-darville-1f6bd334.webp"
  },
  {
    "naam": "Vik Tielens",
    "ploeg": "U9",
    "klein": "/images/spelers/vik-tielens-77f4c325-klein.webp",
    "groot": "/images/spelers/vik-tielens-77f4c325.webp"
  },
  {
    "naam": "Viktor Vanden Berghe",
    "ploeg": "U11",
    "klein": "/images/spelers/viktor-vanden-berghe-19101df6-klein.webp",
    "groot": "/images/spelers/viktor-vanden-berghe-19101df6.webp"
  },
  {
    "naam": "Vin Dullers",
    "ploeg": "U11",
    "klein": "/images/spelers/vin-dullers-92900a1f-klein.webp",
    "groot": "/images/spelers/vin-dullers-92900a1f.webp"
  },
  {
    "naam": "Vince Godfroid",
    "ploeg": "P2",
    "klein": "/images/spelers/vince-godfroid-b05bcc46-klein.webp",
    "groot": "/images/spelers/vince-godfroid-b05bcc46.webp"
  },
  {
    "naam": "Vince Goris",
    "ploeg": "U13",
    "klein": "/images/spelers/vince-goris-8ee25d57-klein.webp",
    "groot": "/images/spelers/vince-goris-8ee25d57.webp"
  },
  {
    "naam": "Xander Beutling",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-beutling-ab84e326-klein.webp",
    "groot": "/images/spelers/xander-beutling-ab84e326.webp"
  },
  {
    "naam": "Xander Budé",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-bude-27fab703-klein.webp",
    "groot": "/images/spelers/xander-bude-27fab703.webp"
  },
  {
    "naam": "Yenthe Lodewyckx",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/yenthe-lodewyckx-b11a1643-klein.webp",
    "groot": "/images/spelers/yenthe-lodewyckx-b11a1643.webp"
  },
  {
    "naam": "Yoran Moortgat",
    "ploeg": "P4",
    "klein": "/images/spelers/yoran-moortgat-1a0db25d-klein.webp",
    "groot": "/images/spelers/yoran-moortgat-1a0db25d.webp"
  }
];

export const trainers: Speler[] = [
  {
    "naam": "Danny Gaethofs",
    "ploeg": "",
    "klein": "/images/spelers/danny-gaethofs-40913206-klein.webp",
    "groot": "/images/spelers/danny-gaethofs-40913206.webp"
  },
  {
    "naam": "Frank Schroyen",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/frank-schroyen-39f22ecd-klein.webp",
    "groot": "/images/spelers/frank-schroyen-39f22ecd.webp"
  },
  {
    "naam": "Gunther Vanneroem",
    "ploeg": "U9",
    "klein": "/images/spelers/gunther-vanneroem-95455c4d-klein.webp",
    "groot": "/images/spelers/gunther-vanneroem-95455c4d.webp"
  },
  {
    "naam": "Jelle Aerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-aerts-90168d6d-klein.webp",
    "groot": "/images/spelers/jelle-aerts-90168d6d.webp"
  },
  {
    "naam": "Luc Brants",
    "ploeg": "",
    "klein": "/images/spelers/luc-brants-24202397-klein.webp",
    "groot": "/images/spelers/luc-brants-24202397.webp"
  },
  {
    "naam": "Ramon Fernandez",
    "ploeg": "P4",
    "klein": "/images/spelers/ramon-fernandez-cf8d706e-klein.webp",
    "groot": "/images/spelers/ramon-fernandez-cf8d706e.webp"
  },
  {
    "naam": "Steven Bottu",
    "ploeg": "",
    "klein": "/images/spelers/steven-bottu-eb945258-klein.webp",
    "groot": "/images/spelers/steven-bottu-eb945258.webp"
  }
];

/**
 * De foto van een trainer, als die er is.
 *
 * Een jeugdtrainer speelt soms zelf nog bij een van de ploegen. Zijn foto
 * staat dan bij de spelers en niet bij de trainers, en die willen we hier
 * evengoed tonen.
 */
export function trainerFoto(naam: string): Speler | undefined {
  const zelfde = (s: Speler) => s.naam.toLowerCase() === naam.toLowerCase();
  return trainers.find(zelfde) ?? spelers.find(zelfde);
}
