import { Counter } from '@/components/ui/Counter'
import { FadeUp } from '@/components/ui/FadeUp'

const stats = [
  { target: 6000, suffix: '+', label: 'Studentów UEW' },
  { target: 9,    suffix: '',  label: 'Projektów rocznie' },
  { target: 30,   suffix: '+', label: 'Lat działalności' },
  { target: 15,   suffix: '+', label: 'Partnerów' },
]

export function StatsSection() {
  return (
    <section className="py-20 md:py-14 bg-ssuew-gray-100">
      <div className="max-w-brand mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center gap-2 p-8 bg-white rounded-brand shadow-brand">
                <span className="font-display text-display-xl text-primary font-bold">
                  <Counter target={stat.target} suffix={stat.suffix} />
                </span>
                <span className="text-[0.85rem] text-ssuew-gray-600 font-bold uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
