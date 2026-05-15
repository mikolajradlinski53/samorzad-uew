import { cn } from '@/lib/utils'

export interface DocumentItem {
  label?: string
  description: string
  href: string
}

interface DocumentListProps {
  items: DocumentItem[]
  className?: string
}

export function DocumentList({ items, className }: DocumentListProps) {
  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          {/* File icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 mt-0.5 text-primary"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.85rem] text-ssuew-black hover:text-primary transition-colors duration-200"
          >
            {item.label && (
              <span className="font-bold mr-2">{item.label}</span>
            )}
            {item.description}
          </a>
        </li>
      ))}
    </ul>
  )
}
