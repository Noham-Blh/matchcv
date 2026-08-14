import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#12141C",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: 480,
            background: "rgba(90,112,228,0.35)",
            filter: "blur(10px)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <svg width="56" height="56" viewBox="0 0 100 100">
            <path d="M26 74 L26 28 L50 54" stroke="#C6FF3D" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M50 54 L74 28 L74 74" stroke="#5A70E4" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#FFFFFF" }}>MatchCV</div>
        </div>
        <div style={{ display: "flex", fontSize: 58, fontWeight: 700, color: "#FFFFFF", maxWidth: 900, lineHeight: 1.15 }}>
          Le même CV. Relu par le bon recruteur, à chaque fois.
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 26, color: "rgba(255,255,255,0.6)" }}>
          matchcv.fr — CV et lettre de motivation optimisés par IA
        </div>
      </div>
    ),
    { ...size }
  );
}
