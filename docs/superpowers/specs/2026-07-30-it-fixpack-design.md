# Fix-pack „przed IT" — design

> Data: 2026-07-30. Wynik audytu (UX/UI/prawny/techniczny) przed pokazaniem strony
> działowi IT uczelni. Zakres chirurgiczny: domyka luki prawne (RODO/ePrivacy)
> i ostrzeżenia buildu. Po nim: hub Stypendiów (gotowy plan na `feat/stypendia-hub`).

## Cel

Strona bez luk, które audytor/IT wytknie w 5 minut: klauzula RODO przy formularzu,
mapa bez ciasteczek Google przed interakcją, build bez deprecation/config warningów.

## Zakres (5 punktów)

### 1. Klauzula informacyjna RODO — formularz kontaktu
- `src/components/pages/KontaktContent.tsx`: pod przyciskiem submit stała klauzula
  (art. 13 RODO): administrator, cel (odpowiedź na wiadomość), podstawa (prawnie
  uzasadniony interes), skrót praw + **link do `/prywatnosc`** (i18n `Link`).
- Klauzula *informacyjna* (bez checkboxa) — standard dla formularzy kontaktowych.
- Treść: nowe klucze w namespace `kontakt` (PL+EN, parytet). Określenie
  administratora **spójne z istniejącą Polityką prywatności** (`prywatnosc` w
  `messages/pl.json` — implementer czyta i używa tej samej nazwy podmiotu).
- Styl: `text-[0.75rem]`/`text-ink-tertiary`, nie dominuje formularza.

### 2. Mapa Google click-to-load — `MapEmbed.tsx`
- Nowy komponent `src/components/MapEmbed.tsx`, lustrzany do `VideoEmbed` (wzorzec
  fasady): do kliknięcia renderuje na-brand placeholder (ikona `MapPin`, adres,
  przycisk „Pokaż mapę Google" z dopiskiem, że załaduje treść od Google), po
  kliknięciu montuje istniejący iframe Google Maps.
- **Zero żądań do Google przed kliknięciem.** Przycisk: pełne aria/klawiatura;
  reduced-motion bez animacji.
- `KontaktContent.tsx` podmienia bezpośredni iframe na `<MapEmbed/>`. Props:
  `src` (URL embed), `title`, `address` (linia adresu na placeholderze), etykiety
  przez i18n (`kontakt.map*`, PL+EN).

### 3. Ostrzeżenia `metadataBase` — diagnoza i eliminacja
- Build ostrzega ×4 mimo `metadataBase` w `[locale]/layout.tsx`. Zlokalizować
  trasy generujące warning (podejrzane: root-level `opengraph-image.tsx`,
  `manifest.ts`, `robots.ts`, `sitemap.ts` — poza drzewem `[locale]`).
- Naprawa u źródła (np. metadata/metadataBase dla root-poziomu). **Kryterium:
  `npm run build` bez żadnego warninga `metadataBase`.**

### 4. Migracja `middleware` → `proxy` (deprecation Next 16)
- Najpierw lokalny doc: `node_modules/next/dist/docs/**` (konwencja proxy) —
  zgodnie z AGENTS.md. Potem migracja `src/middleware.ts` (re-export
  `next-intl/middleware` + matcher) na nową konwencję.
- **Kryterium: build bez warninga o middleware; i18n działa** (PL/EN, ścieżki,
  przełącznik języka).
- Jeśli zainstalowany next-intl nie wspiera konwencji proxy → STOP, raport
  (nie hakować); warning zostaje świadomie do czasu aktualizacji next-intl.

### 5. OG strony głównej — weryfikacja (bez nowych obrazków)
- Root `src/app/opengraph-image.tsx` istnieje. Po fixie #3 zweryfikować, że
  strona główna serwuje poprawny OG (absolutny URL). Nic nie dorabiamy (YAGNI).

## Poza zakresem
- Tryb „demo-ready" (chowanie sekcji Wkrótce) — osobna decyzja.
- Strona `/status` dla IT — ewentualny dodatek później.
- Hub Stypendiów — następny (gotowy spec+plan, `feat/stypendia-hub`).
- Treści z `docs/MATERIALY.md` — tor użytkownika.

## Testy / kryteria akceptacji
- `npm run build`: zero warningów `metadataBase` i `middleware` (albo
  udokumentowany STOP przy #4), 88+ tras, bez błędów.
- `npm test` 21/21; tsc + lint czysto (poza znanym benign `exhaustive-deps`).
- Formularz: klauzula widoczna PL+EN, link do `/prywatnosc` działa; parytet i18n.
- Mapa: w Network brak żądań do google.com przed kliknięciem; po kliknięciu mapa
  działa; obsługa klawiaturą.
