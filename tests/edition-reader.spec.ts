import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const open = async (page: import("@playwright/test").Page) => {
  await page.goto("/pl/wydawnictwo", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Akceptuj/ }).click().catch(() => {});
  await page.getByRole("button", { name: /Przejrzyj wydanie/ }).click();
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

test("brak poziomego rozpychania na 375 px", async ({ page }) => {
  // Odstępstwo od planu: przycisk „Przejrzyj wydanie" leży w panelu
  // szczegółów SpineWall, który ma klasę `hidden md:block` — jest niewidoczny
  // (i nieobecny w drzewie ról) poniżej breakpointu md (768 px). To osobna,
  // istniejąca cecha SpineWall (karty mobilne pokazują dane inaczej),
  // niezwiązana z czytnikiem, i naprawianie jej wykracza poza to zadanie.
  // Otwieramy więc czytnik przy domyślnym (desktopowym) viewporcie, a dopiero
  // POTEM zwężamy okno do 375 px — test nadal w pełni sprawdza to, co ma
  // sprawdzać: czy sam otwarty czytnik nie rozpycha strony w poziomie na
  // wąskim ekranie (uruchamia się media query @700px w
  // EditionReader.module.css).
  await open(page);
  await page.setViewportSize({ width: 375, height: 800 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
