import { naarPixels, type AffichePosities, type Sjabloon } from "@/lib/social/posities";

/**
 * De affiche bovenop het lege clubsjabloon.
 *
 * Het sjabloon levert alles wat nooit verandert: de papierachtergrond, het
 * clublogo, de kop met kwaststreek, de lege penseelvlakken, de VELD- en
 * KANTINE-iconen en de veldfoto. Hier komt enkel de variabele inhoud
 * overheen, op de posities uit content/social/affiche-posities.json.
 */

const ROOD = "#9e1b1b";
const DONKER = "#2a1f1f";

export interface AfficheGegevens {
  soort: "wedstrijd" | "uitslag";
  badge: string;
  thuisploeg: string;
  uitploeg: string;
  thuisLogo: string | null;
  uitLogo: string | null;
  eigenLogoUrl: string;
  weekdag: string;
  dag: string;
  maand: string;
  tijd: string;
  thuisScore: string;
  uitScore: string;
  doelpuntenThuis: { minuut: string; naam: string }[];
  doelpuntenUit: { minuut: string; naam: string }[];
  veldNaam: string;
  veldAdres: string;
}

/**
 * Ons clubschild uit public/images/logo-kws.png, bijgesneden. Het bronbestand
 * is 1436x1095 met brede zijbalken; het schild zit op x 390-1080, y 105-965.
 */
function EigenSchild({ url, breedte }: { url: string; breedte: number }) {
  const schaal = breedte / 690;
  return (
    <div
      style={{
        display: "flex",
        width: breedte,
        height: Math.round(860 * schaal),
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
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

/**
 * Eén kant van de affiche, binnen een penseelvlak: het clublogo, de ploegnaam
 * en bij een uitslag ook de doelpuntenmakers van die ploeg.
 *
 * De doelpuntenmakers staan in het vlak en niet eronder, omdat het sjabloon
 * tussen de vlakken en de VELD-regel geen ruimte laat.
 */
function Kant({
  vak,
  naam,
  logo,
  eigenLogoUrl,
  doelpunten,
  sjabloon,
  posities,
}: {
  vak: "vlakLinks" | "vlakRechts";
  naam: string;
  logo: string | null;
  eigenLogoUrl: string;
  doelpunten: { minuut: string; naam: string }[];
  sjabloon: Sjabloon;
  posities: AffichePosities;
}) {
  const p = naarPixels(posities[vak], sjabloon.breedte, sjabloon.hoogte);
  const hoogte = p.height ?? Math.round(sjabloon.hoogte * 0.22);
  const heeftDoelpunten = doelpunten.length > 0;

  // Zonder doelpuntenmakers mag het logo de volle ruimte krijgen.
  const naamHoogte = Math.round(hoogte * (heeftDoelpunten ? 0.14 : 0.22));
  const scorersHoogte = heeftDoelpunten ? Math.round(hoogte * 0.42) : 0;
  const logoHoogte = hoogte - naamHoogte - scorersHoogte;
  const logoMaat = Math.round(Math.min(logoHoogte * 0.9, p.width * 0.44));

  const naamGroot = Math.round(
    (naam.length > 24 ? 0.048 : naam.length > 17 ? 0.056 : 0.066) * p.width
  );
  // Bij veel doelpunten wordt de regel kleiner, zodat alles binnen het
  // penseelvlak blijft in plaats van eronder uit te lopen.
  const scorerGroot = Math.round(p.width * (doelpunten.length > 4 ? 0.042 : 0.048));

  const isEigen = logo !== null && logo === eigenLogoUrl;

  return (
    <div
      style={{
        position: "absolute",
        left: p.left,
        top: p.top,
        width: p.width,
        height: hoogte,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: p.width,
          height: logoHoogte,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isEigen ? (
          <EigenSchild url={logo!} breedte={Math.round(logoMaat * 0.86)} />
        ) : logo ? (
          <div
            style={{
              display: "flex",
              width: logoMaat,
              height: logoMaat,
              borderRadius: 999,
              background: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              width={Math.round(logoMaat * 0.78)}
              height={Math.round(logoMaat * 0.78)}
              style={{ objectFit: "contain" }}
              alt=""
            />
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          width: p.width - 20,
          height: naamHoogte,
          alignItems: "center",
          justifyContent: "center",
          fontSize: naamGroot,
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.05,
        }}
      >
        {naam.toUpperCase()}
      </div>

      {heeftDoelpunten && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: p.width - 20,
            height: scorersHoogte,
            gap: Math.round(scorerGroot * 0.12),
          }}
        >
          {doelpunten.slice(0, 5).map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: Math.round(scorerGroot * 0.4),
                color: "#ffffff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: Math.round(scorerGroot * 0.92),
                  fontWeight: 700,
                  opacity: 0.85,
                }}
              >
                {d.minuut}
              </div>
              <div style={{ display: "flex", fontSize: scorerGroot, fontWeight: 700 }}>
                {d.naam}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Bouwt de volledige affiche bovenop het sjabloon. */
export function AfficheOpSjabloon({
  gegevens,
  sjabloon,
  posities,
}: {
  gegevens: AfficheGegevens;
  sjabloon: Sjabloon;
  posities: AffichePosities;
}) {
  const B = sjabloon.breedte;
  const H = sjabloon.hoogte;
  const isUitslag = gegevens.soort === "uitslag";

  const balk = naarPixels(posities.balk, B, H);
  const badge = naarPixels(posities.badge, B, H);
  const midden = naarPixels(posities.midden, B, H);
  const veld = naarPixels(posities.veld, B, H);
  const kantine = naarPixels(posities.kantine, B, H);

  const balkH = balk.height ?? Math.round(H * 0.08);
  const infoGroot = Math.round(B * 0.021);

  return (
    <div
      style={{
        width: `${B}px`,
        height: `${H}px`,
        display: "flex",
        position: "relative",
        fontFamily: "Inter",
        color: DONKER,
      }}
    >
      {/* Het clubsjabloon als onderlaag */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sjabloon.url}
        width={B}
        height={H}
        alt=""
        style={{ position: "absolute", left: 0, top: 0 }}
      />

      {/* De rode balk: datum en aftrapuur, of de eindstand */}
      <div
        style={{
          position: "absolute",
          left: balk.left,
          top: balk.top,
          width: balk.width,
          height: balkH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: Math.round(B * 0.075),
          color: "#ffffff",
        }}
      >
        {isUitslag ? (
          <div
            style={{
              display: "flex",
              fontFamily: "Anton",
              fontSize: Math.round(balkH * 0.78),
              letterSpacing: 3,
            }}
          >
            {`${gegevens.thuisScore} - ${gegevens.uitScore}`}
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: Math.round(balkH * 0.21),
                  letterSpacing: 4,
                  fontWeight: 700,
                }}
              >
                {gegevens.weekdag}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Anton",
                  fontSize: Math.round(balkH * 0.5),
                  lineHeight: 1,
                }}
              >
                {gegevens.dag}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: Math.round(balkH * 0.21),
                  letterSpacing: 4,
                  fontWeight: 700,
                }}
              >
                {gegevens.maand}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                width: 3,
                height: Math.round(balkH * 0.68),
                background: "rgba(255,255,255,0.55)",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: Math.round(balkH * 0.21),
                  letterSpacing: 4,
                  fontWeight: 700,
                }}
              >
                AFTRAP
              </div>
              <div
                style={{ display: "flex", fontFamily: "Anton", fontSize: Math.round(balkH * 0.56) }}
              >
                {gegevens.tijd}
              </div>
            </div>
          </>
        )}
      </div>

      {/* De badge met ploeg en soort */}
      <div
        style={{
          position: "absolute",
          left: badge.left,
          top: badge.top,
          width: badge.width,
          height: badge.height ?? Math.round(H * 0.026),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // De ovaal is smal; de tekst moet er op één regel in passen.
          fontSize: Math.round(
            B * (gegevens.badge.length > 24 ? 0.0165 : gegevens.badge.length > 18 ? 0.019 : 0.022)
          ),
          fontWeight: 700,
          letterSpacing: 1,
          color: ROOD,
          whiteSpace: "nowrap",
        }}
      >
        {gegevens.badge}
      </div>

      {/* De twee ploegen */}
      <Kant
        vak="vlakLinks"
        naam={gegevens.thuisploeg}
        logo={gegevens.thuisLogo}
        eigenLogoUrl={gegevens.eigenLogoUrl}
        doelpunten={isUitslag ? gegevens.doelpuntenThuis : []}
        sjabloon={sjabloon}
        posities={posities}
      />
      <Kant
        vak="vlakRechts"
        naam={gegevens.uitploeg}
        logo={gegevens.uitLogo}
        eigenLogoUrl={gegevens.eigenLogoUrl}
        doelpunten={isUitslag ? gegevens.doelpuntenUit : []}
        sjabloon={sjabloon}
        posities={posities}
      />

      {/* VS tussen de vlakken, alleen bij een aankondiging */}
      {!isUitslag && (
        <div
          style={{
            position: "absolute",
            left: midden.left,
            top: midden.top,
            width: midden.width,
            height: midden.height ?? Math.round(H * 0.09),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Anton",
            fontSize: Math.round(B * 0.075),
            color: "#ffffff",
            textShadow: `4px 4px 0 ${ROOD}, -4px 4px 0 ${ROOD}, 4px -4px 0 ${ROOD}, -4px -4px 0 ${ROOD}`,
          }}
        >
          VS
        </div>
      )}

      {/* Praktische informatie, één regel onder de koppen uit het sjabloon */}
      <div
        style={{
          position: "absolute",
          left: veld.left,
          top: veld.top,
          width: veld.width,
          display: "flex",
          fontSize: infoGroot,
          fontWeight: 700,
          color: ROOD,
        }}
      >
        {gegevens.veldNaam || "Op verplaatsing"}
      </div>

      <div
        style={{
          position: "absolute",
          left: kantine.left,
          top: kantine.top,
          width: kantine.width,
          display: "flex",
          fontSize: infoGroot,
          fontWeight: 700,
          color: ROOD,
        }}
      >
        Iedereen welkom
      </div>
    </div>
  );
}
