import Link from 'next/link'
import { contactInfo } from '@/data/contact'

export function ContactSection() {
  return (
    <section className="py-20 md:py-14 bg-white">
      <div className="max-w-brand mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-display-lg text-ssuew-black mb-4">Kontakt</h2>
          <p className="text-base text-ssuew-gray-600 max-w-2xl mx-auto">Masz pytanie lub propozycję? Napisz do nas.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: address + email */}
          <div>
            <h3 className="font-bold text-base text-ssuew-black mb-2">Adres</h3>
            {contactInfo.addressLines.map((line) => (
              <p key={line} className="text-[0.85rem] text-ssuew-gray-600">{line}</p>
            ))}
            <h3 className="font-bold text-base text-ssuew-black mt-6 mb-2">Email</h3>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-[0.85rem] text-primary hover:underline"
            >
              {contactInfo.email}
            </a>
          </div>
          {/* Right: CTA card */}
          <div className="bg-primary-light rounded-brand p-8 flex flex-col gap-4">
            <h3 className="font-display text-display-lg text-ssuew-black">Masz pytanie?</h3>
            <p className="text-[0.85rem] text-ssuew-gray-600">Chętnie odpowiemy. Wypełnij formularz kontaktowy.</p>
            <Link
              href="/formularz"
              className="inline-flex items-center justify-center bg-primary text-white rounded-full px-8 py-3.5 font-bold hover:bg-primary-dark transition-colors duration-300 text-[0.85rem]"
            >
              Wyślij wiadomość
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
