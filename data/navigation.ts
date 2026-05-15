export interface NavChild {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavChild[]
  highlight?: boolean
}

export const navItems: NavItem[] = [
  { label: 'Strona Główna', href: '/' },
  {
    label: 'Strefa Studenta',
    href: '/dla-studenta',
    children: [
      { label: 'Prawa Studenta',          href: '/prawa-studenta' },
      { label: 'Infopacki',               href: '/infopacki' },
      { label: 'Rzecznik Praw Studenta',  href: '/rzecznik-praw-studenta' },
      { label: 'Prawo dla Studenta',      href: '/prawo-dla-studenta' },
      { label: 'Stypendia',               href: '/stypendia' },
      { label: 'Mapa Kampusu',            href: '/mapa-kampusu' },
      { label: 'Władze Rektorskie',       href: '/wladze-rektorskie' },
      { label: 'Władze Dziekańskie',      href: '/dziekan-i-prodziekani' },
    ],
  },
  {
    label: 'Samorząd Studentów',
    href: '/nasza-dzialalnosc',
    children: [
      { label: 'Nasza Misja',             href: '/nasza-dzialalnosc' },
      { label: 'Struktura Samorządu',     href: '/struktura-samorzadu' },
      { label: 'Rada Uczelniana (RUSS)',  href: '/rada-uczelniana' },
      { label: 'Regulacje Wewnętrzne',    href: '/regulacje-wewnetrzne' },
      { label: 'Nasze Projekty',          href: '/nasze-projekty' },
      { label: 'Filia w Jeleniej Górze',  href: '/filia-jelenia-gora' },
    ],
  },
  {
    label: 'Współprace',
    href: '/wspolprace',
    children: [
      { label: 'Nasi Partnerzy',          href: '/nasi-partnerzy' },
      { label: 'Kontakt',                 href: '/kontakt' },
    ],
  },
  {
    label: 'Kontakt',
    href: '/kontakt',
    children: [
      { label: 'Formularz Kontaktowy',    href: '/formularz' },
      { label: 'Współpracuj z Nami',      href: '/wspolpracuj-z-nami' },
    ],
  },
  { label: 'Strefa Działacza', href: '/strefa-dzialacza', highlight: true },
]
