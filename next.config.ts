import type { NextConfig } from "next";

/**
 * Security headers for every response.
 *
 * The CSP is deliberately conservative: it locks down framing, form targets and
 * `<base>` without setting `default-src`/`script-src`, because GA4, Google Maps,
 * the Cal.com embed and Next.js' inline bootstrap scripts all need to load.
 * Tighten it with a nonce if you later add a strict CSP.
 *
 * `frame-src` allows the Cal.com booking iframe and the Google Maps embeds on
 * the location pages.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'self' https://app.cal.com https://cal.com https://www.google.com https://maps.google.com",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
