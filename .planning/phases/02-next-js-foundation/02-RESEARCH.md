# Phase 2: Next.js Foundation — Research

**Researched:** 2026-05-15
**Domain:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, Framer Motion (motion package), Lenis smooth scroll
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Framework:** Next.js 14 z App Router (nie Pages Router)
- **TypeScript:** strict mode, `tsconfig.json` z path aliases (`@/components`, `@/lib`, `@/data`)
- **CSS:** Tailwind CSS v3, bez CSS Modules ani styled-components
- **Package manager:** npm (nie yarn/pnpm — repo nie ma lockfile)
- **Export:** `output: 'export'` w `next.config.js` dla statycznego HTML; `trailingSlash: true`
- **Animacje:** Framer Motion scroll-triggered fade-in-up (`whileInView`, `once: true`); Lenis smooth scroll przez `useLenis()` hook; `useReducedMotion()` wyłącza animacje
- **Navbar:** sticky z `backdrop-blur-md bg-white/80` po scrollu, dropdown na hover (desktop), slide-down drawer z akordeonem (mobile)
- **Footer:** trzy kolumny — adres, social media (TikTok/FB/LI/IG), kontakt email
- **Directory structure:** `app/`, `components/layout/`, `components/ui/`, `data/`, `lib/`, `public/`
- **Design tokens:** SSUEW color palette z Phase 1 CSS variables przeportowane do Tailwind config
- **Fonts:** Inter (body) + Plus Jakarta Sans (display/headings) przez `next/font/google`
- **Social icons:** react-icons lub Lucide React

### Claude's Discretion

- Wybór konkretnej wersji pakietów (używaj latest stable)
- Implementacja szczegółów animacji Framer Motion (easing, duration)
- Dokładna implementacja Lenis hook (useEffect + rafDriver lub standardowy)
- Shadcn/ui vs custom components dla UI elements
- Sposób obsługi active state w Navbar (usePathname)

### Deferred Ideas (OUT OF SCOPE)

- Shadcn/ui full setup — Phase 2 dodaje tylko bazowe komponenty, nie cały system
- Dark mode — nie w scope tego projektu
- i18n (PL/EN toggle z Phase 1) — do przemyślenia przy Phase 3, nie w Phase 2
- Google Fonts self-hosting (performance) — Phase 6
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NEXT-01 | Next.js 14 App Router + TypeScript + Tailwind zainicjalizowany, `next export` działa | Manual setup process, package versions, next.config.js pattern |
| NEXT-02 | Design tokens z Phase 1 przeportowane do Tailwind config | CSS variable mapping to Tailwind theme.extend.colors, font config |
| NEXT-03 | Google Fonts (Inter + Plus Jakarta Sans) przez next/font/google | next/font/google API, variable font pattern for layout.tsx |
| NAV-01 | Navbar 2-poziomowy (dropdown desktop + mobile drawer) z pełną strukturą menu | Group hover Tailwind pattern, usePathname for active state, useState for mobile |
| FOOT-01 | Footer z prawdziwymi danymi (adres, social icons, email) | react-icons FaTiktok/FaFacebook/FaLinkedin/FaInstagram, 3-column layout |
| ANIM-01 | Framer Motion fade-in-up przy scroll (`whileInView`, `once: true`) | motion package, 'use client' requirement, whileInView API |
| ANIM-02 | prefers-reduced-motion wyłącza animacje | useReducedMotion hook from motion/react |
| ANIM-03 | Lenis smooth scroll aktywny | lenis package, ReactLenis component or custom LenisProvider with useEffect |
</phase_requirements>

---

## Summary

Phase 2 initializes a Next.js 14 project inside an existing vanilla HTML/CSS/JS repository. The setup is entirely manual — no `create-next-app` in an existing repo — meaning all config files must be created by hand. The project will coexist with vanilla files in the same repo root; the Next.js app lives in `app/` and Next.js config files at the root.

The critical architectural constraint is `output: 'export'` in `next.config.js`, which generates static HTML in `/out`. This eliminates server-side features (API routes, middleware, cookies, rewrites) from the static build — these are reserved for Phase 5 Vercel serverless functions, which is a separate deployment target. The `next export` CLI command was removed in Next.js 14; only `npm run build` with `output: 'export'` config is used.

The animation stack uses the `motion` package (rebranded from `framer-motion` in late 2024 — both `framer-motion` and `motion` are the same library at the same version 12.38.0, but new projects should import from `motion/react`). All motion components require `'use client'` — they cannot run in React Server Components. Lenis has a built-in `lenis/react` subpath export with a `<ReactLenis root />` component that is the recommended integration pattern, eliminating the need for a custom RAF loop.

**Primary recommendation:** Install Next.js 14.2.35 (latest 14.x patch), React 18.3.1, Tailwind CSS 3.4.19, motion 12.38.0, and lenis 1.3.23. Configure `output: 'export'` + `trailingSlash: true` + `images: { unoptimized: true }`. All animation components need `'use client'`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 14.2.35 | Framework — App Router, static export | Latest 14.x patch; locked to 14 per decision |
| react | 18.3.1 | UI runtime | Required peer dep for Next.js 14 (needs ^18.2.0) |
| react-dom | 18.3.1 | DOM renderer | Required peer dep |
| typescript | 5.x (latest) | Type safety | next installs types via @types/react |
| tailwindcss | 3.4.19 | Utility CSS | Locked to v3 per decision; v4 is current but breaking API change |
| postcss | 8.x | CSS processing | Required by Tailwind v3 |
| autoprefixer | latest | Vendor prefixes | Required by Tailwind v3 toolchain |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| motion | 12.38.0 | Animation (formerly framer-motion) | All scroll-triggered and interactive animations |
| lenis | 1.3.23 | Smooth scroll | Root layout provider |
| react-icons | 5.6.0 | Social media icons (FaTiktok, FaFacebook, etc.) | Footer social links |
| lucide-react | 1.16.0 | General UI icons (nav, cards, etc.) | UI icons throughout |
| clsx | 2.1.1 | Conditional className utility | Combining Tailwind classes conditionally |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| motion (12.x) | framer-motion (12.x) | Same package, same version — framer-motion is just an alias; use motion/react imports for new projects |
| lenis/react (ReactLenis component) | Custom useEffect RAF loop | ReactLenis is official, maintained, less boilerplate |
| react-icons | @heroicons/react | react-icons has FaTiktok; Heroicons does not |
| tailwindcss v3 | tailwindcss v4 | v4 has breaking config API (no tailwind.config.js); decision locked to v3 |

### Installation

```bash
# Step 1: Core Next.js stack
npm install next@14.2.35 react@18.3.1 react-dom@18.3.1

# Step 2: TypeScript + types
npm install -D typescript @types/react@18.3.28 @types/react-dom @types/node

# Step 3: Tailwind CSS v3 (MUST pin to v3, not latest which is v4)
npm install -D tailwindcss@^3 postcss autoprefixer
npx tailwindcss init -p

# Step 4: Animation libraries
npm install motion lenis

# Step 5: UI utilities
npm install react-icons lucide-react clsx
```

### Version verification (confirmed from npm registry, 2026-05-15)

- `next@14.2.35` — latest patch in 14.x series (verified)
- `tailwindcss@3.4.19` — latest v3 patch (verified; latest overall is v4.3.0, DO NOT use)
- `motion@12.38.0` — same codebase as `framer-motion@12.38.0` (verified)
- `lenis@1.3.23` — has built-in `lenis/react` subpath export (verified)
- `react@18.3.1` — latest React 18 patch; Next.js 14 requires ^18.2.0 (verified)
- Node.js 24.11.0 on this machine — exceeds Next.js minimum of 20.9

---

## Architecture Patterns

### Recommended Project Structure

```
(repo root)
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: fonts, LenisProvider, Navbar, Footer
│   ├── page.tsx                # Home page placeholder
│   ├── globals.css             # @tailwind directives + global resets
│   └── (public)/               # Route group for public pages (Phase 3-4)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # 'use client' — has useState for mobile menu
│   │   ├── Footer.tsx          # Server component — static data
│   │   └── LenisProvider.tsx   # 'use client' — ReactLenis root wrapper
│   └── ui/                     # Base UI components
│       ├── Button.tsx
│       └── FadeUp.tsx          # 'use client' — motion wrapper for scroll animations
├── data/
│   ├── navigation.ts           # Typed menu structure (NavItem[])
│   ├── social.ts               # Social media links
│   └── contact.ts              # Contact info
├── lib/
│   └── utils.ts                # cn() helper (clsx)
├── public/
│   └── assets/
│       └── logos/
│           └── logo.png        # Copied from repo root logo_2.png
├── next.config.js              # output: 'export', trailingSlash: true, images unoptimized
├── tailwind.config.js          # theme.extend with SSUEW colors + fonts
├── postcss.config.js           # tailwindcss + autoprefixer plugins
└── tsconfig.json               # strict: true, paths: @/*
```

### Pattern 1: Static Export Configuration

**What:** `next.config.js` required settings for static HTML generation
**When to use:** Always — this is the locked deployment target

```js
// next.config.js
// Source: https://nextjs.org/docs/app/guides/static-exports
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },  // REQUIRED: next/image optimization requires server
}
module.exports = nextConfig
```

**Critical:** `next export` CLI is REMOVED in Next.js 14. Use only `npm run build`. The build command generates `/out` when `output: 'export'` is set.

Package.json scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Pattern 2: Tailwind CSS v3 Configuration with Design Tokens

**What:** `tailwind.config.js` with SSUEW color palette ported from Phase 1 `style.css`
**When to use:** Foundation configuration — defines all design tokens

```js
// tailwind.config.js
// Source: https://nextjs.org/docs/app/guides/tailwind-v3-css
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ssuew-black': '#1a2340',    // --text from style.css
        'ssuew-white': '#ffffff',
        'ssuew-gray-100': '#f0f7ff', // --bg-alt
        'ssuew-gray-200': '#d6e9ff', // --border
        'ssuew-gray-600': '#6B7A99', // --text-muted
        'primary': '#3BAEFF',        // --primary
        'primary-dark': '#1A8FE3',   // --primary-dark
        'primary-light': '#EAF5FF',  // --primary-light
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        'brand': '16px',   // --radius
        'brand-sm': '8px', // --radius-sm
      },
      boxShadow: {
        'brand': '0 4px 24px rgba(59, 174, 255, 0.12)',
        'brand-hover': '0 8px 40px rgba(59, 174, 255, 0.22)',
      },
      maxWidth: {
        'brand': '1200px',  // --max-width
      },
    },
  },
  plugins: [],
}
```

`app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**postcss.config.js** (generated by `npx tailwindcss init -p`):
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Pattern 3: Google Fonts via next/font/google

**What:** Self-hosted fonts via Next.js built-in font optimization — no external requests
**When to use:** Root layout only; CSS variables propagate to Tailwind config

```tsx
// app/layout.tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import 'lenis/dist/lenis.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="font-sans">
        <LenisProvider>
          <Navbar />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}
```

**Key insight:** Use CSS variable mode (`variable: '--font-inter'`) so Tailwind `fontFamily` config picks it up via `var(--font-inter)`.

**Plus_Jakarta_Sans** — the Next.js import name is `Plus_Jakarta_Sans` (underscores, not spaces). The font IS available in `next/font/google`.

### Pattern 4: LenisProvider with lenis/react

**What:** Official React integration — `<ReactLenis root />` wraps the app in root layout
**When to use:** Root layout client component wrapper

```tsx
// components/layout/LenisProvider.tsx
// Source: npm lenis@1.3.23 lenis/react subpath export
'use client'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ duration: 1.2, syncTouch: false }}>
      {children}
    </ReactLenis>
  )
}
```

**Alternative pattern** (custom, from CONTEXT.md specifics — also valid):
```tsx
// components/layout/LenisProvider.tsx
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true })
    return () => lenis.destroy()
  }, [])
  return <>{children}</>
}
```

**Note:** `autoRaf: true` (default in lenis 1.x) handles the requestAnimationFrame loop internally — no manual RAF needed. The CONTEXT.md pattern uses manual RAF and is also valid but more verbose.

### Pattern 5: Framer Motion / motion whileInView

**What:** Scroll-triggered animations with `motion` package
**When to use:** Any component that fades in on scroll

```tsx
// components/ui/FadeUp.tsx
// Source: https://motion.dev/docs/react
'use client'
import { motion, useReducedMotion } from 'motion/react'

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={shouldReduce ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

**Important:** Import from `'motion/react'`, NOT `'framer-motion'` or `'motion'` (the latter is for vanilla JS). All files using `motion` components must have `'use client'` directive.

### Pattern 6: Navbar with 2-Level Dropdown + Mobile Drawer

**What:** Desktop hover dropdown + mobile hamburger drawer with accordion submenu
**When to use:** `components/layout/Navbar.tsx` — must be `'use client'` for state

```tsx
// components/layout/Navbar.tsx (skeleton)
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { navItems } from '@/data/navigation'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'backdrop-blur-md bg-white/80 shadow-sm' : 'bg-transparent'
    }`}>
      {/* Desktop: group/hover dropdown */}
      {/* Mobile: hamburger + slide-down drawer with accordion */}
    </nav>
  )
}
```

Desktop dropdown pattern (Tailwind group-hover):
```tsx
// Each nav item with children
<div className="relative group">
  <Link href={item.href}>{item.label}</Link>
  {item.children && (
    <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-brand rounded-brand-sm min-w-48 py-2">
      {item.children.map(child => (
        <Link key={child.href} href={child.href} className="block px-4 py-2 hover:text-primary">
          {child.label}
        </Link>
      ))}
    </div>
  )}
</div>
```

### Pattern 7: Navigation Data Structure

```ts
// data/navigation.ts
export interface NavChild {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavChild[]
  highlight?: boolean  // for "Strefa Działacza" button variant
}

export const navItems: NavItem[] = [
  { label: 'Strona Główna', href: '/' },
  {
    label: 'Strefa Studenta',
    href: '/dla-studenta',
    children: [
      { label: 'Prawa Studenta', href: '/prawa-studenta' },
      { label: 'Infopacki', href: '/infopacki' },
      // ... rest from CONTEXT.md
    ],
  },
  // ... rest of structure
  { label: 'Strefa Działacza', href: '/strefa-dzialacza', highlight: true },
]
```

### Pattern 8: TypeScript Config with Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Anti-Patterns to Avoid

- **Using `next export` script:** It was removed in Next.js 14. Use `next build` only; the `output: 'export'` config handles static generation.
- **Importing from `'framer-motion'` on new code:** Import from `'motion/react'` instead. Both work but `motion/react` is the forward-compatible path.
- **Using motion components in Server Components:** All `motion.*` components require `'use client'`. Wrap in a client component or mark the file itself as client.
- **Using `tailwindcss@latest`:** This installs v4 which has breaking config changes (no `tailwind.config.js`, different directives). Pin to `tailwindcss@^3`.
- **Using `@studio-freight/lenis` or `@studio-freight/react-lenis`:** These are deprecated packages from the old Studio Freight name. Use `lenis` (the main package) with `lenis/react` subpath.
- **Missing `images: { unoptimized: true }` in next.config.js:** The default Next.js image optimizer requires a Node.js server. Static export will throw a build error without this.
- **`usePathname()` in Server Components:** Requires `'use client'` — only use in client components.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading with no layout shift | Custom `<link>` to Google Fonts | `next/font/google` | Self-hosts fonts, eliminates CLS, preloads automatically |
| Smooth scroll physics | Custom cubic-bezier RAF loop | lenis (lenis/react) | Handles touch, keyboard, programmatic scroll; battle-tested physics |
| Scroll-triggered animations | IntersectionObserver + class toggling | `motion` `whileInView` | Handles threshold, once, exit, spring — 30+ edge cases |
| Reduced motion detection | CSS media query only | `useReducedMotion()` from motion | Reactive to runtime preference changes, works with SSR |
| ClassName merging | String concatenation | `clsx` | Handles falsy values, array merging; 1.5KB |
| Active nav link detection | window.pathname string comparison | `usePathname()` from next/navigation | Works with App Router's RSC navigation model |

**Key insight:** The animation surface area looks simple but has 20+ edge cases — scroll direction, element visibility threshold, hydration timing, reduced motion, interruptibility. Use the libraries.

---

## Common Pitfalls

### Pitfall 1: Tailwind v4 Installed Instead of v3

**What goes wrong:** `npm install tailwindcss` or `npm install tailwindcss@latest` installs v4 (4.3.0). v4 has no `tailwind.config.js` and uses `@import "tailwindcss"` instead of `@tailwind base/components/utilities`. Config API is completely different.
**Why it happens:** Default npm behavior installs latest; v4 is now the latest.
**How to avoid:** Always pin: `npm install -D tailwindcss@^3 postcss autoprefixer`
**Warning signs:** Build error `Cannot find module 'tailwindcss/plugin'`, or `tailwind.config.js` being ignored.

### Pitfall 2: Motion Components Not Marked as Client

**What goes wrong:** Build error `You're importing a component that needs "use client"` or animation props silently ignored.
**Why it happens:** `motion.div`, `AnimatePresence`, `useReducedMotion` are client-only APIs.
**How to avoid:** Any file importing from `'motion/react'` must have `'use client'` at top. Create wrapper components (`FadeUp.tsx`, `AnimatedSection.tsx`) that are always client components.
**Warning signs:** Build error during `next build` about server components using client hooks.

### Pitfall 3: Static Export Breaks at Build with Dynamic Routes

**What goes wrong:** `next build` fails with `Page "/[slug]" is missing "generateStaticParams()"`.
**Why it happens:** Dynamic routes require `generateStaticParams()` to pre-render all possible paths in static export mode.
**How to avoid:** Phase 2 has no dynamic routes — only static pages. Placeholder page is just `app/page.tsx`. This becomes relevant in Phase 3+.
**Warning signs:** Build error mentioning `dynamicParams`.

### Pitfall 4: Lenis Conflicts with Next.js `<html>` Scroll Behavior

**What goes wrong:** Lenis `root` option takes over `<html>` element scroll. If `html { scroll-behavior: smooth }` is also set (from globals.css), there can be double-smooth behavior or conflicts.
**Why it happens:** `ReactLenis root` sets up Lenis on the `<html>` element; Lenis handles all smooth scrolling itself.
**How to avoid:** Remove `scroll-behavior: smooth` from globals.css. Let Lenis handle all scroll physics.
**Warning signs:** Jerky or double-animated scroll on link clicks.

### Pitfall 5: `usePathname()` Returns `/` on Static Pages

**What goes wrong:** Active state highlighting doesn't work correctly, or throws hydration mismatch errors.
**Why it happens:** During static export build, `usePathname()` renders to whatever path is being built. Should be fine for active nav but watch for SSR/client mismatch.
**How to avoid:** Use it normally in `'use client'` components. Don't use it in server components.
**Warning signs:** Console warning about hydration mismatch on pathname.

### Pitfall 6: `next/image` Requires `images: { unoptimized: true }` for Static Export

**What goes wrong:** Build fails with error about Image Optimization API requiring a server.
**Why it happens:** Default `next/image` uses a Node.js serverless optimizer.
**How to avoid:** Set `images: { unoptimized: true }` in `next.config.js`. Already in CONTEXT.md specifics.
**Warning signs:** Build error mentioning `Image Optimization API`.

### Pitfall 7: `lenis/dist/lenis.css` Import Location

**What goes wrong:** Visual scroll layout glitches on certain browsers.
**Why it happens:** Lenis needs its CSS for proper overflow handling of the scroll container.
**How to avoid:** Import `'lenis/dist/lenis.css'` in `app/layout.tsx` (at root, not in the provider component, to ensure it's included in the CSS bundle).
**Warning signs:** Overscroll bounce or layout jump on initial load.

---

## Code Examples

### Complete `next.config.js`

```js
// Source: https://nextjs.org/docs/app/guides/static-exports
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}
module.exports = nextConfig
```

### Root Layout with Fonts + Lenis

```tsx
// app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { LenisProvider } from '@/components/layout/LenisProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'
import 'lenis/dist/lenis.css'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' })

export const metadata: Metadata = {
  title: 'Samorząd Studentów UEW',
  description: 'Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans text-ssuew-black bg-white antialiased">
        <LenisProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}
```

### LenisProvider (recommended pattern)

```tsx
// components/layout/LenisProvider.tsx
'use client'
import { ReactLenis } from 'lenis/react'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ duration: 1.2, syncTouch: false }}>
      {children}
    </ReactLenis>
  )
}
```

### FadeUp wrapper component

```tsx
// components/ui/FadeUp.tsx
'use client'
import { motion, useReducedMotion } from 'motion/react'

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const shouldReduce = useReducedMotion()
  if (shouldReduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      viewport={{ once: true, margin: '-80px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### `lib/utils.ts` — cn() helper

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
```

### Footer with real data and react-icons

```tsx
// components/layout/Footer.tsx
import { FaTiktok, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-ssuew-black text-white py-16">
      <div className="max-w-brand mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Col 1: Address */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-ssuew-gray-200 mb-4">Adres</h4>
            <p className="text-white/60 text-sm leading-relaxed">
              ul. Kamienna 43<br />
              53-307 Wrocław<br />
              Budynek J, pokój 9
            </p>
          </div>
          {/* Col 2: Social */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-ssuew-gray-200 mb-4">Social Media</h4>
            <div className="flex gap-3">
              <a href="https://www.tiktok.com/@samorzaduew" aria-label="TikTok" className="..."><FaTiktok /></a>
              <a href="https://www.facebook.com/samorzad.ue/" aria-label="Facebook" className="..."><FaFacebook /></a>
              <a href="https://www.linkedin.com/company/..." aria-label="LinkedIn" className="..."><FaLinkedin /></a>
              <a href="https://www.instagram.com/samorzad.ue/" aria-label="Instagram" className="..."><FaInstagram /></a>
            </div>
          </div>
          {/* Col 3: Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-ssuew-gray-200 mb-4">Kontakt</h4>
            <a href="mailto:kontakt@samorzad.ue.wroc.pl" className="text-primary hover:text-primary-dark text-sm">
              kontakt@samorzad.ue.wroc.pl
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-white/40 text-sm">
          © 2026 Samorząd Studentów UEW
        </div>
      </div>
    </footer>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next export` CLI command | `output: 'export'` in next.config.js + `next build` | Next.js 14.0.0 (Oct 2023) | Must update scripts — old command throws error |
| `framer-motion` package | `motion` package, import from `motion/react` | Late 2024 (v11+) | Both packages at same version 12.38.0; both maintained |
| `@studio-freight/lenis` | `lenis` (main package) + `lenis/react` subpath | 2024 (rebranded to darkroom) | Old packages deprecated; new ones actively maintained |
| `@studio-freight/react-lenis` | `lenis/react` (subpath of main `lenis` package) | 2024 | No separate install needed |
| Tailwind v3 `tailwind.config.js` | Tailwind v4 CSS-first config | Tailwind v4.0 (Jan 2025) | **Breaking change** — v3 still actively maintained; decision locked to v3 |
| `next/font` CSS variable without `variable:` option | `variable: '--font-name'` option | Next.js 13.2+ | Enables Tailwind integration via CSS custom properties |

**Deprecated/outdated:**
- `@studio-freight/lenis`: Deprecated — use `lenis`
- `@studio-freight/react-lenis`: Deprecated — use `lenis/react` subpath
- `framer-motion` imports on new code: Not deprecated but `motion/react` is preferred going forward
- `next export` CLI: Removed in Next.js 14 — use `output: 'export'` config

---

## Open Questions

1. **Coexistence of vanilla HTML files and Next.js in same repo root**
   - What we know: Next.js only processes files in `app/` and listed component paths; vanilla `.html` files at root are not touched
   - What's unclear: Whether Netlify (current hosting) picks up both vanilla and Next.js build artifacts from same root, or if there's a conflict
   - Recommendation: The planner should add a task to verify `out/` directory doesn't conflict with root `.html` files; potentially add `distDir: 'out'` explicitly and ensure Netlify deploy config targets `out/`

2. **`lenis/dist/lenis.css` path in future lenis versions**
   - What we know: In lenis 1.3.23, the CSS is at `lenis/dist/lenis.css`
   - What's unclear: If lenis ships the CSS correctly in all bundler setups; some reports suggest the import path can vary
   - Recommendation: If `lenis/dist/lenis.css` import throws, alternative is to copy the CSS content manually into globals.css

3. **Next.js version: 14 vs 15**
   - What we know: Next.js 15 (React 19) is now in `@latest` (16.2.6); Next.js 14 (React 18) is locked decision; 14.2.35 is the latest 14.x patch
   - What's unclear: Whether there are security patches that only apply to 15.x
   - Recommendation: Stay on 14.x per locked decision; the Phase 5 API routes (NextAuth v5) need verification against Next.js 14 compatibility when that phase begins

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js runtime | Yes | 24.11.0 | — |
| npm | Package management | Yes | 11.6.1 | — |
| npx | `tailwindcss init` | Yes | 11.6.1 | — |
| Git | Version control | Yes | (confirmed in repo) | — |
| Internet (Google Fonts) | `next/font/google` at build | Yes (assumed) | — | Use `next/font/local` with downloaded font files |

**Missing dependencies with no fallback:** None.

**Notes:**
- Node.js 24.11.0 exceeds Next.js 14 minimum of 20.9. No version upgrade needed.
- `next@14.2.35` needs `react@^18.2.0` — this must be installed explicitly (current latest React is 19.x; npm would resolve to 19 without pinning).

---

## Sources

### Primary (HIGH confidence)
- `https://nextjs.org/docs/app/guides/static-exports` — official static export docs, verified features and unsupported list
- `https://nextjs.org/docs/app/guides/tailwind-v3-css` — official Next.js Tailwind v3 setup guide (distinct from v4 guide)
- `https://nextjs.org/docs/app/getting-started/installation` — manual setup steps, package.json scripts
- `https://nextjs.org/docs/app/getting-started/fonts` — next/font/google API, variable font pattern
- `npm view next@14.2.35` — version verified directly from npm registry
- `npm view tailwindcss@3 version` — v3.4.19 confirmed; v4.3.0 is current `@latest`
- `npm view lenis@1.3.23 exports` — confirmed `lenis/react` subpath export exists
- `npm view motion dist-tags` — v12.38.0 confirmed as latest
- `https://motion.dev/docs/react-upgrade-guide` — confirmed `motion/react` import pattern

### Secondary (MEDIUM confidence)
- `https://bridger.to/lenis-nextjs` — Lenis Next.js App Router implementation pattern (verified against official lenis/react API)
- `https://inhaq.com/blog/framer-motion-complete-guide-react-nextjs-developers` — motion/react + Next.js patterns (verified against motion.dev upgrade guide)
- npm registry `lenis/react` exports structure (HIGH — direct npm view output)

### Tertiary (LOW confidence — for awareness only)
- Various blog posts on Tailwind + Next.js dropdown navbar patterns — useful direction but not authoritative

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified directly from npm registry
- Next.js static export config: HIGH — verified against official Next.js docs (current version 16.2.6)
- Tailwind v3 setup: HIGH — official Next.js v3 guide found and verified
- motion/Framer Motion patterns: HIGH — verified against motion.dev upgrade guide + npm registry
- Lenis integration: MEDIUM-HIGH — lenis/react subpath confirmed from npm exports; implementation pattern from community source cross-verified against package API
- Architecture patterns: HIGH — based on locked CONTEXT.md decisions + official docs
- Pitfalls: HIGH — based on official changelog (next export removal), npm version data (tailwind v4), and verified package deprecations

**Research date:** 2026-05-15
**Valid until:** 2026-06-15 (30 days; Next.js 14.x patch releases could occur but won't change API)
