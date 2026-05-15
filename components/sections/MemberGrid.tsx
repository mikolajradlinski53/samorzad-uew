import { MemberCard } from '@/components/cards/MemberCard'
import { cn } from '@/lib/utils'
import type { Member } from '@/data/zarzad'

interface MemberGridProps {
  members: Member[]
  columns?: 2 | 3 | 4
  className?: string
}

export function MemberGrid({ members, columns = 3, className }: MemberGridProps) {
  const colClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <div className={cn('grid grid-cols-1 gap-6', colClass, className)}>
      {members.map((m) => (
        <MemberCard
          key={m.email}
          initials={m.initials}
          name={m.name}
          role={m.role}
          email={m.email}
        />
      ))}
    </div>
  )
}
