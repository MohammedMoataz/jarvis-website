import { ImageResponse } from "next/og";

export const alt = "JARVIS, your second brain";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The share preview for every page: the ring, the name, the promise. Arc on void (JARVIS tokens).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "#060a10",
          color: "#e6eef5",
        }}
      >
        <svg width="300" height="300" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="56" fill="none" stroke="#3CD6F2" strokeWidth=".6" opacity=".45" />
          <circle cx="60" cy="60" r="45" fill="none" stroke="#3CD6F2" strokeWidth="9" strokeDasharray="21.27 7" />
          <circle cx="60" cy="60" r="32" fill="none" stroke="#3CD6F2" strokeWidth="1.4" />
          <circle cx="60" cy="60" r="21" fill="#3CD6F2" />
          <path d="M66 49 V64 a6.5 6.5 0 0 1 -13 0" fill="none" stroke="#060A10" strokeWidth="4.2" strokeLinecap="square" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 30, letterSpacing: 12, color: "#3cd6f2" }}>JARVIS</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>Your second brain.</div>
          <div style={{ fontSize: 32, color: "#8ea3b8" }}>Say it once. Find it forever.</div>
        </div>
      </div>
    ),
    size,
  );
}
