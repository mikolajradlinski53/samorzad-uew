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
    <div className={cn(
      'flex flex-col sm:flex-row items-start gap-6 p-8',
      'bg-white rounded-brand border border-ssuew-gray-200 shadow-brand',
      className
    )}>
      {/* Avatar with initials */}
      <div className="shrink-0 w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-display text-display-xl font-bold">
        {initials}
      </div>
      {/* Info */}
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-base text-ssuew-black">{name}</h3>
        <p className="text-[0.85rem] text-primary font-bold uppercase tracking-wide">{role}</p>
        <a
          href={`mailto:${email}`}
          className="text-[0.85rem] text-ssuew-gray-600 hover:text-primary transition-colors duration-200 mt-1"
        >
          {email}
        </a>
        {description && (
          <p className="text-[0.85rem] text-ssuew-gray-600 leading-relaxed mt-3">{description}</p>
        )}
      </div>
    </div>
  )
}
