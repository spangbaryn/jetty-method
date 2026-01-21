import type { Metadata } from 'next'
import { Caveat } from 'next/font/google'
import './globals.css'

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Jetty Method',
  description: 'A software development methodology for building with Claude Code',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={caveat.variable}>
      <body>{children}</body>
    </html>
  )
}
