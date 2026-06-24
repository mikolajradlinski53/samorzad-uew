/**
 * Centralne źródło zdjęć całej strony.
 *
 * JAK PODMIENIĆ NA PRAWDZIWE ZDJĘCIA (per sekcja — można włączać niezależnie):
 * 1. Wrzuć pliki do `public/photos/<sekcja>/...` (nazwy w `public/photos/README.md`).
 * 2. W obiekcie `USE_LOCAL` niżej ustaw daną sekcję na `true`.
 * Hero, „Życie studenckie", Zarząd i RUSS mają osobne przełączniki, więc nie
 * trzeba czekać z jedną sekcją na komplet pozostałych.
 *
 * Tip: duże zdjęcia warto najpierw zoptymalizować (sharp: 4:5 ~800×1000, jpeg q80).
 */

export const USE_LOCAL = {
  hero: true, // public/photos/hero/01.jpg … (HERO_COUNT)
  zycie: false, // public/photos/zycie/integracja.jpg, wsparcie.jpg
  zarzad: false, // public/photos/zarzad/01.jpg …
  russ: false, // public/photos/russ/01.jpg …
  projekty: false, // public/photos/projekty/<klucz-projektu>.jpg
};

// Liczba zdjęć hero w folderze (dopasuj do liczby plików 0N.jpg).
const HERO_COUNT = 5;

const pic = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const localList = (folder: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/photos/${folder}/${String(i + 1).padStart(2, "0")}.jpg`);

/** Hero — zdjęcia pionowe (kadr 4:5). public/photos/hero/01.jpg … */
export const heroPhotos: string[] = USE_LOCAL.hero
  ? localList("hero", HERO_COUNT)
  : ["a", "b", "c", "d", "e", "f", "g", "h"].map((s) => pic(`ssuew-${s}`, 500, 640));

/** Sekcja „Życie studenckie" — 2 zdjęcia poziome (kadr 3:2). */
export const studentLifePhotos = USE_LOCAL.zycie
  ? {
      integracja: "/photos/zycie/integracja.jpg",
      wsparcie: "/photos/zycie/wsparcie.jpg",
    }
  : {
      integracja:
        "https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?q=80&w=2564&auto=format&fit=crop",
      wsparcie:
        "https://images.unsplash.com/photo-1504610926078-a1611febcad3?q=80&w=2416&auto=format&fit=crop",
    };

/** Zarząd — zdjęcia (kadr 4:5). public/photos/zarzad/01.jpg … */
export const boardPhotos: string[] = USE_LOCAL.zarzad
  ? localList("zarzad", 7)
  : ["mikolaj", "anna", "piotr", "katarzyna", "tomasz", "lena", "szymon"].map((s) => pic(s, 500, 640));

/** RUSS — zdjęcia (kadr 4:5). public/photos/russ/01.jpg … */
export const russPhotos: string[] = USE_LOCAL.russ
  ? localList("russ", 15)
  : Array.from({ length: 15 }, (_, i) => pic(`russ-${i + 1}`, 500, 640));

/** Zdjęcie projektu (NaszeProjekty) — kadr poziomy. public/photos/projekty/<klucz>.jpg */
export const projectPhoto = (key: string): string | undefined =>
  USE_LOCAL.projekty ? `/photos/projekty/${key}.jpg` : undefined;
