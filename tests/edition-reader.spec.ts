import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const open = async (page: import("@playwright/test").Page) => {
  await page.goto("/pl/wydawnictwo", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Akceptuj/ }).click().catch(() => {});
  // .first(): na wąskim ekranie przycisk niesie każda karta rozdziału (wszystkie
  // otwierają ten sam tom), więc bez zawężenia strict mode odrzuca kliknięcie.
  await page.getByRole("button", { name: /Przejrzyj wydanie/ }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
};

test("otwiera się i zamyka Escape'em, fokus wraca na przycisk", async ({ page }) => {
  await open(page);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Przejrzyj wydanie/ })).toBeFocused();
});

test("strzałki przewracają strony i licznik się zgadza", async ({ page }) => {
  await open(page);
  // Strona ma TRZY regiony aria-live="polite" (panel SpineWall pod spodem,
  // licznik czytnika, i jeszcze jeden w WydawnictwoContent) — bez zawężenia
  // do dialogu selektor łapie panel SpineWall zamiast licznika i test kłamie.
  const counter = page.locator('[role="dialog"] [aria-live="polite"]');
  await expect(counter).toContainText("1");
  await page.keyboard.press("ArrowRight");
  await expect(counter).toContainText("2");
  await page.keyboard.press("ArrowLeft");
  await expect(counter).toContainText("1");
});

test("odnośnik do pełnego tekstu istnieje i wskazuje PDF", async ({ page }) => {
  await open(page);
  const pdf = page.getByRole("link", { name: /Czytaj pełny tekst/ });
  await expect(pdf).toHaveAttribute("href", /\.pdf$/);
});

test("brak naruszeń axe przy otwartym czytniku", async ({ page }) => {
  await open(page);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("da się otworzyć i zamknąć na 375 px, bez poziomego rozpychania", async ({ page }) => {
  // Poniżej breakpointu md (768 px) panel szczegółów SpineWall jest ukryty, a
  // treść niosą karty mobilne — czytnik musi więc mieć własny przycisk na
  // karcie. Test otwiera go NAPRAWDĘ na 375 px (nie zwężając okna po
  // otwarciu), bo inaczej nie sprawdzałby, czy da się tu w ogóle dostać.
  await page.setViewportSize({ width: 375, height: 800 });
  await open(page);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);

  // Fokus musi wrócić na przycisk karty, nie na ukryty przycisk panelu.
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Przejrzyj wydanie/ }).first()).toBeFocused();
});
