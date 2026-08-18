// Gemaakt door scripts/maak-spelerfotos.mjs. Niet met de hand aanpassen:
// zet een foto in public/images/kws spelers/ en draai het script opnieuw.

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
    "klein": "/images/spelers/alexander-cypers-cfb0f822-klein.webp",
    "groot": "/images/spelers/alexander-cypers-cfb0f822.webp"
  },
  {
    "naam": "Aline Flossie",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/aline-flossie-61b9dd26-klein.webp",
    "groot": "/images/spelers/aline-flossie-61b9dd26.webp"
  },
  {
    "naam": "Amélie Mondelaers",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/amelie-mondelaers-b64f5eae-klein.webp",
    "groot": "/images/spelers/amelie-mondelaers-b64f5eae.webp"
  },
  {
    "naam": "Ben Andries",
    "ploeg": "P2",
    "klein": "/images/spelers/ben-andries-9cc4e8dc-klein.webp",
    "groot": "/images/spelers/ben-andries-9cc4e8dc.webp"
  },
  {
    "naam": "Bram Mariën",
    "ploeg": "P4",
    "klein": "/images/spelers/bram-marien-d96eb583-klein.webp",
    "groot": "/images/spelers/bram-marien-d96eb583.webp"
  },
  {
    "naam": "Brent Gilissen",
    "ploeg": "P2",
    "klein": "/images/spelers/brent-gilissen-2e3aa08b-klein.webp",
    "groot": "/images/spelers/brent-gilissen-2e3aa08b.webp"
  },
  {
    "naam": "Briana Geerts",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/briana-geerts-518a1917-klein.webp",
    "groot": "/images/spelers/briana-geerts-518a1917.webp"
  },
  {
    "naam": "Daan Debruyne",
    "ploeg": "P2",
    "klein": "/images/spelers/daan-debruyne-9c230bab-klein.webp",
    "groot": "/images/spelers/daan-debruyne-9c230bab.webp"
  },
  {
    "naam": "Destiny Banken",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/destiny-banken-cdec5064-klein.webp",
    "groot": "/images/spelers/destiny-banken-cdec5064.webp"
  },
  {
    "naam": "Dries Huysmans",
    "ploeg": "P2",
    "klein": "/images/spelers/dries-huysmans-eef71fec-klein.webp",
    "groot": "/images/spelers/dries-huysmans-eef71fec.webp"
  },
  {
    "naam": "Elias Chaufoureau",
    "ploeg": "P2",
    "klein": "/images/spelers/elias-chaufoureau-391abca0-klein.webp",
    "groot": "/images/spelers/elias-chaufoureau-391abca0.webp"
  },
  {
    "naam": "Emilie Konings",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/emilie-konings-4b2978ef-klein.webp",
    "groot": "/images/spelers/emilie-konings-4b2978ef.webp"
  },
  {
    "naam": "Emma Kellens",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/emma-kellens-a968cd82-klein.webp",
    "groot": "/images/spelers/emma-kellens-a968cd82.webp"
  },
  {
    "naam": "Emma Veekmans",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/emma-veekmans-2fef64f7-klein.webp",
    "groot": "/images/spelers/emma-veekmans-2fef64f7.webp"
  },
  {
    "naam": "Hannelore Barro",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/hannelore-barro-8b2bb636-klein.webp",
    "groot": "/images/spelers/hannelore-barro-8b2bb636.webp"
  },
  {
    "naam": "Jacey Vanweddingen",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/jacey-vanweddingen-b9921b39-klein.webp",
    "groot": "/images/spelers/jacey-vanweddingen-b9921b39.webp"
  },
  {
    "naam": "Jacob Van Genechten",
    "ploeg": "P4",
    "klein": "/images/spelers/jacob-van-genechten-beaeb746-klein.webp",
    "groot": "/images/spelers/jacob-van-genechten-beaeb746.webp"
  },
  {
    "naam": "Jade Beckers",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/jade-beckers-2e7d43d7-klein.webp",
    "groot": "/images/spelers/jade-beckers-2e7d43d7.webp"
  },
  {
    "naam": "Janne Vaes",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/janne-vaes-89dc2d57-klein.webp",
    "groot": "/images/spelers/janne-vaes-89dc2d57.webp"
  },
  {
    "naam": "Jarne Peeters",
    "ploeg": "P2",
    "klein": "/images/spelers/jarne-peeters-916d204e-klein.webp",
    "groot": "/images/spelers/jarne-peeters-916d204e.webp"
  },
  {
    "naam": "Jaydrick Fornerino",
    "ploeg": "P4",
    "klein": "/images/spelers/jaydrick-fornerino-9edabe67-klein.webp",
    "groot": "/images/spelers/jaydrick-fornerino-9edabe67.webp"
  },
  {
    "naam": "Jelle Asnong",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-asnong-94243380-klein.webp",
    "groot": "/images/spelers/jelle-asnong-94243380.webp"
  },
  {
    "naam": "Jelle Pieraerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-pieraerts-4d4a8aaa-klein.webp",
    "groot": "/images/spelers/jelle-pieraerts-4d4a8aaa.webp"
  },
  {
    "naam": "Jelte Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jelte-bynens-e67023c4-klein.webp",
    "groot": "/images/spelers/jelte-bynens-e67023c4.webp"
  },
  {
    "naam": "Jenz Neven",
    "ploeg": "P4",
    "klein": "/images/spelers/jenz-neven-d1a5617e-klein.webp",
    "groot": "/images/spelers/jenz-neven-d1a5617e.webp"
  },
  {
    "naam": "Jolien Wouters",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/jolien-wouters-f642d646-klein.webp",
    "groot": "/images/spelers/jolien-wouters-f642d646.webp"
  },
  {
    "naam": "Jonas Vaes",
    "ploeg": "P4",
    "klein": "/images/spelers/jonas-vaes-ce7fc31c-klein.webp",
    "groot": "/images/spelers/jonas-vaes-ce7fc31c.webp"
  },
  {
    "naam": "Joost Beutels",
    "ploeg": "P2",
    "klein": "/images/spelers/joost-beutels-4c058577-klein.webp",
    "groot": "/images/spelers/joost-beutels-4c058577.webp"
  },
  {
    "naam": "Jordy Berings",
    "ploeg": "P2",
    "klein": "/images/spelers/jordy-berings-5649163b-klein.webp",
    "groot": "/images/spelers/jordy-berings-5649163b.webp"
  },
  {
    "naam": "Jorne Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jorne-bynens-6cb90a95-klein.webp",
    "groot": "/images/spelers/jorne-bynens-6cb90a95.webp"
  },
  {
    "naam": "Kaat Smeulders",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/kaat-smeulders-17b497ee-klein.webp",
    "groot": "/images/spelers/kaat-smeulders-17b497ee.webp"
  },
  {
    "naam": "Kahraman Can",
    "ploeg": "P2",
    "klein": "/images/spelers/kahraman-can-bcaa559a-klein.webp",
    "groot": "/images/spelers/kahraman-can-bcaa559a.webp"
  },
  {
    "naam": "Kara Peeters",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/kara-peeters-d00ac0d4-klein.webp",
    "groot": "/images/spelers/kara-peeters-d00ac0d4.webp"
  },
  {
    "naam": "Kenneth Cupers",
    "ploeg": "P4",
    "klein": "/images/spelers/kenneth-cupers-80fda72a-klein.webp",
    "groot": "/images/spelers/kenneth-cupers-80fda72a.webp"
  },
  {
    "naam": "Klevin Sagang",
    "ploeg": "P2",
    "klein": "/images/spelers/klevin-sagang-965aca68-klein.webp",
    "groot": "/images/spelers/klevin-sagang-965aca68.webp"
  },
  {
    "naam": "Kyare Houben",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/kyare-houben-72178286-klein.webp",
    "groot": "/images/spelers/kyare-houben-72178286.webp"
  },
  {
    "naam": "Kyra Sagovac",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/kyra-sagovac-12d3fac3-klein.webp",
    "groot": "/images/spelers/kyra-sagovac-12d3fac3.webp"
  },
  {
    "naam": "Lars Andries",
    "ploeg": "P4",
    "klein": "/images/spelers/lars-andries-1e84c63a-klein.webp",
    "groot": "/images/spelers/lars-andries-1e84c63a.webp"
  },
  {
    "naam": "Laurens Decoster",
    "ploeg": "P4",
    "klein": "/images/spelers/laurens-decoster-d1f3c5bc-klein.webp",
    "groot": "/images/spelers/laurens-decoster-d1f3c5bc.webp"
  },
  {
    "naam": "Lennert Mellebeek",
    "ploeg": "P4",
    "klein": "/images/spelers/lennert-mellebeek-00e80321-klein.webp",
    "groot": "/images/spelers/lennert-mellebeek-00e80321.webp"
  },
  {
    "naam": "Lilly Luyckx",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/lilly-luyckx-178fbbba-klein.webp",
    "groot": "/images/spelers/lilly-luyckx-178fbbba.webp"
  },
  {
    "naam": "Lola Jouck",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/lola-jouck-f80666f9-klein.webp",
    "groot": "/images/spelers/lola-jouck-f80666f9.webp"
  },
  {
    "naam": "Lorenzo Silvente Fernandez",
    "ploeg": "P2",
    "klein": "/images/spelers/lorenzo-silvente-fernandez-9d1956a7-klein.webp",
    "groot": "/images/spelers/lorenzo-silvente-fernandez-9d1956a7.webp"
  },
  {
    "naam": "Lucas Volders",
    "ploeg": "P4",
    "klein": "/images/spelers/lucas-volders-79c6d137-klein.webp",
    "groot": "/images/spelers/lucas-volders-79c6d137.webp"
  },
  {
    "naam": "Marie Doggen",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/marie-doggen-eacabf5d-klein.webp",
    "groot": "/images/spelers/marie-doggen-eacabf5d.webp"
  },
  {
    "naam": "Matthias Corten",
    "ploeg": "P2",
    "klein": "/images/spelers/matthias-corten-fbcb53a8-klein.webp",
    "groot": "/images/spelers/matthias-corten-fbcb53a8.webp"
  },
  {
    "naam": "Maxim Leduc",
    "ploeg": "P4",
    "klein": "/images/spelers/maxim-leduc-c23ab5d5-klein.webp",
    "groot": "/images/spelers/maxim-leduc-c23ab5d5.webp"
  },
  {
    "naam": "Maxim Vaes",
    "ploeg": "P2",
    "klein": "/images/spelers/maxim-vaes-a75eff70-klein.webp",
    "groot": "/images/spelers/maxim-vaes-a75eff70.webp"
  },
  {
    "naam": "Meret Moldonado",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/meret-moldonado-c32e14c8-klein.webp",
    "groot": "/images/spelers/meret-moldonado-c32e14c8.webp"
  },
  {
    "naam": "Meyra Cesur",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/meyra-cesur-b1a92cf0-klein.webp",
    "groot": "/images/spelers/meyra-cesur-b1a92cf0.webp"
  },
  {
    "naam": "Mike Geybels",
    "ploeg": "P2",
    "klein": "/images/spelers/mike-geybels-5ee5dc1a-klein.webp",
    "groot": "/images/spelers/mike-geybels-5ee5dc1a.webp"
  },
  {
    "naam": "Milan Roosen",
    "ploeg": "P2",
    "klein": "/images/spelers/milan-roosen-a54a8dd0-klein.webp",
    "groot": "/images/spelers/milan-roosen-a54a8dd0.webp"
  },
  {
    "naam": "Milan Vanluyten",
    "ploeg": "P4",
    "klein": "/images/spelers/milan-vanluyten-a305badb-klein.webp",
    "groot": "/images/spelers/milan-vanluyten-a305badb.webp"
  },
  {
    "naam": "Nena Convents",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/nena-convents-6bdccd59-klein.webp",
    "groot": "/images/spelers/nena-convents-6bdccd59.webp"
  },
  {
    "naam": "Nick Tuteleers",
    "ploeg": "P2",
    "klein": "/images/spelers/nick-tuteleers-52bee353-klein.webp",
    "groot": "/images/spelers/nick-tuteleers-52bee353.webp"
  },
  {
    "naam": "Niels Gabriels",
    "ploeg": "P2",
    "klein": "/images/spelers/niels-gabriels-35680163-klein.webp",
    "groot": "/images/spelers/niels-gabriels-35680163.webp"
  },
  {
    "naam": "Noah Gielkens",
    "ploeg": "P4",
    "klein": "/images/spelers/noah-gielkens-9a65bbd2-klein.webp",
    "groot": "/images/spelers/noah-gielkens-9a65bbd2.webp"
  },
  {
    "naam": "Noah Vandenhoudt",
    "ploeg": "P2",
    "klein": "/images/spelers/noah-vandenhoudt-d1bb409f-klein.webp",
    "groot": "/images/spelers/noah-vandenhoudt-d1bb409f.webp"
  },
  {
    "naam": "Oona Vansteenwegen Walterus",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/oona-vansteenwegen-walterus-d1e9e09c-klein.webp",
    "groot": "/images/spelers/oona-vansteenwegen-walterus-d1e9e09c.webp"
  },
  {
    "naam": "Pieter Peremans",
    "ploeg": "P2",
    "klein": "/images/spelers/pieter-peremans-3e232d9b-klein.webp",
    "groot": "/images/spelers/pieter-peremans-3e232d9b.webp"
  },
  {
    "naam": "Raissa Ciavarro",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/raissa-ciavarro-0cc64dc8-klein.webp",
    "groot": "/images/spelers/raissa-ciavarro-0cc64dc8.webp"
  },
  {
    "naam": "Seppe Verdonck",
    "ploeg": "P2",
    "klein": "/images/spelers/seppe-verdonck-85c989e7-klein.webp",
    "groot": "/images/spelers/seppe-verdonck-85c989e7.webp"
  },
  {
    "naam": "Shantie Banken",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/shantie-banken-b6833c46-klein.webp",
    "groot": "/images/spelers/shantie-banken-b6833c46.webp"
  },
  {
    "naam": "Sharleen Vanderheyden",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/sharleen-vanderheyden-b0fd526d-klein.webp",
    "groot": "/images/spelers/sharleen-vanderheyden-b0fd526d.webp"
  },
  {
    "naam": "Simon Reykers",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-reykers-632337ff-klein.webp",
    "groot": "/images/spelers/simon-reykers-632337ff.webp"
  },
  {
    "naam": "Simon Volders",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-volders-1d35cba1-klein.webp",
    "groot": "/images/spelers/simon-volders-1d35cba1.webp"
  },
  {
    "naam": "Thomas Kellens",
    "ploeg": "P4",
    "klein": "/images/spelers/thomas-kellens-2c4baec8-klein.webp",
    "groot": "/images/spelers/thomas-kellens-2c4baec8.webp"
  },
  {
    "naam": "Tibo Rousset",
    "ploeg": "P4",
    "klein": "/images/spelers/tibo-rousset-b385fffd-klein.webp",
    "groot": "/images/spelers/tibo-rousset-b385fffd.webp"
  },
  {
    "naam": "Vince Godfroid",
    "ploeg": "P2",
    "klein": "/images/spelers/vince-godfroid-2b7e4d51-klein.webp",
    "groot": "/images/spelers/vince-godfroid-2b7e4d51.webp"
  },
  {
    "naam": "Xander Beutling",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-beutling-063d20d7-klein.webp",
    "groot": "/images/spelers/xander-beutling-063d20d7.webp"
  },
  {
    "naam": "Xander Budé",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-bude-7ec5c224-klein.webp",
    "groot": "/images/spelers/xander-bude-7ec5c224.webp"
  },
  {
    "naam": "Yenthe Lodewyckx",
    "ploeg": "Dames P2",
    "klein": "/images/spelers/yenthe-lodewyckx-d31b8022-klein.webp",
    "groot": "/images/spelers/yenthe-lodewyckx-d31b8022.webp"
  },
  {
    "naam": "Yoran Moortgat",
    "ploeg": "P4",
    "klein": "/images/spelers/yoran-moortgat-afb92e2c-klein.webp",
    "groot": "/images/spelers/yoran-moortgat-afb92e2c.webp"
  }
];

export const trainers: Speler[] = [
  {
    "naam": "Frank Schroyen",
    "ploeg": "Dames P1",
    "klein": "/images/spelers/frank-schroyen-18ceb24a-klein.webp",
    "groot": "/images/spelers/frank-schroyen-18ceb24a.webp"
  },
  {
    "naam": "Jelle Aerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-aerts-32923093-klein.webp",
    "groot": "/images/spelers/jelle-aerts-32923093.webp"
  },
  {
    "naam": "Luc Brants",
    "ploeg": "",
    "klein": "/images/spelers/luc-brants-fe80e147-klein.webp",
    "groot": "/images/spelers/luc-brants-fe80e147.webp"
  },
  {
    "naam": "Ramon Fernandez",
    "ploeg": "P4",
    "klein": "/images/spelers/ramon-fernandez-85b9b30b-klein.webp",
    "groot": "/images/spelers/ramon-fernandez-85b9b30b.webp"
  },
  {
    "naam": "Steven Bottu",
    "ploeg": "",
    "klein": "/images/spelers/steven-bottu-83179dfc-klein.webp",
    "groot": "/images/spelers/steven-bottu-83179dfc.webp"
  }
];

/** De foto van een trainer, als die er is. */
export function trainerFoto(naam: string): Speler | undefined {
  return trainers.find((t) => t.naam.toLowerCase() === naam.toLowerCase());
}
