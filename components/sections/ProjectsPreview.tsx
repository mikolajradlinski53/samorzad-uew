import Link from 'next/link'
import { projekty } from '@/data/projekty'
import { ProjectCard } from '@/components/cards/ProjectCard'
import { FadeUp } from '@/components/ui/FadeUp'
import { TiltCard } from '@/components/ui/TiltCard'

export function ProjectsPreview() {
  const preview = projekty.slice(0, 4)
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-brand mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-3">
              nasze projekty
            </span>
            <h2 className="font-display text-display-lg mb-2" style={{ color: 'var(--text)' }}>
              Co tworzymy?
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Inicjatywy, które tworzą społeczność akademicką
            </p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {preview.map((projekt, i) => (
            <FadeUp key={projekt.title} delay={i * 0.1}>
              <TiltCard
                className="rounded-2xl border"
                style={{ borderColor: 'var(--border)' }}
              >
                <ProjectCard title={projekt.title} tag={projekt.tag} description={projekt.description} />
              </TiltCard>
            </FadeUp>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/nasze-projekty" className="text-primary font-bold hover:underline text-sm">
            Wszystkie projekty →
          </Link>
        </div>
      </div>
    </section>
  )
}
