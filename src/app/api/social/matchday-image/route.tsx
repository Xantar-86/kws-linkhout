import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { controleerParams } from "@/lib/social/handtekening";
import { getTemplate } from "@/lib/social/template";
import { penseelVlak, penseelStreep, rasterHoek, veldStrook } from "@/lib/social/penseel";
import { getPosities, getSjabloon } from "@/lib/social/posities";
import { AfficheOpSjabloon } from "./sjabloon";

/**
 * De matchday-affiche in 1080x1350 (Instagram-portret, werkt ook op Facebook),
 * gebouwd naar het clubsjabloon: geschilderde vlakken, clublogo's, en onderaan
 * de veldstrook met de praktische info.
 *
 * Twee varianten via ?soort=
 *   wedstrijd  aankondiging met een datumbalk onder de kop
 *   uitslag    eindstand met de doelpuntenmakers per ploeg
 *
 * De parameters zijn ondertekend, zodat niemand anders tekst in een afbeelding
 * op ons domein kan zetten. Instagram haalt deze URL zelf op bij het
 * publiceren, dus de route blijft publiek bereikbaar zonder login.
 */

export const runtime = "nodejs";

const B = 1080;
const H = 1350;

const CREME = "#efe9e3";
const ROOD = "#9e1b1b";
const ROOD_LICHT = "#c0392b";
const DONKER = "#2a1f1f";

/** Hoogte van de veldstrook onderaan. */
const VELD_H = 322;

/** Regelhoogte van een doelpuntenregel, gebruikt om het infoblok te plaatsen. */
const DOELPUNT_REGEL = 29;

type FontGewicht = 400 | 700;

/**
 * Satori heeft altijd minstens één lettertype nodig. Anton draagt de koppen,
 * de score en de datum; Inter de fijnere tekst.
 */
function laadFonts() {
  const map = join(process.cwd(), "public", "fonts");
  const fonts: {
    name: string;
    data: Buffer;
    weight: FontGewicht;
    style: "normal";
  }[] = [];

  const anton = join(map, "anton.ttf");
  if (existsSync(anton)) {
    fonts.push({ name: "Anton", data: readFileSync(anton), weight: 400, style: "normal" });
  }

  for (const weight of [400, 700] as FontGewicht[]) {
    const pad = join(map, `inter-${weight}.woff`);
    if (existsSync(pad)) {
      fonts.push({ name: "Inter", data: readFileSync(pad), weight, style: "normal" });
    }
  }

  return fonts;
}

/**
 * De fotostrook onderaan. Staat er een echte foto in
 * public/images/social/veld.jpg (of .png), dan wordt die gebruikt; anders valt
 * de affiche terug op een getekende veldstrook.
 */
function veldAchtergrond(origin: string): string {
  const map = join(process.cwd(), "public", "images", "social");
  for (const naam of ["veld.jpg", "veld.png"]) {
    if (existsSync(join(map, naam))) {
      return `${origin}/images/social/${naam}`;
    }
  }
  return veldStrook({ breedte: B, hoogte: VELD_H });
}

/** Maakt een relatief logopad absoluut, zodat satori het kan ophalen. */
function logoUrl(waarde: string, origin: string): string | null {
  if (!waarde) return null;
  return waarde.startsWith("/") ? `${origin}${waarde}` : waarde;
}

/** "14|PEREMANS PIETER;38|GEYBELS MIKE" naar een lijst. */
function leesDoelpunten(waarde: string): { minuut: string; naam: string }[] {
  if (!waarde) return [];
  return waarde
    .split(";")
    .filter(Boolean)
    .map((deel) => {
      const [minuut, ...rest] = deel.split("|");
      return { minuut: `${minuut}'`, naam: rest.join("|") };
    })
    .slice(0, 7);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  if (!controleerParams(params)) {
    return new Response("Ongeldige of ontbrekende handtekening", { status: 403 });
  }

  const t = getTemplate().afbeelding;
  const origin = request.nextUrl.origin;

  const soort = params.get("soort") === "uitslag" ? "uitslag" : "wedstrijd";
  const thuisploeg = params.get("thuisploeg") ?? "";
  const uitploeg = params.get("uitploeg") ?? "";
  const thuisLogo = logoUrl(params.get("thuisLogo") ?? "", origin);
  const uitLogo = logoUrl(params.get("uitLogo") ?? "", origin);
  const label = params.get("label") ?? "";
  const weekdag = params.get("weekdag") ?? "";
  const dag = params.get("dag") ?? "";
  const maand = params.get("maand") ?? "";
  const tijd = params.get("tijd") ?? "";
  const thuisScore = params.get("thuisScore") ?? "";
  const uitScore = params.get("uitScore") ?? "";
  const doelpuntenThuis = leesDoelpunten(params.get("scorersThuis") ?? "");
  const doelpuntenUit = leesDoelpunten(params.get("scorersUit") ?? "");
  const veldNaam = params.get("veldNaam") ?? "";
  const veldAdres = params.get("veldAdres") ?? "";

  const fonts = laadFonts();
  if (fonts.length === 0) {
    return new Response(
      "Geen lettertype gevonden in public/fonts. Zie docs/SOCIAL_MATCHDAY.md.",
      { status: 500 }
    );
  }

  const isUitslag = soort === "uitslag";
  const kop = isUitslag ? t.kopUitslag : t.kop;
  const badge = `${label} - ${isUitslag ? "UITSLAG" : "VOLGENDE WEDSTRIJD"}`;

  // Staat het lege clubsjabloon in public/images/social/, dan bouwen we de
  // affiche daarbovenop. Dat is het echte ontwerp; de getekende versie
  // hieronder is enkel de terugval zolang het sjabloon ontbreekt.
  const sjabloon = getSjabloon(soort, origin);
  if (sjabloon) {
    // Met ?breedte= kan een kleinere versie opgevraagd worden, bijvoorbeeld
    // voor de voorbeeldweergave in de mail. Alle posities zijn procentueel,
    // dus de affiche schaalt in zijn geheel mee.
    const gevraagd = Number(params.get("breedte"));
    const schaal =
      Number.isFinite(gevraagd) && gevraagd >= 320 && gevraagd < sjabloon.breedte
        ? gevraagd / sjabloon.breedte
        : 1;
    const geschaald =
      schaal === 1
        ? sjabloon
        : {
            ...sjabloon,
            breedte: Math.round(sjabloon.breedte * schaal),
            hoogte: Math.round(sjabloon.hoogte * schaal),
          };

    return new ImageResponse(
      (
        <AfficheOpSjabloon
          sjabloon={geschaald}
          posities={getPosities()[soort]}
          gegevens={{
            soort,
            badge,
            thuisploeg,
            uitploeg,
            thuisLogo,
            uitLogo,
            eigenLogoUrl: `${origin}/images/logo-kws.png`,
            weekdag,
            dag,
            maand,
            tijd,
            thuisScore,
            uitScore,
            doelpuntenThuis,
            doelpuntenUit,
            veldNaam,
            veldAdres,
          }}
        />
      ),
      {
        width: geschaald.breedte,
        height: geschaald.hoogte,
        fonts,
        headers: { "Cache-Control": "public, max-age=3600, immutable" },
      }
    );
  }

  // De affichevlakken zitten hoger bij een uitslag, omdat de doelpuntenmakers
  // eronder nog ruimte nodig hebben.
  const vlakTop = isUitslag ? 402 : 500;
  const vlakH = 316;

  // Het infoblok schuift mee met het aantal doelpuntenregels, zodat een
  // wedstrijd met veel goals niet over de veldstrook loopt.
  const doelpuntenTop = 744;
  const regels = Math.max(doelpuntenThuis.length, doelpuntenUit.length);
  const infoTop = isUitslag
    ? Math.max(872, doelpuntenTop + regels * DOELPUNT_REGEL + 26)
    : 852;

  return new ImageResponse(
    (
      <div
        style={{
          width: `${B}px`,
          height: `${H}px`,
          display: "flex",
          position: "relative",
          background: CREME,
          fontFamily: "Inter",
          color: DONKER,
        }}
      >
        {/* Rasterhoek linksboven */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={rasterHoek({ breedte: 320, hoogte: 600, kleur: ROOD_LICHT })}
          width={320}
          height={600}
          alt=""
          style={{ position: "absolute", top: 0, left: 0, opacity: 0.8 }}
        />

        {/* Veldstrook onderaan */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={veldAchtergrond(origin)}
          width={B}
          height={VELD_H}
          alt=""
          style={{ position: "absolute", left: 0, top: H - VELD_H, objectFit: "cover" }}
        />

        {/* Clublogo. Het bronbestand heeft brede zijbalken met stamnummer, dus
            we snijden het schild eruit in plaats van het hele beeld te schalen. */}
        <EigenSchild origin={origin} left={40} top={48} breedte={296} hoogte={390} />

        {/* Kop */}
        <div
          style={{
            position: "absolute",
            left: 392,
            top: isUitslag ? 88 : 92,
            display: "flex",
            fontFamily: "Anton",
            fontSize: kop.length > 8 ? 132 : 150,
            letterSpacing: 2,
            color: ROOD,
            transform: "skewX(-10deg)",
          }}
        >
          {kop}
        </div>

        {/* Kwaststreek onder de kop */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={penseelStreep({ breedte: 660, hoogte: 46, kleur: ROOD })}
          width={660}
          height={46}
          alt=""
          style={{ position: "absolute", left: 372, top: isUitslag ? 268 : 248 }}
        />

        {/* Datumbalk, alleen bij een aankondiging */}
        {!isUitslag && (
          <div
            style={{
              position: "absolute",
              left: 372,
              top: 300,
              width: 664,
              height: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={penseelVlak({ breedte: 664, hoogte: 150, kleur: ROOD, seed: 41 })}
              width={664}
              height={150}
              alt=""
              style={{ position: "absolute", left: 0, top: 0 }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 42,
                color: "#ffffff",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", fontSize: 26, letterSpacing: 3, fontWeight: 700 }}>
                  {weekdag}
                </div>
                <div style={{ display: "flex", fontFamily: "Anton", fontSize: 54, lineHeight: 1.05 }}>
                  {dag}
                </div>
                <div style={{ display: "flex", fontSize: 26, letterSpacing: 3, fontWeight: 700 }}>
                  {maand}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  width: 3,
                  height: 96,
                  background: "rgba(255,255,255,0.55)",
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", fontSize: 26, letterSpacing: 3, fontWeight: 700 }}>
                  AFTRAP
                </div>
                <div style={{ display: "flex", fontFamily: "Anton", fontSize: 62 }}>{tijd}</div>
              </div>
            </div>
          </div>
        )}

        {/* Badge met ploeg en soort */}
        <div
          style={{
            position: "absolute",
            top: isUitslag ? 348 : 468,
            left: 372,
            width: 664,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              border: `3px solid ${ROOD}`,
              borderRadius: 999,
              padding: "7px 24px",
              fontSize: 23,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: ROOD,
            }}
          >
            {badge}
          </div>
        </div>

        {/* Affiche: thuisploeg links, uitploeg rechts */}
        <Kant
          naam={thuisploeg}
          logo={thuisLogo}
          origin={origin}
          seed={3}
          left={38}
          top={vlakTop}
          breedte={382}
          hoogte={vlakH}
        />
        <Kant
          naam={uitploeg}
          logo={uitLogo}
          origin={origin}
          seed={19}
          left={660}
          top={vlakTop}
          breedte={382}
          hoogte={vlakH}
        />

        {/* Score of VS in het midden */}
        <div
          style={{
            position: "absolute",
            left: 448,
            top: vlakTop + 52,
            width: 184,
            height: 178,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isUitslag && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={penseelVlak({ breedte: 184, hoogte: 178, kleur: ROOD, seed: 11 })}
                width={184}
                height={178}
                alt=""
                style={{ position: "absolute", left: 0, top: 0 }}
              />
              <div
                style={{
                  display: "flex",
                  fontFamily: "Anton",
                  fontSize: 80,
                  color: "#ffffff",
                  letterSpacing: 1,
                }}
              >
                {`${thuisScore}-${uitScore}`}
              </div>
            </>
          )}
          {!isUitslag && (
            <div
              style={{
                display: "flex",
                fontFamily: "Anton",
                fontSize: 96,
                color: "#ffffff",
                // Witte VS met rode rand, zoals op de clubaffiche.
                textShadow: `4px 4px 0 ${ROOD}, -4px 4px 0 ${ROOD}, 4px -4px 0 ${ROOD}, -4px -4px 0 ${ROOD}`,
              }}
            >
              VS
            </div>
          )}
        </div>

        {/* Doelpuntenmakers, alleen bij een uitslag */}
        {isUitslag && (
          <div
            style={{
              position: "absolute",
              top: doelpuntenTop,
              left: 0,
              width: B,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 30,
            }}
          >
            <Doelpunten lijst={doelpuntenThuis} uitlijning="flex-end" />
            <div
              style={{
                display: "flex",
                width: 3,
                height: Math.max(2, regels) * DOELPUNT_REGEL,
                background: ROOD,
                opacity: 0.45,
              }}
            />
            <Doelpunten lijst={doelpuntenUit} uitlijning="flex-start" />
          </div>
        )}

        {/* Praktische informatie */}
        <div
          style={{
            position: "absolute",
            top: infoTop,
            left: 0,
            width: B,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 36,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", width: 380 }}>
            <div
              style={{ display: "flex", fontFamily: "Anton", fontSize: 40, color: ROOD, letterSpacing: 1 }}
            >
              VELD
            </div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 700, marginTop: 3 }}>
              {(veldNaam || "Bij de tegenstander").toUpperCase()}
            </div>
            {veldAdres && (
              <div style={{ display: "flex", fontSize: 22, marginTop: 2, opacity: 0.85 }}>
                {veldAdres}
              </div>
            )}
          </div>

          <div style={{ display: "flex", width: 3, height: 118, background: ROOD, opacity: 0.45 }} />

          <div style={{ display: "flex", flexDirection: "column", width: 380 }}>
            <div
              style={{ display: "flex", fontFamily: "Anton", fontSize: 40, color: ROOD, letterSpacing: 1 }}
            >
              KANTINE
            </div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 700, marginTop: 3 }}>
              K.W.S. LINKHOUT
            </div>
            <div style={{ display: "flex", fontSize: 22, marginTop: 2, opacity: 0.85 }}>
              Iedereen welkom voor en na de wedstrijd
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: B,
      height: H,
      fonts,
      headers: {
        // Instagram haalt de afbeelding kort na het aanmaken op; een uur cache
        // volstaat en houdt herhaalde previews goedkoop.
        "Cache-Control": "public, max-age=3600, immutable",
      },
    }
  );
}

/**
 * Ons clubschild, bijgesneden uit het bronbestand.
 *
 * public/images/logo-kws.png is 1436x1095 met brede zijbalken ("EST 1938",
 * stamnummer) links en rechts van het schild. Het schild zelf zit op
 * x 415-1060, y 110-960. We tonen dat gebied door het beeld op te schalen in
 * een venster met overflow hidden; satori kent geen object-position.
 */
function EigenSchild({
  origin,
  left,
  top,
  breedte,
  hoogte,
}: {
  origin: string;
  left: number;
  top: number;
  breedte: number;
  hoogte: number;
}) {
  const schaal = breedte / 690;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: breedte,
        height: hoogte,
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${origin}/images/logo-kws.png`}
        width={Math.round(1436 * schaal)}
        height={Math.round(1095 * schaal)}
        alt=""
        style={{
          position: "absolute",
          left: -Math.round(390 * schaal),
          top: -Math.round(105 * schaal),
        }}
      />
    </div>
  );
}

/** Eén kant van de affiche: geschilderd vlak met logo en de ploegnaam onderin. */
function Kant({
  naam,
  logo,
  origin,
  seed,
  left,
  top,
  breedte,
  hoogte,
}: {
  naam: string;
  logo: string | null;
  origin: string;
  seed: number;
  left: number;
  top: number;
  breedte: number;
  hoogte: number;
}) {
  // Ons eigen logo wordt bijgesneden; logo's van de RBFA zijn JPG's met een
  // witte achtergrond en krijgen daarom een witte schijf, zodat de rand er
  // bewust uitziet in plaats van als een vierkant vlek op het rode vlak.
  const isEigenLogo = logo !== null && logo.startsWith(origin);
  // Lange clubnamen krijgen een kleinere letter zodat ze op één regel passen.
  const naamGroot = naam.length > 22 ? 24 : naam.length > 16 ? 27 : 31;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: breedte,
        height: hoogte,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={penseelVlak({ breedte, hoogte, kleur: ROOD, seed })}
        width={breedte}
        height={hoogte}
        alt=""
        style={{ position: "absolute", left: 0, top: 0 }}
      />

      <div
        style={{
          display: "flex",
          width: breedte,
          height: hoogte - 62,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isEigenLogo ? (
          <div style={{ display: "flex", width: 156, height: 205, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo!}
              width={Math.round(1436 * (156 / 690))}
              height={Math.round(1095 * (156 / 690))}
              alt=""
              style={{
                position: "absolute",
                left: -Math.round(390 * (156 / 690)),
                top: -Math.round(105 * (156 / 690)),
              }}
            />
          </div>
        ) : logo ? (
          <div
            style={{
              display: "flex",
              width: 186,
              height: 186,
              borderRadius: 999,
              background: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={142} height={142} style={{ objectFit: "contain" }} alt="" />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              width: 150,
              height: 150,
              borderRadius: 999,
              border: "6px solid #ffffff",
            }}
          />
        )}
      </div>

      <div
        style={{
          display: "flex",
          width: breedte - 36,
          justifyContent: "center",
          fontSize: naamGroot,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        {naam.toUpperCase()}
      </div>
    </div>
  );
}

/** Kolom met doelpuntenmakers, minuut vooraan. */
function Doelpunten({
  lijst,
  uitlijning,
}: {
  lijst: { minuut: string; naam: string }[];
  uitlijning: "flex-start" | "flex-end";
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: uitlijning,
        width: 400,
        gap: 4,
      }}
    >
      {lijst.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              color: ROOD,
              width: 48,
              justifyContent: "flex-end",
            }}
          >
            {d.minuut}
          </div>
          <div style={{ display: "flex", fontSize: 23, fontWeight: 700, letterSpacing: 0.3 }}>
            {d.naam}
          </div>
        </div>
      ))}
    </div>
  );
}
