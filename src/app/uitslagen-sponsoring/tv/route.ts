import { teams } from "@/lib/teams";
import { rbfaTeamId } from "@/lib/rbfa";
import { SPONSORS } from "@/lib/sponsors";

/**
 * Het tv-scherm voor de kantine, in een lichte versie voor de mediaspeler.
 *
 * De speler aan de tv (een IAdea MBR-1100) heeft een ingebouwde browser van
 * Chrome 68 die niet bij te werken is. Next 16 en Tailwind 4 werken pas vanaf
 * Chrome 111, daarom is dit gewone HTML, CSS en JavaScript zonder
 * nieuwigheden: geen gap bij flexbox, geen min(), geen ?. of ??.
 *
 * Donkere opmaak (sinds 19/11/2026 terug; de lichte versie van 15/11 tot
 * 19/11 staat in de git-geschiedenis, commit e73f24f). Sinds 15/11/2026 een
 * eigen opmaak, groot en met veel contrast zodat ze van
 * ver leesbaar is: enkel de ploegen rond onze plaats in het klassement, de
 * vorm als gekleurde blokken, en het uitgesneden clubschild
 * (public/images/tv/schild-kws-360.png).
 *
 * Vóór de uitslagen van elke ploeg komt eerst de ploegfoto in het
 * teamfoto-sjabloon. Die beelden staan klaar in public/images/tv/ploegfoto en
 * worden gemaakt met scripts/tv-ploegfotos.py; na een nieuwe ploegfoto of een
 * nieuw sjabloon dat script opnieuw draaien.
 *
 * Om de 3 ploegen komt een affiche (AFFICHE hieronder, nu de wafelverkoop
 * 2026). Na de actie AFFICHE op null zetten.
 *
 * Alles wordt in de browser opgehaald: de bond laat sinds oktober 2026 enkel
 * echte browsers toe. Datums en uren staan vast op Brussel.
 *
 * In het adres:
 *   ?ploeg=25&sponsor=12   seconden per ploeg en per sponsorscherm
 *   ?affiche=20            seconden voor de affiche om de 3 ploegen (standaard 20, 0 = geen affiche)
 *   ?foto=8                seconden voor de ploegfoto vóór elke ploeg (standaard 8, 0 = geen foto's)
 *   ?live=1                herlaadt vanzelf zodra de pagina verandert (handig bij aanpassen)
 *   ?dia=2&vast=1          begint bij de derde dia en blijft daar staan
 */

/** Affiche die om de 3 ploegen schermvullend verschijnt; null = geen. */
const AFFICHE: string | null = "/images/tv/wafelverkoop-2026.jpg";

/** Zelfde naamregel als scripts/tv-ploegfotos.py. */
function ploegfoto(image: string): string | null {
  if (!image.startsWith("/images/teams/")) return null;
  const basis = image.split("/").pop()!.replace(/\.[^.]+$/, "");
  return `/images/tv/ploegfoto/${basis.trim().replace(/\s+/g, "-").toLowerCase()}.jpg`;
}

const PLOEGEN = teams
  .map((t) => ({
    naam: t.name,
    id: rbfaTeamId([t.standingsIframe, t.calendarIframe]),
    foto: ploegfoto(t.image),
  }))
  .filter((p) => p.id);

const STIJL = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body { background: #0b0708; color: #fff; font-family: "Inter", system-ui, sans-serif; overflow: hidden; cursor: none; -webkit-font-smoothing: antialiased; }
.disp { font-family: "Archivo", "Inter", system-ui, sans-serif; }
.num { font-variant-numeric: tabular-nums; }
.afk { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.label { font-size: 2.8vh; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #f87171; }

#scherm { position: relative; display: flex; flex-direction: column; height: 100vh; width: 100vw; overflow: hidden; }

.kop { display: flex; height: 13vh; flex-shrink: 0; align-items: center; padding: 0 2.5vw; background: #1c1314; }
.kop .embleem { display: flex; height: 11vh; flex-shrink: 0; align-items: center; margin-right: 1.5vw; }
.kop .embleem img { height: 100%; width: auto; }
.kop .tekst { min-width: 0; flex: 1; margin-right: 1.5vw; }
.kop .titel { font-size: 6.5vh; font-weight: 800; line-height: 1.05; }
.kop .onder { font-size: 2.8vh; font-weight: 600; color: rgba(255,255,255,0.85); }
.klok { text-align: right; }
.klok .uur { display: block; font-size: 7vh; font-weight: 800; line-height: 1; }
.klok .dag { display: block; font-size: 2.4vh; font-weight: 600; color: rgba(255,255,255,0.85); }

.balk { height: 0.8vh; width: 100%; background: #7f1d1d; flex-shrink: 0; }
.balk div { height: 100%; width: 0; background: #dc2626; }
@keyframes tv-balk { from { width: 0 } to { width: 100% } }

#inhoud { min-height: 0; flex: 1; }
.wacht { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 4vh; color: rgba(255,255,255,0.7); }

.ploeg { display: grid; height: 100%; grid-template-columns: 46fr 54fr; grid-column-gap: 2.5vw; padding: 2.5vh 2.5vw; animation: tv-in 600ms ease-out both; }
@keyframes tv-in { from { opacity: 0; transform: translateY(1.5vh) } to { opacity: 1; transform: none } }
.links { display: flex; min-height: 0; flex-direction: column; }
.links > * + * { margin-top: 2.2vh; }

.laatste { border-radius: 2vh; background: rgba(255,255,255,0.08); padding: 2.2vh 1.5vw; }
.laatste .wanneer { font-size: 2.6vh; color: rgba(255,255,255,0.75); text-align: center; }
.duel { margin-top: 1.2vh; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; grid-column-gap: 1.2vw; }
.score { border-radius: 1.5vh; padding: 1vh 1.4vw; font-size: 12vh; font-weight: 800; line-height: 1; white-space: nowrap; }
.pnaam { display: flex; min-width: 0; flex-direction: column; align-items: center; text-align: center; }
.pnaam p { margin-top: 1vh; font-size: 3vh; font-weight: 600; line-height: 1.15; color: rgba(255,255,255,0.85); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.pnaam p.wij { font-weight: 800; color: #fff; }
.w { background: #16a34a; } .v { background: #dc2626; } .g { background: #6b7280; }
.leeg { font-size: 3.2vh; color: rgba(255,255,255,0.6); }

.vorm { display: flex; align-items: center; }
.vorm .blok { display: flex; height: 7vh; width: 7vh; align-items: center; justify-content: center; border-radius: 1.2vh; font-size: 4vh; font-weight: 800; margin-right: 1vw; }
.vorm .uitleg { font-size: 2.2vh; color: rgba(255,255,255,0.55); }

.volgende { margin-top: auto !important; border-radius: 2vh; background: #fff; color: #0b0708; padding: 2vh 1.6vw; }
.volgende .label { color: #dc2626; }
.volgende .tegen { margin-top: 0.6vh; font-size: 4.6vh; font-weight: 800; line-height: 1.1; }
.volgende .waar { font-weight: 600; color: #6b7280; }
.volgende .moment { margin-top: 0.6vh; font-size: 3.2vh; font-weight: 600; color: #374151; }

.rechts { display: flex; min-height: 0; flex-direction: column; }
.rechts .label { margin-bottom: 1vh; }
.rij { display: grid; grid-template-columns: 6vw 1fr 5vw 7vw; grid-column-gap: 0.8vw; align-items: center; padding: 0 1.2vw; }
.rij.hoofd { padding-bottom: 0.8vh; font-size: 2.2vh; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255,255,255,0.55); }
.r { text-align: right; } .c { text-align: center; }
.stand { display: grid; min-height: 0; flex: 1; grid-row-gap: 0.8vh; list-style: none; }
.stand li { border-radius: 1.2vh; background: rgba(255,255,255,0.08); min-height: 0; font-size: 4.2vh; font-weight: 600; }
.stand li.wij { background: #dc2626; font-weight: 800; box-shadow: 0 0 0 0.4vh #fff; }
.stand .naam { display: flex; min-width: 0; align-items: center; }
.stand .naam > :first-child { margin-right: 0.8vw; }
.stand .b { font-weight: 800; }
.stand li.stip { background: none; text-align: center; font-size: 3vh; color: rgba(255,255,255,0.4); display: block; line-height: 1; }
.logo { flex-shrink: 0; object-fit: contain; }
.logo-leeg { display: flex; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(255,255,255,0.15); font-weight: 800; color: rgba(255,255,255,0.8); }

.strook { display: flex; height: 10vh; flex-shrink: 0; align-items: stretch; background: #fff; }
.strook .oproep { display: flex; flex-shrink: 0; flex-direction: column; justify-content: center; padding: 0 2vw; background: #c81e1e; color: #fff; white-space: nowrap; }
.strook .oproep b { font-size: 3vh; font-weight: 800; line-height: 1.1; }
.strook .oproep span { font-size: 2.2vh; font-weight: 600; color: #fde2e2; }
.strook .venster { position: relative; min-width: 0; flex: 1; overflow: hidden; }
.strook .rol { position: absolute; top: 0; left: 0; display: flex; height: 100%; align-items: center; white-space: nowrap; animation: tv-rol linear infinite; }
@keyframes tv-rol { from { transform: translateX(0) } to { transform: translateX(-50%) } }
.strook .vak { display: flex; width: 14vw; height: 7vh; flex-shrink: 0; align-items: center; justify-content: center; margin-left: 3vw; }
.strook img, .sponsors img { max-height: 100%; max-width: 100%; object-fit: contain; }

.fotodia { display: flex; height: 100%; align-items: center; justify-content: center; background: #1c1314; animation: tv-in2 600ms ease-out both; }
.fotodia .beeld { position: relative; height: calc(100vh - 0.8vh); width: calc((100vh - 0.8vh) * 1.7778); }
.fotodia .beeld img { display: block; height: 100%; width: 100%; }
/* Ploegnaam in het sjabloon (1920 x 1080): links van het schild, boven de witte lijn. */
.fotodia .naam { position: absolute; right: 57%; bottom: 89.2%; width: 36%; text-align: right; white-space: nowrap; font-size: calc((100vh - 0.8vh) * 0.068); font-weight: 800; line-height: 1; color: #fff; text-shadow: 0 0.3vh 1.2vh rgba(0,0,0,0.7), 0 0 0.4vh rgba(0,0,0,0.6); }
.affiche { display: flex; height: 100%; align-items: center; justify-content: center; background: #fff; animation: tv-in2 600ms ease-out both; }
.affiche img { display: block; width: 100vw; height: calc(100vh - 0.8vh); object-fit: contain; }
.sponsors { display: flex; height: 100%; flex-direction: column; background: #faf8f6; padding: 3vh 4vw 4vh; color: #0b0708; animation: tv-in2 600ms ease-out both; }
@keyframes tv-in2 { from { opacity: 0 } to { opacity: 1 } }
.sponsors h2 { text-align: center; font-size: 6vh; font-weight: 800; }
.sponsors h2 span { color: #dc2626; }
.sponsors .rooster { margin-top: 3vh; display: grid; min-height: 0; flex: 1; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, minmax(0, 1fr)); grid-gap: 2vw; }
.sponsors .vak { display: flex; min-height: 0; align-items: center; justify-content: center; border-radius: 2vh; background: #fff; padding: 3vh; box-shadow: 0 2px 4px rgba(18,12,13,0.05), 0 12px 28px -8px rgba(18,12,13,0.1); }
.sponsors .vak img { height: 100%; width: 100%; }
.sponsors .voet { margin-top: 2vh; text-align: center; font-size: 2.8vh; font-weight: 600; color: #4b5563; }
`;

const SCRIPT = `
(function () {
  'use strict';
  var GRAPHQL = 'https://datalake-prod2018.rbfa.be/graphql';
  var LINKHOUT = '1595';
  var TZ = 'Europe/Brussels';
  var PLOEGEN_PER_SPONSOR = 4;
  var PLOEGEN_PER_AFFICHE = 3;
  var AFFICHE = window.__AFFICHE;
  var RIJEN_ZICHTBAAR = 8;
  var VORM_AANTAL = 5;
  var VERVERS_MS = 30 * 60000;
  var HERLAAD_MS = 3 * 60 * 60000;
  var PLOEGEN = window.__PLOEGEN;
  var SPONSORS = window.__SPONSORS;

  var SEIZOEN_QUERY = 'query GetSeizoen($teamId: ID!, $language: Language!) { teamCalendar(teamId: $teamId, language: $language, sortByDate: asc) { id startTime state homeTeam { name clubId logo } awayTeam { name clubId logo } series { id name } outcome { status homeTeamGoals awayTeamGoals } } }';
  var KLASSEMENT_QUERY = 'query GetKlassement($teamId: ID!, $language: Language!) { teamSeriesAndRankings(teamId: $teamId, language: $language) { rankings { id name visibility { showRanking } rankings { type teams { teamId name position clubId logo points matchesPlayed matchesWon matchesLost matchesDrawn goalsFor goalsAgainst goalDifference } } } } }';

  function param(naam) {
    var m = new RegExp('[?&]' + naam + '=([^&]*)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function seconden(naam, standaard) {
    var w = Number(param(naam));
    return isFinite(w) && w >= 3 ? w : standaard;
  }
  var TIJD_PLOEG = seconden('ploeg', 20) * 1000;
  var TIJD_SPONSOR = seconden('sponsor', 12) * 1000;
  var afficheParam = Number(param('affiche'));
  var TIJD_AFFICHE = param('affiche') !== null && isFinite(afficheParam) && afficheParam >= 0 ? afficheParam * 1000 : 20000;
  var fotoParam = Number(param('foto'));
  var TIJD_FOTO = param('foto') !== null && isFinite(fotoParam) && fotoParam >= 0 ? fotoParam * 1000 : 8000;
  var VAST = param('vast') === '1';
  var STARTDIA = Number(param('dia')) || 0;

  // Proefhulp: herlaad zodra de pagina op de server verandert.
  if (param('live') === '1') {
    var vorigeTekst = null;
    setInterval(function () {
      fetch(location.href, { cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (t) {
        if (vorigeTekst !== null && t !== vorigeTekst) location.reload();
        vorigeTekst = t;
      }).catch(function () {});
    }, 1500);
  }

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function isBeker(naam) { return /\\b(bvl|bek|beker|cup)\\b/i.test(naam); }

  function brusselsNaarDate(s) {
    var alsUtc = new Date(s + 'Z');
    var utcWand = new Date(alsUtc.toLocaleString('en-US', { timeZone: 'UTC' }));
    var bruWand = new Date(alsUtc.toLocaleString('en-US', { timeZone: TZ }));
    return new Date(alsUtc.getTime() - (bruWand.getTime() - utcWand.getTime()));
  }

  function vraag(query, teamId) {
    return fetch(GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query, variables: { teamId: teamId, language: 'nl' } })
    }).then(function (r) {
      if (!r.ok) throw new Error('status ' + r.status);
      return r.json();
    });
  }

  function seizoenUit(json) {
    var lijst = (json && json.data && json.data.teamCalendar) || [];
    return lijst.filter(function (m) {
      return m.startTime && m.homeTeam && m.homeTeam.name && m.awayTeam && m.awayTeam.name;
    }).map(function (m) {
      var eigenThuis = m.homeTeam.clubId === LINKHOUT;
      var o = m.outcome || {};
      var gespeeld = m.state === 'finished' && o.homeTeamGoals != null && o.awayTeamGoals != null;
      var ts = gespeeld ? o.homeTeamGoals : null, us = gespeeld ? o.awayTeamGoals : null;
      var resultaat = null;
      if (ts != null && us != null) {
        var wij = eigenThuis ? ts : us, zij = eigenThuis ? us : ts;
        resultaat = wij > zij ? 'W' : wij === zij ? 'G' : 'V';
      }
      var reeks = (m.series && m.series.name) || '';
      return {
        id: m.id,
        start: brusselsNaarDate(m.startTime).getTime(),
        thuisNaam: m.homeTeam.name, uitNaam: m.awayTeam.name,
        thuisLogo: m.homeTeam.logo, uitLogo: m.awayTeam.logo,
        eigenThuis: eigenThuis, beker: isBeker(reeks),
        toestand: gespeeld ? 'gespeeld' : m.state === 'planned' ? 'gepland' : 'anders',
        thuisScore: ts, uitScore: us, resultaat: resultaat
      };
    });
  }

  function klassementUit(json, teamId) {
    var r = (json && json.data && json.data.teamSeriesAndRankings && json.data.teamSeriesAndRankings.rankings) || [];
    function toon(x) { return x.visibility && x.visibility.showRanking; }
    var gekozen = r.filter(function (x) { return toon(x) && !isBeker(x.name); })[0] || r.filter(toon)[0];
    if (!gekozen) return null;
    var alg = (gekozen.rankings || []).filter(function (x) { return x.type === 'generalRanking'; })[0];
    var ploegen = (alg && alg.teams) || [];
    if (!ploegen.length) return null;
    var rijen = ploegen.map(function (p) {
      return { teamId: p.teamId, naam: p.name, plaats: p.position, logo: p.logo, punten: p.points,
        gespeeld: p.matchesPlayed, gewonnen: p.matchesWon, gelijk: p.matchesDrawn, verloren: p.matchesLost,
        doelsaldo: p.goalDifference, wij: p.teamId === teamId };
    }).sort(function (a, b) { return a.plaats - b.plaats; });
    if (!rijen.some(function (x) { return x.wij; })) return null;
    return { reeks: gekozen.name.replace(/^Voetbal : Voetbal Vlaanderen - /, ''), rijen: rijen };
  }

  function wachten(ms) { return new Promise(function (k) { setTimeout(k, ms); }); }

  function haalAlles() {
    var gevonden = [];
    var keten = Promise.resolve();
    PLOEGEN.forEach(function (p) {
      keten = keten.then(function () {
        return vraag(KLASSEMENT_QUERY, p.id).then(function (json) {
          var k = klassementUit(json, p.id);
          if (!k) return;
          return vraag(SEIZOEN_QUERY, p.id).then(seizoenUit, function () { return []; }).then(function (s) {
            gevonden.push({ naam: p.naam, foto: p.foto, klassement: k, seizoen: s });
          });
        }).catch(function () {}).then(function () { return wachten(150); });
      });
    });
    return keten.then(function () { return gevonden; });
  }

  function datum(ms, opties) {
    var o = { timeZone: TZ };
    for (var k in opties) o[k] = opties[k];
    return new Date(ms).toLocaleDateString('nl-BE', o);
  }
  function uur(ms) {
    return new Date(ms).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
  }
  function hoofdletter(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

  function logo(src, naam, maat) {
    if (!src) {
      return '<span class="logo-leeg" style="width:' + maat + ';height:' + maat + ';font-size:calc(' + maat + ' * 0.4)">' + esc(naam.slice(0, 1)) + '</span>';
    }
    return '<img class="logo" src="' + esc(src) + '" alt="" style="width:' + maat + ';height:' + maat + '">';
  }
  function kleur(res) { return res === 'W' ? 'w' : res === 'V' ? 'v' : 'g'; }
  function pnaam(naam, src, wij) {
    return '<div class="pnaam">' + logo(src, naam, '10vh') + '<p class="' + (wij ? 'wij' : '') + '">' + esc(naam) + '</p></div>';
  }

  // Enkel de ploegen rond onze plaats, zodat de letters groot kunnen blijven.
  function venster(rijen) {
    if (rijen.length <= RIJEN_ZICHTBAAR) return rijen;
    var i = 0;
    for (var j = 0; j < rijen.length; j++) if (rijen[j].wij) i = j;
    var van = i - Math.floor(RIJEN_ZICHTBAAR / 2) + 1;
    if (van < 0) van = 0;
    if (van > rijen.length - RIJEN_ZICHTBAAR) van = rijen.length - RIJEN_ZICHTBAAR;
    return rijen.slice(van, van + RIJEN_ZICHTBAAR);
  }

  function ploegDia(p) {
    var nu = Date.now();
    var gespeeld = p.seizoen.filter(function (w) { return w.toestand === 'gespeeld'; }).sort(function (a, b) { return b.start - a.start; });
    var laatste = gespeeld[0];
    var vorm = gespeeld.slice(0, VORM_AANTAL).reverse();
    var volgende = p.seizoen.filter(function (w) { return w.toestand === 'gepland' && w.start > nu; }).sort(function (a, b) { return a.start - b.start; })[0];
    var alle = p.klassement.rijen;
    var rijen = venster(alle);

    var h = '<div class="ploeg"><div class="links"><p class="label">Laatste uitslag</p>';
    if (laatste) {
      h += '<div class="laatste"><p class="wanneer">' + esc(hoofdletter(datum(laatste.start, { weekday: 'long', day: 'numeric', month: 'long' }))) + (laatste.beker ? ' · beker' : '') + '</p>' +
        '<div class="duel">' + pnaam(laatste.thuisNaam, laatste.thuisLogo, laatste.eigenThuis) +
        '<p class="score disp num ' + kleur(laatste.resultaat) + '">' + laatste.thuisScore + '-' + laatste.uitScore + '</p>' +
        pnaam(laatste.uitNaam, laatste.uitLogo, !laatste.eigenThuis) + '</div></div>';
    } else {
      h += '<p class="leeg">Nog geen wedstrijd gespeeld.</p>';
    }
    if (vorm.length > 1) {
      h += '<p class="label">Vorm</p><div class="vorm">';
      vorm.forEach(function (w) {
        h += '<span class="blok disp ' + kleur(w.resultaat) + '">' + w.resultaat + '</span>';
      });
      h += '<span class="uitleg">nieuwste rechts</span></div>';
    }
    if (volgende) {
      h += '<div class="volgende"><p class="label">Volgende wedstrijd</p>' +
        '<p class="tegen disp afk">' + esc(volgende.eigenThuis ? volgende.uitNaam : volgende.thuisNaam) + '<span class="waar"> ' + (volgende.eigenThuis ? 'thuis' : 'uit') + '</span></p>' +
        '<p class="moment">' + esc(hoofdletter(datum(volgende.start, { weekday: 'long', day: 'numeric', month: 'long' }))) + ' om ' + esc(uur(volgende.start)) + '</p></div>';
    }
    h += '</div>';

    var wij = alle.filter(function (r) { return r.wij; })[0];
    h += '<div class="rechts"><p class="label">Klassement · ' + wij.plaats + 'e van ' + alle.length + '</p>' +
      '<div class="rij hoofd"><span>#</span><span>Ploeg</span><span class="r">M</span><span class="r">Ptn</span></div>' +
      '<ol class="stand" style="grid-template-rows:repeat(' + rijen.length + ', minmax(0, 1fr))">';
    rijen.forEach(function (r) {
      h += '<li class="rij num' + (r.wij ? ' wij' : '') + '">' +
        '<span class="disp b">' + r.plaats + '</span>' +
        '<span class="naam">' + logo(r.logo, r.naam, '1.3em') + '<span class="afk">' + esc(r.naam) + '</span></span>' +
        '<span class="r">' + r.gespeeld + '</span>' +
        '<span class="r disp b">' + r.punten + '</span></li>';
    });
    h += '</ol></div></div>';
    return h;
  }

  function sponsorBeelden() {
    return SPONSORS.map(function (s) {
      return '<div class="vak"><img src="' + esc(s.beeld) + '" alt="' + esc(s.naam) + '"></div>';
    }).join('');
  }
  function sponsorDia(melding) {
    return '<div class="sponsors"><h2 class="disp">Met dank aan onze <span>sponsors</span></h2>' +
      '<div class="rooster">' + sponsorBeelden() + '</div>' +
      '<p class="voet">' + (melding ? 'De uitslagen konden niet opgehaald worden; er wordt opnieuw geprobeerd.' : 'Ook sponsor worden? Spreek ons gerust aan of kijk op kwslinkhout.be/sponsoring') + '</p></div>';
  }

  var el = {
    titel: document.getElementById('titel'), onder: document.getElementById('onder'),
    dag: document.getElementById('dag'), uur: document.getElementById('uur'),
    balk: document.getElementById('balk'), inhoud: document.getElementById('inhoud'), strook: document.getElementById('strook'),
    kop: document.querySelector('.kop')
  };
  // Rollende strook: de logo's twee keer na elkaar, de rol schuift een halve
  // breedte op en begint dan naadloos opnieuw. Ongeveer 4 seconden per logo.
  var rol = el.strook.querySelector('.rol');
  rol.innerHTML = sponsorBeelden() + sponsorBeelden();
  rol.style.animationDuration = Math.max(SPONSORS.length, 4) * 4 + 's';

  function klok() {
    var nu = Date.now();
    el.dag.textContent = hoofdletter(datum(nu, { weekday: 'long', day: 'numeric', month: 'long' }));
    el.uur.textContent = uur(nu);
  }
  klok();
  setInterval(klok, 15000);

  var ploegen = null, mislukt = false, nr = 0, dias = [], timer = null;

  function maakDias() {
    dias = [];
    (ploegen || []).forEach(function (p, i) {
      if (p.foto && TIJD_FOTO > 0) dias.push({ fotoVan: p });
      dias.push(p);
      if (AFFICHE && TIJD_AFFICHE > 0 && (i + 1) % PLOEGEN_PER_AFFICHE === 0) dias.push('affiche');
      if ((i + 1) % PLOEGEN_PER_SPONSOR === 0) dias.push('sponsors');
    });
    if (!dias.length || dias[dias.length - 1] !== 'sponsors') dias.push('sponsors');
  }

  function fotoDia(p) {
    return '<div class="fotodia"><div class="beeld"><img src="' + esc(p.foto) + '" alt="Ploegfoto ' + esc(p.naam) + '">' +
      '<p class="naam disp"><span>' + esc(p.naam) + '</span></p></div></div>';
  }

  // Lange ploegnamen kleiner maken tot ze links van het schild passen.
  function pasNaamAan() {
    var n = el.inhoud.querySelector('.fotodia .naam');
    if (!n) return;
    var maat = parseFloat(getComputedStyle(n).fontSize);
    var tekst = n.firstChild;
    for (var i = 0; i < 30 && tekst.offsetWidth > n.clientWidth; i++) {
      maat = maat * 0.94;
      n.style.fontSize = maat + 'px';
    }
  }

  // De ploegfoto van de volgende dia alvast laden, zodat hij meteen verschijnt.
  var voorgeladen = {};
  function laadVooraf(dia) {
    var src = dia === 'affiche' ? AFFICHE : dia && dia.fotoVan ? dia.fotoVan.foto : null;
    if (src && !voorgeladen[src]) {
      voorgeladen[src] = true;
      new Image().src = src;
    }
  }

  function toon() {
    var dia = dias[nr % dias.length];
    var isFoto = !!(dia && dia.fotoVan);
    var isAffiche = dia === 'affiche';
    var isPloeg = !isFoto && !isAffiche && dia !== 'sponsors';
    var p = isFoto ? dia.fotoVan : dia;
    var duur = isFoto ? TIJD_FOTO : isAffiche ? TIJD_AFFICHE : isPloeg ? TIJD_PLOEG : TIJD_SPONSOR;
    el.titel.textContent = isFoto || isPloeg ? p.naam : 'Onze sponsors';
    el.onder.textContent = isFoto || isPloeg ? p.klassement.reeks : 'Zij maken het mogelijk';
    el.balk.innerHTML = VAST ? '' : '<div style="animation: tv-balk ' + duur + 'ms linear forwards"></div>';
    el.inhoud.innerHTML = isAffiche ? '<div class="affiche"><img src="' + esc(AFFICHE) + '" alt=""></div>' : isFoto ? fotoDia(p) : isPloeg ? ploegDia(dia) : sponsorDia(mislukt && ploegen.length === 0);
    el.strook.style.display = isPloeg ? '' : 'none';
    if (isFoto) pasNaamAan();
    // Bij de ploegfoto geen kopbalk: de naam staat boven de foto, zo kan die groter.
    el.kop.style.display = isFoto || isAffiche ? 'none' : '';
    laadVooraf(dias[(nr + 1) % dias.length]);
    clearTimeout(timer);
    if (!VAST) timer = setTimeout(function () { nr = (nr + 1) % dias.length; toon(); }, duur);
  }

  function laad() {
    haalAlles().then(function (lijst) {
      var eerste = ploegen === null;
      if (lijst.length) { ploegen = lijst; mislukt = false; }
      else { mislukt = true; ploegen = ploegen || []; }
      maakDias();
      if (eerste) nr = STARTDIA % dias.length;
      if (nr >= dias.length) nr = 0;
      if (eerste) toon();
    });
  }
  laad();
  setInterval(laad, VERVERS_MS);
  setTimeout(function () { location.reload(); }, HERLAAD_MS);
})();
`;

function pagina(): string {
  const json = (x: unknown) => JSON.stringify(x).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Uitslagen en sponsors</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800&family=Inter:wght@400;600;700;800&display=swap">
<style>${STIJL}</style>
</head>
<body>
<main id="scherm">
  <header class="kop">
    <div class="embleem"><img src="/images/tv/schild-kws-360.png" alt="KWS Linkhout"></div>
    <div class="tekst">
      <p id="titel" class="titel disp afk">Onze sponsors</p>
      <p id="onder" class="onder afk">Zij maken het mogelijk</p>
    </div>
    <p class="klok"><span id="uur" class="uur disp num"></span><span id="dag" class="dag"></span></p>
  </header>
  <div id="balk" class="balk"></div>
  <div id="inhoud"><div class="wacht">De uitslagen worden opgehaald...</div></div>
  <div id="strook" class="strook" style="display:none"><div class="oproep"><b class="disp">Ook sponsor worden?</b><span>kwslinkhout.be/sponsoring</span></div><div class="venster"><div class="rol"></div></div></div>
</main>
<script>window.__PLOEGEN = ${json(PLOEGEN)}; window.__SPONSORS = ${json(SPONSORS)}; window.__AFFICHE = ${json(AFFICHE)};</script>
<script>${SCRIPT}</script>
</body>
</html>`;
}

export function GET() {
  return new Response(pagina(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
