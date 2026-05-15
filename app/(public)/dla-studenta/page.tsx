import type { Metadata } from 'next'
import { FadeUp } from '@/components/ui/FadeUp'
import { TileGrid } from '@/components/sections/TileGrid'
import { QuickLinks } from '@/components/sections/QuickLinks'

export const metadata: Metadata = {
  title: 'Strefa Studenta — SSUEW',
  description: 'Wszystkie ważne informacje dla studentów UEW: prawa, stypendia, mapa kampusu, infopacki i więcej.',
}

export default function DlaStudentaPage() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">
              Strefa Studenta
            </h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              W tym miejscu znajdziesz wszystkie najważniejsze informacje, jakie mogą Ci się
              przydać w codziennym życiu na UEW. Kliknij w poniższe kafelki, żeby przenieść
              się do właściwej strony.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp delay={0.1}>
            <TileGrid />
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h2 className="font-display text-display-lg text-ssuew-black text-center mb-10">
              Szybkie linki
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <QuickLinks />
          </FadeUp>
        </div>
      </section>
    </main>
  )
}
