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
    "klein": "/images/spelers/alexander-cypers-4f5bc786-klein.webp",
    "groot": "/images/spelers/alexander-cypers-4f5bc786.webp"
  },
  {
    "naam": "Ben Andries",
    "ploeg": "P2",
    "klein": "/images/spelers/ben-andries-4707bd1b-klein.webp",
    "groot": "/images/spelers/ben-andries-4707bd1b.webp"
  },
  {
    "naam": "Bram Mariën",
    "ploeg": "P4",
    "klein": "/images/spelers/bram-marien-d8e49cc8-klein.webp",
    "groot": "/images/spelers/bram-marien-d8e49cc8.webp"
  },
  {
    "naam": "Brent Gilissen",
    "ploeg": "P2",
    "klein": "/images/spelers/brent-gilissen-5d862724-klein.webp",
    "groot": "/images/spelers/brent-gilissen-5d862724.webp"
  },
  {
    "naam": "Daan Debruyne",
    "ploeg": "P2",
    "klein": "/images/spelers/daan-debruyne-1c6daf45-klein.webp",
    "groot": "/images/spelers/daan-debruyne-1c6daf45.webp"
  },
  {
    "naam": "Dries Huysmans",
    "ploeg": "P2",
    "klein": "/images/spelers/dries-huysmans-a9f58f29-klein.webp",
    "groot": "/images/spelers/dries-huysmans-a9f58f29.webp"
  },
  {
    "naam": "Elias Chaufoureau",
    "ploeg": "P2",
    "klein": "/images/spelers/elias-chaufoureau-2724c8cd-klein.webp",
    "groot": "/images/spelers/elias-chaufoureau-2724c8cd.webp"
  },
  {
    "naam": "Jacob Van Genechten",
    "ploeg": "P4",
    "klein": "/images/spelers/jacob-van-genechten-8843bde4-klein.webp",
    "groot": "/images/spelers/jacob-van-genechten-8843bde4.webp"
  },
  {
    "naam": "Jarne Peeters",
    "ploeg": "P2",
    "klein": "/images/spelers/jarne-peeters-b6fa283a-klein.webp",
    "groot": "/images/spelers/jarne-peeters-b6fa283a.webp"
  },
  {
    "naam": "Jaydrick Fornerino",
    "ploeg": "P4",
    "klein": "/images/spelers/jaydrick-fornerino-e71ce572-klein.webp",
    "groot": "/images/spelers/jaydrick-fornerino-e71ce572.webp"
  },
  {
    "naam": "Jelle Asnong",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-asnong-366ee473-klein.webp",
    "groot": "/images/spelers/jelle-asnong-366ee473.webp"
  },
  {
    "naam": "Jelle Pieraerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-pieraerts-1c59e3c9-klein.webp",
    "groot": "/images/spelers/jelle-pieraerts-1c59e3c9.webp"
  },
  {
    "naam": "Jelte Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jelte-bynens-19e763da-klein.webp",
    "groot": "/images/spelers/jelte-bynens-19e763da.webp"
  },
  {
    "naam": "Jenz Neven",
    "ploeg": "P4",
    "klein": "/images/spelers/jenz-neven-60b09f31-klein.webp",
    "groot": "/images/spelers/jenz-neven-60b09f31.webp"
  },
  {
    "naam": "Jonas Vaes",
    "ploeg": "P4",
    "klein": "/images/spelers/jonas-vaes-e4c75b67-klein.webp",
    "groot": "/images/spelers/jonas-vaes-e4c75b67.webp"
  },
  {
    "naam": "Joost Beutels",
    "ploeg": "P2",
    "klein": "/images/spelers/joost-beutels-c887cdf5-klein.webp",
    "groot": "/images/spelers/joost-beutels-c887cdf5.webp"
  },
  {
    "naam": "Jordy Berings",
    "ploeg": "P2",
    "klein": "/images/spelers/jordy-berings-1281d20f-klein.webp",
    "groot": "/images/spelers/jordy-berings-1281d20f.webp"
  },
  {
    "naam": "Jorne Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jorne-bynens-8804080c-klein.webp",
    "groot": "/images/spelers/jorne-bynens-8804080c.webp"
  },
  {
    "naam": "Kahraman Can",
    "ploeg": "P2",
    "klein": "/images/spelers/kahraman-can-3c75f3bb-klein.webp",
    "groot": "/images/spelers/kahraman-can-3c75f3bb.webp"
  },
  {
    "naam": "Kenneth Cupers",
    "ploeg": "P4",
    "klein": "/images/spelers/kenneth-cupers-2d1fd355-klein.webp",
    "groot": "/images/spelers/kenneth-cupers-2d1fd355.webp"
  },
  {
    "naam": "Klevin Sagang",
    "ploeg": "P2",
    "klein": "/images/spelers/klevin-sagang-4ce860b6-klein.webp",
    "groot": "/images/spelers/klevin-sagang-4ce860b6.webp"
  },
  {
    "naam": "Lars Andries",
    "ploeg": "P4",
    "klein": "/images/spelers/lars-andries-168ddbe1-klein.webp",
    "groot": "/images/spelers/lars-andries-168ddbe1.webp"
  },
  {
    "naam": "Laurens Decoster",
    "ploeg": "P4",
    "klein": "/images/spelers/laurens-decoster-fa0b3525-klein.webp",
    "groot": "/images/spelers/laurens-decoster-fa0b3525.webp"
  },
  {
    "naam": "Lennert Mellebeek",
    "ploeg": "P4",
    "klein": "/images/spelers/lennert-mellebeek-630319cf-klein.webp",
    "groot": "/images/spelers/lennert-mellebeek-630319cf.webp"
  },
  {
    "naam": "Lorenzo Silvente Fernandez",
    "ploeg": "P2",
    "klein": "/images/spelers/lorenzo-silvente-fernandez-32d83a81-klein.webp",
    "groot": "/images/spelers/lorenzo-silvente-fernandez-32d83a81.webp"
  },
  {
    "naam": "Lucas Volders",
    "ploeg": "P4",
    "klein": "/images/spelers/lucas-volders-1abd8498-klein.webp",
    "groot": "/images/spelers/lucas-volders-1abd8498.webp"
  },
  {
    "naam": "Matthias Corten",
    "ploeg": "P2",
    "klein": "/images/spelers/matthias-corten-a1b0d777-klein.webp",
    "groot": "/images/spelers/matthias-corten-a1b0d777.webp"
  },
  {
    "naam": "Maxim Leduc",
    "ploeg": "P4",
    "klein": "/images/spelers/maxim-leduc-f5c70e7b-klein.webp",
    "groot": "/images/spelers/maxim-leduc-f5c70e7b.webp"
  },
  {
    "naam": "Maxim Vaes",
    "ploeg": "P2",
    "klein": "/images/spelers/maxim-vaes-022c1a2b-klein.webp",
    "groot": "/images/spelers/maxim-vaes-022c1a2b.webp"
  },
  {
    "naam": "Mike Geybels",
    "ploeg": "P2",
    "klein": "/images/spelers/mike-geybels-2edf7c80-klein.webp",
    "groot": "/images/spelers/mike-geybels-2edf7c80.webp"
  },
  {
    "naam": "Milan Roosen",
    "ploeg": "P2",
    "klein": "/images/spelers/milan-roosen-ba231abd-klein.webp",
    "groot": "/images/spelers/milan-roosen-ba231abd.webp"
  },
  {
    "naam": "Milan Vanluyten",
    "ploeg": "P4",
    "klein": "/images/spelers/milan-vanluyten-9dc1e4d8-klein.webp",
    "groot": "/images/spelers/milan-vanluyten-9dc1e4d8.webp"
  },
  {
    "naam": "Nick Tuteleers",
    "ploeg": "P2",
    "klein": "/images/spelers/nick-tuteleers-a41b872a-klein.webp",
    "groot": "/images/spelers/nick-tuteleers-a41b872a.webp"
  },
  {
    "naam": "Niels Gabriels",
    "ploeg": "P2",
    "klein": "/images/spelers/niels-gabriels-2022ab8b-klein.webp",
    "groot": "/images/spelers/niels-gabriels-2022ab8b.webp"
  },
  {
    "naam": "Noah Gielkens",
    "ploeg": "P4",
    "klein": "/images/spelers/noah-gielkens-bab7f6a6-klein.webp",
    "groot": "/images/spelers/noah-gielkens-bab7f6a6.webp"
  },
  {
    "naam": "Noah Vandenhoudt",
    "ploeg": "P2",
    "klein": "/images/spelers/noah-vandenhoudt-b28cbb99-klein.webp",
    "groot": "/images/spelers/noah-vandenhoudt-b28cbb99.webp"
  },
  {
    "naam": "Pieter Peremans",
    "ploeg": "P2",
    "klein": "/images/spelers/pieter-peremans-0d9a4517-klein.webp",
    "groot": "/images/spelers/pieter-peremans-0d9a4517.webp"
  },
  {
    "naam": "Seppe Verdonck",
    "ploeg": "P2",
    "klein": "/images/spelers/seppe-verdonck-b11b02ba-klein.webp",
    "groot": "/images/spelers/seppe-verdonck-b11b02ba.webp"
  },
  {
    "naam": "Simon Reykers",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-reykers-8eeb961b-klein.webp",
    "groot": "/images/spelers/simon-reykers-8eeb961b.webp"
  },
  {
    "naam": "Simon Volders",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-volders-66ca9df0-klein.webp",
    "groot": "/images/spelers/simon-volders-66ca9df0.webp"
  },
  {
    "naam": "Thomas Kellens",
    "ploeg": "P4",
    "klein": "/images/spelers/thomas-kellens-89a451c5-klein.webp",
    "groot": "/images/spelers/thomas-kellens-89a451c5.webp"
  },
  {
    "naam": "Tibo Rousset",
    "ploeg": "P4",
    "klein": "/images/spelers/tibo-rousset-94812f00-klein.webp",
    "groot": "/images/spelers/tibo-rousset-94812f00.webp"
  },
  {
    "naam": "Vince Godfroid",
    "ploeg": "P2",
    "klein": "/images/spelers/vince-godfroid-ad22fed3-klein.webp",
    "groot": "/images/spelers/vince-godfroid-ad22fed3.webp"
  },
  {
    "naam": "Xander Beutling",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-beutling-6813bbd7-klein.webp",
    "groot": "/images/spelers/xander-beutling-6813bbd7.webp"
  },
  {
    "naam": "Xander Budé",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-bude-346c06ed-klein.webp",
    "groot": "/images/spelers/xander-bude-346c06ed.webp"
  },
  {
    "naam": "Yoran Moortgat",
    "ploeg": "P4",
    "klein": "/images/spelers/yoran-moortgat-1e651d6d-klein.webp",
    "groot": "/images/spelers/yoran-moortgat-1e651d6d.webp"
  }
];

export const trainers: Speler[] = [
  {
    "naam": "Jelle Aerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-aerts-9557ee72-klein.webp",
    "groot": "/images/spelers/jelle-aerts-9557ee72.webp"
  },
  {
    "naam": "Ramon Fernandez",
    "ploeg": "P4",
    "klein": "/images/spelers/ramon-fernandez-7cc16c86-klein.webp",
    "groot": "/images/spelers/ramon-fernandez-7cc16c86.webp"
  }
];

/** De foto van een trainer, als die er is. */
export function trainerFoto(naam: string): Speler | undefined {
  return trainers.find((t) => t.naam.toLowerCase() === naam.toLowerCase());
}
