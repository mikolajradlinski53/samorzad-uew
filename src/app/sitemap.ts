import type { MetadataRoute } from "next";
import { searchIndex } from "@/lib/searchIndex";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return searchIndex.map((entry) => ({
    url: `${BASE}${entry.href === "/" ? "" : entry.href}`,
    lastModified: now,
    changeFrequency: entry.href === "/" ? "weekly" : "monthly",
    priority: entry.href === "/" ? 1 : HIGH_PRIORITY.has(entry.href) ? 0.9 : 0.7,
  }));
}
