import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    const map: Record<string, string> = {
      "stypendia-rektora": "rektora",
      "stypendia-socjalne": "socjalne",
      "stypendia-dla-niepelnosprawnych": "niepelnosprawni",
      "zapomoga": "zapomoga",
      "wsparcie-materialne-i-swiadczenia": "wsparcie",
      "kalkulator-sredniej": "kalkulator",
    };
    const out: Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>> = [];
    for (const [from, hash] of Object.entries(map)) {
      out.push({ source: `/:locale/${from}`, destination: `/:locale/stypendia#${hash}`, permanent: true });
      out.push({ source: `/${from}`, destination: `/stypendia#${hash}`, permanent: true });
    }
    out.push({ source: "/:locale/przewodniczacy-i-wiceprzewodniczacy", destination: "/:locale/zarzad", permanent: true });
    out.push({ source: "/przewodniczacy-i-wiceprzewodniczacy", destination: "/zarzad", permanent: true });
    return out;
  },
  images: {
    // Logo to nasze zaufane SVG (public/logo-*.svg). next/image wymaga tej flagi,
    // by serwować SVG; sandbox + CSP wyłączają skrypty/osadzanie dla bezpieczeństwa.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
