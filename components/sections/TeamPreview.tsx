import Link from 'next/link'
import { prezydium } from '@/data/zarzad'
import { MemberCard } from '@/components/cards/MemberCard'
import { FadeUp } from '@/components/ui/FadeUp'

export function TeamPreview() {
  return (
    <section className="py-20 md:py-14 bg-ssuew-gray-100">
      <div className="max-w-brand mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-display-lg text-ssuew-black mb-4">Prezydium</h2>
          <p className="text-base text-ssuew-gray-600 max-w-2xl mx-auto">Poznaj ludzi stojących za samorządem</p>
        </div>
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
          <Link href="/przewodniczacy-i-wiceprzewodniczacy" className="text-primary font-bold hover:underline">
            Cały zarząd →
          </Link>
        </div>
      </div>
    </section>
  )
}
