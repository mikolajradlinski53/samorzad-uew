import type { Metadata } from 'next'
import { FadeUp } from '@/components/ui/FadeUp'
import { ProjectCard } from '@/components/cards/ProjectCard'
import { projekty } from '@/data/projekty'

export const metadata: Metadata = {
  title: 'Nasze Projekty',
  description: 'Projekty Samorządu Studentów UEW — integracyjne, edukacyjne i charytatywne inicjatywy dla studentów.',
  openGraph: {
    title: 'Nasze Projekty | SSUEW',
    description: 'Projekty Samorządu Studentów UEW — integracyjne, edukacyjne i charytatywne inicjatywy dla studentów.',
    url: 'https://samorzad.ue.wroc.pl/nasze-projekty',
    type: 'website',
  },
}
export default function NaszeProjektyPage() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">Nasze Projekty</h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              Bo studia to coś więcej niż wykłady. Realizujemy projekty, które integrują studentów,
              wspierają ich rozwój oraz wzbogacają życie akademickie Uniwersytetu Ekonomicznego
              we Wrocławiu.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projekty.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.05}>
                <ProjectCard title={p.title} tag={p.tag} description={p.description} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
