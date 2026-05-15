'use client'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function LangToggle() {
  const { lang, setLang } = useT()
  return (
    <div className="flex items-center gap-1 text-[0.85rem] font-bold">
      <button
        onClick={() => setLang('pl')}
        className={cn(
          'transition-colors duration-200',
          lang === 'pl' ? 'text-primary' : 'text-ssuew-gray-600 hover:text-primary'
        )}
        aria-label="Przełącz na polski"
      >
        PL
      </button>
      <span className="text-ssuew-gray-200 select-none">|</span>
      <button
        onClick={() => setLang('en')}
        className={cn(
          'transition-colors duration-200',
          lang === 'en' ? 'text-primary' : 'text-ssuew-gray-600 hover:text-primary'
        )}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  )
}
