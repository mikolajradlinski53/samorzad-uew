import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { LenisProvider } from '@/components/layout/LenisProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/chatbot/ChatWidget'
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
        <LenisProvider>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
          <ChatWidget />
        </LenisProvider>
      </body>
    </html>
  )
}
