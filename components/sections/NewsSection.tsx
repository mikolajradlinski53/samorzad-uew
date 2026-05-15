import Link from 'next/link'

const news = [
  {
    slug: '#',
    tag: 'Ogłoszenie',
    date: 'Maj 2025',
    title: 'Wyniki wyborów do Zarządu SSUEW 2025',
    excerpt: 'Przedstawiamy skład nowo wybranego Zarządu Samorządu Studentów UEW na kadencję 2025/2026.',
  },
  {
    slug: '#',
    tag: 'Wydarzenie',
    date: 'Kwiecień 2025',
    title: 'ADAPCIAK 2025 — relacja',
    excerpt: 'Ponad 300 studentów wzięło udział w tegorocznym obozie adaptacyjnym. Dziękujemy za wspaniałą atmosferę!',
  },
  {
    slug: '#',
    tag: 'Projekt',
    date: 'Marzec 2025',
    title: 'TEDxUEW już w maju',
    excerpt: 'Zapraszamy na kolejną edycję konferencji TEDxUEW. Prelegenci, networking i inspirujące rozmowy.',
  },
  {
    slug: '#',
    tag: 'Informacja',
    date: 'Luty 2025',
    title: 'Zmiany w regulaminie studiów',
    excerpt: 'Zarząd SSUEW wypracował nowe zapisy regulaminowe chroniące prawa studentów. Szczegóły wewnątrz.',
  },
]

export function NewsSection() {
  return (
    <section className="py-20 md:py-14 bg-ssuew-gray-100">
      <div className="max-w-brand mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-display-lg text-ssuew-black mb-4">Aktualności</h2>
          <p className="text-base text-ssuew-gray-600 max-w-2xl mx-auto">Bądź na bieżąco z życiem samorządu</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {news.map((item) => (
            <article
              key={item.title}
              className="bg-white rounded-2xl border border-ssuew-gray-200 p-6 hover:shadow-brand-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block text-[0.85rem] font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
                  {item.tag}
                </span>
                <span className="text-sm text-ssuew-gray-600">{item.date}</span>
              </div>
              <h3 className="font-display text-display-lg text-ssuew-black mb-3">{item.title}</h3>
              <p className="text-sm text-ssuew-gray-600 leading-relaxed mb-4">{item.excerpt}</p>
              {/* TODO: link to /aktualnosci/[slug] once news route is built */}
              <Link href={item.slug} className="text-[0.85rem] font-bold text-primary hover:underline">
                Czytaj więcej
              </Link>
            </article>
          ))}
        </div>
        <div className="text-center mt-10">
          {/* TODO: update to /aktualnosci once that Next.js route exists */}
          <Link href="#" className="text-primary font-bold hover:underline">
            Wszystkie aktualności →
          </Link>
        </div>
      </div>
    </section>
  )
}
