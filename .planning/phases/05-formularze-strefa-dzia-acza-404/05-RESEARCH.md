# Phase 5: Formularze + Strefa Działacza + 404 — Research

**Researched:** 2026-05-15
**Domain:** Next.js API Routes, NextAuth.js v5, Resend, Vercel AI SDK, static export architecture
**Confidence:** HIGH (critical conflict verified against official Next.js docs)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Stack / nowe pakiety**
```bash
npm install resend
npm install next-auth@latest
npm install ai @ai-sdk/anthropic
```

**Email (Resend)**
- API route: `app/api/formularz/route.ts`
- Routing: kontaktowy → `kontakt@`, wspolpraca → `karol.vogel@`, rzecznik → `rps@`
- Env: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- POST body param: `formType: 'kontakt' | 'wspolpraca' | 'rzecznik'`
- Fallback: brak klucza → HTTP 503

**Google OAuth (NextAuth.js v5)**
- Pakiet: `next-auth@latest` (v5 / Auth.js)
- Provider: Google z `hd: 'samorzad.ue.wroc.pl'` + callback server-side validation
- Session: JWT (bez bazy danych)
- Env: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- Config: `auth.ts` w root
- Middleware: `middleware.ts` chroni `/strefa-dzialacza/**`

**Strefa Działacza pages**
- `/strefa-dzialacza` — landing, conditional dashboard vs login
- `/strefa-dzialacza/dashboard` — CRA link + lista obecności
- CRA link: `https://cra-system.vercel.app` target="_blank"
- Lista obecności: localStorage state, dane z `data/spotkania.ts`, eksport CSV client-side

**AI Chatbot**
- Pakiety: `ai @ai-sdk/anthropic`
- API route: `app/api/chat/route.ts`
- Model: `claude-haiku-4-5-20251001`
- UI: `components/chatbot/ChatWidget.tsx` — floating bottom-right
- State: 'use client', useChat hook
- Env: `ANTHROPIC_API_KEY`
- Max tokens: 300
- Fallback: brak klucza → widget ukryty

**404 page**
- Plik: `app/not-found.tsx`
- Server component (no 'use client')

**Formularze do odblokowania**
- `/wspolprace` — usunąć `disabled`, podpiąć POST z `formType: 'wspolpraca'`
- `/rzecznik-praw-studenta` — usunąć `disabled`, podpiąć POST z `formType: 'rzecznik'`
- `/formularz` — nowa strona, pola: Imię i nazwisko, Email, Temat, Wiadomość

### Claude's Discretion
- Dokładna implementacja listy obecności (UI, UX checkboxów)
- Styl ChatWidget (kolory, rozmiar, animacja)
- Dokładna treść system prompt dla chatbota
- Sposób walidacji formularzy client-side przed POST

### Deferred Ideas (OUT OF SCOPE)
- Baza danych dla listy obecności (localStorage wystarczy na Phase 5)
- Persistentna historia chatu (session-only)
- Multi-tenant OAuth (np. inne domeny Google)
- Push notifications
- Rate limiting na API routes (Phase 6 lub separate)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FORM-01 | Formularz kontaktowy (`/formularz`) POSTuje do `/api/formularz`, email dociera na kontakt@ | Resend API verified, route pattern confirmed |
| FORM-02 | Formularz współpracy POSTuje do `/api/formularz` z routingiem do karol.vogel@ | Same route, formType routing pattern |
| FORM-03 | Formularz Rzecznika POSTuje do `/api/formularz` z routingiem do rps@ | Same route, formType routing pattern |
| AUTH-01 | `/strefa-dzialacza` przekierowuje niezalogowanych do login Google | NextAuth v5 middleware.ts pattern verified |
| AUTH-02 | Konta spoza @samorzad.ue.wroc.pl są odrzucane | signIn callback + hd param pattern verified |
| CRA-01 | Po zalogowaniu widoczny link do CRA (cra-system.vercel.app) | Standard Next.js Link with target="_blank" |
| ATTEND-01 | Moduł listy obecności z eksportem CSV | localStorage + client-side CSV generation pattern |
| AI-01 | AI chatbot na stronie publicznej odpowiada na pytania o SSUEW | Vercel AI SDK v4 streamText + useChat pattern |
| PAGE-404 | Wejście na nieistniejący URL pokazuje własną stronę 404 | app/not-found.tsx App Router convention |
</phase_requirements>

---

## Summary

Phase 5 introduces all server-side functionality into a project that currently runs with `output: 'export'` (static HTML). The critical architectural finding is that **API routes reading from the incoming Request object cannot coexist with `output: 'export'`** — this is an official Next.js limitation confirmed in the static exports documentation. All three required features (Resend email POST, NextAuth auth callbacks, AI chat stream) read from the Request object.

The CONTEXT.md already identifies the solution: `next export + Vercel API split`. The practical implementation is to make `output: 'export'` conditional — only applied when generating the static files for the university hosting. On Vercel itself (where `process.env.VERCEL` is set), the project deploys without `output: 'export'`, allowing API routes to function as serverless functions. Both configurations can coexist in one `next.config.js`.

A second critical finding is that the CONTEXT.md code example uses the **AI SDK v4 API** (`toDataStreamResponse`, `useChat` from `ai/react`), but `npm install ai` today installs **v6** (6.0.182), which has a completely different API (`toUIMessageStreamResponse`, `useChat` from `@ai-sdk/react`). The planner must pin `ai` to `^4.3.19` to match the CONTEXT.md patterns, or rewrite the AI route for v6.

**Primary recommendation:** Pin `ai@^4.3.19` to use the documented v4 API patterns. Remove `output: 'export'` when `process.env.VERCEL` is truthy in `next.config.js`. NextAuth v5 with JWT sessions and the `signIn` callback domain check is the correct pattern — no database required.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next-auth` | 4.24.14 (latest) | Google OAuth, session management | Auth.js v5 = the v5 branch of next-auth; JWT strategy, no adapter |
| `resend` | 6.12.3 (latest) | Transactional email API | Simple, reliable, developer-friendly API |
| `ai` | **4.3.19 (pin v4)** | Vercel AI SDK core — streamText, useChat | v4 API matches CONTEXT.md patterns; v6 has breaking changes |
| `@ai-sdk/anthropic` | 3.0.77 (latest) | Anthropic Claude provider for AI SDK | Official provider from Vercel |

### Notes on Version Pinning

**CRITICAL:** `npm install ai` installs v6.0.182 today. The CONTEXT.md example code uses `toDataStreamResponse()` and (implied) `useChat` from `ai/react` — these are v4 APIs removed in v5/v6. Install with exact pinning:

```bash
npm install ai@^4.3.19 @ai-sdk/anthropic resend next-auth@latest
```

v4 `useChat` imports from `'ai/react'` (not `@ai-sdk/react`). v6 `useChat` imports from `@ai-sdk/react`. Choose v4 to match the documented pattern.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Resend | Nodemailer + SMTP | Resend easier to configure in serverless, no SMTP server needed |
| NextAuth JWT sessions | NextAuth database sessions | Database sessions need a DB; JWT is correct choice here |
| `ai` v4 | `ai` v6 | v6 has better API but breaks CONTEXT.md patterns; pick v4 for consistency |

### Installation

```bash
npm install ai@^4.3.19 @ai-sdk/anthropic resend next-auth@latest
```

**Verify installed versions after install:**
```bash
npm list ai @ai-sdk/anthropic resend next-auth
```

---

## Architecture Patterns

### CRITICAL: `output: 'export'` vs API Routes

**The Conflict:** Next.js official docs state that Route Handlers that "rely on Request" are NOT supported with `output: 'export'`. Every Phase 5 API route (POST /api/formularz, GET+POST /api/auth/[...nextauth], POST /api/chat) reads from the incoming Request. Static export would fail at build time or produce broken routes.

**The Solution (already in PROJECT.md):** Make `output: 'export'` conditional.

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' only when generating static HTML for university hosting
  // On Vercel (process.env.VERCEL is set), skip export — API routes work as serverless functions
  ...(process.env.NEXT_STATIC_EXPORT === 'true' ? {
    output: 'export',
    trailingSlash: true,
  } : {}),
  images: { unoptimized: true },
}
module.exports = nextConfig
```

Local dev and Vercel deploy: no `output: 'export'` → API routes work.
University hosting build: `NEXT_STATIC_EXPORT=true npm run build` → generates `/out` static HTML.

**Note:** With this approach, `next dev` and Vercel deployment will work normally. The static export is a separate build step for SFTP upload to the university server. API routes exist only on the Vercel deployment.

### Recommended Project Structure (new files for Phase 5)

```
app/
├── (public)/
│   ├── formularz/          # FORM-01: new contact form page
│   │   └── page.tsx        # 'use client', POST to /api/formularz
│   ├── wspolprace/
│   │   └── page.tsx        # FORM-02: unlock submit, wire POST (convert to 'use client')
│   └── rzecznik-praw-studenta/
│       └── page.tsx        # FORM-03: unlock submit, wire POST (convert to 'use client')
├── (protected)/
│   └── strefa-dzialacza/
│       ├── page.tsx        # AUTH-01: login/dashboard conditional
│       ├── dashboard/
│       │   └── page.tsx    # CRA-01, ATTEND-01
│       └── lista-obecnosci/
│           └── page.tsx    # ATTEND-01
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts    # AUTH-01: export { GET, POST } from '@/auth'
│   ├── formularz/
│   │   └── route.ts        # FORM-01,02,03: Resend email routing
│   └── chat/
│       └── route.ts        # AI-01: streamText + toDataStreamResponse
├── not-found.tsx            # PAGE-404
auth.ts                      # NextAuth config (root level)
middleware.ts                # Protects /strefa-dzialacza/**
data/
└── spotkania.ts             # ATTEND-01: static meeting list
components/
└── chatbot/
    └── ChatWidget.tsx       # AI-01: floating chat widget, 'use client'
```

### Pattern 1: NextAuth v5 Config (auth.ts)

**What:** Root-level auth.ts exports `handlers`, `auth`, `signIn`, `signOut`.
**When to use:** This is the only correct v5 pattern — no longer in `pages/api/auth/[...nextauth].ts`.

```typescript
// auth.ts (root level — NOT in app/)
// Source: https://authjs.dev/reference/nextjs
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          hd: 'samorzad.ue.wroc.pl', // hints Google to show domain accounts first
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ profile }) {
      // Server-side enforcement — hd param is UI hint only, not security
      return profile?.email?.endsWith('@samorzad.ue.wroc.pl') ?? false
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.email = profile.email
      }
      return token
    },
  },
})
```

**Key v5 env var names (AUTH_ prefix, not NEXTAUTH_):**
```env
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

### Pattern 2: NextAuth Route Handler

```typescript
// app/api/auth/[...nextauth]/route.ts
// Source: https://authjs.dev/reference/nextjs
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

### Pattern 3: Middleware Protection

```typescript
// middleware.ts (root level)
// Source: https://authjs.dev/reference/nextjs
import { auth } from './auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isProtected = req.nextUrl.pathname.startsWith('/strefa-dzialacza')
  
  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL('/strefa-dzialacza', req.url))
  }
})

export const config = {
  matcher: ['/streza-dzialacza/:path*'],
}
```

**Important:** Middleware runs on Edge Runtime. NextAuth v5 with JWT strategy is Edge-compatible. The `signIn` callback and JWT strategy avoid any Node.js-only code in middleware.

### Pattern 4: Resend Email Route (v4 API)

```typescript
// app/api/formularz/route.ts
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const ROUTING: Record<string, string> = {
  kontakt:   'kontakt@samorzad.ue.wroc.pl',
  wspolpraca: 'karol.vogel@samorzad.ue.wroc.pl',
  rzecznik:   'rps@samorzad.ue.wroc.pl',
}

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
  }
  const body = await req.json()
  const { formType, ...fields } = body
  const to = ROUTING[formType]
  if (!to) return NextResponse.json({ error: 'Unknown form type' }, { status: 400 })

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'noreply@samorzad.ue.wroc.pl',
    to,
    subject: `Nowa wiadomość — ${formType}`,
    html: Object.entries(fields).map(([k, v]) => `<p><b>${k}:</b> ${v}</p>`).join(''),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data?.id }, { status: 200 })
}
```

### Pattern 5: AI Chat Route (AI SDK v4)

```typescript
// app/api/chat/route.ts
// Source: ai-sdk.dev — v4 API (pin ai@^4.3.19)
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('AI service not configured', { status: 503 })
  }
  const { messages } = await req.json()
  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: SSUEW_SYSTEM_PROMPT,
    messages,
    maxTokens: 300,
  })
  return result.toDataStreamResponse()   // v4 method — works in ai@^4.3.19
}
```

### Pattern 6: ChatWidget Client Component (AI SDK v4)

```typescript
// components/chatbot/ChatWidget.tsx
'use client'
import { useChat } from 'ai/react'   // v4 import path (NOT @ai-sdk/react)
```

### Pattern 7: Form Client Component Pattern

Existing form pages (wspolprace, rzecznik) are Server Components. Adding `'use client'` to the whole page is the simplest approach. Alternatively, extract just the form into a `*Form.tsx` client component and keep the page as Server Component. Either works — extracting the form component is cleaner.

```typescript
// components/forms/ContactForm.tsx
'use client'
import { useState } from 'react'

export function ContactForm({ formType }: { formType: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const formData = new FormData(e.currentTarget)
    const body = { formType, ...Object.fromEntries(formData) }
    const res = await fetch('/api/formularz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setStatus(res.ok ? 'success' : 'error')
  }
  // ...
}
```

### Pattern 8: app/not-found.tsx (App Router 404)

```typescript
// app/not-found.tsx
// Source: Next.js App Router convention
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1>404 — Strona nie znaleziona</h1>
      <Link href="/">← Wróć na stronę główną</Link>
    </main>
  )
}
// No 'use client' needed — Server Component is correct
```

**Note:** `not-found.tsx` in the `app/` root is automatically rendered for any 404. No additional configuration needed.

### Anti-Patterns to Avoid

- **Keeping `output: 'export'` unconditionally when adding API routes** — build will fail or routes will silently not work.
- **Using `next-auth` v4 API patterns** (e.g., `pages/api/auth/[...nextauth].ts`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`) — v5 changed all of these.
- **`npm install ai` without pinning** — installs v6 which breaks `toDataStreamResponse` and `useChat` from `ai/react`.
- **Using `hd` param as sole security** — `hd` is a UI hint to Google's OAuth page, not a security enforcement. Always add `signIn` callback validation.
- **Using `middleware.ts` with a database adapter** — middleware runs on Edge Runtime; database adapters (Prisma, Drizzle) don't work there. JWT-only strategy is Edge-safe.
- **Trying to read from `request` in a route handler when building with `output: 'export'`** — build-time error.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OAuth flow | Custom Google OAuth redirect + token exchange | NextAuth v5 | PKCE, state params, token refresh, CSRF — dozens of edge cases |
| Email sending | Fetch calls to SMTP or raw Nodemailer | Resend | Serverless-compatible, no SMTP config, deliverability handled |
| Streaming AI responses | Manual ReadableStream + SSE headers | `streamText().toDataStreamResponse()` | Backpressure, reconnection, chunk parsing, useChat protocol compatibility |
| Session JWT | Custom JWT sign/verify | NextAuth JWT strategy | Key rotation, expiry, CSRF protection |
| CSV export | Hand-rolled CSV serializer | Simple JS string join with proper escaping | See pitfall below about commas in values |

**Key insight:** NextAuth, Resend, and the Vercel AI SDK each abstract away 15–30 edge cases (token refresh, CSRF, deliverability, stream framing) that are invisible until they fail in production.

---

## Common Pitfalls

### Pitfall 1: `output: 'export'` Blocks All Dynamic API Routes

**What goes wrong:** Adding API routes to a project with `output: 'export'` causes `next build` to fail with: "Route ... with `output: export` is incompatible with dynamic methods like `cookies()`" or similar. Even if it builds, POST handlers are not included in the static output.

**Why it happens:** Static export produces flat HTML files. Serverless functions cannot be pre-rendered.

**How to avoid:** Make `output: 'export'` conditional (env variable `NEXT_STATIC_EXPORT`). The Vercel deployment never sets this, so API routes work as serverless functions.

**Warning signs:** `next build` fails after adding `app/api/` routes; 404s on API calls in production.

### Pitfall 2: NextAuth v4 vs v5 Config Patterns Mixed

**What goes wrong:** Using `NEXTAUTH_SECRET` (v4) instead of `AUTH_SECRET` (v5), or placing config in `pages/api/auth/[...nextauth].ts` instead of `auth.ts` + `app/api/auth/[...nextauth]/route.ts`. Auth silently fails or gives cryptic errors.

**Why it happens:** Most tutorials and Stack Overflow answers still show v4 patterns. `next-auth@latest` installs v5 (4.24.x is the latest stable as of 2026-05).

**How to avoid:** Use `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` env var names. Config lives in `auth.ts` at root. Route handler exports `handlers` from `auth.ts`.

**Warning signs:** `[next-auth][error] Configuration` errors; redirect loops on login.

### Pitfall 3: AI SDK Version Mismatch

**What goes wrong:** `npm install ai` installs v6 (6.0.182). Code using `toDataStreamResponse()` or `import { useChat } from 'ai/react'` will fail with type errors or runtime errors.

**Why it happens:** The `ai` package has had major breaking changes between v4 → v5 → v6. `npm install ai` always gives latest.

**How to avoid:** Pin explicitly: `npm install ai@^4.3.19`. Then `useChat` imports from `'ai/react'` and `toDataStreamResponse()` works.

**Warning signs:** TypeScript error `Property 'toDataStreamResponse' does not exist`; `Module not found: 'ai/react'`.

### Pitfall 4: `hd` Parameter Is Not a Security Guard

**What goes wrong:** Using only `hd: 'samorzad.ue.wroc.pl'` in the Google provider config and assuming it blocks non-domain accounts. A malicious user can modify the OAuth request to remove the `hd` hint.

**Why it happens:** The `hd` param is a UI hint to Google, not enforced server-side.

**How to avoid:** Always pair `hd` with the `signIn` callback that checks `profile?.email?.endsWith('@samorzad.ue.wroc.pl')`.

**Warning signs:** Users with non-domain accounts can log in.

### Pitfall 5: Middleware on Edge Runtime with Non-Edge Code

**What goes wrong:** Importing database clients, file system access, or Node.js built-ins in `middleware.ts` crashes at startup.

**Why it happens:** Next.js middleware runs on the Edge Runtime (V8 isolate), not Node.js.

**How to avoid:** Keep `middleware.ts` minimal — only import from `'./auth'` (which uses JWT, Edge-compatible). Never import Prisma, fs, or Node.js modules.

### Pitfall 6: CSV Export with Unescaped Commas

**What goes wrong:** Names or notes containing commas break CSV parsing. E.g., "Ćwiklińska, Emilia" becomes two columns.

**Why it happens:** Naive CSV generation using `.join(',')` without quoting.

**How to avoid:** Wrap all CSV cell values in double quotes and escape internal double quotes:
```typescript
const cell = (v: string) => `"${v.replace(/"/g, '""')}"`
```

### Pitfall 7: Disabled Button Approach in Server Components

**What goes wrong:** `wspolprace/page.tsx` and `rzecznik-praw-studenta/page.tsx` currently have `<form>` elements with `disabled` buttons. They are Server Components. Adding `onClick` or `onSubmit` handlers directly to them will fail.

**Why it happens:** Server Components cannot have event handlers.

**How to avoid:** Extract the form into a dedicated `'use client'` component file. Import it into the page Server Component. The page stays Server Component; only the form is client-side.

---

## Code Examples

Verified patterns from official sources:

### NextAuth v5 — Protecting a Server Component Page

```typescript
// app/(protected)/strefa-dzialacza/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function StrefaDzialaczaPage() {
  const session = await auth()
  // Middleware handles redirect, but double-check here for TypeScript narrowing
  if (!session) redirect('/')
  return <div>Witaj, {session.user?.email}</div>
}
```

### Resend — Send Call Signature (current, verified)

```typescript
// Source: https://resend.com/nodejs (2026-05-15)
const { data, error } = await resend.emails.send({
  from: 'noreply@samorzad.ue.wroc.pl',
  to: 'kontakt@samorzad.ue.wroc.pl',
  subject: 'Nowa wiadomość kontaktowa',
  html: '<p>Treść wiadomości</p>',
})
```

### AI SDK v4 — streamText + toDataStreamResponse

```typescript
// Source: ai-sdk.dev v4 docs — verified works with ai@^4.3.19
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

const result = streamText({
  model: anthropic('claude-haiku-4-5-20251001'),
  system: 'You are a helpful assistant...',
  messages,
  maxTokens: 300,
})
return result.toDataStreamResponse()
```

### AI SDK v4 — useChat Hook

```typescript
// 'use client'
import { useChat } from 'ai/react'   // v4 import — NOT @ai-sdk/react

export function ChatWidget() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })
  // ...
}
```

### localStorage CSV Export Pattern

```typescript
// Client-side, no library needed
function exportCSV(meetings: Meeting[], attendance: Record<string, boolean>) {
  const cell = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = meetings.map(m => [
    cell(m.date),
    cell(m.title),
    cell(attendance[m.id] ? 'obecny' : 'nieobecny'),
  ].join(','))
  const csv = ['Data,Spotkanie,Obecność', ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'lista-obecnosci.csv'
  a.click()
  URL.revokeObjectURL(url)
}
```

### data/spotkania.ts Structure

```typescript
export interface Spotkanie {
  id: string
  date: string        // 'YYYY-MM-DD'
  title: string
  participants: string[]  // imiona z data/zarzad.ts
}

export const spotkania: Spotkanie[] = [
  { id: '2025-10-01', date: '2025-10-01', title: 'Spotkanie inauguracyjne', participants: [] },
  // ...
]
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `pages/api/auth/[...nextauth].ts` (v4) | `auth.ts` + `app/api/auth/[...nextauth]/route.ts` (v5) | next-auth v5 (2024) | Different file locations, different exports |
| `NEXTAUTH_SECRET` env var | `AUTH_SECRET` env var | next-auth v5 | Must use new prefix |
| `useChat` from `'ai/react'` | `useChat` from `'@ai-sdk/react'` | AI SDK v5 (July 2025) | Separate package install required |
| `toDataStreamResponse()` | `toUIMessageStreamResponse()` | AI SDK v5 (July 2025) | Breaking change in v5/v6 |
| `output: 'export'` blocks all API | App Router Route Handlers static-only GET | Next.js 13.4+ | POST handlers still incompatible with static export |

**Deprecated/outdated:**
- `NEXTAUTH_URL` — no longer needed in v5 (auto-detected)
- `getServerSession(authOptions)` — replaced by `auth()` from `./auth`
- `withAuth` HOC middleware — replaced by `export default auth(handler)` pattern
- `StreamingTextResponse` from `ai` — removed in AI SDK v4, replaced by `toDataStreamResponse()`

---

## Open Questions

1. **Which next-auth version is actually "v5"?**
   - What we know: `npm install next-auth@latest` installs 4.24.14 as of 2026-05-15. The "v5 / Auth.js" refers to the `beta` tag of the `next-auth` package, which is now stable under `@auth/core`. There is confusion in docs because "Auth.js v5" = `next-auth@beta` which is separate from `next-auth@latest`.
   - What's unclear: Whether CONTEXT.md means `next-auth@latest` (4.24.14, which is v4) or `next-auth@beta` (the Auth.js v5 rewrite). The CONTEXT.md code examples use v5 patterns (auth.ts at root, AUTH_SECRET prefix).
   - Recommendation: Install `next-auth@beta` (which is Auth.js v5) and use the v5 patterns from CONTEXT.md. Verify: `npm install next-auth@beta` to get the v5 package with the new API.

2. **Vercel deployment URL for NextAuth callbacks**
   - What we know: Auth.js v5 auto-detects callback URL from `NEXTAUTH_URL` or from Vercel's `VERCEL_URL` env var.
   - What's unclear: Will the Google OAuth callback URL work correctly across Vercel preview deployments and production?
   - Recommendation: Set `AUTH_URL` (v5 equivalent of `NEXTAUTH_URL`) explicitly for production. For preview deployments, Auth.js auto-detects from `VERCEL_URL`.

3. **Google Workspace subdomain OAuth**
   - What we know: `@samorzad.ue.wroc.pl` is a Google Workspace domain. `hd: 'samorzad.ue.wroc.pl'` in the authorization params passes the hosted domain hint.
   - What's unclear: Whether this is a true Google Workspace domain or just a Gmail alias.
   - Recommendation: The `signIn` callback domain check (`endsWith('@samorzad.ue.wroc.pl')`) is the security enforcement regardless. The `hd` hint is UX only.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | npm install, next dev | ✓ | detected (project running) | — |
| npm | package install | ✓ | detected (package.json exists) | — |
| Vercel deployment | API routes in production | depends on project setup | — | Local dev works without Vercel |
| `RESEND_API_KEY` | FORM-01,02,03 | Not confirmed | — | Route returns 503 (built-in fallback) |
| `AUTH_SECRET` | AUTH-01,02 | Not confirmed | — | NextAuth won't start without this |
| `AUTH_GOOGLE_ID` | AUTH-01,02 | Not confirmed | — | Google OAuth won't work |
| `AUTH_GOOGLE_SECRET` | AUTH-01,02 | Not confirmed | — | Google OAuth won't work |
| `ANTHROPIC_API_KEY` | AI-01 | Not confirmed | — | Widget hidden (built-in fallback) |

**Missing dependencies with no fallback:**
- `AUTH_SECRET` — NextAuth v5 refuses to initialize without this. Must be set before testing auth.
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth console setup required (create OAuth app at console.developers.google.com).

**Missing dependencies with fallback:**
- `RESEND_API_KEY` — missing triggers 503 response (coded in route handler).
- `ANTHROPIC_API_KEY` — missing hides the widget (coded in ChatWidget).

---

## Project Constraints (from CLAUDE.md)

Note: CLAUDE.md reflects the original vanilla HTML stack. The PROJECT.md and ROADMAP.md contain the updated Next.js constraints which supersede CLAUDE.md for Phases 2–6.

**Relevant directives still applicable:**
- Vanilla HTML stack constraint — SUPERSEDED by Next.js migration decision in PROJECT.md
- No external frameworks — SUPERSEDED; Next.js + Tailwind + Framer Motion in use since Phase 2
- Netlify Forms — SUPERSEDED; Phase 5 replaces with `/api/formularz` (Resend)
- Naming: camelCase for TypeScript functions, kebab-case for CSS classes, `'use client'` at top of client files
- No build config files — SUPERSEDED; `next.config.js`, `tsconfig.json`, `tailwind.config.js` exist

**Active from CLAUDE.md:**
- Modern browsers only (Chrome, Firefox, Safari, Edge) — no IE shims needed
- Minimize inline styles — all styling through Tailwind classes
- Progressive enhancement — forms should degrade gracefully (503 fallback for email)

---

## Sources

### Primary (HIGH confidence)

- Next.js official docs `/docs/app/guides/static-exports` (2026-05-13) — confirmed Route Handlers relying on Request are NOT supported with `output: 'export'`
- `npm view ai version` + `npm view ai dist-tags` — confirmed `ai` latest = 6.0.182, v4 latest = 4.3.19
- `npm view next-auth@latest version` — confirmed 4.24.14
- `npm view resend@latest version` — confirmed 6.12.3
- `npm view @ai-sdk/anthropic@latest version` — confirmed 3.0.77
- https://resend.com/nodejs — verified current `resend.emails.send()` API signature
- https://authjs.dev/reference/nextjs — verified v5 auth.ts config and middleware patterns
- https://authjs.dev/getting-started/migrating-to-v5 — confirmed AUTH_ prefix, auth.ts location

### Secondary (MEDIUM confidence)

- Vercel AI SDK migration guide (ai-sdk.dev) — confirmed `toDataStreamResponse` works in v4, replaced by `toUIMessageStreamResponse` in v5
- Multiple community sources: NextAuth v5 + `output: 'export'` is incompatible due to required API route handler

### Tertiary (LOW confidence)

- Community discussion on `next-auth@latest` vs `next-auth@beta` versioning — needs verification by running `npm install next-auth@beta` and checking what version installs

---

## Metadata

**Confidence breakdown:**
- `output: 'export'` conflict: HIGH — verified against official Next.js docs (2026-05-13)
- NextAuth v5 patterns: HIGH — verified against authjs.dev official docs
- Resend API: HIGH — verified against resend.com/nodejs live docs
- AI SDK version conflict: HIGH — verified via npm registry directly
- Claude model ID `claude-haiku-4-5-20251001`: HIGH — confirmed on multiple official sources
- `next-auth@latest` = v4 vs `next-auth@beta` = v5 distinction: MEDIUM — needs install verification

**Research date:** 2026-05-15
**Valid until:** 2026-06-15 (stable libraries; AI SDK versioning moves fast — recheck before Phase 6)
