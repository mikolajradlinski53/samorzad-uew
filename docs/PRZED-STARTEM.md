# Przed startem — checklista go-live

Strona jest gotowa technicznie (dwujęzyczna, WCAG AA+AAA, SEO, analityka,
logowanie działaczy, wszystkie podstrony). Poniżej zebrane wszystko, co zależy
od Ciebie, żeby ruszyć „na ostro". Legenda: ☐ do zrobienia.

---

## 1. Zmienne środowiskowe (Vercel → Settings → Environment Variables)
Szczegóły i instrukcje krok po kroku: [`docs/ENV.md`](ENV.md).

- ☐ `RESEND_API_KEY` — formularz kontaktowy realnie wysyła maile
- ☐ `EVENTS_SHEET_CSV_URL` — kalendarz „nasze wydarzenia" z Google Sheets
- ☐ `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` + `AUTH_SECRET` — logowanie działaczy (Strefa działacza)
- ☐ (po dodaniu kluczy) **Redeploy**

## 2. Analityka
- ☐ Vercel → zakładka **Analytics → Enable** (kod już wpięty, baner zgody działa)

## 3. Treści i pliki
- ☐ **Zdjęcia hero** — wrzuć ponownie oryginały do `public/photos/hero/`, dam znać → przekadruję (obecne są źle kadrowane, bo oryginały skasowałem przy optymalizacji)
- ☐ **Pozostałe zdjęcia** — `public/photos/{zycie,zarzad,russ,projekty}/` + włącz w `src/lib/photos.ts` (`USE_LOCAL`)
- ☐ **Logo partnerów** — `public/partnerzy/` + wpisy w `src/lib/partners.ts`
- ☐ **Dokumenty (PDF)** — `public/dokumenty/` + ścieżki w `src/lib/documents.ts` (regulaminy, zarządzenia, sprawozdania, regulamin finansowania, księga identyfikacji, mapa, stypendia, uchwały)
- ☐ **Dane do uzupełnienia w plikach `src/lib/`:**
  - `recruitment.ts` — otwarte rekrutacje
  - `organizations.ts` — katalog organizacji studenckich
  - `people.ts` → `russMeetings` — terminy posiedzeń RUSS
  - `calendar.ts` → `universityCalendarEmbedUrl` — kalendarz uczelniany (embed Google)
  - `panel.ts` — adresy kafelków po zalogowaniu (CRA = crmp-system, RadaStudentów24, …)
- ☐ **Polityka prywatności** — przejrzyj treść (`messages/*.json` → `prywatnosc.sections`) pod kątem prawnym

## 4. Domena i SEO
- ☐ Podłącz docelową domenę w Vercel (jeśli inna niż `*.vercel.app`)
- ☐ Po ustawieniu domeny sprawdź, że `SITE_URL` w kodzie zgadza się z produkcyjną (sitemap/OG/JSON-LD) — `src/app/[locale]/layout.tsx`, `src/app/sitemap.ts`, `src/components/Breadcrumbs.tsx`
- ☐ Google Search Console — dodaj domenę i prześlij `/sitemap.xml`

## 5. Szybka weryfikacja na żywo
- ☐ Przełącznik PL/EN na kilku stronach
- ☐ Formularz kontaktowy (wysyłka testowa)
- ☐ Logowanie działacza (Google) + panel z kafelkami
- ☐ Baner cookies (Akceptuję / Tylko niezbędne)
- ☐ Tryb jasny/ciemny, widok mobilny

---

Gdy odhaczysz „swoje" rzeczy, daj znać — przełączę flagi/przekadruję zdjęcia
i zweryfikuję całość.
