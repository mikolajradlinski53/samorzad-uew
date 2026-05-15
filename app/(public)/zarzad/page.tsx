import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'
import { MemberGrid } from '@/components/sections/MemberGrid'
import { zarzad } from '@/data/zarzad'

export const metadata: Metadata = {
  title: 'Zarząd',
  description: 'Zarząd Samorządu Studentów UEW — poznaj osoby zarządzające organizacją.',
  openGraph: {
    title: 'Zarząd | SSUEW',
    description: 'Zarząd Samorządu Studentów UEW — poznaj osoby zarządzające organizacją.',
    url: 'https://samorzad.ue.wroc.pl/zarzad',
    type: 'website',
  },
}
export default function ZarzadPage() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">Zarząd</h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              Zarząd odpowiada za sprawne działanie Samorządu Studenckiego oraz realizację jego
              zadań w codziennej pracy. W jego skład wchodzi 9 osób — każda odpowiada za inny
              obszar działalności Samorządu.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <MemberGrid members={zarzad} columns={3} />
          </FadeUp>
        </div>
      </section>

      <section className="py-8 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <Link
            href="/struktura-samorzadu"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-ssuew-gray-200 text-ssuew-gray-600 text-[0.85rem] font-bold hover:border-primary hover:text-primary transition-all duration-200"
          >
            ← WRÓĆ
          </Link>
        </div>
      </section>
    </main>
  )
}
