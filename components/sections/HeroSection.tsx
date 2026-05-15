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

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % subtitles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [shouldReduce])

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-ssuew-gray-100 via-white to-primary-light pt-[72px]">
      <div className="max-w-brand mx-auto px-6 py-20 flex flex-col items-center text-center gap-8">

        {/* H1 */}
        <h1 className="font-display text-display-xl text-ssuew-black max-w-4xl">
          SAMORZĄD STUDENTÓW UNIWERSYTETU EKONOMICZNEGO WE WROCŁAWIU
        </h1>

        {/* Rotating subtitle */}
        <div className="h-8 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="text-base font-bold text-primary text-center"
            >
              {subtitles[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Link
            href="/nasza-dzialalnosc"
            className="inline-flex items-center justify-center gap-2 font-bold rounded-full px-8 py-3.5 text-base bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-brand-hover transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Poznaj nasz samorząd
          </Link>
          <Link
            href="/dla-studenta"
            className="inline-flex items-center justify-center gap-2 font-bold rounded-full px-8 py-3.5 text-base border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Strefa Studenta
          </Link>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-3 mt-4">
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
                className="w-[40px] h-[40px] rounded-full border border-ssuew-gray-200 flex items-center justify-center text-ssuew-gray-600 hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
              >
                <Icon size={16} />
              </a>
            )
          })}
        </div>

      </div>
    </section>
  )
}
