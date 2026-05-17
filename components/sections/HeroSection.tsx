'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { FaTiktok, FaFacebook, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { socialLinks } from '@/data/social'

const subtitles = [
  'Działamy na rzecz studentów',
  'Wspieramy Was w walce o prawa studenckie',
  'Inspirujemy do podejmowania nowych inicjatyw',
]

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  tiktok:    FaTiktok,
  facebook:  FaFacebook,
  linkedin:  FaLinkedinIn,
  instagram: FaInstagram,
}

const stats = [
  { value: '6000+', label: 'Studentów' },
  { value: '9',     label: 'Projektów / rok' },
  { value: '30+',   label: 'Lat działalności' },
  { value: '15+',   label: 'Partnerów' },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [spotlight, setSpotlight] = useState(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) return
    const id = setInterval(() => setCurrentIndex(i => (i + 1) % subtitles.length), 3000)
    return () => clearInterval(id)
  }, [shouldReduce])

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setSpotlight(true)
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[72px]"
      style={{ background: 'var(--bg-page)' }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setSpotlight(false)}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(var(--dot-color) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          animation: shouldReduce ? 'none' : 'dots-drift 20s linear infinite',
        }}
      />

      {/* Gradient blobs */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 500, height: 500, top: -100, right: -100,
          background: 'radial-gradient(circle, rgba(59,174,255,0.14) 0%, transparent 65%)',
          animation: shouldReduce ? 'none' : 'blob-float 10s ease-in-out infinite',
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 350, height: 350, bottom: -80, left: -60,
          background: 'radial-gradient(circle, rgba(59,174,255,0.09) 0%, transparent 65%)',
          animation: shouldReduce ? 'none' : 'blob-float 14s ease-in-out infinite reverse',
        }}
      />

      {/* Cursor spotlight */}
      {spotlight && !shouldReduce && (
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 420, height: 420,
            background: 'radial-gradient(circle, rgba(59,174,255,0.09) 0%, transparent 70%)',
            left: mouse.x - 210,
            top: mouse.y - 210,
            transition: 'left 0.08s linear, top 0.08s linear',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-brand mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">

        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold tracking-[2px] uppercase text-primary">
            Samorząd Studentów UEW · Wrocław
          </span>
        </div>

        {/* H1 */}
        <h1
          className="font-display text-display-xl max-w-3xl"
          style={{ color: 'var(--text)' }}
        >
          Działamy dla{' '}
          <span className="text-primary">Ciebie</span>
        </h1>

        {/* Rotating subtitle */}
        <div className="h-7 flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="text-sm font-semibold"
              style={{ color: 'var(--text-muted)' }}
            >
              {subtitles[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/nasza-dzialalnosc"
            className="inline-flex items-center justify-center font-bold rounded-full px-8 py-3.5 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{
              background: 'linear-gradient(90deg, #3BAEFF, #1A8FE3, #3BAEFF)',
              backgroundSize: '200% 100%',
              animation: shouldReduce ? 'none' : 'shimmer-btn 3s ease-in-out infinite',
            }}
          >
            Poznaj samorząd ↗
          </Link>
          <Link
            href="/dla-studenta"
            className="inline-flex items-center justify-center font-bold rounded-full px-8 py-3.5 text-sm border-2 transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Strefa Studenta
          </Link>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => {
            const Icon = socialIcons[link.platform]
            if (!Icon) return null
            return (
              <a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-primary hover:border-primary hover:text-white"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              >
                <Icon size={14} />
              </a>
            )
          })}
        </div>

        {/* Stats bar */}
        <div
          className="flex flex-wrap justify-center gap-8 mt-4 pt-8 w-full max-w-2xl"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-display-lg text-primary leading-none">{s.value}</div>
              <div
                className="text-[10px] font-bold uppercase tracking-widest mt-1"
                style={{ color: 'var(--text-muted)' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
