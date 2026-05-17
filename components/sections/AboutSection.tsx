'use client'
import { FadeUp } from '@/components/ui/FadeUp'
import { useT } from '@/lib/i18n'

export function AboutSection() {
  const { t } = useT()
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-brand mx-auto px-6">
        <FadeUp>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-display-lg mb-6" style={{ color: 'var(--text)' }}>
              {t.about_title}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t.about_body}
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
