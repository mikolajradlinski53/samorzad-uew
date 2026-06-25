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
}

export const panelTiles: PanelTile[] = [
  { name: "CRA", desc: "Wewnętrzny system Samorządu (crmp-system).", url: "" },
  { name: "RadaStudentów24", desc: "Platforma Rady Studentów.", url: "" },
];
