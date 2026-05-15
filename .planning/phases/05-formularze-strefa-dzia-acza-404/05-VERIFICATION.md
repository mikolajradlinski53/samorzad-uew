---
phase: 05-formularze-strefa-dzia-acza-404
verified: 2026-05-15T00:00:00Z
status: passed
score: 9/9 must-haves verified
re_verification: false
---

# Phase 5: Formularze, Strefa Działacza, 404 — Verification Report

**Phase Goal:** Wszystkie formularze przez API routes (Resend), Google OAuth (@samorzad.ue.wroc.pl), lista obecności, AI chatbot, własna strona 404
**Verified:** 2026-05-15
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | next.config.js: output only when NEXT_STATIC_EXPORT=true | VERIFIED | Line 3: `process.env.NEXT_STATIC_EXPORT === 'true'` gates `output: 'export'` |
| 2 | auth.ts: signIn callback enforces @samorzad.ue.wroc.pl | VERIFIED | Line 17: `profile?.email?.endsWith('@samorzad.ue.wroc.pl') ?? false` |
| 3 | /api/formularz: ROUTING table kontakt/wspolpraca/rzecznik, 503 when no key | VERIFIED | Lines 6-10: ROUTING record; lines 13-15: 503 guard on missing RESEND_API_KEY |
| 4 | /api/chat: streamText + toDataStreamResponse + claude-haiku-4-5-20251001 | VERIFIED | Lines 1, 25-32: `streamText`, `anthropic('claude-haiku-4-5-20251001')`, `result.toDataStreamResponse()` |
| 5 | /formularz + /wspolprace + /rzecznik: forms POST to /api/formularz (no disabled buttons) | VERIFIED | ContactForm.tsx submitForm() calls POST /api/formularz; buttons disabled only during loading state, not statically |
| 6 | /strefa-dzialacza: shows Google login; dashboard has cra-system.vercel.app link | VERIFIED | strefa-dzialacza/page.tsx has Google sign-in form action; dashboard/page.tsx line 44: `href="https://cra-system.vercel.app"` |
| 7 | Lista obecności: checkboxes + localStorage + CSV export button | VERIFIED | lista-obecnosci/page.tsx: checkbox inputs, localStorage STORAGE_KEY read/write, exportCSV() function with "Pobierz CSV" button |
| 8 | ChatWidget: uses useChat from ai/react, mounted in layout.tsx | VERIFIED | ChatWidget.tsx line 3: `import { useChat } from 'ai/react'`; layout.tsx line 37: `<ChatWidget />` |
| 9 | not-found.tsx: Server Component 404 with navigation | VERIFIED | not-found.tsx: no 'use client' directive, exports metadata + default Server Component, contains two navigation Links |

**Score:** 9/9 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `next.config.js` | Conditional output: 'export' | VERIFIED | Conditional spread on NEXT_STATIC_EXPORT env var |
| `auth.ts` | NextAuth v5 Google OAuth + domain check | VERIFIED | Exports handlers, auth, signIn, signOut; hd hint + signIn callback |
| `middleware.ts` | Protects /strefa-dzialacza/:path+ | VERIFIED | matcher config `['/strefa-dzialacza/:path+']`, redirects to /strefa-dzialacza on unauthenticated |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth handler | VERIFIED | 2-line re-export of handlers from @/auth |
| `app/api/formularz/route.ts` | ROUTING table + 503 fallback | VERIFIED | ROUTING record for kontakt/wspolpraca/rzecznik, Resend integration, 503 guard |
| `app/api/chat/route.ts` | streamText, claude-haiku-4-5-20251001, toDataStreamResponse | VERIFIED | All three present; 503 guard for missing ANTHROPIC_API_KEY |
| `app/not-found.tsx` | Server Component 404 with nav | VERIFIED | Metadata export, two Link navigations, no 'use client' |
| `data/spotkania.ts` | Meeting list for attendance | VERIFIED | 8 spotkania entries with id/date/title/participants fields |
| `components/forms/ContactForm.tsx` | KontaktForm, WspolpraceForm, RzecznikForm | VERIFIED | All three forms exported, each calls submitForm() -> POST /api/formularz with correct formType |
| `app/(public)/formularz/page.tsx` | KontaktForm active | VERIFIED | Imports and renders KontaktForm |
| `app/(public)/wspolprace/page.tsx` | WspolpraceForm active | VERIFIED | Imports and renders WspolpraceForm |
| `app/(public)/rzecznik-praw-studenta/page.tsx` | RzecznikForm active | VERIFIED | Imports and renders RzecznikForm |
| `app/(public)/strefa-dzialacza/page.tsx` | Google login button | VERIFIED | Server Action calls signIn('google', { redirectTo: '/strefa-dzialacza/dashboard' }) |
| `app/(public)/strefa-dzialacza/dashboard/page.tsx` | CRA link + session check | VERIFIED | Session guard redirects unauthenticated; CRA card with href cra-system.vercel.app |
| `app/(public)/strefa-dzialacza/lista-obecnosci/page.tsx` | Checkboxes + localStorage + CSV | VERIFIED | Full implementation: state, toggle(), exportCSV(), useEffect for persistence |
| `components/chatbot/ChatWidget.tsx` | useChat from ai/react, /api/chat | VERIFIED | useChat({ api: '/api/chat' }), messages rendered, form with handleSubmit |
| `app/layout.tsx` | ChatWidget mounted globally | VERIFIED | ChatWidget imported and rendered inside LenisProvider body |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| ContactForm.tsx | /api/formularz | fetch POST in submitForm() | WIRED | fetch('/api/formularz', { method: 'POST' }) with formType + fields |
| ChatWidget.tsx | /api/chat | useChat({ api: '/api/chat' }) | WIRED | ai/react useChat hook wired to /api/chat endpoint |
| /api/formularz | Resend | resend.emails.send() | WIRED | Resend client instantiated, send called with routing-based to address |
| /api/chat | Anthropic | anthropic('claude-haiku-4-5-20251001') | WIRED | @ai-sdk/anthropic used in streamText, result piped to toDataStreamResponse() |
| auth.ts | middleware.ts | import { auth } from './auth' | WIRED | middleware.ts line 1 imports auth; auth() wraps the middleware function |
| strefa-dzialacza/page.tsx | auth.ts | signIn('google', ...) | WIRED | signIn called in Server Action; session checked via auth() |
| dashboard/page.tsx | auth.ts | auth() session check | WIRED | await auth() on line 12; redirect if !session |
| lista-obecnosci/page.tsx | localStorage | STORAGE_KEY read/write | WIRED | useEffect reads on mount; toggle() writes on every change |
| lista-obecnosci/page.tsx | data/spotkania.ts | import { spotkania } | WIRED | spotkania mapped for rows and checkboxes |
| layout.tsx | ChatWidget | import + render | WIRED | ChatWidget inside LenisProvider, rendered on every page |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| lista-obecnosci/page.tsx | checked (Set) | localStorage via useEffect | Yes — persisted user selections | FLOWING |
| lista-obecnosci/page.tsx | spotkania | data/spotkania.ts (static array) | Yes — 8 hardcoded meetings | FLOWING |
| ChatWidget.tsx | messages | useChat hook from /api/chat | Yes — streamed from Anthropic AI | FLOWING |
| ContactForm.tsx | status | submitForm() result from /api/formularz | Yes — real API response | FLOWING |
| dashboard/page.tsx | session.user.email | auth() JWT session | Yes — Google OAuth token | FLOWING |

---

### Behavioral Spot-Checks

Step 7b: SKIPPED (no runnable entry point without starting Next.js dev server and providing real OAuth/API credentials; all checks would require live services).

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| AUTH-01 | 05-01-PLAN.md | Google OAuth restricted to @samorzad.ue.wroc.pl | SATISFIED | auth.ts signIn callback + hd hint |
| AUTH-02 | 05-01-PLAN.md | Middleware protects /strefa-dzialacza/** | SATISFIED | middleware.ts matcher + redirect logic |
| FORM-01 | 05-02-PLAN.md | Kontakt form sends via /api/formularz | SATISFIED | KontaktForm -> submitForm('kontakt', ...) |
| FORM-02 | 05-02-PLAN.md | Wspolprace form sends via /api/formularz | SATISFIED | WspolpraceForm -> submitForm('wspolpraca', ...) |
| FORM-03 | 05-02-PLAN.md | Rzecznik form sends via /api/formularz | SATISFIED | RzecznikForm -> submitForm('rzecznik', ...) |
| CRA-01 | 05-03-PLAN.md | Dashboard links to cra-system.vercel.app | SATISFIED | dashboard/page.tsx href="https://cra-system.vercel.app" |
| ATTEND-01 | 05-03-PLAN.md | Lista obecnosci with checkboxes + localStorage + CSV | SATISFIED | Full implementation in lista-obecnosci/page.tsx |
| AI-01 | 05-04-PLAN.md | AI chatbot using Anthropic streaming | SATISFIED | /api/chat streamText + ChatWidget useChat |
| PAGE-404 | 05-02-PLAN.md | Custom 404 page with navigation | SATISFIED | app/not-found.tsx Server Component with two Links |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| data/spotkania.ts | 9-17 | All `participants: []` in spotkania entries | Info | Static seed data — not a functional stub; lista-obecnosci tracks presence via localStorage independently of this field |

No blockers or warnings found. The `participants: []` fields in spotkania.ts are unused seed data — the lista-obecnosci page tracks attendance in localStorage keyed by spotkanie ID, so the empty array does not affect functionality.

---

### Human Verification Required

#### 1. Google OAuth Login Flow

**Test:** Visit /strefa-dzialacza in a browser; click "Zaloguj sie z Google"; attempt login with an @samorzad.ue.wroc.pl account and with a non-domain account.
**Expected:** Domain account proceeds to /strefa-dzialacza/dashboard; non-domain account is rejected by OAuth callback.
**Why human:** Requires live Google OAuth credentials (AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) and a real Google account.

#### 2. Email Delivery via Resend

**Test:** Submit the contact form on /formularz with valid fields.
**Expected:** Email arrives at kontakt@samorzad.ue.wroc.pl; API returns 200 with email ID.
**Why human:** Requires RESEND_API_KEY and RESEND_FROM_EMAIL env vars; live Resend API call.

#### 3. AI Chatbot Response Streaming

**Test:** Open ChatWidget, type a question about SSUEW, submit.
**Expected:** Streamed text response appears incrementally from the assistant bubble; content reflects SSUEW system prompt context.
**Why human:** Requires ANTHROPIC_API_KEY; live Anthropic API call.

#### 4. Middleware Redirect for Unauthenticated Users

**Test:** While logged out, navigate directly to /strefa-dzialacza/dashboard or /strefa-dzialacza/lista-obecnosci.
**Expected:** Immediate redirect to /strefa-dzialacza login page.
**Why human:** Requires running Next.js server; middleware executes at edge runtime.

#### 5. CSV Export Correctness

**Test:** On lista-obecnosci page, check several meeting boxes, click "Pobierz CSV".
**Expected:** CSV file downloads with correct TAK/NIE values for each meeting; values match checked state.
**Why human:** File download API requires browser context.

---

### Gaps Summary

No gaps found. All 9 observable truths verified, all 17 artifacts confirmed as existing, substantive, and wired. All 9 requirement IDs satisfied with direct code evidence.

The implementation is complete and structurally correct. The only open items are 5 human verification tests that require live credentials and a running server — none of these represent code deficiencies.

---

_Verified: 2026-05-15_
_Verifier: Claude (gsd-verifier)_
