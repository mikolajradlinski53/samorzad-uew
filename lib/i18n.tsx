'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { pl } from './translations/pl'
import { en } from './translations/en'

export type Lang = 'pl' | 'en'
export type Translations = typeof pl

const translations: Record<Lang, Translations> = { pl, en }

interface LangContextValue {
  lang: Lang
  t: Translations
  setLang: (l: Lang) => void
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pl')

  useEffect(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'pl' || stored === 'en') {
      setLangState(stored)
    }
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useT() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useT must be used inside LangProvider')
  return ctx
}
