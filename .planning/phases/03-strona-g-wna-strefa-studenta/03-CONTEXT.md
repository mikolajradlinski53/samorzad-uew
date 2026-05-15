# Phase 3: Strona Główna + Strefa Studenta — Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Source:** Brief + research samorzad.ue.wroc.pl

<domain>
## Phase Boundary

Budowa strony głównej (`/`) z hero, animowanymi statystykami i sekcją "O nas" oraz wszystkich podstron Strefy Studenta (`/dla-studenta`, `/prawa-studenta`, `/infopacki`, `/rzecznik-praw-studenta`, `/stypendia`, `/mapa-kampusu`, `/wladze-rektorskie`, `/dziekan-i-prodziekani`, `/prawo-dla-studenta`, `/pomoc-psychologiczna`, `/ankiety-dydaktyczne`).

Każda strona to Next.js App Router page.tsx w folderze `app/(public)/`. Komponenty wielokrotnego użytku (TileCard, Accordion, MemberCard, DocumentList) tworzone w `components/sections/` i `components/cards/`.

**Nie wchodzi w scope Phase 3:**
- Samorząd, Zarząd, RUSS, Projekty — to Phase 4
- Formularze przez API routes — to Phase 5 (formularz Rzecznika to Phase 3, ale tylko UI, bez POST)
- Strona `/aktualnosci` (blog) — pominięta w briefie jako osobna decyzja

</domain>

<decisions>
## Implementation Decisions

### Struktura katalogów
```
app/
  (public)/            # route group — nie wpływa na URL
    page.tsx           # / (strona główna)
    dla-studenta/
      page.tsx
    prawa-studenta/
      page.tsx
    infopacki/
      page.tsx
    rzecznik-praw-studenta/
      page.tsx
    stypendia/
      page.tsx
    mapa-kampusu/
      page.tsx
    wladze-rektorskie/
      page.tsx
    dziekan-i-prodziekani/
      page.tsx
    prawo-dla-studenta/
      page.tsx
    pomoc-psychologiczna/
      page.tsx
    ankiety-dydaktyczne/
      page.tsx
components/
  sections/
    HeroSection.tsx     # Hero z rotating text
    StatsSection.tsx    # Animated counters
    AboutSection.tsx    # "O nas" tekst
    TileGrid.tsx        # Siatka kafelków
    QuickLinks.tsx      # Szybkie linki zewnętrzne
    Accordion.tsx       # Rozwijane sekcje (prawa studenta)
    DocumentList.tsx    # Lista PDF/GDrive linków
  cards/
    TileCard.tsx        # Kafelek z ikoną i tytułem
    MemberCard.tsx      # Karta osoby (Rzecznik)
data/
  student-zone.ts      # Linki szybkie (USOS, Intranet, Plan)
  infopacki.ts         # 8 linków GDrive
  prawa-studenta.ts    # 7 praw studenta
  stypendia.ts         # Kafelki + 10 załączników GDrive
```

### Animacje
- **Hero rotating text:** `AnimatePresence` + `motion.span` z `key={currentIndex}` — zmiana co 3s
- **Animated counters:** `useEffect` + `requestAnimationFrame` wyzwalany przez `IntersectionObserver` lub `whileInView` z Framer Motion
- **FadeUp sekcje:** używać `<FadeUp>` komponentu z Phase 2 na wszystkich sekcjach
- **Accordion:** `AnimatePresence` + `motion.div` height animation dla płynnego otwierania

### Strona główna — treść
**Hero H1:** `SAMORZĄD STUDENTÓW UNIWERSYTETU EKONOMICZNEGO WE WROCŁAWIU`
**Rotating subtitles (co 3s):**
- "Działamy na rzecz studentów"
- "Wspieramy Was w walce o prawa studenckie"
- "Inspirujemy do podejmowania nowych inicjatyw"

**CTA buttons:**
- Primary: "Poznaj nasz samorząd" → `/nasza-dzialalnosc`
- Secondary (outline): "Strefa Studenta" → `/dla-studenta`

**Social icons:** TikTok, Facebook, LinkedIn, Instagram (z data/social.ts)

**Sekcja "O nas" — tekst dosłowny:**
> Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu to reprezentacja wszystkich studentów UEW. Działamy na rzecz społeczności akademickiej, dbamy o interesy studentów, współtworzymy życie uczelni oraz inicjujemy projekty edukacyjne, społeczne i integracyjne. Jesteśmy łącznikiem między studentami a władzami uczelni i realnie wpływamy na to, jak studiuje się na UEW.

**Statystyki (animowane liczniki):**
| Liczba | Opis |
|--------|------|
| 6000 | Studentów UEW |
| 9 | Projektów rocznie |
| 30 | Lat działalności |
| 15 | Partnerów |

### Strefa Studenta — `/dla-studenta`

**Intro tekst:**
> W tym miejscu znajdziesz wszystkie najważniejsze informacje, jakie mogą Ci się przydać w codziennym życiu na UEW. Kliknij w poniższe kafelki, żeby przenieść się do właściwej strony.

**10 kafelków TileGrid (ikona Lucide + tytuł + href):**
| Kafelek | Ikona Lucide | URL |
|---------|-------------|-----|
| PRAWA STUDENTA | `Scale` | /prawa-studenta |
| WŁADZE REKTORSKIE | `Building2` | /wladze-rektorskie |
| RZECZNIK PRAW STUDENTA | `Shield` | /rzecznik-praw-studenta |
| ANKIETY DYDAKTYCZNE | `ClipboardList` | /ankiety-dydaktyczne |
| STYPENDIA | `GraduationCap` | /stypendia |
| MAPA KAMPUSU | `Map` | /mapa-kampusu |
| PRAWO DLA STUDENTA | `BookOpen` | /prawo-dla-studenta |
| DZIEKAN I PRODZIEKANI | `Users` | /dziekan-i-prodziekani |
| INFOPACKI | `Info` | /infopacki |
| POMOC PSYCHOLOGICZNA | `Heart` | /pomoc-psychologiczna |

**Szybkie linki (QuickLinks — otwierają w nowej karcie):**
| Tekst | URL |
|-------|-----|
| USOS | https://usosweb.ue.wroc.pl/kontroler.php?_action=news/default |
| INTRANET | https://uewrc.sharepoint.com/sites/IntranetUEW |
| PLAN ZAJĘĆ | https://plan.ue.wroc.pl |
| HARMONOGRAM ROKU AKADEMICKIEGO | https://bip.ue.wroc.pl/download/attachment/3456/harmonogram-roku-akademickiego-2025-2026.pdf |

### Prawa Studenta — `/prawa-studenta`

**Intro:**
> Dzięki Ustawie 2.0 (Konstytucja dla Nauki) każdy student ma prawo do przeszkolenia w zakresie swoich praw i obowiązków. Za organizację i prowadzenie tego szkolenia odpowiedzialny jest samorząd studencki, we współpracy z Parlamentem Studentów Rzeczypospolitej Polskiej.

**7 praw (akordeon):**
1. **Powtarzania zajęć** — Student ma prawo do powtarzania określonych zajęć w przypadku niezadowalających wyników w nauce, z zastrzeżeniem warunków określonych w regulaminie uczelni.
2. **Indywidualnej organizacji studiów** — ubieganie się o IOS, elastyczne dostosowanie programu.
3. **Usprawiedliwienia nieobecności** — prawo do usprawiedliwienia nieobecności i urlopu od zajęć, przystąpienia do egzaminów w innym terminie.
4. **Zmiany kierunku studiów** — możliwość zmiany przy zachowaniu procedur.
5. **Przenoszenia i uznawania punktów ECTS** — krajowych i zagranicznych, zgodnie z zasadami mobilności akademickiej.
6. **Egzaminu komisyjnego** — przy udziale wskazanego przez studenta obserwatora.
7. **Zmiany trybu studiów** — przeniesienie między studiami stacjonarnymi a niestacjonarnymi.

**Link zewnętrzny:** [Ustawa PSW](https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20180001668/U/D20181668Lj.pdf)
**Przycisk "WRÓĆ":** → /dla-studenta

### Infopacki — `/infopacki`

**Intro:**
> W tym miejscu znajdziesz przygotowane dla studentów naszej uczelni infopacki. Pozwalają one na zrozumienie działania różnych regulaminów, podań oraz na swobodne poruszanie się w przestrzeni online na naszym uniwersytecie.

**8 infopacków (linki GDrive — otwierają w nowej karcie):**
| Tytuł | Link |
|-------|------|
| Jak poruszać się po systemie USOS? | https://drive.google.com/file/d/1EmTBHP5GzLrHBA782SBg82rnelb4PD7i/view |
| Jakie najważniejsze zasady zawiera Uczelniany Regulamin Studiów? | https://drive.google.com/file/d/1QcyoxoV15SJGrvKKONtn0JGFutQ5gRZ1/view |
| Jakie są zasady zaliczenia semestru? | https://drive.google.com/file/d/1R1mXDt8745vC98J_FBJ5UoKjwMbw4NYA/view |
| Jakie ważne informacje warto znać od Władz Dziekańskich? | https://drive.google.com/file/d/1NLQRVebkTqXDCxcsmY7tSwc7JHApDyw9/view |
| Jak, gdzie i kiedy składać uczelniane podania? | https://drive.google.com/file/d/1X5muhuWdgbxlOK1cgLz4fczzaKJwSFAC/view |
| Jak korzystać z biblioteki i systemu bibliotecznego? | https://drive.google.com/file/d/1R_yZHW5UIIzWerNAlpYp5FOw8p6DHC9N/view |
| Jak zaangażować się w życie studenckie poza zajęciami? | https://drive.google.com/file/d/1GoMBj_CEFF6ri83ZbED4OocGOKzv8Uot/view |
| Jak przebiega proces dyplomowania? | https://drive.google.com/file/d/1QPCho3YZIPYvn3Nv9rmZBKd0GkC5Byhs/view |

**CTA:** "Jeżeli nie znalazłeś odpowiedzi na swoje pytanie zapraszamy do kontaktu!" → `/formularz`

### Rzecznik Praw Studenta — `/rzecznik-praw-studenta`

**Dane Rzecznika:**
- Imię i nazwisko: **Jakub Buchta**
- Stanowisko: Rzecznik Praw Studenta
- E-mail: rps@samorzad.ue.wroc.pl
- Zdjęcie: placeholder (awatar inicjałowy "JB")

**Opis funkcji:**
> Rzecznik Praw Studenta wspiera studentów w interpretacji przepisów i jest reprezentantem studentów w kontakcie z odpowiednimi jednostkami administracyjnymi uczelni.

**Sekcja CZYM SIĘ ZAJMUJĘ:**
- Pomoc w interpretacji przepisów i regulaminów uczelni.
- Wsparcie w sytuacjach niesprawiedliwości, gdy kontakt z dziekanatem, prodziekanem lub innymi jednostkami nie przyniósł rozwiązania.
- Konsultacje w trudnych przypadkach, dotyczących praw i obowiązków studenta.
- Wskazanie odpowiednich zasobów informacyjnych dostępnych na stronie Uczelni lub Samorządu Studentów.

**Sekcja JAK MOGĘ CI POMÓC:**
> Jeśli: nie wiesz, jak interpretować regulamin / nie udało Ci się rozwiązać sprawy w dziekanacie / masz wątpliwości co do swoich praw jako studenta — NAPISZ DO MNIE!

**Sekcja WAŻNE:**
> Zanim się skontaktujesz, zapoznaj się z INFOPACKAMI oraz [REGULAMINEM STUDIÓW](https://uew.pl/wp-content/uploads/2024/10/UCHWALA-SENATU-NR-R.0000.18.2024-Regulamin-Studiow.pdf)

**Formularz (UI tylko — bez POST w Phase 3):**
- Dropdown: "Wybierz problem" (Regulamin studiów, Dziekanat, Prawa studenta, Inne)
- Textarea: opis problemu
- Input: email kontaktowy
- Button: "Prześlij" (Phase 5 podłączy POST do /api/formularz)

### Stypendia — `/stypendia`

**Intro:**
> W tym miejscu znajdziesz kluczowe informacje dotyczące aktualności stypendiów a także wszystkie niezbędne dokumenty.

**Link do aktualności:** https://uew.pl/kandydaci/wsparcie-finansowe-dla-studentow/

**Opis:**
> Podczas studiów możesz skorzystać z różnych form wsparcia finansowego oferowanych przez uczelnię. Obejmują one zarówno świadczenia dla studentów znajdujących się w trudniejszej sytuacji materialnej, jak i stypendia przyznawane za bardzo dobre wyniki w nauce oraz osiągnięcia naukowe, sportowe lub artystyczne.

**4 kafelki (linki do podstron — te podstrony są placeholder w Phase 3):**
| Tekst | URL |
|-------|-----|
| SOCJALNE | /stypendia-socjalne |
| REKTORA | /stypendia-rektora |
| DLA NIEPEŁNOSPRAWNYCH | /stypendia-dla-niepelnosprawnych |
| ZAPOMOGI | /zapomoga |

**10 załączników (linki GDrive):**
| Nr | Opis | Link |
|----|------|------|
| Zał. 1 | Wykaz dokumentacji przy ubieganiu się o stypendium socjalne | https://drive.google.com/file/d/18eMIfTCKHe2VkeNhqpbcnE2_dnEfzpv8/view |
| Zał. 2 | Zasady obliczania dochodu w rodzinie studenta | https://drive.google.com/file/d/1sUkRyknAvDzJAu5WsbBGTuAZDF_ZLSC5/view |
| Zał. 3 | Zasady oceny osiągnięć naukowych/artystycznych/sportowych | https://drive.google.com/file/d/1ym8hSvH1DNQQfn5TyraKY...(abbreviated — use actual URL from brief) | 
| Zał. 3 | Zasady oceny osiągnięć do stypendium rektora | https://drive.google.com/file/d/1ym8hSvH1DNQQfn5TyraKYB7oOeLp3ujJ/view |
| Zał. 4 | Dane do wyznaczania stypendiów | https://drive.google.com/file/d/12ZNO2gfq3WHVM5YFSF7EIfImueUJV0-f/view |
| Zał. 5 | Oświadczenia do stypendium socjalnego | https://drive.google.com/file/d/1wINSrsZjdD1y-Mcq7R7g8TvU4yLhJHR6/view |
| Zał. 6 | Kwestionariusz rejestracyjny studenta z orzeczoną niepełnosprawnością | https://drive.google.com/file/d/1PJA2Y43M5ubTk0e_yLQiTdS_vP-0PSzm/view |
| Zał. 7 | Zasady zakwaterowania w domach studenckich | https://drive.google.com/file/d/1mncNxNd0vN4lx70GNbBqzFHuuGMA_Xo/view |
| Zał. 8 | Oświadczenie o braku zmiany sytuacji materialnej | https://drive.google.com/file/d/1nLdfEub6IrCZmyU789Ph82greUVmEQRf/view |
| Zał. 9 | Oświadczenie dot. nie prowadzenia gospodarstwa z rodzicami | https://drive.google.com/file/d/1-MDxZO8_It7JvGJkbvvWjqPm8oiQXsH9/view |
| Zał. 10 | Wzór zgody i klauzuli informacyjnej | https://drive.google.com/file/d/12ZNO2gfq3WHVM5YFSF7EIfImueUJV0-f/view |

### Pozostałe podstrony (stub pages w Phase 3)

Mapa Kampusu (`/mapa-kampusu`), Władze Rektorskie (`/wladze-rektorskie`), Dziekan i Prodziekani (`/dziekan-i-prodziekani`), Prawo dla Studenta (`/prawo-dla-studenta`), Pomoc Psychologiczna (`/pomoc-psychologiczna`), Ankiety Dydaktyczne (`/ankiety-dydaktyczne`) — budowane jako **stub pages** z:
- Nagłówek strony
- Krótka informacja "Treść wkrótce"
- Przycisk "WRÓĆ" → /dla-studenta

Mapa kampusu może zawierać embed Google Maps: UEW, ul. Komandorska 118-120, Wrocław.

### Claude's Discretion
- Dokładna implementacja animated counter (RAF + IntersectionObserver lub Framer Motion whileInView callback)
- Layout hero — kolumna czy pełna szerokość
- Styl TileCard (hover, shadow, border)
- Styl DocumentList (ikona pliku, layout tabeli vs listy)
- Styl MemberCard dla Rzecznika (poziomy vs pionowy)

</decisions>

<canonical_refs>
## Canonical References

- `.planning/PROJECT.md` — stack, constraints
- `.planning/ROADMAP.md` — phase goals
- `CLAUDE.md` — project guidelines
- `.planning/phases/02-next-js-foundation/02-UI-SPEC.md` — design tokens, spacing, typography
- `components/ui/FadeUp.tsx` — scroll animation component (use everywhere)
- `components/ui/Button.tsx` — button variants
- `data/social.ts` — social links for hero section
- `tailwind.config.js` — all CSS tokens

</canonical_refs>

<specifics>
## Specific Implementation Notes

**Animated counter pattern:**
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (!isInView) return
    const duration = 1800
    const start = Date.now()
    const raf = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // cubic ease-out
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [isInView, target])
  
  return <span ref={ref}>{count}{suffix}</span>
}
```

**Hero rotating text pattern:**
```tsx
'use client'
import { AnimatePresence, motion } from 'motion/react'
import { useState, useEffect } from 'react'

const subtitles = [
  'Działamy na rzecz studentów',
  'Wspieramy Was w walce o prawa studenckie', 
  'Inspirujemy do podejmowania nowych inicjatyw',
]

// Swap every 3000ms with AnimatePresence exit/enter animation
```

**Static export + /dla-studenta route group:**
All pages are Server Components (no 'use client') unless they need state (Counter, Accordion, Hero rotating text).

</specifics>

<deferred>
## Deferred

- Podstrony stypendii (/stypendia-socjalne, /stypendia-rektora itd.) — Phase 3 buduje tylko stubs lub pomija
- Prawdziwe zdjęcia Jakuba Buchty — placeholder awatar inicjałowy "JB"
- Realny formularz Rzecznika (POST) — Phase 5
- Sekcja "Kalendarz Wydarzeń" na stronie głównej — Phase 3 pomija lub placeholder
- Blog/aktualności

</deferred>

---

*Phase: 03-strona-g-wna-strefa-studenta*
*Context gathered: 2026-05-15 via Brief + research*
