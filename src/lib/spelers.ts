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
    "klein": "/images/spelers/alexander-cypers-d12218af-klein.webp",
    "groot": "/images/spelers/alexander-cypers-d12218af.webp"
  },
  {
    "naam": "Alexander Manshoven",
    "ploeg": "U13",
    "klein": "/images/spelers/alexander-manshoven-510e21fa-klein.webp",
    "groot": "/images/spelers/alexander-manshoven-510e21fa.webp"
  },
  {
    "naam": "Alexander Thomas",
    "ploeg": "U15",
    "klein": "/images/spelers/alexander-thomas-52828a75-klein.webp",
    "groot": "/images/spelers/alexander-thomas-52828a75.webp"
  },
  {
    "naam": "Aliano Baeten",
    "ploeg": "U17A",
    "klein": "/images/spelers/aliano-baeten-91906303-klein.webp",
    "groot": "/images/spelers/aliano-baeten-91906303.webp"
  },
  {
    "naam": "Aline Flossie",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/aline-flossie-933adc8e-klein.webp",
    "groot": "/images/spelers/aline-flossie-933adc8e.webp"
  },
  {
    "naam": "Amélie Mondelaers",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/amelie-mondelaers-33c02907-klein.webp",
    "groot": "/images/spelers/amelie-mondelaers-33c02907.webp"
  },
  {
    "naam": "Arthur Fabré",
    "ploeg": "U15",
    "klein": "/images/spelers/arthur-fabre-ca16d808-klein.webp",
    "groot": "/images/spelers/arthur-fabre-ca16d808.webp"
  },
  {
    "naam": "Arthur Hoogstijns",
    "ploeg": "U9",
    "klein": "/images/spelers/arthur-hoogstijns-6f481e3e-klein.webp",
    "groot": "/images/spelers/arthur-hoogstijns-6f481e3e.webp"
  },
  {
    "naam": "Axel Coomans",
    "ploeg": "U15",
    "klein": "/images/spelers/axel-coomans-594606db-klein.webp",
    "groot": "/images/spelers/axel-coomans-594606db.webp"
  },
  {
    "naam": "Axl Reynders",
    "ploeg": "U17B",
    "klein": "/images/spelers/axl-reynders-6e469f0a-klein.webp",
    "groot": "/images/spelers/axl-reynders-6e469f0a.webp"
  },
  {
    "naam": "Ben Andries",
    "ploeg": "P2",
    "klein": "/images/spelers/ben-andries-bec97c97-klein.webp",
    "groot": "/images/spelers/ben-andries-bec97c97.webp"
  },
  {
    "naam": "Berre Hombroek",
    "ploeg": "U17A",
    "klein": "/images/spelers/berre-hombroek-9038ec4f-klein.webp",
    "groot": "/images/spelers/berre-hombroek-9038ec4f.webp"
  },
  {
    "naam": "Bram Mariën",
    "ploeg": "P4",
    "klein": "/images/spelers/bram-marien-81c4445c-klein.webp",
    "groot": "/images/spelers/bram-marien-81c4445c.webp"
  },
  {
    "naam": "Brent Gilissen",
    "ploeg": "P2",
    "klein": "/images/spelers/brent-gilissen-7624f83f-klein.webp",
    "groot": "/images/spelers/brent-gilissen-7624f83f.webp"
  },
  {
    "naam": "Briana Geerts",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/briana-geerts-7d6f5e28-klein.webp",
    "groot": "/images/spelers/briana-geerts-7d6f5e28.webp"
  },
  {
    "naam": "Cas Horions",
    "ploeg": "U9",
    "klein": "/images/spelers/cas-horions-6dd22a39-klein.webp",
    "groot": "/images/spelers/cas-horions-6dd22a39.webp"
  },
  {
    "naam": "Castor Ulenaers",
    "ploeg": "U11",
    "klein": "/images/spelers/castor-ulenaers-e8520d60-klein.webp",
    "groot": "/images/spelers/castor-ulenaers-e8520d60.webp"
  },
  {
    "naam": "Charly Politic",
    "ploeg": "U15",
    "klein": "/images/spelers/charly-politic-a149c677-klein.webp",
    "groot": "/images/spelers/charly-politic-a149c677.webp"
  },
  {
    "naam": "Cisse Simons",
    "ploeg": "U9",
    "klein": "/images/spelers/cisse-simons-5223c87b-klein.webp",
    "groot": "/images/spelers/cisse-simons-5223c87b.webp"
  },
  {
    "naam": "Daan Debruyne",
    "ploeg": "P2",
    "klein": "/images/spelers/daan-debruyne-b1513c7d-klein.webp",
    "groot": "/images/spelers/daan-debruyne-b1513c7d.webp"
  },
  {
    "naam": "Daan Moermans",
    "ploeg": "U17A",
    "klein": "/images/spelers/daan-moermans-f8e0fa54-klein.webp",
    "groot": "/images/spelers/daan-moermans-f8e0fa54.webp"
  },
  {
    "naam": "Destiny Banken",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/destiny-banken-c5450e47-klein.webp",
    "groot": "/images/spelers/destiny-banken-c5450e47.webp"
  },
  {
    "naam": "Dries Huysmans",
    "ploeg": "P2",
    "klein": "/images/spelers/dries-huysmans-ecf9f234-klein.webp",
    "groot": "/images/spelers/dries-huysmans-ecf9f234.webp"
  },
  {
    "naam": "Elias Chaufoureau",
    "ploeg": "P2",
    "klein": "/images/spelers/elias-chaufoureau-7c5cf11e-klein.webp",
    "groot": "/images/spelers/elias-chaufoureau-7c5cf11e.webp"
  },
  {
    "naam": "Elliot Avoux",
    "ploeg": "U17B",
    "klein": "/images/spelers/elliot-avoux-0aa4f5f2-klein.webp",
    "groot": "/images/spelers/elliot-avoux-0aa4f5f2.webp"
  },
  {
    "naam": "Elliot Michiels",
    "ploeg": "U11",
    "klein": "/images/spelers/elliot-michiels-fbe6f9d2-klein.webp",
    "groot": "/images/spelers/elliot-michiels-fbe6f9d2.webp"
  },
  {
    "naam": "Emiel Cypers",
    "ploeg": "U11",
    "klein": "/images/spelers/emiel-cypers-db3260ba-klein.webp",
    "groot": "/images/spelers/emiel-cypers-db3260ba.webp"
  },
  {
    "naam": "Emiel Neyens",
    "ploeg": "U11",
    "klein": "/images/spelers/emiel-neyens-83a071ff-klein.webp",
    "groot": "/images/spelers/emiel-neyens-83a071ff.webp"
  },
  {
    "naam": "Emile Huls",
    "ploeg": "U15",
    "klein": "/images/spelers/emile-huls-2ed9f24a-klein.webp",
    "groot": "/images/spelers/emile-huls-2ed9f24a.webp"
  },
  {
    "naam": "Emilie Konings",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/emilie-konings-bf4fd820-klein.webp",
    "groot": "/images/spelers/emilie-konings-bf4fd820.webp"
  },
  {
    "naam": "Emma Kellens",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/emma-kellens-994a0098-klein.webp",
    "groot": "/images/spelers/emma-kellens-994a0098.webp"
  },
  {
    "naam": "Emma Veekmans",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/emma-veekmans-22f26f7a-klein.webp",
    "groot": "/images/spelers/emma-veekmans-22f26f7a.webp"
  },
  {
    "naam": "Ferre Luts",
    "ploeg": "U15",
    "klein": "/images/spelers/ferre-luts-022ddd05-klein.webp",
    "groot": "/images/spelers/ferre-luts-022ddd05.webp"
  },
  {
    "naam": "Fynn Deferme",
    "ploeg": "U15",
    "klein": "/images/spelers/fynn-deferme-2cf38144-klein.webp",
    "groot": "/images/spelers/fynn-deferme-2cf38144.webp"
  },
  {
    "naam": "Gerard Vanleuven",
    "ploeg": "U17B",
    "klein": "/images/spelers/gerard-vanleuven-2487056b-klein.webp",
    "groot": "/images/spelers/gerard-vanleuven-2487056b.webp"
  },
  {
    "naam": "Hannelore Barro",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/hannelore-barro-861cfe7f-klein.webp",
    "groot": "/images/spelers/hannelore-barro-861cfe7f.webp"
  },
  {
    "naam": "Ibe Thoelen",
    "ploeg": "U11",
    "klein": "/images/spelers/ibe-thoelen-13d5df40-klein.webp",
    "groot": "/images/spelers/ibe-thoelen-13d5df40.webp"
  },
  {
    "naam": "Ignas Van Genechten",
    "ploeg": "U17A",
    "klein": "/images/spelers/ignas-van-genechten-b8cddbcb-klein.webp",
    "groot": "/images/spelers/ignas-van-genechten-b8cddbcb.webp"
  },
  {
    "naam": "Jacey Vanweddingen",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/jacey-vanweddingen-3aef96b7-klein.webp",
    "groot": "/images/spelers/jacey-vanweddingen-3aef96b7.webp"
  },
  {
    "naam": "Jacob Van Genechten",
    "ploeg": "P4",
    "klein": "/images/spelers/jacob-van-genechten-dd50bbe5-klein.webp",
    "groot": "/images/spelers/jacob-van-genechten-dd50bbe5.webp"
  },
  {
    "naam": "Jade Beckers",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/jade-beckers-835d6fe8-klein.webp",
    "groot": "/images/spelers/jade-beckers-835d6fe8.webp"
  },
  {
    "naam": "Jake Michiels",
    "ploeg": "U9",
    "klein": "/images/spelers/jake-michiels-ed5a91a0-klein.webp",
    "groot": "/images/spelers/jake-michiels-ed5a91a0.webp"
  },
  {
    "naam": "Janne Vaes",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/janne-vaes-36b9af8d-klein.webp",
    "groot": "/images/spelers/janne-vaes-36b9af8d.webp"
  },
  {
    "naam": "Jarne Peeters",
    "ploeg": "P2",
    "klein": "/images/spelers/jarne-peeters-54d467e0-klein.webp",
    "groot": "/images/spelers/jarne-peeters-54d467e0.webp"
  },
  {
    "naam": "Jaydrick Fornerino",
    "ploeg": "P4",
    "klein": "/images/spelers/jaydrick-fornerino-289bd102-klein.webp",
    "groot": "/images/spelers/jaydrick-fornerino-289bd102.webp"
  },
  {
    "naam": "Jelle Asnong",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-asnong-26e74f28-klein.webp",
    "groot": "/images/spelers/jelle-asnong-26e74f28.webp"
  },
  {
    "naam": "Jelle Pieraerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-pieraerts-cfb30633-klein.webp",
    "groot": "/images/spelers/jelle-pieraerts-cfb30633.webp"
  },
  {
    "naam": "Jelte Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jelte-bynens-0581b2b7-klein.webp",
    "groot": "/images/spelers/jelte-bynens-0581b2b7.webp"
  },
  {
    "naam": "Jenz Neven",
    "ploeg": "P4",
    "klein": "/images/spelers/jenz-neven-fd54e201-klein.webp",
    "groot": "/images/spelers/jenz-neven-fd54e201.webp"
  },
  {
    "naam": "Jolien Wouters",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/jolien-wouters-532b6ad8-klein.webp",
    "groot": "/images/spelers/jolien-wouters-532b6ad8.webp"
  },
  {
    "naam": "Jonas Vaes",
    "ploeg": "P4",
    "klein": "/images/spelers/jonas-vaes-870b7a19-klein.webp",
    "groot": "/images/spelers/jonas-vaes-870b7a19.webp"
  },
  {
    "naam": "Joost Beutels",
    "ploeg": "P2",
    "klein": "/images/spelers/joost-beutels-61f41a09-klein.webp",
    "groot": "/images/spelers/joost-beutels-61f41a09.webp"
  },
  {
    "naam": "Jordy Berings",
    "ploeg": "P2",
    "klein": "/images/spelers/jordy-berings-57fc47ac-klein.webp",
    "groot": "/images/spelers/jordy-berings-57fc47ac.webp"
  },
  {
    "naam": "Jorne Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jorne-bynens-0d663b3f-klein.webp",
    "groot": "/images/spelers/jorne-bynens-0d663b3f.webp"
  },
  {
    "naam": "Jorne Ghijs",
    "ploeg": "U17B",
    "klein": "/images/spelers/jorne-ghijs-4263fb98-klein.webp",
    "groot": "/images/spelers/jorne-ghijs-4263fb98.webp"
  },
  {
    "naam": "Jure Neven",
    "ploeg": "U17A",
    "klein": "/images/spelers/jure-neven-7e0b5072-klein.webp",
    "groot": "/images/spelers/jure-neven-7e0b5072.webp"
  },
  {
    "naam": "Juul Vanheukelom",
    "ploeg": "U17A",
    "klein": "/images/spelers/juul-vanheukelom-97875afa-klein.webp",
    "groot": "/images/spelers/juul-vanheukelom-97875afa.webp"
  },
  {
    "naam": "Juul Verpoorten",
    "ploeg": "U17A",
    "klein": "/images/spelers/juul-verpoorten-a0250718-klein.webp",
    "groot": "/images/spelers/juul-verpoorten-a0250718.webp"
  },
  {
    "naam": "Kaat Smeulders",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/kaat-smeulders-d3009fd5-klein.webp",
    "groot": "/images/spelers/kaat-smeulders-d3009fd5.webp"
  },
  {
    "naam": "Kahraman Can",
    "ploeg": "P2",
    "klein": "/images/spelers/kahraman-can-3a105f58-klein.webp",
    "groot": "/images/spelers/kahraman-can-3a105f58.webp"
  },
  {
    "naam": "Kara Peeters",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/kara-peeters-2ec42d28-klein.webp",
    "groot": "/images/spelers/kara-peeters-2ec42d28.webp"
  },
  {
    "naam": "Kenneth Cupers",
    "ploeg": "P4",
    "klein": "/images/spelers/kenneth-cupers-13b690b4-klein.webp",
    "groot": "/images/spelers/kenneth-cupers-13b690b4.webp"
  },
  {
    "naam": "Klevin Sagang",
    "ploeg": "P2",
    "klein": "/images/spelers/klevin-sagang-56cff38e-klein.webp",
    "groot": "/images/spelers/klevin-sagang-56cff38e.webp"
  },
  {
    "naam": "Kyare Houben",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/kyare-houben-1f56a825-klein.webp",
    "groot": "/images/spelers/kyare-houben-1f56a825.webp"
  },
  {
    "naam": "Kyra Sagovac",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/kyra-sagovac-f9840d41-klein.webp",
    "groot": "/images/spelers/kyra-sagovac-f9840d41.webp"
  },
  {
    "naam": "Lander Rymen",
    "ploeg": "U15",
    "klein": "/images/spelers/lander-rymen-667769a9-klein.webp",
    "groot": "/images/spelers/lander-rymen-667769a9.webp"
  },
  {
    "naam": "Lars Andries",
    "ploeg": "P4",
    "klein": "/images/spelers/lars-andries-5181092a-klein.webp",
    "groot": "/images/spelers/lars-andries-5181092a.webp"
  },
  {
    "naam": "Laurens Decoster",
    "ploeg": "P4",
    "klein": "/images/spelers/laurens-decoster-54acd0e4-klein.webp",
    "groot": "/images/spelers/laurens-decoster-54acd0e4.webp"
  },
  {
    "naam": "Lennert Mellebeek",
    "ploeg": "P4",
    "klein": "/images/spelers/lennert-mellebeek-91140290-klein.webp",
    "groot": "/images/spelers/lennert-mellebeek-91140290.webp"
  },
  {
    "naam": "Leon Vanneroem",
    "ploeg": "U9",
    "klein": "/images/spelers/leon-vanneroem-233e74be-klein.webp",
    "groot": "/images/spelers/leon-vanneroem-233e74be.webp"
  },
  {
    "naam": "Lilly Luyck",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/lilly-luyck-eef9ce2a-klein.webp",
    "groot": "/images/spelers/lilly-luyck-eef9ce2a.webp"
  },
  {
    "naam": "Lola Jouck",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/lola-jouck-15ece3ad-klein.webp",
    "groot": "/images/spelers/lola-jouck-15ece3ad.webp"
  },
  {
    "naam": "Lorenzo Silvente Fernandez",
    "ploeg": "P2",
    "klein": "/images/spelers/lorenzo-silvente-fernandez-396de839-klein.webp",
    "groot": "/images/spelers/lorenzo-silvente-fernandez-396de839.webp"
  },
  {
    "naam": "Louis Vanschoonbeek",
    "ploeg": "U9",
    "klein": "/images/spelers/louis-vanschoonbeek-5a3a2c98-klein.webp",
    "groot": "/images/spelers/louis-vanschoonbeek-5a3a2c98.webp"
  },
  {
    "naam": "Lucas Volders",
    "ploeg": "P4",
    "klein": "/images/spelers/lucas-volders-11a5a824-klein.webp",
    "groot": "/images/spelers/lucas-volders-11a5a824.webp"
  },
  {
    "naam": "Marie Doggen",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/marie-doggen-9b06fc12-klein.webp",
    "groot": "/images/spelers/marie-doggen-9b06fc12.webp"
  },
  {
    "naam": "Mathieu Huls",
    "ploeg": "U11",
    "klein": "/images/spelers/mathieu-huls-d206d6eb-klein.webp",
    "groot": "/images/spelers/mathieu-huls-d206d6eb.webp"
  },
  {
    "naam": "Mathilde Ramaekers",
    "ploeg": "U9",
    "klein": "/images/spelers/mathilde-ramaekers-85573152-klein.webp",
    "groot": "/images/spelers/mathilde-ramaekers-85573152.webp"
  },
  {
    "naam": "Matisse Peeters",
    "ploeg": "U17A",
    "klein": "/images/spelers/matisse-peeters-0ac58e10-klein.webp",
    "groot": "/images/spelers/matisse-peeters-0ac58e10.webp"
  },
  {
    "naam": "Mats Van Der Leun",
    "ploeg": "U11",
    "klein": "/images/spelers/mats-van-der-leun-d44e9ccf-klein.webp",
    "groot": "/images/spelers/mats-van-der-leun-d44e9ccf.webp"
  },
  {
    "naam": "Mats-Alexander Tutenel",
    "ploeg": "U17A",
    "klein": "/images/spelers/mats-alexander-tutenel-8b0f5e67-klein.webp",
    "groot": "/images/spelers/mats-alexander-tutenel-8b0f5e67.webp"
  },
  {
    "naam": "Matthias Corten",
    "ploeg": "P2",
    "klein": "/images/spelers/matthias-corten-7fac3f54-klein.webp",
    "groot": "/images/spelers/matthias-corten-7fac3f54.webp"
  },
  {
    "naam": "Mauro Deprez",
    "ploeg": "U15",
    "klein": "/images/spelers/mauro-deprez-c760daf0-klein.webp",
    "groot": "/images/spelers/mauro-deprez-c760daf0.webp"
  },
  {
    "naam": "Maxim Coemans",
    "ploeg": "U9",
    "klein": "/images/spelers/maxim-coemans-a36a3e8a-klein.webp",
    "groot": "/images/spelers/maxim-coemans-a36a3e8a.webp"
  },
  {
    "naam": "Maxim Leduc",
    "ploeg": "P4",
    "klein": "/images/spelers/maxim-leduc-5b91dde4-klein.webp",
    "groot": "/images/spelers/maxim-leduc-5b91dde4.webp"
  },
  {
    "naam": "Maxim Vaes",
    "ploeg": "P2",
    "klein": "/images/spelers/maxim-vaes-b6bba857-klein.webp",
    "groot": "/images/spelers/maxim-vaes-b6bba857.webp"
  },
  {
    "naam": "Maxime Mathieu",
    "ploeg": "U17B",
    "klein": "/images/spelers/maxime-mathieu-95475db4-klein.webp",
    "groot": "/images/spelers/maxime-mathieu-95475db4.webp"
  },
  {
    "naam": "Meret Moldonado",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/meret-moldonado-f56dafcc-klein.webp",
    "groot": "/images/spelers/meret-moldonado-f56dafcc.webp"
  },
  {
    "naam": "Meyra Cesur",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/meyra-cesur-f4fed8a9-klein.webp",
    "groot": "/images/spelers/meyra-cesur-f4fed8a9.webp"
  },
  {
    "naam": "Mike Geybels",
    "ploeg": "P2",
    "klein": "/images/spelers/mike-geybels-0ea6a4ed-klein.webp",
    "groot": "/images/spelers/mike-geybels-0ea6a4ed.webp"
  },
  {
    "naam": "Milan Roosen",
    "ploeg": "P2",
    "klein": "/images/spelers/milan-roosen-1ed05039-klein.webp",
    "groot": "/images/spelers/milan-roosen-1ed05039.webp"
  },
  {
    "naam": "Milan Vanluyten",
    "ploeg": "P4",
    "klein": "/images/spelers/milan-vanluyten-0de090a5-klein.webp",
    "groot": "/images/spelers/milan-vanluyten-0de090a5.webp"
  },
  {
    "naam": "Mon Hoebrekx",
    "ploeg": "U17A",
    "klein": "/images/spelers/mon-hoebrekx-87bdbfc8-klein.webp",
    "groot": "/images/spelers/mon-hoebrekx-87bdbfc8.webp"
  },
  {
    "naam": "Nena Convents",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/nena-convents-99303c7f-klein.webp",
    "groot": "/images/spelers/nena-convents-99303c7f.webp"
  },
  {
    "naam": "Niccolò Liaci",
    "ploeg": "U15",
    "klein": "/images/spelers/niccolo-liaci-cc40bc74-klein.webp",
    "groot": "/images/spelers/niccolo-liaci-cc40bc74.webp"
  },
  {
    "naam": "Nick Tuteleers",
    "ploeg": "P2",
    "klein": "/images/spelers/nick-tuteleers-c251df8f-klein.webp",
    "groot": "/images/spelers/nick-tuteleers-c251df8f.webp"
  },
  {
    "naam": "Niels Gabriels",
    "ploeg": "P2",
    "klein": "/images/spelers/niels-gabriels-3cee10c3-klein.webp",
    "groot": "/images/spelers/niels-gabriels-3cee10c3.webp"
  },
  {
    "naam": "Nio Thoelen",
    "ploeg": "U15",
    "klein": "/images/spelers/nio-thoelen-a4679b9e-klein.webp",
    "groot": "/images/spelers/nio-thoelen-a4679b9e.webp"
  },
  {
    "naam": "Noah Gielkens",
    "ploeg": "P4",
    "klein": "/images/spelers/noah-gielkens-448dd35a-klein.webp",
    "groot": "/images/spelers/noah-gielkens-448dd35a.webp"
  },
  {
    "naam": "Noah Stockmans",
    "ploeg": "U9",
    "klein": "/images/spelers/noah-stockmans-94a315a7-klein.webp",
    "groot": "/images/spelers/noah-stockmans-94a315a7.webp"
  },
  {
    "naam": "Noah Vandenhoudt",
    "ploeg": "P2",
    "klein": "/images/spelers/noah-vandenhoudt-bdaf32ed-klein.webp",
    "groot": "/images/spelers/noah-vandenhoudt-bdaf32ed.webp"
  },
  {
    "naam": "Oona Vansteenwegen Walterus",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/oona-vansteenwegen-walterus-9d9a955e-klein.webp",
    "groot": "/images/spelers/oona-vansteenwegen-walterus-9d9a955e.webp"
  },
  {
    "naam": "Oscar Cleeren",
    "ploeg": "U9",
    "klein": "/images/spelers/oscar-cleeren-3ae01d6c-klein.webp",
    "groot": "/images/spelers/oscar-cleeren-3ae01d6c.webp"
  },
  {
    "naam": "Otis Kitenge",
    "ploeg": "U11",
    "klein": "/images/spelers/otis-kitenge-7b01d0f4-klein.webp",
    "groot": "/images/spelers/otis-kitenge-7b01d0f4.webp"
  },
  {
    "naam": "Pieter Peremans",
    "ploeg": "P2",
    "klein": "/images/spelers/pieter-peremans-aa37fcf0-klein.webp",
    "groot": "/images/spelers/pieter-peremans-aa37fcf0.webp"
  },
  {
    "naam": "Raissa Ciavarro",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/raissa-ciavarro-00e1b100-klein.webp",
    "groot": "/images/spelers/raissa-ciavarro-00e1b100.webp"
  },
  {
    "naam": "Robbe Reynders",
    "ploeg": "U15",
    "klein": "/images/spelers/robbe-reynders-8c583902-klein.webp",
    "groot": "/images/spelers/robbe-reynders-8c583902.webp"
  },
  {
    "naam": "Sam Das",
    "ploeg": "U17A",
    "klein": "/images/spelers/sam-das-c4e599c6-klein.webp",
    "groot": "/images/spelers/sam-das-c4e599c6.webp"
  },
  {
    "naam": "Sander Van Mieghem",
    "ploeg": "U17B",
    "klein": "/images/spelers/sander-van-mieghem-bc983318-klein.webp",
    "groot": "/images/spelers/sander-van-mieghem-bc983318.webp"
  },
  {
    "naam": "Senn Deferme",
    "ploeg": "U11",
    "klein": "/images/spelers/senn-deferme-d5239fe6-klein.webp",
    "groot": "/images/spelers/senn-deferme-d5239fe6.webp"
  },
  {
    "naam": "Senn Jacobs",
    "ploeg": "U17B",
    "klein": "/images/spelers/senn-jacobs-46b102b3-klein.webp",
    "groot": "/images/spelers/senn-jacobs-46b102b3.webp"
  },
  {
    "naam": "Seppe Breugelmans",
    "ploeg": "U15",
    "klein": "/images/spelers/seppe-breugelmans-f0673ca1-klein.webp",
    "groot": "/images/spelers/seppe-breugelmans-f0673ca1.webp"
  },
  {
    "naam": "Seppe Verdonck",
    "ploeg": "P2",
    "klein": "/images/spelers/seppe-verdonck-d9795896-klein.webp",
    "groot": "/images/spelers/seppe-verdonck-d9795896.webp"
  },
  {
    "naam": "Shantie Banken",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/shantie-banken-8cf51b95-klein.webp",
    "groot": "/images/spelers/shantie-banken-8cf51b95.webp"
  },
  {
    "naam": "Sharleen Vanderheyden",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/sharleen-vanderheyden-514d5ece-klein.webp",
    "groot": "/images/spelers/sharleen-vanderheyden-514d5ece.webp"
  },
  {
    "naam": "Sietse Darcis",
    "ploeg": "U17B",
    "klein": "/images/spelers/sietse-darcis-d56d9c9f-klein.webp",
    "groot": "/images/spelers/sietse-darcis-d56d9c9f.webp"
  },
  {
    "naam": "Simon De Bruycker",
    "ploeg": "U15",
    "klein": "/images/spelers/simon-de-bruycker-819fc14c-klein.webp",
    "groot": "/images/spelers/simon-de-bruycker-819fc14c.webp"
  },
  {
    "naam": "Simon Reykers",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-reykers-ef47923e-klein.webp",
    "groot": "/images/spelers/simon-reykers-ef47923e.webp"
  },
  {
    "naam": "Simon Volders",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-volders-fbfeb489-klein.webp",
    "groot": "/images/spelers/simon-volders-fbfeb489.webp"
  },
  {
    "naam": "Speler 33",
    "ploeg": "U17B",
    "klein": "/images/spelers/speler-33-60d41879-klein.webp",
    "groot": "/images/spelers/speler-33-60d41879.webp"
  },
  {
    "naam": "Stan Clemens",
    "ploeg": "U9",
    "klein": "/images/spelers/stan-clemens-9b4dd3a4-klein.webp",
    "groot": "/images/spelers/stan-clemens-9b4dd3a4.webp"
  },
  {
    "naam": "Stan Tielens",
    "ploeg": "U17B",
    "klein": "/images/spelers/stan-tielens-33ef59fb-klein.webp",
    "groot": "/images/spelers/stan-tielens-33ef59fb.webp"
  },
  {
    "naam": "Thomas Buyck",
    "ploeg": "U15",
    "klein": "/images/spelers/thomas-buyck-b92d273c-klein.webp",
    "groot": "/images/spelers/thomas-buyck-b92d273c.webp"
  },
  {
    "naam": "Thomas Kellens",
    "ploeg": "P4",
    "klein": "/images/spelers/thomas-kellens-5bcab895-klein.webp",
    "groot": "/images/spelers/thomas-kellens-5bcab895.webp"
  },
  {
    "naam": "Tibo Rousset",
    "ploeg": "P4",
    "klein": "/images/spelers/tibo-rousset-982cc588-klein.webp",
    "groot": "/images/spelers/tibo-rousset-982cc588.webp"
  },
  {
    "naam": "Ties Van de Vijver",
    "ploeg": "U11",
    "klein": "/images/spelers/ties-van-de-vijver-fd3e98f5-klein.webp",
    "groot": "/images/spelers/ties-van-de-vijver-fd3e98f5.webp"
  },
  {
    "naam": "Tygo de Grave",
    "ploeg": "U17A",
    "klein": "/images/spelers/tygo-de-grave-c0633222-klein.webp",
    "groot": "/images/spelers/tygo-de-grave-c0633222.webp"
  },
  {
    "naam": "Vic Janssen",
    "ploeg": "U15",
    "klein": "/images/spelers/vic-janssen-6bfcaf47-klein.webp",
    "groot": "/images/spelers/vic-janssen-6bfcaf47.webp"
  },
  {
    "naam": "Victor Darville",
    "ploeg": "U9",
    "klein": "/images/spelers/victor-darville-0bf03456-klein.webp",
    "groot": "/images/spelers/victor-darville-0bf03456.webp"
  },
  {
    "naam": "Vik Tielens",
    "ploeg": "U9",
    "klein": "/images/spelers/vik-tielens-e3904be0-klein.webp",
    "groot": "/images/spelers/vik-tielens-e3904be0.webp"
  },
  {
    "naam": "Viktor Vanden Berghe",
    "ploeg": "U11",
    "klein": "/images/spelers/viktor-vanden-berghe-de435a30-klein.webp",
    "groot": "/images/spelers/viktor-vanden-berghe-de435a30.webp"
  },
  {
    "naam": "Vin Dullers",
    "ploeg": "U11",
    "klein": "/images/spelers/vin-dullers-747c8d25-klein.webp",
    "groot": "/images/spelers/vin-dullers-747c8d25.webp"
  },
  {
    "naam": "Vince Godfroid",
    "ploeg": "P2",
    "klein": "/images/spelers/vince-godfroid-082e18ad-klein.webp",
    "groot": "/images/spelers/vince-godfroid-082e18ad.webp"
  },
  {
    "naam": "Vince Goris",
    "ploeg": "U13",
    "klein": "/images/spelers/vince-goris-23edbc82-klein.webp",
    "groot": "/images/spelers/vince-goris-23edbc82.webp"
  },
  {
    "naam": "Warre Reynders",
    "ploeg": "U17B",
    "klein": "/images/spelers/warre-reynders-0fefe622-klein.webp",
    "groot": "/images/spelers/warre-reynders-0fefe622.webp"
  },
  {
    "naam": "Wout Forier",
    "ploeg": "U17B",
    "klein": "/images/spelers/wout-forier-6b5e3aaf-klein.webp",
    "groot": "/images/spelers/wout-forier-6b5e3aaf.webp"
  },
  {
    "naam": "Xander Beutling",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-beutling-b18f9ee0-klein.webp",
    "groot": "/images/spelers/xander-beutling-b18f9ee0.webp"
  },
  {
    "naam": "Xander Budé",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-bude-8702b643-klein.webp",
    "groot": "/images/spelers/xander-bude-8702b643.webp"
  },
  {
    "naam": "Yenthe Lodewyckx",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/yenthe-lodewyckx-ecdf110f-klein.webp",
    "groot": "/images/spelers/yenthe-lodewyckx-ecdf110f.webp"
  },
  {
    "naam": "Yoran Moortgat",
    "ploeg": "P4",
    "klein": "/images/spelers/yoran-moortgat-9d9fb1d0-klein.webp",
    "groot": "/images/spelers/yoran-moortgat-9d9fb1d0.webp"
  }
];

export const trainers: Speler[] = [
  {
    "naam": "Danny Gaethofs",
    "ploeg": "",
    "klein": "/images/spelers/danny-gaethofs-3d351b81-klein.webp",
    "groot": "/images/spelers/danny-gaethofs-3d351b81.webp"
  },
  {
    "naam": "Frank Schroyen",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/frank-schroyen-5430093b-klein.webp",
    "groot": "/images/spelers/frank-schroyen-5430093b.webp"
  },
  {
    "naam": "Gunther Vanneroem",
    "ploeg": "U9",
    "klein": "/images/spelers/gunther-vanneroem-c8894035-klein.webp",
    "groot": "/images/spelers/gunther-vanneroem-c8894035.webp"
  },
  {
    "naam": "Jasper Peremans",
    "ploeg": "",
    "klein": "/images/spelers/jasper-peremans-db64fa85-klein.webp",
    "groot": "/images/spelers/jasper-peremans-db64fa85.webp"
  },
  {
    "naam": "Jelle Aerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-aerts-e631340d-klein.webp",
    "groot": "/images/spelers/jelle-aerts-e631340d.webp"
  },
  {
    "naam": "Luc Brants",
    "ploeg": "",
    "klein": "/images/spelers/luc-brants-2b3b57b5-klein.webp",
    "groot": "/images/spelers/luc-brants-2b3b57b5.webp"
  },
  {
    "naam": "Ramon Fernandez",
    "ploeg": "P4",
    "klein": "/images/spelers/ramon-fernandez-67eb2e12-klein.webp",
    "groot": "/images/spelers/ramon-fernandez-67eb2e12.webp"
  },
  {
    "naam": "Steven Bottu",
    "ploeg": "",
    "klein": "/images/spelers/steven-bottu-db032a51-klein.webp",
    "groot": "/images/spelers/steven-bottu-db032a51.webp"
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
