# Phase 5: Formularze + Strefa Działacza + 404 — Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Source:** Brief + user choices

<domain>
## Phase Boundary

1. **API routes** — formularz kontaktowy i formularz współpracy wysyłają emaile przez Resend
2. **404** — własna strona not-found.tsx
3. **Strefa Działacza** — Google OAuth restricted to @samorzad.ue.wroc.pl, protected routes, CRA redirect, lista obecności
4. **AI chatbot** — Vercel AI SDK + Claude (Anthropic) na stronie publicznej, FAQ-style odpowiedzi

</domain>

<decisions>
## Implementation Decisions

### Stack / nowe pakiety
```bash
npm install resend                    # Email API
npm install next-auth@beta            # Google OAuth (NextAuth.js v5 / Auth.js) — @latest = v4, @beta = v5
npm install @auth/prisma-adapter      # NIE — brak bazy, użyj JWT session
npm install ai@^4.3.19 @ai-sdk/anthropic  # Vercel AI SDK v4 (NOT v6 — breaking API changes)
```

### Email (Resend)
- Pakiet: `resend`
- API route: `app/api/formularz/route.ts`
- Routing:
  - formularz kontaktowy (`/formularz`) → `kontakt@samorzad.ue.wroc.pl`
  - formularz współpracy (`/wspolprace`) → `karol.vogel@samorzad.ue.wroc.pl`
  - formularz rzecznika (`/rzecznik-praw-studenta`) → `rps@samorzad.ue.wroc.pl`
- Env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (np. `noreply@samorzad.ue.wroc.pl`)
- Routing param: POST body zawiera `formType: 'kontakt' | 'wspolpraca' | 'rzecznik'`
- Fallback: jeśli `RESEND_API_KEY` nie jest ustawione, API zwraca 503 z komunikatem

### Google OAuth (NextAuth.js v5)
- Pakiet: `next-auth@latest` (v5 / Auth.js)
- Provider: Google z `hd: 'samorzad.ue.wroc.pl'` + dodatkowa walidacja server-side
- Session strategy: JWT (bez bazy danych)
- Env vars: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- Config: `auth.ts` w root katalogu (nie `app/api/auth/...`)
- Middleware: `middleware.ts` chroni `/strefa-dzialacza/**`
- Unauthorized: redirect do `/strefa-dzialacza` (login page) z komunikatem

### Strefa Działacza
**Strony:**
- `/strefa-dzialacza` — landing page: jeśli nie zalogowany → formularz logowania Google; jeśli zalogowany → dashboard
- `/strefa-dzialacza/dashboard` — linki do CRA, lista obecności, profil
- Nie potrzeba osobnych `/strefa-dzialacza/login` itp. — NextAuth obsługuje flow

**CRA redirect:**
- Link do: `https://cra-system.vercel.app`
- Otwiera w nowej karcie z `target="_blank"`

**Lista obecności (`/strefa-dzialacza/lista-obecnosci`):**
- Prosta lista spotkań z datą i checkboxami
- Dane: statyczne JSON w `data/spotkania.ts` (imiona z `data/zarzad.ts` jako participants)
- State: localStorage per-session (nie baza danych — Phase 5 scope)
- Eksport: przycisk "Pobierz CSV" — generuje CSV z obecności client-side

### AI Chatbot (Vercel AI SDK + Claude)
- Pakiety: `ai @ai-sdk/anthropic`
- API route: `app/api/chat/route.ts`
- Model: `claude-haiku-4-5` (szybki, tani)
- System prompt: krótki kontekst o SSUEW (misja, kontakt, linki do podstron)
- UI component: `components/chatbot/ChatWidget.tsx` — floating button bottom-right
- State: 'use client', useChat hook z Vercel AI SDK
- Env var: `ANTHROPIC_API_KEY`
- Max tokens: 300 per response (FAQ-style, krótko)
- Fallback: jeśli API_KEY brak → widget ukryty

### 404 page
- Plik: `app/not-found.tsx` (Next.js App Router convention)
- Zawiera: logo, "Strona nie znaleziona", link powrotny na `/`
- Server component (no 'use client')

### Formularz kontaktowy (`/formularz`)
Nowa strona `app/(public)/formularz/page.tsx`:
- Pola: Imię i nazwisko, Email, Temat, Wiadomość
- POST do `/api/formularz` z `formType: 'kontakt'`
- Success/error state — 'use client'

### Formularz współpracy — aktualizacja `/wspolprace`
- Odblokowanie przycisku submit (usunięcie disabled)
- Podpięcie do `/api/formularz` z `formType: 'wspolpraca'`
- Wymaga client-side state — dodanie 'use client' lub osobnego komponentu

### Formularz Rzecznika — aktualizacja `/rzecznik-praw-studenta`
- Odblokowanie przycisku submit
- POST do `/api/formularz` z `formType: 'rzecznik'`

### Pliki `.env.local` (nie commitować)
```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@samorzad.ue.wroc.pl
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
ANTHROPIC_API_KEY=sk-ant-...
```

### Claude's Discretion
- Dokładna implementacja listy obecności (UI, UX checkboxów)
- Styl ChatWidget (kolory, rozmiar, animacja)
- Dokładna treść system prompt dla chatbota
- Sposób walidacji formularzy client-side przed POST

</decisions>

<canonical_refs>
## Canonical References

- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- `CLAUDE.md`
- `tailwind.config.js`
- `data/zarzad.ts` (lista osób dla listy obecności)
- `components/ui/FadeUp.tsx`
- `components/ui/Button.tsx`
- `app/(public)/wspolprace/page.tsx` (formularz do odblokowania)
- `app/(public)/rzecznik-praw-studenta/page.tsx` (formularz do odblokowania)

</canonical_refs>

<specifics>
## Specific Implementation Notes

**NextAuth v5 config pattern (auth.ts w root):**
```typescript
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: { params: { hd: 'samorzad.ue.wroc.pl' } },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return profile?.email?.endsWith('@samorzad.ue.wroc.pl') ?? false
    },
  },
})
```

**Middleware pattern:**
```typescript
// middleware.ts
import { auth } from './auth'
export default auth
export const config = { matcher: ['/strefa-dzialacza/:path*'] }
```

**API route handlers (App Router):**
```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

**Resend email pattern:**
```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
await resend.emails.send({ from, to, subject, html })
```

**Vercel AI SDK stream:**
```typescript
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: '...SSUEW context...',
    messages,
    maxTokens: 300,
  })
  return result.toDataStreamResponse()
}
```

</specifics>

<deferred>
## Deferred

- Baza danych dla listy obecności (localStorage wystarczy na Phase 5)
- Persistentna historia chatu (session-only)
- Multi-tenant OAuth (np. inne domeny Google)
- Push notifications
- Rate limiting na API routes (Phase 6 lub separate)

</deferred>

---

*Phase: 05-formularze-streza-dzia-acza-404*
*Context gathered: 2026-05-15 via brief + user choices*
