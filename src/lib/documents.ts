/**
 * Manifest dokumentów do pobrania.
 *
 * JAK ODBLOKOWAĆ POBIERANIE: wrzuć plik do `public/dokumenty/...` i wpisz jego
 * ścieżkę w `href` (np. "/dokumenty/regulamin-samorzadu.pdf"). Możesz też podać
 * pełny link do naszego folderu (Drive itp.). Gdy `href` jest ustawione,
 * plakietka „Wkrótce" automatycznie zmienia się w działające pobieranie/link.
 * Pusty `href` = „Wkrótce" (lub przycisk ukryty, zależnie od miejsca).
 *
 * W komentarzach zachowane STARE adresy z Wixa — to źródło do migracji plików
 * (pobierz stamtąd, wrzuć do public/dokumenty/, wstaw lokalną ścieżkę w href).
 */

export interface DocSlot {
  href?: string;
  /** true = link zewnętrzny (target=_blank); pomiń dla plików w public/. */
  external?: boolean;
}

// OLD_FILES (baza starych PDF-ów na Wixie) = https://samorzad.ue.wroc.pl/_files/ugd

export const documents = {
  // Regulacje wewnętrzne (RegulacjeContent). Stare PDF-y na Wixie ↓
  regulacje: {
    government: {} as DocSlot, // old: `${OLD_FILES}/3dec01_e2f5e6255f3a4e02b3486fce9345da3d.pdf`
    ros: {} as DocSlot, //        old: `${OLD_FILES}/3dec01_8e95b203e91e47d1b2a5be489ab3136c.pdf`
    russ: {} as DocSlot, //       old: `${OLD_FILES}/3dec01_f29102abac934f8fbb771a0e0033b71b.pdf`
    residents: {} as DocSlot, //  old: `${OLD_FILES}/3dec01_ce9e1526865444b9a8b2890406b4887e.pdf`
    electoral: {} as DocSlot, //  old: `${OLD_FILES}/3dec01_e1abe35d67a44e9aacecbe501da0d5a1.pdf`
    visual: {} as DocSlot, //     old: `${OLD_FILES}/3dec01_746b01182be140039f8a0930403c0df3.pdf`
  } as Record<string, DocSlot>,

  // Prawo dla studenta (PrawoContent) — karty źródeł. „act" to publiczny ISAP, nie tu.
  prawo: {
    statute: {} as DocSlot, //      old: https://samorzad.ue.wroc.pl/prawo-dla-studenta
    studyReg: {} as DocSlot, //     old: j.w.
    orders: {} as DocSlot, //       old: j.w.
    deanLetters: {} as DocSlot, //  old: j.w.
    orgReg: {} as DocSlot, //       old: j.w.
  } as Record<string, DocSlot>,

  // Zarządzenia Przewodniczącej — folder/komplet (ZarzadzeniaContent).
  // old: { href: "https://samorzad.ue.wroc.pl/zarzadzenia-przewodniczacego", external: true }
  zarzadzenia: {} as DocSlot,

  // Standalone — przyciski pojawią się ponownie, gdy ustawisz href.
  // old: https://samorzad.ue.wroc.pl/stypendia
  stypendiaAll: {} as DocSlot,
  // old: https://samorzad.ue.wroc.pl/mapa-kampusu
  mapa: {} as DocSlot,
  // old: https://samorzad.ue.wroc.pl/rada-uczelniana-samorzadu-studentow
  russResolutions: {} as DocSlot,
  // old: https://samorzad.ue.wroc.pl/studencka-komisja-wyborcza
  skwResolutions: {} as DocSlot,
};
