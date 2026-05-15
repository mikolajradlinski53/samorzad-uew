import { cn } from '@/lib/utils'
import type { Partner } from '@/data/partnerzy'

interface PartnerGridProps {
  partners: Partner[]
  className?: string
}

export function PartnerGrid({ partners, className }: PartnerGridProps) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {partners.map((p) => (
        <div
          key={p.name}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-ssuew-gray-200 bg-white p-6 text-center hover:border-primary hover:shadow-[0_4px_24px_rgba(59,174,255,0.12)] transition-all duration-300"
        >
          {/* TODO: replace with <Image> when logos available */}
          <span className="font-bold text-base text-ssuew-black">{p.name}</span>
          {p.tier === 'strategic' && (
            <span className="text-[0.85rem] font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
              Partner Strategiczny
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
