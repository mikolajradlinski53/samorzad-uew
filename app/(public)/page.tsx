import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { NewsSection } from '@/components/sections/NewsSection'
import { ProjectsPreview } from '@/components/sections/ProjectsPreview'
import { TeamPreview } from '@/components/sections/TeamPreview'
import { ContactSection } from '@/components/sections/ContactSection'

export const metadata: Metadata = {
  title: 'Samorząd Studentów UEW — Strona Główna',
  description: 'Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu. Działamy na rzecz studentów, wspieramy prawa studenckie i inspirujemy do nowych inicjatyw.',
  openGraph: {
    title: 'Strona Główna | SSUEW',
    description: 'Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu. Działamy na rzecz studentów, wspieramy prawa studenckie i inspirujemy do nowych inicjatyw.',
    url: 'https://samorzad.ue.wroc.pl/',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <NewsSection />
      <ProjectsPreview />
      <TeamPreview />
      <ContactSection />
    </>
  )
}
