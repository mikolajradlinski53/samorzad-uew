# Deploy Guide — Samorząd Studentów UEW

## 0. Zmienne środowiskowe — szybki setup

Wszystkie zmienne ustawiamy w **Vercel Dashboard → Project → Settings → Environment Variables**.

### AUTH_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Skopiuj wynik i wklej jako wartość `AUTH_SECRET`.

### Google OAuth — AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET

1. Otwórz [console.cloud.google.com](https://console.cloud.google.com)
2. Utwórz projekt → **APIs & Services → Credentials → + Create Credentials → OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Authorized redirect URIs — dodaj:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://<twoja-domena>.vercel.app/api/auth/callback/google`
5. Skopiuj **Client ID** → `AUTH_GOOGLE_ID`
6. Skopiuj **Client Secret** → `AUTH_GOOGLE_SECRET`

### Resend — RESEND_API_KEY + RESEND_FROM_EMAIL

1. Załóż konto na [resend.com](https://resend.com)
2. **API Keys → + Create API Key** → skopiuj klucz → `RESEND_API_KEY`
3. **Domains → Add domain** → zweryfikuj swoją domenę
4. Ustaw `RESEND_FROM_EMAIL` np. `noreply@samorzad.ue.wroc.pl`
   > Jeśli domena nie jest jeszcze zweryfikowana, użyj tymczasowo `onboarding@resend.dev` (limit 1 email/dzień)

### Anthropic — ANTHROPIC_API_KEY

1. Otwórz [console.anthropic.com](https://console.anthropic.com)
2. **API Keys → + Create Key** → skopiuj klucz → `ANTHROPIC_API_KEY`

---

## 1. Vercel (Primary — Live Site)

Vercel jest podłączony do GitHub `main` branch i deployuje automatycznie po każdym pushu.

### Zmienne środowiskowe

Ustaw w: **Vercel Dashboard → Project → Settings → Environment Variables**

| Zmienna | Wymagana | Opis |
|---------|----------|------|
| `AUTH_SECRET` | Tak | Losowy 32+ znakowy secret — wygeneruj: `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Tak | Google OAuth Client ID (console.cloud.google.com) |
| `AUTH_GOOGLE_SECRET` | Tak | Google OAuth Client Secret |
| `RESEND_API_KEY` | Tak | Klucz API Resend.com do wysyłania emaili |
| `RESEND_FROM_EMAIL` | Tak | Zweryfikowany adres nadawcy (np. `noreply@samorzad.ue.wroc.pl`) |
| `ANTHROPIC_API_KEY` | Tak | Klucz API Anthropic do chatbota |

### Google OAuth konfiguracja

W Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID:

Dodaj Authorized redirect URIs:
- `http://localhost:3000/api/auth/callback/google` (development)
- `https://samorzad.ue.wroc.pl/api/auth/callback/google` (production)
- `https://twoja-domena.vercel.app/api/auth/callback/google` (Vercel preview)

### Deploy na Vercel

```bash
# Automatycznie po git push main
git push origin main

# Lub manualnie przez Vercel CLI
vercel --prod
```

---

## 2. Static Export — Hosting Uczelniany (SFTP)

> **Ważne:** Static export wyłącza API routes i server-side features.
> Formularze, chatbot i Strefa Działacza NIE działają w static export.
> Używaj tej metody tylko dla "read-only" wersji strony na hostingu uczelnianym.

### Generowanie static HTML

```bash
# Zbuduj statyczny export (skrypt tymczasowo ukrywa app/api, bo output:export tego nie wspiera)
npm run build:static

# Sprawdź wynik
ls out/
# Powinien zawierać: index.html, _next/, dla-studenta/, zarzad/, itd.

# Przetestuj lokalnie
npx serve out
# Otwórz: http://localhost:3000
```

### SFTP Upload

```bash
# Przykład z rsync (dostosuj do swojego hostingu)
rsync -avz --delete out/ uzytkownik@hosting.uczelni.pl:/public_html/

# Lub przez scp
scp -r out/* uzytkownik@hosting.uczelni.pl:/public_html/
```

### Ograniczenia static export

| Feature | Vercel | Static Export |
|---------|--------|---------------|
| Strony informacyjne | ✓ | ✓ |
| OG meta tagi | ✓ | ✓ |
| Sitemap/robots | ✓ | ✓ |
| Formularz kontaktowy | ✓ | ✗ (brak /api/formularz) |
| AI Chatbot | ✓ | ✗ (brak /api/chat) |
| Strefa Działacza | ✓ | ✗ (brak auth) |
| `next/image` optymalizacja | ✓ | ✗ (unoptimized) |

---

## 3. Development lokalny

```bash
npm install
cp .env.local.example .env.local  # lub stwórz .env.local ręcznie
npm run dev
# Otwórz: http://localhost:3000
```

### .env.local (NIE commituj tego pliku)

```env
AUTH_SECRET=twoj_secret_32_znaki
AUTH_GOOGLE_ID=twoj_google_client_id
AUTH_GOOGLE_SECRET=twoj_google_client_secret
RESEND_API_KEY=re_twoj_klucz
RESEND_FROM_EMAIL=noreply@samorzad.ue.wroc.pl
ANTHROPIC_API_KEY=sk-ant-twoj_klucz
```
