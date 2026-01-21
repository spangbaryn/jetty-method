'use client'

import { useEffect, useRef } from 'react'
import {
  getReadingProgress,
  setReadingProgress,
  shouldUpdateProgress,
} from '@/lib/reading-progress'

interface ReadingProgressTrackerProps {
  chapterSlug: string
  sectionIds: string[]
  chapterOrder: string[]
}

/**
 * Tracks user's reading progress using IntersectionObserver.
 * Updates localStorage when user scrolls past sections.
 * Progress only moves forward - never regresses.
 */
export function ReadingProgressTracker({
  chapterSlug,
  sectionIds,
  chapterOrder,
}: ReadingProgressTrackerProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Create observer that fires when section is ~50% visible
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            const newSectionIndex = sectionIds.indexOf(sectionId)

            if (newSectionIndex === -1) return

            const currentProgress = getReadingProgress()

            if (!currentProgress) {
              // No progress yet - save this as first position
              setReadingProgress(chapterSlug, sectionId)
              return
            }

            // Calculate current section index (might be in a different chapter)
            const currentSectionIndex = currentProgress.chapter === chapterSlug
              ? sectionIds.indexOf(currentProgress.section)
              : -1 // If different chapter, treat current section as "before" this chapter

            // Only update if new position is further
            if (
              shouldUpdateProgress(
                currentSectionIndex,
                newSectionIndex,
                currentProgress.chapter,
                chapterSlug,
                chapterOrder
              )
            ) {
              setReadingProgress(chapterSlug, sectionId)
            }
          }
        })
      },
      {
        threshold: 0.5, // Fire when 50% of section is visible
        rootMargin: '0px',
      }
    )

    // Observe all sections
    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observerRef.current?.observe(element)
      }
    })

    // Cleanup
    return () => {
      observerRef.current?.disconnect()
    }
  }, [chapterSlug, sectionIds, chapterOrder])

  // This component doesn't render anything - it just tracks progress
  return null
}
