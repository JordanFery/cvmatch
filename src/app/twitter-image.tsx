import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CVMatch — Optimisez votre CV pour chaque offre d'emploi";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            color: "#fff",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 18,
              background: "#fff",
              color: "#0a0a0a",
            }}
          >
            C
          </div>
          CVMatch
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 34, color: "#a3a3a3", textAlign: "center" }}>
          Optimisez votre CV pour chaque offre d&apos;emploi
        </div>
      </div>
    ),
    { ...size },
  );
}
