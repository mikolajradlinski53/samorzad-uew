# Zmienne środowiskowe i integracje

Strona działa **bez żadnych kluczy** — wszystkie integracje mają bezpieczny
fallback. Dodanie klucza po prostu „ożywia" daną funkcję. Klucze wklejasz w
**Vercel → Settings → Environment Variables** (Production + Preview), potem
**Redeploy**. Lokalnie: skopiuj `.env.example` → `.env.local` i uzupełnij.

> ⚠️ Nigdy nie commituj prawdziwych kluczy. `.env.local` jest w `.gitignore`.
> Do repo trafia tylko `.env.example` (puste wartości).

---

## 1. Formularze kontaktowe → e-mail (Formspree)

Formularze na `/kontakt`, `/rzecznik-praw-studenta` i `/partnerzy` wysyłają
przez [Formspree](https://formspree.io). To **nie jest** zmienna środowiskowa —
ID formularzy wpisuje się w kodzie, w `src/lib/forms.ts`.

**Bez skonfigurowanych ID:** formularz pokazuje komunikat „nie jest jeszcze
skonfigurowany" z linkiem `mailto:` jako zapasowy kontakt i blokuje wysyłkę
(przycisk wyłączony). Nic się nie „psuje po cichu".

**Konfiguracja:**
1. Załóż konto na <https://formspree.io> (darmowy plan wystarcza na start).
2. **New Form** — załóż osobny formularz dla każdej z trzech stron
   (Kontakt, Rzecznik Praw Studenta, Partnerzy), żeby zgłoszenia dało się
   rozróżnić w panelu Formspree.
3. Skopiuj ID z adresu formularza (`https://formspree.io/f/xxxxxxxx` → `xxxxxxxx`).
4. Wklej ID w `src/lib/forms.ts`:
   ```ts
   export const formspree = {
     kontakt: "xxxxxxxx",
     rzecznik: "yyyyyyyy",
     partnerzy: "zzzzzzzz",
   } as const;
   ```
5. Commit + deploy. Wyślij testową wiadomość przez `/kontakt`.

---

## 2. Kalendarz wydarzeń (Google Sheets jako CMS)

**Bez zmiennej:** sekcja „Najbliżej w kalendarzu" pokazuje wbudowane
przykładowe wydarzenia (fallback).

**Konfiguracja (działacze edytują arkusz, strona sama się odświeża co 10 min):**
1. Utwórz arkusz Google z nagłówkami w pierwszym wierszu:
   `nazwa | data | tag`  (data w formacie `RRRR-MM-DD`, np. `2026-10-15`).
2. **Plik → Udostępnij → Opublikuj w internecie** → wybierz **cały dokument**
   i format **CSV** → **Opublikuj** → skopiuj wygenerowany link.
3. W Vercel dodaj zmienną:
   - `EVENTS_SHEET_CSV_URL` = (skopiowany link CSV)
4. **Redeploy**. Wydarzenia z arkusza pojawią się na stronie głównej.

Akceptowane nazwy kolumn (dowolna kolejność): nazwa/`name`/`wydarzenie`/`tytuł`,
data/`date`, tag/`kategoria`/`typ`.

---

## 3. Strefa działacza — logowanie Google (OAuth)

**Bez kluczy:** `/strefa-dzialacza` pokazuje „Wkrótce". Po skonfigurowaniu
działacze logują się kontem `@samorzad.ue.wroc.pl` i widzą panel z kafelkami
(CRA, RadaStudentów24, … — edytujesz w `src/lib/panel.ts`).

**Konfiguracja:**
1. <https://console.cloud.google.com> → utwórz/wybierz projekt.
2. **APIs & Services → OAuth consent screen** → typ **Internal** (jeśli macie
   Google Workspace na domenie samorzad.ue.wroc.pl) → uzupełnij nazwę i e-mail.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID** →
   typ **Web application**.
4. W **Authorized redirect URIs** dodaj (dokładnie, z `/api/auth/callback`):
   - produkcja: `https://TWOJA-DOMENA/api/auth/callback`
   - (opcjonalnie dev) `http://localhost:3000/api/auth/callback`
5. Skopiuj **Client ID** i **Client secret** → w Vercel:
   - `GOOGLE_CLIENT_ID` = `...apps.googleusercontent.com`
   - `GOOGLE_CLIENT_SECRET` = `...`
6. Wygeneruj sekret sesji i dodaj:
   - `AUTH_SECRET` = wynik `openssl rand -base64 32`
7. **Redeploy**. Wejdź na `/strefa-dzialacza` → „Zaloguj przez Google".

Dostęp jest twardo ograniczony w kodzie do domeny `@samorzad.ue.wroc.pl`
(`ALLOWED_DOMAIN` w `src/lib/auth.ts`) — konta spoza domeny są odrzucane.

---

## Podsumowanie zmiennych

| Zmienna | Wymagana? | Co robi |
|---|---|---|
| `EVENTS_SHEET_CSV_URL` | nie | podpina kalendarz wydarzeń z Google Sheets |
| `GOOGLE_CLIENT_ID` | nie | logowanie do Strefy działacza (OAuth Google) |
| `GOOGLE_CLIENT_SECRET` | nie | j.w. — sekret aplikacji OAuth |
| `AUTH_SECRET` | nie | podpis ciasteczka sesji działacza |

Wszystkie pełnią rolę „opcjonalnego ulepszenia" — strona jest w pełni używalna
bez nich, więc możesz dodawać je stopniowo.
