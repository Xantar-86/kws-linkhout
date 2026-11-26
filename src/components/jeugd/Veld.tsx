import { VELD } from "@/lib/jeugd/vragen";

/**
 * Een voetbalveld in 1-4-3-3 met de gebruikelijke rugnummers. Zonder
 * `onKies` is het enkel een tekening (voor verslag en fiche).
 */
export function Veld({
  gekozen,
  onKies,
  klein = false,
}: {
  gekozen: number[];
  onKies?: (nr: number) => void;
  klein?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 120"
      className={klein ? "w-40" : "w-full max-w-[320px]"}
      role={onKies ? "group" : "img"}
      aria-label={onKies ? "Kies posities op het veld" : `Posities: ${gekozen.join(", ") || "geen"}`}
    >
      <rect x="1" y="1" width="98" height="118" rx="4" fill="#2f7d46" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="1" y={1 + i * 19.67} width="98" height="9.83" fill="#358a4e" />
      ))}
      <g fill="none" stroke="#e8f3ea" strokeWidth="0.6" opacity="0.85">
        <rect x="5" y="5" width="90" height="110" />
        <line x1="5" y1="60" x2="95" y2="60" />
        <circle cx="50" cy="60" r="10" />
        <rect x="25" y="5" width="50" height="17" />
        <rect x="38" y="5" width="24" height="6" />
        <rect x="25" y="98" width="50" height="17" />
        <rect x="38" y="109" width="24" height="6" />
      </g>
      {VELD.map((p) => {
        const plaats = gekozen.indexOf(p.nr);
        const aan = plaats >= 0;
        const y = p.y * 1.2;
        return (
          <g
            key={p.nr}
            onClick={onKies ? () => onKies(p.nr) : undefined}
            onKeyDown={
              onKies
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onKies(p.nr);
                    }
                  }
                : undefined
            }
            role={onKies ? "checkbox" : undefined}
            aria-checked={onKies ? aan : undefined}
            aria-label={onKies ? `${p.nr} ${p.naam}` : undefined}
            tabIndex={onKies ? 0 : undefined}
            className={onKies ? "cursor-pointer outline-none [&:focus-visible>circle]:stroke-[#f4c430]" : undefined}
          >
            <title>{`${p.nr}: ${p.naam}`}</title>
            {onKies && <circle cx={p.x} cy={y} r="9" fill="transparent" />}
            <circle
              cx={p.x}
              cy={y}
              r="5.6"
              fill={aan ? "#b91c1c" : "#ffffff"}
              stroke={aan ? "#ffffff" : "#1f2937"}
              strokeWidth={aan ? 1 : 0.5}
              opacity={aan || onKies ? 1 : 0.55}
            />
            <text
              x={p.x}
              y={y + 2.1}
              textAnchor="middle"
              fontSize="5.6"
              fontWeight="700"
              fill={aan ? "#ffffff" : "#1f2937"}
              style={{ pointerEvents: "none" }}
            >
              {p.nr}
            </text>
            {aan && gekozen.length > 1 && (
              <g style={{ pointerEvents: "none" }}>
                <circle cx={p.x + 5} cy={y - 5} r="2.8" fill="#f4c430" />
                <text x={p.x + 5} y={y - 3.9} textAnchor="middle" fontSize="3.4" fontWeight="700" fill="#1f2937">
                  {plaats + 1}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function positieNamen(nrs: number[]): string {
  return nrs.map((n) => VELD.find((v) => v.nr === n)?.naam ?? String(n)).join(", ");
}
