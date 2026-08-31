/**
 * PDF wydania → strony WebP + manifest wymiarów + kopia PDF-a.
 *
 * Jedyne wejście to ścieżka do PDF-a, bo Wydawnictwo UEW przysyła kolejne tomy
 * serii na bieżąco i ten skrypt ma być powtarzalny bez dłubania w kodzie.
 *
 *   node scripts/build-edition.mjs <plik.pdf> <slug>
 *
 * DLACZEGO mupdf, a nie pdfjs-dist: pdfjs wymaga backendu canvas (kompilacja
 * natywna, na Windowsie bolesna). mupdf to jeden pakiet WASM — instaluje się
 * w dwie sekundy i renderuje identycznie na każdym systemie.
 *
 * DLACZEGO WebP stratny q72, a nie bezstratny: strony mają tekst wygładzany
 * w odcieniach szarości, nie płaskie kolory. Zmierzone na tym tomie:
 * stratny q72 = 94 KB/stronę, bezstratny = 141 KB/stronę. Bezstratny jest
 * więc PÓŁTORA RAZA CIĘŻSZY i nic nie wnosi — jakość q72 sprawdzona wzrokowo
 * na stronie z gęstym tekstem i tabelą.
 */
import * as mupdf from "mupdf";
import sharp from "sharp";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  statSync,
  existsSync,
} from "node:fs";
import path from "node:path";

const [, , pdfPath, slug] = process.argv;

if (!pdfPath || !slug) {
  console.error("Użycie: node scripts/build-edition.mjs <plik.pdf> <slug>");
  process.exit(1);
}

/** Dłuższa krawędź renderu. Strona ma na ekranie ok. 400-500 px, więc 1130 daje zapas ponad 2x. */
const LONG_EDGE = 1130;
const QUALITY = 72;

const outDir = path.join("public", "wydawnictwo", slug);
mkdirSync(outDir, { recursive: true });

const buffer = readFileSync(pdfPath);
const doc = mupdf.Document.openDocument(buffer, "application/pdf");
const pageCount = doc.countPages();

console.log(`${pageCount} stron`);

const pages = [];
let totalBytes = 0;

for (let i = 0; i < pageCount; i++) {
  const page = doc.loadPage(i);
  const [x0, y0, x1, y1] = page.getBounds();
  const height = y1 - y0;
  const scale = LONG_EDGE / height;

  const pix = page.toPixmap(mupdf.Matrix.scale(scale, scale), mupdf.ColorSpace.DeviceRGB, false);

  const name = `${String(i + 1).padStart(3, "0")}.webp`;
  const dest = path.join(outDir, name);

  await sharp(Buffer.from(pix.asPNG())).webp({ quality: QUALITY }).toFile(dest);

  const meta = await sharp(dest).metadata();
  const bytes = statSync(dest).size;
  totalBytes += bytes;

  pages.push({
    src: `/wydawnictwo/${slug}/${name}`,
    width: meta.width,
    height: meta.height,
  });

  pix.destroy();
  page.destroy();

  if ((i + 1) % 20 === 0) {
    console.log(`  ${i + 1}/${pageCount} — ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
  }
}

console.log(`  ${pageCount}/${pageCount} — ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);

// PDF idzie obok stron: to ON jest dostępną drogą do treści dla czytnika
// ekranu, bo ma warstwę tekstową i strukturę. Scena 3D jest tylko ilustracją.
copyFileSync(pdfPath, path.join("public", "wydawnictwo", `${slug}.pdf`));

// Manifest zbiera WSZYSTKIE tomy, bo Wydawnictwo przysyła je sukcesywnie —
// każde uruchomienie musi dopisać swój slug, a nie nadpisać poprzednie.
// Plik jest generowany wyłącznie przez ten skrypt (nagłówek to zakazuje
// ręcznej edycji), więc jego dotychczasowa zawartość to bezpieczny literał
// JS bez adnotacji typów poza samym nagłówkiem — da się go odzyskać.
const manifestPath = "src/lib/edition-pages.ts";
let editionsBySlug = {};
if (existsSync(manifestPath)) {
  const prev = readFileSync(manifestPath, "utf8");
  const match = prev.match(
    /editionPages:\s*Record<string,\s*EditionPage\[\]>\s*=\s*(\{[\s\S]*\});\s*$/,
  );
  if (match) {
    // JSON.parse, NIE new Function/eval: treść pochodzi z JSON.stringify,
    // więc jest poprawnym JSON-em. Gdyby ktoś kiedyś ręcznie zepsuł ten
    // wygenerowany plik mimo ostrzeżenia w nagłówku, JSON.parse po prostu
    // rzuci wyjątkiem — new Function wykonałoby dowolny kod przy buildzie.
    editionsBySlug = JSON.parse(match[1]);
  }
}
editionsBySlug[slug] = pages;

const body = `/**
 * Manifest stron wydań — PLIK GENEROWANY.
 *
 * Nie edytuj ręcznie. Źródło: scripts/build-edition.mjs
 * (\`node scripts/build-edition.mjs <plik.pdf> <slug>\` dla nowego tomu —
 * dopisuje swój slug, nie nadpisuje poprzednich).
 */

export interface EditionPage {
  src: string;
  width: number;
  height: number;
}

export const editionPages: Record<string, EditionPage[]> = ${JSON.stringify(editionsBySlug, null, 2)};
`;

writeFileSync(manifestPath, body);
console.log(`\n${manifestPath} — ${pages.length} stron, slug "${slug}"`);
