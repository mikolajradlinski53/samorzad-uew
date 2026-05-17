'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { navItems } from '@/data/navigation'
import { cn } from '@/lib/utils'
import { LangToggle } from '@/components/layout/LangToggle'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenSubmenu(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isActive = (href: string) => pathname === href

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:text-primary focus:font-bold"
      >
        Przejdź do treści
      </a>
      <nav
        aria-label="Główna nawigacja"
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)]'
            : 'bg-transparent'
        )}
        style={scrolled ? { background: 'color-mix(in srgb, var(--bg-page) 85%, transparent)' } : undefined}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo + wordmark */}
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            <Image
              src="/assets/logos/logo.png"
              alt="Logo Samorządu Studentów UEW"
              width={40}
              height={40}
              priority
            />
            <span className="font-sans font-bold text-base" style={{ color: 'var(--text)' }}>Samorząd UEW</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) =>
              item.highlight ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-primary text-white rounded-full px-5 py-2 text-[0.85rem] font-bold hover:bg-primary-dark transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ) : item.children ? (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    style={{ color: isActive(item.href) ? undefined : 'var(--text)' }}
                    className={cn(
                      'font-sans text-base hover:text-primary transition-colors duration-300 flex items-center gap-1 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded focus-visible:text-primary',
                      isActive(item.href) && 'text-primary font-bold'
                    )}
                  >
                    {item.label}
                    <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                  </Link>
                  <div className="absolute top-full left-0 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto shadow-[0_4px_24px_rgba(59,174,255,0.12)] rounded-lg min-w-48 py-2" style={{ background: 'var(--bg-card)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border)' }}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        style={{ color: isActive(child.href) ? undefined : 'var(--text)' }}
                        className={cn(
                          'block px-4 py-2 text-[0.85rem] hover:text-primary hover:bg-[var(--bg-page)] transition-colors duration-200',
                          isActive(child.href) && 'text-primary font-bold'
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ color: isActive(item.href) ? undefined : 'var(--text)' }}
                  className={cn(
                    'font-sans text-base hover:text-primary transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded focus-visible:text-primary',
                    isActive(item.href) && 'text-primary font-bold'
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
            <LangToggle />
            <ThemeToggle />
          </div>

          {/* Hamburger button */}
          <button
            className="md:hidden w-10 h-10 flex flex-col gap-1 items-center justify-center p-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            aria-label={mobileOpen ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className={cn('block w-6 h-px rounded-sm transition-all duration-300', mobileOpen && 'rotate-45 translate-y-[5px]')} style={{ background: 'var(--text)' }} />
            <span className={cn('block w-6 h-px rounded-sm transition-all duration-300', mobileOpen && 'opacity-0')} style={{ background: 'var(--text)' }} />
            <span className={cn('block w-6 h-px rounded-sm transition-all duration-300', mobileOpen && '-rotate-45 -translate-y-[5px]')} style={{ background: 'var(--text)' }} />
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              role="dialog"
              aria-label="Menu mobilne"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
              style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {navItems.map((item) =>
                  item.highlight ? (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block w-full text-center rounded-full bg-primary text-white px-5 py-3 font-bold text-base hover:bg-primary-dark transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 mt-2"
                    >
                      {item.label}
                    </Link>
                  ) : item.children ? (
                    <div key={item.href} style={{ borderBottom: '1px solid var(--border)' }}>
                      <button
                        style={{ color: 'var(--text)' }}
                        className="w-full flex items-center justify-between py-2 text-base font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                        onClick={() => setOpenSubmenu((prev) => prev === item.label ? null : item.label)}
                        aria-expanded={openSubmenu === item.label}
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className={cn('transition-transform duration-200', openSubmenu === item.label && 'rotate-180')}
                        />
                      </button>
                      <AnimatePresence>
                        {openSubmenu === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pb-2 flex flex-col">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  style={{ color: 'var(--text-muted)' }}
                                  className="pl-4 text-[0.85rem] py-2 hover:text-primary transition-colors duration-200"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)' }}
                      className="text-base font-bold py-2 block hover:text-primary transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  )
                )}
                <div className="pt-2 flex items-center gap-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <LangToggle />
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
