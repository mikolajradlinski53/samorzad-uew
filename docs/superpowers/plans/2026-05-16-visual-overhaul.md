# Visual Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dark-mode-by-default full-site theme toggle (🌙/☀️) + animated hero redesign with dot-grid background + cursor spotlight + Level-2 hover animations on all cards.

**Architecture:** CSS custom properties on `<html data-theme="dark|light">` drive all colour tokens. A `ThemeProvider` (mirrors existing `LangProvider`) sets the attribute and persists to `localStorage`. Hero is fully rewritten; all section/card components swap hard-coded Tailwind colours for CSS-var arbitrary values. A new `TiltCard` client wrapper adds 3-D hover tilt + glow-border to cards.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS v3 (arbitrary CSS-var values), `motion/react` (already installed), vanilla CSS keyframes in `globals.css`.

---

## Task 1 — CSS Variables + ThemeProvider + ThemeToggle + layout wiring

**Files:**
- Modify: `app/globals.css`
- Create: `lib/theme.tsx`
- Create: `components/ui/ThemeToggle.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1 — Add CSS custom properties and keyframes to `app/globals.css`**

Append after the last existing line:

```css
/* ── Theme tokens ─────────────────────────────────────── */
:root {
  --bg-page:    #1A2340;
  --bg-section: #162035;
  --bg-alt:     #0f1829;
  --bg-card:    #1e2d4a;
  --text:       #ffffff;
  --text-muted: rgba(255,255,255,0.6);
  --border:     rgba(255,255,255,0.08);
  --dot-color:  rgba(59,174,255,0.18);
}
[data-theme="light"] {
  --bg-page:    #ffffff;
  --bg-section: #F0F7FF;
  --bg-alt:     #EAF5FF;
  --bg-card:    #ffffff;
  --text:       #1A2340;
  --text-muted: #6B7A99;
  --border:     #D6E9FF;
  --dot-color:  rgba(26,35,64,0.07);
}

/* ── Keyframes ────────────────────────────────────────── */
@keyframes dots-drift {
  0%   { background-position: 0 0; }
  100% { background-position: 28px 28px; }
}
@keyframes blob-float {
  0%, 100% { transform: scale(1) translateY(0); }
  50%       { transform: scale(1.06) translateY(-18px); }
}
@keyframes shimmer-btn {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
```

- [ ] **Step 2 — Create `lib/theme.tsx`**

```tsx
'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const initial: Theme = stored === 'light' ? 'light' : 'dark'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
```

- [ ] **Step 3 — Create `components/ui/ThemeToggle.tsx`**

```tsx
'use client'
import { useTheme } from '@/lib/theme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors duration-200 hover:text-primary"
      style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
      aria-label={theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
```

- [ ] **Step 4 — Wrap layout with `ThemeProvider` in `app/layout.tsx`**

Replace the existing `export default function RootLayout` body so `ThemeProvider` wraps `LangProvider`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased" style={{ background: 'var(--bg-page)', color: 'var(--text)' }}>
        <ThemeProvider>
          <LangProvider>
            <LenisProvider>
              <Navbar />
              <main id="main-content">
                {children}
              </main>
              <Footer />
              <ChatWidget />
            </LenisProvider>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

Add the import at the top of `app/layout.tsx`:
```tsx
import { ThemeProvider } from '@/lib/theme'
```

- [ ] **Step 5 — Add `ThemeToggle` to Navbar**

In `components/layout/Navbar.tsx`, add the import:
```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle'
```

Find the desktop nav actions area (near where `LangToggle` is rendered). Add `<ThemeToggle />` immediately after `<LangToggle />`:
```tsx
<LangToggle />
<ThemeToggle />
```

Find the mobile drawer bottom area (near the mobile `<LangToggle />`). Add `<ThemeToggle />` after it:
```tsx
<LangToggle />
<ThemeToggle />
```

- [ ] **Step 6 — Verify build**

```bash
npm run build
```

Expected: no TypeScript errors, build succeeds. The page will look visually unchanged at this stage (theme tokens default to dark which matches current colours).

- [ ] **Step 7 — Commit**

```bash
git add app/globals.css lib/theme.tsx components/ui/ThemeToggle.tsx app/layout.tsx components/layout/Navbar.tsx
git commit -m "feat: add dark/light theme system with CSS vars and ThemeToggle"
```

---

## Task 2 — Hero Section redesign

**Files:**
- Modify: `components/sections/HeroSection.tsx` (full rewrite)
- Modify: `app/(public)/page.tsx` (remove StatsSection)

- [ ] **Step 1 — Rewrite `components/sections/HeroSection.tsx`**

Replace the entire file:

```tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { FaTiktok, FaFacebook, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { socialLinks } from '@/data/social'

const subtitles = [
  'Działamy na rzecz studentów',
  'Wspieramy Was w walce o prawa studenckie',
  'Inspirujemy do podejmowania nowych inicjatyw',
]

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  tiktok:    FaTiktok,
  facebook:  FaFacebook,
  linkedin:  FaLinkedinIn,
  instagram: FaInstagram,
}

const stats = [
  { value: '6000+', label: 'Studentów' },
  { value: '9',     label: 'Projektów / rok' },
  { value: '30+',   label: 'Lat działalności' },
  { value: '15+',   label: 'Partnerów' },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [spotlight, setSpotlight] = useState(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) return
    const id = setInterval(() => setCurrentIndex(i => (i + 1) % subtitles.length), 3000)
    return () => clearInterval(id)
  }, [shouldReduce])

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setSpotlight(true)
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[72px]"
      style={{ background: 'var(--bg-page)' }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setSpotlight(false)}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(var(--dot-color) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          animation: shouldReduce ? 'none' : 'dots-drift 20s linear infinite',
        }}
      />

      {/* Gradient blobs */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 500, height: 500, top: -100, right: -100,
          background: 'radial-gradient(circle, rgba(59,174,255,0.14) 0%, transparent 65%)',
          animation: shouldReduce ? 'none' : 'blob-float 10s ease-in-out infinite',
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 350, height: 350, bottom: -80, left: -60,
          background: 'radial-gradient(circle, rgba(59,174,255,0.09) 0%, transparent 65%)',
          animation: shouldReduce ? 'none' : 'blob-float 14s ease-in-out infinite reverse',
        }}
      />

      {/* Cursor spotlight */}
      {spotlight && !shouldReduce && (
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 420, height: 420,
            background: 'radial-gradient(circle, rgba(59,174,255,0.09) 0%, transparent 70%)',
            left: mouse.x - 210,
            top: mouse.y - 210,
            transition: 'left 0.08s linear, top 0.08s linear',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-brand mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">

        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold tracking-[2px] uppercase text-primary">
            Samorząd Studentów UEW · Wrocław
          </span>
        </div>

        {/* H1 */}
        <h1
          className="font-display text-display-xl max-w-3xl"
          style={{ color: 'var(--text)' }}
        >
          Działamy dla{' '}
          <span className="text-primary">Ciebie</span>
        </h1>

        {/* Rotating subtitle */}
        <div className="h-7 flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="text-sm font-semibold"
              style={{ color: 'var(--text-muted)' }}
            >
              {subtitles[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/nasza-dzialalnosc"
            className="inline-flex items-center justify-center font-bold rounded-full px-8 py-3.5 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{
              background: 'linear-gradient(90deg, #3BAEFF, #1A8FE3, #3BAEFF)',
              backgroundSize: '200% 100%',
              animation: shouldReduce ? 'none' : 'shimmer-btn 3s ease-in-out infinite',
            }}
          >
            Poznaj samorząd ↗
          </Link>
          <Link
            href="/dla-studenta"
            className="inline-flex items-center justify-center font-bold rounded-full px-8 py-3.5 text-sm border-2 transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Strefa Studenta
          </Link>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => {
            const Icon = socialIcons[link.platform]
            if (!Icon) return null
            return (
              <a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-primary hover:border-primary hover:text-white"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                <Icon size={14} />
              </a>
            )
          })}
        </div>

        {/* Stats bar */}
        <div
          className="flex flex-wrap justify-center gap-8 mt-4 pt-8 w-full max-w-2xl"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-display-lg text-primary leading-none">{s.value}</div>
              <div
                className="text-[10px] font-bold uppercase tracking-widest mt-1"
                style={{ color: 'var(--text-muted)' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 2 — Remove `StatsSection` from `app/(public)/page.tsx`**

In `app/(public)/page.tsx`, delete the import line:
```tsx
import { StatsSection } from '@/components/sections/StatsSection'
```

And delete the JSX usage:
```tsx
<StatsSection />
```

- [ ] **Step 3 — Verify build**

```bash
npm run build
```

Expected: no errors. Homepage should be 6–8 kB (larger than before due to richer hero).

- [ ] **Step 4 — Commit**

```bash
git add components/sections/HeroSection.tsx app/(public)/page.tsx
git commit -m "feat: redesign hero — dark bg, dot grid, cursor spotlight, inline stats"
```

---

## Task 3 — Section and card colour updates for dark/light

**Files:**
- Modify: `components/sections/AboutSection.tsx`
- Modify: `components/sections/NewsSection.tsx`
- Modify: `components/sections/ProjectsPreview.tsx`
- Modify: `components/sections/TeamPreview.tsx`
- Modify: `components/sections/ContactSection.tsx`
- Modify: `components/cards/ProjectCard.tsx`
- Modify: `components/cards/MemberCard.tsx`

The pattern for every section: replace hard-coded `bg-white`, `bg-ssuew-gray-100`, `text-ssuew-black`, `text-ssuew-gray-600`, `border-ssuew-gray-200` with CSS-var inline styles or `bg-[var(--bg-*)]` Tailwind arbitrary values.

- [ ] **Step 1 — Update `components/sections/AboutSection.tsx`**

```tsx
import { FadeUp } from '@/components/ui/FadeUp'

export function AboutSection() {
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-brand mx-auto px-6">
        <FadeUp>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-display-lg mb-6" style={{ color: 'var(--text)' }}>
              O nas
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu to reprezentacja
              wszystkich studentów UEW. Działamy na rzecz społeczności akademickiej, dbamy
              o interesy studentów, współtworzymy życie uczelni oraz inicjujemy projekty
              edukacyjne, społeczne i integracyjne. Jesteśmy łącznikiem między studentami
              a władzami uczelni i realnie wpływamy na to, jak studiuje się na UEW.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
```

- [ ] **Step 2 — Update `components/sections/NewsSection.tsx`**

The tag colour map maps category name → `{ bg, text }` CSS colours (not Tailwind classes, to avoid purge issues):

```tsx
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Ogłoszenie: { bg: 'rgba(200,100,255,0.12)', color: '#9b45d4' },
  Wydarzenie:  { bg: 'rgba(59,174,255,0.12)',  color: '#3BAEFF' },
  Projekt:     { bg: 'rgba(255,180,0,0.12)',    color: '#e6a800' },
  Informacja:  { bg: 'rgba(100,220,130,0.12)',  color: '#2e8b57' },
}

const news = [
  { slug: '#', tag: 'Ogłoszenie', date: 'Maj 2025',    title: 'Wyniki wyborów do Zarządu SSUEW 2025',   excerpt: 'Przedstawiamy skład nowo wybranego Zarządu Samorządu Studentów UEW na kadencję 2025/2026.' },
  { slug: '#', tag: 'Wydarzenie', date: 'Kwiecień 2025', title: 'ADAPCIAK 2025 — relacja',               excerpt: 'Ponad 300 studentów wzięło udział w tegorocznym obozie adaptacyjnym. Dziękujemy za wspaniałą atmosferę!' },
  { slug: '#', tag: 'Projekt',    date: 'Marzec 2025',  title: 'TEDxUEW już w maju',                     excerpt: 'Zapraszamy na kolejną edycję konferencji TEDxUEW. Prelegenci, networking i inspirujące rozmowy.' },
  { slug: '#', tag: 'Informacja', date: 'Luty 2025',    title: 'Zmiany w regulaminie studiów',           excerpt: 'Zarząd SSUEW wypracował nowe zapisy regulaminowe chroniące prawa studentów. Szczegóły wewnątrz.' },
]

export function NewsSection() {
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-brand mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-3">
              aktualności
            </span>
            <h2 className="font-display text-display-lg mb-2" style={{ color: 'var(--text)' }}>
              Co słychać w SSUEW?
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Bądź na bieżąco z życiem samorządu</p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {news.map((item, i) => {
            const tagColor = TAG_COLORS[item.tag] ?? TAG_COLORS['Informacja']
            return (
              <FadeUp key={item.title} delay={i * 0.1}>
                <article
                  className="rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-brand-hover"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-[0.8rem] font-bold rounded-full px-3 py-1"
                      style={{ background: tagColor.bg, color: tagColor.color }}
                    >
                      {item.tag}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.date}</span>
                  </div>
                  <h3 className="font-bold text-base mb-2 leading-snug" style={{ color: 'var(--text)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                    {item.excerpt}
                  </p>
                  <Link href={item.slug} className="text-xs font-bold text-primary hover:underline">
                    Czytaj więcej →
                  </Link>
                </article>
              </FadeUp>
            )
          })}
        </div>
        <div className="text-center mt-10">
          <Link href="#" className="text-primary font-bold hover:underline text-sm">
            Wszystkie aktualności →
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3 — Update `components/cards/ProjectCard.tsx`**

```tsx
import { cn } from '@/lib/utils'

export interface ProjectCardProps {
  title: string
  tag: string
  description: string
  className?: string
}

export function ProjectCard({ title, tag, description, className }: ProjectCardProps) {
  return (
    <div
      className={cn('rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-brand-hover hover:border-primary/40', className)}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <span className="inline-block text-[0.85rem] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
        {tag}
      </span>
      <h3 className="font-display text-display-lg mt-4 mb-3" style={{ color: 'var(--text)' }}>
        {title}
      </h3>
      <p className="text-[0.85rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>
    </div>
  )
}
```

- [ ] **Step 4 — Update `components/sections/ProjectsPreview.tsx`**

```tsx
import Link from 'next/link'
import { projekty } from '@/data/projekty'
import { ProjectCard } from '@/components/cards/ProjectCard'
import { FadeUp } from '@/components/ui/FadeUp'

export function ProjectsPreview() {
  const preview = projekty.slice(0, 4)
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-brand mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-3">
              nasze projekty
            </span>
            <h2 className="font-display text-display-lg mb-2" style={{ color: 'var(--text)' }}>
              Co tworzymy?
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Inicjatywy, które tworzą społeczność akademicką
            </p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {preview.map((projekt, i) => (
            <FadeUp key={projekt.title} delay={i * 0.1}>
              <ProjectCard title={projekt.title} tag={projekt.tag} description={projekt.description} />
            </FadeUp>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/nasze-projekty" className="text-primary font-bold hover:underline text-sm">
            Wszystkie projekty →
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5 — Update `components/cards/MemberCard.tsx`**

```tsx
import { cn } from '@/lib/utils'

interface MemberCardProps {
  initials: string
  name: string
  role: string
  email: string
  description?: string
  className?: string
}

export function MemberCard({ initials, name, role, email, description, className }: MemberCardProps) {
  return (
    <div
      className={cn('flex flex-col sm:flex-row items-start gap-6 p-8 rounded-brand border shadow-brand transition-all duration-300 hover:-translate-y-1 hover:shadow-brand-hover', className)}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="shrink-0 w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-display text-display-xl font-bold">
        {initials}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>{name}</h3>
        <p className="text-[0.85rem] font-bold uppercase tracking-wide text-primary">{role}</p>
        <a
          href={`mailto:${email}`}
          className="text-[0.85rem] hover:text-primary transition-colors duration-200 mt-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {email}
        </a>
        {description && (
          <p className="text-[0.85rem] leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 6 — Update `components/sections/TeamPreview.tsx`**

```tsx
import Link from 'next/link'
import { prezydium } from '@/data/zarzad'
import { MemberCard } from '@/components/cards/MemberCard'
import { FadeUp } from '@/components/ui/FadeUp'

export function TeamPreview() {
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-brand mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-3">
              prezydium
            </span>
            <h2 className="font-display text-display-lg mb-2" style={{ color: 'var(--text)' }}>
              Poznaj nas
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Ludzie stojący za samorządem
            </p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prezydium.map((member, i) => (
            <FadeUp key={member.email} delay={i * 0.1}>
              <MemberCard
                initials={member.initials}
                name={member.name}
                role={member.role}
                email={member.email}
              />
            </FadeUp>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/zarzad" className="text-primary font-bold hover:underline text-sm">
            Cały Zarząd →
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7 — Update `components/sections/ContactSection.tsx`**

```tsx
import Link from 'next/link'
import { contactInfo } from '@/data/contact'

export function ContactSection() {
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-brand mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-3">
            kontakt
          </span>
          <h2 className="font-display text-display-lg mb-2" style={{ color: 'var(--text)' }}>
            Skontaktuj się z nami
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Masz pytanie lub propozycję? Napisz do nas.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto">
          {/* Info */}
          <div
            className="rounded-2xl border p-8"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text)' }}>Adres</h3>
            {contactInfo.addressLines.map((line) => (
              <p key={line} className="text-sm" style={{ color: 'var(--text-muted)' }}>{line}</p>
            ))}
            <h3 className="font-bold text-base mt-6 mb-2" style={{ color: 'var(--text)' }}>Email</h3>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-sm text-primary hover:underline"
            >
              {contactInfo.email}
            </a>
          </div>

          {/* CTA */}
          <div className="rounded-2xl p-8 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #3BAEFF, #1A8FE3)' }}>
            <div>
              <h3 className="font-display text-display-lg text-white mb-3">Masz pytanie?</h3>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                Napisz do nas przez formularz — odpiszemy tak szybko jak to możliwe.
              </p>
            </div>
            <Link
              href="/formularz"
              className="inline-flex items-center justify-center font-bold rounded-full px-6 py-3 text-sm bg-white text-primary hover:bg-white/90 transition-colors duration-200 self-start"
            >
              Wyślij wiadomość ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 8 — Verify build**

```bash
npm run build
```

Expected: succeeds, no errors.

- [ ] **Step 9 — Commit**

```bash
git add components/sections/AboutSection.tsx components/sections/NewsSection.tsx components/sections/ProjectsPreview.tsx components/sections/TeamPreview.tsx components/sections/ContactSection.tsx components/cards/ProjectCard.tsx components/cards/MemberCard.tsx
git commit -m "feat: update all sections and cards to CSS-var dark/light colours"
```

---

## Task 4 — Level 2 animations (TiltCard + gradient border)

**Files:**
- Create: `components/ui/TiltCard.tsx`
- Modify: `components/sections/NewsSection.tsx`
- Modify: `components/sections/ProjectsPreview.tsx`
- Modify: `components/sections/TeamPreview.tsx`

- [ ] **Step 1 — Create `components/ui/TiltCard.tsx`**

```tsx
'use client'
import { useRef, type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function TiltCard({ children, className, style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`
    el.style.boxShadow = '0 16px 40px rgba(59,174,255,0.18)'
    el.style.borderColor = 'rgba(59,174,255,0.3)'
  }

  function onMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.boxShadow = ''
    el.style.borderColor = ''
  }

  return (
    <div
      ref={ref}
      className={cn('[transform-style:preserve-3d] transition-[transform,box-shadow,border-color] duration-200', className)}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2 — Wrap news article cards with `TiltCard` in `components/sections/NewsSection.tsx`**

Add import at top:
```tsx
import { TiltCard } from '@/components/ui/TiltCard'
```

Replace the `<article>` element with `TiltCard` wrapping the article content. The `TiltCard` takes over the border/background/rounded classes from the article:

```tsx
<FadeUp key={item.title} delay={i * 0.1}>
  <TiltCard
    className="rounded-2xl border p-6"
    style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
  >
    <div className="flex items-center gap-3 mb-4">
      <span
        className="text-[0.8rem] font-bold rounded-full px-3 py-1"
        style={{ background: tagColor.bg, color: tagColor.color }}
      >
        {item.tag}
      </span>
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.date}</span>
    </div>
    <h3 className="font-bold text-base mb-2 leading-snug" style={{ color: 'var(--text)' }}>
      {item.title}
    </h3>
    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
      {item.excerpt}
    </p>
    <Link href={item.slug} className="text-xs font-bold text-primary hover:underline">
      Czytaj więcej →
    </Link>
  </TiltCard>
</FadeUp>
```

Remove the hover classes (`hover:-translate-y-1 hover:shadow-brand-hover`) from the old article since `TiltCard` handles them.

- [ ] **Step 3 — Wrap project cards with `TiltCard` in `components/sections/ProjectsPreview.tsx`**

Add import:
```tsx
import { TiltCard } from '@/components/ui/TiltCard'
```

Replace the `<FadeUp><ProjectCard ...></FadeUp>` pattern with:
```tsx
<FadeUp key={projekt.title} delay={i * 0.1}>
  <TiltCard>
    <ProjectCard title={projekt.title} tag={projekt.tag} description={projekt.description} />
  </TiltCard>
</FadeUp>
```

Remove `hover:-translate-y-1 hover:shadow-brand-hover` from `ProjectCard`'s className in `components/cards/ProjectCard.tsx` since `TiltCard` now handles hover state. Change the ProjectCard className to:
```tsx
className={cn('rounded-2xl border p-8 transition-colors duration-200 hover:border-primary/40', className)}
```

- [ ] **Step 4 — Wrap member cards with `TiltCard` in `components/sections/TeamPreview.tsx`**

Add import:
```tsx
import { TiltCard } from '@/components/ui/TiltCard'
```

Replace the `<FadeUp><MemberCard ...></FadeUp>` pattern with:
```tsx
<FadeUp key={member.email} delay={i * 0.1}>
  <TiltCard>
    <MemberCard
      initials={member.initials}
      name={member.name}
      role={member.role}
      email={member.email}
    />
  </TiltCard>
</FadeUp>
```

Remove `hover:-translate-y-1 hover:shadow-brand-hover` from `MemberCard`'s className in `components/cards/MemberCard.tsx`. Change to:
```tsx
className={cn('flex flex-col sm:flex-row items-start gap-6 p-8 rounded-brand border shadow-brand transition-colors duration-200 hover:border-primary/30', className)}
```

- [ ] **Step 5 — Verify build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 6 — Commit**

```bash
git add components/ui/TiltCard.tsx components/sections/NewsSection.tsx components/sections/ProjectsPreview.tsx components/sections/TeamPreview.tsx components/cards/ProjectCard.tsx components/cards/MemberCard.tsx
git commit -m "feat: add TiltCard — 3D hover tilt + glow border on all cards"
```

---

## Task 5 — ENV vars setup guide in DEPLOY.md

**Files:**
- Modify: `DEPLOY.md`

- [ ] **Step 1 — Add env vars section to `DEPLOY.md`**

Add before the existing `## 1. Vercel (Primary — Live Site)` section:

```markdown
## 0. Zmienne środowiskowe — szybki setup

Wszystkie 6 zmiennych należy ustawić w **Vercel Dashboard → Project → Settings → Environment Variables**.

### Generowanie AUTH_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Skopiuj wynik i wklej jako wartość `AUTH_SECRET`.

### Google OAuth (AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET)

1. Otwórz [console.cloud.google.com](https://console.cloud.google.com)
2. Utwórz nowy projekt (lub wybierz istniejący)
3. APIs & Services → Credentials → **+ Create Credentials** → OAuth 2.0 Client ID
4. Application type: **Web application**
5. Authorized redirect URIs — dodaj:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://twoja-domena.vercel.app/api/auth/callback/google`
6. Skopiuj **Client ID** → `AUTH_GOOGLE_ID`
7. Skopiuj **Client Secret** → `AUTH_GOOGLE_SECRET`

### Resend (RESEND_API_KEY + RESEND_FROM_EMAIL)

1. Załóż konto na [resend.com](https://resend.com)
2. API Keys → **+ Create API Key** → skopiuj klucz → `RESEND_API_KEY`
3. Domains → Add domain → zweryfikuj domenę
4. Ustaw `RESEND_FROM_EMAIL` np. `noreply@samorzad.ue.wroc.pl`
   - Jeśli domena nie jest zweryfikowana użyj `onboarding@resend.dev` (limit 1 email/dzień)

### Anthropic (ANTHROPIC_API_KEY)

1. Otwórz [console.anthropic.com](https://console.anthropic.com)
2. API Keys → **+ Create Key** → skopiuj → `ANTHROPIC_API_KEY`
```

- [ ] **Step 2 — Commit**

```bash
git add DEPLOY.md
git commit -m "docs: add ENV vars quick-setup guide to DEPLOY.md"
```

---

## Task 6 — Push and verify on Vercel

- [ ] **Step 1 — Push all commits**

```bash
git push origin main
```

- [ ] **Step 2 — Check Vercel build**

Go to Vercel Dashboard → Deployments. Wait for green build (~2-3 min).

- [ ] **Step 3 — Visual check on live site**

Open the Vercel URL and verify:
- Hero has dark background with animated dot grid ✓
- Moving mouse over hero shows subtle spotlight ✓
- Two CTA buttons visible (shimmer on primary) ✓
- Stats bar at bottom of hero ✓
- 🌙 toggle in navbar switches to light mode ✓
- PL/EN toggle still works ✓
- News cards tilt 3D on hover ✓
- Project and member cards tilt on hover ✓
- All sections readable in both dark and light mode ✓
