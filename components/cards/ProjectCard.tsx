import { cn } from '@/lib/utils'

export interface ProjectCardProps {
  title: string
  tag: string
  description: string
  className?: string
}

export function ProjectCard({ title, tag, description, className }: ProjectCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl border border-ssuew-gray-200 p-8',
      'hover:border-primary hover:shadow-[0_8px_40px_rgba(59,174,255,0.22)] hover:-translate-y-1 transition-all duration-300',
      className
    )}>
      <span className="inline-block text-[0.85rem] font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
        {tag}
      </span>
      <h3 className="font-display text-display-lg text-ssuew-black mt-4 mb-3">{title}</h3>
      <p className="text-[0.85rem] text-ssuew-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
