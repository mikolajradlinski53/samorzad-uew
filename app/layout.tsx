import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import 'lenis/dist/lenis.css'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Samorząd Studentów UEW',
  description: 'Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans text-ssuew-black bg-white antialiased">
        {children}
      </body>
    </html>
  )
}
