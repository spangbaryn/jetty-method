'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getReadingProgress, type ReadingProgress } from '@/lib/reading-progress'

interface ResumeReadingButtonProps {
  /** List of valid chapter slugs - first one is used as intro for new users */
  chapterSlugs?: string[]
}

/**
 * Shows either:
 * - "Start" button for new users (no progress) → links to first chapter
 * - "Pick up where you left off" for returning users → resumes saved position
 */
export function ResumeReadingButton({ chapterSlugs = [] }: ResumeReadingButtonProps) {
  const [progress, setProgress] = useState<ReadingProgress | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedProgress = getReadingProgress()
    setProgress(savedProgress)
  }, [])

  // Don't render during SSR
  if (!mounted) {
    return null
  }

  // No chapters available - can't link anywhere
  if (chapterSlugs.length === 0) {
    return null
  }

  const firstChapter = chapterSlugs[0]
  const hasProgress = progress && chapterSlugs.includes(progress.chapter)

  // New user: show "Start" linking to first chapter
  if (!hasProgress) {
    return (
      <Link
        href={`/chapters/${firstChapter}`}
        data-testid="start-reading-button"
        className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
      >
        <span>Start</span>
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

  // Returning user: show "Pick up where you left off"
  const resumeUrl = `/chapters/${progress.chapter}#${progress.section}`

  return (
    <Link
      href={resumeUrl}
      data-testid="resume-reading-button"
      className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
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
