'use client'
import { ReactLenis } from 'lenis/react'

interface LenisProviderProps {
  children: React.ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
