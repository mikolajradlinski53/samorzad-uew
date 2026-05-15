import { TileCard } from '@/components/cards/TileCard'
import { tiles } from '@/data/student-zone'

export function TileGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      {tiles.map((tile) => (
        <TileCard
          key={tile.href}
          title={tile.title}
          iconName={tile.icon}
          href={tile.href}
        />
      ))}
    </div>
  )
}
