/**
 * Statyczny indeks stron na potrzeby wyszukiwarki (command palette).
 * `keywords` zawiera synonimy/odmiany, żeby trafiać mimo innego słowa niż w tytule.
 */

export interface SearchEntry {
  label: string;
  href: string;
  group: string;
  keywords: string;
}

export const searchIndex: SearchEntry[] = [
  // Strefa studenta
  { label: "Strefa studenta", href: "/dla-studenta", group: "Strefa studenta", keywords: "dla studenta hub tematy" },
  { label: "Prawa studenta", href: "/prawa-studenta", group: "Strefa studenta", keywords: "ustawa 2.0 prawo egzamin ios" },
  { label: "Stypendia", href: "/stypendia", group: "Strefa studenta", keywords: "pieniądze wsparcie świadczenia rodzaje" },
  { label: "Stypendium socjalne", href: "/stypendia-socjalne", group: "Strefa studenta", keywords: "dochód pomoc materialna usosweb" },
  { label: "Stypendium rektora", href: "/stypendia-rektora", group: "Strefa studenta", keywords: "wyniki nauka osiągnięcia najlepsi" },
  { label: "Stypendium dla osób z niepełnosprawnością", href: "/stypendia-dla-niepelnosprawnych", group: "Strefa studenta", keywords: "orzeczenie niepełnosprawność" },
  { label: "Zapomoga", href: "/zapomoga", group: "Strefa studenta", keywords: "jednorazowa pomoc sytuacja losowa" },
  { label: "Wsparcie materialne i świadczenia", href: "/wsparcie-materialne-i-swiadczenia", group: "Strefa studenta", keywords: "pomoc finansowa fundusz przegląd" },
  { label: "Prawo dla studenta", href: "/prawo-dla-studenta", group: "Strefa studenta", keywords: "regulaminy przepisy zarządzenia" },
  { label: "Infopacki", href: "/infopacki", group: "Strefa studenta", keywords: "pakiety informacje pdf poradnik" },
  { label: "Rzecznik Praw Studenta", href: "/rzecznik-praw-studenta", group: "Strefa studenta", keywords: "spór uczelnia obrona buchta" },
  { label: "Mapa kampusu", href: "/mapa-kampusu", group: "Strefa studenta", keywords: "budynki sale lokalizacja dojazd" },
  { label: "Pomoc psychologiczna", href: "/pomoc-psychologiczna", group: "Strefa studenta", keywords: "wsparcie kryzys telefon zaufania zdrowie psychiczne" },
  { label: "Władze rektorskie", href: "/wladze-rektorskie", group: "Strefa studenta", keywords: "rektor prorektor uczelnia" },
  { label: "Dziekan i prodziekani", href: "/dziekan-i-prodziekani", group: "Strefa studenta", keywords: "dziekanat kierunek prodziekan" },

  // Samorząd
  { label: "Nasza działalność", href: "/nasza-dzialalnosc", group: "Samorząd", keywords: "samorząd organy działalność" },
  { label: "Nasze projekty", href: "/nasze-projekty", group: "Samorząd", keywords: "wydarzenia inicjatywy eventy" },
  { label: "Struktura Samorządu", href: "/struktura-samorzadu", group: "Samorząd", keywords: "organy schemat organizacja" },
  { label: "Przewodniczący i Wiceprzewodniczący", href: "/przewodniczacy-i-wiceprzewodniczacy", group: "Samorząd", keywords: "kierownictwo zarząd reprezentant kontakt" },
  { label: "Rada Uczelniana Samorządu (RUSS)", href: "/rada-uczelniana-samorzadu-studentow", group: "Samorząd", keywords: "russ uchwałodawczy rada" },
  { label: "Studencka Komisja Wyborcza", href: "/studencka-komisja-wyborcza", group: "Samorząd", keywords: "skw wybory głosowanie" },
  { label: "Regulacje wewnętrzne", href: "/regulacje-wewnetrzne", group: "Samorząd", keywords: "regulaminy dokumenty akty" },
  { label: "Zarządzenia Przewodniczącej", href: "/zarzadzenia-przewodniczacego", group: "Samorząd", keywords: "akty wykonawcze dokumenty kadencja" },

  // Współpraca
  { label: "Partnerzy", href: "/partnerzy", group: "Współpraca", keywords: "sponsorzy firmy współpraca biznes" },
  { label: "Współpracuj z nami", href: "/wspolpracuj-z-nami", group: "Współpraca", keywords: "oferta partnerstwo b2b kontakt firma" },

  // Ogólne
  { label: "Strona główna", href: "/", group: "Ogólne", keywords: "home start" },
  { label: "Kontakt", href: "/kontakt", group: "Ogólne", keywords: "adres email formularz napisz" },
];

// NFD + strip combining marks handles ą ć ę ó ś ż ź ń, but Polish "ł"/"Ł" do not
// decompose — map them explicitly so "wladze" matches "władze". Each source char
// maps to exactly one output char, so indices stay 1:1 (needed for highlighting).
const deaccent = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .toLowerCase();

export function searchPages(query: string): SearchEntry[] {
  const q = deaccent(query.trim());
  if (!q) return searchIndex;
  const terms = q.split(/\s+/);
  return searchIndex.filter((entry) => {
    const haystack = deaccent(`${entry.label} ${entry.keywords} ${entry.group}`);
    return terms.every((t) => haystack.includes(t));
  });
}

/**
 * Split a label into segments marking which characters matched the query, so the
 * UI can <mark> them. Diacritics-insensitive; relies on deaccent being 1:1 length.
 */
export function highlightSegments(
  label: string,
  query: string,
): { text: string; hit: boolean }[] {
  const q = deaccent(query.trim());
  if (!q) return [{ text: label, hit: false }];
  const terms = [...new Set(q.split(/\s+/).filter(Boolean))];
  const da = deaccent(label);
  const hits = new Array(label.length).fill(false);

  for (const term of terms) {
    let from = da.indexOf(term);
    while (from !== -1) {
      for (let k = from; k < from + term.length; k++) hits[k] = true;
      from = da.indexOf(term, from + term.length);
    }
  }

  const segments: { text: string; hit: boolean }[] = [];
  for (let i = 0; i < label.length; i++) {
    const hit = hits[i];
    const last = segments[segments.length - 1];
    if (last && last.hit === hit) last.text += label[i];
    else segments.push({ text: label[i], hit });
  }
  return segments;
}
