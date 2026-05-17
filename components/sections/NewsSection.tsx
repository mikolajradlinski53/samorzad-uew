import Link from 'next/link'
import { FadeUp } from '@/components/ui/FadeUp'
import { TiltCard } from '@/components/ui/TiltCard'

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Ogłoszenie: { bg: 'rgba(200,100,255,0.12)', color: '#9b45d4' },
  Wydarzenie:  { bg: 'rgba(59,174,255,0.12)',  color: '#3BAEFF' },
  Projekt:     { bg: 'rgba(255,180,0,0.12)',    color: '#e6a800' },
  Informacja:  { bg: 'rgba(100,220,130,0.12)',  color: '#2e8b57' },
}

const news = [
  { slug: '#', tag: 'Ogłoszenie', date: 'Maj 2025',     title: 'Wyniki wyborów do Zarządu SSUEW 2025',   excerpt: 'Przedstawiamy skład nowo wybranego Zarządu Samorządu Studentów UEW na kadencję 2025/2026.' },
  { slug: '#', tag: 'Wydarzenie', date: 'Kwiecień 2025', title: 'ADAPCIAK 2025 — relacja',                excerpt: 'Ponad 300 studentów wzięło udział w tegorocznym obozie adaptacyjnym. Dziękujemy za wspaniałą atmosferę!' },
  { slug: '#', tag: 'Projekt',    date: 'Marzec 2025',   title: 'TEDxUEW już w maju',                    excerpt: 'Zapraszamy na kolejną edycję konferencji TEDxUEW. Prelegenci, networking i inspirujące rozmowy.' },
  { slug: '#', tag: 'Informacja', date: 'Luty 2025',     title: 'Zmiany w regulaminie studiów',           excerpt: 'Zarząd SSUEW wypracował nowe zapisy regulaminowe chroniące prawa studentów. Szczegóły wewnątrz.' },
]

export function NewsSection() {
  return (
    <section className="py-20 md:py-14" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-brand mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-block text-[10px] font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-3">
              aktualności
            </span>
            <h2 className="font-display text-display-lg mb-2" style={{ color: 'var(--text)' }}>
              Co słychać w SSUEW?
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Bądź na bieżąco z życiem samorządu</p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {news.map((item, i) => {
            const tagColor = TAG_COLORS[item.tag] ?? TAG_COLORS['Informacja']
            return (
              <FadeUp key={item.title} delay={i * 0.1}>
                <TiltCard
                  className="rounded-2xl border p-6"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-[0.8rem] font-bold rounded-full px-3 py-1"
                      style={{ background: tagColor.bg, color: tagColor.color }}
                    >
                      {item.tag}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.date}</span>
                  </div>
                  <h3 className="font-bold text-base mb-2 leading-snug" style={{ color: 'var(--text)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                    {item.excerpt}
                  </p>
                  <Link href={item.slug} className="text-xs font-bold text-primary hover:underline">
                    Czytaj więcej →
                  </Link>
                </TiltCard>
              </FadeUp>
            )
          })}
        </div>
        <div className="text-center mt-10">
          <Link href="#" className="text-primary font-bold hover:underline text-sm">
            Wszystkie aktualności →
          </Link>
        </div>
      </div>
    </section>
  )
}
