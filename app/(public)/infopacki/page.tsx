import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'
import { DocumentList, type DocumentItem } from '@/components/sections/DocumentList'
import { infopacki } from '@/data/infopacki'

export const metadata: Metadata = {
  title: 'Infopacki',
  description: 'Przewodniki dla studentów UEW: USOS, regulamin studiów, dyplomowanie i więcej.',
  openGraph: {
    title: 'Infopacki | SSUEW',
    description: 'Przewodniki dla studentów UEW: USOS, regulamin studiów, dyplomowanie i więcej.',
    url: 'https://samorzad.ue.wroc.pl/infopacki',
    type: 'website',
  },
}
export default function InfopackiPage() {
  const items: DocumentItem[] = infopacki.map((ip) => ({
    description: ip.title,
    href: ip.href,
  }))

  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">Infopacki</h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              W tym miejscu znajdziesz przygotowane dla studentów naszej uczelni infopacki.
              Pozwalają one na zrozumienie działania różnych regulaminów, podań oraz na
              swobodne poruszanie się w przestrzeni online na naszym uniwersytecie.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 max-w-3xl">
          <FadeUp>
            <DocumentList items={items} />
          </FadeUp>
        </div>
      </section>

      <section className="py-12 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.85rem] text-ssuew-gray-600">
            Jeżeli nie znalazłeś odpowiedzi na swoje pytanie zapraszamy do kontaktu!{' '}
            <Link href="/formularz" className="text-primary font-bold hover:text-primary-dark transition-colors">
              Napisz do nas →
            </Link>
          </p>
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
