import { test, expect } from "@playwright/test";

const otworz = async (page: import("@playwright/test").Page) => {
  await page.goto("/pl", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Akceptuj/ }).click().catch(() => {});
  await page.waitForTimeout(1000);
};

const zaslona = 'div[class*="TraceTransition"]';

/** Okno z sondą testową — zamiast `any` przy odczycie zebranych próbek. */
type OknoSondy = Window & { __podpis?: string[] };

test("szybkie przejście nie pokazuje podpisu „wczytywanie”", async ({ page }) => {
  // Test istnieje przez konkretną regresję: próg pokazania podpisu był liczony
  // jako `LABEL_AFTER_MS - COVER_MS`. Po wydłużeniu zamalowania różnica zeszła
  // poniżej zera, `Math.max(0, …)` dał zerowe opóźnienie i podpis błyskał przy
  // KAŻDYM przejściu, także wtedy, gdy nie było na co czekać.
  await otworz(page);
  await page.evaluate((sel) => {
    const okno = window as Window & { __podpis?: string[] };
    okno.__podpis = [];
    const id = setInterval(() => {
      const el = document.querySelector(`${sel} p`);
      if (el) okno.__podpis?.push(getComputedStyle(el).visibility);
    }, 50);
    setTimeout(() => clearInterval(id), 3000);
  }, zaslona);

  await page.locator("header").getByRole("link", { name: /^Kontakt$/ }).first().click();
  await page.waitForTimeout(3100);

  const probki = await page.evaluate(() => (window as OknoSondy).__podpis ?? []);
  expect(probki.length, "sonda musi zebrać próbki").toBeGreaterThan(20);
  expect(
    probki.filter((v) => v === "visible").length,
    "podpis nie może mignąć przy szybkim przejściu",
  ).toBe(0);
});

test("zasłona zakrywa ekran i sama po sobie sprząta", async ({ page }) => {
  await otworz(page);
  await page.locator("header").getByRole("link", { name: /^Kontakt$/ }).first().click();
  // 420 ms wypada w środku zamalowania (580 ms), czyli pewnie przed odsłoną.
  await page.waitForTimeout(420);

  // W szczycie zakrycia zasłona jest widoczna i jest DOKŁADNIE JEDNA — dwie
  // nakładki o tej samej kolorystyce dawały wcześniej efekt migającej plamy.
  await expect(page.locator(zaslona)).toHaveCount(1);
  expect(await page.locator(zaslona).evaluate((el) => getComputedStyle(el).visibility)).toBe("visible");

  await page.waitForTimeout(2200);
  // Po przejściu zasłona znika i nie blokuje klikania, a znacznik wejścia
  // treści jest zdjęty — inaczej strona zostałaby przygaszona na stałe.
  expect(await page.locator(zaslona).evaluate((el) => getComputedStyle(el).visibility)).toBe("hidden");
  expect(await page.evaluate(() => document.documentElement.dataset.trace ?? "brak")).toBe("brak");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
