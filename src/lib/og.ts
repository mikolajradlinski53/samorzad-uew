import type { Metadata } from "next";

/**
 * Zwraca fragment metadanych z brandowanym obrazem Open Graph/Twitter dla danej
 * strony. Użycie: `export const metadata = { title, description, ...ogMeta(t, e) }`.
 */
export function ogMeta(title: string, eyebrow: string): Metadata {
  const url = `/api/og?title=${encodeURIComponent(title)}&eyebrow=${encodeURIComponent(eyebrow)}`;
  const images = [{ url, width: 1200, height: 630, alt: title }];
  return {
    openGraph: { images },
    twitter: { images },
  };
}
