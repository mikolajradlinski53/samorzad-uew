# Materiały do zebrania — Faza „Content & Assets"

Checklista dla **Twojego** toru (zbieranie). Każda pozycja ma dokładne miejsce
docelowe. Mój tor (kod) buduje „gniazda", więc gdy wrzucisz materiał we
wskazane miejsce / podeślesz listę — wskakuje na stronę bez przeróbek.

Legenda: ☐ do zrobienia · ☑ gotowe

---

## 1. Zdjęcia → `public/photos/...`
(Szczegóły kadrów w `public/photos/README.md`. Format JPG/WebP, < ~400 KB.)

- ☐ **Hero** — 8 szt. pionowe 4:5 → `hero/01.jpg … 08.jpg`
- ☐ **Życie studenckie** — 2 szt. poziome 3:2 → `zycie/integracja.jpg`, `zycie/wsparcie.jpg`
- ☐ **Zarząd** — portrety 4:5 → `zarzad/01.jpg …` (kolejność = jak w sekcji)
- ☐ **RUSS** — portrety 4:5 → `russ/01.jpg …`
- ☐ **Władze rektorskie / Dziekani / Przewodniczący / SKW** — portrety 4:5
  (foldery dorobię pod konkretne sekcje, gdy potwierdzisz składy)

> Gdy wrzucisz dany komplet, ja przełączam flagę dla tej sekcji i sprawdzam kadry.

## 2. Składy osobowe (imiona, role, e-maile)
Podeślij jako prostą listę (np. w tabelce/po przecinku). Wymienię placeholdery
(np. „Mikołaj Kowalski") na prawdziwe dane w jednym pliku `src/lib/people.ts`.

- ☐ **Zarząd** — imię i nazwisko · funkcja · e-mail
- ☐ **Przewodnicząca + Wiceprzewodniczący** — j.w.
- ☐ **RUSS** — skład Rady (imię, nazwisko, ew. komisja/funkcja)
- ☐ **Władze rektorskie** — Rektor + prorektorzy (imię, tytuł, funkcja)
- ☐ **Dziekani i prodziekani** — j.w.
- ☐ **SKW** — skład komisji

## 3. Partnerzy → `public/partnerzy/...`
- ☐ Logotypy partnerów (najlepiej **SVG**, ewentualnie PNG na przezroczystości)
- ☐ Dla każdego: nazwa · link do strony · kategoria (np. lotnictwo, bank, tech)
      — kategoria steruje dedykowaną animacją kafelka

## 4. Dokumenty → `public/dokumenty/...`
(Zdejmuje plakietki „Wkrótce" i podpina prawdziwe pobieranie.)

- ☐ **Regulacje wewnętrzne** — 6 PDF-ów
- ☐ **Zarządzenia Przewodniczącej** — PDF-y lub link do naszego folderu
- ☐ **Prawo dla studenta** — statut, regulamin studiów, regulamin organizacyjny (PDF)
- ☐ **Stypendia** — komplet wniosków/dokumentów (PDF)
- ☐ **Mapa kampusu** — plik mapy (PDF/PNG)
- ☐ **Uchwały RUSS / SKW** — PDF-y lub link do naszego folderu

## 5. Identyfikacja wizualna
- ☐ **Logo** — wersja jasna i ciemna (SVG) → `public/logo-light.svg`, `public/logo-dark.svg`
- ☐ **Favicon / ikona** (jeśli inna niż obecna)

## 6. Treści projektów
- ☐ Opisy realnych projektów (Adapciak, Juwenalia, Tarcza, …) + zdjęcia/komisje/status

## 7. Klucze i integracje (wklejasz w Vercel → Settings → Environment Variables)
(Dokładną instrukcję „skąd wziąć" opiszę w `docs/ENV.md`.)

- ☐ **RESEND_API_KEY** — żeby formularz kontaktowy realnie wysyłał maile
- ☐ **EVENTS_SHEET_CSV_URL** — arkusz Google z wydarzeniami (CMS kalendarza)
- ☐ (opcjonalnie) **Google Calendar ID** — jeśli chcemy widget kalendarza
- ☐ Potwierdzenie kont social (TikTok/FB/IG/LinkedIn) i danych kontaktowych

---

**Handoff:** wrzucasz pliki w nazwane foldery / wklejasz listy → dajesz znać →
ja przełączam flagi, podpinam dane i weryfikuję build + wygląd.
