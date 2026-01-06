import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Jetty Method',
  description: 'A software development methodology for building with Claude Code',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
