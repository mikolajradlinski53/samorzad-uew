import { FadeUp } from '@/components/ui/FadeUp'

export function AboutSection() {
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-brand mx-auto px-6">
        <FadeUp>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-display-lg mb-6" style={{ color: 'var(--text)' }}>
              O nas
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu to reprezentacja
              wszystkich studentów UEW. Działamy na rzecz społeczności akademickiej, dbamy
              o interesy studentów, współtworzymy życie uczelni oraz inicjujemy projekty
              edukacyjne, społeczne i integracyjne. Jesteśmy łącznikiem między studentami
              a władzami uczelni i realnie wpływamy na to, jak studiuje się na UEW.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
