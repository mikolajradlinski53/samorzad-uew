import type { Partner } from "@/components/partners/partnerEffects";

/**
 * Prawdziwi partnerzy Samorządu.
 *
 * PUSTA lista = na stronie zostaje teaser „Twoja marka / Your brand".
 * Dodaj wpis + wrzuć logo do `public/partnerzy/...` → ściana pokazuje realne
 * logotypy, a w modalu gra animacja dobrana po `category`.
 *
 * Pola:
 *  - name      — nazwa partnera (alt logo, nagłówek modala)
 *  - logo      — ścieżka do pliku, np. "/partnerzy/lot.svg" (najlepiej SVG)
 *  - href      — link do strony partnera (przycisk „Odwiedź stronę")
 *  - category  — szablon animacji w modalu; obecnie: "aviation" (samolot).
 *                Dokładamy kolejne w `CATEGORY_EFFECTS` (partnerEffects.ts).
 *  - color     — kolor marki (tinta animacji); brak → akcent UEW.
 *  - frames    — przyszłe pliki klatkowe (mają priorytet nad category).
 */
export interface PartnerEntry extends Partner {
  href?: string;
}

export const partners: PartnerEntry[] = [
  // Przykład — odkomentuj i podmień na prawdziwe dane:
  // { name: "LOT Polish Airlines", logo: "/partnerzy/lot.svg", href: "https://www.lot.com", category: "aviation", color: "#16469D" },
];
