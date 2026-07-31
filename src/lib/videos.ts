/**
 * Slot na filmy (drop-in jak people.ts). Klucz → film. Brak wpisu = sekcja
 * wideo się nie renderuje. `titleKey` to klucz i18n w namespace danej strony.
 *
 * TU wklejasz prawdziwe ID z YouTube, gdy będą gotowe.
 */
export interface VideoRef {
  youtubeId: string;
  titleKey: string;
}

export const videos: Record<string, VideoRef | undefined> = {
  // "stypendia-wniosek": { youtubeId: "XXXXXXXXXXX", titleKey: "hub.wideoTitle" },
};
