'use client'

import { PortableText as PortableTextReact, PortableTextComponents } from '@portabletext/react'
import { BigQuote } from './blocks/BigQuote'
import { Divider } from './blocks/Divider'
import { MarginNote } from './blocks/MarginNote'
import { PainPoints } from './blocks/PainPoints'
import { Sketch } from './blocks/Sketch'
import { Highlight } from './blocks/Highlight'

const components: PortableTextComponents = {
  types: {
    bigQuote: ({ value }) => <BigQuote text={value.text} attribution={value.attribution} />,
    divider: ({ value }) => <Divider symbol={value.symbol} />,
    marginNote: ({ value }) => <MarginNote content={value.content} />,
    painPoints: ({ value }) => <PainPoints label={value.label} items={value.items} />,
    sketch: ({ value }) => <Sketch image={value.image} alt={value.alt} caption={value.caption} />,
  },
  marks: {
    highlight: ({ children, value }) => (
      <Highlight style={value?.style}>{children}</Highlight>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-8 mb-4 font-serif">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-6 mb-3 font-serif">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="leading-relaxed mb-4 font-serif">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
    ),
  },
}

interface PortableTextProps {
  value: unknown[]
}

export function PortableText({ value }: PortableTextProps) {
  if (!value || !Array.isArray(value)) {
    return null
  }

  return <PortableTextReact value={value} components={components} />
}
