import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'
import { MemberCard } from '@/components/cards/MemberCard'
import { RzecznikForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Rzecznik Praw Studenta — SSUEW',
  description: 'Jakub Buchta, Rzecznik Praw Studenta UEW. Pomoc w interpretacji przepisów i wsparcie w trudnych sytuacjach.',
}

export default function RzecznikPage() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">
              Rzecznik Praw Studenta
            </h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              Rzecznik Praw Studenta wspiera studentów w interpretacji przepisów i jest
              reprezentantem studentów w kontakcie z odpowiednimi jednostkami
              administracyjnymi uczelni.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 max-w-3xl">
          <FadeUp>
            <MemberCard
              initials="JB"
              name="Jakub Buchta"
              role="Rzecznik Praw Studenta"
              email="rps@samorzad.ue.wroc.pl"
            />
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 max-w-3xl">
          <FadeUp>
            <h2 className="font-display text-display-lg text-ssuew-black mb-6">Czym się zajmuję</h2>
            <ul className="flex flex-col gap-3">
              {[
                'Pomoc w interpretacji przepisów i regulaminów uczelni.',
                'Wsparcie w sytuacjach niesprawiedliwości, gdy kontakt z dziekanatem, prodziekanem lub innymi jednostkami nie przyniósł rozwiązania.',
                'Konsultacje w trudnych przypadkach, dotyczących praw i obowiązków studenta.',
                'Wskazanie odpowiednich zasobów informacyjnych dostępnych na stronie Uczelni lub Samorządu Studentów.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[0.85rem] text-ssuew-gray-600 leading-relaxed">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary-light text-primary flex items-center justify-center text-[0.75rem] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 max-w-3xl">
          <FadeUp>
            <h2 className="font-display text-display-lg text-ssuew-black mb-4">Jak mogę Ci pomóc</h2>
            <p className="text-base text-ssuew-gray-600 leading-relaxed mb-6">
              Jeśli: nie wiesz, jak interpretować regulamin / nie udało Ci się rozwiązać
              sprawy w dziekanacie / masz wątpliwości co do swoich praw jako studenta —{' '}
              <strong className="text-ssuew-black">NAPISZ DO MNIE!</strong>
            </p>
            <div className="p-6 bg-ssuew-gray-100 rounded-lg border border-ssuew-gray-200 text-[0.85rem] text-ssuew-gray-600 leading-relaxed">
              <strong className="text-ssuew-black">Ważne:</strong> Zanim się skontaktujesz,
              zapoznaj się z{' '}
              <Link href="/infopacki" className="text-primary font-bold hover:text-primary-dark transition-colors">
                INFOPACKAMI
              </Link>
              {' '}oraz{' '}
              <a
                href="https://uew.pl/wp-content/uploads/2024/10/UCHWALA-SENATU-NR-R.0000.18.2024-Regulamin-Studiow.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold hover:text-primary-dark transition-colors"
              >
                REGULAMINEM STUDIÓW
              </a>
              .
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 max-w-2xl">
          <FadeUp>
            <h2 className="font-display text-display-lg text-ssuew-black mb-8">Skontaktuj się</h2>
            <RzecznikForm />
          </FadeUp>
        </div>
      </section>

      <section className="py-8 bg-white">
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
