import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Talia projektów na stronie głównej.
 *
 * Test pilnuje trzech rzeczy, które łatwo zepsuć niewidocznie:
 *
 * 1. TALIA SIĘGA POZA KRAWĘDZIE OKNA. Perspektywa ściąga odległe karty do
 *    środka, więc sam rozstaw liczony w procentach szerokości karty nie
 *    wystarcza — pierwsza wersja kończyła się 92 px przed krawędzią i wyglądała
 *    jak mała karuzela na środku strony. Bez tej asercji regresja jest niema.
 * 2. TALIA NIE ROZPYCHA STRONY W POZIOMIE, mimo że karty wystają poza ekran.
 * 3. PODPIS ODPOWIADA NA KLAWIATURĘ. Talia bez obsługi strzałek jest dla
 *    części użytkowników martwa.
 */

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "laptop-niski", width: 1440, height: 700 },
  { name: "mobile", width: 375, height: 780 },
];

for (const vp of VIEWPORTS) {
  test(`talia projektów — ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/pl", { waitUntil: "networkidle" });

    const deck = page.locator('[aria-roledescription="karuzela"]');
    await expect(deck).toHaveCount(1);
    await expect(deck.locator('[aria-roledescription="slajd"]')).toHaveCount(9);

    const spread = await deck.evaluate((el) => {
      const rects = Array.from(el.querySelectorAll('[aria-roledescription="slajd"]')).map((s) =>
        s.getBoundingClientRect(),
      );
      return {
        left: Math.min(...rects.map((r) => r.left)),
        right: Math.max(...rects.map((r) => r.right)),
      };
    });

    expect(spread.left, "lewa krawędź talii").toBeLessThanOrEqual(2);
    expect(spread.right, "prawa krawędź talii").toBeGreaterThanOrEqual(vp.width - 2);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, "poziome rozpychanie strony").toBeLessThanOrEqual(0);

    // Talia i jej podpis muszą być widoczne RAZEM — podpis mówi, na co się
    // właśnie patrzy, więc odcięty od kart jest bezużyteczny.
    const together = await page.evaluate(() => {
      const section = document.querySelector("#coverflow-title")!.closest("section")!;
      const d = section.querySelector('[aria-roledescription="karuzela"]')!.getBoundingClientRect();
      const c = section.querySelector('[aria-live="polite"]')!.getBoundingClientRect();
      return c.bottom - d.top;
    });
    expect(together, "talia + podpis w jednym oknie").toBeLessThanOrEqual(vp.height);

    const title = page.locator('section:has(#coverflow-title) [aria-live="polite"] p').first();
    const before = await title.textContent();
    await deck.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(700);
    await expect(title, "strzałka przesuwa talię").not.toHaveText(before ?? "");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("talia nie rusza się przy ograniczonym ruchu", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/pl", { waitUntil: "networkidle" });

  const title = page.locator('section:has(#coverflow-title) [aria-live="polite"] p').first();
  // Podpis musi być WIDOCZNY, a nie zatrzymany na `opacity: 0` — to najczęstszy
  // błąd przy wyłączaniu animacji przez usunięcie stanu docelowego.
  await expect(title).toBeVisible();
  const start = await title.textContent();

  // Automat nie ma prawa ruszyć: 3,6 s to jeden pełny cykl z zapasem.
  await page.waitForTimeout(4200);
  await expect(title, "automat milczy przy prefers-reduced-motion").toHaveText(start ?? "");

  // ...ale sterowanie ręczne nadal działa.
  await page.locator('[aria-roledescription="karuzela"]').focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(300);
  await expect(title, "strzałki działają mimo wyłączonych animacji").not.toHaveText(start ?? "");
});
