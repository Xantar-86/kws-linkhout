// public/kws-cup-sw.js
//
// De servicemedewerker van de tornooipagina: die zorgt dat /kws-cup-2026 blijft
// werken als het netwerk op het terrein hapert.
//
// Waarom dit bestand in de hoofdmap staat en niet bij de andere tornooibestanden
// in /kws-cup/: een servicemedewerker mag nooit meer bereik krijgen dan de map
// waarin hij zelf staat. De pagina is /kws-cup-2026 zonder schuine streep erna,
// en die valt niet binnen /kws-cup/ of /kws-cup-2026/. Alleen vanuit de hoofdmap
// mogen we hem op bereik "/kws-cup-2026" registreren.
//
// Het uitgangspunt is overal *eerst het netwerk*. Het schema wijzigt tijdens de
// tornooidagen, bijvoorbeeld als een ploeg afzegt, en een oud schema tonen is
// erger dan geen schema tonen. De opslag is een vangnet, geen snelweg.

const CACHE = "kws-cup-v1";
const PAGINA = "/kws-cup-2026";

/** Bestanden die er sowieso moeten zijn, ook als de pagina nooit geladen is. */
const VOORAF = [
  PAGINA,
  "/kws-cup/icon-192.png",
  "/kws-cup/icon-512.png",
  "/kws-cup/manifest.webmanifest",
];

self.addEventListener("install", (gebeurtenis) => {
  gebeurtenis.waitUntil(
    (async () => {
      const opslag = await caches.open(CACHE);
      // Eén bestand dat niet meekomt mag de installatie niet tegenhouden.
      await Promise.allSettled(VOORAF.map((pad) => opslag.add(pad)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (gebeurtenis) => {
  gebeurtenis.waitUntil(
    (async () => {
      const namen = await caches.keys();
      await Promise.all(namen.filter((n) => n !== CACHE).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

/** Het gepubliceerde schema, rechtstreeks uit de opslag of langs onze eigen API. */
function isSchema(url) {
  return url.pathname.endsWith("/kws-cup/schema.json") || url.pathname === "/api/kws-cup";
}

/**
 * Bestanden die niet wijzigen zonder dat hun adres wijzigt.
 *
 * De brokken van Next dragen een sleutel in hun naam, dus die zijn veilig om
 * uit de opslag te halen. De foto's en logo's van het tornooi wijzigen alleen
 * als iemand ze vervangt; komt dat voor, dan gaat het nummer in CACHE omhoog.
 */
function isVaststaand(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/kws-cup/") ||
    url.pathname.startsWith("/images/")
  );
}

/**
 * Bewaren wat er te bewaren valt, en anders gewoon doorgaan.
 *
 * Een doorverwijzing houden we buiten de opslag: die later teruggeven op een
 * paginabezoek weigert de browser, en dan zit de bezoeker met een lege pagina
 * in plaats van met zijn schema.
 */
async function bewaar(opslag, verzoek, antwoord) {
  if (!antwoord || !antwoord.ok || antwoord.redirected) return;
  try {
    await opslag.put(verzoek, antwoord.clone());
  } catch {
    /* de opslag kan vol zitten; dat mag het antwoord niet in de weg staan */
  }
}

/**
 * Een bewaard antwoord, met een merkteken erop.
 *
 * De pagina kan niet zien of iets van het netwerk komt of uit deze opslag, en
 * zou anders "bijgewerkt om" zetten bij een schema van een uur geleden. Met
 * deze kop weet ze dat er geen verbinding was en zegt ze dat ook.
 */
async function uitDeOpslag(bewaard) {
  const koppen = new Headers(bewaard.headers);
  koppen.set("x-kws-uit-opslag", "1");
  return new Response(await bewaard.blob(), {
    status: bewaard.status,
    statusText: bewaard.statusText,
    headers: koppen,
  });
}

/** Eerst het netwerk; lukt dat niet, dan wat we de vorige keer bewaarden. */
async function eerstHetNetwerk(verzoek, terugval) {
  const opslag = await caches.open(CACHE);
  try {
    const antwoord = await fetch(verzoek);
    await bewaar(opslag, verzoek, antwoord);
    return antwoord;
  } catch (fout) {
    const bewaard = (await opslag.match(verzoek)) || (terugval && (await opslag.match(terugval)));
    if (bewaard) return uitDeOpslag(bewaard);
    throw fout;
  }
}

/** Eerst de opslag; staat het er niet, dan halen we het op en bewaren we het. */
async function eerstDeOpslag(verzoek) {
  const opslag = await caches.open(CACHE);
  const bewaard = await opslag.match(verzoek);
  if (bewaard) return bewaard;

  const antwoord = await fetch(verzoek);
  await bewaar(opslag, verzoek, antwoord);
  return antwoord;
}

self.addEventListener("fetch", (gebeurtenis) => {
  const verzoek = gebeurtenis.request;
  if (verzoek.method !== "GET") return;

  let url;
  try {
    url = new URL(verzoek.url);
  } catch {
    return;
  }

  // De pagina zelf: altijd proberen te vernieuwen, anders de laatst gekende
  // versie tonen. Zonder deze terugval krijgt de bezoeker offline de foutpagina
  // van de browser te zien in plaats van zijn wedstrijden.
  if (verzoek.mode === "navigate") {
    gebeurtenis.respondWith(eerstHetNetwerk(verzoek, PAGINA));
    return;
  }

  if (isSchema(url)) {
    gebeurtenis.respondWith(eerstHetNetwerk(verzoek));
    return;
  }

  if (url.origin === self.location.origin && isVaststaand(url)) {
    gebeurtenis.respondWith(eerstDeOpslag(verzoek));
  }
});
