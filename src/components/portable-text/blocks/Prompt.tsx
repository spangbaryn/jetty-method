'use client'

import { useState } from 'react'

interface PromptProps {
  text: string
}

export function Prompt({ text }: PromptProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="my-6 bg-gray-50 rounded-lg p-4 border border-gray-200"
      data-testid="prompt-component"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          data-testid="prompt-label"
        >
          PROMPT
        </span>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          data-testid="prompt-copy-button"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <div
        className="bg-white border border-gray-200 rounded p-3 font-mono text-sm whitespace-pre-wrap"
        data-testid="prompt-text"
      >
        {text}
      </div>
    </div>
  )
}
