'use client'
import Link from 'next/link'
import { projekty } from '@/data/projekty'
import { ProjectCard } from '@/components/cards/ProjectCard'
import { FadeUp } from '@/components/ui/FadeUp'
import { TiltCard } from '@/components/ui/TiltCard'
import { useT } from '@/lib/i18n'

export function ProjectsPreview() {
  const { t } = useT()
  const preview = projekty.slice(0, 4)
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-brand mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-3">
              {t.projects_section_title}
            </span>
            <h2 className="font-display text-display-lg mb-2" style={{ color: 'var(--text)' }}>
              {t.projects_section_subtitle}
            </h2>
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
            {t.projects_view_all}
          </Link>
        </div>
      </div>
    </section>
  )
}
