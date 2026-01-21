'use client'

/**
 * Reading Progress Store
 *
 * Tracks user's furthest read position across chapters/sections
 * using localStorage. Progress only moves forward - never regresses.
 */

const STORAGE_KEY = 'jetty-reading-progress'

export interface ReadingProgress {
  chapter: string
  section: string
}

/**
 * Get current reading progress from localStorage
 * Gracefully handles corrupted data and localStorage unavailability
 */
export function getReadingProgress(): ReadingProgress | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    try {
      const parsed = JSON.parse(stored)
      if (parsed.chapter && parsed.section) {
        return parsed as ReadingProgress
      }
      // Invalid structure - clear corrupted data
      clearReadingProgress()
      return null
    } catch {
      // Corrupted JSON - clear it and return null
      clearReadingProgress()
      return null
    }
  } catch {
    // localStorage unavailable (private browsing, etc.) - fail silently
    return null
  }
}

/**
 * Save reading progress to localStorage
 * Fails silently if localStorage is unavailable
 */
export function setReadingProgress(chapter: string, section: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ chapter, section }))
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.) - fail silently
  }
}

/**
 * Determine if we should update progress based on section order
 * Returns true only if newSection is "further" than current progress
 *
 * @param currentSectionIndex - Index of currently saved section in the chapter
 * @param newSectionIndex - Index of the section user just scrolled past
 * @param currentChapter - Currently saved chapter slug
 * @param newChapter - Chapter user is currently reading
 * @param chapterOrder - Ordered list of chapter slugs (for cross-chapter comparison)
 */
export function shouldUpdateProgress(
  currentSectionIndex: number,
  newSectionIndex: number,
  currentChapter: string,
  newChapter: string,
  chapterOrder: string[]
): boolean {
  const currentChapterIndex = chapterOrder.indexOf(currentChapter)
  const newChapterIndex = chapterOrder.indexOf(newChapter)

  // If new chapter is later in the book, always update
  if (newChapterIndex > currentChapterIndex) {
    return true
  }

  // If same chapter, only update if section is further
  if (newChapterIndex === currentChapterIndex) {
    return newSectionIndex > currentSectionIndex
  }

  // New chapter is earlier - don't update (would regress)
  return false
}

/**
 * Clear reading progress (for testing or user reset)
 * Fails silently if localStorage is unavailable
 */
export function clearReadingProgress(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable - fail silently
  }
}
