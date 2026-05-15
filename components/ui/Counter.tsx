'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

interface CounterProps {
  target: number
  suffix?: string
  className?: string
}

export function Counter({ target, suffix = '', className }: CounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 1800
    const start = Date.now()
    const raf = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // cubic ease-out
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [isInView, target])

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  )
}
