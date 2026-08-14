import { EconTicker } from "@/components/EconTicker";
import { HomeExperience } from "@/components/home/HomeExperience";
import { NextEvent } from "@/components/NextEvent";
import { PhotoBand } from "@/components/PhotoBand";
import { StudentLife } from "@/components/StudentLife";

/**
 * Kolejność strony głównej.
 *
 * `HomeExperience` prowadzi narrację od sytuacji studenta i zostaje na
 * początku bez zmian. Trzy elementy z poprzedniej wersji wracają POD nią,
 * bo każdy robi coś, czego nowa narracja nie robi:
 *
 * - `NextEvent` — tablica w stylu lotniskowej odpowiada na „co się dzieje
 *   najbliżej", czyli na pytanie o czas, a nie o sytuację;
 * - `PhotoBand` — pas przewijających się kadrów pokazuje skalę i ludzi tam,
 *   gdzie tekst mówi o zasadach;
 * - `StudentLife` — kadry sterowane przewijaniem, jedyne miejsce, w którym
 *   zdjęcie dostaje pełny ekran i własny rytm.
 */
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HomeExperience />
      <NextEvent />
      <PhotoBand />
      <StudentLife />
      <EconTicker />
    </main>
  );
}
