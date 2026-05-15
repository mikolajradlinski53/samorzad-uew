import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'

export const metadata: Metadata = {
  title: 'Struktura Samorządu',
  description: 'Organy Samorządu Studentów UEW — Prezydium, Zarząd, RUSS, Komisja Rewizyjna.',
  openGraph: {
    title: 'Struktura Samorządu | SSUEW',
    description: 'Organy Samorządu Studentów UEW — Prezydium, Zarząd, RUSS, Komisja Rewizyjna.',
    url: 'https://samorzad.ue.wroc.pl/struktura-samorzadu',
    type: 'website',
  },
}

const organy = [
  { title: 'Przewodnicząca i Wiceprzewodniczący', href: '/przewodniczacy-i-wiceprzewodniczacy', desc: 'Odpowiedzialni za strategię i kluczowe decyzje.' },
  { title: 'Zarząd', href: '/zarzad', desc: 'Organ wykonawczy realizujący cele Samorządu.' },
  { title: 'Rada Uczelniana (RUSS)', href: '/rada-uczelniana', desc: 'Organ uchwałodawczy i kontrolny.' },
  { title: 'Komisja Rewizyjna', href: '/komisja-rewizyjna', desc: 'Organ kontrolny działalności studenckiej.' },
  { title: 'Studencka Komisja Wyborcza', href: '/studencka-komisja-wyborcza', desc: 'Nadzoruje przebieg wyborów.' },
]

export default function StrukturaPage() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">Struktura Samorządu</h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              Samorząd Studentów UEW działa przez szereg organów o różnych kompetencjach i zadaniach.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organy.map((o, i) => (
              <FadeUp key={o.href} delay={i * 0.1}>
                <Link href={o.href} className="block bg-white rounded-2xl border border-ssuew-gray-200 p-8 hover:border-primary hover:shadow-[0_8px_40px_rgba(59,174,255,0.22)] hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-display text-display-lg text-ssuew-black mb-3">{o.title}</h3>
                  <p className="text-[0.85rem] text-ssuew-gray-600">{o.desc}</p>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
