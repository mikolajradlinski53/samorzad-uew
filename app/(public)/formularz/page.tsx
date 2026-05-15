import type { Metadata } from 'next'
import { FadeUp } from '@/components/ui/FadeUp'
import { KontaktForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Formularz Kontaktowy',
  description: 'Skontaktuj się z Samorządem Studentów UEW.',
  openGraph: {
    title: 'Formularz Kontaktowy | SSUEW',
    description: 'Skontaktuj się z Samorządem Studentów UEW.',
    url: 'https://samorzad.ue.wroc.pl/formularz',
    type: 'website',
  },
}
export default function FormularzPage() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">Formularz kontaktowy</h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              Masz pytanie? Skontaktuj się z nami — odpiszemy najszybciej jak to możliwe.
            </p>
          </FadeUp>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 max-w-2xl">
          <FadeUp>
            <KontaktForm />
          </FadeUp>
        </div>
      </section>
    </main>
  )
}
