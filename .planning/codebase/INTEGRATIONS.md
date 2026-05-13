# External Integrations

**Analysis Date:** 2026-05-13

## APIs & External Services

**None Detected**
- No third-party API integrations in codebase
- No SDK or client library usage (Stripe, Supabase, Firebase, AWS, etc.)
- Application is fully self-contained

## Data Storage

**Databases:**
- None - No database integration
- No backend storage layer

**File Storage:**
- Local filesystem only - Logo and assets stored locally (`logo_2.png`)
- No cloud storage integration (AWS S3, Google Cloud Storage, etc.)

**Caching:**
- Browser cache only (localStorage for language preference)
- No service worker or advanced caching mechanism

## Authentication & Identity

**Auth Provider:**
- Custom/None - Application has no authentication system
- Content is public with no user accounts
- Contact form is client-side only (no backend submission)

## Monitoring & Observability

**Error Tracking:**
- None detected - No error tracking service (Sentry, LogRocket, etc.)

**Logs:**
- Browser console only - No centralized logging infrastructure
- Client-side validation errors logged to user display (form error messages in `script.js` lines 371-385)

## CI/CD & Deployment

**Hosting:**
- Not specified - Can be deployed to any static hosting platform
- Compatible with: GitHub Pages, Netlify, Vercel, AWS S3, traditional web servers (nginx, Apache)

**CI Pipeline:**
- None detected - No GitHub Actions, GitLab CI, or other automation

## Environment Configuration

**Required env vars:**
- None - All configuration is static

**Secrets location:**
- No secrets used
- Contact email hardcoded: `kontakt@samorzad.ue.wroc.pl` (`index.html` line 377)
- Physical address hardcoded: `ul. Kamienna 43, 53-307 Wrocław, Budynek J, pokój 9`

## Webhooks & Callbacks

**Incoming:**
- None - No webhook endpoints
- Contact form submission is client-side only (no backend processing)

**Outgoing:**
- None - No external API calls or callbacks

## Email Integration

**Status:** Not Implemented
- Contact form (`index.html` lines 339-361) displays success message but doesn't send emails
- Form handler in `script.js` (lines 353-398) only performs client-side validation
- Email address `kontakt@samorzad.ue.wroc.pl` is displayed as contact information only
- To enable email functionality, would require backend service (PHP mail, SendGrid, Mailgun, etc.)

## Social Media

**Status:** Placeholder Links Only
- Social media links in navigation and footer (`index.html` lines 387-391, 405-409)
- Links are empty (`href="#"`) in current implementation
- Platforms referenced: Facebook, Instagram, TikTok, LinkedIn
- Text references in `script.js` (lines 428, 429, 431, 432)

## Analytics

**Status:** None Detected
- No Google Analytics or alternative tracking
- No user analytics or behavior tracking

## Internationalization (i18n)

**Implementation:** Client-Side
- i18n dictionary embedded in `script.js` (lines 2-195)
- Languages supported:
  - Polish (pl) - 98 translations
  - English (en) - 98 translations
- Persistence: localStorage (`script.js` line 198)
- No CDN or translation service integration

---

*Integration audit: 2026-05-13*
