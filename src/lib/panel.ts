/**
 * Kafelki panelu działacza (po zalogowaniu na /strefa-dzialacza).
 * Każdy kafelek = link do zewnętrznego narzędzia Samorządu. Edytuj listę tutaj.
 * Pusty `url` = kafelek „Wkrótce" (nieklikalny).
 */
export interface PanelTile {
  /** Nazwa narzędzia (np. „CRA", „RadaStudentów24"). */
  name: string;
  desc?: string;
  /** Adres narzędzia. Pusty = „Wkrótce". */
  url: string;
  /**
   * Trasa WEWNĄTRZ serwisu (bez prefiksu języka) — np. "/strefa-dzialacza/…".
   * Renderuje się lokalizowanym Linkiem, więc bez przeładowania strony
   * i bez otwierania nowej karty, w odróżnieniu od narzędzi zewnętrznych.
   */
  internal?: string;
}

export const panelTiles: PanelTile[] = [
  {
    name: "Generator stopki mailowej",
    desc: "Wypełnij dane i skopiuj gotową stopkę do Gmaila lub Outlooka.",
    url: "",
    internal: "/strefa-dzialacza/generator-stopki",
  },
  { name: "CRA", desc: "Wewnętrzny system Samorządu (crmp-system).", url: "" },
  { name: "RadaStudentów24", desc: "Platforma Rady Studentów.", url: "" },
];
