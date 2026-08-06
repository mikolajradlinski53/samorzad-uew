# Wrzuć tutaj

Twoja skrzynka na klucze, identyfikatory i fakty, na które czeka kod.
**Zasada: wpisujesz wartość obok `→` i dajesz znać.** Ja przenoszę ją w odpowiednie
miejsce w kodzie, weryfikuję i wypycham.

Nie edytuj plików w `src/` — jeśli wpiszesz coś tutaj, nic się nie zepsuje.

Legenda: 🔴 blokuje działającą funkcję · 🟡 poprawia jakość · ⚪️ na przyszłość

---

## 🔴 Formspree — identyfikatory formularzy

Trzy formularze są zbudowane i czekają wyłącznie na ID. Dopóki go nie ma, pokazują
komunikat „formularz nie jest jeszcze skonfigurowany" i podają e-mail jako drogę
zastępczą — **nie udają, że wysyłają**.

**Skąd wziąć:** wejdź na [formspree.io](https://formspree.io), załóż darmowe konto,
kliknij **New Form** (trzy razy — po jednym na każdy formularz). Po utworzeniu
Formspree pokaże adres w postaci `https://formspree.io/f/abcdefgh`.
**Potrzebuję tylko ostatniego członu** — tego `abcdefgh`.

| Formularz | Gdzie na stronie | Wklej ID |
|---|---|---|
| Kontakt | `/kontakt` | → |
| Rzecznik Praw Studenta | `/rzecznik-praw-studenta` | → |
| Współpraca z partnerami | `/partnerzy` | → |

**Do zrobienia przy okazji (ważne prawnie):** w panelu Formspree zaakceptuj
**umowę powierzenia przetwarzania danych (DPA)**. Polityka prywatności już
deklaruje, że taka umowa obowiązuje — bez jej zawarcia ten zapis byłby nieprawdziwy.
Formspree udostępnia ją w ustawieniach konta.

**Uwaga na limit:** darmowy plan to 50 zgłoszeń miesięcznie **łącznie** ze wszystkich
formularzy. W sesji stypendialnej może to być za mało — warto obserwować licznik.

---

## 🟡 Fakty do potwierdzenia

Rzeczy, które są już na stronie, ale opierają się na niepewnym źródle.

| Co | Stan obecny | Twoja odpowiedź |
|---|---|---|
| Liczba projektów rocznie (chip w hero) | „9 projektów rocznie" — nigdy nie potwierdzone | → |
| Liczba studentów | 10 000+ (potwierdzone przez Ciebie; prasa pisała o ~9 tys.) | → |
| Rok założenia Samorządu | 1987 (podane przez Ciebie) | ✅ |

---

## ⚪️ Treści i pliki

Osobna, szczegółowa lista jest w [MATERIALY.md](MATERIALY.md) — zdjęcia, dokumenty
PDF, składy osobowe, logotypy partnerów. Poniżej tylko te pozycje, które
odblokowują konkretną funkcję.

| Co | Co odblokuje | Gdzie wrzucić |
|---|---|---|
| Portrety Zarządu (4:5) | Zdjęcia zamiast inicjałów na `/zarzad` | `public/photos/zarzad/01.jpg …` |
| Portrety RUSS (4:5) | To samo na stronie RUSS | `public/photos/russ/01.jpg …` |
| Zdjęcia z wydarzeń | Prawdziwe kadry zamiast stockowych w „Życie studenckie" i „Projekty" | `public/photos/zycie/`, `public/photos/projekty/` |
| Regulaminy i statut (PDF) | Zdejmuje plakietki „Wkrótce"; **warunek konieczny dla asystenta AI** cytującego paragrafy | `public/dokumenty/` |
| ID filmu z YouTube | Sekcja wideo w hubie Stypendiów (dziś ukryta) | `src/lib/videos.ts` — albo wpisz tutaj → |

---

## Jak to działa po Twojej stronie

1. Wpisujesz wartość obok `→` w tabelce (albo wrzucasz plik we wskazane miejsce).
2. Piszesz mi jednym zdaniem, co doszło.
3. Ja przenoszę to do kodu, sprawdzam build i testy, wypycham na produkcję.

Jeśli czegoś nie wiesz albo nie masz — napisz „nie mam". To też jest odpowiedź:
wtedy albo zostawiam stan uczciwy (jak inicjały zamiast zdjęć), albo proponuję
rozwiązanie zastępcze.
