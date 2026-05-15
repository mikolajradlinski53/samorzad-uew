# Phase 4: Samorząd + Projekty + Partnerzy — Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Source:** Brief + research samorzad.ue.wroc.pl

<domain>
## Phase Boundary

Budowa wszystkich stron Samorządu z prawdziwymi danymi osobowymi:
- `/przewodniczacy-i-wiceprzewodniczacy` — Prezydium (4 osoby)
- `/zarzad` — Zarząd (9 osób, w tym Mikołaj Radliński)
- `/rada-uczelniana` — RUSS (12 radnych + GDrive dokumenty)
- `/struktura-samorzadu` — kafelki do organów
- `/komisja-rewizyjna` + `/studencka-komisja-wyborcza` — stubs
- `/regulacje-wewnetrzne` — 6 PDF-ów z Wix CDN → linki GDrive/lokalne
- `/nasze-projekty` — 9 projektów z opisami
- `/wspolprace` — strona partnerów z logotypami + formularz UI
- `/nasza-dzialalnosc` — misja SSUEW
- `/filia-jelenia-gora` — stub

</domain>

<decisions>
## Implementation Decisions

### Struktura katalogów
```
app/(public)/
  nasza-dzialalnosc/page.tsx
  struktura-samorzadu/page.tsx
  przewodniczacy-i-wiceprzewodniczacy/page.tsx
  zarzad/page.tsx
  rada-uczelniana/page.tsx
  komisja-rewizyjna/page.tsx
  studencka-komisja-wyborcza/page.tsx
  regulacje-wewnetrzne/page.tsx
  nasze-projekty/page.tsx
  filia-jelenia-gora/page.tsx
  wspolprace/page.tsx
  nasi-partnerzy/page.tsx
data/
  zarzad.ts           # zarząd + prezydium + RUSS
  projekty.ts         # 9 projektów
  regulacje.ts        # 6 regulaminów
  partnerzy.ts        # loga partnerów
components/
  cards/
    ProjectCard.tsx   # Karta projektu (tytuł + opis + opcjonalny tag)
  sections/
    MemberGrid.tsx    # Siatka kart MemberCard
    PartnerGrid.tsx   # Siatka logo partnerów
```

### Dane Zarządu

**Prezydium (`/przewodniczacy-i-wiceprzewodniczacy`):**
| Stanowisko | Imię i Nazwisko | Email |
|------------|-----------------|-------|
| Przewodnicząca | Emilia Ćwiklińska | emilia.cwiklinska@samorzad.ue.wroc.pl |
| Wiceprzewodnicząca ds. Strategii | Magdalena Skoczylas | magdalena.skoczylas@samorzad.ue.wroc.pl |
| Wiceprzewodnicząca ds. Projektów | Daria Szewczyk | daria.szewczyk@samorzad.ue.wroc.pl |
| Wiceprzewodniczący ds. PR | Jakub Panas | jakub.panas@samorzad.ue.wroc.pl |

**Zarząd (`/zarzad`) — 9 osób:**
| Stanowisko | Imię i Nazwisko | Email |
|------------|-----------------|-------|
| Członek Zarządu ds. Administracji | Mikołaj Radliński | mikolaj.radlinski@samorzad.ue.wroc.pl |
| Członek Zarządu ds. Dydaktyki i Jakości Kształcenia | Karolina Smereczniak | karolina.smereczniak@samorzad.ue.wroc.pl |
| Członek Zarządu ds. Finansów | Hubert Stachowski | hubert.stachowski@samorzad.ue.wroc.pl |
| Członek Zarządu ds. Human Resources | Marcel Tyrakowski | marcel.tyrakowski@samorzad.ue.wroc.pl |
| Członek Zarządu ds. Kontaktów Zewnętrznych | Karol Vogel | karol.vogel@samorzad.ue.wroc.pl |
| Członek Zarządu ds. Promocji | Julia Pytel | julia.pytel@samorzad.ue.wroc.pl |
| Członek Zarządu ds. Filii w Jeleniej Górze | Szymon Woźniak | szymon.wozniak@samorzad.ue.wroc.pl |
| Przewodnicząca Klubu Podróżników "BIT" | Yuliia Hural | yuliia.hural@klubpodroznikowbit.com |
| Przewodnicząca IKSS | Julia Stępień | julia.stepien.ikss@gmail.com |

**RUSS (`/rada-uczelniana`) — 12 radnych:**
| Stanowisko | Imię i Nazwisko | Email |
|------------|-----------------|-------|
| Radny | Jarosław Bałut | jaroslaw.balut@samorzad.ue.wroc.pl |
| Radna | Martyna Bedlechowicz | martyna.bedlechowicz@samorzad.ue.wroc.pl |
| Radny | Jakub Buchta | jakub.buchta@samorzad.ue.wroc.pl |
| Radny | Bartosz Buczkowski | bartosz.buczkowski@samorzad.ue.wroc.pl |
| Radna | Aleksandra Dauerman | aleksandra.dauerman@samorzad.ue.wroc.pl |
| Radny | Oliwier Kaszewski | oliwier.kaszewski@samorzad.ue.wroc.pl |
| Radna | Zuzanna Kordus | zuzanna.kordus@samorzad.ue.wroc.pl |
| Radna | Zuzanna Kuśmińska | zuzanna.kusminska@samorzad.ue.wroc.pl |
| Radna | Zofia Palus | zofia.palus@samorzad.ue.wroc.pl |
| Radna | Natalia Pietrzak | natalia.pietrzak@samorzad.ue.wroc.pl |
| Radna | Agata Rusak | agata.rusak@samorzad.ue.wroc.pl |
| Radna | Karina Służyńska | karina.sluzynska@samorzad.ue.wroc.pl |

**RUSS GDrive dokumenty:**
- Raporty z posiedzeń 2025/2026: https://drive.google.com/drive/folders/1KkuFo2a3T6XeGVaitv2OSWxWzFBq_bMB
- Uchwały 2025/2026: https://drive.google.com/drive/folders/1N-cYKNK5R-xh4WZsJ7z0TljDrkh-yffE

**Zarządzenia Przewodniczącej:**
- https://drive.google.com/drive/folders/1euCpiW3ETlTGQ7igHmQ49wweytsg1LVn

### Regulacje wewnętrzne — 6 dokumentów

Pliki nadal na Wix CDN — używaj tych linków (po migracji zostaną podmienione na pliki lokalne):
| Dokument | Link |
|----------|------|
| REGULAMIN SAMORZĄDU STUDENTÓW | https://samorzad.ue.wroc.pl/_files/ugd/3dec01_e2f5e6255f3a4e02b3486fce9345da3d.pdf |
| REGULAMIN RADY ORGANIZACJI STUDENCKICH | https://samorzad.ue.wroc.pl/_files/ugd/3dec01_8e95b203e91e47d1b2a5be489ab3136c.pdf |
| REGULAMIN ORGANIZACYJNY RUSS | https://samorzad.ue.wroc.pl/_files/ugd/3dec01_f29102abac934f8fbb771a0e0033b71b.pdf |
| REGULAMIN RAD MIESZKAŃCA | https://samorzad.ue.wroc.pl/_files/ugd/3dec01_ce9e1526865444b9a8b2890406b4887e.pdf |
| ORDYNACJA WYBORCZA | https://samorzad.ue.wroc.pl/_files/ugd/3dec01_e1abe35d67a44e9aacecbe501da0d5a1.pdf |
| IDENTYFIKACJA WIZUALNA SAMORZĄDU | https://samorzad.ue.wroc.pl/_files/ugd/3dec01_746b01182be140039f8a0930403c0df3.pdf |

### 9 projektów (`/nasze-projekty`)

| Projekt | Tag | Opis (skrót) |
|---------|-----|--------------|
| ADAPCIAK | Integracja | Ośmiodniowy obóz dla pierwszorocznych studentów z atrakcjami i imprezami tematycznymi. |
| ANIMALIA | Charytatywny | Projekt charytatywny na ratowanie zagrożonych gatunków zwierząt we współpracy z wrocławskim ZOO i Fundacją DODO. |
| BAL UEW | Wydarzenie | Coroczny bal akademicki UEW łączący kadrę, studentów i absolwentów. Wręczenie statuetek „Ekonomki". |
| DNI ADAPTACYJNE | Edukacja | Prelekcje i szkolenia dla pierwszorocznych — prawa, obowiązki, zasady uczelni + imprezy integracyjne. |
| GRADUETION | Tradycja | Ceremonia wręczenia dyplomów z togi i birety — tradycja inspirowana USA. Rzut czapeczkami. |
| MOSTY EKONOMICZNE | Wymiana | Wymiana studentów z 5 uczelni ekonomicznych w Polsce. Wykłady, warsztaty, case studies. Od 2005 roku. |
| TEST WIEDZY EKONOMICZNEJ | Konkurs | Unikatowy test wiedzy współtworzony przez 5 samorządów. Formuła wzorowana na TVP. |
| TEDxUEW | Inspiracja | Lokalne TEDx — prelegenci z krótkimi inspirującymi prelekcjami dla studentów UEW. |
| UE PARTY | Rozrywka | Cykl imprez dedykowanych studentom UEW i wszystkim studentom Wrocławia. |

### Partnerzy (`/wspolprace`)

**PARTNER STRATEGICZNY:**
- BNY (BNY Mellon)

**PARTNERZY (12):**
PwC, Pasibus, Phinance, Raben, Techland, Pyszne.pl, UPS, Bielenda, MU1 Drukarnia, Slice of Heaven, UPM

*(Loga: placeholdery tekst — wgranie właściwych plików graficznych w późniejszym etapie)*

**Osoba kontaktowa:**
- Karol Vogel, Członek Zarządu ds. Kontaktów Zewnętrznych
- Email: karol.vogel@samorzad.ue.wroc.pl
- Tel: 511 599 376
- LinkedIn: https://www.linkedin.com/in/karol-vogel-ba4896270/

**Formularz współpracy (UI-only — Phase 5 wires POST):**
Pola: Nazwa firmy*, Imię i nazwisko*, Email*, Telefon, Rodzaj współpracy* (select), Dodatkowe informacje*

**"Dlaczego warto z nami współpracować":**
- bezpośredni kontakt ze studentami UEW
- możliwość promocji marki w środowisku akademickim
- wsparcie przy organizacji wydarzeń i inicjatyw studenckich
- doświadczenie organizacyjne Samorządu Studenckiego
- indywidualne podejście do każdej współpracy

### Claude's Discretion
- Styl kart MemberCard na stronach zarządu (rozmiar, hover)
- Layout sekcji projektów (grid vs lista)
- Styl karty partnera (grayscale→color na hover vs pełny kolor)
- MemberGrid: ile kolumn na desktop (3 dla zarządu, 4 dla RUSS)

</decisions>

<canonical_refs>
## Canonical References

- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- `.planning/phases/02-next-js-foundation/02-UI-SPEC.md` (design tokens)
- `components/cards/MemberCard.tsx` (reuse from Phase 3)
- `components/sections/DocumentList.tsx` (reuse for regulacje)
- `components/ui/FadeUp.tsx`
- `components/ui/Button.tsx`
- `tailwind.config.js`

</canonical_refs>

<specifics>
## Notes

**MemberCard reuse:** Phase 3 już zbudowała MemberCard. Reuse it directly — no modifications needed for Phase 4. Pass initials as first 2 chars of name.

**Initials pattern:** "Emilia Ćwiklińska" → "EC", "Mikołaj Radliński" → "MR", etc.

**DocumentList reuse:** Use `components/sections/DocumentList.tsx` for regulacje (PDF links).

**PartnerGrid placeholder:** Since no partner logo files exist yet, render partner names as styled text blocks with placeholder borders. Leave `src` as empty string or use `data-partner` text. Comment: `{/* TODO: replace with Image when logos available */}`.

**ProjectCard pattern:**
```tsx
// Simple server component
export function ProjectCard({ title, tag, description }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-ssuew-gray-200 p-8 hover:border-primary hover:shadow-brand-hover hover:-translate-y-1 transition-all duration-300">
      <span className="text-[0.85rem] font-bold text-primary bg-primary-light px-3 py-1 rounded-full">{tag}</span>
      <h3 className="font-display text-display-lg text-ssuew-black mt-4 mb-3">{title}</h3>
      <p className="text-[0.85rem] text-ssuew-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
```

</specifics>

<deferred>
## Deferred

- Prawdziwe zdjęcia zarządu — placeholdery inicjałowe
- Prawdziwe loga partnerów — text placeholders
- Prawdziwe zdjęcia projektów — brak w Phase 4
- Podstrony stypendii (/stypendia-socjalne etc.) — nie w Phase 4

</deferred>

---

*Phase: 04-samorz-d-projekty-partnerzy*
*Context gathered: 2026-05-15 via Brief*
