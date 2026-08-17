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
    "klein": "/images/spelers/alexander-cypers-9b5e7d83-klein.webp",
    "groot": "/images/spelers/alexander-cypers-9b5e7d83.webp"
  },
  {
    "naam": "Ben Andries",
    "ploeg": "P2",
    "klein": "/images/spelers/ben-andries-9b46bedf-klein.webp",
    "groot": "/images/spelers/ben-andries-9b46bedf.webp"
  },
  {
    "naam": "Bram Mariën",
    "ploeg": "P4",
    "klein": "/images/spelers/bram-marien-dc768c41-klein.webp",
    "groot": "/images/spelers/bram-marien-dc768c41.webp"
  },
  {
    "naam": "Brent Gilissen",
    "ploeg": "P2",
    "klein": "/images/spelers/brent-gilissen-b6eb1738-klein.webp",
    "groot": "/images/spelers/brent-gilissen-b6eb1738.webp"
  },
  {
    "naam": "Daan Debruyne",
    "ploeg": "P2",
    "klein": "/images/spelers/daan-debruyne-f415f9cf-klein.webp",
    "groot": "/images/spelers/daan-debruyne-f415f9cf.webp"
  },
  {
    "naam": "Dries Huysmans",
    "ploeg": "P2",
    "klein": "/images/spelers/dries-huysmans-b6df9e5b-klein.webp",
    "groot": "/images/spelers/dries-huysmans-b6df9e5b.webp"
  },
  {
    "naam": "Elias Chaufoureau",
    "ploeg": "P2",
    "klein": "/images/spelers/elias-chaufoureau-96734653-klein.webp",
    "groot": "/images/spelers/elias-chaufoureau-96734653.webp"
  },
  {
    "naam": "Jacob Van Genechten",
    "ploeg": "P4",
    "klein": "/images/spelers/jacob-van-genechten-5eb26cb7-klein.webp",
    "groot": "/images/spelers/jacob-van-genechten-5eb26cb7.webp"
  },
  {
    "naam": "Jarne Peeters",
    "ploeg": "P2",
    "klein": "/images/spelers/jarne-peeters-ddd65c8d-klein.webp",
    "groot": "/images/spelers/jarne-peeters-ddd65c8d.webp"
  },
  {
    "naam": "Jaydrick Fornerino",
    "ploeg": "P4",
    "klein": "/images/spelers/jaydrick-fornerino-62a5dcc9-klein.webp",
    "groot": "/images/spelers/jaydrick-fornerino-62a5dcc9.webp"
  },
  {
    "naam": "Jelle Asnong",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-asnong-98330688-klein.webp",
    "groot": "/images/spelers/jelle-asnong-98330688.webp"
  },
  {
    "naam": "Jelle Pieraerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-pieraerts-166e8ad4-klein.webp",
    "groot": "/images/spelers/jelle-pieraerts-166e8ad4.webp"
  },
  {
    "naam": "Jelte Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jelte-bynens-43e503c4-klein.webp",
    "groot": "/images/spelers/jelte-bynens-43e503c4.webp"
  },
  {
    "naam": "Jenz Neven",
    "ploeg": "P4",
    "klein": "/images/spelers/jenz-neven-760a90a6-klein.webp",
    "groot": "/images/spelers/jenz-neven-760a90a6.webp"
  },
  {
    "naam": "Jonas Vaes",
    "ploeg": "P4",
    "klein": "/images/spelers/jonas-vaes-0d42b03f-klein.webp",
    "groot": "/images/spelers/jonas-vaes-0d42b03f.webp"
  },
  {
    "naam": "Joost Beutels",
    "ploeg": "P2",
    "klein": "/images/spelers/joost-beutels-a5524b03-klein.webp",
    "groot": "/images/spelers/joost-beutels-a5524b03.webp"
  },
  {
    "naam": "Jordy Berings",
    "ploeg": "P2",
    "klein": "/images/spelers/jordy-berings-655d5ba2-klein.webp",
    "groot": "/images/spelers/jordy-berings-655d5ba2.webp"
  },
  {
    "naam": "Jorne Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jorne-bynens-0232085b-klein.webp",
    "groot": "/images/spelers/jorne-bynens-0232085b.webp"
  },
  {
    "naam": "Kahraman Can",
    "ploeg": "P2",
    "klein": "/images/spelers/kahraman-can-5f0d22af-klein.webp",
    "groot": "/images/spelers/kahraman-can-5f0d22af.webp"
  },
  {
    "naam": "Kenneth Cupers",
    "ploeg": "P4",
    "klein": "/images/spelers/kenneth-cupers-85a52405-klein.webp",
    "groot": "/images/spelers/kenneth-cupers-85a52405.webp"
  },
  {
    "naam": "Klevin Sagang",
    "ploeg": "P2",
    "klein": "/images/spelers/klevin-sagang-42723a2e-klein.webp",
    "groot": "/images/spelers/klevin-sagang-42723a2e.webp"
  },
  {
    "naam": "Lars Andries",
    "ploeg": "P4",
    "klein": "/images/spelers/lars-andries-fabd45fd-klein.webp",
    "groot": "/images/spelers/lars-andries-fabd45fd.webp"
  },
  {
    "naam": "Laurens Decoster",
    "ploeg": "P4",
    "klein": "/images/spelers/laurens-decoster-8c7bed8e-klein.webp",
    "groot": "/images/spelers/laurens-decoster-8c7bed8e.webp"
  },
  {
    "naam": "Lennert Mellebeek",
    "ploeg": "P4",
    "klein": "/images/spelers/lennert-mellebeek-43b57166-klein.webp",
    "groot": "/images/spelers/lennert-mellebeek-43b57166.webp"
  },
  {
    "naam": "Lorenzo Silvente Fernandez",
    "ploeg": "P2",
    "klein": "/images/spelers/lorenzo-silvente-fernandez-0c736cf2-klein.webp",
    "groot": "/images/spelers/lorenzo-silvente-fernandez-0c736cf2.webp"
  },
  {
    "naam": "Lucas Volders",
    "ploeg": "P4",
    "klein": "/images/spelers/lucas-volders-a2230879-klein.webp",
    "groot": "/images/spelers/lucas-volders-a2230879.webp"
  },
  {
    "naam": "Matthias Corten",
    "ploeg": "P2",
    "klein": "/images/spelers/matthias-corten-60a0df44-klein.webp",
    "groot": "/images/spelers/matthias-corten-60a0df44.webp"
  },
  {
    "naam": "Maxim Leduc",
    "ploeg": "P4",
    "klein": "/images/spelers/maxim-leduc-c64cba7a-klein.webp",
    "groot": "/images/spelers/maxim-leduc-c64cba7a.webp"
  },
  {
    "naam": "Maxim Vaes",
    "ploeg": "P2",
    "klein": "/images/spelers/maxim-vaes-b68504da-klein.webp",
    "groot": "/images/spelers/maxim-vaes-b68504da.webp"
  },
  {
    "naam": "Mike Geybels",
    "ploeg": "P2",
    "klein": "/images/spelers/mike-geybels-984b6289-klein.webp",
    "groot": "/images/spelers/mike-geybels-984b6289.webp"
  },
  {
    "naam": "Milan Roosen",
    "ploeg": "P2",
    "klein": "/images/spelers/milan-roosen-2733d41b-klein.webp",
    "groot": "/images/spelers/milan-roosen-2733d41b.webp"
  },
  {
    "naam": "Milan Vanluyten",
    "ploeg": "P4",
    "klein": "/images/spelers/milan-vanluyten-0ac46e3d-klein.webp",
    "groot": "/images/spelers/milan-vanluyten-0ac46e3d.webp"
  },
  {
    "naam": "Nick Tuteleers",
    "ploeg": "P2",
    "klein": "/images/spelers/nick-tuteleers-7530f8f8-klein.webp",
    "groot": "/images/spelers/nick-tuteleers-7530f8f8.webp"
  },
  {
    "naam": "Niels Gabriels",
    "ploeg": "P2",
    "klein": "/images/spelers/niels-gabriels-2e3e2c92-klein.webp",
    "groot": "/images/spelers/niels-gabriels-2e3e2c92.webp"
  },
  {
    "naam": "Noah Gielkens",
    "ploeg": "P4",
    "klein": "/images/spelers/noah-gielkens-05e9f5f5-klein.webp",
    "groot": "/images/spelers/noah-gielkens-05e9f5f5.webp"
  },
  {
    "naam": "Noah Vandenhoudt",
    "ploeg": "P2",
    "klein": "/images/spelers/noah-vandenhoudt-3f0065ff-klein.webp",
    "groot": "/images/spelers/noah-vandenhoudt-3f0065ff.webp"
  },
  {
    "naam": "Pieter Peremans",
    "ploeg": "P2",
    "klein": "/images/spelers/pieter-peremans-2baf813c-klein.webp",
    "groot": "/images/spelers/pieter-peremans-2baf813c.webp"
  },
  {
    "naam": "Seppe Verdonck",
    "ploeg": "P2",
    "klein": "/images/spelers/seppe-verdonck-77804ff0-klein.webp",
    "groot": "/images/spelers/seppe-verdonck-77804ff0.webp"
  },
  {
    "naam": "Simon Reykers",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-reykers-acb9e966-klein.webp",
    "groot": "/images/spelers/simon-reykers-acb9e966.webp"
  },
  {
    "naam": "Simon Volders",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-volders-09068c00-klein.webp",
    "groot": "/images/spelers/simon-volders-09068c00.webp"
  },
  {
    "naam": "Thomas Kellens",
    "ploeg": "P4",
    "klein": "/images/spelers/thomas-kellens-dc3b9e0f-klein.webp",
    "groot": "/images/spelers/thomas-kellens-dc3b9e0f.webp"
  },
  {
    "naam": "Tibo Rousset",
    "ploeg": "P4",
    "klein": "/images/spelers/tibo-rousset-25b1ec1e-klein.webp",
    "groot": "/images/spelers/tibo-rousset-25b1ec1e.webp"
  },
  {
    "naam": "Vince Godfroid",
    "ploeg": "P2",
    "klein": "/images/spelers/vince-godfroid-c9f1c137-klein.webp",
    "groot": "/images/spelers/vince-godfroid-c9f1c137.webp"
  },
  {
    "naam": "Xander Beutling",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-beutling-f1086b44-klein.webp",
    "groot": "/images/spelers/xander-beutling-f1086b44.webp"
  },
  {
    "naam": "Xander Budé",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-bude-d907727b-klein.webp",
    "groot": "/images/spelers/xander-bude-d907727b.webp"
  },
  {
    "naam": "Yoran Moortgat",
    "ploeg": "P4",
    "klein": "/images/spelers/yoran-moortgat-4528fc2e-klein.webp",
    "groot": "/images/spelers/yoran-moortgat-4528fc2e.webp"
  }
];

export const trainers: Speler[] = [
  {
    "naam": "Jelle Aerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-aerts-1da40065-klein.webp",
    "groot": "/images/spelers/jelle-aerts-1da40065.webp"
  },
  {
    "naam": "Luc Brants",
    "ploeg": "",
    "klein": "/images/spelers/luc-brants-7b82a2e3-klein.webp",
    "groot": "/images/spelers/luc-brants-7b82a2e3.webp"
  },
  {
    "naam": "Ramon Fernandez",
    "ploeg": "P4",
    "klein": "/images/spelers/ramon-fernandez-46038a28-klein.webp",
    "groot": "/images/spelers/ramon-fernandez-46038a28.webp"
  }
];

/** De foto van een trainer, als die er is. */
export function trainerFoto(naam: string): Speler | undefined {
  return trainers.find((t) => t.naam.toLowerCase() === naam.toLowerCase());
}
