import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = "JoyVer — We Create Joy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  // Embed the official public logo as a data URI so the image renderer does not
  // depend on the deployed site's hostname or an external image request.
  const logo = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoData = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF9F6",
          color: "#0B6B3A",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: 250,
            background: "#E8F5E9",
            right: -120,
            top: -180,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: 180,
            background: "#FFF3CD",
            left: -120,
            bottom: -180,
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 44,
            padding: "64px 80px",
            position: "relative",
          }}
        >
          <img
            src={logoData}
            width="210"
            height="207"
            alt=""
            style={{ borderRadius: 34, display: "flex", flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: -2 }}>
              {siteConfig.name}
            </div>
            <div style={{ marginTop: 8, color: "#4CAF50", fontSize: 36, fontWeight: 600 }}>
              {siteConfig.tagline}
            </div>
            <div style={{ marginTop: 24, maxWidth: 600, fontSize: 25, lineHeight: 1.4 }}>
              {siteConfig.description}
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 44,
            color: "#0B6B3A",
            fontSize: 18,
            display: "flex",
          }}
        >
          {siteConfig.name} · {siteConfig.tagline}
        </div>
      </div>
    ),
    size,
  );
}
