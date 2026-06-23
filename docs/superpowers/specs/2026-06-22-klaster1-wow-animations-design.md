# Klaster 1 — „Wow" animacje (karty osób + animacje partnerów)

> Spec projektowy. Data: 2026-06-22. Status: zaakceptowany przez użytkownika, gotowy do planu implementacji.
> Część szerszego brainstormingu (3 klastry: 1 frontend-wow [ten spec], 2 chatbot, 3 widget kalendarza). Klastry 2–3 odłożone — zależą od decyzji o hostingu (Vercel vs uczelniany ssFTP) i dostają osobne specy.

## 1. Cel i zakres

Dodać dwa frontendowe efekty „wow", które podnoszą wrażenie i wiarygodność, bez nowej infrastruktury i bez blokerów (hosting/klucze/koszty):

1. **Karty osób** — interaktywne karty dla osób na stronie (Zarząd, organy Samorządu, władze uczelni).
2. **Animacje partnerów** — premium, „dedykowane" animacje uruchamiane przy interakcji z partnerem.

**Marka:** premium-instytucjonalna (DESIGN.md = powściągliwość). Poziom estetyczny = 21st.dev. Zero clip-artu/emoji. Wszystko `transform`/`opacity`, `prefers-reduced-motion`-safe. Stack: `motion/react` + CSS (bez shadcn/lucide/framer; adaptujemy, nie wklejamy).

**Poza zakresem:** realne pliki klatkowe partnerów (przyjdą od użytkownika później — patrz §3.4), efekt cząsteczkowy jako „finisz", chatbot, widget kalendarza.

## 2. Komponent `PersonCard`

Jeden komponent z dwoma trybami, wybieranymi automatycznie na podstawie obecności zdjęcia.

### 2.1 API
```ts
interface PersonCardProps {
  name: string;
  role: string;
  photo?: string;        // URL/ścieżka; brak → tryb inicjałów
  email?: string;
  meta?: string[];       // np. lista kierunków prodziekana
  featured?: boolean;    // większy wariant (np. Rektor, Przewodnicząca)
}
```

### 2.2 Tryby
- **Tryb foto** (`photo` obecne) → **wariant B**: na hover/focus karta lekko się pochyla i skaluje, narasta przyciemnienie (gradient od dołu), a podpis (`name`, `role`) wjeżdża od dołu. `email` opcjonalnie w podpisie.
- **Tryb inicjałów** (brak `photo`) → **wariant A flip 3D**: front = istniejący `InitialsAvatar` (inicjały), po obrocie (hover/focus) tył = `name`, `role`, `email`, `meta`.

### 2.3 Gdzie stosujemy
- **Tryb foto** (wpinamy realne zdjęcia, gdy będą): Board/Zarząd (home), `PrzewodniczacyContent`, RUSS, SKW, karta Rzecznika.
- **Tryb inicjałów (flip):** `WladzeRektorskieContent`, `DziekaniContent` oraz każda osoba bez zdjęcia w powyższych (graceful per-osoba — brak jednego zdjęcia nie psuje siatki).

### 2.4 Dane zdjęć
Rozszerzyć `src/lib/photos.ts` o opcjonalne mapowanie osoba → zdjęcie (lub przekazywać `photo` przez dane komponentu strony). Brak pliku ⇒ tryb inicjałów. Domyślnie zdjęć brak (flaga/placeholdery jak dziś), więc start = wszędzie flip; podmiana = dodanie `photo`.

### 2.5 Dostępność
- `prefers-reduced-motion: reduce` → bez obrotu/tiltu/wjazdu; podpis/dane widoczne statycznie (tryb foto: podpis stale widoczny na przyciemnieniu; tryb inicjałów: dane pokazane bez flipa).
- Karta focusowalna z klawiatury; flip/odsłonięcie podpisu działa także na `:focus-within`.
- Kontrast podpisu na przyciemnieniu ≥ 4.5:1. Tylko `transform`/`opacity`.

## 3. System animacji partnera

### 3.1 Filozofia
„Dedykowanie pod partnera" realizujemy **kolorem marki partnera** (`color`), nie dosłowną ikonką. Motyw branżowy (np. lotnictwo → samolot) zostaje, ale jako wyrafinowana animacja w stylu 21st.dev.

### 3.2 Dane partnera
```ts
interface Partner {
  name: string;
  logo?: string;
  color?: string;        // kolor marki — tinta efektu; brak → akcent UEW
  category?: string;     // klucz szablonu efektu (np. "aviation", "finance")
  frames?: FrameAsset;   // przyszłe pliki klatkowe (patrz §3.4); ma priorytet
}
```

### 3.3 Rozwiązywanie efektu (kolejność)
Funkcja `resolvePartnerEffect(partner)` zwraca komponent/efekt wg priorytetu:
1. **`frames`** — odtwarzacz klatkowy (gdy asset dostarczony). *Dziś nieaktywne — tylko zaprojektowany slot.*
2. **`category`** — szablon z rejestru `partnerEffects` (np. `aviation`).
3. **domyślny** — elegancki efekt (zbliżenie logo + akcentowy sweep) dla partnerów bez kategorii.

### 3.4 Efekt interim (budujemy teraz)
- Motyw kategorii w wariancie **A „line-draw + start"**: cienka, samorysująca się sylwetka (np. samolot dla `aviation`), która następnie „startuje" i znika ze świetlną smugą. Ta sama metoda dla kolejnych kategorii (np. finanse → rosnąca linia).
- Efekt tintowany `color` partnera; tło może użyć istniejącego `AuroraField`/spotlightu.
- **Startowa biblioteka kategorii (v1):** `aviation` (samolot). Kolejne kategorie dokładane tą samą metodą w miarę pojawiania się partnerów (partnerzy to dziś sloty-placeholdery).

### 3.5 Przyszłe pliki klatkowe (slot na później)
Użytkownik dostarczy pliki do efektu **klatkowego** w kafelkach partnerów (sprite-sheet / sekwencja obrazów / Lottie / klatki wideo). System ma być **wymienialny**: gdy `frames` jest obecne, odtwarzacz klatkowy zastępuje efekt CSS bez zmian w stronie. Nie zakuwać efektu na sztywno — efekt CSS to fallback.

### 3.6 Trigger i integracja
- Klik w partnera → istniejący animowany modal partnera (`PartnerzyContent`); animacja gra przy wejściu w modal.
- `prefers-reduced-motion` → spokojne podświetlenie/zbliżenie zamiast ruchu.

## 4. Architektura plików
- `src/components/PersonCard.tsx` — nowy; używa istniejącego `InitialsAvatar`.
- `src/components/partners/PartnerTile.tsx` — kafelek + wybór efektu.
- `src/components/partners/partnerEffects.ts` — rejestr kategorii → efekt + slot na `frames`.
- Integracja w: `Board.tsx`, `PrzewodniczacyContent.tsx`, `RUSSContent.tsx`, `KomisjaWyborczaContent.tsx`, `RzecznikContent.tsx`, `WladzeRektorskieContent.tsx`, `DziekaniContent.tsx`, `PartnerzyContent.tsx`.
- `src/lib/photos.ts` — opcjonalne foto per osoba.
- Bez nowych zależności npm.

## 5. Weryfikacja
- `npx tsc --noEmit`, `npx eslint src`, `npx next build` — wszystko zielone.
- Ręcznie: hover + focus klawiaturą na kartach osób (oba tryby); klik w partnera → modal + animacja.
- Test z włączonym `prefers-reduced-motion` (brak ruchu, treść czytelna).
- Sprawdzenie na 375px.

## 6. Ryzyka / założenia
- Zdjęcia osób i kolory/kategorie partnerów to dane od użytkownika; bez nich działają fallbacki (inicjały/flip, efekt domyślny). To celowe — funkcja działa „pusta" i wzbogaca się danymi.
- Efekt klatkowy to przyszłość — teraz tylko interfejs `frames`, niewdrażany.
