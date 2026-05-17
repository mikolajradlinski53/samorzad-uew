import { cn } from '@/lib/utils'

interface MemberCardProps {
  initials: string
  name: string
  role: string
  email: string
  description?: string
  className?: string
}

export function MemberCard({ initials, name, role, email, description, className }: MemberCardProps) {
  return (
    <div
      className={cn('flex flex-col sm:flex-row items-start gap-6 p-8 shadow-brand transition-colors duration-200 hover:border-primary/30', className)}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="shrink-0 w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-display text-display-xl font-bold">
        {initials}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>{name}</h3>
        <p className="text-[0.85rem] font-bold uppercase tracking-wide text-primary">{role}</p>
        <a
          href={`mailto:${email}`}
          className="text-[0.85rem] hover:text-primary transition-colors duration-200 mt-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {email}
        </a>
        {description && (
          <p className="text-[0.85rem] leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
