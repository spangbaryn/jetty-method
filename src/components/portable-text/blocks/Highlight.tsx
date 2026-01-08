import { ReactNode } from 'react'

interface HighlightProps {
  style?: 'yellow' | 'green' | 'blue'
  children: ReactNode
}

const highlightStyles = {
  yellow: 'bg-yellow-200',
  green: 'bg-green-200',
  blue: 'bg-blue-200',
}

export function Highlight({ style = 'yellow', children }: HighlightProps) {
  return (
    <mark
      className={`${highlightStyles[style]} px-0.5 rounded`}
      data-testid="highlight"
    >
      {children}
    </mark>
  )
}
