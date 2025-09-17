import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Step by Step Family Law - Navigate Family Law with Confidence',
  description: 'Get practical, step-by-step guidance to represent yourself in Australian family law matters. Expert-reviewed content, interactive tools, and community support.',
  keywords: 'family law, self representation, divorce, child custody, property settlement, Australia, legal guidance',
  authors: [{ name: 'Step by Step Family Law' }],
  openGraph: {
    title: 'Step by Step Family Law - Navigate Family Law with Confidence',
    description: 'Get practical, step-by-step guidance to represent yourself in Australian family law matters.',
    type: 'website',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Step by Step Family Law - Navigate Family Law with Confidence',
    description: 'Get practical, step-by-step guidance to represent yourself in Australian family law matters.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-white`}>
        <div className="flex min-h-full flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}