import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { AboutSection } from '@/components/sections/AboutSection'

export const metadata: Metadata = {
  title: 'Samorząd Studentów UEW — Strona Główna',
  description: 'Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu. Działamy na rzecz studentów, wspieramy prawa studenckie i inspirujemy do nowych inicjatyw.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
    </>
  )
}
