import { cn } from '@/lib/utils'

export interface ProjectCardProps {
  title: string
  tag: string
  description: string
  className?: string
}

export function ProjectCard({ title, tag, description, className }: ProjectCardProps) {
  return (
    <div
      className={cn('rounded-2xl border p-8 transition-colors duration-200 hover:border-primary/40', className)}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <span className="inline-block text-[0.85rem] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
        {tag}
      </span>
      <h3 className="font-display text-display-lg mt-4 mb-3" style={{ color: 'var(--text)' }}>
        {title}
      </h3>
      <p className="text-[0.85rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>
    </div>
  )
}
