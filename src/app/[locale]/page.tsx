import { EconTicker } from "@/components/EconTicker";
import { HomeExperience } from "@/components/home/HomeExperience";
import { NextEvent } from "@/components/NextEvent";
import { StudentLife } from "@/components/StudentLife";

/**
 * Strona główna — skład po uporządkowaniu.
 *
 * Wcześniej stała tu notka „nie usuwać sekcji bez zgody zamawiającego". Zgoda
 * padła: Samorząd polecił usunąć talię projektów, żywe archiwum i sekcję
 * domykającą, bo strona urosła z kilku równoległych koncepcji naraz i sekcje
 * zaczęły mówić to samo dwa razy.
 *
 * Co zostało i po co — każda pozycja odpowiada na INNE pytanie:
 *
 * - `HomeExperience` — kim jesteśmy (ściana kadrów) i od czego zacząć
 *                      (sytuacje studenta, manifest).
 * - `NextEvent`      — pytanie o CZAS: co dzieje się najbliżej. Renderuje się
 *                      dopiero po ustawieniu EVENTS_SHEET_CSV_URL; bez niego
 *                      świadomie nie pokazuje nic, zamiast zmyślać wydarzenie.
 * - `StudentLife`    — jedyne miejsce, gdzie zdjęcie dostaje pełny ekran.
 * - `EconTicker`     — pasek zamykający.
 *
 * Zanim dołożysz kolejną sekcję: sprawdź, czy nie odpowiada na pytanie, na
 * które któraś już odpowiada. Tak powstał bałagan, który tu sprzątaliśmy.
 */
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HomeExperience />
      <NextEvent />
      <StudentLife />
      <EconTicker />
    </main>
  );
}
