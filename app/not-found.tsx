import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Strona nie znaleziona | SSUEW',
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-white">
      <p className="text-8xl font-display font-bold text-ssuew-gray-200 select-none">404</p>
      <h1 className="font-display text-display-xl text-ssuew-black text-center">
        Strona nie znaleziona
      </h1>
      <p className="text-base text-ssuew-gray-600 text-center max-w-md">
        Strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold rounded-full px-8 py-3.5 text-base bg-primary text-white hover:bg-primary-dark transition-colors duration-200"
        >
          ← Strona główna
        </Link>
        <Link
          href="/dla-studenta"
          className="inline-flex items-center gap-2 font-bold rounded-full px-8 py-3.5 text-base border-2 border-ssuew-gray-200 text-ssuew-gray-600 hover:border-primary hover:text-primary transition-all duration-200"
        >
          Strefa Studenta
        </Link>
      </div>
    </main>
  )
}
