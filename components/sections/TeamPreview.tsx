'use client'
import Link from 'next/link'
import { prezydium } from '@/data/zarzad'
import { MemberCard } from '@/components/cards/MemberCard'
import { FadeUp } from '@/components/ui/FadeUp'
import { TiltCard } from '@/components/ui/TiltCard'
import { useT } from '@/lib/i18n'

export function TeamPreview() {
  const { t } = useT()
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-brand mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-3">
              {t.team_section_title}
            </span>
            <h2 className="font-display text-display-lg mb-2" style={{ color: 'var(--text)' }}>
              {t.team_section_subtitle}
            </h2>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prezydium.map((member, i) => (
            <FadeUp key={member.email} delay={i * 0.1}>
              <TiltCard
                className="rounded-brand border"
                style={{ borderColor: 'var(--border)' }}
              >
                <MemberCard
                  initials={member.initials}
                  name={member.name}
                  role={member.role}
                  email={member.email}
                />
              </TiltCard>
            </FadeUp>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/zarzad" className="text-primary font-bold hover:underline text-sm">
            {t.team_view_all}
          </Link>
        </div>
      </div>
    </section>
  )
}
