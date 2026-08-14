import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Regresja dla globalnej strony 404.
 *
 * `app/layout.tsx` jest w tym projekcie przepustką, a powłokę dokumentu daje
 * dopiero `[locale]/layout.tsx`. Adres, który nie pasuje do żadnej trasy, nigdy
 * tam nie dociera — i przez to 404 wychodziło bez `<html lang>`, czyli z
 * naruszeniem WCAG 3.1.1, na każdej ścieżce: z prefiksem `/pl`, z `/en` i bez
 * prefiksu. `app/not-found.tsx` renderuje własne `<html lang="pl">`; ten test
 * pilnuje, żeby ktoś tego przypadkiem nie cofnął, zmieniając układ layoutów.
 */

const PATHS = ["/pl/nie-ma-takiej-strony", "/en/no-such-page", "/nie-ma-takiej-strony"];

for (const path of PATHS) {
  test(`404 deklaruje język i nie ma naruszeń: ${path}`, async ({ page }) => {
    test.setTimeout(60000);

    const res = await page.goto(path, { waitUntil: "load" });
    expect(res?.status(), `${path} powinno zwracać 404`).toBe(404);

    const lang = await page.evaluate(() =>
      document.documentElement.getAttribute("lang"),
    );
    expect(lang, `${path}: <html> musi mieć atrybut lang`).toBeTruthy();

    // Strona błędu też potrzebuje nagłówka — bez niego czytnik ekranu nie ma
    // o co zaczepić orientacji.
    await expect(page.locator("h1")).toBeVisible();

    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const message =
      `${path}: ${axe.violations.length} naruszeń:\n` +
      axe.violations.map((v) => `  ${v.id} x${v.nodes.length} — ${v.help}`).join("\n");
    expect(axe.violations, message).toEqual([]);
  });
}
