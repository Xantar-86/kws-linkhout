import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "KWS Linkhout - Voetbalclub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        <img
          src="https://www.kwslinkhout.be/images/logo kws.jpg"
          width={300}
          height={300}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            color: "#1a1a1a",
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "-1px",
          }}
        >
          KWS Linkhout
        </div>
        <div
          style={{
            color: "#666",
            fontSize: 26,
          }}
        >
          Een club met een hart • Est. 1938
        </div>
      </div>
    ),
    { ...size }
  );
}
