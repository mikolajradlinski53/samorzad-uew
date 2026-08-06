/**
 * Slot na publikacje serii „Debiuty Studenckie" (drop-in jak people.ts /
 * videos.ts). Wpisy poniżej to PLACEHOLDERY DO WERYFIKACJI — tytuły, autorów,
 * ISBN i linki trzeba potwierdzić w Wydawnictwie UEW, zanim strona pójdzie
 * na produkcję z prawdziwą treścią. Do usunięcia/zastąpienia realnymi
 * danymi — patrz docs/WRZUC-TUTAJ.md.
 *
 * Każdy wpis to jeden artykuł/rozdział wydany w serii. `circle` to koło
 * naukowe autora/autorów (opcjonalne — nie każdy tekst powstaje w kole).
 * `url` powinien wskazywać na pełny tekst lub stronę wydawnictwa, jeśli
 * jest dostępny w otwartym dostępie (seria jest CC BY-SA 4.0).
 */
export interface Publication {
  title: string;
  authors: string[];
  year: number;
  /** Koło naukowe, w którym powstał tekst (jeśli dotyczy). */
  circle?: string;
  isbn?: string;
  /** Pełny tekst / strona wydawnictwa. */
  url?: string;
  abstract?: string;
}

export const publications: Publication[] = [
  // PLACEHOLDER — DO WERYFIKACJI. Zastąp prawdziwym tytułem/autorami/ISBN
  // z Wydawnictwa UEW.
  {
    title: "Zrównoważony rozwój w strategiach polskich przedsiębiorstw — analiza wybranych przypadków",
    authors: ["Kowalski, J."],
    year: 2024,
    circle: "Koło Naukowe Zarządzania Strategicznego",
    isbn: "978-83-XXXX-XXX-X",
    abstract:
      "Artykuł analizuje, jak polskie przedsiębiorstwa wdrażają cele zrównoważonego rozwoju w swoich strategiach, na podstawie wybranych studiów przypadku.",
  },
  // PLACEHOLDER — DO WERYFIKACJI.
  {
    title: "Wpływ inflacji na decyzje konsumenckie studentów — badanie empiryczne",
    authors: ["Nowak, A.", "Wiśniewska, K."],
    year: 2023,
    circle: "Koło Naukowe Ekonomii Behawioralnej",
    isbn: "978-83-XXXX-XXX-Y",
    url: "https://www.wydawnictwo.ue.wroc.pl/",
    abstract:
      "Praca prezentuje wyniki badania ankietowego dotyczącego wpływu wysokiej inflacji na wzorce konsumpcji wśród studentów wrocławskich uczelni.",
  },
  // PLACEHOLDER — DO WERYFIKACJI.
  {
    title: "Startupy technologiczne w regionie dolnośląskim — bariery i czynniki sukcesu",
    authors: ["Zielińska, M.", "Dąbrowski, P.", "Lewandowski, T."],
    year: 2024,
    circle: "Koło Naukowe Przedsiębiorczości",
    abstract:
      "Tekst identyfikuje najważniejsze bariery rozwoju startupów technologicznych na Dolnym Śląsku oraz czynniki, które sprzyjają ich sukcesowi rynkowemu.",
  },
];

/**
 * Cytowanie w stylu zbliżonym do APA (wersja polska), zgodne z konwencją
 * serii: Autorzy (rok). Tytuł. Debiuty Studenckie. Wydawnictwo Uniwersytetu
 * Ekonomicznego we Wrocławiu. [ISBN …]
 */
export function formatCitation(p: Publication): string {
  const authors = p.authors.join(", ");
  const base = `${authors} (${p.year}). ${p.title}. Debiuty Studenckie. Wydawnictwo Uniwersytetu Ekonomicznego we Wrocławiu.`;
  return p.isbn ? `${base} ISBN ${p.isbn}.` : base;
}
