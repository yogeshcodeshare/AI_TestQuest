import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TestQuest AI - Gamified SDET Learning Platform',
  description: 'Learn automation testing, Playwright, Python, and CI/CD through daily gamified missions. Become an SDET with structured daily practice.',
  keywords: ['SDET', 'automation testing', 'Playwright', 'Python', 'QA learning', 'test automation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
