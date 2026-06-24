# Logotypy partnerów

Wrzuć tu logo partnerów (najlepiej **SVG**, ewentualnie PNG na przezroczystym
tle), a następnie dodaj wpis w `src/lib/partners.ts`:

```ts
{ name: "LOT Polish Airlines", logo: "/partnerzy/lot.svg",
  href: "https://www.lot.com", category: "aviation", color: "#16469D" }
```

- **Pusta lista partnerów** = na stronie zostaje teaser „Twoja marka".
- **Dodanie wpisu** = ściana pokazuje realne logo, a w modalu gra animacja
  dobrana po `category` (obecnie `aviation` → samolot; kolejne dokładamy w
  `src/components/partners/partnerEffects.ts`).
- `color` = kolor marki (tinta animacji). `href` = link „Odwiedź stronę".
