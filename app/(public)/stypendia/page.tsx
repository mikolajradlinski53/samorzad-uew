import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'
import { DocumentList, type DocumentItem } from '@/components/sections/DocumentList'
import { stypendiaTiles, stypendiaAttachments } from '@/data/stypendia'

export const metadata: Metadata = {
  title: 'Stypendia — SSUEW',
  description: 'Informacje o stypendiach dla studentów UEW: socjalne, rektora, dla niepełnosprawnych, zapomogi. Dokumenty do pobrania.',
}

export default function StypendiaPage() {
  const attachmentItems: DocumentItem[] = stypendiaAttachments.map((att) => ({
    label: att.number,
    description: att.description,
    href: att.href,
  }))

  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">Stypendia</h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              W tym miejscu znajdziesz kluczowe informacje dotyczące aktualności stypendiów
              a także wszystkie niezbędne dokumenty.
            </p>
            <a
              href="https://uew.pl/kandydaci/wsparcie-finansowe-dla-studentow/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-[0.85rem] text-primary font-bold hover:text-primary-dark transition-colors"
            >
              Aktualności stypendialne na uew.pl →
            </a>
          </FadeUp>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 max-w-3xl">
          <FadeUp>
            <p className="text-base text-ssuew-gray-600 leading-relaxed">
              Podczas studiów możesz skorzystać z różnych form wsparcia finansowego
              oferowanych przez uczelnię. Obejmują one zarówno świadczenia dla studentów
              znajdujących się w trudniejszej sytuacji materialnej, jak i stypendia
              przyznawane za bardzo dobre wyniki w nauce oraz osiągnięcia naukowe,
              sportowe lub artystyczne.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h2 className="font-display text-display-lg text-ssuew-black mb-8 text-center">
              Rodzaje stypendiów
            </h2>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stypendiaTiles.map((tile, i) => (
              <FadeUp key={tile.href} delay={i * 0.1}>
                <Link
                  href={tile.href}
                  className="flex flex-col items-center justify-center gap-3 p-8 bg-white rounded-2xl border border-ssuew-gray-200 shadow-[0_4px_24px_rgba(59,174,255,0.12)] hover:border-primary hover:shadow-[0_8px_40px_rgba(59,174,255,0.22)] hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  <span className="text-[0.85rem] font-bold text-ssuew-black tracking-wide uppercase">
                    {tile.title}
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 max-w-3xl">
          <FadeUp>
            <h2 className="font-display text-display-lg text-ssuew-black mb-8">
              Dokumenty do pobrania
            </h2>
            <DocumentList items={attachmentItems} />
          </FadeUp>
        </div>
      </section>

      <section className="py-8 bg-ssuew-gray-100">
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
