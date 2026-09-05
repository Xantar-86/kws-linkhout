import Image from "next/image";

/**
 * De eerste seconde: een doek met het clublogo dat opentrekt naar de hero.
 *
 * Waarom dit géén React-animatie is
 * ---------------------------------
 * De verleiding is om dit met framer-motion te doen, maar dan speelt de
 * animatie pas nadat React op de client is aangekoppeld. In de tussentijd
 * staat de hero al op het scherm, en dan zie je eerst de pagina en daarna het
 * doek eroverheen komen. Precies verkeerd om.
 *
 * Daarom staat het doek gewoon in de HTML die de server stuurt, en doet CSS
 * het werk. Het is er dus vanaf het allereerste beeldje, en het trekt weg op
 * een moment dat niets met JavaScript te maken heeft. Blijft het script
 * hangen of staat het uit, dan trekt het doek even goed open: de animatie
 * eindigt op `visibility: hidden` met `forwards`, dus er kan niets blijven
 * plakken.
 *
 * Wanneer het speelt
 * ------------------
 * Alleen bij het eerste bezoek van een sessie, alleen op de startpagina, en
 * niet voor wie minder beweging vraagt. Dat regelt het scriptje in
 * app/layout.tsx, dat vóór de eerste tekening `data-opening="over"` op het
 * html-element zet. Staat dat er, dan verbergt de CSS het doek meteen en heeft
 * de bezoeker nooit iets gezien.
 *
 * Het geheel duurt 1,55 seconde en is met een toets of een klik over te slaan.
 */
export function Opening() {
  return (
    <div id="opening" aria-hidden="true">
      <div className="opening-helft opening-boven" />
      <div className="opening-helft opening-onder" />

      <div className="opening-merk">
        <Image
          src="/images/kwslinkhout-logo.png"
          alt=""
          width={160}
          height={160}
          priority
          className="opening-logo"
        />
        <span className="opening-lijn" />
        <span className="opening-tekst">Sinds 1938</span>
      </div>
    </div>
  );
}
