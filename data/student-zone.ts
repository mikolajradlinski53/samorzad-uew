export interface Tile {
  title: string
  icon: string          // Lucide component name as string
  href: string
}

export interface QuickLink {
  text: string
  href: string
}

export const tiles: Tile[] = [
  { title: 'PRAWA STUDENTA',          icon: 'Scale',         href: '/prawa-studenta' },
  { title: 'WŁADZE REKTORSKIE',       icon: 'Building2',     href: '/wladze-rektorskie' },
  { title: 'RZECZNIK PRAW STUDENTA',  icon: 'Shield',        href: '/rzecznik-praw-studenta' },
  { title: 'ANKIETY DYDAKTYCZNE',     icon: 'ClipboardList', href: '/ankiety-dydaktyczne' },
  { title: 'STYPENDIA',               icon: 'GraduationCap', href: '/stypendia' },
  { title: 'MAPA KAMPUSU',            icon: 'Map',           href: '/mapa-kampusu' },
  { title: 'PRAWO DLA STUDENTA',      icon: 'BookOpen',      href: '/prawo-dla-studenta' },
  { title: 'DZIEKAN I PRODZIEKANI',   icon: 'Users',         href: '/dziekan-i-prodziekani' },
  { title: 'INFOPACKI',               icon: 'Info',          href: '/infopacki' },
  { title: 'POMOC PSYCHOLOGICZNA',    icon: 'Heart',         href: '/pomoc-psychologiczna' },
]

export const quickLinks: QuickLink[] = [
  { text: 'USOS',       href: 'https://usosweb.ue.wroc.pl/kontroler.php?_action=news/default' },
  { text: 'INTRANET',   href: 'https://uewrc.sharepoint.com/sites/IntranetUEW' },
  { text: 'PLAN ZAJĘĆ', href: 'https://plan.ue.wroc.pl' },
  { text: 'HARMONOGRAM ROKU AKADEMICKIEGO', href: 'https://bip.ue.wroc.pl/download/attachment/3456/harmonogram-roku-akademickiego-2025-2026.pdf' },
]
