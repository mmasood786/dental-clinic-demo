import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site.config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social sharing image. Every page inherits it unless it defines its
 * own `opengraph-image` file.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: siteConfig.brand.colors.ink,
          color: siteConfig.brand.colors.surface,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "30px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: siteConfig.brand.colors.accent,
          }}
        >
          <div
            style={{
              width: "56px",
              height: "6px",
              background: siteConfig.brand.colors.accent,
            }}
          />
          Dentist in {siteConfig.address.city}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "96px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: "38px",
              color: "rgba(245, 250, 249, 0.75)",
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "28px",
            color: "rgba(245, 250, 249, 0.6)",
          }}
        >
          <span>{siteConfig.phone}</span>
          <span>Book online</span>
        </div>
      </div>
    ),
    size,
  );
}
