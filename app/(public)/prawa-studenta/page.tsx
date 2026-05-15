import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'
import { Accordion } from '@/components/sections/Accordion'
import { prawaNr } from '@/data/prawa-studenta'

export const metadata: Metadata = {
  title: 'Prawa Studenta',
  description: 'Poznaj swoje prawa jako student UEW. Regulacje wynikające z Ustawy 2.0.',
  openGraph: {
    title: 'Prawa Studenta | SSUEW',
    description: 'Poznaj swoje prawa jako student UEW. Regulacje wynikające z Ustawy 2.0.',
    url: 'https://samorzad.ue.wroc.pl/prawa-studenta',
    type: 'website',
  },
}
export default function PrawaStudentaPage() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">
              Prawa Studenta
            </h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              Dzięki Ustawie 2.0 (Konstytucja dla Nauki) każdy student ma prawo do
              przeszkolenia w zakresie swoich praw i obowiązków. Za organizację i prowadzenie
              tego szkolenia odpowiedzialny jest samorząd studencki, we współpracy z
              Parlamentem Studentów Rzeczypospolitej Polskiej.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 max-w-3xl">
          <FadeUp>
            <Accordion items={prawaNr} />
          </FadeUp>
        </div>
      </section>

      <section className="py-12 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href="https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20180001668/U/D20181668Lj.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.85rem] text-primary hover:text-primary-dark font-bold transition-colors duration-200"
          >
            Ustawa PSW — Prawo o szkolnictwie wyższym i nauce →
          </a>
          <Link
            href="/dla-studenta"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-ssuew-gray-200 text-ssuew-gray-600 text-[0.85rem] font-bold hover:border-primary hover:text-primary transition-all duration-200"
          >
            ← WRÓĆ
          </Link>
        </div>
      </section>
    </main>
  )
}
