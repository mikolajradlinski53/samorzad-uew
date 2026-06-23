/**
 * Statyczny indeks stron na potrzeby wyszukiwarki (command palette).
 * Każdy wpis ma etykietę/grupę/słowa kluczowe w obu językach (PL/EN); `keywords`
 * zawiera synonimy/odmiany, żeby trafiać mimo innego słowa niż w tytule.
 */

type Locale = "pl" | "en";

interface SearchSource {
  href: string;
  group: Record<Locale, string>;
  label: Record<Locale, string>;
  keywords: Record<Locale, string>;
}

const G = {
  student: { pl: "Strefa studenta", en: "Student zone" },
  samorzad: { pl: "Samorząd", en: "Student Government" },
  wspolpraca: { pl: "Współpraca", en: "Partnership" },
  ogolne: { pl: "Ogólne", en: "General" },
};

const sources: SearchSource[] = [
  // Strefa studenta
  { href: "/dla-studenta", group: G.student, label: { pl: "Strefa studenta", en: "Student zone" }, keywords: { pl: "dla studenta hub tematy", en: "student zone hub topics" } },
  { href: "/prawa-studenta", group: G.student, label: { pl: "Prawa studenta", en: "Student rights" }, keywords: { pl: "ustawa 2.0 prawo egzamin ios", en: "act rights exam ios board" } },
  { href: "/stypendia", group: G.student, label: { pl: "Stypendia", en: "Scholarships" }, keywords: { pl: "pieniądze wsparcie świadczenia rodzaje", en: "money support benefits types" } },
  { href: "/stypendia-socjalne", group: G.student, label: { pl: "Stypendium socjalne", en: "Social scholarship" }, keywords: { pl: "dochód pomoc materialna usosweb", en: "income financial aid usosweb" } },
  { href: "/stypendia-rektora", group: G.student, label: { pl: "Stypendium rektora", en: "Rector’s scholarship" }, keywords: { pl: "wyniki nauka osiągnięcia najlepsi", en: "results merit achievements best" } },
  { href: "/stypendia-dla-niepelnosprawnych", group: G.student, label: { pl: "Stypendium dla osób z niepełnosprawnością", en: "Disability scholarship" }, keywords: { pl: "orzeczenie niepełnosprawność", en: "disability certificate" } },
  { href: "/zapomoga", group: G.student, label: { pl: "Zapomoga", en: "Hardship grant" }, keywords: { pl: "jednorazowa pomoc sytuacja losowa", en: "one-off help emergency situation" } },
  { href: "/wsparcie-materialne-i-swiadczenia", group: G.student, label: { pl: "Wsparcie materialne i świadczenia", en: "Financial support and benefits" }, keywords: { pl: "pomoc finansowa fundusz przegląd", en: "financial aid fund overview" } },
  { href: "/prawo-dla-studenta", group: G.student, label: { pl: "Prawo dla studenta", en: "Law for students" }, keywords: { pl: "regulaminy przepisy zarządzenia", en: "regulations rules orders" } },
  { href: "/infopacki", group: G.student, label: { pl: "Infopacki", en: "Infopacks" }, keywords: { pl: "pakiety informacje pdf poradnik", en: "packs information pdf guide" } },
  { href: "/rzecznik-praw-studenta", group: G.student, label: { pl: "Rzecznik Praw Studenta", en: "Student Ombudsman" }, keywords: { pl: "spór uczelnia obrona buchta", en: "dispute university defense ombudsman" } },
  { href: "/mapa-kampusu", group: G.student, label: { pl: "Mapa kampusu", en: "Campus map" }, keywords: { pl: "budynki sale lokalizacja dojazd", en: "buildings rooms location directions" } },
  { href: "/pomoc-psychologiczna", group: G.student, label: { pl: "Pomoc psychologiczna", en: "Psychological support" }, keywords: { pl: "wsparcie kryzys telefon zaufania zdrowie psychiczne", en: "support crisis helpline mental health" } },
  { href: "/wladze-rektorskie", group: G.student, label: { pl: "Władze rektorskie", en: "University authorities" }, keywords: { pl: "rektor prorektor uczelnia", en: "rector vice-rector university" } },
  { href: "/dziekan-i-prodziekani", group: G.student, label: { pl: "Dziekan i prodziekani", en: "Dean & vice-deans" }, keywords: { pl: "dziekanat kierunek prodziekan", en: "dean office field vice-dean" } },

  // Samorząd
  { href: "/nasza-dzialalnosc", group: G.samorzad, label: { pl: "Nasza działalność", en: "Our activities" }, keywords: { pl: "samorząd organy działalność", en: "student government bodies activities" } },
  { href: "/nasze-projekty", group: G.samorzad, label: { pl: "Nasze projekty", en: "Our projects" }, keywords: { pl: "wydarzenia inicjatywy eventy", en: "events initiatives" } },
  { href: "/struktura-samorzadu", group: G.samorzad, label: { pl: "Struktura Samorządu", en: "Government structure" }, keywords: { pl: "organy schemat organizacja", en: "bodies chart organisation" } },
  { href: "/przewodniczacy-i-wiceprzewodniczacy", group: G.samorzad, label: { pl: "Przewodniczący i Wiceprzewodniczący", en: "Chair & Vice-chairs" }, keywords: { pl: "kierownictwo zarząd reprezentant kontakt", en: "leadership board representative contact" } },
  { href: "/rada-uczelniana-samorzadu-studentow", group: G.samorzad, label: { pl: "Rada Uczelniana Samorządu (RUSS)", en: "University Council (RUSS)" }, keywords: { pl: "russ uchwałodawczy rada", en: "russ legislative council" } },
  { href: "/studencka-komisja-wyborcza", group: G.samorzad, label: { pl: "Studencka Komisja Wyborcza", en: "Student Electoral Committee" }, keywords: { pl: "skw wybory głosowanie", en: "skw elections voting" } },
  { href: "/regulacje-wewnetrzne", group: G.samorzad, label: { pl: "Regulacje wewnętrzne", en: "Internal regulations" }, keywords: { pl: "regulaminy dokumenty akty", en: "regulations documents acts" } },
  { href: "/zarzadzenia-przewodniczacego", group: G.samorzad, label: { pl: "Zarządzenia Przewodniczącej", en: "Chair’s orders" }, keywords: { pl: "akty wykonawcze dokumenty kadencja", en: "executive acts documents term" } },

  // Współpraca
  { href: "/partnerzy", group: G.wspolpraca, label: { pl: "Partnerzy", en: "Partners" }, keywords: { pl: "sponsorzy firmy współpraca biznes", en: "sponsors companies cooperation business" } },
  { href: "/wspolpracuj-z-nami", group: G.wspolpraca, label: { pl: "Współpracuj z nami", en: "Work with us" }, keywords: { pl: "oferta partnerstwo b2b kontakt firma", en: "offer partnership b2b contact company" } },

  // Ogólne
  { href: "/", group: G.ogolne, label: { pl: "Strona główna", en: "Home" }, keywords: { pl: "home start", en: "home start" } },
  { href: "/kontakt", group: G.ogolne, label: { pl: "Kontakt", en: "Contact" }, keywords: { pl: "adres email formularz napisz", en: "address email form write" } },
];

/** Stable list of routes (href only) — used by sitemap.ts. */
export const searchIndex = sources;

export interface SearchEntry {
  label: string;
  href: string;
  group: string;
  keywords: string;
}

const toLocale = (l: string): Locale => (l === "en" ? "en" : "pl");

function resolve(s: SearchSource, loc: Locale): SearchEntry {
  return { label: s.label[loc], href: s.href, group: s.group[loc], keywords: s.keywords[loc] };
}

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

export function searchPages(query: string, locale: string): SearchEntry[] {
  const index = sources.map((s) => resolve(s, toLocale(locale)));
  const q = deaccent(query.trim());
  if (!q) return index;
  const terms = q.split(/\s+/);
  return index.filter((entry) => {
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
