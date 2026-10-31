import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pagead2.googlesyndication.com https://adservice.google.com https://www.googletagservices.com https://tpc.googlesyndication.com https://partner.googleadservices.com https://www.googletagmanager.com https://www.google.com https://maps.googleapis.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.doubleclick.net https://*.googlesyndication.com https://www.google.com https://www.gstatic.com https://maps.gstatic.com https://*.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  connect-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://www.google.com https://csi.gstatic.com https://maps.googleapis.com;
  frame-src 'self' https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://www.google.com https://partner.googleadservices.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Prevents server fingerprinting
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(self)" },
          { key: "Content-Security-Policy", value: cspHeader },
        ],
      },
    ];
  },
};

export default nextConfig;