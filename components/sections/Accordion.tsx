'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItem {
  title: string
  content: string
}

interface AccordionProps {
  items: AccordionItem[]
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-ssuew-gray-200 border border-ssuew-gray-200 rounded-brand overflow-hidden">
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className={cn(
              'w-full flex items-center justify-between gap-4 px-6 py-5 text-left',
              'font-bold text-base text-ssuew-black',
              'hover:bg-ssuew-gray-100 transition-colors duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset'
            )}
            aria-expanded={openIndex === i}
          >
            <span>{item.title}</span>
            <ChevronDown
              size={20}
              className={cn(
                'shrink-0 text-primary transition-transform duration-300',
                openIndex === i && 'rotate-180'
              )}
            />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <p className="px-6 pb-5 pt-1 text-[0.85rem] text-ssuew-gray-600 leading-relaxed">
                  {item.content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
