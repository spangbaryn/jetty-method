'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getReadingProgress, type ReadingProgress } from '@/lib/reading-progress'

/**
 * Shows "Pick up where you left off" button on homepage
 * when user has reading progress saved in localStorage.
 */
export function ResumeReadingButton() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedProgress = getReadingProgress()
    setProgress(savedProgress)
  }, [])

  // Don't render anything during SSR or if no progress exists
  if (!mounted || !progress) {
    return null
  }

  const resumeUrl = `/chapters/${progress.chapter}#${progress.section}`

  return (
    <Link
      href={resumeUrl}
      data-testid="resume-reading-button"
      className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      <span>Pick up where you left off</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </Link>
  )
}
