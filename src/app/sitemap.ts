import type { MetadataRoute } from "next";
import { searchIndex } from "@/lib/searchIndex";
import { routing } from "@/i18n/routing";

const BASE = "https://samorzad.ue.wroc.pl";

// Hub/landing pages deserve higher priority than leaf detail pages.
const HIGH_PRIORITY = new Set<string>([
  "/",
  "/dla-studenta",
  "/stypendia",
  "/nasza-dzialalnosc",
  "/partnerzy",
  "/kontakt",
]);

function loc(locale: string, href: string): string {
  return `${BASE}/${locale}${href === "/" ? "" : href}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return searchIndex.flatMap((entry) => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, loc(l, entry.href)]),
    );

    return routing.locales.map((locale) => ({
      url: loc(locale, entry.href),
      lastModified: now,
      changeFrequency: entry.href === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: entry.href === "/" ? 1 : HIGH_PRIORITY.has(entry.href) ? 0.9 : 0.7,
      alternates: {
        languages: { ...languages, "x-default": loc(routing.defaultLocale, entry.href) },
      },
    }));
  });
}
