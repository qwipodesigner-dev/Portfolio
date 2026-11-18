import type { NextConfig } from "next";

/**
 * Security headers. A full Content-Security-Policy is deliberately not
 * set: the Google Translate integration injects remote scripts, inline
 * styles, and same-origin-accessible iframes that an honest CSP would
 * have to allowlist so broadly it stops meaning anything. The headers
 * below are the ones that hold regardless.
 */
const securityHeaders = [
  // This site is never legitimately framed by anyone - blocks
  // clickjacking of both the public site and the /admin portal.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
