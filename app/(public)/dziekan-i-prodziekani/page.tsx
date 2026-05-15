import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'

export const metadata: Metadata = {
  title: 'Dziekan i Prodziekani — SSUEW',
  description: 'Dziekan i Prodziekani na Uniwersytecie Ekonomicznym we Wrocławiu.',
}

export default function Page() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">Dziekan i Prodziekani</h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              Treść tej strony jest w przygotowaniu. Zapraszamy wkrótce.
            </p>
          </FadeUp>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
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
