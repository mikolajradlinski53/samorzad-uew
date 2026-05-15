import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'

export const metadata: Metadata = {
  title: 'Mapa Kampusu — SSUEW',
  description: 'Mapa kampusu Uniwersytetu Ekonomicznego we Wrocławiu.',
}

export default function MapaKampusuPage() {
  return (
    <main>
      <section className="pt-36 pb-16 bg-gradient-to-br from-ssuew-gray-100 to-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <h1 className="font-display text-display-xl text-ssuew-black mb-4">Mapa Kampusu</h1>
            <p className="text-base text-ssuew-gray-600 max-w-2xl leading-relaxed">
              Kampus Uniwersytetu Ekonomicznego we Wrocławiu — ul. Komandorska 118-120.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeUp>
            <div className="rounded-2xl overflow-hidden border border-ssuew-gray-200 shadow-[0_4px_24px_rgba(59,174,255,0.12)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2503.9!2d17.0424!3d51.0880!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470fc27e6a5e3b3f%3A0x1234!2sUniwersytet+Ekonomiczny+we+Wroc%C5%82awiu!5e0!3m2!1spl!2spl!4v1"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa kampusu UEW"
              />
            </div>
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
