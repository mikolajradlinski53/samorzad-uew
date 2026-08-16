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
  sciana: false, // public/photos/sciana/01.jpg … (WALL_COUNT) — ściana w hero
  zycie: false, // public/photos/zycie/integracja.jpg, wsparcie.jpg
  zarzad: false, // public/photos/zarzad/01.jpg …
  russ: false, // public/photos/russ/01.jpg …
  projekty: false, // public/photos/projekty/<klucz-projektu>.jpg
};

/**
 * Ile zdjęć leży w public/photos/sciana/. Ustaw razem z USE_LOCAL.sciana.
 *
 * 16 to liczba docelowa: cztery kolumny po cztery różne kadry. Poniżej 12
 * powtórzenia zaczynają rzucać się w oczy, bo każda kolumna dubluje swoją
 * listę, żeby pętla nie miała szwu.
 */
const WALL_COUNT = 16;

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

/**
 * Ściana kadrów w hero — zdjęcia PIONOWE, kadr 4:5.
 *
 * Kolumny są wąskie i pionowe, więc kadr poziomy robi się w nich znaczkiem.
 * Ściana jest dodatkowo obrócona w przestrzeni i wygaszona maską po brzegach —
 * dlatego twarze nie mogą siedzieć przy krawędzi zdjęcia, bo te obszary znikają.
 *
 * Dopóki nie ma dedykowanego kompletu, używamy prawdziwych kadrów SSUEW z hero.
 * Jest ich pięć, więc powtórzenia są widoczne — to stan przejściowy, żeby dało
 * się ocenić układ przed zebraniem materiału, a nie wersja docelowa.
 */
/**
 * Wszystko, co realnie leży w public/photos/hero/.
 *
 * Lista jest JAWNA, a nie generowana przez `localList`, z dwóch powodów:
 * - część plików ma nazwy opisowe zamiast numerów, więc generator ich nie widział
 *   i ściana jechała na pięciu kadrach zamiast dwunastu;
 * - rozszerzenia są różne i pisane RÓŻNĄ WIELKOŚCIĄ LITER (.jpg, .JPG, .JPEG).
 *   Windows tego nie rozróżnia, Linux na produkcji owszem — pomyłka w wielkości
 *   liter działa lokalnie i wywala zdjęcie dopiero po wdrożeniu.
 */
const heroArchive: string[] = [
  "/photos/hero/01.jpg",
  "/photos/hero/bal_1.JPG",
  "/photos/hero/02.jpg",
  "/photos/hero/tedx_1.JPG",
  "/photos/hero/03.jpg",
  "/photos/hero/grad_1.JPEG",
  "/photos/hero/04.jpg",
  "/photos/hero/da_1.JPG",
  "/photos/hero/05.jpg",
  "/photos/hero/tedx_2.JPG",
  "/photos/hero/inne_1.JPG",
  "/photos/hero/grad_2.jpg",
];

export const wallPhotos: string[] = USE_LOCAL.sciana
  ? localList("sciana", WALL_COUNT)
  : heroArchive;

/** Czy ściana ma własny komplet, czy leci na zastępnikach z archiwum hero. */
export const wallPhotosAreFinal = (): boolean => USE_LOCAL.sciana;

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
      integracja: "/photos/hero/02.jpg",
      wsparcie: "/photos/hero/04.jpg",
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
  adapciak: ["/photos/hero/05.jpg"],
  bal: ["/photos/hero/02.jpg"],
  dni: ["/photos/hero/01.jpg", "/photos/hero/03.jpg"],
  party: ["/photos/hero/04.jpg"],
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
