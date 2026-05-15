import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'
import { DocumentList } from '@/components/sections/DocumentList'
import { regulacje } from '@/data/regulacje'

export const metadata: Metadata = {
  title: 'Regulacje Wewnętrzne — SSUEW',
  description: 'Regulaminy i dokumenty wewnętrzne Samorządu Studentów UEW.',
}

export default function RegulacjeWewnetrzePage() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">Regulacje Wewnętrzne</h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              Poniżej znajdziesz najważniejsze regulacje wewnętrzne, na podstawie których
              funkcjonuje Samorząd Studentów UEW.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 max-w-3xl">
          <FadeUp>
            <DocumentList items={regulacje} />
          </FadeUp>
        </div>
      </section>

      <section className="py-8 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <Link
            href="/nasza-dzialalnosc"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-ssuew-gray-200 text-ssuew-gray-600 text-[0.85rem] font-bold hover:border-primary hover:text-primary transition-all duration-200"
          >
            ← WRÓĆ
          </Link>
        </div>
      </section>
    </main>
  )
}
