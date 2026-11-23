// Plaatst het weekoverzicht van deze week op Facebook en Instagram, vanaf de thuis-pc.
//
// Waarom vanaf de pc: de RBFA weigert de servers van Vercel en een onzichtbare
// (headless) Chrome. Daarom opent dit script een echte Chrome, buiten beeld,
// op /matchday/weekoverzicht?auto=1. De pagina haalt de wedstrijden op, tekent
// het beeld en stuurt het zelf naar de site, die het plaatst en een mail stuurt.
//
// Geplande taak: elke maandag 18:00 (zie scripts/weekoverzicht-pc-taak.ps1).
//
//   node scripts/weekoverzicht-pc.mjs            enkel op maandag
//   node scripts/weekoverzicht-pc.mjs --altijd   ook op een andere dag (proef)
//   node scripts/weekoverzicht-pc.mjs --site=http://localhost:3099 --zichtbaar
//
// Het geheim (WEEKOVERZICHT_GEHEIM, hetzelfde als in Vercel) staat in
// %USERPROFILE%\.kws\weekoverzicht-geheim.txt. Het logboek staat in
// %LOCALAPPDATA%\kws-weekoverzicht\log.txt.

import { spawn, execFileSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { appendFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const optie = (naam) => args.find((a) => a.startsWith(`--${naam}=`))?.split("=").slice(1).join("=");
const vlag = (naam) => args.includes(`--${naam}`);

const SITE = (optie("site") ?? "https://www.kwslinkhout.be").replace(/\/$/, "");
const MAP = join(process.env.LOCALAPPDATA ?? homedir(), "kws-weekoverzicht");
const POORT = 9360;
const MAX_WACHT_MS = 6 * 60 * 1000;
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].find(existsSync);

mkdirSync(MAP, { recursive: true });
const log = (t) => {
  const regel = `${new Date().toISOString()} ${t}`;
  console.log(regel);
  appendFileSync(join(MAP, "log.txt"), regel + "\n");
};

function geheim() {
  if (process.env.WEEKOVERZICHT_GEHEIM) return process.env.WEEKOVERZICHT_GEHEIM.trim();
  const pad = join(homedir(), ".kws", "weekoverzicht-geheim.txt");
  return existsSync(pad) ? readFileSync(pad, "utf8").trim() : null;
}

function maandag(nu = new Date()) {
  const d = new Date(nu);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Laat de site weten dat het niet lukte; die mailt dan met de knop. */
async function meldMislukt(week, t, reden) {
  try {
    const form = new FormData();
    form.set("week", week);
    form.set("t", t);
    form.set("bron", "pc");
    form.set("overslaan", reden);
    const r = await fetch(`${SITE}/api/social/weekoverzicht-plaats`, { method: "POST", body: form });
    log(`melding verstuurd (${r.status})`);
  } catch (e) {
    log(`melding versturen mislukt: ${e.message}`);
  }
}

const pauze = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (!vlag("altijd") && new Date().getDay() !== 1) {
    log("geen maandag, niets te doen");
    return 0;
  }
  const g = geheim();
  if (!g) {
    log("WEEKOVERZICHT_GEHEIM ontbreekt");
    return 1;
  }
  if (!CHROME) {
    log("Chrome niet gevonden");
    return 1;
  }

  const week = maandag();
  const t = createHmac("sha256", g).update(`weekoverzicht|${week}`).digest("base64url").slice(0, 32);
  const url = `${SITE}/matchday/weekoverzicht?t=${t}&week=${week}&auto=1`;
  log(`week ${week}, ${SITE}`);

  const chrome = spawn(
    CHROME,
    [
      `--remote-debugging-port=${POORT}`,
      `--user-data-dir=${join(MAP, "chrome")}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--window-size=1280,1000",
      // Buiten beeld: een echte Chrome (de RBFA weigert headless), maar niet in de weg.
      ...(vlag("zichtbaar") ? [] : ["--window-position=-32000,-32000"]),
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    let pagina;
    for (let i = 0; i < 30 && !pagina; i++) {
      await pauze(1000);
      try {
        const doelen = await (await fetch(`http://127.0.0.1:${POORT}/json`)).json();
        pagina = doelen.find((d) => d.type === "page");
      } catch {
        // Chrome start nog.
      }
    }
    if (!pagina) throw new Error("Chrome startte niet");

    const ws = new WebSocket(pagina.webSocketDebuggerUrl);
    await new Promise((klaar, fout) => {
      ws.onopen = klaar;
      ws.onerror = () => fout(new Error("geen verbinding met Chrome"));
    });
    let id = 0;
    const wacht = new Map();
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (wacht.has(m.id)) {
        wacht.get(m.id)(m);
        wacht.delete(m.id);
      }
    };
    const stuur = (method, params = {}) =>
      new Promise((r) => {
        const n = ++id;
        wacht.set(n, r);
        ws.send(JSON.stringify({ id: n, method, params }));
      });

    await stuur("Page.navigate", { url });
    const einde = Date.now() + MAX_WACHT_MS;
    while (Date.now() < einde) {
      await pauze(3000);
      const m = await stuur("Runtime.evaluate", {
        expression: "JSON.stringify(window.__weekoverzicht || null)",
        returnByValue: true,
      });
      const staat = JSON.parse(m.result?.result?.value ?? "null");
      if (staat?.klaar) {
        log(`${staat.ok ? "ok" : "MISLUKT"}: ${staat.bericht}`);
        return staat.ok ? 0 : 1;
      }
    }
    log("de pagina werd niet klaar binnen 6 minuten");
    await meldMislukt(week, t, "de pagina werd op de thuis-pc niet klaar binnen 6 minuten");
    return 1;
  } catch (e) {
    log(`fout: ${e.message}`);
    await meldMislukt(week, t, `fout op de thuis-pc: ${e.message}`);
    return 1;
  } finally {
    try {
      execFileSync("taskkill", ["/PID", String(chrome.pid), "/T", "/F"], { stdio: "ignore" });
    } catch {
      chrome.kill();
    }
  }
}

process.exit(await main());
