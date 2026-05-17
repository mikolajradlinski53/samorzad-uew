'use client'
import { useRef, type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function TiltCard({ children, className, style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`
    el.style.boxShadow = '0 16px 40px rgba(59,174,255,0.18)'
    el.style.borderColor = 'rgba(59,174,255,0.3)'
  }

  function onMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.boxShadow = ''
    el.style.borderColor = ''
  }

  return (
    <div
      ref={ref}
      className={cn('[transform-style:preserve-3d] transition-[transform,box-shadow,border-color] duration-200', className)}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}
