import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'
import { MemberGrid } from '@/components/sections/MemberGrid'
import { DocumentList, type DocumentItem } from '@/components/sections/DocumentList'
import { russ } from '@/data/zarzad'

export const metadata: Metadata = {
  title: 'Rada Uczelniana',
  description: 'RUSS — organ stanowiący i kontrolny Samorządu Studentów UEW. Skład rady i dokumenty.',
  openGraph: {
    title: 'Rada Uczelniana | SSUEW',
    description: 'RUSS — organ stanowiący i kontrolny Samorządu Studentów UEW. Skład rady i dokumenty.',
    url: 'https://samorzad.ue.wroc.pl/rada-uczelniana',
    type: 'website',
  },
}

const dokumenty: DocumentItem[] = [
  {
    label: 'Raporty z posiedzeń 2025/2026',
    description: 'Pełna lista raportów z posiedzeń Rady Uczelnianej',
    href: 'https://drive.google.com/drive/folders/1KkuFo2a3T6XeGVaitv2OSWxWzFBq_bMB',
  },
  {
    label: 'Uchwały 2025/2026',
    description: 'Uchwały podjęte przez Radę Uczelnianą w roku akademickim 2025/2026',
    href: 'https://drive.google.com/drive/folders/1N-cYKNK5R-xh4WZsJ7z0TljDrkh-yffE',
  },
  {
    label: 'Zarządzenia Przewodniczącej',
    description: 'Zarządzenia wydane przez Przewodniczącą Samorządu',
    href: 'https://drive.google.com/drive/folders/1euCpiW3ETlTGQ7igHmQ49wweytsg1LVn',
  },
]

export default function RadaUczelnnianaPage() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">
              Rada Uczelniana Samorządu Studentów
            </h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              RUSS jest organem stanowiącym i kontrolnym Samorządu Studentów UEW,
              składającym się z 15 studentów wybieranych w wyborach powszechnych.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="font-display text-display-lg text-ssuew-black mb-6">O Radzie Uczelnianej</h2>
                <p className="text-base text-ssuew-gray-600 leading-relaxed mb-4">
                  Rada Uczelniana jest organem stanowiącym i kontrolnym Samorządu Studentów UEW.
                  Składa się z przedstawicieli studentów wybranych w demokratycznych wyborach.
                </p>
                <p className="text-base text-ssuew-gray-600 leading-relaxed">
                  Do kompetencji Rady należy m.in. uchwalanie regulaminów, zatwierdzanie budżetu
                  Samorządu oraz sprawowanie nadzoru nad działalnością Zarządu.
                </p>
              </div>
              <div>
                <h2 className="font-display text-display-lg text-ssuew-black mb-6">Dokumenty</h2>
                <DocumentList items={dokumenty} />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-20 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h2 className="font-display text-display-lg text-ssuew-black mb-14">Skład Rady</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <MemberGrid members={russ} columns={4} />
          </FadeUp>
        </div>
      </section>

      <section className="py-8 bg-white">
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
