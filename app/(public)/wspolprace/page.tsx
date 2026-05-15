import type { Metadata } from 'next'
import { FadeUp } from '@/components/ui/FadeUp'
import { MemberCard } from '@/components/cards/MemberCard'
import { PartnerGrid } from '@/components/sections/PartnerGrid'
import { partnerStrategiczny, partnerzy } from '@/data/partnerzy'
import { WspolpraceForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Współprace — SSUEW',
  description: 'Współprace i partnerzy Samorządu Studentów UEW. Skontaktuj się z nami.',
}

const dlaczego = [
  'bezpośredni kontakt ze studentami UEW',
  'możliwość promocji marki w środowisku akademickim',
  'wsparcie przy organizacji wydarzeń i inicjatyw studenckich',
  'doświadczenie organizacyjne Samorządu Studenckiego',
  'indywidualne podejście do każdej współpracy',
]

export default function WspolpracePage() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">Współprace</h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              Samorząd Studentów UEW współpracuje z firmami, instytucjami i organizacjami,
              które chcą budować relacje ze środowiskiem akademickim oraz aktywnie wspierać
              inicjatywy studenckie.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h2 className="font-display text-display-lg text-ssuew-black mb-8">Osoba kontaktowa</h2>
            <div className="max-w-sm">
              <MemberCard
                initials="KV"
                name="Karol Vogel"
                role="Członek Zarządu ds. Kontaktów Zewnętrznych"
                email="karol.vogel@samorzad.ue.wroc.pl"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h2 className="font-display text-display-lg text-ssuew-black mb-8">
              Dlaczego warto z nami współpracować?
            </h2>
            <ul className="flex flex-col gap-3 max-w-2xl">
              {dlaczego.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-base text-ssuew-gray-600">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[0.75rem] font-bold mt-0.5">
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
        <div className="max-w-[1200px] mx-auto px-6 max-w-2xl">
          <FadeUp>
            <h2 className="font-display text-display-lg text-ssuew-black mb-8">Formularz współpracy</h2>
            <WspolpraceForm />
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-ssuew-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h2 className="font-display text-display-lg text-ssuew-black mb-4">Partner Strategiczny</h2>
            <div className="mb-12">
              <PartnerGrid partners={[partnerStrategiczny]} className="grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 max-w-xs" />
            </div>
            <h2 className="font-display text-display-lg text-ssuew-black mb-8">Nasi Partnerzy</h2>
            <PartnerGrid partners={partnerzy} />
          </FadeUp>
        </div>
      </section>
    </main>
  )
}
