import Link from 'next/link'
import { prezydium } from '@/data/zarzad'
import { MemberCard } from '@/components/cards/MemberCard'
import { FadeUp } from '@/components/ui/FadeUp'

export function TeamPreview() {
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-brand mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-3">
              prezydium
            </span>
            <h2 className="font-display text-display-lg mb-2" style={{ color: 'var(--text)' }}>
              Poznaj nas
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Ludzie stojący za samorządem
            </p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prezydium.map((member, i) => (
            <FadeUp key={member.email} delay={i * 0.1}>
              <MemberCard
                initials={member.initials}
                name={member.name}
                role={member.role}
                email={member.email}
              />
            </FadeUp>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/zarzad" className="text-primary font-bold hover:underline text-sm">
            Cały Zarząd →
          </Link>
        </div>
      </div>
    </section>
  )
}
