# Zmienne środowiskowe i integracje

Strona działa **bez żadnych kluczy** — wszystkie integracje mają bezpieczny
fallback. Dodanie klucza po prostu „ożywia" daną funkcję. Klucze wklejasz w
**Vercel → Settings → Environment Variables** (Production + Preview), potem
**Redeploy**. Lokalnie: skopiuj `.env.example` → `.env.local` i uzupełnij.

> ⚠️ Nigdy nie commituj prawdziwych kluczy. `.env.local` jest w `.gitignore`.
> Do repo trafia tylko `.env.example` (puste wartości).

---

## 1. Formularz kontaktowy → e-mail (Resend)

**Bez klucza:** formularz waliduje i przyjmuje zgłoszenie, pokazuje sukces,
a treść trafia do logów serwera (Vercel → Logs). Nic nie ginie — maile zaczną
wychodzić od razu po dodaniu klucza.

**Konfiguracja:**
1. Załóż konto na <https://resend.com> (darmowy plan wystarcza na start).
2. **API Keys → Create API Key** → skopiuj klucz (zaczyna się od `re_...`).
3. W Vercel dodaj zmienną:
   - `RESEND_API_KEY` = `re_...`
4. (Opcjonalnie) ustaw odbiorcę i nadawcę:
   - `CONTACT_TO` = `kontakt@samorzad.ue.wroc.pl` (domyślne, jeśli pominiesz)
   - `CONTACT_FROM` = `Formularz SSUEW <onboarding@resend.dev>`
     — do testów OK; **docelowo** zweryfikuj własną domenę w Resend
     (Domains → Add) i ustaw np. `Samorząd UEW <kontakt@samorzad.ue.wroc.pl>`,
     żeby maile nie wpadały do spamu.
5. **Redeploy**. Wyślij testową wiadomość przez `/kontakt`.

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

## Podsumowanie zmiennych

| Zmienna | Wymagana? | Co robi |
|---|---|---|
| `RESEND_API_KEY` | nie (zalecana) | włącza realną wysyłkę maili z formularza |
| `CONTACT_TO` | nie | odbiorca zgłoszeń (domyślnie kontakt@samorzad.ue.wroc.pl) |
| `CONTACT_FROM` | nie | nadawca maili (domena zweryfikowana w Resend) |
| `EVENTS_SHEET_CSV_URL` | nie | podpina kalendarz wydarzeń z Google Sheets |

Wszystkie pełnią rolę „opcjonalnego ulepszenia" — strona jest w pełni używalna
bez nich, więc możesz dodawać je stopniowo.
