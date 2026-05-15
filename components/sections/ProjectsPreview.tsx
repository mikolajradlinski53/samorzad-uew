import Link from 'next/link'
import { projekty } from '@/data/projekty'
import { ProjectCard } from '@/components/cards/ProjectCard'
import { FadeUp } from '@/components/ui/FadeUp'

export function ProjectsPreview() {
  const preview = projekty.slice(0, 4)
  return (
    <section className="py-20 md:py-14 bg-white">
      <div className="max-w-brand mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-display-lg text-ssuew-black mb-4">Nasze Projekty</h2>
          <p className="text-base text-ssuew-gray-600 max-w-2xl mx-auto">Inicjatywy, które tworzą społeczność akademicką</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {preview.map((projekt, i) => (
            <FadeUp key={projekt.title} delay={i * 0.1}>
              <ProjectCard title={projekt.title} tag={projekt.tag} description={projekt.description} />
            </FadeUp>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/nasze-projekty" className="text-primary font-bold hover:underline">
            Wszystkie projekty →
          </Link>
        </div>
      </div>
    </section>
  )
}
