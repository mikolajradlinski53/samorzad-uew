import Link from 'next/link'
import { contactInfo } from '@/data/contact'

export function ContactSection() {
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-brand mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-3">
            kontakt
          </span>
          <h2 className="font-display text-display-lg mb-2" style={{ color: 'var(--text)' }}>
            Skontaktuj się z nami
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Masz pytanie lub propozycję? Napisz do nas.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto">
          <div
            className="rounded-2xl border p-8"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text)' }}>Adres</h3>
            {contactInfo.addressLines.map((line) => (
              <p key={line} className="text-sm" style={{ color: 'var(--text-muted)' }}>{line}</p>
            ))}
            <h3 className="font-bold text-base mt-6 mb-2" style={{ color: 'var(--text)' }}>Email</h3>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-sm text-primary hover:underline"
            >
              {contactInfo.email}
            </a>
          </div>
          <div className="rounded-2xl p-8 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #3BAEFF, #1A8FE3)' }}>
            <div>
              <h3 className="font-display text-display-lg text-white mb-3">Masz pytanie?</h3>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                Napisz do nas przez formularz — odpiszemy tak szybko jak to możliwe.
              </p>
            </div>
            <Link
              href="/formularz"
              className="inline-flex items-center justify-center font-bold rounded-full px-6 py-3 text-sm bg-white text-primary hover:bg-white/90 transition-colors duration-200 self-start"
            >
              Wyślij wiadomość ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
