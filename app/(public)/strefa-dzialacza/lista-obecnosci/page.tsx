'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { spotkania, type Spotkanie } from '@/data/spotkania'

const STORAGE_KEY = 'ssuew_obecnosc'

export default function ListaObecnosci() {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setChecked(new Set(JSON.parse(saved))) } catch {}
    }
  }, [])

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }

  function exportCSV() {
    const rows = ['Data,Tytuł,Obecność']
    spotkania.forEach(s => {
      rows.push(`${s.date},"${s.title}",${checked.has(s.id) ? 'TAK' : 'NIE'}`)
    })
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lista-obecnosci.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-ssuew-gray-100 to-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-display-xl text-ssuew-black">Lista Obecności</h1>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-[0.85rem] font-bold hover:bg-primary-dark transition-colors"
            >
              Pobierz CSV
            </button>
            <Link
              href="/strefa-dzialacza/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-ssuew-gray-200 text-ssuew-gray-600 text-[0.85rem] font-bold hover:border-primary hover:text-primary transition-all duration-200"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ssuew-gray-200 overflow-hidden">
          {spotkania.map((s: Spotkanie, i: number) => (
            <label
              key={s.id}
              className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-ssuew-gray-100 transition-colors ${i > 0 ? 'border-t border-ssuew-gray-200' : ''}`}
            >
              <input
                type="checkbox"
                checked={checked.has(s.id)}
                onChange={() => toggle(s.id)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-base font-bold text-ssuew-black">{s.title}</p>
                <p className="text-[0.85rem] text-ssuew-gray-600">{s.date}</p>
              </div>
              {checked.has(s.id) && (
                <span className="text-[0.85rem] font-bold text-green-600">Obecny/a ✓</span>
              )}
            </label>
          ))}
        </div>

        <p className="text-[0.85rem] text-ssuew-gray-600 mt-4 text-center">
          Zaznaczenia zapisywane lokalnie w przeglądarce.
        </p>
      </div>
    </main>
  )
}
