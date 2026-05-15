import type { Metadata } from 'next'
import Link from 'next/link'
import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard — Strefa Działacza SSUEW',
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/strefa-dzialacza')
  }

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-ssuew-gray-100 to-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-display text-display-xl text-ssuew-black mb-2">Dashboard</h1>
            <p className="text-[0.85rem] text-ssuew-gray-600">
              Zalogowany jako: <strong>{session.user?.email}</strong>
            </p>
          </div>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/strefa-dzialacza' })
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-ssuew-gray-200 text-ssuew-gray-600 text-[0.85rem] font-bold hover:border-red-400 hover:text-red-600 transition-all duration-200"
            >
              Wyloguj
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="https://cra-system.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-3 p-8 bg-white rounded-2xl border border-ssuew-gray-200 hover:border-primary hover:shadow-[0_8px_40px_rgba(59,174,255,0.22)] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="text-3xl">🗂️</span>
            <h3 className="font-display text-display-lg text-ssuew-black">CRA System</h3>
            <p className="text-[0.85rem] text-ssuew-gray-600">
              Centralny Rejestr Administracyjny — rezerwacje przestrzeni i wypożyczenia sprzętu.
            </p>
            <span className="text-[0.85rem] text-primary font-bold">Otwórz →</span>
          </a>

          <Link
            href="/strefa-dzialacza/lista-obecnosci"
            className="flex flex-col gap-3 p-8 bg-white rounded-2xl border border-ssuew-gray-200 hover:border-primary hover:shadow-[0_8px_40px_rgba(59,174,255,0.22)] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="text-3xl">✅</span>
            <h3 className="font-display text-display-lg text-ssuew-black">Lista Obecności</h3>
            <p className="text-[0.85rem] text-ssuew-gray-600">
              Zaznacz swoją obecność na spotkaniach Zarządu.
            </p>
            <span className="text-[0.85rem] text-primary font-bold">Otwórz →</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
