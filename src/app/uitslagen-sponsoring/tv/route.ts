import { teams } from "@/lib/teams";
import { rbfaTeamId } from "@/lib/rbfa";
import { SPONSORS } from "@/lib/sponsors";

/**
 * Het tv-scherm voor de kantine, in een lichte versie voor de mediaspeler.
 *
 * De speler aan de tv (een IAdea MBR-1100) heeft een ingebouwde browser van
 * Chrome 68 die niet bij te werken is. De gewone pagina /uitslagen-sponsoring
 * is gebouwd met Next 16 en Tailwind 4, die pas vanaf Chrome 111 werken; op de
 * speler bleef enkel een groot logo op wit over. Deze versie toont hetzelfde,
 * met dezelfde opmaak, maar in gewone HTML, CSS en JavaScript zonder
 * nieuwigheden: geen gap bij flexbox, geen min(), geen ?. of ??.
 *
 * Verandert er iets aan de gewone pagina, pas het dan ook hier aan.
 *
 * Alles wordt in de browser opgehaald: de bond laat sinds oktober 2026 enkel
 * echte browsers toe. Datums en uren staan vast op Brussel, want de speler
 * zelf kan in een andere tijdzone staan.
 *
 * Met ?ploeg=25&sponsor=12 in het adres stel je in hoeveel seconden een ploeg
 * en een sponsorscherm blijven staan.
 */

const PLOEGEN = teams
  .map((t) => ({ naam: t.name, id: rbfaTeamId([t.standingsIframe, t.calendarIframe]) }))
  .filter((p) => p.id);

const STIJL = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body { background: #120c0d; color: #fff; font-family: "Inter", system-ui, sans-serif; overflow: hidden; cursor: none; -webkit-font-smoothing: antialiased; }
.disp { font-family: "Archivo", "Inter", system-ui, sans-serif; }
.num { font-variant-numeric: tabular-nums; }
.afk { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.label { font-size: 2vh; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); }

#scherm { position: relative; display: flex; flex-direction: column; height: 100vh; width: 100vw; overflow: hidden; }

.kop { display: flex; height: 11vh; flex-shrink: 0; align-items: center; padding: 0 2.5vw; }
.kop img { height: 8vh; width: auto; margin-right: 1.5vw; }
.kop .tekst { min-width: 0; flex: 1; margin-right: 1.5vw; }
.kop .titel { font-size: 4.2vh; font-weight: 700; line-height: 1.25; }
.kop .onder { font-size: 2.2vh; color: rgba(255,255,255,0.6); }
.klok { display: flex; align-items: baseline; color: rgba(255,255,255,0.8); }
.klok .dag { font-size: 2.8vh; color: rgba(255,255,255,0.6); margin-right: 1.2vw; }
.klok .uur { font-size: 4.5vh; font-weight: 700; }

.balk { height: 0.5vh; width: 100%; background: rgba(255,255,255,0.1); }
.balk div { height: 100%; width: 0; background: #dc2626; }
@keyframes tv-balk { from { width: 0 } to { width: 100% } }

#inhoud { min-height: 0; flex: 1; }
.wacht { display: flex; height: 100%; align-items: center; justify-content: center; font-size: 3vh; color: rgba(255,255,255,0.6); }

.ploeg { display: grid; height: 100%; grid-template-columns: 42fr 58fr; grid-column-gap: 2vw; padding: 2vh 2.5vw; animation: tv-in 600ms ease-out both; }
@keyframes tv-in { from { opacity: 0; transform: translateY(1.5vh) } to { opacity: 1; transform: none } }
.links { display: flex; min-height: 0; flex-direction: column; }
.links > * + * { margin-top: 2vh; }
.laatste { border-radius: 1.5vh; background: rgba(255,255,255,0.1); padding: 2.5vh 1.5vw; }
.laatste .wanneer { font-size: 1.9vh; color: rgba(255,255,255,0.6); }
.duel { margin-top: 1.5vh; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; grid-column-gap: 1vw; }
.score { border-radius: 1vh; padding: 0.5vh 1vw; font-size: 7vh; font-weight: 700; line-height: 1; }
.pnaam { display: flex; min-width: 0; flex-direction: column; align-items: center; text-align: center; }
.pnaam p { margin-top: 1vh; font-size: 2.2vh; line-height: 1.25; color: rgba(255,255,255,0.8); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.pnaam p.wij { font-weight: 700; color: #fff; }
.w { background: #16a34a; } .v { background: #dc2626; } .g { background: rgba(255,255,255,0.2); } .g2 { background: rgba(255,255,255,0.25); }
.leeg { font-size: 2.4vh; color: rgba(255,255,255,0.5); }
.vorige { list-style: none; }
.vorige li { display: grid; grid-template-columns: auto 1fr auto; align-items: center; grid-column-gap: 1vw; border-radius: 1vh; background: rgba(255,255,255,0.05); padding: 1vh 1vw; font-size: 2.2vh; }
.vorige li + li { margin-top: 1vh; }
.vorige .res { display: flex; height: 3.4vh; width: 3.4vh; align-items: center; justify-content: center; border-radius: 0.6vh; font-size: 1.8vh; font-weight: 700; }
.vorige .waar, .volgende .waar { color: rgba(255,255,255,0.5); }
.vorige .sc { font-weight: 700; }
.volgende { margin-top: auto !important; border-radius: 1.5vh; border: 2px solid rgba(255,255,255,0.15); padding: 1.5vh 1.5vw; }
.volgende .tegen { margin-top: 0.5vh; font-size: 2.8vh; font-weight: 600; }
.volgende .tegen .waar { font-weight: 400; color: rgba(255,255,255,0.6); }
.volgende .moment { font-size: 2.2vh; color: rgba(255,255,255,0.7); }

.rechts { display: flex; min-height: 0; flex-direction: column; }
.rij { display: grid; grid-template-columns: 4vw 1fr 4vw 9vw 5vw 5vw; grid-column-gap: 0.5vw; align-items: center; padding: 0 1vw; }
.rij.hoofd { padding-bottom: 0.8vh; font-size: 1.7vh; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); }
.r { text-align: right; } .c { text-align: center; }
.stand { display: grid; min-height: 0; flex: 1; grid-row-gap: 0.4vh; list-style: none; }
.stand li { border-radius: 0.8vh; background: rgba(255,255,255,0.05); min-height: 0; }
.stand li.wij { background: #dc2626; font-weight: 700; }
.stand .naam { display: flex; min-width: 0; align-items: center; }
.stand .naam > :first-child { margin-right: 0.6vw; }
.stand .b { font-weight: 700; }
.logo { flex-shrink: 0; object-fit: contain; }
.logo-leeg { display: flex; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 9999px; background: rgba(255,255,255,0.1); font-weight: 700; color: rgba(255,255,255,0.7); }

.strook { display: flex; height: 14vh; flex-shrink: 0; align-items: center; background: #fff; padding: 0 2.5vw; }
.strook p { width: 7vw; flex-shrink: 0; margin-right: 1.2vw; font-size: 1.6vh; font-weight: 600; text-transform: uppercase; line-height: 1.25; letter-spacing: 0.05em; color: #64748b; }
.strook .rooster { display: grid; flex: 1; grid-template-columns: repeat(8, 1fr); grid-column-gap: 1.2vw; align-items: center; }
.strook .vak { display: flex; height: 9vh; align-items: center; justify-content: center; }
.strook img, .sponsors img { max-height: 100%; max-width: 100%; object-fit: contain; }

.sponsors { display: flex; height: 100%; flex-direction: column; background: #faf8f6; padding: 3vh 4vw 4vh; color: #120c0d; animation: tv-in2 600ms ease-out both; }
@keyframes tv-in2 { from { opacity: 0 } to { opacity: 1 } }
.sponsors h2 { text-align: center; font-size: 5vh; font-weight: 700; }
.sponsors h2 span { color: #dc2626; }
.sponsors .rooster { margin-top: 3vh; display: grid; min-height: 0; flex: 1; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, minmax(0, 1fr)); grid-gap: 2vw; }
.sponsors .vak { display: flex; min-height: 0; align-items: center; justify-content: center; border-radius: 2vh; background: #fff; padding: 3vh; box-shadow: 0 2px 4px rgba(18,12,13,0.05), 0 12px 28px -8px rgba(18,12,13,0.1); }
.sponsors .vak img { height: 100%; width: 100%; }
.sponsors .voet { margin-top: 2vh; text-align: center; font-size: 2.2vh; color: #64748b; }
`;

const SCRIPT = `
(function () {
  'use strict';
  var GRAPHQL = 'https://datalake-prod2018.rbfa.be/graphql';
  var LINKHOUT = '1595';
  var TZ = 'Europe/Brussels';
  var PLOEGEN_PER_SPONSOR = 2;
  var VERVERS_MS = 30 * 60000;
  var HERLAAD_MS = 3 * 60 * 60000;
  var PLOEGEN = window.__PLOEGEN;
  var SPONSORS = window.__SPONSORS;

  var SEIZOEN_QUERY = 'query GetSeizoen($teamId: ID!, $language: Language!) { teamCalendar(teamId: $teamId, language: $language, sortByDate: asc) { id startTime state homeTeam { name clubId logo } awayTeam { name clubId logo } series { id name } outcome { status homeTeamGoals awayTeamGoals } } }';
  var KLASSEMENT_QUERY = 'query GetKlassement($teamId: ID!, $language: Language!) { teamSeriesAndRankings(teamId: $teamId, language: $language) { rankings { id name visibility { showRanking } rankings { type teams { teamId name position clubId logo points matchesPlayed matchesWon matchesLost matchesDrawn goalsFor goalsAgainst goalDifference } } } } }';

  function seconden(naam, standaard) {
    var m = new RegExp('[?&]' + naam + '=([0-9.]+)').exec(location.search);
    var w = m ? Number(m[1]) : NaN;
    return isFinite(w) && w >= 3 ? w : standaard;
  }
  var TIJD_PLOEG = seconden('ploeg', 20) * 1000;
  var TIJD_SPONSOR = seconden('sponsor', 12) * 1000;

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function isBeker(naam) { return /\\b(bvl|bek|beker|cup)\\b/i.test(naam); }

  // De bond geeft het uur zonder tijdzone, als Brusselse tijd.
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

  // Eén ploeg na de andere, zodat de bond niet overstelpt wordt.
  function haalAlles() {
    var gevonden = [];
    var keten = Promise.resolve();
    PLOEGEN.forEach(function (p) {
      keten = keten.then(function () {
        return vraag(KLASSEMENT_QUERY, p.id).then(function (json) {
          var k = klassementUit(json, p.id);
          if (!k) return;
          return vraag(SEIZOEN_QUERY, p.id).then(seizoenUit, function () { return []; }).then(function (s) {
            gevonden.push({ naam: p.naam, klassement: k, seizoen: s });
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
  function kleur(res, gelijk) { return res === 'W' ? 'w' : res === 'V' ? 'v' : gelijk; }
  function pnaam(naam, src, wij) {
    return '<div class="pnaam">' + logo(src, naam, '8vh') + '<p class="' + (wij ? 'wij' : '') + '">' + esc(naam) + '</p></div>';
  }

  function ploegDia(p) {
    var nu = Date.now();
    var gespeeld = p.seizoen.filter(function (w) { return w.toestand === 'gespeeld'; }).sort(function (a, b) { return b.start - a.start; });
    var laatste = gespeeld[0];
    var vorige = gespeeld.slice(1, 4);
    var volgende = p.seizoen.filter(function (w) { return w.toestand === 'gepland' && w.start > nu; }).sort(function (a, b) { return a.start - b.start; })[0];
    var rijen = p.klassement.rijen;

    var h = '<div class="ploeg"><div class="links"><p class="label">Laatste uitslag</p>';
    if (laatste) {
      h += '<div class="laatste"><p class="wanneer">' + esc(datum(laatste.start, { weekday: 'short', day: 'numeric', month: 'short' })) + (laatste.beker ? ' · beker' : '') + '</p>' +
        '<div class="duel">' + pnaam(laatste.thuisNaam, laatste.thuisLogo, laatste.eigenThuis) +
        '<p class="score disp num ' + kleur(laatste.resultaat, 'g') + '">' + laatste.thuisScore + ' - ' + laatste.uitScore + '</p>' +
        pnaam(laatste.uitNaam, laatste.uitLogo, !laatste.eigenThuis) + '</div></div>';
    } else {
      h += '<p class="leeg">Nog geen wedstrijd gespeeld.</p>';
    }
    if (vorige.length) {
      h += '<p class="label">Daarvoor</p><ul class="vorige">';
      vorige.forEach(function (w) {
        h += '<li><span class="res ' + kleur(w.resultaat, 'g2') + '">' + (w.resultaat === 'W' ? 'W' : w.resultaat === 'V' ? 'V' : 'G') + '</span>' +
          '<span class="afk">' + esc(w.eigenThuis ? w.uitNaam : w.thuisNaam) + '<span class="waar"> ' + (w.eigenThuis ? 'thuis' : 'uit') + '</span></span>' +
          '<span class="sc disp num">' + w.thuisScore + ' - ' + w.uitScore + '</span></li>';
      });
      h += '</ul>';
    }
    if (volgende) {
      h += '<div class="volgende"><p class="label">Volgende wedstrijd</p>' +
        '<p class="tegen afk">' + esc(volgende.eigenThuis ? volgende.uitNaam : volgende.thuisNaam) + '<span class="waar"> ' + (volgende.eigenThuis ? 'thuis' : 'uit') + '</span></p>' +
        '<p class="moment">' + esc(datum(volgende.start, { weekday: 'long', day: 'numeric', month: 'long' })) + ' om ' + esc(uur(volgende.start)) + '</p></div>';
    }
    h += '</div>';

    var grootte = Math.min(2.6, Math.max(1.6, 36 / rijen.length));
    h += '<div class="rechts"><div class="rij hoofd"><span>#</span><span>Ploeg</span><span class="r">M</span><span class="c">W - G - V</span><span class="r">+/-</span><span class="r">Ptn</span></div>' +
      '<ol class="stand" style="grid-template-rows:repeat(' + rijen.length + ', minmax(0, 1fr))">';
    rijen.forEach(function (r) {
      h += '<li class="rij num' + (r.wij ? ' wij' : '') + '" style="font-size:' + grootte + 'vh">' +
        '<span class="disp b">' + r.plaats + '</span>' +
        '<span class="naam">' + logo(r.logo, r.naam, '1.6em') + '<span class="afk">' + esc(r.naam) + '</span></span>' +
        '<span class="r">' + r.gespeeld + '</span>' +
        '<span class="c">' + r.gewonnen + ' - ' + r.gelijk + ' - ' + r.verloren + '</span>' +
        '<span class="r">' + (r.doelsaldo > 0 ? '+' + r.doelsaldo : r.doelsaldo) + '</span>' +
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
    balk: document.getElementById('balk'), inhoud: document.getElementById('inhoud'), strook: document.getElementById('strook')
  };
  el.strook.querySelector('.rooster').innerHTML = sponsorBeelden();

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
      dias.push(p);
      if ((i + 1) % PLOEGEN_PER_SPONSOR === 0) dias.push('sponsors');
    });
    if (!dias.length || dias[dias.length - 1] !== 'sponsors') dias.push('sponsors');
  }

  function toon() {
    var dia = dias[nr % dias.length];
    var isPloeg = dia !== 'sponsors';
    var duur = isPloeg ? TIJD_PLOEG : TIJD_SPONSOR;
    el.titel.textContent = isPloeg ? dia.naam : 'Onze sponsors';
    el.onder.textContent = isPloeg ? dia.klassement.reeks : 'Zij maken het mogelijk';
    el.balk.innerHTML = '<div style="animation: tv-balk ' + duur + 'ms linear forwards"></div>';
    el.inhoud.innerHTML = isPloeg ? ploegDia(dia) : sponsorDia(mislukt && ploegen.length === 0);
    el.strook.style.display = isPloeg ? '' : 'none';
    clearTimeout(timer);
    timer = setTimeout(function () { nr = (nr + 1) % dias.length; toon(); }, duur);
  }

  function laad() {
    haalAlles().then(function (lijst) {
      var eerste = ploegen === null;
      if (lijst.length) { ploegen = lijst; mislukt = false; }
      else { mislukt = true; ploegen = ploegen || []; }
      maakDias();
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
  // "</" kan in JSON een script afsluiten; zo niet.
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap">
<style>${STIJL}</style>
</head>
<body>
<main id="scherm">
  <header class="kop">
    <img src="/images/logo-kws.png" alt="KWS Linkhout">
    <div class="tekst">
      <p id="titel" class="titel disp afk">Onze sponsors</p>
      <p id="onder" class="onder afk">Zij maken het mogelijk</p>
    </div>
    <p class="klok"><span id="dag" class="dag"></span><span id="uur" class="uur disp num"></span></p>
  </header>
  <div id="balk" class="balk"></div>
  <div id="inhoud"><div class="wacht">De uitslagen worden opgehaald...</div></div>
  <div id="strook" class="strook" style="display:none"><p>Met dank aan</p><div class="rooster"></div></div>
</main>
<script>window.__PLOEGEN = ${json(PLOEGEN)}; window.__SPONSORS = ${json(SPONSORS)};</script>
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
