# SSUEW — Master Roadmap

> Data: 2026-06-23. Decyzja strategiczna: **hostujemy na Vercel** (nie czekamy na odpowiedź IT — robimy zewnętrznie, migracją zajmiemy się, gdy/ jeśli IT odpowie). Każda faza dostaje własny cykl spec → plan → build (tak jak dotąd).
>
> Stack docelowy: Next.js 16 (App Router) na Vercel · serverless API routes (`app/api/*`) · `next-intl` (PL/EN) · Google Sheets jako CMS · Resend (mail) · integracje przez API. Tożsamość: Archivo + JetBrains Mono, `§`, legitymacja, niebieski #2C4BFF (zrobione).

## Legenda zależności
- 🟢 budowalne od ręki (zero kont/kluczy)
- 🔑 wymaga konta/klucza/rejestracji (podam dokładnie co)
- 🧑 wymaga Twoich danych (zdjęcia, opisy, treść)

---

## FAZA 0 — Fundament / Vercel (odblokowuje wszystko)
Cel: projekt żyje pod publicznym URL z CI/CD i obsługą env.
- 🔑 **git init → GitHub → import do Vercel** (potrzebne: konto GitHub + Vercel; repo dziś NIE jest gitem). Po połączeniu każdy push = deploy.
- 🟢 `vercel.json`/env scaffolding, `.env.example` (mamy), domeny preview.
- 🔑 Domena (opcjonalnie własna; na start `*.vercel.app`).
- 🟢 Analytics (Vercel Analytics / Plausible), `robots`/`sitemap` (mamy).
**Czego potrzebuję od Ciebie:** login GitHub + Vercel (albo zgoda, że Ty klikniesz import wg moich kroków).

## FAZA 1 — Quick wins (bez backendu, część od ręki)
- 🟢 **Ticker ekonomiczny (NBP API)** — *budowany w tym kroku jako down-payment.*
- 🟢 **Split-flap board** (najbliższe wydarzenie/licznik) — zatwierdzone.
- 🟢 **§-explainer** (dymek z przepisem) — zatwierdzone; treść przepisów statyczna.
- 🟢 **Dopieszczenie szczegółów** ("polish pass"): podświetlanie trafień w `/szukaj`, OG per strona (helper jest), skeletony/ładowanie, audyt copy (frontend-design), focus/reduced-motion re-check po legitymacji, mobilne 375px.
- 🧑 **Flaga zdjęć per-sekcja** (żebyś włączał foto grupami) + podmiana realnych zdjęć/loga.

## FAZA 2 — Treść, dane, wersja EN
- 🧑 **Zdjęcia** — wrzucasz do `public/photos/{hero,zycie,zarzad,russ}/`, ja przełączam flagi (instrukcja w `public/photos/README.md`).
- 🧑 **Opisy projektów + realne dane** — nazwy/komisje/statusy projektów, prawdziwe nazwiska Zarządu, realne logo.
- 🟢🧑 **Wersja EN (`next-intl`)** — routing `/pl` `/en`, wydzielenie wszystkich tekstów do plików tłumaczeń (🟢 scaffolding), **tłumaczenie treści** (🧑 — Ty/AI dostarcza EN; mogę wstępnie przetłumaczyć, Ty zatwierdzasz). Przełącznik języka w nav.
- 🟢 **Google Sheets jako CMS** (🔑 klucz Google API) — działacze edytują arkusz → strona zaciąga wydarzenia/partnerów/skład/aktualności. Rozwiązuje aktualizację treści bez kodu.

## FAZA 3 — Integracje „lekkie" (Vercel backend, niska bariera)
- 🔑 **Resend** — formularz kontaktu realnie wysyła (kod gotowy, wystarczy klucz).
- 🔑 **Google Calendar** — widget „co się dzieje" + „dodaj do kalendarza" (publiczny kalendarz Samorządu).
- 🔑 **Google Maps JS API** — interaktywna mapa kampusu (wyszukiwarka sal, „wyznacz trasę").
- 🔑 **Social feed** (Instagram/TikTok oEmbed lub Basic Display) — ściana najnowszych postów.
- 🔑 **Web push (PWA)** — alerty „termin za 3 dni"; mamy manifest.
- 🔑 **MPK Wrocław** — „najbliższy tramwaj na kampus", live odjazdy.

## FAZA 4 — Integracje „ciężkie" (rejestracja/kredencjały)
- 🔑🔑 **USOS SSO + dashboard** (crown jewel) — rejestracja aplikacji u administratora USOS UEW; OAuth; plan/oceny/ECTS/stypendia w naszym UI. „Twój rok na UEW / Wrapped" jako bonus.
- 🔑 **Chatbot RAG** (Klaster 2) — LLM (koszt) + baza wiedzy z treści/regulaminów + barierki (szczelnie zamknięty).
- 🔑 **Płatności** (Przelewy24/Stripe) — bilety na eventy, składki, QR check-in.
- 🔑🔑 **E-voting SKW** — głosowanie online do organów Samorządu (wrażliwe; osobny, ostrożny projekt).

## Cross-cutting (ciągłe)
- 🟢 SEO (mamy JSON-LD/sitemap/OG; rozszerzać), a11y/WCAG (twarde wymaganie), performance (obrazy po realnych zdjęciach), monitoring/error tracking (🔑 Sentry), analytics.

---

## Kolejność wykonania (rekomendacja)
**0 → 1 → 2 → 3 → 4.** Faza 0 (Vercel) odblokowuje 3–4. Faza 1 leci równolegle (nie czeka na nic). Faza 2 czeka głównie na Twoje treści.

## Co odblokowuję natychmiast (dziś)
Ticker NBP (Faza 1) — budowany w tym kroku. Reszta Fazy 1 (split-flap, §-explainer, polish) — kolejne kroki, gdy powiesz „dawaj".
