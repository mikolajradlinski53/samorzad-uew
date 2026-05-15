export interface Spotkanie {
  id: string
  date: string
  title: string
  participants: string[]
}

export const spotkania: Spotkanie[] = [
  { id: '2025-10-01', date: '2025-10-01', title: 'Spotkanie inauguracyjne 2025/2026', participants: [] },
  { id: '2025-10-15', date: '2025-10-15', title: 'Spotkanie Zarządu — planowanie semestru', participants: [] },
  { id: '2025-11-05', date: '2025-11-05', title: 'Spotkanie projektowe — ADAPCIAK', participants: [] },
  { id: '2025-11-19', date: '2025-11-19', title: 'Spotkanie Zarządu — sprawozdanie miesięczne', participants: [] },
  { id: '2025-12-03', date: '2025-12-03', title: 'Spotkanie Zarządu — podsumowanie semestru', participants: [] },
  { id: '2026-02-18', date: '2026-02-18', title: 'Spotkanie inauguracyjne semestr letni', participants: [] },
  { id: '2026-03-04', date: '2026-03-04', title: 'Spotkanie Zarządu — inicjatywy wiosenne', participants: [] },
  { id: '2026-04-08', date: '2026-04-08', title: 'Spotkanie projektowe — UE PARTY', participants: [] },
]
