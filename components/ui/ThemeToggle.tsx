'use client'
import { useTheme } from '@/lib/theme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors duration-200 hover:text-primary"
      style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
      aria-label={theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
