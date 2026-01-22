import type { Metadata } from 'next'
import { Caveat } from 'next/font/google'
import Script from 'next/script'
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B17HYN8WZN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B17HYN8WZN');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
