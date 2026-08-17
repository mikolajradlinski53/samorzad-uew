/**
 * Konwersja kadrów hero do WebP i zbudowanie manifestu z ICH WŁASNYMI proporcjami.
 *
 * DLACZEGO PEŁNY KADR, A NIE PRZYCIĘTY DO 4:5
 *
 * Pierwsza wersja przycinała każde zdjęcie do pionu 4:5, żeby kafle w ścianie
 * były równe. To był błąd: zdjęcia są dostarczane skomponowane i przycinanie
 * ich pod siatkę psuje kadr — z grupowego zdjęcia zostawał wycinek. Kafle w
 * ścianie NIE muszą być równe. Zachowujemy cały kadr i jego proporcje, a układ
 * dostosowuje się do zdjęć, nie odwrotnie.
 *
 * DLACZEGO WEBP
 *
 * Przy tej samej jakości WebP waży o ok. 30-40% mniej od JPEG-a, a wspierają go
 * wszystkie przeglądarki, które obsługują resztę tej strony.
 *
 * DLACZEGO MANIFEST Z WYMIARAMI
 *
 * Skoro proporcje są różne, przeglądarka musi znać je PRZED wczytaniem pliku —
 * inaczej ściana skacze przy każdym doładowanym zdjęciu (CLS). Wymiary czytamy
 * tu raz i zapisujemy do `src/lib/hero-frames.ts`.
 *
 * Uruchomienie: node scripts/build-hero-manifest.mjs
 */
import sharp from "sharp";
import { readdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const DIR = "public/photos/hero";
const OUT = "src/lib/hero-frames.ts";

/** Dłuższa krawędź. Karta ma na ekranie ok. 320 px, więc 1400 daje zapas na 2x. */
const MAX_EDGE = 1400;

/** Pliki, których NIE konwertujemy — to już wynik wcześniejszej konwersji. */
const isSource = (f) => /\.(jpe?g|png|tiff?)$/i.test(f);

const frames = [];
const files = (await readdir(DIR)).filter(isSource).sort();

for (const file of files) {
  const from = path.join(DIR, file);
  const base = file.replace(/\.[^.]+$/, "");
  const dest = `${base}.webp`;
  const to = path.join(DIR, dest);

  const image = sharp(from).rotate(); // uwzględnij EXIF, zanim zniknie
  const meta = await image.metadata();
  const wide = (meta.width ?? 0) >= (meta.height ?? 0);

  // Jeden obiekt opcji, nie dwa argumenty: `resize(obj, obj)` sharp czyta jako
  // `resize(width, height)` i wywala się na obiekcie w miejscu wysokości.
  // Podajemy tylko DŁUŻSZĄ krawędź — druga wynika z proporcji, bo kadru nie
  // przycinamy.
  await image
    .resize({
      ...(wide
        ? { width: Math.min(MAX_EDGE, meta.width ?? MAX_EDGE) }
        : { height: Math.min(MAX_EDGE, meta.height ?? MAX_EDGE) }),
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile(to);

  const out = await sharp(to).metadata();
  const kb = Math.round((await stat(to)).size / 1024);
  const before = Math.round((await stat(from)).size / 1024);

  frames.push({ src: `/photos/hero/${dest}`, width: out.width, height: out.height });
  console.log(
    `${file.padEnd(22)} ${String(meta.width) + "x" + meta.height}`.padEnd(45) +
      `-> ${out.width}x${out.height}  ${before} KB -> ${kb} KB`,
  );
}

const body = `/**
 * Kadry archiwalne w ścianie hero — PLIK GENEROWANY.
 *
 * Nie edytuj ręcznie. Źródło: scripts/build-hero-manifest.mjs
 * (\`node scripts/build-hero-manifest.mjs\` po dorzuceniu nowych zdjęć).
 *
 * Każdy wpis ma własne proporcje, bo kadry NIE są przycinane do wspólnego
 * formatu — zdjęcia są komponowane przez fotografa i przycinanie ich pod
 * siatkę psuje kadr. Ściana dostosowuje się do zdjęć, nie odwrotnie.
 *
 * Wymiary są potrzebne przeglądarce PRZED wczytaniem pliku: bez nich ściana
 * skacze przy każdym doładowanym zdjęciu.
 */

export interface HeroFrame {
  src: string;
  width: number;
  height: number;
}

export const heroFrames: HeroFrame[] = ${JSON.stringify(frames, null, 2)};
`;

await writeFile(OUT, body);
console.log(`\n${OUT} — ${frames.length} kadrów`);
