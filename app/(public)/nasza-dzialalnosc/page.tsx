import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'

export const metadata: Metadata = {
  title: 'Nasza Działalność — SSUEW',
  description: 'Misja i działalność Samorządu Studentów Uniwersytetu Ekonomicznego we Wrocławiu.',
}

export default function NaszaDzialalnosc() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <p className="text-[0.85rem] font-bold text-primary uppercase tracking-widest mb-4">NASZA MISJA</p>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">
              Działamy, Wspieramy, Inspirujemy
            </h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              Działamy na rzecz studentów, wspieramy Was w walce o prawa studenckie oraz
              inspirujemy do podejmowania nowych inicjatyw.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 max-w-3xl">
          <FadeUp>
            <p className="text-base text-ssuew-gray-600 leading-relaxed mb-6">
              Ogromną rolę w naszych działaniach odgrywają realizacja pasji, samorozwój, a także
              kształtowanie postaw społecznych dzięki wykonywaniu zadań non-profit.
            </p>
            <p className="text-base text-ssuew-gray-600 leading-relaxed">
              Nadrzędnym celem działalności Samorządu jest stała pomoc i dbanie o dobro wszystkich
              studentów naszej Uczelni.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-12 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 flex gap-4 flex-wrap">
          <Link href="/struktura-samorzadu" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-[0.85rem] font-bold hover:bg-primary-dark transition-colors">
            Struktura Samorządu →
          </Link>
          <Link href="/nasze-projekty" className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-primary text-primary text-[0.85rem] font-bold hover:bg-primary hover:text-white transition-all">
            Nasze Projekty →
          </Link>
        </div>
      </section>
    </main>
  )
}
