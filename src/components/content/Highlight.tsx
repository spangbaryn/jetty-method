import { ReactNode } from 'react'

interface HighlightProps {
  children: ReactNode
}

export function Highlight({ children }: HighlightProps) {
  return (
    <span
      className="highlight px-1"
      data-testid="highlight"
      style={{ background: 'linear-gradient(180deg, transparent 60%, #fff3a8 60%)' }}
    >
      {children}
    </span>
  )
}
