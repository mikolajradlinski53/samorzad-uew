/**
 * Katalog organizacji studenckich / kół naukowych UEW.
 *
 * PUSTA lista = strona /organizacje-studenckie pokazuje „katalog w budowie" + CTA
 * „zgłoś organizację". Dodaj wpisy, by zbudować katalog.
 */
export interface Organization {
  name: string;
  desc?: string;
  /** np. „Koło naukowe", „Organizacja", „Inicjatywa". */
  category?: string;
  /** Strona lub profil w social mediach (opcjonalnie). */
  url?: string;
}

export const organizations: Organization[] = [];
