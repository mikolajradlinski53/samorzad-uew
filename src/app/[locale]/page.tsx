import { EconTicker } from "@/components/EconTicker";
import { HomeExperience } from "@/components/home/HomeExperience";
import { ProjectCoverflow } from "@/components/home/ProjectCoverflow";
import { NextEvent } from "@/components/NextEvent";
import { PhotoBand } from "@/components/PhotoBand";
import { StudentLife } from "@/components/StudentLife";

/**
 * DECYZJA ZAMAWIAJĄCEGO — NIE USUWAĆ SEKCJI BEZ JEGO ZGODY.
 *
 * Skład tej strony jest wyborem Samorządu, powtórzonym dwukrotnie: z
 * poprzedniej wersji strony głównej mają tu zostać animacje zdjęć, tablica
 * odlotów odliczająca czas do projektu oraz kadry sterowane przewijaniem.
 * Zostały już raz przeniesione na podstrony i zostały przywrócone — jeżeli
 * ten układ ma się zmienić, decyzja należy do zamawiającego, nie do
 * porządkowania kompozycji.
 *
 * Kolejność ma uzasadnienie: `HomeExperience` prowadzi od sytuacji studenta
 * i zostaje na początku. Reszta odpowiada na to, czego narracja nie robi:
 *
 * - `NextEvent`  — tablica w stylu lotniskowej odpowiada na pytanie o CZAS
 *                  („co się dzieje najbliżej"), a nie o sytuację. Renderuje
 *                  się dopiero po ustawieniu EVENTS_SHEET_CSV_URL; bez niego
 *                  świadomie nie pokazuje nic, zamiast zmyślać wydarzenie.
 * - `PhotoBand`  — pas przewijających się kadrów pokazuje skalę i ludzi tam,
 *                  gdzie tekst mówi o zasadach.
 * - `StudentLife`— jedyne miejsce, w którym zdjęcie dostaje pełny ekran i
 *                  własny rytm przewijania.
 *
 * `ProjectCoverflow` mówi co innego niż „Żywe archiwum" w `HomeExperience`:
 * archiwum jest KURATORSKIE (trzy rodzaje energii), talia jest PEŁNA
 * (dziewięć formatów). Jeżeli jedno z dwóch ma zniknąć — to decyzja
 * zamawiającego, tak jak wyżej.
 */
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HomeExperience />
      <ProjectCoverflow />
      <NextEvent />
      <PhotoBand />
      <StudentLife />
      <EconTicker />
    </main>
  );
}
