"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, PenLine } from "lucide-react";

/**
 * Een vak waarin je met de vinger of de muis je handtekening zet.
 *
 * We bewaren de streken als punten, niet als beeld. Daardoor kan het vak mee
 * veranderen van grootte (een telefoon die van staand naar liggend draait)
 * zonder dat de handtekening vervormt of verdwijnt, en kunnen we bij het
 * opslaan precies rond de krabbel snijden. Dat laatste is nodig omdat het
 * handtekeningvak in de pdf een brede, lage strook is: een beeld met veel wit
 * errond zou daarin tot een onleesbaar streepje krimpen.
 *
 * De afbeelding gaat als PNG met doorzichtige achtergrond naar buiten, zodat
 * de lijntjes van het formulier eronder blijven zien.
 */

type Punt = { x: number; y: number };

export interface HandtekeningvakProps {
  /** Wat er boven het vak staat. */
  label: string;
  /** De huidige waarde: een PNG als data-URL, of een lege tekst. */
  waarde: string;
  onChange: (dataUrl: string) => void;
  /** Toont een sterretje en wordt door het formulier nagekeken. */
  verplicht?: boolean;
  /** Eigen uitleg onder het vak. */
  hulp?: string;
}

/** Dikte van de lijn in vakcoördinaten. */
const LIJNDIKTE = 2.4;
/** Hoeveel fijner we het beeld wegschrijven dan het vak op het scherm is. */
const UITVOER_SCHAAL = 3;

export function Handtekeningvak({
  label,
  waarde,
  onChange,
  verplicht = false,
  hulp,
}: HandtekeningvakProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strekenRef = useRef<Punt[][]>([]);
  const bezigRef = useRef(false);
  // Bij het opbouwen kijken we naar wat het formulier al bijhoudt, zodat een
  // terugkerend vak niet plots leeg lijkt.
  const [heeftInhoud, setHeeftInhoud] = useState(Boolean(waarde));

  /** Alles opnieuw tekenen op de huidige grootte. */
  const hertekenen = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const breedte = canvas.clientWidth;
    const hoogte = canvas.clientHeight;
    if (canvas.width !== Math.round(breedte * dpr) || canvas.height !== Math.round(hoogte * dpr)) {
      canvas.width = Math.round(breedte * dpr);
      canvas.height = Math.round(hoogte * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, breedte, hoogte);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = LIJNDIKTE;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const streek of strekenRef.current) {
      if (streek.length === 1) {
        // Eén tik is ook een teken: een punt zetten.
        ctx.beginPath();
        ctx.arc(streek[0].x, streek[0].y, LIJNDIKTE / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#0f172a";
        ctx.fill();
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(streek[0].x, streek[0].y);
      for (let i = 1; i < streek.length; i++) ctx.lineTo(streek[i].x, streek[i].y);
      ctx.stroke();
    }
  }, []);

  /** Een PNG die net rond de krabbel gesneden is. */
  const naarDataUrl = useCallback((): string => {
    const streken = strekenRef.current;
    const punten = streken.flat();
    if (punten.length === 0) return "";

    const marge = LIJNDIKTE;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of punten) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    minX -= marge;
    minY -= marge;
    maxX += marge;
    maxY += marge;

    const breedte = Math.max(1, maxX - minX);
    const hoogte = Math.max(1, maxY - minY);
    const uit = document.createElement("canvas");
    uit.width = Math.round(breedte * UITVOER_SCHAAL);
    uit.height = Math.round(hoogte * UITVOER_SCHAAL);
    const ctx = uit.getContext("2d");
    if (!ctx) return "";

    ctx.setTransform(UITVOER_SCHAAL, 0, 0, UITVOER_SCHAAL, -minX * UITVOER_SCHAAL, -minY * UITVOER_SCHAAL);
    ctx.strokeStyle = "#0f172a";
    ctx.fillStyle = "#0f172a";
    ctx.lineWidth = LIJNDIKTE;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const streek of streken) {
      if (streek.length === 1) {
        ctx.beginPath();
        ctx.arc(streek[0].x, streek[0].y, LIJNDIKTE / 2, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(streek[0].x, streek[0].y);
      for (let i = 1; i < streek.length; i++) ctx.lineTo(streek[i].x, streek[i].y);
      ctx.stroke();
    }
    return uit.toDataURL("image/png");
  }, []);

  useEffect(() => {
    hertekenen();
    const opnieuw = () => hertekenen();
    window.addEventListener("resize", opnieuw);
    window.addEventListener("orientationchange", opnieuw);
    return () => {
      window.removeEventListener("resize", opnieuw);
      window.removeEventListener("orientationchange", opnieuw);
    };
  }, [hertekenen]);

  function puntUitGebeurtenis(gebeurtenis: React.PointerEvent<HTMLCanvasElement>): Punt {
    const canvas = canvasRef.current!;
    const kader = canvas.getBoundingClientRect();
    return { x: gebeurtenis.clientX - kader.left, y: gebeurtenis.clientY - kader.top };
  }

  function begin(gebeurtenis: React.PointerEvent<HTMLCanvasElement>) {
    gebeurtenis.preventDefault();
    canvasRef.current?.setPointerCapture(gebeurtenis.pointerId);
    bezigRef.current = true;
    strekenRef.current.push([puntUitGebeurtenis(gebeurtenis)]);
    // Meteen bij de eerste aanraking, zodat de uitleg in het vak verdwijnt
    // terwijl er getekend wordt en niet pas als de vinger loskomt.
    setHeeftInhoud(true);
    hertekenen();
  }

  function beweeg(gebeurtenis: React.PointerEvent<HTMLCanvasElement>) {
    if (!bezigRef.current) return;
    gebeurtenis.preventDefault();
    const streek = strekenRef.current[strekenRef.current.length - 1];
    const punt = puntUitGebeurtenis(gebeurtenis);
    const vorige = streek[streek.length - 1];
    // Minuscule bewegingen overslaan: minder punten, even vloeiend.
    if (vorige && Math.hypot(punt.x - vorige.x, punt.y - vorige.y) < 0.8) return;
    streek.push(punt);
    hertekenen();
  }

  function eindig(gebeurtenis: React.PointerEvent<HTMLCanvasElement>) {
    if (!bezigRef.current) return;
    bezigRef.current = false;
    canvasRef.current?.releasePointerCapture(gebeurtenis.pointerId);
    setHeeftInhoud(strekenRef.current.flat().length > 0);
    onChange(naarDataUrl());
  }

  function wissen() {
    strekenRef.current = [];
    setHeeftInhoud(false);
    hertekenen();
    onChange("");
  }

  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">
          {label}
          {verplicht && <span className="ml-0.5 text-primary">*</span>}
        </label>
        {heeftInhoud && (
          <button
            type="button"
            onClick={wissen}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Eraser className="h-3.5 w-3.5" />
            Opnieuw
          </button>
        )}
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          // touch-none: anders schuift de pagina mee terwijl je tekent.
          className="h-36 w-full touch-none rounded-xl border-2 border-dashed border-zand-300 bg-white sm:h-32"
          onPointerDown={begin}
          onPointerMove={beweeg}
          onPointerUp={eindig}
          onPointerCancel={eindig}
          onPointerLeave={eindig}
        />
        {!heeftInhoud && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400">
            <PenLine className="h-5 w-5" />
            <span className="text-sm">Teken hier met je vinger of de muis</span>
          </div>
        )}
        {/* Een lijn om op te schrijven, zoals op papier. */}
        <div className="pointer-events-none absolute inset-x-6 bottom-6 border-b border-zand-200" />
      </div>

      {hulp && <p className="mt-1.5 text-xs text-slate-500">{hulp}</p>}
    </div>
  );
}
