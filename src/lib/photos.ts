/**
 * Centralne źródło zdjęć całej strony.
 *
 * JAK PODMIENIĆ NA PRAWDZIWE ZDJĘCIA:
 * 1. Wrzuć pliki do folderu `public/photos/...` (dokładne nazwy poniżej i w
 *    `public/photos/README.md`).
 * 2. Zmień `USE_LOCAL_PHOTOS` na `true`.
 * To wszystko — Hero, sekcja „Życie studenckie" i Zarząd zaczną używać Twoich zdjęć.
 */

export const USE_LOCAL_PHOTOS = false;

const pic = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** Hero — 8 zdjęć pionowych (kadr 4:5, ~800×1000 px). public/photos/hero/01.jpg … 08.jpg */
export const heroPhotos: string[] = USE_LOCAL_PHOTOS
  ? Array.from({ length: 8 }, (_, i) => `/photos/hero/${String(i + 1).padStart(2, "0")}.jpg`)
  : ["a", "b", "c", "d", "e", "f", "g", "h"].map((s) => pic(`ssuew-${s}`, 500, 640));

/** Sekcja „Życie studenckie" — 2 zdjęcia poziome (kadr 3:2, ~1600×1100 px). */
export const studentLifePhotos = USE_LOCAL_PHOTOS
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

/** Zarząd — 5 zdjęć (kadr 4:5, ~800×1000 px). public/photos/zarzad/01.jpg … 05.jpg */
export const boardPhotos: string[] = USE_LOCAL_PHOTOS
  ? Array.from({ length: 5 }, (_, i) => `/photos/zarzad/${String(i + 1).padStart(2, "0")}.jpg`)
  : ["mikolaj", "anna", "piotr", "katarzyna", "tomasz"].map((s) => pic(s, 500, 640));

/** RUSS — 12 zdjęć (kadr 4:5, ~800×1000 px). public/photos/russ/01.jpg … 12.jpg */
export const russPhotos: string[] = USE_LOCAL_PHOTOS
  ? Array.from({ length: 12 }, (_, i) => `/photos/russ/${String(i + 1).padStart(2, "0")}.jpg`)
  : Array.from({ length: 12 }, (_, i) => pic(`russ-${i + 1}`, 500, 640));
