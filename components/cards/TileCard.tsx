import Link from 'next/link'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'

interface TileCardProps {
  title: string
  iconName: string
  href: string
}

export function TileCard({ title, iconName, href }: TileCardProps) {
  // Dynamically select Lucide icon by name
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[iconName]

  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-8',
        'bg-white rounded-brand border border-ssuew-gray-200 shadow-brand',
        'hover:border-primary hover:shadow-brand-hover hover:-translate-y-1',
        'transition-all duration-300 text-center group'
      )}
    >
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {Icon ? <Icon size={28} /> : null}
      </div>
      <span className="text-[0.85rem] font-bold text-ssuew-black tracking-wide uppercase leading-tight">
        {title}
      </span>
    </Link>
  )
}
