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
    "klein": "/images/spelers/alexander-cypers-klein.webp",
    "groot": "/images/spelers/alexander-cypers.webp"
  },
  {
    "naam": "Ben Andries",
    "ploeg": "P2",
    "klein": "/images/spelers/ben-andries-klein.webp",
    "groot": "/images/spelers/ben-andries.webp"
  },
  {
    "naam": "Bram Mariën",
    "ploeg": "P4",
    "klein": "/images/spelers/bram-marien-klein.webp",
    "groot": "/images/spelers/bram-marien.webp"
  },
  {
    "naam": "Daan Debruyne",
    "ploeg": "P2",
    "klein": "/images/spelers/daan-debruyne-klein.webp",
    "groot": "/images/spelers/daan-debruyne.webp"
  },
  {
    "naam": "Dries Huysmans",
    "ploeg": "P2",
    "klein": "/images/spelers/dries-huysmans-klein.webp",
    "groot": "/images/spelers/dries-huysmans.webp"
  },
  {
    "naam": "Elias Chaufoureau",
    "ploeg": "P2",
    "klein": "/images/spelers/elias-chaufoureau-klein.webp",
    "groot": "/images/spelers/elias-chaufoureau.webp"
  },
  {
    "naam": "Jacob Van Genechten",
    "ploeg": "P4",
    "klein": "/images/spelers/jacob-van-genechten-klein.webp",
    "groot": "/images/spelers/jacob-van-genechten.webp"
  },
  {
    "naam": "Jarne Peeters",
    "ploeg": "P2",
    "klein": "/images/spelers/jarne-peeters-klein.webp",
    "groot": "/images/spelers/jarne-peeters.webp"
  },
  {
    "naam": "Jaydrick Fornerino",
    "ploeg": "P4",
    "klein": "/images/spelers/jaydrick-fornerino-klein.webp",
    "groot": "/images/spelers/jaydrick-fornerino.webp"
  },
  {
    "naam": "Jelle Asnong",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-asnong-klein.webp",
    "groot": "/images/spelers/jelle-asnong.webp"
  },
  {
    "naam": "Jelle Pieraerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-pieraerts-klein.webp",
    "groot": "/images/spelers/jelle-pieraerts.webp"
  },
  {
    "naam": "Jelte Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jelte-bynens-klein.webp",
    "groot": "/images/spelers/jelte-bynens.webp"
  },
  {
    "naam": "Jenz Neven",
    "ploeg": "P4",
    "klein": "/images/spelers/jenz-neven-klein.webp",
    "groot": "/images/spelers/jenz-neven.webp"
  },
  {
    "naam": "Jonas Vaes",
    "ploeg": "P4",
    "klein": "/images/spelers/jonas-vaes-klein.webp",
    "groot": "/images/spelers/jonas-vaes.webp"
  },
  {
    "naam": "Joost Beutels",
    "ploeg": "P2",
    "klein": "/images/spelers/joost-beutels-klein.webp",
    "groot": "/images/spelers/joost-beutels.webp"
  },
  {
    "naam": "Jordy Berings",
    "ploeg": "P2",
    "klein": "/images/spelers/jordy-berings-klein.webp",
    "groot": "/images/spelers/jordy-berings.webp"
  },
  {
    "naam": "Jorne Bynens",
    "ploeg": "P2",
    "klein": "/images/spelers/jorne-bynens-klein.webp",
    "groot": "/images/spelers/jorne-bynens.webp"
  },
  {
    "naam": "Kahraman Can",
    "ploeg": "P2",
    "klein": "/images/spelers/kahraman-can-klein.webp",
    "groot": "/images/spelers/kahraman-can.webp"
  },
  {
    "naam": "Kenneth Cupers",
    "ploeg": "P4",
    "klein": "/images/spelers/kenneth-cupers-klein.webp",
    "groot": "/images/spelers/kenneth-cupers.webp"
  },
  {
    "naam": "Klevin Sagan",
    "ploeg": "P2",
    "klein": "/images/spelers/klevin-sagan-klein.webp",
    "groot": "/images/spelers/klevin-sagan.webp"
  },
  {
    "naam": "Lars Andries",
    "ploeg": "P4",
    "klein": "/images/spelers/lars-andries-klein.webp",
    "groot": "/images/spelers/lars-andries.webp"
  },
  {
    "naam": "Laurens Decoster",
    "ploeg": "P4",
    "klein": "/images/spelers/laurens-decoster-klein.webp",
    "groot": "/images/spelers/laurens-decoster.webp"
  },
  {
    "naam": "Lennert Mellebeek",
    "ploeg": "P4",
    "klein": "/images/spelers/lennert-mellebeek-klein.webp",
    "groot": "/images/spelers/lennert-mellebeek.webp"
  },
  {
    "naam": "Lorenzo Silvente Fernandez",
    "ploeg": "P2",
    "klein": "/images/spelers/lorenzo-silvente-fernandez-klein.webp",
    "groot": "/images/spelers/lorenzo-silvente-fernandez.webp"
  },
  {
    "naam": "Lucas Volders",
    "ploeg": "P4",
    "klein": "/images/spelers/lucas-volders-klein.webp",
    "groot": "/images/spelers/lucas-volders.webp"
  },
  {
    "naam": "Matthias Corten",
    "ploeg": "P2",
    "klein": "/images/spelers/matthias-corten-klein.webp",
    "groot": "/images/spelers/matthias-corten.webp"
  },
  {
    "naam": "Maxim Leduc",
    "ploeg": "P4",
    "klein": "/images/spelers/maxim-leduc-klein.webp",
    "groot": "/images/spelers/maxim-leduc.webp"
  },
  {
    "naam": "Mike Geybels",
    "ploeg": "P2",
    "klein": "/images/spelers/mike-geybels-klein.webp",
    "groot": "/images/spelers/mike-geybels.webp"
  },
  {
    "naam": "Milan Roosen",
    "ploeg": "P2",
    "klein": "/images/spelers/milan-roosen-klein.webp",
    "groot": "/images/spelers/milan-roosen.webp"
  },
  {
    "naam": "Milan Vanluyten",
    "ploeg": "P4",
    "klein": "/images/spelers/milan-vanluyten-klein.webp",
    "groot": "/images/spelers/milan-vanluyten.webp"
  },
  {
    "naam": "Nick Tuteleers",
    "ploeg": "P2",
    "klein": "/images/spelers/nick-tuteleers-klein.webp",
    "groot": "/images/spelers/nick-tuteleers.webp"
  },
  {
    "naam": "Niels Gabriels",
    "ploeg": "P2",
    "klein": "/images/spelers/niels-gabriels-klein.webp",
    "groot": "/images/spelers/niels-gabriels.webp"
  },
  {
    "naam": "Noah Gielkens",
    "ploeg": "P4",
    "klein": "/images/spelers/noah-gielkens-klein.webp",
    "groot": "/images/spelers/noah-gielkens.webp"
  },
  {
    "naam": "Noah Vandenhoudt",
    "ploeg": "P2",
    "klein": "/images/spelers/noah-vandenhoudt-klein.webp",
    "groot": "/images/spelers/noah-vandenhoudt.webp"
  },
  {
    "naam": "Pieter Peremans",
    "ploeg": "P2",
    "klein": "/images/spelers/pieter-peremans-klein.webp",
    "groot": "/images/spelers/pieter-peremans.webp"
  },
  {
    "naam": "Seppe Verdonck",
    "ploeg": "P2",
    "klein": "/images/spelers/seppe-verdonck-klein.webp",
    "groot": "/images/spelers/seppe-verdonck.webp"
  },
  {
    "naam": "Simon Reykers",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-reykers-klein.webp",
    "groot": "/images/spelers/simon-reykers.webp"
  },
  {
    "naam": "Simon Volders",
    "ploeg": "P2",
    "klein": "/images/spelers/simon-volders-klein.webp",
    "groot": "/images/spelers/simon-volders.webp"
  },
  {
    "naam": "Thomas Kellens",
    "ploeg": "P4",
    "klein": "/images/spelers/thomas-kellens-klein.webp",
    "groot": "/images/spelers/thomas-kellens.webp"
  },
  {
    "naam": "Tibo Rousset",
    "ploeg": "P4",
    "klein": "/images/spelers/tibo-rousset-klein.webp",
    "groot": "/images/spelers/tibo-rousset.webp"
  },
  {
    "naam": "Vince Godfroid",
    "ploeg": "P2",
    "klein": "/images/spelers/vince-godfroid-klein.webp",
    "groot": "/images/spelers/vince-godfroid.webp"
  },
  {
    "naam": "Xander Beutling",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-beutling-klein.webp",
    "groot": "/images/spelers/xander-beutling.webp"
  },
  {
    "naam": "Xander Budé",
    "ploeg": "P2",
    "klein": "/images/spelers/xander-bude-klein.webp",
    "groot": "/images/spelers/xander-bude.webp"
  },
  {
    "naam": "Yoran Moortgat",
    "ploeg": "P4",
    "klein": "/images/spelers/yoran-moortgat-klein.webp",
    "groot": "/images/spelers/yoran-moortgat.webp"
  }
];

export const trainers: Speler[] = [
  {
    "naam": "Jelle Aerts",
    "ploeg": "P2",
    "klein": "/images/spelers/jelle-aerts-klein.webp",
    "groot": "/images/spelers/jelle-aerts.webp"
  },
  {
    "naam": "Ramon Fernandez",
    "ploeg": "P4",
    "klein": "/images/spelers/ramon-fernandez-klein.webp",
    "groot": "/images/spelers/ramon-fernandez.webp"
  }
];

/** De foto van een trainer, als die er is. */
export function trainerFoto(naam: string): Speler | undefined {
  return trainers.find((t) => t.naam.toLowerCase() === naam.toLowerCase());
}
