import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { LenisProvider } from '@/components/layout/LenisProvider'
import { LangProvider } from '@/lib/i18n'
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
  title: {
    default: 'Samorząd Studentów UEW',
    template: '%s | SSUEW',
  },
  description: 'Samorząd Studentów Uniwersytetu Ekonomicznego we Wrocławiu. Działamy na rzecz studentów, wspieramy prawa studenckie i inspirujemy do nowych inicjatyw.',
  metadataBase: new URL('https://samorzad.ue.wroc.pl'),
  openGraph: {
    siteName: 'Samorząd Studentów UEW',
    locale: 'pl_PL',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Samorząd Studentów UEW' }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans text-ssuew-black bg-white antialiased">
        <LangProvider>
          <LenisProvider>
            <Navbar />
            <main id="main-content">
              {children}
            </main>
            <Footer />
            <ChatWidget />
          </LenisProvider>
        </LangProvider>
      </body>
    </html>
  )
}
