/**
 * Centralne źródło zdjęć całej strony.
 *
 * JAK PODMIENIĆ NA PRAWDZIWE ZDJĘCIA (per sekcja — można włączać niezależnie):
 * 1. Wrzuć pliki do `public/photos/<sekcja>/...` (nazwy w `public/photos/README.md`).
 * 2. W obiekcie `USE_LOCAL` niżej ustaw daną sekcję na `true`.
 * Hero, „Życie studenckie", Zarząd i RUSS mają osobne przełączniki, więc nie
 * trzeba czekać z jedną sekcją na komplet pozostałych.
 *
 * Kadry hero są w WebP i NIE są przycinane do wspólnych proporcji — konwersję
 * i manifest wymiarów robi `scripts/build-hero-manifest.mjs`.
 */

import { heroFrames, type HeroFrame } from "./hero-frames";

export const USE_LOCAL = {
  hero: true, // public/photos/hero/01.webp … (HERO_COUNT)
  zycie: false, // public/photos/zycie/integracja.jpg, wsparcie.jpg
  zarzad: false, // public/photos/zarzad/01.jpg …
  russ: false, // public/photos/russ/01.jpg …
  projekty: false, // public/photos/projekty/<klucz-projektu>.jpg
};

// Liczba numerowanych kadrów 0N.webp (używanych poza ścianą: manifest, projekty).
const HERO_COUNT = 5;

const pic = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const localList = (folder: string, count: number, ext = "jpg") =>
  Array.from({ length: count }, (_, i) => `/photos/${folder}/${String(i + 1).padStart(2, "0")}.${ext}`);

/** Numerowane kadry pionowe używane poza ścianą. public/photos/hero/01.webp … */
export const heroPhotos: string[] = USE_LOCAL.hero
  ? localList("hero", HERO_COUNT, "webp")
  : ["a", "b", "c", "d", "e", "f", "g", "h"].map((s) => pic(`ssuew-${s}`, 500, 640));

/**
 * Ściana kadrów w hero.
 *
 * Bierze manifest `heroFrames`, a nie samą listę ścieżek, bo każdy kadr ma
 * WŁASNE proporcje — zdjęcia nie są przycinane do wspólnego formatu. Wymiary
 * muszą dojść do przeglądarki przed plikiem, inaczej ściana skacze przy
 * każdym doładowanym zdjęciu.
 *
 * Manifest generuje `scripts/build-hero-manifest.mjs`.
 */
export const wallFrames: HeroFrame[] = heroFrames;

/**
 * Sekcja „Życie studenckie" — 2 zdjęcia poziome (kadr 3:2).
 *
 * Dopóki nie ma dedykowanych szerokich kadrów, używamy prawdziwych zdjęć
 * SSUEW z lokalnego archiwum hero. Nie pobieramy stocków, które udawałyby
 * życie UEW i znikały przy braku połączenia z zewnętrznym serwerem.
 */
export const studentLifePhotos = USE_LOCAL.zycie
  ? {
      integracja: "/photos/zycie/integracja.jpg",
      wsparcie: "/photos/zycie/wsparcie.jpg",
    }
  : {
      integracja: "/photos/hero/02.webp",
      wsparcie: "/photos/hero/04.webp",
    };

/**
 * Zarząd — zdjęcia (kadr 4:5). public/photos/zarzad/01.jpg …
 *
 * Dopóki nie ma prawdziwych zdjęć, lista jest PUSTA — `PersonCard` pokazuje
 * wtedy inicjały (`InitialsAvatar`). Świadomie NIE podstawiamy tu zdjęć
 * stockowych: przy prawdziwych nazwiskach członków Zarządu twarze obcych osób
 * wyglądają na nieukończone i wprowadzają w błąd.
 */
export const boardPhotos: string[] = USE_LOCAL.zarzad ? localList("zarzad", 7) : [];

/** RUSS — zdjęcia (kadr 4:5). public/photos/russ/01.jpg … Bez zdjęć → inicjały (jak wyżej). */
export const russPhotos: string[] = USE_LOCAL.russ ? localList("russ", 15) : [];

const projectFallbacks: Record<string, string[]> = {
  adapciak: ["/photos/hero/05.webp"],
  bal: ["/photos/hero/02.webp"],
  dni: ["/photos/hero/01.webp", "/photos/hero/03.webp"],
  party: ["/photos/hero/04.webp"],
};

/**
 * Projekty — fotograficzny rozdział, nie miniatura karty.
 *
 * Docelowo każdy projekt ma cover i dwa detale:
 * public/photos/projekty/<klucz>/cover.jpg
 * public/photos/projekty/<klucz>/detail-01.jpg
 * public/photos/projekty/<klucz>/detail-02.jpg
 *
 * Do czasu skompletowania galerii wykorzystujemy wyłącznie prawdziwe zdjęcia
 * SSUEW obecne już w hero. Brak zdjęcia uruchamia typograficzny plakat projektu,
 * nigdy stockową fotografię udającą konkretne wydarzenie.
 */
export const projectPhotos = (key: string): string[] =>
  USE_LOCAL.projekty
    ? [
        `/photos/projekty/${key}/cover.jpg`,
        `/photos/projekty/${key}/detail-01.jpg`,
        `/photos/projekty/${key}/detail-02.jpg`,
      ]
    : (projectFallbacks[key] ?? []);

/**
 * Czy zdjęcia pokazują TEN projekt, czy są tylko zastępnikiem z archiwum hero.
 *
 * Rozróżnienie jest potrzebne, bo od niego zależy opis alternatywny. Kadr z
 * hero jest prawdziwym zdjęciem Samorządu, ale nie przedstawia uczestników
 * konkretnego wydarzenia — podpisanie go „Uczestnicy projektu Adapciak" byłoby
 * nieprawdą wobec osoby, która widzi wyłącznie ten opis.
 */
export const projectPhotosAreAuthentic = (): boolean => USE_LOCAL.projekty;

/** Wsteczna kompatybilność dla miejsc, które potrzebują tylko coveru. */
export const projectPhoto = (key: string): string | undefined => projectPhotos(key)[0];
