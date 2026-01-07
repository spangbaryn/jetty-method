import { ReactNode } from 'react'

interface BigQuoteProps {
  children: ReactNode
}

export function BigQuote({ children }: BigQuoteProps) {
  return (
    <blockquote className="big-quote font-caveat text-4xl text-center py-10 px-5 my-12 text-[#2c2c2c] relative" data-testid="big-quote">
      <span className="text-7xl text-[#ddd] absolute top-0 left-0">"</span>
      {children}
      <span className="text-7xl text-[#ddd] absolute -bottom-5 right-0">"</span>
    </blockquote>
  )
}
